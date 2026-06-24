#!/bin/bash

echo "=========================================="
echo "LungVision AI - Model Integration Setup"
echo "=========================================="
echo ""

# Check Python
if ! command -v python &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.10+"
    exit 1
fi
echo "✅ Python found: $(python --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

echo ""
echo "Setting up backend..."

# Backend setup
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

# Check for model file
if [ ! -f "model_5class.h5" ]; then
    echo "⚠️  model_5class.h5 not found in backend/"
    echo "   Please copy your model file to: backend/model_5class.h5"
fi

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "Creating backend/.env..."
    cp .env.example .env
fi

cd ..

echo ""
echo "Setting up frontend..."

# Frontend setup
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install -q
fi

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "Creating .env..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your VITE_API_KEY"
fi

echo ""
echo "=========================================="
echo "Setup Complete! ✅"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Add your Gemini API key to .env file"
echo "2. Copy your model to: backend/model_5class.h5"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  source venv/bin/activate  (on Windows: venv\\Scripts\\activate)"
echo "  python app.py"
echo ""
echo "Terminal 2 - Frontend:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3001"
