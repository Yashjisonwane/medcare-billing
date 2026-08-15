# Development Guidelines & Coding Rules

This document outlines the strict guidelines, coding practices, and compliance regulations required for developers modifying or extending the clinical platform.

---

## 1. UI Style & Design Preservation Rules

All visual modifications must align with the approved Google Stitch design specifications:
* **No Spacing Changes**: Spacing classes (e.g., `p-4`, `m-6`, `gap-3`) must remain consistent with existing grids. Do not add random margins or paddings.
* **No Color Swaps**: Color tokens must be loaded directly from the Tailwind configuration. Never hardcode custom hex codes (like `#ff0000` or `#00ff00`) inside components.
* **Icon Consistency**: Reusable icons must come from the Lucide React library. Match the sizes (default is `size={20}`) and weights of icons in similar components.
* **Component Reuse**: Reuse common components (`Button`, `Input`, `Modal`, `Table`, `Badge`) located in `src/components/common/` rather than writing raw HTML elements.
* **Aspect Ratios**: Do not crop, squeeze, or stretch active images, logos, or illustrations. Preserve standard aspect ratios.

---

## 2. React Components & State Management Rules

* **Modular Files**: Place reusable child elements in separate component files (e.g., `PatientTable.jsx` in `src/components/patients/`). Keep page container files in `src/pages/` focused on routing, state retrieval, and layout assembly.
* **Zustand Stores**: Global data (patients, cases, billing ledgers, authentication session) must live inside Zustand stores in `src/store/`. Do not pass complex data down through multiple levels of component props; use stores instead.
* **Local vs. Global State**:
  * Use **Zustand stores** for data that needs to persist or be shared across pages (e.g. active case, list of appointments).
  * Use **React `useState`** only for isolated UI states (e.g. modal open flags, current tab selections, input field values, search filter text).
* **Global Filters**: Pages presenting lists or records that relate to specific practice modalities (e.g. calendar, lobbies, stats counters) must subscribe to `activeProviderFilter` from `useUIStore` and filter the rendered UI datasets accordingly.
* **Prop Types**: Document component expectations using prop validation or comments indicating type and structure.

---

## 3. Financial Ledger Arithmetic Rules

To eliminate JavaScript floating-point arithmetic errors (like `0.1 + 0.2 = 0.30000000000000004`) in billing ledgers:
* **Float Parsing**: Parse input fields as numbers immediately before any mathematical operations: `Number(value) || 0`.
* **Precision Enforcement**: All arithmetic results (balances, service line totals, ledger adjustments) must be formatted using `.toFixed(2)` and wrapped back in `Number()` if further calculations are needed:
  ```javascript
  const balance = charge - (payments + adjustments);
  const finalBalance = Number(balance.toFixed(2));
  ```
* **Ledger Synchronization**: Whenever a line item's charge, payment, or adjustment changes, recalculate the parent bill's grand totals automatically.

---

## 4. Security & HIPAA Compliance Rules

Developers must implement these security controls inside all clinical and billing modules:
1. **PHI Masking**:
   * Patient SSNs and Provider Tax IDs must be masked by default: `XX-XXX1234` or `XXX-XX-6789`.
   * Provide a toggle button (eye icon) to unmask.
   * Unmasking must trigger a log entry via the audit service.
2. **Audit Logging**:
   * Any read, write, print, or export operation on patient charts, billing files, or CMS-1500 claims must call `mockAuditService.logAction()`:
     ```javascript
     mockAuditService.logAction({
       action: 'VIEW_PATIENT_CHART',
       resource: `patient_id:${patientId}`,
       details: 'User opened the clinical overview profile'
     });
     ```
3. **Session Session Guard**:
   * Monitor user interaction using mousemove, keydown, and scroll event listeners.
   * Display a session warning modal at 14 minutes.
   * Auto-logout (destroy session token, clear state stores, redirect to `/login`) at 15 minutes of inactivity.
4. **AI Generation Disclaimers**:
   * Any view providing AI-suggested notes or SOAP text drafts must display the following notice clearly in red/amber font:
     > [!WARNING]
     > *AI-generated content is a draft helper and must be reviewed and approved by an authorized clinician prior to signature.*
