# Contract Bytecode

This directory contains the compiled bytecode for the smart contracts.

## Generating Bytecode

After compiling your contracts with Foundry, run:

```bash
# From project root
forge inspect PersonalProfitLockingTrailingStopCallback bytecode --format json > frontend/src/lib/bytecode/CallbackBytecode.json
forge inspect PersonalProfitLockingTrailingStopReactive bytecode --format json > frontend/src/lib/bytecode/ReactiveBytecode.json
```

## Usage in Frontend

The bytecode is used during contract deployment:

```typescript
import CallbackBytecode from './bytecode/CallbackBytecode.json';
import ReactiveBytecode from './bytecode/ReactiveBytecode.json';

// Deploy callback contract
const factory = new ContractFactory(CallbackABI, CallbackBytecode.bytecode, signer);
const contract = await factory.deploy(owner, callbackSender, router, { value: parseEther('0.01') });
```

## Placeholder Until Compilation

Until you compile the contracts, use empty bytecode placeholders.
The actual bytecode will be generated after running `forge build`.
