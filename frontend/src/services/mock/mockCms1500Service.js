// src/services/mock/mockCms1500Service.js
import { mockBillingService } from './mockBillingService';
import { mapBillToCms1500Claims } from '../../utils/cmsMapper';

export const mockCms1500Service = {
  getClaimsByBillId: async (billId) => {
    const bill = await mockBillingService.getBillById(billId);
    if (!bill) return [];
    return mapBillToCms1500Claims(bill, null, { id: bill.providerId, identifiers: { taxId: '993723387' } });
  },

  getClaimById: async (claimId) => {
    const allBills = ['bill-anik-001', 'bill-davs-001', 'bill-josmic-001'];
    for (const bId of allBills) {
      const claims = await mockCms1500Service.getClaimsByBillId(bId);
      const found = claims.find(c => c.claimId === claimId);
      if (found) return found;
    }
    const defaultClaims = await mockCms1500Service.getClaimsByBillId('bill-anik-001');
    return defaultClaims[0];
  }
};
