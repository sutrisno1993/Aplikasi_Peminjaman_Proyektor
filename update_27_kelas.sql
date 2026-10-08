-- =====================================================================
-- SCRIPT UPDATE 27 KELAS SIMPRO
-- =====================================================================


-- 1. Hapus seluruh data kelas lama
DELETE FROM `kelas`;

-- 2. Insert 27 Kelas Lengkap (AKL: 1 per grade, MP: 2 per grade, TSM: 2 per grade, TKR: 2 per grade, TKJ: 2 per grade)
INSERT INTO `kelas` (`id`, `name`, `grade`, `major`, `building`, `homeroom_teacher`) VALUES
-- KELAS X (9 Rombel)
('CLS-01', 'X AKL', 'X', 'AKL', 'Gedung A Lantai 1', 'TIARA SHANTI HARTONO, S.Sos'),
('CLS-02', 'X MP 1', 'X', 'MP', 'Gedung A Lantai 1', 'DWIANA RIKASARI, S.AP'),
('CLS-03', 'X MP 2', 'X', 'MP', 'Gedung A Lantai 1', 'IDAYATUL MUSTAFIDAH, S.E'),
('CLS-04', 'X TSM 1', 'X', 'TSM', 'Gedung B Lantai 1', 'ENDANG KURNIAWAN, S.T'),
('CLS-05', 'X TSM 2', 'X', 'TSM', 'Gedung B Lantai 1', 'KOKO, S.T'),
('CLS-06', 'X TKR 1', 'X', 'TKR', 'Gedung B Lantai 2', 'YULISTIO HARDIYANTO, S.T'),
('CLS-07', 'X TKR 2', 'X', 'TKR', 'Gedung B Lantai 2', 'KUAT SUPARTO, S.T'),
('CLS-08', 'X TKJ 1', 'X', 'TKJ', 'Gedung C Lantai 1', 'REZA PATRIOTA PUTRA, S.Kom'),
('CLS-09', 'X TKJ 2', 'X', 'TKJ', 'Gedung C Lantai 1', 'MUHAMMAD ANDIKA PRAWIRA, S.Kom'),

-- KELAS XI (9 Rombel)
('CLS-10', 'XI AKL', 'XI', 'AKL', 'Gedung A Lantai 2', 'CATUR WULANDARI, A.Md'),
('CLS-11', 'XI MP 1', 'XI', 'MP', 'Gedung A Lantai 2', 'RISKA AMELIA, S.M'),
('CLS-12', 'XI MP 2', 'XI', 'MP', 'Gedung A Lantai 2', 'MUHAMAD ALBAR SAPIN, S.M'),
('CLS-13', 'XI TSM 1', 'XI', 'TSM', 'Gedung B Lantai 1', 'TAMAN SASTRA DIKARNA, S.Pd'),
('CLS-14', 'XI TSM 2', 'XI', 'TSM', 'Gedung B Lantai 1', 'WISNU NARA UTAMA, S.Pd'),
('CLS-15', 'XI TKR 1', 'XI', 'TKR', 'Gedung B Lantai 2', 'SAMSUL HUDA, S.Pd'),
('CLS-16', 'XI TKR 2', 'XI', 'TKR', 'Gedung B Lantai 2', 'AGUNG AINUL HAKIM, S.Pd'),
('CLS-17', 'XI TKJ 1', 'XI', 'TKJ', 'Gedung C Lantai 2', 'FAUZI, S.Kom'),
('CLS-18', 'XI TKJ 2', 'XI', 'TKJ', 'Gedung C Lantai 2', 'LUTHFI AHMAD NAZHIF, S.Pd'),

-- KELAS XII (9 Rombel)
('CLS-19', 'XII AKL', 'XII', 'AKL', 'Gedung A Lantai 3', 'OKTARI QOMIMIS SYATUN, S.Pd'),
('CLS-20', 'XII MP 1', 'XII', 'MP', 'Gedung A Lantai 3', 'FITRI MULYANI, S.Pd'),
('CLS-21', 'XII MP 2', 'XII', 'MP', 'Gedung A Lantai 3', 'EUIS SUPRIHATIN, S.Pd'),
('CLS-22', 'XII TSM 1', 'XII', 'TSM', 'Gedung D Lantai 1', 'AHMAD HUSEN NASUTION, SS'),
('CLS-23', 'XII TSM 2', 'XII', 'TSM', 'Gedung D Lantai 1', 'WIDONI SANTOSO, S.Pd'),
('CLS-24', 'XII TKR 1', 'XII', 'TKR', 'Gedung D Lantai 2', 'ASTRI WULANDARI, S.Pd'),
('CLS-25', 'XII TKR 2', 'XII', 'TKR', 'Gedung D Lantai 2', 'DERA ISMAWATI, A.Md'),
('CLS-26', 'XII TKJ 1', 'XII', 'TKJ', 'Gedung C Lantai 3', 'CHRISTIN SIREGAR, S.Pd'),
('CLS-27', 'XII TKJ 2', 'XII', 'TKJ', 'Gedung C Lantai 3', 'WIDA HARTANI, S.Pd');

-- 3. Cek hasil data kelas
SELECT `grade`, `major`, `name`, `building`, `homeroom_teacher` FROM `kelas` ORDER BY `id` ASC;
