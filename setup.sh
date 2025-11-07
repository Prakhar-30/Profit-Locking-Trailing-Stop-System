#!/bin/bash

echo "🚀 Profit-Locking Trailing Stop System - Setup Script"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✓ npm version: $(npm --version)"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "  1. cd frontend"
echo "  2. npm run dev"
echo "  3. Visit http://localhost:5173"
echo ""
echo "For contract compilation:"
echo "  1. Install Foundry: curl -L https://foundry.paradigm.xyz | bash"
echo "  2. Run: foundryup"
echo "  3. Run: forge build"
echo ""
echo "See README.md and DEPLOYMENT.md for detailed instructions."
