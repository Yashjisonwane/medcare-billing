import { prisma } from '../config/db.js';

/**
 * Format a DB Bill and its ServiceLines to match frontend expectations
 */
const formatBill = (b) => {
  if (!b) return null;
  
  const formattedLines = (b.serviceLines || []).map(l => {
    // Reconstruct payments object for frontend compatibility
    const insPay = Number(l.insurancePayment) || 0;
    const patPay = Number(l.patientPayment) || 0;
    const othPay = Number(l.otherPayment) || 0;

    return {
      dos: l.dos || l.dateOfService || '',
      dateOfService: l.dateOfService || l.dos || '',
      cptCode: l.cptCode,
      description: l.description || '',
      modifier1: l.modifier1 || '',
      modifier2: l.modifier2 || '',
      modifier3: l.modifier3 || '',
      modifier4: l.modifier4 || '',
      units: l.units || 1,
      charge: Number(l.charge),
      payments: {
        insurance: insPay,
        patient: patPay,
        other: othPay
      },
      adjustments: Number(l.adjustments) || 0,
      balance: Number(l.balance),
      lineBalance: Number(l.lineBalance)
    };
  });

  return {
    id: b.id,
    caseId: b.caseId,
    providerId: b.providerId,
    providerName: b.provider?.name || 'JOSMIC Wellness Center',
    providerAddress: b.provider?.address ? `${b.provider.address.street}, ${b.provider.address.city}` : '10101 Harwin Dr, Houston TX',
    providerPhone: b.provider?.contact?.phone || '713-485-5712',
    serviceCategory: b.provider?.serviceCategory || 'Pain Management Consultation',
    patientId: b.case?.patientId || b.patientId || 'pat-001',
    patientName: b.case?.patient ? `${b.case.patient.firstName} ${b.case.patient.lastName}`.trim() : 'SAMPLE TESTING',
    patientAddress: b.case?.patient?.street ? `${b.case.patient.street}, ${b.case.patient.city} ${b.case.patient.state}` : '17650 Carnation Glen Dr, Richmond TX',
    patientSystemId: b.case?.patient?.patientId || '141849159',
    statementNumber: b.statementNumber || '',
    statementDate: b.statementDate || '',
    billToName: b.billToName || 'OJ LAW FIRM & ASSOCIATES',
    billToAddress: b.billToAddress || '11711 Bedford St. Suite 01, Houston TX',
    status: b.status,
    lineItems: formattedLines,
    totals: typeof b.totals === 'string' ? JSON.parse(b.totals) : b.totals || { totalCharges: 0, totalPayments: 0, totalAdjustments: 0, balanceDue: 0 },
    aging: typeof b.aging === 'string' ? JSON.parse(b.aging) : b.aging || { current: 0, past30: 0, past60: 0, past90: 0 }
  };
};

/**
 * Re-calculate Bill totals based on its itemized lines
 */
const recalculateBillTotals = async (billId) => {
  const lines = await prisma.serviceLine.findMany({
    where: { billId }
  });

  let totalCharges = 0;
  let totalPayments = 0;
  let totalAdjustments = 0;

  for (const l of lines) {
    const charge = Number(l.charge) || 0;
    const insPay = Number(l.insurancePayment) || 0;
    const patPay = Number(l.patientPayment) || 0;
    const othPay = Number(l.otherPayment) || 0;
    const adj = Number(l.adjustments) || 0;

    totalCharges += charge;
    totalPayments += (insPay + patPay + othPay);
    totalAdjustments += adj;
  }

  const balanceDue = totalCharges - (totalPayments + totalAdjustments);

  const totals = {
    totalCharges: Number(totalCharges.toFixed(2)),
    totalPayments: Number(totalPayments.toFixed(2)),
    totalAdjustments: Number(totalAdjustments.toFixed(2)),
    balanceDue: Number(balanceDue.toFixed(2))
  };

  // Keep aging in sync with balance
  const aging = {
    current: Number(balanceDue.toFixed(2)),
    past30: 0,
    past60: 0,
    past90: 0
  };

  await prisma.bill.update({
    where: { id: billId },
    data: {
      totals,
      aging
    }
  });
};

/**
 * Get bills statement for a case
 */
export const getFourBillsByCase = async (req, res) => {
  const { caseId } = req.query;

  try {
    const where = {};
    if (caseId) {
      where.caseId = caseId;
    }

    const bills = await prisma.bill.findMany({
      where,
      include: {
        serviceLines: true,
        provider: true,
        case: {
          include: {
            patient: true
          }
        }
      }
    });

    return res.status(200).json({
      caseId: caseId || 'case-001',
      allBills: bills.map(formatBill)
    });
  } catch (error) {
    console.error('Error fetching case bills:', error);
    return res.status(500).json({ error: 'Internal server error fetching bills.' });
  }
};

