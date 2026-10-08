import { 
  INITIAL_PROJECTORS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_TEACHERS, 
  INITIAL_CLASSES 
} from '../constants/appConstants';

const STORAGE_KEYS = {
  PROJECTORS: 'simpro_projectors_v6',
  AUDIT_LOGS: 'simpro_audit_logs_v6',
  TEACHERS: 'simpro_teachers_v6',
  CLASSES: 'simpro_classes_v6',
};

class StorageService {
  constructor() {
    this.listeners = new Set();
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    // Purge legacy cached keys from older sessions
    try {
      ['simpro_classes_v5', 'simpro_classes_v4', 'simpro_teachers_v5', 'simpro_projectors_v5'].forEach((k) => {
        localStorage.removeItem(k);
      });
    } catch (e) {}

    this.syncFromApi();
  }

  async syncFromApi() {
    try {
      const [projRes, tchRes, clsRes, logRes] = await Promise.allSettled([
        fetch('/api/projectors'),
        fetch('/api/teachers'),
        fetch('/api/classes'),
        fetch('/api/logs'),
      ]);

      if (projRes.status === 'fulfilled' && projRes.value.ok) {
        const json = await projRes.value.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.PROJECTORS, JSON.stringify(json.data));
        }
      }

      if (tchRes.status === 'fulfilled' && tchRes.value.ok) {
        const json = await tchRes.value.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(json.data));
        }
      }

      if (clsRes.status === 'fulfilled' && clsRes.value.ok) {
        const json = await clsRes.value.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(json.data));
        }
      }

      if (logRes.status === 'fulfilled' && logRes.value.ok) {
        const json = await logRes.value.json();
        if (json.data && Array.isArray(json.data)) {
          localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(json.data));
        }
      }

      this.notify();
    } catch (e) {
      console.warn('Backend API sync notice:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const data = {
      projectors: this.getProjectors(),
      auditLogs: this.getAuditLogs(),
      teachers: this.getTeachers(),
      classes: this.getClasses(),
      stats: this.getStats(),
    };
    this.listeners.forEach((fn) => fn(data));
  }

  // --- PROJECTORS CRUD ---
  getProjectors() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROJECTORS);
      return raw ? JSON.parse(raw) : INITIAL_PROJECTORS;
    } catch (e) {
      console.error('Failed reading projectors from storage', e);
      return INITIAL_PROJECTORS;
    }
  }

  getProjectorById(id) {
    const projectors = this.getProjectors();
    return projectors.find((p) => p.id.toUpperCase() === (id || '').toUpperCase()) || null;
  }

  saveProjector(projectorData) {
    const projectors = this.getProjectors();
    const index = projectors.findIndex((p) => p.id === projectorData.id);

    if (index >= 0) {
      // Update existing
      projectors[index] = { ...projectors[index], ...projectorData };
    } else {
      // Create new
      const newId = projectorData.id || `PRJ-0${projectors.length + 1}`;
      projectors.push({
        ...projectorData,
        id: newId,
        code: newId,
        status: projectorData.status || 'tersedia',
        activeBorrow: null,
      });
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTORS, JSON.stringify(projectors));
    
    // Sync to MySQL API
    fetch('/api/projectors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectorData)
    }).catch((e) => console.warn('API saveProjector notice:', e));

    this.notify();
    return true;
  }

  deleteProjector(id) {
    let projectors = this.getProjectors();
    projectors = projectors.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTORS, JSON.stringify(projectors));

    fetch(`/api/projectors/${id}`, { method: 'DELETE' }).catch((e) => console.warn('API deleteProjector notice:', e));

    this.notify();
    return true;
  }

  // --- TEACHERS CRUD ---
  getTeachers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      return raw ? JSON.parse(raw) : INITIAL_TEACHERS;
    } catch (e) {
      return INITIAL_TEACHERS;
    }
  }

  saveTeacher(teacherData) {
    const teachers = this.getTeachers();
    const index = teachers.findIndex((t) => t.id === teacherData.id);

    if (index >= 0) {
      teachers[index] = { ...teachers[index], ...teacherData };
    } else {
      const newId = teacherData.id || `TCH-${String(teachers.length + 1).padStart(3, '0')}`;
      teachers.push({
        ...teacherData,
        id: newId,
        status: 'aktif'
      });
    }

    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));

    fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData)
    }).catch((e) => console.warn('API saveTeacher notice:', e));

    this.notify();
    return true;
  }

  deleteTeacher(id) {
    let teachers = this.getTeachers();
    teachers = teachers.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));

    fetch(`/api/teachers/${id}`, { method: 'DELETE' }).catch((e) => console.warn('API deleteTeacher notice:', e));

    this.notify();
    return true;
  }

  // --- CLASSES CRUD ---
  getClasses() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CLASSES);
      if (!raw) return INITIAL_CLASSES;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const hasObsolete = parsed.some(c => {
          const name = typeof c === 'string' ? c : (c.name || '');
          return name.includes('DKV') || name.includes('RPL');
        });
        if (hasObsolete) {
          localStorage.removeItem(STORAGE_KEYS.CLASSES);
          return INITIAL_CLASSES;
        }
        return parsed;
      }
      return INITIAL_CLASSES;
    } catch (e) {
      return INITIAL_CLASSES;
    }
  }

  saveClass(classData) {
    const classes = this.getClasses();
    const index = classes.findIndex((c) => c.id === classData.id);

    if (index >= 0) {
      classes[index] = { ...classes[index], ...classData };
    } else {
      const newId = classData.id || `CLS-${String(classes.length + 1).padStart(2, '0')}`;
      classes.push({
        ...classData,
        id: newId,
      });
    }

    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));

    fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData)
    }).catch((e) => console.warn('API saveClass notice:', e));

    this.notify();
    return true;
  }

  deleteClass(id) {
    let classes = this.getClasses();
    classes = classes.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));

    fetch(`/api/classes/${id}`, { method: 'DELETE' }).catch((e) => console.warn('API deleteClass notice:', e));

    this.notify();
    return true;
  }

  // --- BORROW & RETURN LOGIC ---
  getAuditLogs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
    } catch (e) {
      console.error('Failed reading audit logs from storage', e);
      return INITIAL_AUDIT_LOGS;
    }
  }

  borrowProjector({ unitId, teacherName, destinationClass, subject, durationPeriod, checklist, notes }) {
    const projectors = this.getProjectors();
    const auditLogs = this.getAuditLogs();

    const unitIndex = projectors.findIndex((p) => p.id === unitId);
    if (unitIndex === -1) {
      throw new Error(`Unit ${unitId} tidak ditemukan.`);
    }

    if (projectors[unitIndex].status === 'dipinjam') {
      throw new Error(`Unit ${unitId} sedang dipinjam oleh ${projectors[unitIndex].activeBorrow?.teacherName || 'orang lain'}.`);
    }

    const borrowTime = new Date().toISOString();
    const borrowId = `BRW-${Date.now().toString(36).toUpperCase()}`;
    const logId = `LOG-${Date.now()}`;

    const borrowData = {
      id: borrowId,
      logId,
      teacherName: teacherName.trim(),
      destinationClass: destinationClass.trim(),
      subject: subject ? subject.trim() : 'PBM Multimedia',
      durationPeriod,
      borrowTime,
      checklist,
      notes: notes ? notes.trim() : '',
    };

    projectors[unitIndex].status = 'dipinjam';
    projectors[unitIndex].activeBorrow = borrowData;

    const newLog = {
      id: logId,
      unitId,
      unitName: projectors[unitIndex].name,
      teacherName: borrowData.teacherName,
      destinationClass: borrowData.destinationClass,
      subject: borrowData.subject,
      durationPeriod: borrowData.durationPeriod,
      borrowTime,
      returnTime: null,
      status: 'aktif',
      checklist,
      returnChecklist: null,
      conditionOnReturn: null,
      notes: borrowData.notes,
      hoursUsed: 2.0,
    };

    auditLogs.unshift(newLog);

    localStorage.setItem(STORAGE_KEYS.PROJECTORS, JSON.stringify(projectors));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));

    // Send to MySQL via CI4 API
    fetch('/api/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unitId,
        teacherName: borrowData.teacherName,
        destinationClass: borrowData.destinationClass,
        durationPeriod: borrowData.durationPeriod,
        checklist,
        notes: borrowData.notes,
      })
    }).catch((e) => console.warn('API borrow sync notice:', e));

    this.notify();
    return { projector: projectors[unitIndex], log: newLog };
  }

  returnProjector({ unitId, returnChecklist, conditionOnReturn, notes, complaints = [], complaintNote = '', needsDirectAction = false }) {
    const projectors = this.getProjectors();
    const auditLogs = this.getAuditLogs();

    const unitIndex = projectors.findIndex((p) => p.id === unitId);
    if (unitIndex === -1) {
      throw new Error(`Unit ${unitId} tidak ditemukan.`);
    }

    const currentBorrow = projectors[unitIndex].activeBorrow;
    const returnTime = new Date().toISOString();

    const logIndex = auditLogs.findIndex(
      (l) => l.unitId === unitId && l.status === 'aktif'
    );

    let actualHours = 2.0;
    if (logIndex !== -1) {
      const borrowDate = new Date(auditLogs[logIndex].borrowTime);
      const returnDate = new Date(returnTime);
      const diffMinutes = Math.max(15, Math.round((returnDate - borrowDate) / (1000 * 60)));
      actualHours = parseFloat((diffMinutes / 60).toFixed(2));

      auditLogs[logIndex].returnTime = returnTime;
      auditLogs[logIndex].status = 'selesai';
      auditLogs[logIndex].returnChecklist = returnChecklist;
      auditLogs[logIndex].conditionOnReturn = conditionOnReturn || 'Lengkap & Baik';
      auditLogs[logIndex].complaints = complaints;
      auditLogs[logIndex].complaintNote = complaintNote;
      auditLogs[logIndex].needsDirectAction = needsDirectAction;

      const combinedNotes = [];
      if (auditLogs[logIndex].notes) combinedNotes.push(auditLogs[logIndex].notes);
      if (notes) combinedNotes.push(`Catatan: ${notes}`);
      if (complaints.length > 0) combinedNotes.push(`Keluhan: ${complaints.join(', ')}`);
      if (complaintNote) combinedNotes.push(`Detail Kendala: ${complaintNote}`);

      auditLogs[logIndex].notes = combinedNotes.join(' | ');
      auditLogs[logIndex].hoursUsed = actualHours;
    }

    // If marked for direct action or severe complaints, set to maintenance or record issue
    if (needsDirectAction || complaints.length > 0) {
      projectors[unitIndex].status = needsDirectAction ? 'maintenance' : 'tersedia';
      projectors[unitIndex].lastIssue = {
        date: returnTime,
        complaints: complaints,
        detail: complaintNote || notes || 'Perlu pengecekan teknisi Sarpras',
        reportedBy: currentBorrow?.teacherName || 'Guru',
        resolved: false
      };
    } else {
      projectors[unitIndex].status = 'tersedia';
      projectors[unitIndex].lastIssue = null;
    }

    projectors[unitIndex].activeBorrow = null;

    localStorage.setItem(STORAGE_KEYS.PROJECTORS, JSON.stringify(projectors));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));

    // Send to MySQL via CI4 API
    fetch('/api/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unitId,
        returnChecklist,
        conditionOnReturn,
        notes,
        complaints,
        complaintNote,
        needsDirectAction,
      })
    }).catch((e) => console.warn('API return sync notice:', e));

    this.notify();
    return { projector: projectors[unitIndex], returnTime, hoursUsed: actualHours };
  }

  resolveUnitMaintenance(unitId) {
    const projectors = this.getProjectors();
    const unitIndex = projectors.findIndex((p) => p.id === unitId);
    if (unitIndex !== -1) {
      projectors[unitIndex].status = 'tersedia';
      if (projectors[unitIndex].lastIssue) {
        projectors[unitIndex].lastIssue.resolved = true;
      }
      localStorage.setItem(STORAGE_KEYS.PROJECTORS, JSON.stringify(projectors));

      // Send to MySQL via CI4 API
      fetch('/api/resolve-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId })
      }).catch((e) => console.warn('API resolve sync notice:', e));

      this.notify();
      return true;
    }
    return false;
  }

  getStats() {
    const projectors = this.getProjectors();
    const logs = this.getAuditLogs();
    const teachers = this.getTeachers();
    const classes = this.getClasses();

    const totalUnits = projectors.length;
    const borrowedUnits = projectors.filter((p) => p.status === 'dipinjam').length;
    const availableUnits = projectors.filter((p) => p.status === 'tersedia').length;
    const maintenanceUnits = projectors.filter((p) => p.status === 'maintenance').length;

    const totalHours = logs.reduce((acc, log) => acc + (Number(log.hoursUsed) || 2), 0);

    const unitUsageMap = {};
    projectors.forEach((p) => {
      unitUsageMap[p.id] = { id: p.id, name: p.name, count: 0, totalHours: 0 };
    });

    logs.forEach((log) => {
      if (unitUsageMap[log.unitId]) {
        unitUsageMap[log.unitId].count += 1;
        unitUsageMap[log.unitId].totalHours += Number(log.hoursUsed) || 2;
      }
    });

    const unitUsageList = Object.values(unitUsageMap).map((u) => ({
      ...u,
      totalHours: parseFloat(u.totalHours.toFixed(1)),
    }));

    const teacherMap = {};
    logs.forEach((log) => {
      const name = log.teacherName || 'Guru Lain';
      if (!teacherMap[name]) {
        teacherMap[name] = { name, count: 0, totalHours: 0 };
      }
      teacherMap[name].count += 1;
      teacherMap[name].totalHours += Number(log.hoursUsed) || 2;
    });

    const teacherRanking = Object.values(teacherMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map((t) => ({ ...t, totalHours: parseFloat(t.totalHours.toFixed(1)) }));

    const classMap = {};
    logs.forEach((log) => {
      const cls = log.destinationClass || 'Kelas Umum';
      classMap[cls] = (classMap[cls] || 0) + 1;
    });

    const classRanking = Object.entries(classMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      totalUnits,
      borrowedUnits,
      availableUnits,
      maintenanceUnits,
      totalTeachers: teachers.length,
      totalClasses: classes.length,
      totalTransactions: logs.length,
      totalHours: parseFloat(totalHours.toFixed(1)),
      unitUsageList,
      teacherRanking,
      classRanking,
    };
  }

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.PROJECTORS, JSON.stringify(INITIAL_PROJECTORS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
    this.notify();
  }

  exportDataJSON() {
    const data = {
      projectors: this.getProjectors(),
      auditLogs: this.getAuditLogs(),
      teachers: this.getTeachers(),
      classes: this.getClasses(),
      exportedAt: new Date().toISOString(),
      schoolName: 'SMK Negeri 1 Surabaya - Bidang Sarana & Prasarana',
    };
    return JSON.stringify(data, null, 2);
  }

  importDataJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.projectors) && Array.isArray(parsed.auditLogs)) {
        localStorage.setItem(STORAGE_KEYS.PROJECTORS, JSON.stringify(parsed.projectors));
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(parsed.auditLogs));
        if (Array.isArray(parsed.teachers)) {
          localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(parsed.teachers));
        }
        if (Array.isArray(parsed.classes)) {
          localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(parsed.classes));
        }
        this.notify();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
}

export const storage = new StorageService();
