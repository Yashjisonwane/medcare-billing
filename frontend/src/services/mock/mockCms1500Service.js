import { mockBillingService } from './mockBillingService';
import { mapBillToCms1500Claims } from '../../utils/cmsMapper';

export const mockCms1500Service = {
  async getClaimsByBillId(billId) {
    const bill = await mockBillingService.getBillById(billId);
    if (!bill) return [];
    return mapBillToCms1500Claims(bill, null, { id: bill.providerId, identifiers: { taxId: bill.identifiers?.taxId || '993723387' } });
  },

  async getClaimById(claimId) {
    try {
      const res = await mockBillingService.getFourBillsByCase();
      const allBills = res.allBills || [];
      for (const bill of allBills) {
        const claims = await mockCms1500Service.getClaimsByBillId(bill.id);
        const found = claims.find(c => c.claimId === claimId);
        if (found) return found;
      }
    } catch (e) {
      console.error('Error searching claims dynamically:', e);
    }
    try {
      const defaultClaims = await mockCms1500Service.getClaimsByBillId('bill-anik-001');
      return defaultClaims && defaultClaims.length > 0 ? defaultClaims[0] : null;
    } catch (e) {
      console.warn('Fallback claim retrieval failed:', e);
      return null;
    }
  }
};
