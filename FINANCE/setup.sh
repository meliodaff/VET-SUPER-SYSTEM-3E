#!/bin/bash

echo "========================================"
echo "Fur-Ever Care Setup Script"
echo "========================================"
echo

echo "[1/4] Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js is installed"

echo
echo "[2/4] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies!"
    exit 1
fi
echo "✓ Frontend dependencies installed"

echo
echo "[3/4] Setting up database..."
echo "Please make sure your local server (XAMPP/WAMP/LAMP) is running and MySQL is accessible."
echo
echo "Manual steps required:"
echo "1. Open phpMyAdmin (http://localhost/phpmyadmin)"
echo "2. Create database named 'fur_ever_care'"
echo "3. Import backend/database/schema.sql"
echo
read -p "Press Enter when database is ready..."

echo
echo "[4/4] Starting development server..."
echo
echo "✓ Setup complete!"
echo
echo "Next steps:"
echo "1. Make sure your local server is running"
echo "2. Database 'fur_ever_care' is created and imported"
echo "3. Frontend will start automatically"
echo
echo "Access the application at: http://localhost:3000"
echo
read -p "Press Enter to start the frontend server..."

npm start
