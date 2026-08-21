// src/services/mock/mockDataFixtures.js

export const INITIAL_PATIENTS = [
  {
    id: 'pat-001',
    patientId: '141849159',
    firstName: 'Demo',
    middleName: 'R.',
    lastName: 'Patient 001',
    dob: '10/08/1974',
    sex: 'M',
    phone: '713-555-0199',
    email: 'demopatient001@example.test',
    address: {
      street: '17650 Carnation Glen Dr',
      suite: '',
      city: 'Richmond',
      state: 'TX',
      zipCode: '77407'
    },
    communicationPref: 'SMS',
    status: 'ACTIVE',
    assignedProviderIds: ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor'],
    consentStatus: 'SIGNED',
    createdAt: '2025-12-28'
  },
  {
    id: 'pat-002',
    patientId: '141849160',
    firstName: 'Jane',
    middleName: 'A.',
    lastName: 'Smith (Demo)',
    dob: '05/14/1985',
    sex: 'F',
    phone: '832-555-0144',
    email: 'janesmith@example.test',
    address: {
      street: '1244 Westheimer Rd',
      suite: 'Apt 4B',
      city: 'Houston',
      state: 'TX',
      zipCode: '77006'
    },
    communicationPref: 'EMAIL',
    status: 'ACTIVE',
    assignedProviderIds: ['prov-josmic', 'prov-davs'],
    consentStatus: 'SIGNED',
    createdAt: '2026-01-05'
  }
];

export const INITIAL_CASES = [
  {
    id: 'case-001',
    caseId: 'CASE-2025-1227',
    patientId: 'pat-001',
    patientName: 'Demo Patient 001',
    accidentDate: '12/27/2025',
    initialDate: '12/30/2025',
    dischargeDate: '01/26/2026',
    accidentType: 'AUTO_ACCIDENT',
    accidentState: 'TX',
    mechanismOfInjury: 'Motor Vehicle Accident (Rear-end collision)',
    status: 'ACTIVE',
    attorneyName: 'Sample Attorney (OJ Lawal & Associates)',
    lawFirm: 'OJ Law Firm & Associates',
    attorneyAddress: '11711 Bedford St. Suite 01, Houston, TX 77031',
    attorneyPhone: '713-555-0188',
    insuranceCompany: 'Example Auto Insurance Co.',
    insurancePolicyNumber: 'POL-9928374',
    insuranceClaimNumber: 'CLM-2025-88192',
    referringProviderName: 'Anthony Nguyen',
    diagnosisCodes: ['M54.6', 'M54.50', 'S13.4', 'S33.5'],
    assignedProviderIds: ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor']
  }
];

export const INITIAL_APPOINTMENTS = [];

