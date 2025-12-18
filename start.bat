@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Ensure we are in the project root (where this script lives)
cd /d "%~dp0"

echo =========================================
echo   Starting Nafira App
echo =========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:5000
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

REM ---- Start Backend (Node/Express) ----
echo [2/3] Starting Backend API...
start "Nafira Backend" cmd /k "cd server && npm run dev"

REM Small delay so windows appear in order
timeout /t 3 /nobreak >nul

REM ---- Start Frontend (React) ----
echo [3/3] Starting Frontend...
start "Nafira Frontend" cmd /k "npm start"

echo.
echo All services have been launched:
echo   - Vision Model Service (minimized)
echo   - Backend Server
echo   - Frontend Dev Server
echo.
echo You can close this launcher window now.
echo.
pause

endlocal
