-- =====================================================================
-- DATABASE SCHEMA: peminjaman_proyektor
-- Sistem Informasi Manajemen & Peminjaman Proyektor Sekolah (SIMPRO)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `simpro` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `simpro`;

-- ---------------------------------------------------------------------
-- 1. TABEL: proyektor
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `proyektor`;
CREATE TABLE `proyektor` (
  `id` VARCHAR(20) NOT NULL PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `model` VARCHAR(150) NOT NULL,
  `bag_color` VARCHAR(50) NOT NULL,
  `bag_color_hex` VARCHAR(20) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `status` ENUM('tersedia', 'dipinjam', 'maintenance') NOT NULL DEFAULT 'tersedia',
  `lamp_hours` VARCHAR(50) DEFAULT '100 Jam',
  `last_maintenance` DATE NULL,
  `specs` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. TABEL: guru (43 Guru Resmi)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `guru`;
CREATE TABLE `guru` (
  `id` VARCHAR(20) NOT NULL PRIMARY KEY,
  `nip` VARCHAR(50) DEFAULT '-',
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) DEFAULT '',
  `status` ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. TABEL: kelas (21 Kelas & Fasilitas)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `kelas`;
CREATE TABLE `kelas` (
  `id` VARCHAR(20) NOT NULL PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `grade` VARCHAR(20) NOT NULL,
  `major` VARCHAR(20) NOT NULL,
  `building` VARCHAR(100) NOT NULL,
  `homeroom_teacher` VARCHAR(150) DEFAULT '',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. TABEL: peminjaman (Audit Trail & Log Transaksi)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `peminjaman`;
CREATE TABLE `peminjaman` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `unit_id` VARCHAR(20) NOT NULL,
  `unit_name` VARCHAR(100) NOT NULL,
  `teacher_name` VARCHAR(150) NOT NULL,
  `destination_class` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(100) DEFAULT 'PBM Multimedia',
  `duration_period` VARCHAR(50) NOT NULL,
  `borrow_time` DATETIME NOT NULL,
  `return_time` DATETIME NULL,
  `status` ENUM('aktif', 'selesai', 'maintenance') NOT NULL DEFAULT 'aktif',
  `checklist_borrow` JSON NULL,
  `checklist_return` JSON NULL,
  `condition_return` ENUM('baik', 'perlu_perhatian', 'rusak') NULL,
  `complaints` JSON NULL,
  `complaint_note` TEXT NULL,
  `needs_direct_action` TINYINT(1) DEFAULT 0,
  `notes` TEXT NULL,
  `hours_used` DECIMAL(5,2) DEFAULT 0.00,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_unit_id` (`unit_id`),
  INDEX `idx_teacher_name` (`teacher_name`),
  INDEX `idx_borrow_time` (`borrow_time`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. TABEL: komplain_sarpras (Tindakan Langsung Maintenance)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `komplain_sarpras`;
CREATE TABLE `komplain_sarpras` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `loan_id` VARCHAR(50) NOT NULL,
  `unit_id` VARCHAR(20) NOT NULL,
  `complaint_type` VARCHAR(255) NOT NULL,
  `notes` TEXT NULL,
  `is_resolved` TINYINT(1) DEFAULT 0,
  `resolved_at` DATETIME NULL,
  `resolved_by` VARCHAR(100) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_komplain_unit` (`unit_id`),
  INDEX `idx_is_resolved` (`is_resolved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- DATA AWAL (SEED DATA)
-- =====================================================================

-- DATA 5 UNIT PROYEKTOR
INSERT INTO `proyektor` (`id`, `code`, `name`, `model`, `bag_color`, `bag_color_hex`, `location`, `status`, `lamp_hours`, `last_maintenance`, `specs`) VALUES
('PRJ-01', 'PRJ-01', 'Proyektor 01', 'Epson EB-E500 (3300 Lumens)', 'Tas Merah / Tag Merah', '#ef4444', 'Ruang Sarpras / Rak A1', 'tersedia', '320 Jam', '2026-09-15', '3300 ANSI Lumens, Resolusi XGA 1024x768, HDMI/VGA, Speaker 2W'),
('PRJ-02', 'PRJ-02', 'Proyektor 02', 'Epson EB-X500 (3600 Lumens)', 'Tas Biru / Tag Biru', '#3b82f6', 'Ruang Sarpras / Rak A2', 'dipinjam', '480 Jam', '2026-09-20', '3600 ANSI Lumens, Resolusi XGA 1024x768, HDMI/VGA/USB, Wireless Ready'),
('PRJ-03', 'PRJ-03', 'Proyektor 03', 'BenQ MX535 (3600 Lumens DLP)', 'Tas Hitam / Tag Hitam', '#334155', 'Ruang Sarpras / Rak A3', 'tersedia', '210 Jam', '2026-09-28', '3600 ANSI Lumens DLP, Contrast 15000:1, Dual HDMI, SmartEco Mode'),
('PRJ-04', 'PRJ-04', 'Proyektor 04', 'InFocus IN114x (3800 Lumens)', 'Tas Abu-Abu / Tag Abu', '#64748b', 'Ruang Sarpras / Rak A4', 'dipinjam', '560 Jam', '2026-09-10', '3800 ANSI Lumens DLP, HDMI 1.4, 3D Support, Lampu Long-Life 10.000 Jam'),
('PRJ-05', 'PRJ-05', 'Proyektor 05', 'Epson EB-E500 (3300 Lumens)', 'Tas Hijau / Tag Hijau', '#10b981', 'Ruang Sarpras / Rak A5', 'tersedia', '190 Jam', '2026-10-01', '3300 ANSI Lumens 3LCD, HDMI/VGA, Keystone Correction Horizontal/Vertical');

-- DATA 43 GURU RESMI SEKOLAH
INSERT INTO `guru` (`id`, `nip`, `name`, `phone`, `status`) VALUES
('TCH-001', '-', 'REZA PATRIOTA PUTRA, S.Kom', '', 'aktif'),
('TCH-002', '-', 'TAMAN SASTRA DIKARNA, S.Pd', '', 'aktif'),
('TCH-003', '-', 'SUHARNO, S.PdI', '', 'aktif'),
('TCH-004', '-', 'SAMSUL HUDA, S.Pd', '', 'aktif'),
('TCH-005', '-', 'AHMAD HUSEN NASUTION, SS', '', 'aktif'),
('TCH-006', '-', 'WISNU NARA UTAMA, S.Pd', '', 'aktif'),
('TCH-007', '-', 'FITRI MULYANI, S.Pd', '', 'aktif'),
('TCH-008', '-', 'DERA ISMAWATI, A.Md', '', 'aktif'),
('TCH-009', '-', 'WIDONI SANTOSO, S.Pd', '', 'aktif'),
('TCH-010', '-', 'SRI TITA MULYATI', '', 'aktif'),
('TCH-011', '-', 'EUIS SUPRIHATIN, S.Pd', '', 'aktif'),
('TCH-012', '-', 'WIDA HARTANI, S.Pd', '', 'aktif'),
('TCH-013', '-', 'LUTHFI AHMAD NAZHIF, S.Pd', '', 'aktif'),
('TCH-014', '-', 'WIDJAYANTI, S.Sos', '', 'aktif'),
('TCH-015', '-', 'DEDE HIDAYATULLAH', '', 'aktif'),
('TCH-016', '-', 'KOKO, S.T', '', 'aktif'),
('TCH-017', '-', 'CHRISTIN SIREGAR, S.Pd', '', 'aktif'),
('TCH-018', '-', 'MUHAMMAD SYAFE\'I, S.Pd', '', 'aktif'),
('TCH-019', '-', 'MUHAMMAD ANDIKA PRAWIRA, S.Kom', '', 'aktif'),
('TCH-020', '-', 'YULISTIO HARDIYANTO, S.T', '', 'aktif'),
('TCH-021', '-', 'KUAT SUPARTO, S.T', '', 'aktif'),
('TCH-022', '-', 'ASTRI WULANDARI, S.Pd', '', 'aktif'),
('TCH-023', '-', 'AGUNG AINUL HAKIM, S.Pd', '', 'aktif'),
('TCH-024', '-', 'SUTRISNO', '', 'aktif'),
('TCH-025', '-', 'MUHAMAD ALBAR SAPIN, S.M', '', 'aktif'),
('TCH-026', '-', 'TIARA SHANTI HARTONO, S.Sos', '', 'aktif'),
('TCH-027', '-', 'OKTARI QOMIMIS SYATUN, S.Pd', '', 'aktif'),
('TCH-028', '-', 'CATUR WULANDARI, A.Md', '', 'aktif'),
('TCH-029', '-', 'DWIANA RIKASARI, S.AP', '', 'aktif'),
('TCH-030', '-', 'IDAYATUL MUSTAFIDAH, S.E', '', 'aktif'),
('TCH-031', '-', 'RISKA AMELIA, S.M', '', 'aktif'),
('TCH-032', '-', 'SISTER NINDA PUTRI, S.Pd', '', 'aktif'),
('TCH-033', '-', 'DELA AMELIA PUTRI, S.Pd', '', 'aktif'),
('TCH-034', '-', 'WIWIK UMAYAH, S.Pd', '', 'aktif'),
('TCH-035', '-', 'ENDANG KURNIAWAN, S.T', '', 'aktif'),
('TCH-036', '-', 'FAUZI, S.Kom', '', 'aktif'),
('TCH-037', '-', 'AZMIRAL AZIZ, S.Pd', '', 'aktif'),
('TCH-038', '-', 'MUHAMMAD SYAHCTIKO, S.Pd', '', 'aktif'),
('TCH-039', '-', 'ISMAIL', '', 'aktif'),
('TCH-040', '-', 'SUDIYANI', '', 'aktif'),
('TCH-041', '-', 'ATIM', '', 'aktif'),
('TCH-042', '-', 'ENDONG', '', 'aktif'),
('TCH-043', '-', 'BUCHORI', '', 'aktif');

-- DATA 27 KELAS (AKL: 1 per grade, MP: 2 per grade, TSM: 2 per grade, TKR: 2 per grade, TKJ: 2 per grade)
INSERT INTO `kelas` (`id`, `name`, `grade`, `major`, `building`, `homeroom_teacher`) VALUES
('CLS-01', 'X AKL', 'X', 'AKL', 'Gedung A Lantai 1', 'TIARA SHANTI HARTONO, S.Sos'),
('CLS-02', 'X MP 1', 'X', 'MP', 'Gedung A Lantai 1', 'DWIANA RIKASARI, S.AP'),
('CLS-03', 'X MP 2', 'X', 'MP', 'Gedung A Lantai 1', 'IDAYATUL MUSTAFIDAH, S.E'),
('CLS-04', 'X TSM 1', 'X', 'TSM', 'Gedung B Lantai 1', 'ENDANG KURNIAWAN, S.T'),
('CLS-05', 'X TSM 2', 'X', 'TSM', 'Gedung B Lantai 1', 'KOKO, S.T'),
('CLS-06', 'X TKR 1', 'X', 'TKR', 'Gedung B Lantai 2', 'YULISTIO HARDIYANTO, S.T'),
('CLS-07', 'X TKR 2', 'X', 'TKR', 'Gedung B Lantai 2', 'KUAT SUPARTO, S.T'),
('CLS-08', 'X TKJ 1', 'X', 'TKJ', 'Gedung C Lantai 1', 'REZA PATRIOTA PUTRA, S.Kom'),
('CLS-09', 'X TKJ 2', 'X', 'TKJ', 'Gedung C Lantai 1', 'MUHAMMAD ANDIKA PRAWIRA, S.Kom'),

('CLS-10', 'XI AKL', 'XI', 'AKL', 'Gedung A Lantai 2', 'CATUR WULANDARI, A.Md'),
('CLS-11', 'XI MP 1', 'XI', 'MP', 'Gedung A Lantai 2', 'RISKA AMELIA, S.M'),
('CLS-12', 'XI MP 2', 'XI', 'MP', 'Gedung A Lantai 2', 'MUHAMAD ALBAR SAPIN, S.M'),
('CLS-13', 'XI TSM 1', 'XI', 'TSM', 'Gedung B Lantai 1', 'TAMAN SASTRA DIKARNA, S.Pd'),
('CLS-14', 'XI TSM 2', 'XI', 'TSM', 'Gedung B Lantai 1', 'WISNU NARA UTAMA, S.Pd'),
('CLS-15', 'XI TKR 1', 'XI', 'TKR', 'Gedung B Lantai 2', 'SAMSUL HUDA, S.Pd'),
('CLS-16', 'XI TKR 2', 'XI', 'TKR', 'Gedung B Lantai 2', 'AGUNG AINUL HAKIM, S.Pd'),
('CLS-17', 'XI TKJ 1', 'XI', 'TKJ', 'Gedung C Lantai 2', 'FAUZI, S.Kom'),
('CLS-18', 'XI TKJ 2', 'XI', 'TKJ', 'Gedung C Lantai 2', 'LUTHFI AHMAD NAZHIF, S.Pd'),

('CLS-19', 'XII AKL', 'XII', 'AKL', 'Gedung A Lantai 3', 'OKTARI QOMIMIS SYATUN, S.Pd'),
('CLS-20', 'XII MP 1', 'XII', 'MP', 'Gedung A Lantai 3', 'FITRI MULYANI, S.Pd'),
('CLS-21', 'XII MP 2', 'XII', 'MP', 'Gedung A Lantai 3', 'EUIS SUPRIHATIN, S.Pd'),
('CLS-22', 'XII TSM 1', 'XII', 'TSM', 'Gedung D Lantai 1', 'AHMAD HUSEN NASUTION, SS'),
('CLS-23', 'XII TSM 2', 'XII', 'TSM', 'Gedung D Lantai 1', 'WIDONI SANTOSO, S.Pd'),
('CLS-24', 'XII TKR 1', 'XII', 'TKR', 'Gedung D Lantai 2', 'ASTRI WULANDARI, S.Pd'),
('CLS-25', 'XII TKR 2', 'XII', 'TKR', 'Gedung D Lantai 2', 'DERA ISMAWATI, A.Md'),
('CLS-26', 'XII TKJ 1', 'XII', 'TKJ', 'Gedung C Lantai 3', 'CHRISTIN SIREGAR, S.Pd'),
('CLS-27', 'XII TKJ 2', 'XII', 'TKJ', 'Gedung C Lantai 3', 'WIDA HARTANI, S.Pd');

-- DATA AUDIT TRANSAKSI AKTIF / HISTORI
INSERT INTO `peminjaman` (`id`, `unit_id`, `unit_name`, `teacher_name`, `destination_class`, `subject`, `duration_period`, `borrow_time`, `return_time`, `status`, `checklist_borrow`, `checklist_return`, `condition_return`, `notes`, `hours_used`) VALUES
('LOG-20261008-01', 'PRJ-02', 'Proyektor 02', 'REZA PATRIOTA PUTRA, S.Kom', 'XII TKJ 1', 'PBM Multimedia', 'Jam ke-1', NOW() - INTERVAL 45 MINUTE, NULL, 'aktif', '{"powerCable":true,"hdmiCable":true,"socketPlug":true,"remoteBag":true,"wirelessDongle":true}', NULL, NULL, 'Praktek materi instalasi jaringan fiber optic', 2.0),
('LOG-20261008-02', 'PRJ-04', 'Proyektor 04', 'FITRI MULYANI, S.Pd', 'XI MP 2', 'PBM Multimedia', 'Jam ke-3', NOW() - INTERVAL 25 MINUTE, NULL, 'aktif', '{"powerCable":true,"hdmiCable":true,"socketPlug":true,"remoteBag":true,"wirelessDongle":true}', NULL, NULL, 'Presentasi materi administrasi kepegawaian', 2.0),
('LOG-20261007-01', 'PRJ-01', 'Proyektor 01', 'TAMAN SASTRA DIKARNA, S.Pd', 'X AKL', 'PBM Multimedia', 'Jam ke-2', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 22 HOUR, 'selesai', '{"powerCable":true,"hdmiCable":true,"socketPlug":true,"remoteBag":true,"wirelessDongle":true}', '{"powerCable":true,"hdmiCable":true,"socketPlug":true,"remoteBag":true,"wirelessDongle":true}', 'baik', 'PBM selesai tepat waktu, kondisi proyektor prima', 2.0);
