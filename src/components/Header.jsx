import React from 'react';
import { 
  Tv, 
  QrCode, 
  LayoutGrid, 
  History, 
  BarChart3, 
  ScanLine, 
  Printer, 
  RotateCcw, 
  Sun, 
  Moon,
  Sparkles,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  stats, 
  onOpenQRScanner, 
  onOpenQRGenerator,
  onResetData,
  darkMode,
  setDarkMode
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & School info */}
          <div className="flex items-center space-x-3 sm:space-x-4 cursor-pointer" onClick={() => setActiveTab('borrow')}>
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 ring-2 ring-brand-200 dark:ring-brand-900/50">
                <Tv className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-brand-700 to-sky-600 dark:from-brand-400 dark:to-sky-300 bg-clip-text text-transparent">
                  SIMPRO
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300">
                  <ShieldCheck className="w-3 h-3 mr-1 text-brand-600 dark:text-brand-400" />
                  Sarpras Digital
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px] sm:max-w-none">
                Peminjaman & Pelacakan Proyektor Sekolah
              </p>
            </div>
          </div>

          {/* Quick Actions & Status Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Indicator of Available Units */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                <strong className="text-emerald-600 dark:text-emerald-400">{stats?.availableUnits ?? 0}</strong> dari {stats?.totalUnits ?? 5} Unit Siap
              </span>
            </div>

            {/* Quick QR Scanner button */}
            <button
              onClick={() => {
                sounds.playBeep();
                onOpenQRScanner();
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-brand-500/20 active:scale-95 transition-all"
              title="Buka Kamera / Simulasi Scan QR Wadah"
            >
              <ScanLine className="w-4 h-4" />
              <span className="hidden xs:inline">Scan QR</span>
            </button>

            {/* Print QR Labels */}
            <button
              onClick={() => {
                sounds.playBeep();
                onOpenQRGenerator();
              }}
              className="inline-flex items-center space-x-1 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-medium shadow-sm transition"
              title="Cetak Stiker QR Code untuk Wadah Proyektor"
            >
              <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="hidden lg:inline">Stiker Wadah</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => {
                sounds.playBeep();
                setDarkMode(!darkMode);
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
              aria-label="Ganti Tema"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Reset mock data */}
            <button
              onClick={() => {
                if (window.confirm('Reset semua data ke kondisi demo awal?')) {
                  sounds.playBeep();
                  onResetData();
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              title="Reset Data Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Mobile-Friendly & Desktop Pill Style) */}
        <nav className="flex space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/60">
          <button
            onClick={() => {
              sounds.playBeep();
              setActiveTab('borrow');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'borrow'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Form Peminjaman (QR)</span>
          </button>

          <button
            onClick={() => {
              sounds.playBeep();
              setActiveTab('units');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'units'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Status 5 Unit</span>
            {stats?.borrowedUnits > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'units' ? 'bg-white text-brand-700' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
              }`}>
                {stats.borrowedUnits} Dipinjam
              </span>
            )}
          </button>

          <button
            onClick={() => {
              sounds.playBeep();
              setActiveTab('audit');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'audit'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat & Akuntabilitas</span>
          </button>

          <button
            onClick={() => {
              sounds.playBeep();
              setActiveTab('analytics');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Laporan & Analitik Sarpras</span>
          </button>

          <button
            onClick={() => {
              sounds.playBeep();
              setActiveTab('admin');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'admin'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Kelola Master (Admin)</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
