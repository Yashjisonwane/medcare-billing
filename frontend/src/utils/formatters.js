// src/utils/formatters.js

/**
 * Human-readable status mapping for UI display
 */
export const formatStatus = (rawStatus) => {
  if (!rawStatus) return 'Unknown';
  
  const statusMap = {
    'FINALISED_DEMO': 'Finalised',
    'ISSUED_DEMO': 'Issued',
    'SIGNED_LOCKED': 'Signed & Locked',
    'CONFIGURATION_PENDING': 'Configuration Pending',
    'VOIDED_DEMO': 'Voided',
    'GENERATED_DEMO': 'Generated',
    'CHECKED_IN': 'Checked In',
    'IN_EXAM': 'In Exam Room',
    'SCHEDULED': 'Scheduled',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled',
    'RESCHEDULED': 'Rescheduled',
    'ACTIVE': 'Active',
    'INACTIVE': 'Inactive',
    'DRAFT': 'Draft',
    'AMENDED': 'Amended',
    'SIGNED': 'Signed',
    'UPLOADED_DEMO': 'Uploaded'
  };

  return statusMap[rawStatus] || rawStatus.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

/**
 * Mask Tax ID / EIN (e.g. 993723387 -> •••••3387)
 */
export const maskTaxId = (taxId, visible = false) => {
  if (!taxId || taxId === 'TBD') return 'Pending Configuration';
  if (visible) return taxId;
  const clean = String(taxId).replace(/\D/g, '');
  if (clean.length < 4) return '••••';
  return `•••••${clean.slice(-4)}`;
};

/**
 * Mask NPI (e.g. R7637 -> ••••7637)
 */
export const maskNpi = (npi, visible = false) => {
  if (!npi || npi === 'TBD') return 'Pending Configuration';
  if (visible) return npi;
  const clean = String(npi);
  if (clean.length < 4) return '••••';
  return `••••${clean.slice(-4)}`;
};
