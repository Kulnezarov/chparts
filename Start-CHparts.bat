@echo off
set "NODE_DIR=%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.18.0-win-x64"
set "PATH=%NODE_DIR%;%PATH%"

cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js ne naiden. Perezapustite terminal posle ustanovki Node.js.
  echo Ili ustanovite s https://nodejs.org
  pause
  exit /b 1
)

if not exist node_modules (
  echo Ustanovka zavisimostey...
  call npm.cmd install
)

echo Zapusk CHparts: http://localhost:3000
echo Esli v PowerShell oshibka Execution_Policies — zapustite dev.cmd ili Start-CHparts.bat
set PORT=3000
start http://localhost:3000
call npm.cmd run dev
