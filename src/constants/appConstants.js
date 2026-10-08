// Konstanta Antarmuka & Definisi Checklist SIMPRO (Data Real dari Database MySQL simpro)
export const STANDARD_CHECKLIST_ITEMS = [
  { id: 'powerCable', label: 'Kabel Power AC', description: 'Kabel daya proyektor dalam kondisi baik & tidak terkelupas' },
  { id: 'hdmiCable', label: 'Kabel HDMI / Video', description: 'Konektor emas utuh & pin tidak bengkok' },
  { id: 'socketPlug', label: 'Stop Kontak / Rol Kabel', description: 'Colokan cabang ekstensi listrik' },
  { id: 'remoteBag', label: 'Remote Control & Tas Unit', description: 'Fisik tas bersih dan resleting lancar' },
  { id: 'wirelessDongle', label: 'Wireless Dongle (Future Ready)', description: 'Modul transmisi layar nirkabel (Anycast / EzCast)' },
];

export const DURATION_PERIODS = [
  'Jam ke 1-2',
  'Jam ke 3-4',
  'Jam ke 5-6',
  'Jam ke 7-8',
  'Jam ke 9-10',
  'Jam ke-1',
  'Jam ke-2',
  'Jam ke-3',
  'Jam ke-4',
  'Jam ke-5',
  'Jam ke-6',
  'Jam ke-7',
  'Jam ke-8',
  'Jam ke-9',
  'Jam ke-10',
  'Seharian Penuh'
];

export const COMMON_COMPLAINTS = [
  'Kabel HDMI Eror / Kedip-kedip',
  'Tampilan Kurang Cerah / Lampu Redup',
  'Kabel Power Kendor / Bermasalah',
  'Audio / Speaker Tidak Bunyi',
  'Proyektor Cepat Panas / Overheat',
  'Remote Hilang / Baterai Habis',
  'Wireless Dongle Tidak Konek',
  'Lensa Buram / Perlu Dibersihkan'
];

// Daftar 27 Kelas Resmi (AKL: 1 per grade, MP: 2 per grade, TSM: 2 per grade, TKR: 2 per grade, TKJ: 2 per grade)
export const CLASS_LIST = [
  'X AKL', 'X MP 1', 'X MP 2', 'X TSM 1', 'X TSM 2', 'X TKR 1', 'X TKR 2', 'X TKJ 1', 'X TKJ 2',
  'XI AKL', 'XI MP 1', 'XI MP 2', 'XI TSM 1', 'XI TSM 2', 'XI TKR 1', 'XI TKR 2', 'XI TKJ 1', 'XI TKJ 2',
  'XII AKL', 'XII MP 1', 'XII MP 2', 'XII TSM 1', 'XII TSM 2', 'XII TKR 1', 'XII TKR 2', 'XII TKJ 1', 'XII TKJ 2'
];

export const INITIAL_CLASSES = CLASS_LIST.map((name, idx) => ({
  id: `CLS-${String(idx + 1).padStart(2, '0')}`,
  name,
  grade: name.split(' ')[0],
  major: name.split(' ')[1],
  building: 'Gedung Sekolah',
  homeroomTeacher: '-'
}));

// Daftar 43 Guru Resmi
export const TEACHER_LIST = [
  'REZA PATRIOTA PUTRA, S.Kom',
  'TAMAN SASTRA DIKARNA, S.Pd',
  'SUHARNO, S.PdI',
  'SAMSUL HUDA, S.Pd',
  'AHMAD HUSEN NASUTION, SS',
  'WISNU NARA UTAMA, S.Pd',
  'FITRI MULYANI, S.Pd',
  'DERA ISMAWATI, A.Md',
  'WIDONI SANTOSO, S.Pd',
  'SRI TITA MULYATI',
  'EUIS SUPRIHATIN, S.Pd',
  'WIDA HARTANI, S.Pd',
  'LUTHFI AHMAD NAZHIF, S.Pd',
  'WIDJAYANTI, S.Sos',
  'DEDE HIDAYATULLAH',
  'KOKO, S.T',
  'CHRISTIN SIREGAR, S.Pd',
  'MUHAMMAD SYAFE\'I, S.Pd',
  'MUHAMMAD ANDIKA PRAWIRA, S.Kom',
  'YULISTIO HARDIYANTO, S.T',
  'KUAT SUPARTO, S.T',
  'ASTRI WULANDARI, S.Pd',
  'AGUNG AINUL HAKIM, S.Pd',
  'SUTRISNO',
  'MUHAMAD ALBAR SAPIN, S.M',
  'TIARA SHANTI HARTONO, S.Sos',
  'OKTARI QOMIMIS SYATUN, S.Pd',
  'CATUR WULANDARI, A.Md',
  'DWIANA RIKASARI, S.AP',
  'IDAYATUL MUSTAFIDAH, S.E',
  'RISKA AMELIA, S.M',
  'SISTER NINDA PUTRI, S.Pd',
  'DELA AMELIA PUTRI, S.Pd',
  'WIWIK UMAYAH, S.Pd',
  'ENDANG KURNIAWAN, S.T',
  'FAUZI, S.Kom',
  'AZMIRAL AZIZ, S.Pd',
  'MUHAMMAD SYAHCTIKO, S.Pd',
  'ISMAIL',
  'SUDIYANI',
  'ATIM',
  'ENDONG',
  'BUCHORI'
];

export const INITIAL_TEACHERS = TEACHER_LIST.map((name, idx) => ({
  id: `TCH-${String(idx + 1).padStart(3, '0')}`,
  name,
  nip: '-',
  phone: '',
  status: 'aktif'
}));

export const INITIAL_PROJECTORS = [
  { id: 'PRJ-01', code: 'PRJ-01', name: 'Proyektor 01', model: 'Epson EB-E500 (3300 Lumens)', bagColor: 'Tas Merah / Tag Merah', bagColorHex: '#ef4444', location: 'Ruang Sarpras / Rak A1', status: 'tersedia', lampHours: '320 Jam', lastMaintenance: '2026-09-15' },
  { id: 'PRJ-02', code: 'PRJ-02', name: 'Proyektor 02', model: 'Epson EB-X500 (3600 Lumens)', bagColor: 'Tas Biru / Tag Biru', bagColorHex: '#3b82f6', location: 'Ruang Sarpras / Rak A2', status: 'tersedia', lampHours: '480 Jam', lastMaintenance: '2026-09-20' },
  { id: 'PRJ-03', code: 'PRJ-03', name: 'Proyektor 03', model: 'BenQ MX535 (3600 Lumens DLP)', bagColor: 'Tas Hitam / Tag Hitam', bagColorHex: '#334155', location: 'Ruang Sarpras / Rak A3', status: 'tersedia', lampHours: '210 Jam', lastMaintenance: '2026-09-28' },
  { id: 'PRJ-04', code: 'PRJ-04', name: 'Proyektor 04', model: 'InFocus IN114x (3800 Lumens)', bagColor: 'Tas Abu-Abu / Tag Abu', bagColorHex: '#64748b', location: 'Ruang Sarpras / Rak A4', status: 'tersedia', lampHours: '560 Jam', lastMaintenance: '2026-09-10' },
  { id: 'PRJ-05', code: 'PRJ-05', name: 'Proyektor 05', model: 'Epson EB-E500 (3300 Lumens)', bagColor: 'Tas Hijau / Tag Hijau', bagColorHex: '#10b981', location: 'Ruang Sarpras / Rak A5', status: 'tersedia', lampHours: '190 Jam', lastMaintenance: '2026-10-01' }
];

export const INITIAL_AUDIT_LOGS = [];
export const SUBJECTS_LIST = [];
