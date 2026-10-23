@echo off
title VibeWear Full-Stack Live Server & Cloudflare Tunnel
color 0b
echo ==========================================================
echo          VIBEWEAR FULL-STACK LIVE DEMO LAUNCHER
echo ==========================================================
echo.
echo [1/2] Starting Node.js + Express Backend on port 5000...
cd /d "%~dp0backend"
start "VibeWear Backend Server" cmd /k "node src/server.js"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Cloudflare Public HTTPS Tunnel...
cd /d "%~dp0"
start "VibeWear Cloudflare Tunnel" cmd /k "cloudflared.exe tunnel --url http://localhost:5000"

echo.
echo ==========================================================
echo [*] Local Address:  http://localhost:5000
echo [*] Cloudflare Live Link: Check the 'VibeWear Cloudflare Tunnel' window!
echo.
echo IMPORTANT: Keep the terminal windows open while browsing or
echo sharing your live demo. If you close them, the tunnel stops!
echo ==========================================================
echo.
pause
