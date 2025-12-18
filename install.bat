@echo off
echo Installing dependencies for Nafira App...
echo.

echo [1/3] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Installing backend dependencies...
cd server
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)

echo.
echo [3/3] Initializing database...
call npm run init-db
if %errorlevel% neq 0 (
    echo ERROR: Database initialization failed!
    pause
    exit /b 1
)

cd ..
echo.
echo ========================================
echo Installation complete!
echo ========================================
echo.
echo Demo credentials:
echo   Email: demo@nafira.app
echo   Password: demo123
echo.
echo To start the app, run: start.bat
echo.
pause
