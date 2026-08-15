// src/constants/servicesCatalog.js

export const CORE_SERVICES = [
  {
    id: 'srv-pain-mgmt',
    name: 'Pain Management',
    shortCode: 'PAIN',
    category: 'Consultation & Evaluation',
    description: 'Comprehensive medical assessment, pain diagnostics, and interdisciplinary treatment planning.',
    icon: 'Activity',
    badgeStyle: 'bg-teal-100 text-teal-800 border-teal-200',
    suggestedCptCode: '99204',
    cptConfirmationStatus: 'CONFIRMED',
    suggestedDuration: '60 min',
    durationConfirmationStatus: 'CONFIRMED',
    clinicalTemplate: 'JOSMIC Pain Evaluation Report',
    templateStatus: 'CONFIRMED',
    activeStatus: 'ACTIVE'
  },
  {
    id: 'srv-laser-therapy',
    name: 'Laser Therapy',
    shortCode: 'LASER',
    category: 'Therapeutic Modality',
    description: 'High-Intensity Laser Therapy (HILT) for deep tissue inflammation, cell repair, and pain relief.',
    icon: 'Zap',
    badgeStyle: 'bg-violet-100 text-violet-800 border-violet-200',
    suggestedCptCode: '97039',
    cptConfirmationStatus: 'CONFIRMED',
    suggestedDuration: '45 min',
    durationConfirmationStatus: 'CONFIRMED',
    clinicalTemplate: 'ANIK Laser Therapy Procedure Form',
    templateStatus: 'CONFIRMED',
    activeStatus: 'ACTIVE'
  },
  {
    id: 'srv-shockwave-therapy',
    name: 'Shockwave Therapy',
    shortCode: 'ESWT',
    category: 'Therapeutic Modality',
    description: 'Extracorporeal Shockwave Therapy (ESWT) for musculoskeletal breakdown and regenerative treatment.',
    icon: 'Radio',
    badgeStyle: 'bg-blue-100 text-blue-800 border-blue-200',
    suggestedCptCode: '0101T',
    cptConfirmationStatus: 'CONFIRMED',
    suggestedDuration: '30 min',
    durationConfirmationStatus: 'CONFIRMED',
    clinicalTemplate: "DAV'S ESWT Therapy Record",
    templateStatus: 'CONFIRMED',
    activeStatus: 'ACTIVE'
  },
  {
    id: 'srv-trigger-point',
    name: 'Trigger Point Injection',
    shortCode: 'TPI',
    category: 'Interventional Procedure',
    description: 'Targeted myofascial trigger point injection therapy for localized muscle spasm relief.',
    icon: 'Syringe',
    badgeStyle: 'bg-amber-100 text-amber-800 border-amber-200',
    suggestedCptCode: '20552',
    cptConfirmationStatus: 'PENDING_CONFIRMATION',
    suggestedDuration: '30 min',
    durationConfirmationStatus: 'PENDING_CONFIRMATION',
    clinicalTemplate: 'Trigger Point Injection Record',
    templateStatus: 'CONFIGURATION_PENDING',
    activeStatus: 'CONFIGURATION_PENDING'
  },
  {
    id: 'srv-tecar-therapy',
    name: 'Radiofrequency Energy Transfer — TECAR Therapy',
    shortCode: 'TECAR',
    category: 'Therapeutic Modality',
    description: 'Radiofrequency energy transfer (Capacitive/Resistive) for soft tissue rehabilitation.',
    icon: 'Cpu',
    badgeStyle: 'bg-rose-100 text-rose-800 border-rose-200',
    suggestedCptCode: '97039-RF',
    cptConfirmationStatus: 'PENDING_CONFIRMATION',
    suggestedDuration: '45 min',
    durationConfirmationStatus: 'PENDING_CONFIRMATION',
    clinicalTemplate: 'TECAR Procedure Form',
    templateStatus: 'CONFIGURATION_PENDING',
    activeStatus: 'CONFIGURATION_PENDING'
  },
  {
    id: 'srv-counseling',
    name: 'Counseling',
    shortCode: 'COUNSEL',
    category: 'Mental Health & Wellness',
    description: 'Psychological, behavioral, and wellness counseling sessions for pain coping and mental health.',
    icon: 'MessageSquare',
    badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    suggestedCptCode: '90834',
    cptConfirmationStatus: 'PENDING_CONFIRMATION',
    suggestedDuration: '45 min',
    durationConfirmationStatus: 'PENDING_CONFIRMATION',
    clinicalTemplate: 'Behavioral Health Progress Note',
    templateStatus: 'CONFIGURATION_PENDING',
    activeStatus: 'CONFIGURATION_PENDING'
  }
];

