@echo off
title Import Database MySQL - SIMPRO (27 KELAS LENGKAP)
echo ========================================================
echo   IMPORT DATABASE MYSQL - SIMPRO (27 KELAS LENGKAP)
echo ========================================================
echo.
echo Sedang mendeteksi MySQL dan mengimport file peminjaman_proyektor.sql...
echo.

set MYSQL_BIN=

:: Cek apakah command mysql ada di PATH
where mysql >nul 2>&1
if %ERRORLEVEL% EQU 0 set MYSQL_BIN=mysql

:: Cek XAMPP C:
if not defined MYSQL_BIN (
    if exist "C:\xampp\mysql\bin\mysql.exe" set MYSQL_BIN="C:\xampp\mysql\bin\mysql.exe"
)

:: Cek XAMPP D:
if not defined MYSQL_BIN (
    if exist "D:\xampp\mysql\bin\mysql.exe" set MYSQL_BIN="D:\xampp\mysql\bin\mysql.exe"
)

:: Cek Laragon C:
if not defined MYSQL_BIN (
    for /d %%d in ("C:\laragon\bin\mysql\mysql-*") do (
        if exist "%%~d\bin\mysql.exe" set MYSQL_BIN="%%~d\bin\mysql.exe"
    )
)

:: Cek Laragon D:
if not defined MYSQL_BIN (
    for /d %%d in ("D:\laragon\bin\mysql\mysql-*") do (
        if exist "%%~d\bin\mysql.exe" set MYSQL_BIN="%%~d\bin\mysql.exe"
    )
)

:: Cek Program Files MySQL
if not defined MYSQL_BIN (
    for /d %%d in ("C:\Program Files\MySQL\MySQL Server *\bin") do (
        if exist "%%~d\mysql.exe" set MYSQL_BIN="%%~d\mysql.exe"
    )
)

if defined MYSQL_BIN (
    echo Menggunakan MySQL binary: %MYSQL_BIN%
    %MYSQL_BIN% -u root -e "CREATE DATABASE IF NOT EXISTS simpro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    %MYSQL_BIN% -u root simpro < "%~dp0peminjaman_proyektor.sql"
    echo.
    echo ========================================================
    echo [BERHASIL] Database 'simpro' BERHASIL DI-IMPORT!
    echo Pembagian 27 Kelas Resmi:
    echo - AKL (3 Kelas) : X AKL, XI AKL, XII AKL
    echo - MP  (6 Kelas) : X MP 1-2, XI MP 1-2, XII MP 1-2
    echo - TSM (6 Kelas) : X TSM 1-2, XI TSM 1-2, XII TSM 1-2
    echo - TKR (6 Kelas) : X TKR 1-2, XI TKR 1-2, XII TKR 1-2
    echo - TKJ (6 Kelas) : X TKJ 1-2, XI TKJ 1-2, XII TKJ 1-2
    echo Total: 27 Kelas Rombel Lengkap + 43 Guru + 5 Proyektor.
    echo ========================================================
) else (
    echo [INFO] Path otomatis mysql.exe tidak terdeteksi.
    echo Silakan import file 'peminjaman_proyektor.sql' lewat phpMyAdmin:
    echo 1. Buka http://localhost/phpmyadmin
    echo 2. Pilih database 'simpro'
    echo 3. Klik tab 'Import' dan pilih file: %~dp0peminjaman_proyektor.sql
)

echo.
pause