/**
 * Get single bill details by ID
 */
export const getBillById = async (req, res) => {
  const { id } = req.params;

  try {
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        serviceLines: true,
        provider: true,
        case: {
          include: {
            patient: true
          }
        }
      }
    });

    if (!bill) {
      return res.status(404).json({ error: 'Billing statement not found.' });
    }

    return res.status(200).json(formatBill(bill));
  } catch (error) {
    console.error('Error fetching bill details:', error);
    return res.status(500).json({ error: 'Failed to retrieve bill.' });
  }
};

/**
 * Create/Generate a new billing statement
 */
export const createBill = async (req, res) => {
  const data = req.body;

  if (!data.caseId || !data.providerId) {
    return res.status(400).json({ error: 'caseId and providerId are required.' });
  }

  const generatedId = `bill-${Date.now()}`;
  const statementNum = `${Math.floor(100000 + Math.random() * 900000)}`;
  const statementDate = new Date().toLocaleDateString('en-US');

  try {
    const newBill = await prisma.bill.create({
      data: {
        id: generatedId,
        caseId: data.caseId,
        providerId: data.providerId,
        invoiceNumber: `INV-${Date.now()}`,
        statementNumber: statementNum,
        statementDate,
        billToName: data.billToName || 'OJ LAW FIRM & ASSOCIATES',
        billToAddress: data.billToAddress || '11711 Bedford St. Suite 01, Houston TX 77031',
        status: 'ISSUED_DEMO',
        totals: { totalCharges: 0, totalPayments: 0, totalAdjustments: 0, balanceDue: 0 },
        aging: { current: 0, past30: 0, past60: 0, past90: 0 }
      },
      include: {
        serviceLines: true,
        provider: true,
        case: {
          include: {
            patient: true
          }
        }
      }
    });

    return res.status(201).json(formatBill(newBill));
  } catch (error) {
    console.error('Error creating bill statement:', error);
    return res.status(500).json({ error: 'Failed to generate bill statement.' });
  }
};

/**
 * Add a service line to a billing statement
 */
export const addServiceLine = async (req, res) => {
  const { id } = req.params;
  const line = req.body;

  try {
    const existing = await prisma.bill.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Bill statement not found.' });
    }

    // Support single serviceLine additions or a list of lines (e.g. from CreateBillPage.jsx form submit)
    const linesToAdd = line.serviceLines ? line.serviceLines : [line];

    for (const item of linesToAdd) {
      const lineId = `srv-l-${Date.now()}-${Math.floor(Math.random() * 100)}`;
      const chargeAmount = parseFloat(item.charge) || 180.00;
      
      await prisma.serviceLine.create({
        data: {
          id: lineId,
          billId: id,
          dos: item.dos || new Date().toLocaleDateString('en-US'),
          dateOfService: item.dos || new Date().toLocaleDateString('en-US'),
          cptCode: item.cptCode || '99204',
          description: item.description || 'Medical Consultation',
          charge: chargeAmount,
          balance: chargeAmount,
          lineBalance: chargeAmount,
          insurancePayment: 0.00,
          patientPayment: 0.00,
          otherPayment: 0.00,
          adjustments: 0.00
        }
      });
    }

    // Re-calculate parent totals
    await recalculateBillTotals(id);

    const updated = await prisma.bill.findUnique({
      where: { id },
      include: {
        serviceLines: true,
        provider: true,
        case: { include: { patient: true } }
      }
    });

    return res.status(200).json(formatBill(updated));
  } catch (error) {
    console.error('Error adding service line:', error);
    return res.status(500).json({ error: 'Failed to append service line charge.' });
  }
};

/**
 * Post payment to a specific itemized CPT line
 */
