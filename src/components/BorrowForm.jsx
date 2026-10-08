import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  GraduationCap, 
  BookOpen, 
  CheckSquare, 
  Square, 
  Sparkles, 
  QrCode,
  ArrowRight,
  ShieldAlert,
  Info,
  Layers,
  MapPin,
  Check,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  INITIAL_PROJECTORS,
  STANDARD_CHECKLIST_ITEMS, 
  TEACHER_LIST, 
  CLASS_LIST, 
  DURATION_PERIODS 
} from '../constants/appConstants';
import { sounds } from '../utils/soundEffects';
import { formatDateIndo } from '../utils/exportUtils';

export default function BorrowForm({ 
  projectors = [], 
  selectedUnitId, 
  teachers = [],
  classes = [],
  onSelectUnit, 
  onBorrowSubmit, 
  onOpenReturnModal, 
  onOpenQRScanner 
}) {
  const [teacherName, setTeacherName] = useState('');
  const [destinationClass, setDestinationClass] = useState('');
  const [durationPeriod, setDurationPeriod] = useState(DURATION_PERIODS[0] || 'Jam ke-1');
  const [notes, setNotes] = useState('');
  const [customTeacher, setCustomTeacher] = useState(false);
  const [customClass, setCustomClass] = useState(false);

  // Container Checklist State
  const [checklist, setChecklist] = useState({
    powerCable: true,
    hdmiCable: true,
    socketPlug: true,
    remoteBag: true,
    wirelessDongle: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successBanner, setSuccessBanner] = useState(null);

  // Reset form state if projector changes
  useEffect(() => {
    setValidationError('');
  }, [selectedUnitId]);

  const teacherOptions = (teachers && teachers.length)
    ? teachers.map(t => typeof t === 'string' ? t : t.name)
    : TEACHER_LIST;

  const classOptions = (classes && classes.length)
    ? classes.map(c => typeof c === 'string' ? c : c.name)
    : CLASS_LIST;

  const currentProjector = (projectors && projectors.length)
    ? (projectors.find((p) => p.id === selectedUnitId) || projectors[0])
    : null;

  if (!currentProjector) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Menghubungkan ke Database MySQL SIMPRO...</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mengambil data unit proyektor, daftar guru, dan kelas secara realtime.</p>
      </div>
    );
  }

  const isAlreadyBorrowed = currentProjector?.status === 'dipinjam';

  const toggleChecklist = (id) => {
    sounds.playBeep();
    setChecklist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAllChecklist = () => {
    sounds.playBeep();
    setChecklist({
      powerCable: true,
      hdmiCable: true,
      socketPlug: true,
      remoteBag: true,
      wirelessDongle: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!teacherName.trim()) {
      setValidationError('Silakan pilih atau masukkan Nama Guru peminjam.');
      return;
    }
    if (!destinationClass.trim()) {
      setValidationError('Silakan pilih atau masukkan Kelas/Ruangan tujuan.');
      return;
    }

    // Check if at least essential cables are checked
    if (!checklist.powerCable || !checklist.hdmiCable) {
      if (!window.confirm('Kabel Power atau HDMI belum dicentang. Lanjutkan peminjaman wadah dengan kondisi ini?')) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      onBorrowSubmit({
        unitId: currentProjector.id,
        teacherName,
        destinationClass,
        durationPeriod,
        checklist,
        notes,
      });

      sounds.playSuccess();
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#2a97ff', '#10b981', '#f59e0b', '#6366f1']
      });

      setSuccessBanner({
        unitName: currentProjector.name,
        teacherName,
        destinationClass,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      });

      // Clear form inputs
      setNotes('');
    } catch (err) {
      setValidationError(err.message || 'Terjadi kesalahan saat memproses peminjaman.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* QR Code Quick Switch Bar (Simulates scanning different physical projector bags) */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-xl shadow-brand-950/20 border border-brand-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <QrCode className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-sky-200 font-bold flex items-center gap-1.5">
                <span>Entry Point QR Tag Wadah</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Simulasi Pindai QR Tas Proyektor (?unit=ID)
              </h2>
            </div>
          </div>
          <button
            onClick={onOpenQRScanner}
            className="self-start sm:self-auto text-xs px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-sky-100 font-medium transition flex items-center space-x-1.5 border border-white/20"
          >
            <span>Buka Scanner Kamera</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Projector Unit Quick Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {projectors.map((p) => {
            const isSelected = p.id === currentProjector.id;
            const isBorrowed = p.status === 'dipinjam';
            return (
              <button
                key={p.id}
                onClick={() => {
                  sounds.playBeep();
                  onSelectUnit(p.id);
                }}
                className={`relative px-3 py-2.5 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-white text-slate-900 border-white shadow-lg ring-2 ring-brand-400 scale-[1.02]'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black tracking-tight">{p.id}</span>
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: p.bagColorHex }}
                    title={p.bagColor}
                  />
                </div>
                <div className={`text-xs font-semibold truncate ${isSelected ? 'text-slate-800' : 'text-slate-200'}`}>
                  {p.name}
                </div>
                <div className="mt-1 flex items-center space-x-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isBorrowed ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${
                    isSelected 
                      ? (isBorrowed ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold')
                      : (isBorrowed ? 'text-amber-300' : 'text-emerald-300')
                  }`}>
                    {isBorrowed ? 'Dipinjam' : 'Tersedia'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Banner if just submitted */}
      {successBanner && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-5 text-emerald-900 dark:text-emerald-100 flex items-start space-x-4 shadow-sm animate-fadeIn">
          <div className="p-2 bg-emerald-500 text-white rounded-2xl shrink-0 mt-0.5 shadow-md shadow-emerald-500/30">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex-1 text-sm">
            <h4 className="font-bold text-base text-emerald-800 dark:text-emerald-200">
              Peminjaman Berhasil Dikonfirmasi!
            </h4>
            <p className="mt-1 text-emerald-700 dark:text-emerald-300">
              Unit <strong className="underline">{successBanner.unitName}</strong> resmi tercatat sedang digunakan oleh <strong>{successBanner.teacherName}</strong> di kelas <strong>{successBanner.destinationClass}</strong> sejak pukul {successBanner.time} WIB.
            </p>
            <div className="mt-3 flex items-center space-x-3">
              <button
                onClick={() => setSuccessBanner(null)}
                className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition"
              >
                Tutup Notifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALREADY BORROWED STATE ALERT */}
      {isAlreadyBorrowed ? (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700/60 rounded-3xl p-6 sm:p-7 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Status: Sedang Aktif Digunakan</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-amber-950 dark:text-amber-100">
                {currentProjector.name} Sedang Dipinjam
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                Wadah proyektor ini sedang tercatat aktif dalam kegiatan belajar mengajar:
              </p>

              {/* Active borrow details card */}
              <div className="mt-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-amber-200 dark:border-amber-800/80 space-y-2.5 shadow-sm text-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs text-slate-500 font-medium">Guru Peminjam:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{currentProjector.activeBorrow?.teacherName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs text-slate-500 font-medium">Ruang / Kelas:</span>
                  <span className="font-semibold text-brand-600 dark:text-brand-400">{currentProjector.activeBorrow?.destinationClass}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs text-slate-500 font-medium">Jam Pelajaran:</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{currentProjector.activeBorrow?.durationPeriod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Mulai Pinjam:</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatDateIndo(currentProjector.activeBorrow?.borrowTime)}
                  </span>
                </div>
              </div>

              {/* Action Buttons for Borrowed Unit */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onOpenReturnModal(currentProjector)}
                  className="flex-1 inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Proses Pengembalian Unit Ini</span>
                </button>
                <button
                  onClick={() => {
                    const nextAvailable = projectors.find((p) => p.status === 'tersedia');
                    if (nextAvailable) onSelectUnit(nextAvailable.id);
                  }}
                  className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-semibold text-sm transition text-center"
                >
                  Pilih Unit Yang Tersedia
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* AVAILABLE UNIT FORM - MAIN BORROWING FORM */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          {/* Header of Active Selected Projector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3.5">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ring-4 ring-slate-100 dark:ring-slate-800 shrink-0"
                style={{ backgroundColor: currentProjector.bagColorHex }}
              >
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {currentProjector.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Siap Dipinjam
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {currentProjector.model} &bull; <span className="font-semibold text-slate-700 dark:text-slate-300">{currentProjector.bagColor}</span>
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 self-start sm:self-center">
              Lokasi: <span className="font-bold text-slate-700 dark:text-slate-200">{currentProjector.location}</span>
            </div>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-start space-x-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <div className="font-medium">{validationError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Teacher Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-brand-600" />
                  <span>Nama Guru Peminjam <span className="text-rose-500">*</span></span>
                </label>
                <button
                  type="button"
                  onClick={() => setCustomTeacher(!customTeacher)}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {customTeacher ? 'Pilih dari Daftar Guru' : '+ Ketik Nama Manual'}
                </button>
              </div>

              {customTeacher ? (
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Ketik Nama Lengkap & Gelar Guru..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium transition"
                  required
                />
              ) : (
                <div className="space-y-2">
                  <select
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium transition"
                    required
                  >
                    <option value="">-- Pilih Nama Guru --</option>
                    {teacherOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  {/* Quick Teacher Chips for fast mobile picking */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium mr-1 self-center">Pilihan Cepat:</span>
                    {teacherOptions.slice(0, 5).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTeacherName(t)}
                        className={`text-xs px-2.5 py-1 rounded-xl transition border ${
                          teacherName === t
                            ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {t.split(',')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Destination Class / Room */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  <span>Kelas / Ruangan Tujuan <span className="text-rose-500">*</span></span>
                </label>
                <button
                  type="button"
                  onClick={() => setCustomClass(!customClass)}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {customClass ? 'Pilih dari Daftar Kelas' : '+ Ketik Manual'}
                </button>
              </div>

              {customClass ? (
                <input
                  type="text"
                  value={destinationClass}
                  onChange={(e) => setDestinationClass(e.target.value)}
                  placeholder="Contoh: Lab Jaringan Komputer / Ruang Aula..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 text-sm font-medium transition"
                  required
                />
              ) : (
                <div className="space-y-2">
                  <select
                    value={destinationClass}
                    onChange={(e) => setDestinationClass(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-brand-500 text-sm font-medium transition"
                    required
                  >
                    <option value="">-- Pilih Kelas / Ruangan --</option>
                    {classOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  {/* Quick Class Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium mr-1 self-center">Pilihan Cepat:</span>
                    {classOptions.slice(0, 6).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setDestinationClass(c)}
                        className={`text-xs px-2.5 py-1 rounded-xl transition border ${
                          destinationClass === c
                            ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Simple Jam Pelajaran (Jam ke-1, Jam ke-2, dst.) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Jam Pelajaran <span className="text-rose-500">*</span></span>
                </label>
                <span className="text-xs text-brand-600 dark:text-brand-400 font-bold">
                  {durationPeriod}
                </span>
              </div>

              {/* 1-Tap Quick Hours Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {DURATION_PERIODS.slice(0, 8).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      sounds.playBeep();
                      setDurationPeriod(d);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition text-center border ${
                      durationPeriod === d
                        ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/25 scale-[1.03]'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Dropdown for other options / Seharian */}
              <select
                value={durationPeriod}
                onChange={(e) => setDurationPeriod(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm font-medium"
                required
              >
                {DURATION_PERIODS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Section 4: Container Item Checklist (Kelengkapan Wadah/Tas Proyektor) */}
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Checklist Kelengkapan Wadah ({currentProjector.bagColor})</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Pastikan seluruh aksesori di dalam tas proyektor lengkap sebelum dibawa ke kelas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSelectAllChecklist}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100"
                >
                  Centang Semua
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {STANDARD_CHECKLIST_ITEMS.map((item) => {
                  const isChecked = !!checklist[item.id];
                  const isDongle = item.id === 'wirelessDongle';
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`flex items-start space-x-3 p-3 rounded-2xl cursor-pointer transition border ${
                        isChecked
                          ? 'bg-white dark:bg-slate-800 border-brand-300 dark:border-brand-700 shadow-sm'
                          : 'bg-slate-100/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="mt-0.5 text-brand-600 dark:text-brand-400 shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-brand-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{item.label}</span>
                          {isDongle && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-extrabold">
                              Future Ready
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Additional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Catatan Tambahan / Keterangan (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Penggunaan untuk ujian presentasi kelompok..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm font-medium"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-extrabold text-base shadow-xl shadow-brand-600/30 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Konfirmasi Peminjaman ({currentProjector.name})</span>
            </button>

            <p className="text-center text-xs text-slate-400 font-medium">
              Waktu peminjaman dicatat secara otomatis realtime untuk pelacakan sarana sekolah.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
