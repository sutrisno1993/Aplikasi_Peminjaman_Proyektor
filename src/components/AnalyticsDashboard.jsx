import React from 'react';
import { 
  BarChart3, 
  Clock, 
  Tv, 
  UserCheck, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  FileCheck, 
  Download, 
  Printer,
  Sparkles,
  PieChart as PieIcon,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { exportAuditLogsToCSV } from '../utils/exportUtils';
import { sounds } from '../utils/soundEffects';

const UNIT_COLORS = ['#ef4444', '#3b82f6', '#475569', '#64748b', '#10b981'];
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function AnalyticsDashboard({ stats, logs, projectors }) {
  const {
    totalUnits = 5,
    borrowedUnits = 0,
    availableUnits = 5,
    totalTransactions = 0,
    totalHours = 0,
    unitUsageList = [],
    teacherRanking = [],
    classRanking = []
  } = stats || {};

  // Find most & least used units for Sarpras maintenance recommendation
  const sortedByHours = [...unitUsageList].sort((a, b) => b.totalHours - a.totalHours);
  const mostUsedUnit = sortedByHours[0] || { name: 'Proyektor 01', totalHours: 0 };
  const leastUsedUnit = sortedByHours[sortedByHours.length - 1] || { name: 'Proyektor 05', totalHours: 0 };

  const handlePrint = () => {
    sounds.playBeep();
    window.print();
  };

  const handleExportCSV = () => {
    sounds.playBeep();
    exportAuditLogsToCSV(logs);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Accreditation Statement Header */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-brand-700/60">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-sky-200 backdrop-blur-md mb-2">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dokumen Pendukung Akreditasi & Laporan Sarpras Sekolah</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Laporan & Analitik Utilisasi Proyektor
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/90 font-medium mt-1 max-w-2xl">
            Ringkasan intensitas pemanfaatan perangkat teknologi informasi sekolah dalam proses belajar mengajar untuk evaluasi beban unit dan pelaporan dana BOS/Sarpras.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Unduh CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Key Metric Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Hours */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Jam Multimedia</span>
            <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{totalHours}</span>
            <span className="text-sm font-semibold text-slate-500 ml-1">Jam PBM</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Mendukung Bukti Akreditasi Butir 4.4</span>
          </div>
        </div>

        {/* Card 2: Total Sessions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Peminjaman</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{totalTransactions}</span>
            <span className="text-sm font-semibold text-slate-500 ml-1">Sesi Kelas</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            Tercatat lengkap dalam buku log digital
          </div>
        </div>

        {/* Card 3: Highest Used Unit */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Paling Sering</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Tv className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-slate-900 dark:text-slate-100 truncate block">{mostUsedUnit.name}</span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {mostUsedUnit.totalHours} Jam ({mostUsedUnit.count}x pakai)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            Perlu rotasi agar lampu awet merata
          </div>
        </div>

        {/* Card 4: Most Active Teacher */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Guru Teraktif TIK</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-base font-black text-slate-900 dark:text-slate-100 truncate block">
              {teacherRanking[0]?.name?.split(',')[0] || 'Guru Teladan'}
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              {teacherRanking[0]?.count || 0}x Peminjaman ({teacherRanking[0]?.totalHours || 0} Jam)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            Pemanfaatan media ajar interaktif
          </div>
        </div>

      </div>

      {/* Main Charts Row: Unit Intensity & Teacher Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Unit Usage Intensity */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Tv className="w-4 h-4 text-brand-600" />
                <span>Intensitas Pemakaian Per Unit Proyektor (Jam)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Perbandingan akumulasi jam kerja unit untuk pemerataan beban lampu proyektor.
              </p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitUsageList} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(val, name) => [`${val} Jam`, 'Total Durasi']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="totalHours" radius={[8, 8, 0, 0]}>
                  {unitUsageList.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={UNIT_COLORS[index % UNIT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Unit legend with color bags */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {unitUsageList.map((u, i) => (
              <div key={u.id} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: UNIT_COLORS[i % UNIT_COLORS.length] }} />
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{u.name}:</span>
                <span className="text-slate-500">{u.totalHours}j ({u.count}x)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Top Teachers utilizing ICT */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Frekuensi Peminjaman Berdasarkan Guru</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Peringkat guru yang aktif mengintegrasikan presentasi digital dalam pembelajaran.
              </p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={teacherRanking} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={110} 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) => val.split(',')[0]} 
                />
                <Tooltip 
                  formatter={(val, name) => [`${val} Transaksi`, 'Frekuensi']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between border border-slate-100 dark:border-slate-800">
            <span>Rekomendasi Penghargaan TIK Guru:</span>
            <strong className="text-brand-600 dark:text-brand-400">{teacherRanking[0]?.name || '-'}</strong>
          </div>
        </div>

      </div>

      {/* Secondary Row: Subjects Distribution & Sarpras Maintenance Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class / Room Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <PieIcon className="w-4 h-4 text-purple-600" />
            <span>Distribusi Pemanfaatan Berdasarkan Ruang Kelas / Fasilitas</span>
          </h3>
          <div className="space-y-3 pt-1">
            {classRanking.map((cls, idx) => {
              const percentage = totalTransactions > 0 ? Math.round((cls.count / totalTransactions) * 100) : 0;
              return (
                <div key={cls.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{cls.name}</span>
                    <span className="text-slate-500">{cls.count} Sesi ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${Math.max(5, percentage)}%`,
                        backgroundColor: PIE_COLORS[idx % PIE_COLORS.length]
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sarpras Maintenance & Rotation Insights Box */}
        <div className="bg-gradient-to-br from-amber-500/10 via-brand-500/5 to-slate-900/5 dark:from-slate-900 dark:to-slate-800/80 rounded-3xl p-5 sm:p-6 border border-amber-200 dark:border-amber-800/60 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-300 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Rekomendasi Pemeliharaan Sarpras</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Berdasarkan data utilisasi, unit <strong>{mostUsedUnit.name}</strong> memiliki jam terbang tertinggi. Disarankan untuk memprioritaskan peminjaman ke <strong>{leastUsedUnit.name}</strong> agar usia pakai lampu proyektor tetap seimbang dan tahan lama.
            </p>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1.5">
              <div className="font-semibold text-slate-900 dark:text-slate-100">Jadwal Perawatan Bulanan:</div>
              <div className="text-slate-500 dark:text-slate-400">&bull; Pembersihan filter debu berkala</div>
              <div className="text-slate-500 dark:text-slate-400">&bull; Pengecekan kabel HDMI & colokan rol</div>
              <div className="text-slate-500 dark:text-slate-400">&bull; Pengujian dongle wireless screen share</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Sistem Informasi Manajemen Sarana & Prasarana
          </div>
        </div>

      </div>

    </div>
  );
}
