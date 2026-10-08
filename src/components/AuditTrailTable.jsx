import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Tv, 
  FileText, 
  User, 
  GraduationCap, 
  Calendar,
  Eye
} from 'lucide-react';
import { formatDateIndo, exportAuditLogsToCSV } from '../utils/exportUtils';
import { sounds } from '../utils/soundEffects';

export default function AuditTrailTable({ logs, projectors, onSelectUnitForDetail }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      (log.teacherName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.destinationClass || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.notes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.unitName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchUnit = selectedUnitFilter === 'ALL' || log.unitId === selectedUnitFilter;
    const matchStatus = selectedStatusFilter === 'ALL' || log.status === selectedStatusFilter;

    return matchSearch && matchUnit && matchStatus;
  });

  const handleExportCSV = () => {
    sounds.playBeep();
    exportAuditLogsToCSV(filteredLogs);
  };

  const handlePrint = () => {
    sounds.playBeep();
    window.print();
  };

  return (
    <div className="space-y-5">
      
      {/* Table Header & Controls Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <History className="w-5 h-5 text-brand-600" />
              <span>Buku Log & Jejak Akuntabilitas Sarpras</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Catatan lengkap riwayat penanggung jawab untuk penelusuran jika ada kendala atau kerusakan fisik.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
              title="Unduh data dalam format CSV / Excel"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
              title="Cetak Berkas Laporan Akreditasi"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari guru, kelas, mapel..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Filter Unit */}
          <div className="relative">
            <select
              value={selectedUnitFilter}
              onChange={(e) => setSelectedUnitFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs sm:text-sm font-medium"
            >
              <option value="ALL">Semua Unit Proyektor (PRJ 01-05)</option>
              {projectors.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.bagColor})</option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="relative">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs sm:text-sm font-medium"
            >
              <option value="ALL">Semua Status (Aktif & Selesai)</option>
              <option value="aktif">Sedang Dipinjam (Aktif)</option>
              <option value="selesai">Sudah Dikembalikan (Selesai)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Audit Log Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <th className="py-3.5 px-4">No</th>
                <th className="py-3.5 px-4">Unit Proyektor</th>
                <th className="py-3.5 px-4">Guru Peminjam</th>
                <th className="py-3.5 px-4">Kelas / Ruangan</th>
                <th className="py-3.5 px-4">Waktu Pinjam</th>
                <th className="py-3.5 px-4">Waktu Kembali</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Kondisi & Catatan</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold">Tidak ada riwayat transaksi yang cocok dengan filter.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => {
                  const isAktif = log.status === 'aktif';
                  const matchedProjector = projectors.find((p) => p.id === log.unitId);

                  return (
                    <tr 
                      key={log.id} 
                      className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                        isAktif ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-400">
                        {index + 1}
                      </td>

                      {/* Projector Unit */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0" 
                            style={{ backgroundColor: matchedProjector?.bagColorHex || '#3b82f6' }}
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">{log.unitName || log.unitId}</div>
                            <div className="text-[11px] text-slate-400">{log.unitId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Teacher */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {log.teacherName}
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-brand-700 dark:text-brand-300">
                        {log.destinationClass}
                      </td>

                      {/* Borrow Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
                        <div>{formatDateIndo(log.borrowTime)}</div>
                        <div className="text-[11px] text-slate-400">{log.durationPeriod}</div>
                      </td>

                      {/* Return Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                        {log.returnTime ? (
                          <div className="text-emerald-700 dark:text-emerald-400 font-medium">
                            {formatDateIndo(log.returnTime)}
                            <div className="text-[11px] text-slate-400">({log.hoursUsed || 2} Jam)</div>
                          </div>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold italic flex items-center gap-1">
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>Belum Kembali</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isAktif
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isAktif ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                          <span>{isAktif ? 'Sedang Dipakai' : 'Selesai'}</span>
                        </span>
                      </td>

                      {/* Condition & Notes */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate" title={log.conditionOnReturn || '-'}>
                          {log.conditionOnReturn || '-'}
                        </div>
                        {log.notes && (
                          <div className="text-[11px] text-slate-400 truncate mt-0.5" title={log.notes}>
                            {log.notes}
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLogDetail(log)}
                          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-brand-600 dark:text-brand-400 transition"
                          title="Lihat Rincian Bukti Transaksi"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Count */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Menampilkan <strong>{filteredLogs.length}</strong> dari total {logs.length} transaksi peminjaman.</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Bukti Dukung Standar Sarpras & Akreditasi
          </span>
        </div>
      </div>

      {/* Detail Modal for a single log */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Rincian Bukti Peminjaman
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md font-bold">
                {selectedLogDetail.id}
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <div>
                  <span className="text-slate-400 text-xs">Unit Proyektor:</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{selectedLogDetail.unitName}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Status:</span>
                  <div className="font-bold uppercase text-brand-600">{selectedLogDetail.status}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Guru Peminjam:</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{selectedLogDetail.teacherName}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Kelas Tujuan:</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{selectedLogDetail.destinationClass}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Waktu Pinjam:</span>
                  <div className="font-medium text-slate-700 dark:text-slate-300">{formatDateIndo(selectedLogDetail.borrowTime)}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Waktu Kembali:</span>
                  <div className="font-medium text-slate-700 dark:text-slate-300">{formatDateIndo(selectedLogDetail.returnTime)}</div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-xs font-medium">Catatan / Keperluan:</span>
                <p className="mt-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {selectedLogDetail.notes || 'Tidak ada catatan khusus.'}
                </p>
              </div>

              {selectedLogDetail.conditionOnReturn && (
                <div>
                  <span className="text-slate-400 text-xs font-medium">Kondisi Saat Dikembalikan:</span>
                  <p className="mt-1 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-xs text-emerald-800 dark:text-emerald-200 font-semibold border border-emerald-200">
                    {selectedLogDetail.conditionOnReturn}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedLogDetail(null)}
              className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
