// src/constants/rolePermissions.js

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  // Clinic Admin removed (Option A — merged into Super Admin)
  RECEPTIONIST: 'Receptionist',
  DOCTOR: 'Doctor',
  THERAPIST: 'Therapist',
  COUNSELOR: 'Counselor',
  BILLING_STAFF: 'Billing Staff',
};

export const DEMO_ACCOUNTS = [
  {
    id: 'usr-sa',
    email: 'admin@example.test',
    name: 'Sarah Connor',
    role: ROLES.SUPER_ADMIN,
    title: 'System Administrator',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: 'usr-rec',
    email: 'receptionist@example.test',
    name: 'Emily Davis',
    role: ROLES.RECEPTIONIST,
    title: 'Front Desk Lead',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: 'usr-doc',
    email: 'doctor@example.test',
    name: 'Dr. Segun Adeoye',
    role: ROLES.DOCTOR,
    title: 'Attending Physician',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: 'usr-the',
    email: 'therapist@example.test',
    name: 'Alex Rivera',
    role: ROLES.THERAPIST,
    title: 'Lead ESWT & Laser Therapist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: 'usr-cou',
    email: 'counselor@example.test',
    name: 'Jordan Miller',
    role: ROLES.COUNSELOR,
    title: 'Mental Health Counselor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: 'usr-bil',
    email: 'billing@example.test',
    name: 'Rachel Green',
    role: ROLES.BILLING_STAFF,
    title: 'Senior Billing Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
  },
];

export const ROLE_ROUTE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['*'], // Full Access — all routes
  [ROLES.RECEPTIONIST]: [
    '/dashboard/receptionist',
    '/patients',
    '/patients/new',
    '/patients/*/profile',
    '/cases',
    '/cases/new',
    '/appointments/*',
    '/documents',
    '/settings/reminders',
  ],
  [ROLES.DOCTOR]: [
    '/dashboard/doctor',
    '/patients/*',
    '/cases/*',
    '/appointments/*',
    '/clinical-notes/*',
    '/treatments',
    '/documents/*',
  ],
  [ROLES.THERAPIST]: [
    '/dashboard/therapist',
    '/patients/*',
    '/cases/*',
    '/appointments/*',
    '/clinical-notes/*',
    '/treatments',
    '/documents/*',
  ],
  [ROLES.COUNSELOR]: [
    '/dashboard/counselor',
    '/patients/*',
    '/cases/*',
    '/appointments/*',
    '/clinical-notes',
    '/clinical-notes/ai-assistant',
    '/billing/four-bills',
    '/documents',
  ],
  [ROLES.BILLING_STAFF]: [
    '/dashboard/billing-staff',
    '/patients/*',
    '/cases/*',
    '/billing/*',
    '/cms-1500/*',
    '/documents/*',
    '/admin/reports/*',
  ],
};

// ─── Role-Based Sidebar Navigation Map ────────────────────────────────────────
// Each role sees ONLY the sections & items relevant to their job.
// Super Admin sees everything.

