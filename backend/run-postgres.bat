@echo off
REM MediVault Backend Launcher with PostgreSQL
cd /d "%~dp0"

echo ========================================================
echo Starting MediVault Backend with PostgreSQL...
echo ========================================================

REM Check if portable tools exist in parent .tools directory
if exist "%~dp0..\.tools\jdk-17\bin\java.exe" (
    set "JAVA_HOME=%~dp0..\.tools\jdk-17"
    set "PATH=%~dp0..\.tools\jdk-17\bin;%~dp0..\.tools\maven\bin;%PATH%"
)

where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java is not installed or not in PATH!
    pause
    exit /b 1
)

where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven is not installed or not in PATH!
    pause
    exit /b 1
)

set "DB_URL=jdbc:postgresql://localhost:5432/medivault"
set "DB_DRIVER=org.postgresql.Driver"
set "DB_USERNAME=postgres"
set /p DB_PASSWORD="Enter your PostgreSQL password: "
set "JWT_SECRET=medivault-super-secret-key-32chars-minimum"
set "CORS_ORIGINS=http://localhost:5173"

echo Connecting to PostgreSQL on port 5432...
mvn spring-boot:run
pause
