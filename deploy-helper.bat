@echo off
REM IoT DO Sensor - Quick Deployment Helper Script
REM This script helps you deploy the project

color 0A
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     IoT DO Sensor - Cloud Deployment Helper                    ║
echo ║     Render Backend + Vercel Frontend                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

:menu
echo.
echo Select an action:
echo.
echo 1. Open DEPLOY_NOW.md (Step-by-step guide)
echo 2. Open GitHub Repository
echo 3. Open Render Dashboard
echo 4. Open Vercel Dashboard
echo 5. Open Backend URL (after deployment)
echo 6. Open Frontend URL (after deployment)
echo 7. Run Verification Script
echo 8. View Project Files
echo 9. Exit
echo.

set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" goto deploy_guide
if "%choice%"=="2" goto github
if "%choice%"=="3" goto render
if "%choice%"=="4" goto vercel
if "%choice%"=="5" goto backend_url
if "%choice%"=="6" goto frontend_url
if "%choice%"=="7" goto verify
if "%choice%"=="8" goto files
if "%choice%"=="9" goto exit
goto invalid

:deploy_guide
echo.
echo Opening deployment guide...
start "" "DEPLOY_NOW.md"
goto menu

:github
echo.
echo Opening GitHub repository...
start "" "https://github.com/Agnibha2003/IoT-based-DO-Sensor-Monitoring"
goto menu

:render
echo.
echo Opening Render Dashboard...
start "" "https://dashboard.render.com"
goto menu

:vercel
echo.
echo Opening Vercel Dashboard...
start "" "https://vercel.com/dashboard"
goto menu

:backend_url
echo.
set /p backend="Enter your backend URL (e.g., https://do-sensor-backend.onrender.com): "
start "" "%backend%/api/health"
goto menu

:frontend_url
echo.
set /p frontend="Enter your frontend URL (e.g., https://do-sensor-dashboard.vercel.app): "
start "" "%frontend%"
goto menu

:verify
echo.
echo Opening verification script...
echo Note: Requires Python 3.x installed
echo.
python verify_deployment.py
pause
goto menu

:files
echo.
echo Opening project files...
start "" .
goto menu

:invalid
echo.
echo Invalid choice. Please try again.
goto menu

:exit
echo.
echo Thank you for using IoT DO Sensor Deployment Helper!
echo.
pause
exit /b 0
