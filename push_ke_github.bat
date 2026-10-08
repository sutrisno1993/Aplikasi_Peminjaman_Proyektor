@echo off
cd /d "%~dp0"
title SIMPRO - Push ke GitHub
echo ========================================================
echo   PUSH KODE SIMPRO KE GITHUB REPOSITORY
echo   Repo: https://github.com/sutrisno1993/Aplikasi_Peminjaman_Proyektor.git
echo ========================================================
echo.

echo Lokasi Project: %CD%
echo.

echo 1. Memeriksa status Git...
git status
echo.

echo 2. Menambahkan perubahan dan commit...
git add .
git commit -m "Update SIMPRO: Include vendor, SQL cPanel fixes, 27 Classes" 2>nul
echo.

echo 3. Mengirim (Push) ke GitHub branch main...
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo [BERHASIL] Seluruh kode SIMPRO berhasil di-push ke GitHub!
    echo Kunjungi: https://github.com/sutrisno1993/Aplikasi_Peminjaman_Proyektor
    echo ========================================================
) else (
    echo ========================================================
    echo [INFO] Jika diminta login/token GitHub, silakan masukkan kredensial akun GitHub Anda.
    echo ========================================================
)

echo.
pause
