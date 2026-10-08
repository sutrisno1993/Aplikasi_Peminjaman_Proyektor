@echo off
title SIMPRO - Jalankan Semua Server
echo ========================================================
echo   SIMPRO - MEMULAI SERVER FULLSTACK
echo ========================================================
echo.

echo 1. Menjalankan Backend CodeIgniter 4 (Port 8080)...
start "SIMPRO - Backend CI4" "%~dp0jalankan_server_ci4.bat"

echo.
echo 2. Menjalankan Frontend Web App (Port 3000)...
start "SIMPRO - Frontend Web" "%~dp0jalankan_aplikasi.bat"

echo.
echo ========================================================
echo Server Fullstack Berhasil Dijalankan!
echo Silakan buka: http://localhost:3000
echo ========================================================
echo.
timeout /t 3 >nul
start http://localhost:3000
