const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';

export const apiBillingService = {
  async getFourBillsByCase(caseId) {
    if (!caseId) return { caseId: null, allBills: [] };
    const res = await fetch(`${API_BASE}/billing/cases/bills?caseId=${caseId}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve case bills.');
    }
    return res.json();
  }
};
