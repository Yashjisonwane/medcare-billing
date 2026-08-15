// src/services/mock/mockBillingService.js
import { calculateBillLedgerTotals, formatCurrency } from '../../utils/billingCalculations';

const STORAGE_KEY = 'medpractice_mock_bills';

const computeBillTotals = (lineItems = []) => {
  let totalCharges = 0;
  let totalPayments = 0;
  let totalAdjustments = 0;

  lineItems.forEach(item => {
    const charge = Number(item.charge) || 0;
    const ins = Number(item.payments?.insurance) || 0;
    const pat = Number(item.payments?.patient) || 0;
    const oth = Number(item.payments?.other) || 0;
    const adj = Number(item.adjustments) || 0;

    totalCharges += charge;
    totalPayments += (ins + pat + oth);
    totalAdjustments += adj;
  });

  const balanceDue = totalCharges - (totalPayments + totalAdjustments);
  return {
    totalCharges: Number(totalCharges.toFixed(2)),
    totalPayments: Number(totalPayments.toFixed(2)),
    totalAdjustments: Number(totalAdjustments.toFixed(2)),
    balanceDue: Number(balanceDue.toFixed(2))
  };
};

const computeAging = (bills = []) => {
  let grandTotal = 0;
  let current = 0;
  let past30 = 0;
  let past60 = 0;
  let past90 = 0;

  bills.forEach(b => {
    grandTotal += (b.totals?.balanceDue || 0);
    current += (b.aging?.current || 0);
    past30 += (b.aging?.past30 || 0);
    past60 += (b.aging?.past60 || 0);
    past90 += (b.aging?.past90 || 0);
  });

  return { grandTotal, current, past30, past60, past90 };
};

