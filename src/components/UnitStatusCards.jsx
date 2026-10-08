import React from 'react';
import { 
  Tv, 
  CheckCircle2, 
  Clock, 
  User, 
  GraduationCap, 
  RotateCcw, 
  QrCode, 
  ArrowRight,
  Info,
  Layers,
  MapPin,
  Sparkles,
  Calendar,
  AlertTriangle,
  Wrench,
  Check
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { formatDateIndo } from '../utils/exportUtils';

export default function UnitStatusCards({ 
  projectors, 
  onSelectAndBorrow, 
  onOpenReturnModal,
  onOpenUnitDetail,
  onPrintSingleQR,
  onResolveMaintenance
}) {
  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-brand-600" />
            <span>Pemantauan Real-time 5 Unit Proyektor</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Status ketersediaan fisik, peminjaman kelas, serta laporan keluhan teknis untuk tindakan langsung Sarpras.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-semibold flex-wrap gap-y-1">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Tersedia</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Dipinjam</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Perawatan/Keluhan</span>
          </div>
        </div>
      </div>

      {/* 5 Projector Cards Grid */}
      {projectors.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 col-span-full">
          <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Menghubungkan ke Database MySQL SIMPRO...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projectors.map((p) => {
          const isBorrowed = p.status === 'dipinjam';
          const isMaintenance = p.status === 'maintenance';
          const hasIssue = p.lastIssue && !p.lastIssue.resolved;
          const active = p.activeBorrow;

          return (
            <div
              key={p.id}
              className={`rounded-3xl p-5 transition-all flex flex-col justify-between border relative overflow-hidden ${
                isMaintenance || hasIssue
                  ? 'bg-rose-50/30 dark:bg-slate-900/90 border-rose-300 dark:border-rose-800/80 shadow-md'
                  : isBorrowed
                  ? 'bg-amber-50/40 dark:bg-slate-900/90 border-amber-200 dark:border-amber-800/60 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg'
              }`}
            >
              {/* Color Accent Bar on Top */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: p.bagColorHex }}
              />

              <div>
                {/* Card Header: Unit Name & Status Badge */}
                <div className="flex items-start justify-between gap-2 pt-1 mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md ring-2 ring-white dark:ring-slate-800 shrink-0"
                      style={{ backgroundColor: p.bagColorHex }}
                    >
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                          {p.name}
                        </h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                          {p.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {p.bagColor}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      isMaintenance
                        ? 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-800'
                        : isBorrowed
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                        : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isMaintenance ? 'bg-rose-500' : isBorrowed ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                    <span>{isMaintenance ? 'Perlu Servis' : isBorrowed ? 'Dipinjam' : 'Tersedia'}</span>
                  </span>
                </div>

                {/* Model Specs & Location */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tipe / Model:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{p.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Penyimpanan:</span>
                    <span className="font-medium">{p.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jam Lampu:</span>
                    <span className="font-medium">{p.lampHours}</span>
                  </div>
                </div>

                {/* Laporan Keluhan / Kendala Teknis (Untuk Tindakan Langsung) */}
                {hasIssue && (
                  <div className="p-3.5 rounded-2xl bg-rose-100/70 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-xs space-y-2 mb-3 animate-pulseSlow">
                    <div className="flex items-center justify-between text-rose-900 dark:text-rose-200 font-extrabold">
                      <div className="flex items-center space-x-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Keluhan Terakhir Guru:</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold">
                        Tindakan Langsung
                      </span>
                    </div>

                    {p.lastIssue.complaints && p.lastIssue.complaints.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {p.lastIssue.complaints.map((c, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg bg-rose-200/80 dark:bg-rose-900/80 text-rose-900 dark:text-rose-100 font-semibold text-[11px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    {p.lastIssue.detail && (
                      <p className="text-[11px] text-rose-800 dark:text-rose-200 italic font-medium">
                        "{p.lastIssue.detail}"
                      </p>
                    )}

                    <div className="pt-1 flex items-center justify-between border-t border-rose-200 dark:border-rose-900/80">
                      <span className="text-[10px] text-rose-700 dark:text-rose-300">
                        Oleh: {p.lastIssue.reportedBy}
                      </span>
                      {onResolveMaintenance && (
                        <button
                          onClick={() => {
                            sounds.playSuccess();
                            onResolveMaintenance(p.id);
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition flex items-center space-x-1"
                          title="Tandai masalah teknis sudah diperbaiki Sarpras"
                        >
                          <Check className="w-3 h-3" />
                          <span>Sudah Diperbaiki</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* If Borrowed: Show Active Details */}
                {isBorrowed && active ? (
                  <div className="p-3.5 rounded-2xl bg-amber-100/70 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 space-y-2 text-xs mb-3">
                    <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 font-bold">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      <span className="truncate">{active.teacherName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                      <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
                      <span className="font-semibold text-brand-700 dark:text-brand-300">{active.destinationClass}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{active.durationPeriod}</span>
                    </div>
                  </div>
                ) : !hasIssue ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unit berada di lemari Sarpras dan siap dipinjam.</span>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {isBorrowed ? (
                  <button
                    onClick={() => {
                      sounds.playBeep();
                      onOpenReturnModal(p);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition flex items-center justify-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Proses Pengembalian & Keluhan</span>
                  </button>
                ) : isMaintenance ? (
                  <button
                    onClick={() => {
                      if (onResolveMaintenance) {
                        sounds.playSuccess();
                        onResolveMaintenance(p.id);
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Selesai Servis & Siap Dipinjam</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sounds.playBeep();
                      onSelectAndBorrow(p.id);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition flex items-center justify-center space-x-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Pinjam Proyektor Ini</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sounds.playBeep();
                      onPrintSingleQR(p);
                    }}
                    className="py-1.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition flex items-center justify-center space-x-1"
                  >
                    <QrCode className="w-3 h-3 text-slate-500" />
                    <span>Stiker QR</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playBeep();
                      onOpenUnitDetail(p);
                    }}
                    className="py-1.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition flex items-center justify-center space-x-1"
                  >
                    <Info className="w-3 h-3 text-slate-500" />
                    <span>Info Detail</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
