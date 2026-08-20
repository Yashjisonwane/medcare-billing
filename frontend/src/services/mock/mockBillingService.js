import { API_BASE_URL } from '../../config/api';

const API_BASE = API_BASE_URL;


export const mockBillingService = {
  async getFourBillsByCase(caseId = 'CASE-2025-1227') {
    const res = await fetch(`${API_BASE}/billing/cases/bills?caseId=${caseId}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve ledger statements.');
    }
    return res.json();
  },

  async getBillById(billId) {
    const res = await fetch(`${API_BASE}/billing/bills/${billId}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve bill details.');
    }
    return res.json();
  },

  async createBill(billData) {
    const res = await fetch(`${API_BASE}/billing/bills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate bill.');
    }
    return res.json();
  },

  async addServiceLine(targetBillId, lineItem) {
    const res = await fetch(`${API_BASE}/billing/bills/${targetBillId}/service-lines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lineItem)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add CPT charge to bill.');
    }
    return res.json();
  },

  async postPayment(billId, lineIndex, amount, payerType, referenceNumber) {
    const res = await fetch(`${API_BASE}/billing/bills/${billId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineIndex, amount, payerType, referenceNumber })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to post transaction payment.');
    }
    return res.json();
  },

  async postAdjustment(billId, lineIndex, amount, reason) {
    const res = await fetch(`${API_BASE}/billing/bills/${billId}/adjustments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineIndex, amount, reason })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to post write-off adjustment.');
    }
    return res.json();
  },

  async finaliseBill(billId) {
    const res = await fetch(`${API_BASE}/billing/bills/${billId}/finalise`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to finalise billing statement.');
    }
    return res.json();
  },

  async getAgingSummary(providerId = 'ALL') {
    try {
      const res = await fetch(`${API_BASE}/billing/aging?providerId=${providerId}`);
      if (!res.ok) throw new Error('Failed to retrieve aging summaries.');
      return await res.json();
    } catch (error) {
      console.warn('[mockBillingService] API Error:', error);
      return {
        grandTotal: 0,
        current: 0,
        past30: 0,
        past60: 0,
        past90: 0
      };
    }
  },

  async getOverviewStats() {
    try {
      const res = await fetch(`${API_BASE}/billing/overview-stats`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return {
        kpis: { totalBilled: 0, amountCollected: 0, totalAdjustments: 0, outstandingBalance: 0, past90Overdue: 0 },
        agingBuckets: { current: 0, past30: 0, past60: 0, past90: 0, grandTotal: 0 },
        providers: []
      };
    }
  },

  async getTransactions() {
    try {
      const res = await fetch(`${API_BASE}/billing/transactions`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return [];
    }
  }
};
