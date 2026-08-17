const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';

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
    const res = await fetch(`${API_BASE}/billing/aging?providerId=${providerId}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve aging summaries.');
    }
    return res.json();
  },

  async getOverviewStats() {
    try {
      const res = await fetch(`${API_BASE}/billing/overview-stats`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return {
        kpis: { totalBilled: 58054, amountCollected: 0, totalAdjustments: 50, outstandingBalance: 58004, past90Overdue: 28790 },
        agingBuckets: { current: 27090, past30: 1644, past60: 530, past90: 28790, grandTotal: 58004 },
        providers: [
          { name: 'JOSMIC Wellness Center', specialty: 'Pain Management', total: 4428, paid: 0, balance: 4428, status: 'Finalised', color: 'teal' },
          { name: "DAV'S Anatomy", specialty: 'Shockwave (ESWT)', total: 17870, paid: 0, balance: 17870, status: 'Issued', color: 'blue' },
          { name: 'ANIK Laser Therapy', specialty: 'Laser Therapy', total: 33526, paid: 0, balance: 33476, status: 'Issued', color: 'violet' },
          { name: 'Counselor Practice', specialty: 'Counseling & Mental Health', total: 1140, paid: 0, balance: 1140, status: 'Issued', color: 'amber' }
        ]
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
