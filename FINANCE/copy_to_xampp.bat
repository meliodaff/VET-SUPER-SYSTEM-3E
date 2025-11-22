@echo off
echo ============================================
echo Copying Backend Files to XAMPP
echo ============================================
echo.

REM Set your XAMPP htdocs path - CHANGE THIS TO YOUR ACTUAL PATH
set XAMPP_PATH=C:\xampp\htdocs\fur-ever-care

REM Check if XAMPP path exists
if not exist "%XAMPP_PATH%" (
    echo ERROR: XAMPP path not found: %XAMPP_PATH%
    echo.
    echo Please edit this file and change XAMPP_PATH to your actual XAMPP htdocs folder
    echo Common locations:
    echo   C:\xampp\htdocs\fur-ever-care
    echo   C:\xampp\htdocs\fur-ever-care(1)
    echo.
    pause
    exit /b 1
)

echo Copying files to: %XAMPP_PATH%
echo.

REM Create directories if they don't exist
if not exist "%XAMPP_PATH%\backend\api\dashboard" mkdir "%XAMPP_PATH%\backend\api\dashboard"

REM Copy the API files
echo Copying doctor_statistics.php...
copy /Y "backend\api\dashboard\doctor_statistics.php" "%XAMPP_PATH%\backend\api\dashboard\doctor_statistics.php"

echo Copying doctor_surgery_fees.php...
copy /Y "backend\api\dashboard\doctor_surgery_fees.php" "%XAMPP_PATH%\backend\api\dashboard\doctor_surgery_fees.php"

echo Copying doctor_detail.php...
copy /Y "backend\api\dashboard\doctor_detail.php" "%XAMPP_PATH%\backend\api\dashboard\doctor_detail.php"

echo Copying test_endpoints.php...
copy /Y "backend\api\dashboard\test_endpoints.php" "%XAMPP_PATH%\backend\api\dashboard\test_endpoints.php"

echo.
echo ============================================
echo Files copied successfully!
echo ============================================
echo.
echo You can now test the endpoints at:
echo   http://localhost/fur-ever-care/backend/api/dashboard/test_endpoints.php
echo   http://localhost/fur-ever-care/backend/api/dashboard/doctor_statistics.php
echo.
echo (Replace 'fur-ever-care' with your actual folder name if different)
echo.
pause

