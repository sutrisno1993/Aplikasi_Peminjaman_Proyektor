<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AppSeeder extends Seeder
{
    public function run()
    {
        // 1. SEED PROYEKTOR (5 Unit)
        $projectors = [
            [
                'id'               => 'PRJ-01',
                'code'             => 'PRJ-01',
                'name'             => 'Proyektor 01',
                'model'            => 'Epson EB-E500 (3300 Lumens)',
                'bag_color'        => 'Tas Merah / Tag Merah',
                'bag_color_hex'    => '#ef4444',
                'location'         => 'Ruang Sarpras / Rak A1',
                'status'           => 'tersedia',
                'lamp_hours'       => '320 Jam',
                'last_maintenance' => '2026-09-15',
                'specs'            => '3300 ANSI Lumens, Resolusi XGA 1024x768, HDMI/VGA, Speaker 2W',
                'created_at'       => date('Y-m-d H:i:s'),
                'updated_at'       => date('Y-m-d H:i:s'),
            ],
            [
                'id'               => 'PRJ-02',
                'code'             => 'PRJ-02',
                'name'             => 'Proyektor 02',
                'model'            => 'Epson EB-X500 (3600 Lumens)',
                'bag_color'        => 'Tas Biru / Tag Biru',
                'bag_color_hex'    => '#3b82f6',
                'location'         => 'Ruang Sarpras / Rak A2',
                'status'           => 'dipinjam',
                'lamp_hours'       => '480 Jam',
                'last_maintenance' => '2026-09-20',
                'specs'            => '3600 ANSI Lumens, Resolusi XGA 1024x768, HDMI/VGA/USB, Wireless Ready',
                'created_at'       => date('Y-m-d H:i:s'),
                'updated_at'       => date('Y-m-d H:i:s'),
            ],
            [
                'id'               => 'PRJ-03',
                'code'             => 'PRJ-03',
                'name'             => 'Proyektor 03',
                'model'            => 'BenQ MX535 (3600 Lumens DLP)',
                'bag_color'        => 'Tas Hitam / Tag Hitam',
                'bag_color_hex'    => '#334155',
                'location'         => 'Ruang Sarpras / Rak A3',
                'status'           => 'tersedia',
                'lamp_hours'       => '210 Jam',
                'last_maintenance' => '2026-09-28',
                'specs'            => '3600 ANSI Lumens DLP, Contrast 15000:1, Dual HDMI, SmartEco Mode',
                'created_at'       => date('Y-m-d H:i:s'),
                'updated_at'       => date('Y-m-d H:i:s'),
            ],
            [
                'id'               => 'PRJ-04',
                'code'             => 'PRJ-04',
                'name'             => 'Proyektor 04',
                'model'            => 'InFocus IN114x (3800 Lumens)',
                'bag_color'        => 'Tas Abu-Abu / Tag Abu',
                'bag_color_hex'    => '#64748b',
                'location'         => 'Ruang Sarpras / Rak A4',
                'status'           => 'dipinjam',
                'lamp_hours'       => '560 Jam',
                'last_maintenance' => '2026-09-10',
                'specs'            => '3800 ANSI Lumens DLP, HDMI 1.4, 3D Support, Lampu Long-Life 10.000 Jam',
                'created_at'       => date('Y-m-d H:i:s'),
                'updated_at'       => date('Y-m-d H:i:s'),
            ],
            [
                'id'               => 'PRJ-05',
                'code'             => 'PRJ-05',
                'name'             => 'Proyektor 05',
                'model'            => 'Epson EB-E500 (3300 Lumens)',
                'bag_color'        => 'Tas Hijau / Tag Hijau',
                'bag_color_hex'    => '#10b981',
                'location'         => 'Ruang Sarpras / Rak A5',
                'status'           => 'tersedia',
                'lamp_hours'       => '190 Jam',
                'last_maintenance' => '2026-10-01',
                'specs'            => '3300 ANSI Lumens 3LCD, HDMI/VGA, Keystone Correction Horizontal/Vertical',
                'created_at'       => date('Y-m-d H:i:s'),
                'updated_at'       => date('Y-m-d H:i:s'),
            ],
        ];
        $this->db->table('proyektor')->ignore(true)->insertBatch($projectors);

        // 2. SEED 43 GURU RESMI
        $teachers = [
            ['id' => 'TCH-001', 'nip' => '-', 'name' => 'REZA PATRIOTA PUTRA, S.Kom', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-002', 'nip' => '-', 'name' => 'TAMAN SASTRA DIKARNA, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-003', 'nip' => '-', 'name' => 'SUHARNO, S.PdI', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-004', 'nip' => '-', 'name' => 'SAMSUL HUDA, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-005', 'nip' => '-', 'name' => 'AHMAD HUSEN NASUTION, SS', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-006', 'nip' => '-', 'name' => 'WISNU NARA UTAMA, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-007', 'nip' => '-', 'name' => 'FITRI MULYANI, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-008', 'nip' => '-', 'name' => 'DERA ISMAWATI, A.Md', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-009', 'nip' => '-', 'name' => 'WIDONI SANTOSO, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-010', 'nip' => '-', 'name' => 'SRI TITA MULYATI', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-011', 'nip' => '-', 'name' => 'EUIS SUPRIHATIN, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-012', 'nip' => '-', 'name' => 'WIDA HARTANI, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-013', 'nip' => '-', 'name' => 'LUTHFI AHMAD NAZHIF, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-014', 'nip' => '-', 'name' => 'WIDJAYANTI, S.Sos', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-015', 'nip' => '-', 'name' => 'DEDE HIDAYATULLAH', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-016', 'nip' => '-', 'name' => 'KOKO, S.T', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-017', 'nip' => '-', 'name' => 'CHRISTIN SIREGAR, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-018', 'nip' => '-', 'name' => 'MUHAMMAD SYAFE\'I, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-019', 'nip' => '-', 'name' => 'MUHAMMAD ANDIKA PRAWIRA, S.Kom', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-020', 'nip' => '-', 'name' => 'YULISTIO HARDIYANTO, S.T', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-021', 'nip' => '-', 'name' => 'KUAT SUPARTO, S.T', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-022', 'nip' => '-', 'name' => 'ASTRI WULANDARI, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-023', 'nip' => '-', 'name' => 'AGUNG AINUL HAKIM, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-024', 'nip' => '-', 'name' => 'SUTRISNO', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-025', 'nip' => '-', 'name' => 'MUHAMAD ALBAR SAPIN, S.M', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-026', 'nip' => '-', 'name' => 'TIARA SHANTI HARTONO, S.Sos', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-027', 'nip' => '-', 'name' => 'OKTARI QOMIMIS SYATUN, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-028', 'nip' => '-', 'name' => 'CATUR WULANDARI, A.Md', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-029', 'nip' => '-', 'name' => 'DWIANA RIKASARI, S.AP', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-030', 'nip' => '-', 'name' => 'IDAYATUL MUSTAFIDAH, S.E', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-031', 'nip' => '-', 'name' => 'RISKA AMELIA, S.M', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-032', 'nip' => '-', 'name' => 'SISTER NINDA PUTRI, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-033', 'nip' => '-', 'name' => 'DELA AMELIA PUTRI, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-034', 'nip' => '-', 'name' => 'WIWIK UMAYAH, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-035', 'nip' => '-', 'name' => 'ENDANG KURNIAWAN, S.T', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-036', 'nip' => '-', 'name' => 'FAUZI, S.Kom', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-037', 'nip' => '-', 'name' => 'AZMIRAL AZIZ, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-038', 'nip' => '-', 'name' => 'MUHAMMAD SYAHCTIKO, S.Pd', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-039', 'nip' => '-', 'name' => 'ISMAIL', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-040', 'nip' => '-', 'name' => 'SUDIYANI', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-041', 'nip' => '-', 'name' => 'ATIM', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-042', 'nip' => '-', 'name' => 'ENDONG', 'phone' => '', 'status' => 'aktif'],
            ['id' => 'TCH-043', 'nip' => '-', 'name' => 'BUCHORI', 'phone' => '', 'status' => 'aktif'],
        ];
        foreach ($teachers as &$t) {
            $t['created_at'] = date('Y-m-d H:i:s');
            $t['updated_at'] = date('Y-m-d H:i:s');
        }
        $this->db->table('guru')->ignore(true)->insertBatch($teachers);

        // 3. SEED 21 KELAS
        $classes = [
            ['id' => 'CLS-01', 'name' => 'X TKJ 1', 'grade' => 'X', 'major' => 'TKJ', 'building' => 'Gedung B Lantai 1', 'homeroom_teacher' => 'REZA PATRIOTA PUTRA, S.Kom'],
            ['id' => 'CLS-02', 'name' => 'X TKJ 2', 'grade' => 'X', 'major' => 'TKJ', 'building' => 'Gedung B Lantai 1', 'homeroom_teacher' => 'TAMAN SASTRA DIKARNA, S.Pd'],
            ['id' => 'CLS-03', 'name' => 'X RPL 1', 'grade' => 'X', 'major' => 'RPL', 'building' => 'Gedung B Lantai 2', 'homeroom_teacher' => 'MUHAMMAD ANDIKA PRAWIRA, S.Kom'],
            ['id' => 'CLS-04', 'name' => 'X RPL 2', 'grade' => 'X', 'major' => 'RPL', 'building' => 'Gedung B Lantai 2', 'homeroom_teacher' => 'FITRI MULYANI, S.Pd'],
            ['id' => 'CLS-05', 'name' => 'X DKV 1', 'grade' => 'X', 'major' => 'DKV', 'building' => 'Gedung C Lantai 1', 'homeroom_teacher' => 'DERA ISMAWATI, A.Md'],
            ['id' => 'CLS-06', 'name' => 'X AKL 1', 'grade' => 'X', 'major' => 'AKL', 'building' => 'Gedung C Lantai 2', 'homeroom_teacher' => 'TIARA SHANTI HARTONO, S.Sos'],
            ['id' => 'CLS-07', 'name' => 'XI TKJ 1', 'grade' => 'XI', 'major' => 'TKJ', 'building' => 'Gedung B Lantai 1', 'homeroom_teacher' => 'SAMSUL HUDA, S.Pd'],
            ['id' => 'CLS-08', 'name' => 'XI TKJ 2', 'grade' => 'XI', 'major' => 'TKJ', 'building' => 'Gedung B Lantai 1', 'homeroom_teacher' => 'WISNU NARA UTAMA, S.Pd'],
            ['id' => 'CLS-09', 'name' => 'XI RPL 1', 'grade' => 'XI', 'major' => 'RPL', 'building' => 'Gedung B Lantai 2', 'homeroom_teacher' => 'FAUZI, S.Kom'],
            ['id' => 'CLS-10', 'name' => 'XI RPL 2', 'grade' => 'XI', 'major' => 'RPL', 'building' => 'Gedung B Lantai 2', 'homeroom_teacher' => 'LUTHFI AHMAD NAZHIF, S.Pd'],
            ['id' => 'CLS-11', 'name' => 'XI DKV 1', 'grade' => 'XI', 'major' => 'DKV', 'building' => 'Gedung C Lantai 1', 'homeroom_teacher' => 'CHRISTIN SIREGAR, S.Pd'],
            ['id' => 'CLS-12', 'name' => 'XI AKL 1', 'grade' => 'XI', 'major' => 'AKL', 'building' => 'Gedung C Lantai 2', 'homeroom_teacher' => 'DWIANA RIKASARI, S.AP'],
            ['id' => 'CLS-13', 'name' => 'XII TKJ 1', 'grade' => 'XII', 'major' => 'TKJ', 'building' => 'Gedung A Lantai 2', 'homeroom_teacher' => 'KOKO, S.T'],
            ['id' => 'CLS-14', 'name' => 'XII TKJ 2', 'grade' => 'XII', 'major' => 'TKJ', 'building' => 'Gedung A Lantai 2', 'homeroom_teacher' => 'KUAT SUPARTO, S.T'],
            ['id' => 'CLS-15', 'name' => 'XII RPL 1', 'grade' => 'XII', 'major' => 'RPL', 'building' => 'Gedung A Lantai 3', 'homeroom_teacher' => 'YULISTIO HARDIYANTO, S.T'],
            ['id' => 'CLS-16', 'name' => 'XII RPL 2', 'grade' => 'XII', 'major' => 'RPL', 'building' => 'Gedung A Lantai 3', 'homeroom_teacher' => 'MUHAMAD ALBAR SAPIN, S.M'],
            ['id' => 'CLS-17', 'name' => 'XII DKV 1', 'grade' => 'XII', 'major' => 'DKV', 'building' => 'Gedung C Lantai 1', 'homeroom_teacher' => 'ASTRI WULANDARI, S.Pd'],
            ['id' => 'CLS-18', 'name' => 'XII AKL 1', 'grade' => 'XII', 'major' => 'AKL', 'building' => 'Gedung C Lantai 2', 'homeroom_teacher' => 'IDAYATUL MUSTAFIDAH, S.E'],
            ['id' => 'CLS-19', 'name' => 'Aula Utama', 'grade' => 'Fasilitas', 'major' => 'Umum', 'building' => 'Gedung Pusat Lantai 2', 'homeroom_teacher' => 'SUTRISNO'],
            ['id' => 'CLS-20', 'name' => 'Lab Multimedia', 'grade' => 'Fasilitas', 'major' => 'TIK', 'building' => 'Gedung B Lantai 3', 'homeroom_teacher' => 'Kepala Lab TIK'],
            ['id' => 'CLS-21', 'name' => 'Ruang Rapat Guru', 'grade' => 'Fasilitas', 'major' => 'Umum', 'building' => 'Gedung Administrasi Lantai 1', 'homeroom_teacher' => 'Sekretariat'],
        ];
        foreach ($classes as &$c) {
            $c['created_at'] = date('Y-m-d H:i:s');
            $c['updated_at'] = date('Y-m-d H:i:s');
        }
        $this->db->table('kelas')->ignore(true)->insertBatch($classes);
    }
}
