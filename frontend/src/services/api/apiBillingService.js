import { API_BASE_URL } from '../../config/api';

const API_BASE = API_BASE_URL;


export const apiBillingService = {
  async getOverviewStats() {
    const res = await fetch(`${API_BASE}/billing/overview-stats`);
    if (!res.ok) throw new Error('Failed to retrieve billing overview stats.');
    return res.json();
  },

  async getFourBillsByCase(caseId) {
    if (!caseId) return { caseId: null, allBills: [] };
    const res = await fetch(`${API_BASE}/billing/cases/bills?caseId=${encodeURIComponent(caseId)}`);
    if (!res.ok) throw new Error('Failed to retrieve case bills.');
    return res.json();
  },

  async getBillById(id) {
    if (!id) return null;
    const res = await fetch(`${API_BASE}/billing/bills/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Failed to retrieve bill ${id}`);
    return res.json();
  },

  async createBill(payload) {
    const res = await fetch(`${API_BASE}/billing/bills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create bill');
    return res.json();
  },

  async addServiceLine(billId, payload) {
    const res = await fetch(`${API_BASE}/billing/bills/${encodeURIComponent(billId)}/service-lines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to add service line');
    return res.json();
  },

  async postPayment(billId, payload) {
    const res = await fetch(`${API_BASE}/billing/bills/${encodeURIComponent(billId)}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to post payment');
    return res.json();
  },

  async postAdjustment(billId, payload) {
    const res = await fetch(`${API_BASE}/billing/bills/${encodeURIComponent(billId)}/adjustments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to post adjustment');
    return res.json();
  },

  async finaliseBill(billId) {
    const res = await fetch(`${API_BASE}/billing/bills/${encodeURIComponent(billId)}/finalise`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to finalise bill');
    return res.json();
  },

  async getAgingSummary() {
    const res = await fetch(`${API_BASE}/billing/aging`);
    if (!res.ok) throw new Error('Failed to retrieve aging summary.');
    return res.json();
  },

  async getPaymentsList() {
    const res = await fetch(`${API_BASE}/billing/transactions`);
    if (!res.ok) throw new Error('Failed to retrieve payments list.');
    return res.json();
  },

  async getPracticeReports() {
    const res = await fetch(`${API_BASE}/billing/reports`);
    if (!res.ok) throw new Error('Failed to retrieve practice reports.');
    return res.json();
  },

  async updateBill(billId, payload) {
    const res = await fetch(`${API_BASE}/billing/bills/${encodeURIComponent(billId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update bill charges');
    return res.json();
  },

  async deleteBill(billId) {
    const res = await fetch(`${API_BASE}/billing/bills/${encodeURIComponent(billId)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete bill statement');
    return res.json();
  }
};
