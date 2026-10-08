import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles,
  Wrench,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STANDARD_CHECKLIST_ITEMS, COMMON_COMPLAINTS } from '../constants/appConstants';
import { sounds } from '../utils/soundEffects';
import { formatDateIndo } from '../utils/exportUtils';

export default function ReturnModal({ projector, isOpen, onClose, onConfirmReturn }) {
  const [returnChecklist, setReturnChecklist] = useState({
    powerCable: true,
    hdmiCable: true,
    socketPlug: true,
    remoteBag: true,
    wirelessDongle: true,
  });

  const [condition, setCondition] = useState('Lengkap & Sangat Baik');
  const [returnNotes, setReturnNotes] = useState('');
  
  // Keluhan & Laporan Kendala Teknis untuk Tindakan Langsung
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [complaintDetail, setComplaintDetail] = useState('');
  const [needsDirectAction, setNeedsDirectAction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !projector) return null;

  const toggleItem = (id) => {
    sounds.playBeep();
    setReturnChecklist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = () => {
    sounds.playBeep();
    setReturnChecklist({
      powerCable: true,
      hdmiCable: true,
      socketPlug: true,
      remoteBag: true,
      wirelessDongle: true,
    });
  };

  const toggleComplaint = (complaint) => {
    sounds.playBeep();
    setSelectedComplaints((prev) => {
      const exists = prev.includes(complaint);
      const updated = exists ? prev.filter((c) => c !== complaint) : [...prev, complaint];
      if (updated.length > 0 && !needsDirectAction) {
        setNeedsDirectAction(true);
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      onConfirmReturn({
        unitId: projector.id,
        returnChecklist,
        conditionOnReturn: condition,
        notes: returnNotes,
        complaints: selectedComplaints,
        complaintNote: complaintDetail,
        needsDirectAction,
      });

      sounds.playReturn();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b']
      });

      onClose();
    } catch (err) {
      alert(err.message || 'Gagal memproses pengembalian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const active = projector.activeBorrow;

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
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
            style={{ backgroundColor: projector.bagColorHex }}
          >
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
              Verifikasi Pengembalian & Kendala
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {projector.name} &bull; <span className="font-semibold">{projector.bagColor}</span>
            </p>
          </div>
        </div>

        {/* Info of current borrower */}
        {active && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Peminjam:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{active.teacherName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Kelas / Ruang:</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">{active.destinationClass}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Jam Pelajaran:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{active.durationPeriod}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          
          {/* Section 1: Checklist Verification */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verifikasi Kelengkapan Isi Tas</span>
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Centang Lengkap Semua
              </button>
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              {STANDARD_CHECKLIST_ITEMS.map((item) => {
                const isChecked = !!returnChecklist[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center space-x-2.5 p-2 rounded-xl cursor-pointer transition text-xs ${
                      isChecked
                        ? 'bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 shadow-xs'
                        : 'text-slate-400 line-through'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: KELUHAN & LAPORAN KENDALA TEKNIS (UNTUK TINDAKAN LANGSUNG) */}
          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900/60 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <label className="font-bold text-rose-900 dark:text-rose-200 flex items-center space-x-1.5 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Keluhan / Kendala Teknis (Tindakan Langsung Sarpras)</span>
                </label>
                <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                  Pilih kendala yang dialami selama pemakaian agar teknisi Sarpras dapat segera memeriksa/mengganti kabel/servis.
                </p>
              </div>
            </div>

            {/* Quick Complaint Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMMON_COMPLAINTS.map((comp) => {
                const isSelected = selectedComplaints.includes(comp);
                return (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => toggleComplaint(comp)}
                    className={`text-xs px-2.5 py-1.5 rounded-xl font-medium transition border text-left ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{comp}
                  </button>
                );
              })}
            </div>

            {/* Detailed Complaint Input */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-bold text-rose-800 dark:text-rose-300">
                Detail Keluhan Tambahan:
              </label>
              <textarea
                value={complaintDetail}
                onChange={(e) => setComplaintDetail(e.target.value)}
                rows={2}
                placeholder="Misal: Kabel HDMI konektornya kendor saat digerakkan di kelas XI MP 1..."
                className="w-full px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Urgent Direct Action Flag */}
            <label className="flex items-center space-x-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={needsDirectAction}
                onChange={(e) => setNeedsDirectAction(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-rose-600" />
                <span>Tandai Perlu Tindakan Langsung / Servis Sarpras Segera</span>
              </span>
            </label>
          </div>

          {/* Section 3: Overall Condition Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Status Kondisi Fisik Keseluruhan</span>
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-medium"
            >
              <option value="Lengkap & Sangat Baik">Lengkap & Sangat Baik (Siap Pakai)</option>
              <option value="Lengkap & Normal">Lengkap & Normal</option>
              <option value="Ada Kendala Teknis / Perlu Tindakan">Ada Kendala Teknis / Perlu Tindakan Sarpras</option>
              <option value="Kabel Kusut / Perlu Dirapikan">Kabel Kusut / Perlu Dirapikan</option>
              <option value="Ada Komponen Hilang/Tertinggal di Kelas">Ada Komponen Hilang / Tertinggal di Kelas</option>
            </select>
          </div>

          {/* Section 4: General Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Catatan Pengembalian Umum (Opsional)
            </label>
            <input
              type="text"
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              placeholder="Contoh: Unit ditaruh di rak A2..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Konfirmasi Pengembalian</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
