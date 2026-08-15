# Technical Architecture Specification

## MedPractice Pro — Medical Billing & Clinical Documentation Platform

---

## 1. Technology Stack Selection

The application is built on a modern, decoupled React frontend structure:

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **UI Framework** | React.js (v18+) | Component-based rendering and interactive UI states |
| **Language** | JavaScript (ES6+ / JSX) | Logical code and components (`.js`, `.jsx`) |
| **Styling** | Tailwind CSS (v3+) | Utility-first responsive styling utilizing theme colors |
| **Routing** | React Router DOM (v6+) | Client-side routing, route protection, and layouts |
| **State Management** | Zustand | Global stores for billing ledger, patient data, and auth |
| **Forms & Validation** | React Hook Form + Custom | Form state tracking and input validation validation rules |
| **Icon Set** | Lucide React | Clean, scalable visual symbols across all menus |
| **Persistence** | Browser `localStorage` | Client-side mock data persistence during development |

---

## 2. Directory Structure Blueprint

```text
medcare_billing/
├── docs/                             # Unified Documentation Directory
│   ├── prd.md
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   ├── workflow.md
│   ├── tech.md
│   ├── dataflow.md
│   └── rules.md
└── frontend/                         # React Frontend Application
    ├── src/
    │   ├── assets/                   # Logos, static assets, styling
    │   ├── components/               # Reusable UI parts
    │   │   ├── common/               # Buttons, inputs, modals, toasts
    │   │   ├── layout/               # Sidebar, header, layouts, guards
    │   │   └── clinical/             # Anatomical canvas, clinical forms
    │   ├── constants/                # Service lists, roles, US holidays
    │   ├── hooks/                    # useAuth, useBilling, usePatients
    │   ├── pages/                    # Views categorized by routing layout
    │   ├── routes/                   # Router configuration and guards
    │   ├── services/                 # Business logic and mock integrations
    │   │   └── mock/                 # Mock api modules (local storage based)
    │   │       ├── mockProviderService.js # Dynamic provider registry logic
    │   │       └── ...
    │   ├── store/                    # Zustand global stores
    │   └── utils/                    # Math rounding, date formatting
    ├── tailwind.config.js            # Tailwind custom colors & design tokens
    └── package.json                  # Dependencies list
```

---

## 3. UI Theme & Design Tokens

To preserve the Google Stitch-approved design, colors and spacing tokens are mapped in the tailwind config:
* **Deep Navy (`#031635`)**: Used for the global side navigation panel background, headers, and container headers.
* **Secondary Accent (`#0040df`)**: Used for primary action indicators, icons, and focus highlights.
* **Clinical Blue (`#2d5bff`)**: Primary button fills, active navigation tabs, and link elements.
* **Surface Background (`#f8f9ff`)**: Main workspace content canvas.
* **Card Canvas (`#ffffff`)**: Inner cards, grids, and table container backgrounds.
* **Tabular Numbers**: Enabled via CSS class `font-mono` or specific OpenType font configurations in financial/charge tables to ensure decimal numbers align vertically.

---

## 4. Routing Architecture & Protected Guards

All page entries undergo verification via a nested `RouteGuard` structure in React Router DOM:

```text
Root Page (/)
 ├── Unauthenticated Routes
 │    ├── /login (Demo selection page)
 │    ├── /forgot-password
 │    └── /mfa-verify
 └── Authenticated AppLayout Shell (/dashboard)
      ├── Route Guards (Checks Active Role permissions)
      ├── Role Dashboards:
      │    ├── /dashboard/super-admin
      │    ├── /dashboard/receptionist
      │    ├── /dashboard/doctor
      │    ├── /dashboard/therapist
      │    ├── /dashboard/counselor
      │    └── /dashboard/billing-staff
      ├── /patients & /patients/:id/profile
      ├── /cases & /cases/:id
      ├── /appointments (Calendar & Patient Self-booking)
      ├── /clinical-notes (JOSMIC, DAV'S, ANIK, Counselor forms)
      ├── /billing (Consolidated 4-Bill Ledger & Aging Report)
      ├── /cms-1500/:id/edit & preview
      └── /admin (Audit compliance log viewer, Fee schedule controls, Provider profiles list)
```

---

## 5. Client-Side Security Controls & HIPAA Alignment

Although the current version is a frontend client running against simulated services, several HIPAA-aligned architectural rules are hardcoded:
1. **PHI Masking**: Sensitive identifiers like SSNs and Tax IDs are obfuscated (`XXX-XX-1234`) on screens, using a click-to-reveal eye toggle button that triggers an audit log action.
2. **Interactive Audit Logger**: Any read/write action on patient charts, billing ledgers, or claims calls `mockAuditService.logAction()`, which appends logs to `medpractice_audit_logs` in LocalStorage.
3. **Session Idle Timeout**: An event listener monitors mouse/keyboard interactions. At 14 minutes, a warning modal appears. At 15 minutes of inactivity, the session token is removed from LocalStorage, and the user is redirected to the `/login` page.
4. **Clinical Draft Disclaimers**: Displays a mandatory disclaimer banner at the bottom of the AI SOAP helper panel: *"AI-generated text is a helper draft and must be reviewed and approved by an authorized medical provider prior to signature."*

---

## 6. LocalStorage Persistence & Mock Services

Mock JavaScript services store and retrieve data synchronously using `window.localStorage` namespaces:

* `medpractice_session_user`
* `medpractice_patient_registry`
* `medpractice_cases`
* `medpractice_appointments`
* `medpractice_clinical_notes`
* `medpractice_bills_ledger`
* `medpractice_cms_claims`
* `medpractice_documents`
* `medpractice_providers`      <-- Mapped to mockProviderService for dynamic profile settings
* `medpractice_audit_logs`

### Synchronization Mechanism
To synchronize changes (such as adding a new provider profile) across distant, decoupled components like `TopHeader` (select filters) and `ProviderListPage` (admin console), the system uses browser-level custom events:
* Dispatch: `window.dispatchEvent(new Event('providers-updated'))` upon mutations.
* Subscription: `window.addEventListener('providers-updated', reloadHandler)` inside headers and profiles.
