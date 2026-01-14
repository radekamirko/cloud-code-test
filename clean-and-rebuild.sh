#!/bin/bash
# Complete clean script for Next.js project

echo "🧹 Cleaning all caches and build artifacts..."

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

# Remove Next.js build artifacts
echo "Removing .next..."
rm -rf .next

# Remove node_modules cache
echo "Removing node_modules cache..."
rm -rf node_modules/.cache

# Remove Tailwind cache
echo "Removing Tailwind cache..."
rm -rf .tailwindcss-cache

# Remove package locks
echo "Removing package-lock.json..."
rm -f package-lock.json

# Reinstall dependencies
echo "Installing dependencies..."
npm install

echo "✅ Clean complete! You can now run: npm run dev"
