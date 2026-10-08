import React, { useState } from 'react';
import { 
  X, 
  ScanLine, 
  Tv, 
  Sparkles, 
  Camera, 
  QrCode, 
  ArrowRight,
  Info
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function QRScannerModal({ isOpen, onClose, projectors = [], onScanSuccess }) {
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = (unitId) => {
    setIsScanning(true);
    sounds.playBeep();

    setTimeout(() => {
      sounds.playSuccess();
      setIsScanning(false);
      onScanSuccess(unitId);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/30">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Pindai QR Tas Proyektor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Arahkan kamera ke barcode/QR pada wadah unit
            </p>
          </div>
        </div>

        {/* Scanner Viewfinder Box */}
        <div className="relative aspect-square w-full rounded-3xl bg-slate-950 flex flex-col items-center justify-center overflow-hidden border-2 border-brand-500/50 shadow-inner">
          
          {/* Target Corner Reticles */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-brand-400 rounded-tl-lg pointer-events-none"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-brand-400 rounded-tr-lg pointer-events-none"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-brand-400 rounded-bl-lg pointer-events-none"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-brand-400 rounded-br-lg pointer-events-none"></div>

          {/* Animated Laser Scanning Line */}
          <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan-line pointer-events-none z-10"></div>

          {/* Icon in Center */}
          <div className="text-center p-6 space-y-3 z-0">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-sky-400 ring-2 ring-white/20">
              <QrCode className="w-8 h-8" />
            </div>
            <p className="text-xs text-slate-300 font-medium max-w-[220px] mx-auto">
              Simulasi Sensor Scanner Aktif. Klik salah satu unit di bawah untuk menguji respon sistem:
            </p>
          </div>

          {isScanning && (
            <div className="absolute inset-0 bg-brand-600/60 backdrop-blur-xs flex items-center justify-center z-20 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-2xl flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-600 animate-spin" />
                <span>Membaca QR Unit...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Simulator Buttons for 5 Units */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-brand-600" />
            <span>Pilih Cepat Simulasi Scan Wadah:</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {projectors.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSimulateScan(p.id)}
                className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:border-brand-300 transition text-left text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <span 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: p.bagColorHex }}
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{p.name} ({p.id})</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-1.5">&bull; {p.bagColor}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 font-semibold text-brand-600 dark:text-brand-400">
                  <span>Pindai</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
