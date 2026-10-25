@echo off
REM MediVault Backend Launcher
cd /d "%~dp0"

echo ========================================================
echo Starting MediVault Backend...
echo ========================================================

REM Avoid opening the file-based H2 database from a second backend process.
powershell -NoProfile -Command "if (Get-NetTCPConnection -State Listen -LocalPort 8080 -ErrorAction SilentlyContinue) { exit 0 }; exit 1" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Something is already listening on port 8080.
    echo Stop the existing backend before starting another instance.
    pause
    exit /b 0
)

REM Check if portable tools exist in parent .tools directory
if exist "%~dp0..\.tools\jdk-17\bin\java.exe" (
    set "JAVA_HOME=%~dp0..\.tools\jdk-17"
    set "PATH=%~dp0..\.tools\jdk-17\bin;%~dp0..\.tools\maven\bin;%PATH%"
)

REM Check if java is installed
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java is not installed or not in PATH!
    echo Please install OpenJDK 17 and restart this window.
    pause
    exit /b 1
)

REM Check if mvn is installed
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven is not installed or not in PATH!
    echo Please install Apache Maven and restart this window.
    pause
    exit /b 1
)

REM Use the local profile so datasource settings stay in application-local.yml
set "SPRING_PROFILES_ACTIVE=local"
set "JWT_SECRET=medivault-super-secret-key-32chars-minimum"
set "CORS_ORIGINS=http://localhost:5173"

echo Database: Embedded H2 (./data/medivault)
echo API URL:  http://localhost:8080
echo.
mvn spring-boot:run
pause
