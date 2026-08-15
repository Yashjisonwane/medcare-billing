// src/services/mock/mockPatientService.js
import { INITIAL_PATIENTS } from './mockDataFixtures';

const STORAGE_KEY = 'medpractice_patients';

const getStoredPatients = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PATIENTS));
    return INITIAL_PATIENTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_PATIENTS;
  }
};

const savePatients = (patients) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
};

export const mockPatientService = {
  async getPatients(filters = {}) {
    await new Promise(res => setTimeout(res, 200));
    let patients = getStoredPatients();

    if (filters.search) {
      const q = filters.search.toLowerCase();
      patients = patients.filter(p => 
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.patientId.includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    }

    if (filters.status) {
      patients = patients.filter(p => p.status === filters.status);
    }

    if (filters.providerId) {
      patients = patients.filter(p => p.assignedProviderIds.includes(filters.providerId));
    }

    return patients;
  },

  async getPatientById(id) {
    await new Promise(res => setTimeout(res, 150));
    const patients = getStoredPatients();
    return patients.find(p => p.id === id || p.patientId === id) || patients[0];
  },

  async createPatient(patientData) {
    await new Promise(res => setTimeout(res, 300));
    const patients = getStoredPatients();
    const newPatient = {
      id: `pat-${Date.now()}`,
      patientId: `${Math.floor(100000000 + Math.random() * 900000000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      assignedProviderIds: patientData.assignedProviderIds || ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor'],
      ...patientData
    };
    patients.unshift(newPatient);
    savePatients(patients);
    return newPatient;
  },

  async updatePatient(id, updates) {
    await new Promise(res => setTimeout(res, 250));
    const patients = getStoredPatients();
    const index = patients.findIndex(p => p.id === id || p.patientId === id);
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updates };
      savePatients(patients);
      return patients[index];
    }
    throw new Error('Patient not found');
  }
};
