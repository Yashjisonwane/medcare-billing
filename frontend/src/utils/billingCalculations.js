// src/utils/billingCalculations.js

export const calculateLineItemBalance = (item) => {
  const charge = Number(item?.charge) || 0;
  const insPay = Number(item?.insurancePayment) || 0;
  const patPay = Number(item?.patientPayment) || 0;
  const othPay = Number(item?.otherPayment) || 0;
  const adj = Number(item?.adjustment) || 0;
  
  const balance = charge - (insPay + patPay + othPay + adj);
  return Number(balance.toFixed(2));
};

export const calculateBillLedgerTotals = (serviceLines = []) => {
  let totalCharges = 0;
  let totalInsurancePayments = 0;
  let totalPatientPayments = 0;
  let totalOtherPayments = 0;
  let totalAdjustments = 0;

  serviceLines.forEach(line => {
    if (line.status !== 'VOIDED') {
      totalCharges += Number(line.charge) || 0;
      totalInsurancePayments += Number(line.insurancePayment) || 0;
      totalPatientPayments += Number(line.patientPayment) || 0;
      totalOtherPayments += Number(line.otherPayment) || 0;
      totalAdjustments += Number(line.adjustment) || 0;
    }
  });

  const totalPayments = totalInsurancePayments + totalPatientPayments + totalOtherPayments;
  const balanceDue = totalCharges - (totalPayments + totalAdjustments);

  return {
    totalCharges: Number(totalCharges.toFixed(2)),
    totalInsurancePayments: Number(totalInsurancePayments.toFixed(2)),
    totalPatientPayments: Number(totalPatientPayments.toFixed(2)),
    totalOtherPayments: Number(totalOtherPayments.toFixed(2)),
    totalPayments: Number(totalPayments.toFixed(2)),
    totalAdjustments: Number(totalAdjustments.toFixed(2)),
    balanceDue: Number(balanceDue.toFixed(2))
  };
};

export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};
