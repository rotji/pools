@echo off
echo Starting Oracle Service...
echo Current directory: %CD%
cd /d "%~dp0"
echo Oracle service directory: %CD%
npm run dev
pause