export const ROLE_SIDEBAR_NAV = {
  [ROLES.SUPER_ADMIN]: 'ALL',     // special token — render all sections

  [ROLES.RECEPTIONIST]: [
    {
      title: 'CORE MANAGEMENT',
      items: [
        { label: 'Dashboard', path: '/dashboard/receptionist', icon: 'LayoutDashboard' },
        { label: 'Patients', path: '/patients', icon: 'Users' },
        { label: 'Appointments', path: '/appointments/calendar', icon: 'Calendar' },
      ],
    },
    {
      title: 'DOCUMENTS',
      items: [
        { label: 'Documents', path: '/documents', icon: 'FileSpreadsheet' },
      ],
    },
  ],

  [ROLES.DOCTOR]: [
    {
      title: 'CORE MANAGEMENT',
      items: [
        { label: 'Dashboard', path: '/dashboard/doctor', icon: 'LayoutDashboard' },
        { label: 'Patients', path: '/patients', icon: 'Users' },
        { label: 'Accident Cases', path: '/cases', icon: 'FileSpreadsheet' },
        { label: 'Appointments', path: '/appointments/calendar', icon: 'Calendar' },
      ],
    },
    {
      title: 'CLINICAL & SESSIONS',
      items: [
        { label: 'Clinical Records', path: '/clinical-notes', icon: 'FileText' },
        { label: 'AI Note Assistant', path: '/clinical-notes/ai-assistant', icon: 'Bot', badge: 'AI' },
        { label: 'Assessments & Forms', path: '/clinical-notes/assessments', icon: 'ClipboardList' },
        { label: 'Treatment Sessions', path: '/treatments', icon: 'Activity' },
      ],
    },
    {
      title: 'DOCUMENTS & PACKETS',
      items: [
        { label: 'Documents', path: '/documents', icon: 'FileSpreadsheet' },
        { label: 'Patient Packets', path: '/documents/packet-builder', icon: 'Layers' },
      ],
    },
  ],

  [ROLES.THERAPIST]: [
    {
      title: 'CORE MANAGEMENT',
      items: [
        { label: 'Dashboard', path: '/dashboard/therapist', icon: 'LayoutDashboard' },
        { label: 'Patients', path: '/patients', icon: 'Users' },
        { label: 'Accident Cases', path: '/cases', icon: 'FileSpreadsheet' },
        { label: 'Appointments', path: '/appointments/calendar', icon: 'Calendar' },
      ],
    },
    {
      title: 'CLINICAL & SESSIONS',
      items: [
        { label: 'Clinical Records', path: '/clinical-notes', icon: 'FileText' },
        { label: 'Assessments & Forms', path: '/clinical-notes/assessments', icon: 'ClipboardList' },
        { label: 'Treatment Sessions', path: '/treatments', icon: 'Activity' },
      ],
    },
    {
      title: 'DOCUMENTS & PACKETS',
      items: [
        { label: 'Documents', path: '/documents', icon: 'FileSpreadsheet' },
        { label: 'Patient Packets', path: '/documents/packet-builder', icon: 'Layers' },
      ],
    },
  ],

  [ROLES.COUNSELOR]: [
    {
      title: 'CORE MANAGEMENT',
      items: [
        { label: 'Dashboard', path: '/dashboard/counselor', icon: 'LayoutDashboard' },
        { label: 'Patients', path: '/patients', icon: 'Users' },
        { label: 'Accident Cases', path: '/cases', icon: 'FileSpreadsheet' },
        { label: 'Appointments', path: '/appointments/calendar', icon: 'Calendar' },
      ],
    },
    {
      title: 'CLINICAL',
      items: [
        { label: 'Clinical Records', path: '/clinical-notes', icon: 'FileText' },
        { label: 'AI Note Assistant', path: '/clinical-notes/ai-assistant', icon: 'Bot', badge: 'AI' },
      ],
    },
    {
      title: 'BILLING (VIEW ONLY)',
      items: [
        { label: 'Six Provider Bills', path: '/billing/four-bills', icon: 'Layers' },
      ],
    },
    {
      title: 'DOCUMENTS',
      items: [
        { label: 'Documents', path: '/documents', icon: 'FileSpreadsheet' },
      ],
    },
  ],

  [ROLES.BILLING_STAFF]: [
    {
      title: 'CORE MANAGEMENT',
      items: [
        { label: 'Dashboard', path: '/dashboard/billing-staff', icon: 'LayoutDashboard' },
        { label: 'Patients', path: '/patients', icon: 'Users' },
        { label: 'Accident Cases', path: '/cases', icon: 'FileSpreadsheet' },
      ],
    },
    {
      title: 'FINANCIAL & BILLING',
      items: [
        { label: 'Billing Overview', path: '/billing/overview', icon: 'Receipt' },
        { label: 'Six Provider Bills', path: '/billing/four-bills', icon: 'Layers' },
        { label: 'CMS-1500 Claims', path: '/cms-1500', icon: 'FileText' },
        { label: 'Payments & Adjustments', path: '/billing/payments', icon: 'CreditCard' },
        { label: 'Account Aging', path: '/billing/aging', icon: 'PieChart' },
      ],
    },
    {
      title: 'DOCUMENTS & PACKETS',
      items: [
        { label: 'Documents', path: '/documents', icon: 'FileSpreadsheet' },
        { label: 'Patient Packets', path: '/documents/packet-builder', icon: 'Layers' },
      ],
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Reports', path: '/admin/reports', icon: 'PieChart' },
      ],
    },
  ],
};
