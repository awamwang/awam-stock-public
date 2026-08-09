@echo off
setlocal EnableExtensions
cd /d "%~dp0.."

set "EXIT_CODE=0"
set "NODE_ENV=development"
if not defined AWST_ENV set "AWST_ENV=pc"

rem double-click PATH bootstrap
if exist "%ProgramFiles%\nodejs\" set "PATH=%ProgramFiles%\nodejs;%PATH%"
if exist "%LOCALAPPDATA%\pnpm\" set "PATH=%LOCALAPPDATA%\pnpm;%PATH%"
if exist "%APPDATA%\npm\" set "PATH=%APPDATA%\npm;%PATH%"

title [AwamStock] DB + Server DEV
echo ========================================
echo   启动 DB + Server DEV
echo   项目目录: %CD%
echo   AWST_ENV=%AWST_ENV%
echo ========================================
echo.

where pnpm >nul 2>nul
if errorlevel 1 goto :no_pnpm

call pnpm run dev:db-server
set "EXIT_CODE=%ERRORLEVEL%"
goto :after_run

:no_pnpm
echo [错误] 未找到 pnpm，请先安装并确保已加入 PATH。
set "EXIT_CODE=1"
goto :end

:after_run
echo.
echo ----------------------------------------
if not "%EXIT_CODE%"=="0" goto :run_fail
echo 进程已正常结束。
goto :end

:run_fail
echo 进程已结束，退出码: %EXIT_CODE%

:end
echo.
echo 窗口将保持打开，按任意键关闭...
pause >nul
endlocal & exit /b %EXIT_CODE%