// Initial Mock Bills strictly matching sample PDF billing statements
const INITIAL_BILLS = [
  // 1. JOSMIC Wellness Center Statement (Sample PDF Page 2 - Total $1,214.00)
  {
    id: 'bill-josmic-001',
    providerId: 'prov-josmic',
    providerName: 'JOSMIC Wellness Center',
    providerAddress: '10101 Harwin Dr. Suite 774, Houston TX 77036',
    providerPhone: '713-485-5712',
    serviceCategory: 'Pain Management Consultation',
    patientId: 'pat-001',
    patientName: 'SAMPLE TESTING',
    patientAddress: '17650 Carnation Glen Dr, Richmond TX 77407',
    patientSystemId: '141849159',
    caseId: 'CASE-2025-1227',
    statementNumber: '120197',
    statementDate: '2/11/2026',
    billToName: 'OJ LAW FIRM & ASSOCIATES',
    billToAddress: '11711 Bedford St. Suite 01, Houston TX 77031',
    status: 'FINALISED_DEMO',
    lineItems: [
      {
        dos: '12/30/2025',
        cptCode: '99204',
        description: 'PAIN CONSULT',
        units: 1,
        charge: 1214.00,
        payments: { insurance: 0, patient: 0, other: 0 },
        adjustments: 0,
        lineBalance: 1214.00,
      }
    ],
    totals: { totalCharges: 1214.00, totalPayments: 0, totalAdjustments: 0, balanceDue: 1214.00 },
    aging: { current: 0, past30: 1214.00, past60: 0, past90: 0 }
  },

  // 2. DAV'S Anatomy Statement (Sample PDF Pages 2-3 - 15 Line Items - Total $9,870.00)
  {
    id: 'bill-davs-001',
    providerId: 'prov-davs',
    providerName: "DAV'S Anatomy",
    providerAddress: '10101 Harwin Dr. Suite 274, Houston TX 77036',
    providerPhone: '832-815-0959',
    serviceCategory: 'Shockwave Therapy (ESWT)',
    patientId: 'pat-001',
    patientName: 'SAMPLE TESTING',
    patientAddress: '17650 Carnation Glen Dr, Richmond TX 77407',
    patientSystemId: '141849159',
    caseId: 'CASE-2025-1227',
    statementNumber: '121559',
    statementDate: '4/13/2026',
    billToName: 'OJ LAWAL REMI ADESHOLA',
    billToAddress: '11711 Bedford St. Suite 1, Houston TX 77031',
    status: 'ISSUED_DEMO',
    lineItems: [
      { dos: '01/06/2026', cptCode: '99204', description: 'INITIAL VISIT II', units: 1, charge: 250.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 250.00 },
      { dos: '01/06/2026', cptCode: '0101T', description: 'SHOCKWAVE', units: 1, charge: 1000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 1000.00 },
      { dos: '01/06/2026', cptCode: '0101T', description: 'SHOCKWAVE', units: 1, charge: 1000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 1000.00 },
      { dos: '01/06/2026', cptCode: '0101T', description: 'SHOCKWAVE', units: 1, charge: 1000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 1000.00 },
      { dos: '01/06/2026', cptCode: '10001', description: 'Eye protective glasses', units: 1, charge: 50.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 50.00 },
      { dos: '01/06/2026', cptCode: '97124', description: 'Massage therapy I', units: 1, charge: 90.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 90.00 },
      
      { dos: '01/07/2026', cptCode: '0101T', description: 'SHOCKWAVE', units: 1, charge: 1000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 1000.00 },
      { dos: '01/07/2026', cptCode: '0101T', description: 'SHOCKWAVE', units: 1, charge: 1000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 1000.00 },
      { dos: '01/07/2026', cptCode: '0101T', description: 'SHOCKWAVE', units: 1, charge: 1000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 1000.00 },
      { dos: '01/07/2026', cptCode: '10001', description: 'Eye protective glasses', units: 1, charge: 50.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 50.00 },
      { dos: '01/07/2026', cptCode: '97124', description: 'Massage therapy I', units: 1, charge: 90.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 90.00 },

      { dos: '01/08/2026', cptCode: '99214', description: 'FINAL VISIT II', units: 1, charge: 200.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 200.00 },
      { dos: '01/08/2026', cptCode: '0101T', description: 'SHOCKWAVE', units: 1, charge: 1000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 1000.00 },
      { dos: '01/08/2026', cptCode: '0101T', description: 'SHOCKWAVE', units: 1, charge: 1000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 1000.00 },
      { dos: '01/08/2026', cptCode: '0101T', description: 'SHOCKWAVE', units: 1, charge: 1000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 1000.00 },
    ],
    totals: { totalCharges: 9870.00, totalPayments: 0, totalAdjustments: 0, balanceDue: 9870.00 },
    aging: { current: 0, past30: 0, past60: 0, past90: 9870.00 }
  },

  // 3. ANIK Laser Therapy Statement (Sample PDF Pages 2-3 - 16 Line Items - Total $18,920.00)
  {
    id: 'bill-anik-001',
    providerId: 'prov-anik',
    providerName: 'ANIK Laser Therapy',
    providerAddress: '10101 Harwin Dr. Suite 274, Houston TX 77036',
    providerPhone: '832-815-0959',
    serviceCategory: 'Laser Therapy',
    patientId: 'pat-001',
    patientName: 'SAMPLE TESTING',
    patientAddress: '17650 Carnation Glen Dr, Richmond TX 77407',
    patientSystemId: '141849159',
    caseId: 'CASE-2025-1227',
    statementNumber: '121560',
    statementDate: '4/13/2026',
    billToName: 'OJ LAWAL REMI ADESHOLA',
    billToAddress: '11711 Bedford St. Suite 1, Houston TX 77031',
    status: 'ISSUED_DEMO',
    lineItems: [
      { dos: '01/22/2026', cptCode: '97039', description: 'LASER THERAPY', units: 1, charge: 2000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 2000.00 },
      { dos: '01/22/2026', cptCode: '97039', description: 'LASER THERAPY', units: 1, charge: 2000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 2000.00 },
      { dos: '01/22/2026', cptCode: '97039', description: 'LASER THERAPY', units: 1, charge: 2000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 2000.00 },
      { dos: '01/22/2026', cptCode: '10001', description: 'Eye protective glasses', units: 1, charge: 50.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 50.00 },
      { dos: '01/22/2026', cptCode: '97124', description: 'Massage therapy I', units: 1, charge: 90.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 90.00 },

      { dos: '01/24/2026', cptCode: '97039', description: 'LASER THERAPY', units: 1, charge: 2000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 2000.00 },
      { dos: '01/24/2026', cptCode: '97039', description: 'LASER THERAPY', units: 1, charge: 2000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 2000.00 },
      { dos: '01/24/2026', cptCode: '97039', description: 'LASER THERAPY', units: 1, charge: 2000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 2000.00 },
      { dos: '01/24/2026', cptCode: '10001', description: 'Eye protective glasses', units: 1, charge: 50.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 50.00 },
      { dos: '01/24/2026', cptCode: '97124', description: 'Massage therapy I', units: 1, charge: 90.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 90.00 },

      { dos: '01/26/2026', cptCode: '97039', description: 'LASER THERAPY', units: 1, charge: 2000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 2000.00 },
      { dos: '01/26/2026', cptCode: '97039', description: 'LASER THERAPY', units: 1, charge: 2000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 2000.00 },
      { dos: '01/26/2026', cptCode: '97039', description: 'LASER THERAPY', units: 1, charge: 2000.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 2000.00 },
      { dos: '01/26/2026', cptCode: '10001', description: 'Eye protective glasses', units: 1, charge: 50.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 50.00 },
      { dos: '01/26/2026', cptCode: '97124', description: 'Massage therapy I', units: 1, charge: 90.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 90.00 },
      { dos: '01/26/2026', cptCode: '99213', description: 'FOLLOW-UP CONSULT', units: 1, charge: 500.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 500.00 }
    ],
    totals: { totalCharges: 18920.00, totalPayments: 0, totalAdjustments: 0, balanceDue: 18920.00 },
    aging: { current: 0, past30: 0, past60: 0, past90: 18920.00 }
  },

  // 4. Counselor Practice Statement (Behavioral Health / Mental Health)
  {
    id: 'bill-counselor-001',
    providerId: 'prov-counselor',
    providerName: 'Counselor Practice (Hope Behavioral Health)',
    providerAddress: '10101 Harwin Dr. Suite 774-C, Houston TX 77036',
    providerPhone: '(713) 555-0188',
    serviceCategory: 'Counseling & Mental Health',
    patientId: 'pat-001',
    patientName: 'SAMPLE TESTING',
    patientAddress: '17650 Carnation Glen Dr, Richmond TX 77407',
    patientSystemId: '141849159',
    caseId: 'CASE-2025-1227',
    statementNumber: '1024-C',
    statementDate: '01/26/2026',
    billToName: 'OJ LAW FIRM & ASSOCIATES',
    billToAddress: '11711 Bedford St. Suite 01, Houston TX 77031',
    status: 'ACTIVE_DEMO',
    diagnosisCodes: ['F43.10', 'F41.1', 'F32.9', 'M54.50'],
    renderingNpi: '1487965213',
    taxId: '84-7891234',
    lineItems: [
      { dos: '01/05/2026', cptCode: '90791', description: 'PSYCHIATRIC DIAGNOSTIC EVALUATION', units: 1, charge: 350.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 350.00 },
      { dos: '01/12/2026', cptCode: '90834', description: 'PSYCHOTHERAPY 45 MIN (POST-TRAUMA)', units: 1, charge: 180.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 180.00 },
      { dos: '01/19/2026', cptCode: '90834', description: 'PSYCHOTHERAPY 45 MIN (PAIN / ANXIETY COPING)', units: 1, charge: 180.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 180.00 },
      { dos: '01/26/2026', cptCode: '90837', description: 'PSYCHOTHERAPY 60 MIN (CRISIS & RECOVERY)', units: 1, charge: 250.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 250.00 },
      { dos: '02/02/2026', cptCode: '90834', description: 'PSYCHOTHERAPY 45 MIN (PROGRESS EVAL)', units: 1, charge: 180.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 180.00 }
    ],
    totals: { totalCharges: 1140.00, totalPayments: 0, totalAdjustments: 0, balanceDue: 1140.00 },
    aging: { current: 180.00, past30: 430.00, past60: 530.00, past90: 0 }
  }
];

