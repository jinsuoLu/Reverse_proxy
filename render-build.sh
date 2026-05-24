#!/bin/bash

echo "======================================"
echo "Render Build Diagnostic Script"
echo "======================================"

echo ""
echo "1. Node version:"
node --version

echo ""
echo "2. NPM version:"
npm --version

echo ""
echo "3. Current directory:"
pwd

echo ""
echo "4. Listing files:"
ls -la

echo ""
echo "5. Package.json dependencies:"
cat package.json | grep -A 50 '"dependencies"'

echo ""
echo "6. Installing dependencies..."
npm install --legacy-peer-deps 2>&1

echo ""
echo "7. Building frontend..."
npm run build 2>&1

echo ""
echo "======================================"
echo "Build process completed"
echo "======================================"
