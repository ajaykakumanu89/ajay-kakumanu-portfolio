@echo off
setlocal
cd /d "%~dp0"
set "PORTFOLIO_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "PORTFOLIO_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "PORTFOLIO_MARKED_MODULE=%CD%\node_modules\marked\lib\marked.esm.js"
if not exist "%PORTFOLIO_MARKED_MODULE%" set "PORTFOLIO_MARKED_MODULE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\marked\lib\marked.esm.js"
if not exist "%PORTFOLIO_MARKED_MODULE%" (
  echo Install Node.js 20 or later, then run npm install from this folder.
  goto failed
)
"%PORTFOLIO_NODE%" scripts\build.mjs --marked-module "%PORTFOLIO_MARKED_MODULE%"
if errorlevel 1 goto failed
"%PORTFOLIO_NODE%" scripts\check-site.mjs
if errorlevel 1 goto failed
echo.
echo Open http://127.0.0.1:4173/ in your browser after the server starts.
echo Keep this window open. Press Ctrl+C to stop the preview.
echo.
"%PORTFOLIO_NODE%" scripts\serve.mjs
if errorlevel 1 goto failed
goto done
:failed
echo Preview could not start. Review the message above.
pause
:done
endlocal
