import React from 'react';
import { 
  X, 
  Tv, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  History, 
  AlertCircle, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { STANDARD_CHECKLIST_ITEMS } from '../constants/appConstants';
import { formatDateIndo } from '../utils/exportUtils';
import { sounds } from '../utils/soundEffects';

export default function UnitDetailModal({ projector, isOpen, onClose, logs, onBorrowThisUnit, onPrintQR }) {
  if (!isOpen || !projector) return null;

  const unitLogs = logs.filter((l) => l.unitId === projector.id);
  const isBorrowed = projector.status === 'dipinjam';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
            style={{ backgroundColor: projector.bagColorHex }}
          >
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {projector.name}
              </h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                isBorrowed 
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200' 
                  : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
              }`}>
                {isBorrowed ? 'Sedang Dipinjam' : 'Tersedia'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {projector.model} &bull; <span className="font-semibold">{projector.bagColor}</span>
            </p>
          </div>
        </div>

        {/* Specs & Hardware Attributes Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Kode Inventaris / QR:</span>
            <strong className="text-slate-800 dark:text-slate-200 text-sm font-mono">{projector.code}</strong>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Lokasi Penyimpanan:</span>
            <strong className="text-slate-800 dark:text-slate-200">{projector.location}</strong>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Akumulasi Jam Lampu:</span>
            <strong className="text-slate-800 dark:text-slate-200">{projector.lampHours}</strong>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Maintenance Terakhir:</span>
            <strong className="text-slate-800 dark:text-slate-200">{projector.lastMaintenance}</strong>
          </div>
        </div>

        {/* Standard Checklist in this bag */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Kelengkapan Standar Tas ({projector.bagColor}):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            {STANDARD_CHECKLIST_ITEMS.map((item) => (
              <div key={item.id} className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Log for this specific unit */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <History className="w-4 h-4 text-brand-600" />
              <span>Riwayat Penggunaan Unit Ini ({unitLogs.length})</span>
            </h4>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {unitLogs.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">Belum ada riwayat peminjaman untuk unit ini.</div>
            ) : (
              unitLogs.map((log) => (
                <div 
                  key={log.id}
                  className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-750 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900 dark:text-slate-100">{log.teacherName}</span>
                    <span className="text-brand-600 dark:text-brand-400">{log.destinationClass}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                    <span>{formatDateIndo(log.borrowTime)}</span>
                    <span className={`font-semibold ${log.status === 'aktif' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {log.status === 'aktif' ? 'Sedang Dipakai' : `Selesai (${log.hoursUsed || 2}j)`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center space-x-3">
          <button
            onClick={() => {
              onPrintQR(projector);
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center justify-center space-x-1.5"
          >
            <QrCode className="w-4 h-4 text-slate-500" />
            <span>Cetak Stiker QR</span>
          </button>

          {!isBorrowed && (
            <button
              onClick={() => {
                onBorrowThisUnit(projector.id);
                onClose();
              }}
              className="flex-1 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Pinjam Unit Ini</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
