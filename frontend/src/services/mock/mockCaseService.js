// src/services/mock/mockCaseService.js
import { INITIAL_CASES } from './mockDataFixtures';

const STORAGE_KEY = 'medpractice_cases';

const getStoredCases = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CASES));
    return INITIAL_CASES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_CASES;
  }
};

const saveCases = (cases) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
};

export const mockCaseService = {
  async getCases(filters = {}) {
    await new Promise(res => setTimeout(res, 200));
    let cases = getStoredCases();

    if (filters.patientId) {
      cases = cases.filter(c => c.patientId === filters.patientId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      cases = cases.filter(c => 
        c.caseId.toLowerCase().includes(q) ||
        c.patientName.toLowerCase().includes(q) ||
        c.attorneyName.toLowerCase().includes(q)
      );
    }

    return cases;
  },

  async getCaseById(id) {
    await new Promise(res => setTimeout(res, 150));
    const cases = getStoredCases();
    return cases.find(c => c.id === id || c.caseId === id) || cases[0];
  },

  async createCase(caseData) {
    await new Promise(res => setTimeout(res, 300));
    const cases = getStoredCases();
    const newCase = {
      id: `case-${Date.now()}`,
      caseId: `CASE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'ACTIVE',
      assignedProviderIds: ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor'],
      ...caseData
    };
    cases.unshift(newCase);
    saveCases(cases);
    return newCase;
  },

  async updateAssignedProviders(caseId, providerIds) {
    await new Promise(res => setTimeout(res, 200));
    const cases = getStoredCases();
    const index = cases.findIndex(c => c.id === caseId || c.caseId === caseId);
    if (index !== -1) {
      cases[index].assignedProviderIds = providerIds;
      saveCases(cases);
      return cases[index];
    }
    throw new Error('Case not found');
  }
};
