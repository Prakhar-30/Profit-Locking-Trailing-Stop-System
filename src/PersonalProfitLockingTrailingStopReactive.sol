// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.0;

import "../lib/reactive-lib/src/interfaces/IReactive.sol";
import "../lib/reactive-lib/src/abstract-base/AbstractReactive.sol";
import "../lib/openzeppelin-contracts/contracts/utils/math/Math.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PersonalProfitLockingTrailingStopReactive
 * @notice Monitors price, triggers profit locks at milestones and hard stops
 * @dev Tracks milestones and hard stop separately
 */
contract PersonalProfitLockingTrailingStopReactive is IReactive, AbstractReactive {
    // Events
    event PositionTracked(
        address indexed pair,
        uint256 indexed positionId,
        uint256 entryPrice,
        uint256 hardStopPrice,
        uint256 firstMilestone
    );

    event PositionUntracked(address indexed pair, uint256 indexed positionId);
    event PairSubscribed(address indexed pair);
    event PairUnsubscribed(address indexed pair);

    event MilestoneReached(
        uint256 indexed positionId,
        uint256 currentPrice,
        uint256 milestonePrice,
        uint256 nextMilestone
    );

    event HardStopHit(
        uint256 indexed positionId,
        uint256 currentPrice,
        uint256 hardStopPrice
    );

    event ProcessingError(string reason, uint256 positionId);

    // Constants
    uint256 private constant SEPOLIA_CHAIN_ID = 11155111;
    uint256 private constant REACTIVE_CHAIN_ID = 5318007;
    uint256 private constant UNISWAP_V2_SYNC_TOPIC_0 = 0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1;

    // TODO: Calculate actual topic0 hashes for these events
    uint256 private constant POSITION_CREATED_TOPIC_0 = 0x1111111111111111111111111111111111111111111111111111111111111111;
    uint256 private constant POSITION_CANCELLED_TOPIC_0 = 0x2222222222222222222222222222222222222222222222222222222222222222;
    uint256 private constant POSITION_CLOSED_TOPIC_0 = 0x3333333333333333333333333333333333333333333333333333333333333333;
    uint256 private constant POSITION_PAUSED_TOPIC_0 = 0x4444444444444444444444444444444444444444444444444444444444444444;
    uint256 private constant POSITION_RESUMED_TOPIC_0 = 0x5555555555555555555555555555555555555555555555555555555555555555;

    uint64 private constant CALLBACK_GAS_LIMIT = 1000000;
    uint256 private constant BASIS_POINTS = 10000;

    enum PositionStatus { Active, Paused, Cancelled, Closed, Failed }

    struct Reserves {
        uint112 reserve0;
        uint112 reserve1;
    }

    struct TrackedPosition {
        uint256 id;
        address pair;
        bool sellToken0;
        uint256 coefficient;

        // Price tracking
        uint256 entryPrice;
        uint256 hardStopPrice;
        uint256 nextProfitMilestone;
        uint256 lastMilestonePrice;
        uint256 profitTakePercent;

        PositionStatus status;
        uint256 lastTriggeredAt;
        uint8 triggerCount;
    }

    address public immutable owner;
    address public immutable profitLockingCallback;

    mapping(uint256 => TrackedPosition) public trackedPositions;
    mapping(address => uint256[]) public pairPositions;
    mapping(address => uint256) public pairPositionCount;
    mapping(address => bool) public subscribedPairs;

    uint256 private constant TRIGGER_COOLDOWN = 60;
    uint8 private constant MAX_TRIGGER_ATTEMPTS = 5;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(
        address _owner,
        address _profitLockingCallback
    ) payable {
        owner = _owner;
        profitLockingCallback = _profitLockingCallback;

        if (!vm) {
            // Subscribe to position lifecycle events
            service.subscribe(
                SEPOLIA_CHAIN_ID,
                profitLockingCallback,
                POSITION_CREATED_TOPIC_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );

            service.subscribe(
                SEPOLIA_CHAIN_ID,
                profitLockingCallback,
                POSITION_CANCELLED_TOPIC_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );

            service.subscribe(
                SEPOLIA_CHAIN_ID,
                profitLockingCallback,
                POSITION_CLOSED_TOPIC_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );

            service.subscribe(
                SEPOLIA_CHAIN_ID,
                profitLockingCallback,
                POSITION_PAUSED_TOPIC_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );

            service.subscribe(
                SEPOLIA_CHAIN_ID,
                profitLockingCallback,
                POSITION_RESUMED_TOPIC_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
        }
    }

    function react(LogRecord calldata log) external vmOnly {
        if (log._contract == profitLockingCallback) {
            _processPositionEvent(log);
        } else if (log.topic_0 == UNISWAP_V2_SYNC_TOPIC_0 && subscribedPairs[log._contract]) {
            _processSyncEvent(log);
        }
    }

    function _processPositionEvent(LogRecord calldata log) internal {
        if (log.topic_0 == POSITION_CREATED_TOPIC_0) {
            _processPositionCreated(log);
        } else if (log.topic_0 == POSITION_CANCELLED_TOPIC_0) {
            _processPositionCancelled(log);
        } else if (log.topic_0 == POSITION_CLOSED_TOPIC_0) {
            _processPositionClosed(log);
        } else if (log.topic_0 == POSITION_PAUSED_TOPIC_0) {
            _processPositionPaused(log);
        } else if (log.topic_0 == POSITION_RESUMED_TOPIC_0) {
            _processPositionResumed(log);
        }
    }

    function _processPositionCreated(LogRecord calldata log) internal {
        address pair = address(uint160(log.topic_1));
        uint256 positionId = uint256(log.topic_2);

        // Decode event data
        (
            bool sellToken0,
            address tokenSell,
            address tokenBuy,
            uint256 baseAmount,
            uint256 entryPrice,
            uint256 hardStopPercent,
            uint256 profitTakePercent
        ) = abi.decode(log.data, (bool, address, address, uint256, uint256, uint256, uint256));

        // Calculate hard stop price
        uint256 hardStopPrice = Math.mulDiv(entryPrice, BASIS_POINTS - hardStopPercent, BASIS_POINTS);

        // Calculate first profit milestone
        uint256 firstMilestone = Math.mulDiv(entryPrice, BASIS_POINTS + profitTakePercent, BASIS_POINTS);

        // Track position
        trackedPositions[positionId] = TrackedPosition({
            id: positionId,
            pair: pair,
            sellToken0: sellToken0,
            coefficient: 1e18, // Assuming standard coefficient
            entryPrice: entryPrice,
            hardStopPrice: hardStopPrice,
            nextProfitMilestone: firstMilestone,
            lastMilestonePrice: entryPrice,
            profitTakePercent: profitTakePercent,
            status: PositionStatus.Active,
            lastTriggeredAt: 0,
            triggerCount: 0
        });

        pairPositions[pair].push(positionId);

        if (pairPositionCount[pair] == 0) {
            _requestPairSubscription(pair, log.chain_id);
        }

        pairPositionCount[pair]++;

        emit PositionTracked(pair, positionId, entryPrice, hardStopPrice, firstMilestone);
    }

    function _processPositionCancelled(LogRecord calldata log) internal {
        uint256 positionId = uint256(log.topic_1);

        if (trackedPositions[positionId].id == positionId) {
            address pair = trackedPositions[positionId].pair;
            trackedPositions[positionId].status = PositionStatus.Cancelled;
            _decrementPairCount(pair);
            emit PositionUntracked(pair, positionId);
        }
    }

    function _processPositionClosed(LogRecord calldata log) internal {
        uint256 positionId = uint256(log.topic_1);

        if (trackedPositions[positionId].id == positionId) {
            address pair = trackedPositions[positionId].pair;
            trackedPositions[positionId].status = PositionStatus.Closed;
            _decrementPairCount(pair);
            emit PositionUntracked(pair, positionId);
        }
    }

    function _processPositionPaused(LogRecord calldata log) internal {
        uint256 positionId = uint256(log.topic_1);
        if (trackedPositions[positionId].id == positionId) {
            trackedPositions[positionId].status = PositionStatus.Paused;
        }
    }

    function _processPositionResumed(LogRecord calldata log) internal {
        uint256 positionId = uint256(log.topic_1);
        if (trackedPositions[positionId].id == positionId) {
            trackedPositions[positionId].status = PositionStatus.Active;
        }
    }

    /**
     * @notice Core logic: Check for milestone hits or hard stop triggers
     */
    function _processSyncEvent(LogRecord calldata log) internal {
        address pair = log._contract;
        Reserves memory reserves = abi.decode(log.data, (Reserves));

        uint256[] storage positionIds = pairPositions[pair];

        for (uint i = 0; i < positionIds.length; i++) {
            uint256 positionId = positionIds[i];
            TrackedPosition storage position = trackedPositions[positionId];

            if (position.status != PositionStatus.Active) {
                continue;
            }

            // Calculate current price
            uint256 currentPrice = _calculatePrice(
                position.sellToken0,
                reserves.reserve0,
                reserves.reserve1,
                position.coefficient
            );

            // PRIORITY 1: Check hard stop (sell everything)
            if (currentPrice <= position.hardStopPrice) {
                _triggerHardStop(positionId, pair, currentPrice);
                continue;
            }

            // PRIORITY 2: Check profit milestone (lock profits)
            if (currentPrice >= position.nextProfitMilestone) {
                _triggerProfitLock(positionId, pair, currentPrice, position.nextProfitMilestone);
            }
        }
    }

    function _calculatePrice(
        bool sellToken0,
        uint112 reserve0,
        uint112 reserve1,
        uint256 coefficient
    ) internal pure returns (uint256) {
        if (sellToken0) {
            return Math.mulDiv(uint256(reserve1), coefficient, uint256(reserve0));
        } else {
            return Math.mulDiv(uint256(reserve0), coefficient, uint256(reserve1));
        }
    }

    /**
     * @notice Trigger profit lock - sell only the profit
     */
    function _triggerProfitLock(
        uint256 positionId,
        address pair,
        uint256 currentPrice,
        uint256 milestonePrice
    ) internal {
        TrackedPosition storage position = trackedPositions[positionId];

        if (position.lastTriggeredAt > 0 &&
            block.timestamp < position.lastTriggeredAt + TRIGGER_COOLDOWN) {
            return;
        }

        if (position.triggerCount >= MAX_TRIGGER_ATTEMPTS) {
            position.status = PositionStatus.Failed;
            emit ProcessingError("Max retries exceeded", positionId);
            return;
        }

        position.lastTriggeredAt = block.timestamp;
        position.triggerCount++;

        // Calculate next milestone
        uint256 nextMilestone = Math.mulDiv(
            milestonePrice,
            BASIS_POINTS + position.profitTakePercent,
            BASIS_POINTS
        );

        // Update position
        position.lastMilestonePrice = milestonePrice;
        position.nextProfitMilestone = nextMilestone;

        // Trigger profit lock callback
        bytes memory payload = abi.encodeWithSignature(
            "executeProfitLock(address,uint256,uint256,uint256)",
            address(0),
            positionId,
            currentPrice,
            milestonePrice
        );

        emit Callback(SEPOLIA_CHAIN_ID, profitLockingCallback, CALLBACK_GAS_LIMIT, payload);

        emit MilestoneReached(positionId, currentPrice, milestonePrice, nextMilestone);
    }

    /**
     * @notice Trigger hard stop - sell everything
     */
    function _triggerHardStop(
        uint256 positionId,
        address pair,
        uint256 currentPrice
    ) internal {
        TrackedPosition storage position = trackedPositions[positionId];

        if (position.lastTriggeredAt > 0 &&
            block.timestamp < position.lastTriggeredAt + TRIGGER_COOLDOWN) {
            return;
        }

        if (position.triggerCount >= MAX_TRIGGER_ATTEMPTS) {
            position.status = PositionStatus.Failed;
            emit ProcessingError("Max retries exceeded", positionId);
            return;
        }

        position.lastTriggeredAt = block.timestamp;
        position.triggerCount++;

        // Trigger hard stop callback
        bytes memory payload = abi.encodeWithSignature(
            "executeHardStop(address,uint256,uint256)",
            address(0),
            positionId,
            currentPrice
        );

        emit Callback(SEPOLIA_CHAIN_ID, profitLockingCallback, CALLBACK_GAS_LIMIT, payload);

        emit HardStopHit(positionId, currentPrice, position.hardStopPrice);
    }

    // Pair subscription management (same as before)
    function _requestPairSubscription(address pair, uint256 chainId) internal {
        if (!subscribedPairs[pair]) {
            bytes memory payload = abi.encodeWithSignature(
                "subscribeToPair(address,address,uint256)",
                address(0),
                pair,
                chainId
            );
            emit Callback(REACTIVE_CHAIN_ID, address(this), CALLBACK_GAS_LIMIT, payload);
            subscribedPairs[pair] = true;
            emit PairSubscribed(pair);
        }
    }

    function _requestPairUnsubscription(address pair, uint256 chainId) internal {
        if (subscribedPairs[pair]) {
            bytes memory payload = abi.encodeWithSignature(
                "unsubscribeFromPair(address,address,uint256)",
                address(0),
                pair,
                chainId
            );
            emit Callback(REACTIVE_CHAIN_ID, address(this), CALLBACK_GAS_LIMIT, payload);
            subscribedPairs[pair] = false;
            emit PairUnsubscribed(pair);
        }
    }

    function subscribeToPair(address /*sender*/, address pair, uint256 chainId) external rnOnly {
        service.subscribe(
            chainId,
            pair,
            UNISWAP_V2_SYNC_TOPIC_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
    }

    function unsubscribeFromPair(address /*sender*/, address pair, uint256 chainId) external rnOnly {
        service.unsubscribe(
            chainId,
            pair,
            UNISWAP_V2_SYNC_TOPIC_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
    }

    function _decrementPairCount(address pair) internal {
        if (pairPositionCount[pair] > 0) {
            pairPositionCount[pair]--;
            if (pairPositionCount[pair] == 0) {
                _requestPairUnsubscription(pair, SEPOLIA_CHAIN_ID);
            }
        }
    }

    function emergencySubscribeToPair(address pair, uint256 chainId) external onlyOwner {
        service.subscribe(chainId, pair, UNISWAP_V2_SYNC_TOPIC_0, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE);
        subscribedPairs[pair] = true;
        emit PairSubscribed(pair);
    }

    function emergencyUnsubscribeFromPair(address pair, uint256 chainId) external onlyOwner {
        service.unsubscribe(chainId, pair, UNISWAP_V2_SYNC_TOPIC_0, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE);
        subscribedPairs[pair] = false;
        emit PairUnsubscribed(pair);
    }

    function getActivePositionsForPair(address pair) external view returns (uint256[] memory) {
        uint256[] storage allPositions = pairPositions[pair];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < allPositions.length; i++) {
            if (trackedPositions[allPositions[i]].status == PositionStatus.Active) {
                activeCount++;
            }
        }

        uint256[] memory activePositions = new uint256[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < allPositions.length; i++) {
            if (trackedPositions[allPositions[i]].status == PositionStatus.Active) {
                activePositions[index] = allPositions[i];
                index++;
            }
        }

        return activePositions;
    }

    function rescueERC20(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        SafeERC20.safeTransfer(IERC20(token), to, amount);
    }

    function rescueAllERC20(address token, address to) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No tokens");
        SafeERC20.safeTransfer(IERC20(token), to, balance);
    }

    function withdrawETH(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient ETH");
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");
    }

    function withdrawAllETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH");
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "ETH transfer failed");
    }
}