export const postPayment = async (req, res) => {
  const { id } = req.params;
  const { lineIndex, amount, payerType, referenceNumber } = req.body;

  try {
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: { serviceLines: true }
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found.' });
    }

    const lines = bill.serviceLines;
    const targetLine = lines[lineIndex];

    if (!targetLine) {
      return res.status(400).json({ error: 'Invalid CPT line index.' });
    }

    let insurancePayment = Number(targetLine.insurancePayment) || 0;
    let patientPayment = Number(targetLine.patientPayment) || 0;
    let otherPayment = Number(targetLine.otherPayment) || 0;

    if (payerType === 'INSURANCE') {
      insurancePayment += parseFloat(amount);
    } else if (payerType === 'PATIENT') {
      patientPayment += parseFloat(amount);
    } else {
      otherPayment += parseFloat(amount);
    }

    const totalLinePay = insurancePayment + patientPayment + otherPayment;
    const adjustments = Number(targetLine.adjustments) || 0;
    const lineBalance = Math.max(0, Number(targetLine.charge) - (totalLinePay + adjustments));

    await prisma.serviceLine.update({
      where: { id: targetLine.id },
      data: {
        insurancePayment,
        patientPayment,
        otherPayment,
        balance: lineBalance,
        lineBalance
      }
    });

    // Create Transaction Record
    await prisma.transaction.create({
      data: {
        id: `tx-${Date.now()}`,
        billId: id,
        transactionType: 'PAYMENT',
        source: payerType || 'INSURANCE',
        amount: parseFloat(amount),
        referenceNumber: referenceNumber || '',
        notes: `Payer: ${payerType}. Ref: ${referenceNumber || 'N/A'}`
      }
    });

    await recalculateBillTotals(id);

    const updated = await prisma.bill.findUnique({
      where: { id },
      include: {
        serviceLines: true,
        provider: true,
        case: { include: { patient: true } }
      }
    });

    return res.status(200).json(formatBill(updated));
  } catch (error) {
    console.error('Error posting payment:', error);
    return res.status(500).json({ error: 'Failed to post transaction payment.' });
  }
};

/**
 * Post adjustment write-off
 */
export const postAdjustment = async (req, res) => {
  const { id } = req.params;
  const { lineIndex, amount, reason } = req.body;

  try {
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: { serviceLines: true }
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found.' });
    }

    const lines = bill.serviceLines;
    const targetLine = lines[lineIndex];

    if (!targetLine) {
      return res.status(400).json({ error: 'Invalid CPT line index.' });
    }

    const insurancePayment = Number(targetLine.insurancePayment) || 0;
    const patientPayment = Number(targetLine.patientPayment) || 0;
    const otherPayment = Number(targetLine.otherPayment) || 0;

    const adjustments = (Number(targetLine.adjustments) || 0) + parseFloat(amount);
    const totalLinePay = insurancePayment + patientPayment + otherPayment;
    const lineBalance = Math.max(0, Number(targetLine.charge) - (totalLinePay + adjustments));

    await prisma.serviceLine.update({
      where: { id: targetLine.id },
      data: {
        adjustments,
        balance: lineBalance,
        lineBalance
      }
    });

    // Create Transaction Record
    await prisma.transaction.create({
      data: {
        id: `tx-${Date.now()}`,
        billId: id,
        transactionType: 'ADJUSTMENT',
        source: 'WRITE_OFF',
        amount: parseFloat(amount),
        notes: reason || 'Adjustment write off'
      }
    });

    await recalculateBillTotals(id);

    const updated = await prisma.bill.findUnique({
      where: { id },
      include: {
        serviceLines: true,
        provider: true,
        case: { include: { patient: true } }
      }
    });

    return res.status(200).json(formatBill(updated));
  } catch (error) {
    console.error('Error posting adjustment:', error);
    return res.status(500).json({ error: 'Failed to post transaction adjustment.' });
  }
};

/**
 * Finalise bill
 */
export const finaliseBill = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await prisma.bill.update({
      where: { id },
      data: {
        status: 'FINALISED_DEMO'
      },
      include: {
        serviceLines: true,
        provider: true,
        case: { include: { patient: true } }
      }
    });

    return res.status(200).json(formatBill(updated));
  } catch (error) {
    console.error('Error finalising bill:', error);
    return res.status(500).json({ error: 'Failed to finalise billing statement.' });
  }
};

/**
 * Get aging summary metrics grouped by provider
 */
export const getAgingSummary = async (req, res) => {
  const { providerId } = req.query;

  try {
    const where = {};
    if (providerId && providerId !== 'ALL') {
      where.providerId = providerId;
    }

    const bills = await prisma.bill.findMany({
      where
    });

    let grandTotal = 0;
    let current = 0;
    let past30 = 0;
    let past60 = 0;
    let past90 = 0;

    for (const b of bills) {
      const totals = typeof b.totals === 'string' ? JSON.parse(b.totals) : b.totals || {};
      const aging = typeof b.aging === 'string' ? JSON.parse(b.aging) : b.aging || {};

      grandTotal += (totals.balanceDue || 0);
      current += (aging.current || 0);
      past30 += (aging.past30 || 0);
      past60 += (aging.past60 || 0);
      past90 += (aging.past90 || 0);
    }

    return res.status(200).json({
      grandTotal: Number(grandTotal.toFixed(2)),
      current: Number(current.toFixed(2)),
      past30: Number(past30.toFixed(2)),
      past60: Number(past60.toFixed(2)),
      past90: Number(past90.toFixed(2))
    });
  } catch (error) {
    console.error('Error fetching aging summary:', error);
    return res.status(500).json({ error: 'Failed to calculate aging statistics summary.' });
  }
};
