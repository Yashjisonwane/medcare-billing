// src/utils/billingCalculations.js
import { getCachedSettings } from './settingsCache';

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

export const getCurrencySymbol = () => {
  try {
    const settings = getCachedSettings();
    const code = settings?.currency || 'USD';
    return code === 'CAD' ? 'C$' : '$';
  } catch (e) {
    return '$';
  }
};

export const formatFeeString = (feeStr) => {
  if (feeStr === null || feeStr === undefined) return '';
  const symbol = getCurrencySymbol();
  return String(feeStr).replace(/\$/g, symbol);
};

export const formatCurrency = (amount) => {
  let currencyCode = 'USD';
  try {
    const settings = getCachedSettings();
    if (settings && settings.currency) {
      currencyCode = settings.currency;
    }
  } catch (e) {
    // fallback to USD
  }

  const num = Number(amount) || 0;
  const formattedNum = Math.abs(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const prefix = num < 0 ? '-' : '';
  const symbol = currencyCode === 'CAD' ? 'C$' : '$';

  return `${prefix}${symbol}${formattedNum}`;
};

export const formatDateTime = (dateInput, options = {}) => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  const settings = getCachedSettings();
  const timezone = settings.timezone || 'America/Chicago';
  const timeFormat = settings.timeFormat || '12H';

  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: timeFormat === '12H',
    ...options
  }).format(date);
};

export const formatDate = (dateInput, options = {}) => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  const settings = getCachedSettings();
  const timezone = settings.timezone || 'America/Chicago';

  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  }).format(date);
};

