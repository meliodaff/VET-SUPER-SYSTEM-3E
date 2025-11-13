@echo off
echo ========================================
echo Fur-Ever Care Setup Script
echo ========================================
echo.

echo [1/4] Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [2/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies!
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed

echo.
echo [3/4] Setting up database...
echo Please make sure XAMPP/WAMP is running and MySQL is accessible.
echo.
echo Manual steps required:
echo 1. Open phpMyAdmin (http://localhost/phpmyadmin)
echo 2. Create database named 'fur_ever_care'
echo 3. Import backend/database/schema.sql
echo.
echo Press any key when database is ready...
pause >nul

echo.
echo [4/4] Starting development server...
echo.
echo ✓ Setup complete!
echo.
echo Next steps:
echo 1. Make sure XAMPP/WAMP is running
echo 2. Database 'fur_ever_care' is created and imported
echo 3. Frontend will start automatically
echo.
echo Access the application at: http://localhost:3000
echo.
echo Press any key to start the frontend server...
pause >nul

call npm start
