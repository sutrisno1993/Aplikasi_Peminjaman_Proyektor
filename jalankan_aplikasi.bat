@echo off
title SIMPRO - Sistem Peminjaman Proyektor Sekolah
echo ========================================================
echo   SIMPRO - Sistem Peminjaman Proyektor Sekolah
echo ========================================================
echo.
echo Menjalankan server aplikasi di http://localhost:3000 ...
echo.

where npm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    npm run dev -- --host --port 3000
) else if exist "C:\Program Files\nodejs\npm.cmd" (
    "C:\Program Files\nodejs\npm.cmd" run dev -- --host --port 3000
) else (
    echo npm tidak ditemukan di PATH. Silakan instal NodeJS atau periksa PATH sistem.
    pause
)
