import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, QrCode, Tv, Download, Check, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function QRGeneratorModal({ isOpen, onClose, projectors = [], initialSelectedUnit = null }) {
  const [selectedUnit, setSelectedUnit] = useState(initialSelectedUnit ? initialSelectedUnit.id : 'ALL');

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const getQRUrl = (unitId) => {
    return `${origin}${pathname}?unit=${unitId}`;
  };

  const unitsToDisplay = selectedUnit === 'ALL'
    ? projectors
    : projectors.filter((p) => p.id === selectedUnit);

  const handlePrint = () => {
    sounds.playBeep();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="no-print absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/30">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Cetak Stiker QR Code Wadah Proyektor
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Tempelkan stiker QR code ini pada tas/wadah masing-masing proyektor (PRJ-01 s/d PRJ-05).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
            >
              <option value="ALL">Cetak Semua (5 Unit Sekaligus)</option>
              {projectors.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.bagColor})</option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang</span>
            </button>
          </div>
        </div>

        {/* Printable Grid Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
          {unitsToDisplay.map((p) => {
            const qrUrl = getQRUrl(p.id);

            return (
              <div
                key={p.id}
                className="print-card bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-300 dark:border-slate-700 shadow-md text-center flex flex-col items-center justify-between space-y-4 relative overflow-hidden"
              >
                {/* Top Colored Identifier Banner */}
                <div 
                  className="w-full py-1.5 px-3 rounded-xl text-white font-extrabold text-xs tracking-wider uppercase shadow-sm"
                  style={{ backgroundColor: p.bagColorHex }}
                >
                  UNIT SARPRAS SEKOLAH &bull; {p.bagColor}
                </div>

                {/* Main Unit Title */}
                <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {p.name}
                  </h4>
                  <div className="inline-block font-mono text-xs font-extrabold px-2.5 py-0.5 mt-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    KODE UNIT: {p.id}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {p.model}
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-inner flex flex-col items-center justify-center">
                  <QRCodeSVG
                    value={qrUrl}
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                  <span className="text-[10px] font-mono text-slate-600 font-bold mt-2 truncate max-w-[180px]">
                    ?unit={p.id}
                  </span>
                </div>

                {/* Instructions for Teacher */}
                <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 w-full space-y-0.5">
                  <div className="font-extrabold text-brand-700 dark:text-brand-300">
                    CARA PEMINJAMAN GURU:
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    Arahkan kamera HP ke QR ini untuk langsung mengisi konfirmasi peminjaman kelas.
                  </div>
                </div>

                {/* Bottom School Footer */}
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-1">
                  SISTEM INFORMASI MANAJEMEN SARPRAS
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="no-print mt-6 text-center text-xs text-slate-400">
          Tip: Anda dapat langsung menempelkan cetakan stiker ini pada kantong depan atau tag ritsleting tas proyektor.
        </div>

      </div>
    </div>
  );
}
