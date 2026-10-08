# 📘 Panduan Lengkap Deploy SIMPRO ke cPanel Hosting

Panduan ini berisi langkah demi langkah untuk melakukan deploy aplikasi **SIMPRO (Sistem Informasi Manajemen & Peminjaman Proyektor Sekolah)** ke hosting cPanel (berlaku untuk domain utama maupun subdomain).

---

## 📑 Daftar Isi
1. [Spesifikasi Hosting yang Dibutuhkan](#1-spesifikasi-hosting)
2. [Tahap 1: Build Frontend Production (Lokal)](#tahap-1-build-frontend-production)
3. [Tahap 2: Membuat Database MySQL di cPanel](#tahap-2-membuat-database-mysql-di-cpanel)
4. [Tahap 3: Import File SQL ke phpMyAdmin](#tahap-3-import-file-sql-ke-phpmyadmin)
5. [Tahap 4: Upload & Susun File di File Manager cPanel](#tahap-4-upload--susun-file-di-cpanel)
6. [Tahap 5: Konfigurasi File .env & Database](#tahap-5-konfigurasi-file-env--database)
7. [Tahap 6: Konfigurasi Versi PHP & Pengujian](#tahap-6-konfigurasi-versi-php--pengujian)

---

## 1. Spesifikasi Hosting
- **PHP Version**: PHP 8.2 atau lebih baru (PHP 8.2 / 8.3 direkomendasikan).
- **Ekstensi PHP Aktif**: `mysqli`, `pdo_mysql`, `intl`, `mbstring`, `json`, `curl`, `fileinfo`.
- **Fitur cPanel**: File Manager, MySQL Database Wizard, phpMyAdmin, MultiPHP Manager.

---

## Tahap 1: Build Frontend Production
Sebelum mengupload file ke cPanel, compile source code React menjadi file web siap produksi:

1. Di komputer lokal Anda, jalankan file:
   👉 **`build_frontend.bat`** *(atau jalankan perintah `npm run build` di terminal)*.
2. Proses ini akan membuat folder **`dist/`** yang berisi:
   - `index.html`
   - Folder `assets/` (berisi file `.js` dan `.css` bundle).
3. Salin/Copy seluruh isi dalam folder `dist/` (yaitu `index.html` dan folder `assets/`) ke dalam folder **`public/`** di proyek Anda.

---

## Tahap 2: Membuat Database MySQL di cPanel

1. Login ke akun **cPanel** hosting Anda.
2. Cari menu **Databases** &rarr; klik **MySQL® Database Wizard**.
3. **Langkah 1: Buat Nama Database**
   - Contoh: `username_simpro` *(catat nama lengkap database ini)*.
   - Klik **Next Step**.
4. **Langkah 2: Buat User Database**
   - Username: misal `username_simpro_user`
   - Password: buat password yang kuat (contoh: `P@ssw0rdSimpro2026!`)
   - Klik **Create User**.
5. **Langkah 3: Berikan Hak Akses (Privileges)**
   - Centang opsi **ALL PRIVILEGES**.
   - Klik **Make Changes**.

---

## Tahap 3: Import File SQL ke phpMyAdmin

1. Di cPanel, buka menu **phpMyAdmin**.
2. Di panel kiri phpMyAdmin, pilih database yang baru dibuat (`username_simpro`).
3. Klik tab **Import** di bagian atas.
4. Klik tombol **Choose File** / **Browse...** lalu pilih file:
   📄 **`peminjaman_proyektor.sql`** (atau `update_27_kelas.sql`).
5. Gulir ke bawah dan klik tombol **Import** (atau **Go**).
6. Pastikan seluruh tabel terbuat:
   - `proyektor` (5 unit)
   - `guru` (43 guru resmi)
   - `kelas` (27 rombel resmi)
   - `peminjaman`
   - `komplain_sarpras`

---

## Tahap 4: Upload & Susun File di cPanel

Ada **2 Metode Struktur Folder** yang bisa dipilih:

### 🌟 Rekomendasi: Struktur Standar CodeIgniter 4 (Paling Aman)
Struktur ini memisahkan folder inti aplikasi di luar direktori publik:

1. Di File Manager cPanel, buat folder baru di root hosting (sejajar dengan `public_html`), beri nama **`simpro_backend`**.
2. Upload dan ekstrak file berikut ke dalam folder **`/home/username/simpro_backend/`**:
   - `app/`
   - `vendor/`
   - `writable/`
   - `composer.json`
   - `.env`
3. Masuk ke dalam folder **`public_html/`** (atau folder subdomain Anda), lalu upload seluruh isi dari folder **`public/`** (beserta `index.html` dan folder `assets/` hasil build frontend).
4. Edit file **`public_html/index.php`**, sesuaikan baris `require`:
   ```php
   // Ganti baris 51 dari:
   require FCPATH . '../app/Config/Paths.php';
   
   // Menjadi:
   require FCPATH . '../simpro_backend/app/Config/Paths.php';
   ```

---

## Tahap 5: Konfigurasi File `.env` & Database

Di File Manager cPanel, edit file **`.env`** (yang berada di dalam `simpro_backend/`):

```ini
#--------------------------------------------------------------------
# ENVIRONMENT
#--------------------------------------------------------------------
CI_ENVIRONMENT = production

#--------------------------------------------------------------------
# APP
#--------------------------------------------------------------------
app.baseURL = 'https://namadomainsekolah.sch.id/'

#--------------------------------------------------------------------
# DATABASE
#--------------------------------------------------------------------
database.default.hostname = localhost
database.default.database = username_simpro
database.default.username = username_simpro_user
database.default.password = 'PasswordDatabaseAnda'
database.default.DBDriver = MySQLi
database.default.DBPrefix = ''
database.default.port = 3306
```

> [!IMPORTANT]
> Pastikan hak akses folder `writable/` disetel ke **755** atau **777** agar CodeIgniter 4 dapat menulis cache, sesi, dan log.

---

## Tahap 6: Konfigurasi Versi PHP & Pengujian

1. Di cPanel, buka menu **MultiPHP Manager**.
2. Pilih domain / subdomain aplikasi Anda, lalu set ke **PHP 8.2** atau **PHP 8.3**.
3. Buka menu **MultiPHP INI Editor** &rarr; pastikan `memory_limit` minimal `256M`.

### 🧪 Pengujian Sistem:
1. Buka URL REST API di browser:
   👉 `https://namadomainsekolah.sch.id/api/projectors`
   *Respons harus berupa JSON berisi 5 unit proyektor.*
2. Buka URL Utama di browser:
   👉 `https://namadomainsekolah.sch.id/`
   *Aplikasi SIMPRO akan tampil utuh, live terkoneksi ke MySQL cPanel.*
3. Uji coba transaksi pinjam & pengembalian di kelas untuk memastikan data tersimpan di tabel database cPanel.

---

### 🎉 Selesai!
Aplikasi SIMPRO sekarang sudah live dan siap digunakan oleh guru dan tim Sarpras sekolah.
