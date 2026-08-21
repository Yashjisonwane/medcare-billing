// src/constants/providerConfigs.js

export const INITIAL_PROVIDER_CONFIGS = {
  josmic: {
    id: 'prov-josmic',
    name: 'JOSMIC Wellness Center',
    businessName: 'JOSMIC Wellness Center LLC',
    serviceCategory: 'Pain Management Consultation',
    status: 'ACTIVE',
    isPlaceholder: false,
    cptCode: '99204 (Confirmed)',
    fee: '$1,214.00',
    address: {
      street: '10101 Harwin Dr.',
      suite: 'Suite 274',
      city: 'Houston',
      state: 'TX',
      zipCode: '77036'
    },
    contact: {
      phone: '713-485-5712',
      cell: '',
      fax: '832-416-1502',
      email: 'contact@josmicwellness.com'
    },
    identifiers: {
      taxId: '993723387',
      npi: 'R7637',
      ssnOrEin: 'EIN'
    },
    renderingProvider: {
      name: 'Adeoye, Segun',
      credentials: 'DC / MD',
      npi: 'R7637'
    },
    serviceFacility: {
      name: 'JOSMIC Wellness Center',
      address: '10101 Harwin Dr, Suite 320, Houston, TX 77036',
      npi: 'R7637'
    },
    billingProvider: {
      name: 'JOSMIC Wellness Center',
      address: '10101 Harwin Dr, Suite 320, Houston, TX 77036',
      phone: '713-485-5712'
    },
    defaultPlaceOfService: '11',
    availableServices: [
      { code: '99204', description: 'Pain Consult', defaultCharge: 1214.00, category: 'Consultation' }
    ],
    availableDiagnoses: [
      { code: 'S13.4', description: 'Cervical sprain/strain' },
      { code: 'S23.3', description: 'Thoracic sprain/strain' },
      { code: 'S33.5', description: 'Lumbar strain' },
      { code: 'M79.1', description: 'Myofascial pain syndrome' },
      { code: 'M54.6', description: 'Pain in thoracic spine' },
      { code: 'M54.50', description: 'Low back pain, unspecified' }
    ],
    providerServices: [
      {
        providerId: 'prov-josmic',
        serviceId: 'srv-pain-mgmt',
        enabled: true,
        cptCode: '99204',
        cptStatus: 'CONFIRMED',
        price: 1214.00,
        priceStatus: 'CONFIRMED',
        duration: '60 min',
        billingDescription: 'Pain Consult & Evaluation',
        placeOfService: '11',
        clinicalTemplate: 'JOSMIC Pain Evaluation Report',
        configurationStatus: 'COMPLETE'
      }
    ]
  },
  davs: {
    id: 'prov-davs',
    name: "DAV'S Anatomy",
    businessName: "DAV'S Anatomy Shockwave Therapy LLC",
    serviceCategory: 'Shockwave Therapy (ESWT)',
    status: 'ACTIVE',
    isPlaceholder: false,
    cptCode: '0101T (Confirmed)',
    fee: '$1,000.00',
    address: {
      street: '10101 Harwin Dr.',
      suite: 'Suite 320',
      city: 'Houston',
      state: 'TX',
      zipCode: '77036'
    },
    contact: {
      phone: '713-485-0208',
      cell: '832-815-0959',
      fax: '832-416-1502',
      email: 'Davsanatomy@gmail.com'
    },
    identifiers: {
      taxId: '883049745',
      npi: 'R7637',
      ssnOrEin: 'EIN'
    },
    renderingProvider: {
      name: 'Adeoye, Segun',
      credentials: 'DC',
      npi: 'R7637'
    },
    serviceFacility: {
      name: "DAV'S Anatomy",
      address: '10101 Harwin Dr, Suite 320, Houston, TX 77036',
      npi: 'R7637'
    },
    billingProvider: {
      name: "DAV'S Anatomy",
      address: '10101 Harwin Dr, Houston, TX 77036',
      phone: '832-815-0959'
    },
    defaultPlaceOfService: '10',
    availableServices: [
      { code: '99204', description: 'Initial Visit II', defaultCharge: 250.00, category: 'Evaluation' },
      { code: '0101T', description: 'Shockwave / ESWT', defaultCharge: 1000.00, category: 'Therapy' },
      { code: '10001', description: 'Eye protective glasses', defaultCharge: 50.00, category: 'Supplies' },
      { code: '97124', description: 'Massage Therapy I', defaultCharge: 90.00, category: 'Therapy' },
      { code: '99214', description: 'Final Visit II', defaultCharge: 200.00, category: 'Evaluation' }
    ],
    availableDiagnoses: [
      { code: 'M54.50', description: 'Low back pain' },
      { code: 'M54.2', description: 'Cervicalgia (Neck pain)' },
      { code: 'M25.572', description: 'Pain in left ankle and joints' }
    ],
    providerServices: [
      {
        providerId: 'prov-davs',
        serviceId: 'srv-shockwave-therapy',
        enabled: true,
        cptCode: '0101T',
        cptStatus: 'CONFIRMED',
        price: 1000.00,
        priceStatus: 'CONFIRMED',
        duration: '30 min',
        billingDescription: 'Shockwave / ESWT Therapy',
        placeOfService: '10',
        clinicalTemplate: "DAV'S ESWT Therapy Record",
        configurationStatus: 'COMPLETE'
      }
    ]
  },
  anik: {
    id: 'prov-anik',
    name: 'ANIK Laser Therapy',
    businessName: 'ANIK Laser Therapy LLC',
    serviceCategory: 'Laser Therapy (HILT)',
    status: 'ACTIVE',
    isPlaceholder: false,
    cptCode: '97039 (Confirmed)',
    fee: '$2,000.00',
    address: {
      street: '10101 Harwin Dr.',
      suite: 'Suite 274',
      city: 'Houston',
      state: 'TX',
      zipCode: '77036'
    },
    contact: {
      phone: '713-485-5712',
      cell: '832-815-0959',
      fax: '832-416-1502',
      email: 'contact@aniklaser.com'
    },
    identifiers: {
      taxId: '993723387',
      npi: 'R7637',
      ssnOrEin: 'EIN'
    },
    renderingProvider: {
      name: 'Adeoye, Segun',
      credentials: 'DC / MD',
      npi: 'R7637'
    },
    serviceFacility: {
      name: 'ANIK Laser Therapy',
      address: '10101 Harwin Dr, Suite 274, Houston, TX 77036',
      npi: 'R7637'
    },
    billingProvider: {
      name: 'ANIK Laser Therapy',
      address: '10101 Harwin Dr, Suite 274, Houston, TX 77036',
      phone: '713-485-5712'
    },
    defaultPlaceOfService: '11',
    availableServices: [
      { code: '97039', description: 'High Intensity Laser Therapy', defaultCharge: 2000.00, category: 'Therapy' }
    ],
    availableDiagnoses: [
      { code: 'S13.4', description: 'Cervical sprain/strain' },
      { code: 'S33.5', description: 'Lumbar strain' }
    ],
    providerServices: [
      {
        providerId: 'prov-anik',
        serviceId: 'srv-laser-therapy',
        enabled: true,
        cptCode: '97039',
        cptStatus: 'CONFIRMED',
        price: 2000.00,
        priceStatus: 'CONFIRMED',
        duration: '45 min',
        billingDescription: 'Laser Procedure Form',
        placeOfService: '11',
        clinicalTemplate: 'ANIK Laser Procedure Form',
        configurationStatus: 'COMPLETE'
      }
    ]
  },
  counselor: {
    id: 'prov-counselor',
    name: 'Counselor Practice (Hope Behavioral Health)',
    businessName: 'Hope Behavioral Health & Counseling LLC',
    serviceCategory: 'Behavioral & Mental Health',
    status: 'ACTIVE',
    isPlaceholder: false,
    cptCode: '90834 / 90791',
    fee: '$180.00 - $350.00',
    address: {
      street: '10101 Harwin Dr.',
      suite: 'Suite 110',
      city: 'Houston',
      state: 'TX',
      zipCode: '77036'
    },
    contact: {
      phone: '713-485-9988',
      cell: '',
      fax: '832-416-1502',
      email: 'intake@hopebehavioral.com'
    },
    identifiers: {
      taxId: '748291039',
      npi: '1982736450',
      ssnOrEin: 'EIN'
    },
    renderingProvider: {
      name: 'Miller, Jordan',
      credentials: 'LPC / LMFT',
      npi: '1982736450'
    },
    serviceFacility: {
      name: 'Hope Behavioral Health',
      address: '10101 Harwin Dr, Suite 110, Houston, TX 77036',
      npi: '1982736450'
    },
    billingProvider: {
      name: 'Hope Behavioral Health LLC',
      address: '10101 Harwin Dr, Suite 110, Houston, TX 77036',
      phone: '713-485-9988'
    },
    defaultPlaceOfService: '11',
    availableServices: [
      { code: '90834', description: 'Psychotherapy (45 min)', defaultCharge: 250.00, category: 'Mental Health' },
      { code: '90791', description: 'Psych Diagnostic Evaluation', defaultCharge: 350.00, category: 'Mental Health' }
    ],
    availableDiagnoses: [
      { code: 'F43.10', description: 'Post-traumatic stress disorder, unspecified' },
      { code: 'F41.1', description: 'Generalized anxiety disorder' }
    ],
    providerServices: [
      {
        providerId: 'prov-counselor',
        serviceId: 'srv-counseling',
        enabled: true,
        cptCode: '90834',
        cptStatus: 'CONFIRMED',
        price: 250.00,
        priceStatus: 'CONFIRMED',
        duration: '45 min',
        billingDescription: 'Behavioral Health Progress Note',
        placeOfService: '11',
        clinicalTemplate: 'Behavioral Health Progress Note',
        configurationStatus: 'COMPLETE'
      }
    ]
  },
  tpi: {
    id: 'prov-tpi',
    name: 'Trigger Point Injection Clinic',
    businessName: 'TPI Specialist LLC',
    serviceCategory: 'Pain Management & Injections',
    status: 'ACTIVE',
    isPlaceholder: false,
    cptCode: '20552',
    fee: '$350.00',
    address: {
      street: '10101 Harwin Dr.',
      suite: 'Suite 200',
      city: 'Houston',
      state: 'TX',
      zipCode: '77036'
    },
    contact: {
      phone: '713-555-0199',
      cell: '',
      fax: '832-555-0199',
      email: 'tpi@example.com'
    },
    identifiers: {
      taxId: '123456789',
      npi: '1982736451',
      ssnOrEin: 'EIN'
    },
    renderingProvider: {
      name: 'Smith, John',
      credentials: 'MD',
      npi: '1982736451'
    },
    serviceFacility: {
      name: 'Trigger Point Injection Clinic',
      address: '10101 Harwin Dr, Suite 200, Houston, TX 77036',
      npi: '1982736451'
    },
    billingProvider: {
      name: 'TPI Specialist LLC',
      address: '10101 Harwin Dr, Suite 200, Houston, TX 77036',
      phone: '713-555-0199'
    },
    defaultPlaceOfService: '11',
    availableServices: [
      { code: '20552', description: 'Trigger Point Injection (1-2 muscles)', defaultCharge: 350.00, category: 'Procedure' },
      { code: '20553', description: 'Trigger Point Injection (3+ muscles)', defaultCharge: 450.00, category: 'Procedure' }
    ],
    availableDiagnoses: [
      { code: 'M79.1', description: 'Myalgia' },
      { code: 'M54.50', description: 'Low back pain' }
    ],
    providerServices: [
      {
        providerId: 'prov-tpi',
        serviceId: 'srv-tpi',
        enabled: true,
        cptCode: '20552',
        cptStatus: 'CONFIRMED',
        price: 350.00,
        priceStatus: 'CONFIRMED',
        duration: '30 min',
        billingDescription: 'Trigger Point Injection',
        placeOfService: '11',
        clinicalTemplate: 'Trigger Point Procedure',
        configurationStatus: 'COMPLETE'
      }
    ]
  },
  tecar: {
    id: 'prov-tecar',
    name: 'TECAR Therapy Clinic',
    businessName: 'TECAR Advanced Physio LLC',
    serviceCategory: 'Deep Tissue Radiofrequency Therapy',
    status: 'ACTIVE',
    isPlaceholder: false,
    cptCode: '97024',
    fee: '$250.00',
    address: {
      street: '10101 Harwin Dr.',
      suite: 'Suite 210',
      city: 'Houston',
      state: 'TX',
      zipCode: '77036'
    },
    contact: {
      phone: '713-555-0210',
      cell: '',
      fax: '832-555-0210',
      email: 'info@tecarphysio.com'
    },
    identifiers: {
      taxId: '987654321',
      npi: '1982736452',
      ssnOrEin: 'EIN'
    },
    renderingProvider: {
      name: 'Davis, Emily',
      credentials: 'PT, DPT',
      npi: '1982736452'
    },
    serviceFacility: {
      name: 'TECAR Therapy Clinic',
      address: '10101 Harwin Dr, Suite 210, Houston, TX 77036',
      npi: '1982736452'
    },
    billingProvider: {
      name: 'TECAR Advanced Physio LLC',
      address: '10101 Harwin Dr, Suite 210, Houston, TX 77036',
      phone: '713-555-0210'
    },
    defaultPlaceOfService: '11',
    availableServices: [
      { code: '97024', description: 'Diathermy (e.g., microwave)', defaultCharge: 250.00, category: 'Therapy' },
      { code: '97039', description: 'Unlisted modality (TECAR)', defaultCharge: 300.00, category: 'Therapy' }
    ],
    availableDiagnoses: [
      { code: 'M54.50', description: 'Low back pain' },
      { code: 'M25.511', description: 'Pain in right shoulder' }
    ],
    providerServices: [
      {
        providerId: 'prov-tecar',
        serviceId: 'srv-tecar',
        enabled: true,
        cptCode: '97024',
        cptStatus: 'CONFIRMED',
        price: 250.00,
        priceStatus: 'CONFIRMED',
        duration: '45 min',
        billingDescription: 'TECAR Diathermy Therapy',
        placeOfService: '11',
        clinicalTemplate: 'TECAR Therapy Record',
        configurationStatus: 'COMPLETE'
      }
    ]
  }
};