export const INITIAL_BILLS = [
  {
    id: 'bill-josmic-001',
    statementNumber: '120197',
    statementDate: '02/11/2026',
    patientId: 'pat-001',
    patientName: 'Demo Patient 001',
    caseId: 'case-001',
    providerId: 'prov-josmic',
    providerName: 'JOSMIC Wellness Center',
    serviceCategory: 'Pain Management Consultation',
    status: 'FINALISED_DEMO',
    items: [
      {
        id: 'item-1',
        dateOfService: '12/30/2025',
        cptCode: '99204',
        description: 'PAIN CONSULT',
        charge: 1214.00,
        insurancePayment: 0,
        patientPayment: 0,
        otherPayment: 0,
        adjustment: 0,
        diagPointer: '12'
      }
    ],
    totals: {
      totalCharges: 1214.00,
      totalPayments: 0,
      totalAdjustments: 0,
      balanceDue: 1214.00
    },
    aging: { current: 0, past30: 1214.00, past60: 0, past90: 0 }
  },
  {
    id: 'bill-davs-001',
    statementNumber: '121559',
    statementDate: '04/13/2026',
    patientId: 'pat-001',
    patientName: 'Demo Patient 001',
    caseId: 'case-001',
    providerId: 'prov-davs',
    providerName: "DAV'S Anatomy",
    serviceCategory: 'Shockwave Therapy (ESWT)',
    status: 'ISSUED_DEMO',
    items: [
      { id: 'davs-1', dateOfService: '01/06/2026', cptCode: '99204', description: 'INITIAL VISIT II', charge: 250.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-2', dateOfService: '01/06/2026', cptCode: '0101T', description: 'SHOCKWAVE', charge: 1000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-3', dateOfService: '01/06/2026', cptCode: '0101T', description: 'SHOCKWAVE', charge: 1000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-4', dateOfService: '01/06/2026', cptCode: '0101T', description: 'SHOCKWAVE', charge: 1000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-5', dateOfService: '01/06/2026', cptCode: '10001', description: 'Eye protective glasses', charge: 50.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-6', dateOfService: '01/06/2026', cptCode: '97124', description: 'Massage therapy I', charge: 90.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-7', dateOfService: '01/07/2026', cptCode: '0101T', description: 'SHOCKWAVE', charge: 1000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-8', dateOfService: '01/07/2026', cptCode: '0101T', description: 'SHOCKWAVE', charge: 1000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-9', dateOfService: '01/07/2026', cptCode: '0101T', description: 'SHOCKWAVE', charge: 1000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-10', dateOfService: '01/07/2026', cptCode: '10001', description: 'Eye protective glasses', charge: 50.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-11', dateOfService: '01/07/2026', cptCode: '97124', description: 'Massage therapy I', charge: 90.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-12', dateOfService: '01/08/2026', cptCode: '99214', description: 'FINAL VISIT II', charge: 200.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-13', dateOfService: '01/08/2026', cptCode: '0101T', description: 'SHOCKWAVE', charge: 1000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-14', dateOfService: '01/08/2026', cptCode: '0101T', description: 'SHOCKWAVE', charge: 1000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-15', dateOfService: '01/08/2026', cptCode: '0101T', description: 'SHOCKWAVE', charge: 1000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-16', dateOfService: '01/08/2026', cptCode: '10001', description: 'Eye protective glasses', charge: 50.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'davs-17', dateOfService: '01/08/2026', cptCode: '97124', description: 'Massage therapy I', charge: 90.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 }
    ],
    totals: {
      totalCharges: 9870.00,
      totalPayments: 0,
      totalAdjustments: 0,
      balanceDue: 9870.00
    },
    aging: { current: 0, past30: 0, past60: 0, past90: 9870.00 }
  },
  {
    id: 'bill-anik-001',
    statementNumber: '121560',
    statementDate: '04/13/2026',
    patientId: 'pat-001',
    patientName: 'Demo Patient 001',
    caseId: 'case-001',
    providerId: 'prov-anik',
    providerName: 'ANIK Laser Therapy',
    serviceCategory: 'Laser Therapy',
    status: 'ISSUED_DEMO',
    items: [
      { id: 'anik-1', dateOfService: '01/22/2026', cptCode: '97039', description: 'LASER THERAPY', charge: 2000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-2', dateOfService: '01/22/2026', cptCode: '97039', description: 'LASER THERAPY', charge: 2000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-3', dateOfService: '01/22/2026', cptCode: '97039', description: 'LASER THERAPY', charge: 2000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-4', dateOfService: '01/22/2026', cptCode: '10001', description: 'Eye protective glasses', charge: 50.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-5', dateOfService: '01/22/2026', cptCode: '97124', description: 'Massage therapy I', charge: 90.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-6', dateOfService: '01/24/2026', cptCode: '97039', description: 'LASER THERAPY', charge: 2000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-7', dateOfService: '01/24/2026', cptCode: '97039', description: 'LASER THERAPY', charge: 2000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-8', dateOfService: '01/24/2026', cptCode: '97039', description: 'LASER THERAPY', charge: 2000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-9', dateOfService: '01/24/2026', cptCode: '10001', description: 'Eye protective glasses', charge: 50.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-10', dateOfService: '01/24/2026', cptCode: '97124', description: 'Massage therapy I', charge: 90.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-11', dateOfService: '01/26/2026', cptCode: '97039', description: 'LASER THERAPY', charge: 2000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-12', dateOfService: '01/26/2026', cptCode: '97039', description: 'LASER THERAPY', charge: 2000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-13', dateOfService: '01/26/2026', cptCode: '97039', description: 'LASER THERAPY', charge: 2000.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-14', dateOfService: '01/26/2026', cptCode: '10001', description: 'Eye protective glasses', charge: 50.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-15', dateOfService: '01/26/2026', cptCode: '97124', description: 'Massage therapy I', charge: 90.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 },
      { id: 'anik-16', dateOfService: '01/26/2026', cptCode: '99213', description: 'FOLLOW-UP CONSULT', charge: 500.00, insurancePayment: 0, patientPayment: 0, adjustment: 0 }
    ],
    totals: {
      totalCharges: 18920.00,
      totalPayments: 0,
      totalAdjustments: 0,
      balanceDue: 18920.00
    },
    aging: { current: 0, past30: 0, past60: 0, past90: 18920.00 }
  },
  {
    id: 'bill-counselor-001',
    statementNumber: '1024-C',
    statementDate: '01/26/2026',
    patientId: 'pat-001',
    patientName: 'SAMPLE TESTING',
    caseId: 'case-001',
    providerId: 'prov-counselor',
    providerName: 'Counselor Practice (Hope Behavioral Health)',
    serviceCategory: 'Counseling & Mental Health',
    status: 'ACTIVE_DEMO',
    diagnosisCodes: ['F43.10', 'F41.1', 'F32.9', 'M54.50'],
    items: [
      { dos: '01/05/2026', cptCode: '90791', description: 'PSYCHIATRIC DIAGNOSTIC EVALUATION', units: 1, charge: 350.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 350.00 },
      { dos: '01/12/2026', cptCode: '90834', description: 'PSYCHOTHERAPY 45 MIN (POST-TRAUMA)', units: 1, charge: 180.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 180.00 },
      { dos: '01/19/2026', cptCode: '90834', description: 'PSYCHOTHERAPY 45 MIN (PAIN / ANXIETY COPING)', units: 1, charge: 180.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 180.00 },
      { dos: '01/26/2026', cptCode: '90837', description: 'PSYCHOTHERAPY 60 MIN (CRISIS & RECOVERY)', units: 1, charge: 250.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 250.00 },
      { dos: '02/02/2026', cptCode: '90834', description: 'PSYCHOTHERAPY 45 MIN (PROGRESS EVAL)', units: 1, charge: 180.00, payments: { insurance: 0, patient: 0, other: 0 }, adjustments: 0, lineBalance: 180.00 }
    ],
    totals: {
      totalCharges: 1140.00,
      totalPayments: 0,
      totalAdjustments: 0,
      balanceDue: 1140.00
    },
    aging: { current: 180.00, past30: 430.00, past60: 530.00, past90: 0 }
  }
];

export const INITIAL_CLINICAL_NOTES = [];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-001',
    name: 'JOSMIC_Cover_Page_Sample.pdf',
    type: 'Cover Page',
    providerName: 'JOSMIC Wellness Center',
    date: '12/30/2025',
    status: 'SIGNED',
    size: '1.07 MB'
  },
  {
    id: 'doc-002',
    name: 'JOSMIC_Billing_Statement_120197.pdf',
    type: 'Billing Statement',
    providerName: 'JOSMIC Wellness Center',
    date: '02/11/2026',
    status: 'FINALISED_DEMO',
    size: '420 KB'
  },
  {
    id: 'doc-003',
    name: 'DAVS_Shockwave_Narrative_Report.pdf',
    type: 'Narrative Report',
    providerName: "DAV'S Anatomy",
    date: '01/08/2026',
    status: 'SIGNED',
    size: '3.37 MB'
  },
  {
    id: 'doc-004',
    name: 'ANIK_Laser_Medical_Report.pdf',
    type: 'Medical Report',
    providerName: 'ANIK Laser Therapy',
    date: '01/26/2026',
    status: 'SIGNED',
    size: '2.04 MB'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'audit-001',
    timestamp: '2026-08-04 09:30:15',
    user: 'Dr. Segun Adeoye',
    role: 'Doctor',
    action: 'SIGNED_NOTE',
    resource: 'JOSMIC Pain Management Report (note-001)',
    patientId: 'pat-001',
    ipAddress: '192.168.1.45 (Demo Session)'
  },
  {
    id: 'audit-002',
    timestamp: '2026-08-04 10:14:22',
    user: 'Rachel Green',
    role: 'Billing Staff',
    action: 'FINALISED_BILL',
    resource: 'JOSMIC Bill #120197',
    patientId: 'pat-001',
    ipAddress: '192.168.1.88 (Demo Session)'
  }
];