export const COMMON_CPT_CODES = [
  { code: '99204', description: 'Office/Outpatient Visit New Complex (45-59 min)', category: 'E&M Initial', defaultFee: 450.00 },
  { code: '99203', description: 'Office/Outpatient Visit New Moderate (30-44 min)', category: 'E&M Initial', defaultFee: 350.00 },
  { code: '99205', description: 'Office/Outpatient Visit New High Complexity (60-74 min)', category: 'E&M Initial', defaultFee: 550.00 },
  { code: '99213', description: 'Office/Outpatient Visit Established Low-Mod (20-29 min)', category: 'E&M Subsequent', defaultFee: 200.00 },
  { code: '99214', description: 'Office/Outpatient Visit Established Moderate (30-39 min)', category: 'E&M Subsequent', defaultFee: 275.00 },
  { code: '99215', description: 'Office/Outpatient Visit Established High (40-54 min)', category: 'E&M Subsequent', defaultFee: 375.00 },
  { code: '97039', description: 'Unlisted Modality - High Intensity Laser Therapy (HILT)', category: 'Therapeutic Modality', defaultFee: 250.00 },
  { code: '0101T', description: 'Extracorporeal Shock Wave Therapy (ESWT) Musculoskeletal', category: 'Therapeutic Modality', defaultFee: 350.00 },
  { code: '20552', description: 'Trigger Point Injections (1 or 2 muscle groups)', category: 'Interventional', defaultFee: 320.00 },
  { code: '20553', description: 'Trigger Point Injections (3 or more muscle groups)', category: 'Interventional', defaultFee: 420.00 },
  { code: '97110', description: 'Therapeutic Exercise (each 15 min)', category: 'Physical Medicine', defaultFee: 110.00 },
  { code: '97140', description: 'Manual Therapy Techniques (each 15 min)', category: 'Physical Medicine', defaultFee: 120.00 },
  { code: '97014', description: 'Electrical Stimulation (Unattended)', category: 'Physical Medicine', defaultFee: 75.00 },
  { code: '97026', description: 'Application of Infrared Light / Heat Modality', category: 'Physical Medicine', defaultFee: 65.00 },
  { code: '90834', description: 'Psychotherapy / Behavioral Counseling (45 min)', category: 'Mental Health', defaultFee: 225.00 },
  { code: '90837', description: 'Psychotherapy / Behavioral Counseling (60 min)', category: 'Mental Health', defaultFee: 300.00 },
  { code: '97750', description: 'Physical Performance Test or Measurement', category: 'Evaluation', defaultFee: 180.00 }
];

export const COMMON_MODIFIERS = [
  { code: '25', description: 'Significant, Separately Identifiable E&M Service on Same Day' },
  { code: '59', description: 'Distinct Procedural Service (Non-Overlapping)' },
  { code: 'GP', description: 'Services delivered under Physical Therapy Plan of Care' },
  { code: 'GO', description: 'Services delivered under Occupational Therapy Plan of Care' },
  { code: 'GN', description: 'Services delivered under Speech Therapy Plan of Care' },
  { code: 'RT', description: 'Right Side (Anatomical modifier)' },
  { code: 'LT', description: 'Left Side (Anatomical modifier)' },
  { code: '50', description: 'Bilateral Procedure' },
  { code: '76', description: 'Repeat Procedure by Same Physician' },
  { code: '77', description: 'Repeat Procedure by Another Physician' },
  { code: 'XE', description: 'Separate Encounter' },
  { code: 'XP', description: 'Separate Practitioner' },
  { code: 'XS', description: 'Separate Structure' },
  { code: 'XU', description: 'Unusual Non-Overlapping Service' },
  { code: '26', description: 'Professional Component' },
  { code: 'TC', description: 'Technical Component' }
];

export const COMMON_ICD10_CODES = [
  { code: 'M54.50', description: 'Low back pain, unspecified' },
  { code: 'M54.2', description: 'Cervicalgia (Neck pain)' },
  { code: 'M79.10', description: 'Myalgia, unspecified site' },
  { code: 'M54.12', description: 'Radiculopathy, cervical region' },
  { code: 'M54.16', description: 'Radiculopathy, lumbar region' },
  { code: 'M54.6', description: 'Pain in thoracic spine' },
  { code: 'S13.4XXA', description: 'Sprain of ligaments of cervical spine, initial' },
  { code: 'S39.012A', description: 'Strain of muscle, fascia and tendon of lower back, initial' },
  { code: 'G44.309', description: 'Post-traumatic headache, unspecified, not intractable' },
  { code: 'M25.511', description: 'Pain in right shoulder' },
  { code: 'M25.512', description: 'Pain in left shoulder' },
  { code: 'M25.561', description: 'Pain in right knee' },
  { code: 'M25.562', description: 'Pain in left knee' },
  { code: 'V89.2XXA', description: 'Person injured in unspecified motor-vehicle accident, traffic, initial' }
];

export const createDefaultServiceLine = (idx = 1, cptCode = '99204', desc = 'Initial Pain Management Consultation', fee = 450.00) => ({
  id: `line-${Date.now()}-${idx}`,
  cptCode,
  description: desc,
  modifier1: '',
  modifier2: '',
  modifier3: '',
  modifier4: '',
  diagnosisPointer: 'A', // Refers to Box 21 pointers in CMS-1500
  icdCode: 'M54.50',
  units: 1,
  charge: fee
});

export const getServiceById = (serviceId) => {
  return CORE_SERVICES.find(s => s.id === serviceId);
};

export const getOperationalServices = () => {
  return CORE_SERVICES.filter(s => s.activeStatus === 'ACTIVE');
};

export const getPendingServices = () => {
  return CORE_SERVICES.filter(s => s.activeStatus !== 'ACTIVE');
};

