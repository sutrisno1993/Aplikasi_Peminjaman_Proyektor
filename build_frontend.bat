@echo off
title SIMPRO - Build Frontend untuk Production
echo ========================================================
echo   SIMPRO - BUILD FRONTEND REACT (PRODUCTION CPANEL)
echo ========================================================
echo.
echo Sedang melakukan kompilasi file React/Vite...
echo.

set NPM_BIN=npm
if exist "C:\Program Files\nodejs\npm.cmd" set NPM_BIN="C:\Program Files\nodejs\npm.cmd"

%NPM_BIN% run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo [BERHASIL] Build frontend selesai!
    echo Folder 'dist' dan aset produksi siap diupload ke cPanel.
    echo ========================================================
) else (
    echo.
    echo [GAGAL] Terjadi kesalahan saat build. Pastikan Node.js terpasang.
)

echo.
pause
