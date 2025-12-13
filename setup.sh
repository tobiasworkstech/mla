#!/bin/bash

echo "🚀 Memory Leak Analyzer Setup"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node.js installed: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✓ npm installed: $NPM_VERSION"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"

# Setup .env file
echo ""
echo "🔑 Setting up environment..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✓ Created backend/.env"
    echo "✓ Created backend/.env"
else
    echo "✓ backend/.env already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
