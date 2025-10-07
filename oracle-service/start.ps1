#!/usr/bin/env pwsh
Write-Host "Starting Oracle Service..." -ForegroundColor Green
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow

# Change to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptPath

Write-Host "Oracle service directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host "Running npm run dev..." -ForegroundColor Green

npm run dev