@echo off
cd /d "%~dp0"
title Gemma System Automated Installer
echo ==========================================================
echo   GEMMA ACCESSIBILITY SYSTEM - AUTOMATED INSTALLATION
echo ==========================================================
echo.
echo This script will automatically set up Python, Ollama, 
echo and the Gemma AI model on your computer.
echo Please leave this window open until finished.
echo.
echo ==========================================================

:: 1. Check and Install Python if missing
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/5] Downloading and installing Python...
    curl -L -o python_installer.exe https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe
    start /wait python_installer.exe /quiet PrependPath=1 Include_test=0
    del python_installer.exe
    echo Python installed successfully!
) else (
    echo [1/5] Python is already installed. Skipping...
)

:: 2. Install Required Python Libraries
echo [2/5] Installing necessary background server framework packages...
python -m pip install --upgrade pip >nul 2>&1
pip install flask flask-cors pypdf ollama

:: 3. Check and Install Ollama if missing
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [3/5] Downloading and installing Ollama...
    echo If automated download fails, please download manually from: https://ollama.com/download/windows
    curl -L -o ollama_installer.exe https://ollama.com/download/ollama-windows-amd64.exe
    if exist ollama_installer.exe (
        start /wait ollama_installer.exe /silent
        del ollama_installer.exe
    )
    echo Waiting for Ollama background engine to boot up...
    timeout /t 10 /nobreak >nul
) else (
    echo [3/5] Ollama software is already installed. Skipping...
)

:: 4. Pull the Gemma 2B AI Model
echo [4/5] Downloading the Gemma 2B AI model engine (Size: 1.6GB)...
echo This step may take a few minutes depending on your internet speed.
ollama pull gemma2:2b

:: 5. Create Desktop Shortcut for Web Browser Opening
echo [5/5] Creating Desktop Shortcut...
set "SCRIPT_PATH=%~dp0start_hidden.vbs"
set "HTML_PATH=%~dp0index.html"
set "DESKTOP_PATH=%USERPROFILE%\Desktop\Local-AI.lnk"

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%DESKTOP_PATH%'); $s.TargetPath = 'wscript.exe'; $s.Arguments = '\"%SCRIPT_PATH%\"'; $s.WorkingDirectory = '%~dp0'; $s.Save()"

echo.
echo ==========================================================
echo   INSTALLATION COMPLETE!
echo   A new "Local-AI" shortcut has been recreated on your Desktop.
echo ==========================================================
echo.
echo Launching Gemma AI...

:: Start backend silently in background
wscript.exe "%SCRIPT_PATH%"

:: Open in web browser explicitly
start msedge "%HTML_PATH%" 2>nul || start chrome "%HTML_PATH%" 2>nul || start "" "%HTML_PATH%"

exit