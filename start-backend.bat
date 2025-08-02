@echo off
echo 🚀 Starting Finisterre Backend PHP Development Server...
echo.
echo Server will be available at: http://localhost:3001
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0backend"
php -S localhost:3001 index.php
