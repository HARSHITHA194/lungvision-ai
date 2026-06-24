@echo off
echo ==========================================
echo LungVision AI - Model Integration Setup
echo ==========================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.10+
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do echo ✅ %%i found

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js %%i found

echo.
echo Setting up backend...

:: Backend setup
cd backend

if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -q -r requirements.txt

if not exist "model_5class.h5" (
    echo ⚠️  model_5class.h5 not found in backend\
    echo    Please copy your model file to: backend\model_5class.h5
)

if not exist ".env" (
    echo Creating backend\.env...
    copy .env.example .env
)

cd ..

echo.
echo Setting up frontend...

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install -q
)

if not exist ".env" (
    echo Creating .env...
    copy .env.example .env
    echo ⚠️  Please edit .env and add your VITE_API_KEY
)

echo.
echo ==========================================
echo Setup Complete! ✅
echo ==========================================
echo.
echo Next steps:
echo 1. Add your Gemini API key to .env file
echo 2. Copy your model to: backend\model_5class.h5
echo.
echo To start the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   venv\Scripts\activate
echo   python app.py
echo.
echo Terminal 2 - Frontend:
echo   npm run dev
echo.
echo Then open: http://localhost:3001
echo.
pause
