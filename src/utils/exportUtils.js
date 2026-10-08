export function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatTimeOnly(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function exportAuditLogsToCSV(logs, schoolName = 'SMK Negeri 1 Surabaya') {
  if (!logs || !logs.length) return;

  const headers = [
    'No',
    'ID Transaksi',
    'Unit Proyektor',
    'Nama Guru',
    'Kelas Tujuan',
    'Mata Pelajaran',
    'Durasi Jam',
    'Waktu Pinjam',
    'Waktu Kembali',
    'Estimasi/Total Jam',
    'Status',
    'Kondisi Kembali',
    'Catatan / Keperluan'
  ];

  const rows = logs.map((log, index) => {
    return [
      index + 1,
      `"${log.id || ''}"`,
      `"${log.unitName || log.unitId || ''}"`,
      `"${(log.teacherName || '').replace(/"/g, '""')}"`,
      `"${(log.destinationClass || '').replace(/"/g, '""')}"`,
      `"${(log.subject || '').replace(/"/g, '""')}"`,
      `"${(log.durationPeriod || '').replace(/"/g, '""')}"`,
      `"${formatDateIndo(log.borrowTime)}"`,
      `"${formatDateIndo(log.returnTime)}"`,
      `"${log.hoursUsed || 2} Jam"`,
      `"${log.status === 'aktif' ? 'Sedang Dipinjam' : 'Selesai'}"`,
      `"${(log.conditionOnReturn || '-').replace(/"/g, '""')}"`,
      `"${(log.notes || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `Rekap_Peminjaman_Proyektor_${dateStamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
