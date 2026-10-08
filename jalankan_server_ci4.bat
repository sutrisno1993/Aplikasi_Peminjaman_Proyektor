@echo off
title Backend CodeIgniter 4 - SIMPRO
echo ========================================================
echo   BACKEND SERVER CODEIGNITER 4 (REST API)
echo ========================================================
echo.

set PHP_BIN=php
if exist "C:\xampp\php\php.exe" set PHP_BIN=C:\xampp\php\php.exe
if exist "C:\laragon\bin\php\php-8.2*\php.exe" set PHP_BIN=C:\laragon\bin\php\php-8.2*\php.exe

echo Menggunakan PHP: %PHP_BIN%
echo Menjalankan Backend CI4 di http://localhost:8080 ...
echo.

"%PHP_BIN%" spark serve --port 8080
pause
