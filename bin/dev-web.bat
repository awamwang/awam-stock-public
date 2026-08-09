@echo off
setlocal EnableExtensions
rem UTF-8 控制台，避免中文乱码
chcp 65001 >nul
cd /d "%~dp0.."

set "EXIT_CODE=0"
set "NODE_ENV=development"
if not defined AWST_ENV set "AWST_ENV=pc"

title [AwamStock] DB + Server + Web DEV
echo ========================================
echo   启动 DB + Server + 网页版前端
echo   项目目录: %CD%
echo   AWST_ENV=%AWST_ENV%
echo ========================================
echo.

where pnpm >nul 2>nul
if errorlevel 1 (
  echo [错误] 未找到 pnpm，请先安装并确保已加入 PATH。
  set "EXIT_CODE=1"
  goto :end
)

call pnpm run dev:web
set "EXIT_CODE=%ERRORLEVEL%"

echo.
echo ----------------------------------------
if not "%EXIT_CODE%"=="0" (
  echo 进程已结束，退出码: %EXIT_CODE%
) else (
  echo 进程已正常结束。
)

:end
echo.
echo 窗口将保持打开，按任意键关闭...
pause >nul
endlocal & exit /b %EXIT_CODE%