#!/usr/bin/env pwsh

Write-Host "🚀 Starting Finisterre Backend PHP Development Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

$backendPath = Join-Path $PSScriptRoot "backend"
Set-Location $backendPath

try {
    php -S localhost:3001 index.php
} catch {
    Write-Host "❌ Error starting server: $_" -ForegroundColor Red
    Write-Host "Make sure PHP is installed and available in your PATH" -ForegroundColor Yellow
}

Write-Host "👋 Server stopped" -ForegroundColor Gray
