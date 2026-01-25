@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Ensure we are in the project root (where this script lives)
cd /d "%~dp0"

echo =========================================
echo   Starting Nafira App
echo =========================================
echo.
echo App:       http://localhost:5000
echo Vision AI: http://localhost:5001
echo.
echo Close the individual server windows or press Ctrl+C in them to stop.
echo.

REM ---- Start Vision Model Server (RTQVLM) ----
echo [1/3] Starting Vision Model Service...
where python >nul 2>&1
if %errorlevel% equ 0 (
    start "Vision Model Service" /min cmd /c "cd server\services && python visionModelServer.py"
    echo     Using: python
) else (
    where python3 >nul 2>&1
    if %errorlevel% equ 0 (
        start "Vision Model Service" /min cmd /c "cd server\services && python3 visionModelServer.py"
        echo     Using: python3
    ) else (
        echo     WARNING: Python not found. Vision Model Service will NOT start.
        echo     Install Python 3 and run: pip install transformers torch pillow
    )
)

REM Give the vision server a moment to spin up
timeout /t 5 /nobreak >nul

REM ---- Build Frontend (one-time) ----
echo [2/3] Building Frontend (served by backend on :5000)...
call npm run build:frontend
if %errorlevel% neq 0 (
    echo Frontend build failed. Exiting.
    pause
    exit /b 1
)

REM ---- Start Backend (Node/Express) ----
echo [3/3] Starting App Server on :5000...
start "Nafira App (Server)" cmd /k "cd server && set NODE_ENV=production && npm start"

echo.
echo All services have been launched:
echo   - Vision Model Service (minimized)
echo   - App Server (serves frontend + API on :5000)
echo.
echo You can close this launcher window now.
echo.
pause

endlocal
