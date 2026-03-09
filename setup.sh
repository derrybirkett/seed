#!/bin/bash

# Seed Setup Script
# Quick setup for development

set -e

echo "🌱 Setting up Seed development environment..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ required. You have: $(node -v)"
  exit 1
fi
echo "✅ Node.js $(node -v)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
  echo "📦 Installing pnpm..."
  npm install -g pnpm
fi
echo "✅ pnpm $(pnpm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env from template..."
  cp .env.example .env
  echo "⚠️  Don't forget to add your ANTHROPIC_API_KEY to .env"
else
  echo "✅ .env already exists"
fi

# Build
echo "🔨 Building TypeScript..."
pnpm build

# Link globally
echo "🔗 Linking CLI globally..."
npm link

# Test
echo "🧪 Testing CLI..."
if seed --version > /dev/null 2>&1; then
  echo "✅ seed CLI is ready!"
  seed --version
else
  echo "❌ seed CLI link failed"
  exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Add your Anthropic API key to .env:"
echo "     export ANTHROPIC_API_KEY=\"sk-ant-...\""
echo ""
echo "  2. Test the CLI:"
echo "     seed init test-project"
echo ""
echo "  3. Start development:"
echo "     pnpm dev"
echo ""
echo "  4. Read docs:"
echo "     cat GETTING_STARTED.md"
