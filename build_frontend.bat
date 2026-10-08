@echo off
title SIMPRO - Build Frontend untuk Production
echo ========================================================
echo   SIMPRO - BUILD FRONTEND REACT KE FOLDER PUBLIC
echo ========================================================
echo.
echo Sedang melakukan kompilasi file React/Vite...
echo.

set NPM_BIN=npm
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\Program Files\nodejs\npm.cmd" set NPM_BIN="C:\Program Files\nodejs\npm.cmd"
)

%NPM_BIN% run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Menyalin hasil build ke folder 'public'...
    xcopy /Y /E /I "dist\*" "public\"
    echo.
    echo ========================================================
    echo [BERHASIL] Build selesai dan file produksi tersalin ke 'public'!
    echo Sekarang Anda tinggal menjalankan 'push_ke_github.bat'
    echo lalu di cPanel cukup ketik: git pull origin main
    echo ========================================================
) else (
    echo.
    echo [GAGAL] Terjadi kesalahan saat build. Pastikan Node.js terpasang di komputer lokal.
)

echo.
pause
