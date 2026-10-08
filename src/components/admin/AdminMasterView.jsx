import React, { useState } from 'react';
import { 
  Settings, 
  Tv, 
  Users, 
  School, 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  Save, 
  X,
  FileText,
  Filter
} from 'lucide-react';
import { storage } from '../../data/storage';
import { sounds } from '../../utils/soundEffects';
import { formatDateIndo, exportAuditLogsToCSV } from '../../utils/exportUtils';

export default function AdminMasterView({ 
  projectors, 
  teachers, 
  classes, 
  auditLogs, 
  stats, 
  onPrintQR 
}) {
  const [adminTab, setAdminTab] = useState('projectors'); // 'projectors' | 'teachers' | 'classes' | 'reports'

  // Search states
  const [searchProjector, setSearchProjector] = useState('');
  const [searchTeacher, setSearchTeacher] = useState('');
  const [searchClass, setSearchClass] = useState('');

  // Modals for Create / Edit
  const [projectorModal, setProjectorModal] = useState({ isOpen: false, item: null });
  const [teacherModal, setTeacherModal] = useState({ isOpen: false, item: null });
  const [classModal, setClassModal] = useState({ isOpen: false, item: null });

  // Filter for reports
  const [reportUnitFilter, setReportUnitFilter] = useState('ALL');

  // --- PROJECTOR ACTIONS ---
  const handleSaveProjector = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const item = {
      id: projectorModal.item?.id || formData.get('id'),
      name: formData.get('name'),
      model: formData.get('model'),
      bagColor: formData.get('bagColor'),
      bagColorHex: formData.get('bagColorHex'),
      location: formData.get('location'),
      status: formData.get('status') || 'tersedia',
      lampHours: formData.get('lampHours') || '100 Jam',
      lastMaintenance: formData.get('lastMaintenance') || new Date().toISOString().slice(0, 10),
      specs: formData.get('specs'),
    };
    storage.saveProjector(item);
    sounds.playSuccess();
    setProjectorModal({ isOpen: false, item: null });
  };

  const handleDeleteProjector = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus data ${name} (${id})?`)) {
      storage.deleteProjector(id);
      sounds.playBeep();
    }
  };

  // --- TEACHER ACTIONS ---
  const handleSaveTeacher = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const item = {
      id: teacherModal.item?.id,
      nip: formData.get('nip'),
      name: formData.get('name'),
      subject: formData.get('subject'),
      phone: formData.get('phone'),
      status: formData.get('status') || 'aktif',
    };
    storage.saveTeacher(item);
    sounds.playSuccess();
    setTeacherModal({ isOpen: false, item: null });
  };

  const handleDeleteTeacher = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus guru ${name}?`)) {
      storage.deleteTeacher(id);
      sounds.playBeep();
    }
  };

  // --- CLASS ACTIONS ---
  const handleSaveClass = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const item = {
      id: classModal.item?.id,
      name: formData.get('name'),
      grade: formData.get('grade'),
      major: formData.get('major'),
      building: formData.get('building'),
      homeroomTeacher: formData.get('homeroomTeacher'),
    };
    storage.saveClass(item);
    sounds.playSuccess();
    setClassModal({ isOpen: false, item: null });
  };

  const handleDeleteClass = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus kelas ${name}?`)) {
      storage.deleteClass(id);
      sounds.playBeep();
    }
  };

  // --- BACKUP & RESTORE JSON ---
  const handleExportBackup = () => {
    sounds.playBeep();
    const jsonStr = storage.exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIMPRO_Master_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const success = storage.importDataJSON(content);
      if (success) {
        sounds.playSuccess();
        alert('Data Master berhasil dipulihkan dari berkas backup JSON!');
      } else {
        alert('Format file backup tidak sesuai.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered lists
  const filteredProjectors = projectors.filter((p) =>
    (p.name || '').toLowerCase().includes(searchProjector.toLowerCase()) ||
    (p.id || '').toLowerCase().includes(searchProjector.toLowerCase()) ||
    (p.model || '').toLowerCase().includes(searchProjector.toLowerCase())
  );

  const filteredTeachers = teachers.filter((t) =>
    (t.name || '').toLowerCase().includes(searchTeacher.toLowerCase()) ||
    (t.nip || '').toLowerCase().includes(searchTeacher.toLowerCase()) ||
    (t.subject || '').toLowerCase().includes(searchTeacher.toLowerCase())
  );

  const filteredClasses = classes.filter((c) =>
    (c.name || '').toLowerCase().includes(searchClass.toLowerCase()) ||
    (c.major || '').toLowerCase().includes(searchClass.toLowerCase()) ||
    (c.building || '').toLowerCase().includes(searchClass.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Admin */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-brand-700 dark:from-brand-600 dark:to-sky-500 flex items-center justify-center text-white shadow-md shadow-brand-600/20 shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Panel Kelola Data Master & Laporan Sarpras
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manajemen unit proyektor, data guru, kelas/ruangan, serta pusat laporan akreditasi sekolah.
            </p>
          </div>
        </div>

        {/* Backup / Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportBackup}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center space-x-1.5"
            title="Download Cadangan Data JSON"
          >
            <Download className="w-4 h-4 text-brand-600" />
            <span>Backup Data</span>
          </button>

          <label className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Pulihkan</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            sounds.playBeep();
            setAdminTab('projectors');
          }}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 shrink-0 ${
            adminTab === 'projectors'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Master Proyektor ({projectors.length})</span>
        </button>

        <button
          onClick={() => {
            sounds.playBeep();
            setAdminTab('teachers');
          }}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 shrink-0 ${
            adminTab === 'teachers'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Master Guru ({teachers.length})</span>
        </button>

        <button
          onClick={() => {
            sounds.playBeep();
            setAdminTab('classes');
          }}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 shrink-0 ${
            adminTab === 'classes'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <School className="w-4 h-4" />
          <span>Master Kelas & Ruang ({classes.length})</span>
        </button>

        <button
          onClick={() => {
            sounds.playBeep();
            setAdminTab('reports');
          }}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 shrink-0 ${
            adminTab === 'reports'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Laporan Rekapitulasi</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MASTER PROYEKTOR */}
      {/* ======================================================== */}
      {adminTab === 'projectors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchProjector}
                onChange={(e) => setSearchProjector(e.target.value)}
                placeholder="Cari nama proyektor, kode, spesifikasi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium"
              />
            </div>

            <button
              onClick={() => {
                sounds.playBeep();
                setProjectorModal({ isOpen: true, item: null });
              }}
              className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Unit Proyektor</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    <th className="py-3 px-4">Unit / Tag</th>
                    <th className="py-3 px-4">Model / Spesifikasi</th>
                    <th className="py-3 px-4">Lokasi Rak</th>
                    <th className="py-3 px-4">Jam Lampu</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProjectors.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.bagColorHex }} />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">{p.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{p.id} &bull; {p.bagColor}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-[240px]">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{p.model}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{p.specs || '-'}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {p.location}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {p.lampHours}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          p.status === 'dipinjam'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : p.status === 'maintenance'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {p.status === 'dipinjam' ? 'Dipinjam' : p.status === 'maintenance' ? 'Perawatan' : 'Tersedia'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              sounds.playBeep();
                              onPrintQR(p);
                            }}
                            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                            title="Cetak Stiker QR"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              sounds.playBeep();
                              setProjectorModal({ isOpen: true, item: p });
                            }}
                            className="p-1.5 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950 text-brand-600"
                            title="Edit Unit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProjector(p.id, p.name)}
                            className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600"
                            title="Hapus Unit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MASTER GURU */}
      {/* ======================================================== */}
      {adminTab === 'teachers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTeacher}
                onChange={(e) => setSearchTeacher(e.target.value)}
                placeholder="Cari nama guru, NIP, mata pelajaran..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium"
              />
            </div>

            <button
              onClick={() => {
                sounds.playBeep();
                setTeacherModal({ isOpen: true, item: null });
              }}
              className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Guru Baru</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    <th className="py-3 px-4">Nama Guru & Gelar</th>
                    <th className="py-3 px-4">NIP</th>
                    <th className="py-3 px-4">Mata Pelajaran</th>
                    <th className="py-3 px-4">No. Kontak / WA</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTeachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900 dark:text-slate-100">
                        {t.name}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-500">
                        {t.nip || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        {t.subject || '-'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {t.phone || '-'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Aktif
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              sounds.playBeep();
                              setTeacherModal({ isOpen: true, item: t });
                            }}
                            className="p-1.5 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950 text-brand-600"
                            title="Edit Data Guru"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(t.id, t.name)}
                            className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600"
                            title="Hapus Data Guru"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: MASTER KELAS */}
      {/* ======================================================== */}
      {adminTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)}
                placeholder="Cari nama kelas, jurusan, gedung..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium"
              />
            </div>

            <button
              onClick={() => {
                sounds.playBeep();
                setClassModal({ isOpen: true, item: null });
              }}
              className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kelas / Ruangan</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    <th className="py-3 px-4">Nama Kelas / Ruangan</th>
                    <th className="py-3 px-4">Tingkat</th>
                    <th className="py-3 px-4">Jurusan / Tipe</th>
                    <th className="py-3 px-4">Lokasi Gedung</th>
                    <th className="py-3 px-4">Wali Kelas / Penanggung Jawab</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredClasses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-brand-700 dark:text-brand-300">
                        {c.name}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {c.grade}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-800 dark:text-slate-200">
                        {c.major}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                        {c.building}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        {c.homeroomTeacher || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              sounds.playBeep();
                              setClassModal({ isOpen: true, item: c });
                            }}
                            className="p-1.5 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950 text-brand-600"
                            title="Edit Data Kelas"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClass(c.id, c.name)}
                            className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600"
                            title="Hapus Data Kelas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: LAPORAN REKAPITULASI & DOKUMEN AKREDITASI */}
      {/* ======================================================== */}
      {adminTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-brand-600" />
                  <span>Rekapitulasi Utilisasi Sarana Prasarana Sekolah</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Laporan formal pemanfaatan perangkat proyektor untuk pertanggungjawaban BOS dan Akreditasi Sekolah.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    sounds.playBeep();
                    exportAuditLogsToCSV(auditLogs);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Ekspor Excel/CSV</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playBeep();
                    window.print();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Lembar Laporan</span>
                </button>
              </div>
            </div>

            {/* Summary Grid for Accreditation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-400 font-semibold block">Total Akumulasi Jam PBM:</span>
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400">{stats?.totalHours || 0} Jam</span>
                <span className="text-[11px] text-slate-500 block mt-1">Standar Sarpras Butir 4.4</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-400 font-semibold block">Total Sesi Transaksi:</span>
                <span className="text-2xl font-black text-slate-800 dark:text-slate-200">{auditLogs.length} Sesi</span>
                <span className="text-[11px] text-slate-500 block mt-1">Terekam dalam audit trail</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-400 font-semibold block">Rasio Kesiapan Alat:</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {Math.round(((stats?.availableUnits || 0) + (stats?.borrowedUnits || 0)) / (stats?.totalUnits || 1) * 100)}%
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">Perangkat siap guna</span>
              </div>
            </div>

            {/* Table of Units Usage Summary */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Ringkasan Beban Pemakaian Per Unit Proyektor
              </h4>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3">Kode Unit</th>
                      <th className="py-2.5 px-3">Nama Perangkat</th>
                      <th className="py-2.5 px-3">Total Jam Pakai</th>
                      <th className="py-2.5 px-3">Frekuensi</th>
                      <th className="py-2.5 px-3">Status Pemeliharaan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {stats?.unitUsageList?.map((u) => {
                      const p = projectors.find((x) => x.id === u.id);
                      return (
                        <tr key={u.id}>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{u.id}</td>
                          <td className="py-2.5 px-3 font-semibold">{u.name} ({p?.bagColor || '-'})</td>
                          <td className="py-2.5 px-3 font-bold text-brand-600">{u.totalHours} Jam</td>
                          <td className="py-2.5 px-3">{u.count}x Sesi</td>
                          <td className="py-2.5 px-3">
                            <span className="text-emerald-600 font-semibold">Lampu Normal ({p?.lampHours || '300j'})</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD/EDIT PROJECTOR */}
      {/* ======================================================== */}
      {projectorModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setProjectorModal({ isOpen: false, item: null })}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="p-2.5 rounded-2xl bg-brand-600 text-white">
                <Tv className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {projectorModal.item ? 'Edit Data Proyektor' : 'Tambah Unit Proyektor Baru'}
              </h3>
            </div>

            <form onSubmit={handleSaveProjector} className="space-y-4 text-xs">
              {!projectorModal.item && (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kode Unit (ID)</label>
                  <input
                    type="text"
                    name="id"
                    defaultValue={`PRJ-0${projectors.length + 1}`}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Unit</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={projectorModal.item?.name || `Proyektor 0${projectors.length + 1}`}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Merk & Model Proyektor</label>
                <input
                  type="text"
                  name="model"
                  defaultValue={projectorModal.item?.model || 'Epson EB-E500 (3300 Lumens)'}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Warna Wadah/Tas</label>
                  <input
                    type="text"
                    name="bagColor"
                    defaultValue={projectorModal.item?.bagColor || 'Tas Kuning / Tag Kuning'}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Warna Hex / Tag</label>
                  <input
                    type="color"
                    name="bagColorHex"
                    defaultValue={projectorModal.item?.bagColorHex || '#f59e0b'}
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lokasi Rak Sarpras</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={projectorModal.item?.location || 'Ruang Sarpras / Rak A6'}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jam Lampu</label>
                  <input
                    type="text"
                    name="lampHours"
                    defaultValue={projectorModal.item?.lampHours || '120 Jam'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Catatan Spesifikasi</label>
                <input
                  type="text"
                  name="specs"
                  defaultValue={projectorModal.item?.specs || 'HDMI, VGA, USB, Lumens tinggi'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setProjectorModal({ isOpen: false, item: null })}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-600/20"
                >
                  Simpan Proyektor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD/EDIT TEACHER */}
      {/* ======================================================== */}
      {teacherModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setTeacherModal({ isOpen: false, item: null })}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="p-2.5 rounded-2xl bg-brand-600 text-white">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {teacherModal.item ? 'Edit Data Guru' : 'Tambah Guru Baru'}
              </h3>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={teacherModal.item?.name || ''}
                  placeholder="Contoh: Drs. Bambang Sutrisno, M.Pd."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">NIP (Nomor Induk Pegawai)</label>
                <input
                  type="text"
                  name="nip"
                  defaultValue={teacherModal.item?.nip || ''}
                  placeholder="19800101 200501 1 001"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mata Pelajaran Utama</label>
                <input
                  type="text"
                  name="subject"
                  defaultValue={teacherModal.item?.subject || ''}
                  placeholder="Contoh: Pemrograman Web / Matematika"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">No. WhatsApp / Kontak</label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={teacherModal.item?.phone || ''}
                  placeholder="08123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setTeacherModal({ isOpen: false, item: null })}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-600/20"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD/EDIT CLASS */}
      {/* ======================================================== */}
      {classModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setClassModal({ isOpen: false, item: null })}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="p-2.5 rounded-2xl bg-brand-600 text-white">
                <School className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {classModal.item ? 'Edit Data Kelas' : 'Tambah Kelas / Ruangan'}
              </h3>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Kelas / Ruangan</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={classModal.item?.name || ''}
                  placeholder="Contoh: X DKV 2 / Lab Robotik"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tingkat</label>
                  <select
                    name="grade"
                    defaultValue={classModal.item?.grade || 'X'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                    <option value="Fasilitas">Fasilitas / Lab / Aula</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Jurusan</label>
                  <input
                    type="text"
                    name="major"
                    defaultValue={classModal.item?.major || 'AKL'}
                    placeholder="AKL, MP, TSM, TKR, TKJ, Umum"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lokasi Gedung / Lantai</label>
                <input
                  type="text"
                  name="building"
                  defaultValue={classModal.item?.building || 'Gedung B Lantai 2'}
                  placeholder="Contoh: Gedung B Lantai 2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Wali Kelas / Penanggung Jawab</label>
                <input
                  type="text"
                  name="homeroomTeacher"
                  defaultValue={classModal.item?.homeroomTeacher || ''}
                  placeholder="Nama Guru Wali Kelas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setClassModal({ isOpen: false, item: null })}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-600/20"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
