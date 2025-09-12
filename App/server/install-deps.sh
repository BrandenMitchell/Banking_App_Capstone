#!/bin/bash

echo "🚀 Installing Banking App Server Dependencies"
echo "=============================================="

# Create a temporary directory for clean npm install
TEMP_DIR="/tmp/banking-app-server-$(date +%s)"
mkdir -p "$TEMP_DIR"

echo "📁 Creating temporary directory: $TEMP_DIR"

# Copy package.json to temp directory
cp package.json "$TEMP_DIR/"

echo "📦 Installing dependencies in clean environment..."

# Change to temp directory and install
cd "$TEMP_DIR"

# Try different approaches to install dependencies
echo "🔄 Attempting npm install with different flags..."

# Method 1: Try with --no-cache
if npm install --no-cache --silent; then
    echo "✅ Dependencies installed successfully with --no-cache"
    cp -r node_modules ../server/
    cp package-lock.json ../server/ 2>/dev/null || true
    echo "✅ Dependencies copied to server directory"
    rm -rf "$TEMP_DIR"
    exit 0
fi

# Method 2: Try with --legacy-peer-deps
if npm install --legacy-peer-deps --no-cache --silent; then
    echo "✅ Dependencies installed successfully with --legacy-peer-deps"
    cp -r node_modules ../server/
    cp package-lock.json ../server/ 2>/dev/null || true
    echo "✅ Dependencies copied to server directory"
    rm -rf "$TEMP_DIR"
    exit 0
fi

# Method 3: Try installing packages individually
echo "🔄 Trying individual package installation..."
cd ../server

# Install core packages one by one
packages=("express" "cors" "dotenv" "mongoose" "bcryptjs" "jsonwebtoken" "nodemon")

for package in "${packages[@]}"; do
    echo "Installing $package..."
    if npm install "$package" --no-cache --silent; then
        echo "✅ $package installed successfully"
    else
        echo "❌ Failed to install $package"
    fi
done

# Clean up
rm -rf "$TEMP_DIR"

echo ""
echo "🎉 Installation process completed!"
echo ""
echo "📋 Next steps:"
echo "1. Run: npm run dev"
echo "2. If you get errors, try: npm install --legacy-peer-deps"
echo "3. Check that MongoDB is running: brew services list | grep mongodb"
echo ""
echo "🔧 If you still have issues, try:"
echo "   sudo chown -R \$(whoami) ~/.npm"
echo "   npm cache clean --force"