const getStoredBills = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BILLS));
    return INITIAL_BILLS;
  }
  try {
    const parsed = JSON.parse(saved);
    // Auto-upgrade Counselor bill if previously empty placeholder
    const counselorBill = parsed.find(b => b.id === 'bill-counselor-001');
    if (!counselorBill || !counselorBill.lineItems || counselorBill.lineItems.length === 0) {
      const initialCounselor = INITIAL_BILLS.find(b => b.id === 'bill-counselor-001');
      if (initialCounselor) {
        const updated = parsed.filter(b => b.id !== 'bill-counselor-001').concat([initialCounselor]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
    }
    return parsed;
  } catch (e) {
    return INITIAL_BILLS;
  }
};

const saveBills = (bills) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
};

export const mockBillingService = {
  getFourBillsByCase: async (caseId = 'CASE-2025-1227') => {
    const bills = getStoredBills();
    const caseBills = bills.filter(b => b.caseId === caseId || b.caseId === 'case-001');
    return {
      caseId,
      allBills: caseBills.length > 0 ? caseBills : bills
    };
  },

  getBillById: async (billId) => {
    const bills = getStoredBills();
    return bills.find(b => b.id === billId) || bills[0];
  },

  createBill: async (billData) => {
    const bills = getStoredBills();
    const newBill = {
      id: `bill-${Date.now()}`,
      statementNumber: `${Math.floor(100000 + Math.random() * 900000)}`,
      statementDate: new Date().toLocaleDateString(),
      status: 'ISSUED_DEMO',
      lineItems: billData.lineItems || [],
      totals: computeBillTotals(billData.lineItems || []),
      aging: { current: billData.totalCharges || 0, past30: 0, past60: 0, past90: 0 },
      ...billData
    };
    bills.push(newBill);
    saveBills(bills);
    return newBill;
  },

  postPayment: async (billId, lineIndex, amount, payerType, referenceNumber) => {
    const bills = getStoredBills();
    const bill = bills.find(b => b.id === billId);
    if (bill && bill.lineItems[lineIndex]) {
      const item = bill.lineItems[lineIndex];
      if (payerType === 'INSURANCE') item.payments.insurance += amount;
      else if (payerType === 'PATIENT') item.payments.patient += amount;
      else item.payments.other += amount;
      
      const totalLinePay = item.payments.insurance + item.payments.patient + item.payments.other;
      item.lineBalance = Math.max(0, item.charge - (totalLinePay + item.adjustments));
      bill.totals = computeBillTotals(bill.lineItems);
      saveBills(bills);
    }
    return bill;
  },

  postAdjustment: async (billId, lineIndex, amount, reason) => {
    const bills = getStoredBills();
    const bill = bills.find(b => b.id === billId);
    if (bill && bill.lineItems[lineIndex]) {
      const item = bill.lineItems[lineIndex];
      item.adjustments += amount;
      const totalLinePay = item.payments.insurance + item.payments.patient + item.payments.other;
      item.lineBalance = Math.max(0, item.charge - (totalLinePay + item.adjustments));
      bill.totals = computeBillTotals(bill.lineItems);
      saveBills(bills);
    }
    return bill;
  },

  finaliseBill: async (billId) => {
    const bills = getStoredBills();
    const bill = bills.find(b => b.id === billId);
    if (bill) {
      bill.status = 'FINALISED_DEMO';
      saveBills(bills);
    }
    return bill;
  },

  getAgingSummary: async (providerId = 'ALL') => {
    let bills = getStoredBills();
    if (providerId && providerId !== 'ALL') {
      bills = bills.filter(b => b.providerId === providerId);
    }
    return computeAging(bills);
  }
};
