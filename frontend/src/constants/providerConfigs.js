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
    fee: '$180.00 – $350.00',
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
  }
};
