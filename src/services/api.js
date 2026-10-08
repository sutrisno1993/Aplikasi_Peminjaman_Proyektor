// API Service - Langsung Terhubung ke MySQL Database SIMPRO via CodeIgniter 4 REST API
const BASE_URL = '/api';

export const api = {
  async getProjectors() {
    const res = await fetch(`${BASE_URL}/projectors`);
    if (!res.ok) throw new Error('Gagal mengambil data proyektor dari MySQL');
    const json = await res.json();
    return json.data || [];
  },

  async getTeachers() {
    const res = await fetch(`${BASE_URL}/teachers`);
    if (!res.ok) throw new Error('Gagal mengambil data guru dari MySQL');
    const json = await res.json();
    return json.data || [];
  },

  async getClasses() {
    const res = await fetch(`${BASE_URL}/classes`);
    if (!res.ok) throw new Error('Gagal mengambil data kelas dari MySQL');
    const json = await res.json();
    return json.data || [];
  },

  async getLogs() {
    const res = await fetch(`${BASE_URL}/logs`);
    if (!res.ok) throw new Error('Gagal mengambil data log audit dari MySQL');
    const json = await res.json();
    return json.data || [];
  },

  async borrow(borrowData) {
    const res = await fetch(`${BASE_URL}/borrow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(borrowData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.messages?.error || err.message || 'Gagal memproses peminjaman di MySQL');
    }
    return await res.json();
  },

  async returnProjector(returnData) {
    const res = await fetch(`${BASE_URL}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(returnData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.messages?.error || err.message || 'Gagal memproses pengembalian di MySQL');
    }
    return await res.json();
  },

  async resolveComplaint(unitId) {
    const res = await fetch(`${BASE_URL}/resolve-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unitId }),
    });
    if (!res.ok) throw new Error('Gagal menyelesaikan keluhan di MySQL');
    return await res.json();
  },

  async saveTeacher(teacherData) {
    const res = await fetch(`${BASE_URL}/teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData),
    });
    return await res.json();
  },

  async deleteTeacher(id) {
    const res = await fetch(`${BASE_URL}/teachers/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  },

  async saveClass(classData) {
    const res = await fetch(`${BASE_URL}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData),
    });
    return await res.json();
  },

  async deleteClass(id) {
    const res = await fetch(`${BASE_URL}/classes/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  },

  async saveProjector(projectorData) {
    const res = await fetch(`${BASE_URL}/projectors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectorData),
    });
    return await res.json();
  },

  async deleteProjector(id) {
    const res = await fetch(`${BASE_URL}/projectors/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  },
};
