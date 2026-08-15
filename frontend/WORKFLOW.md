# F&M Health & Wellness — Complete Clinic Workflow & Role Architecture

**Document Version:** 2.4  
**Date:** August 10, 2026  
**Platform:** MedCare Practice Pro Billing & Clinical Management System  
**Practice Modalities:** Pain Management (JOSMIC), ESWT Shockwave (DAV'S), Laser Therapy (ANIK), Counseling & Mental Health (Hope Behavioral)

---

## 1. End-to-End Patient Lifecycle & Story (Real Patient Case)

### 🚗 Case Scenario
* **Patient Name:** `SAMPLE TESTING (John Doe)` | **DOB:** `10/08/1974` | **Patient ID:** `141849159`
* **Incident:** Motor Vehicle Collision on `12/27/2025` with cervical, lumbar, and ankle injuries, accompanied by acute post-accident trauma/anxiety.
* **Attorney:** `OJ Lawal & Associates` (Letter of Protection - LOP signed).
* **Auto Insurance:** `State Farm Insurance` (Claim #SF-889201).

---

```
                       ┌─────────────────────────────────────────────────────────────────┐
                       │               CLINIC END-TO-END PATIENT LIFECYCLE               │
                       └─────────────────────────────────────────────────────────────────┘
                                                       │
                     [ STEP 1: Receptionist - Emily Davis ]
                     • Patients Menu ➔ Adds Patient Demographics (ID: 141849159)
                     • Accident Cases Menu ➔ Creates Case (Links Attorney LOP & Auto Ins)
                     • Appointments Menu ➔ Books Doctor Consultation Visit (SMS Sent)
                                                       │
                                                       ▼
                     [ STEP 2: Doctor (MD) - Dr. Segun Adeoye ]
                     • Clinical Documentation Menu ➔ JOSMIC Pain Management Evaluation
                     • Assigns ICD-10 Codes (M54.50, S13.4, M54.6) & CPT 99204 ($1,214.00)
                     • Prescribes Orders: ESWT Shockwave + Class IV Laser + Counseling
                                                       │
                                                       ▼
                     [ STEP 3: Therapist - Alex Rivera ]
                     • Treatment Sessions Menu ➔ Executes Shockwave ESWT & Class IV Laser
                     • Assessments & Forms Menu ➔ Fills Anatomical Body Diagram (800nm, 236k Joules)
                     • Generates DAV'S ($9,870.00) & ANIK ($18,920.00) Procedure Forms
                                                       │
                                                       ▼
                     [ STEP 4: Counselor - Jordan Miller ]
                     • Counseling Sessions Menu ➔ Psychotherapy & Trauma Note
                     • Adds Mental Health Codes (F43.10 PTSD, F41.1 Anxiety) & CPT 90791/90834
                     • Generates Counselor Statement #1024-C ($1,140.00)
                                                       │
                                                       ▼
                     [ STEP 5: Billing Staff - Rachel Green ]
                     • Four Bills Ledger Menu ➔ Unifies all 4 Practice Bills ($31,144.00 Total)
                     • CMS-1500 Claims Menu ➔ Generates official 33-Box HCFA Claim forms
                     • Packet Builder Menu ➔ Compiles 4-Page Printable Legal Packet for Attorney
                     • Payments & Aging Menu ➔ Tracks 30/60/90 Days Attorney Lien settlement
                                                       │
                                                       ▼
                     [ STEP 6: Super Admin - Sarah Connor ]
                     • Dashboard & Reports Menu ➔ Clinic Revenue, Modality Split, Active Cases
                     • Audit Logs Menu ➔ Immutable HIPAA compliance logs of all actions
```

---

## 2. Detailed Role & Menu Breakdown

### 1️⃣ Receptionist (Emily Davis) — *Front Desk & Intake*
* **Dashboard (`/dashboard/receptionist`):** Real-time lobby waiting room, today's visits, and missed appointments.
* **Patients (`/patients`):** Patient intake registration (Name, DOB, Phone, Address, Medical History).
* **Accident Cases (`/cases`):** Links accident mechanism, collision date, Attorney LOP, and auto insurance claim.
* **Appointments Calendar (`/appointments/calendar`):** Books provider appointments with automated weekend closure detection and instant SMS confirmation dispatch.
* **Patient Self-Booking (`/appointments/self-booking`):** Public-facing booking portal for direct patient scheduling.

---

### 2️⃣ Doctor / MD (Dr. Segun Adeoye) — *Clinical Consult & Diagnosis*
* **Dashboard (`/dashboard/doctor`):** Checked-in patient queue and unsigned clinical notes.
* **Clinical Documentation (`/clinical-notes`):** JOSMIC Pain Management Reports with HPI, ROS, physical exam, and ICD-10 diagnostic coding (`M54.50`, `S13.4`, `M54.6`).
* **AI Note Assistant (`/clinical-notes/ai-assistant`):** Converts rough physician voice dictation or text into standardized medical SOAP notes.
* **Assessments & Forms (`/clinical-notes/assessments`):** Comprehensive pain scale (0-10) and treatment authorization forms.

---

### 3️⃣ Physical Therapist (Alex Rivera) — *Laser & Shockwave Modalities*
* **Dashboard (`/dashboard/therapist`):** Daily active therapy session roster.
* **Treatment Sessions (`/treatments`):** Logs energy, wavelength, duration, and shockwave pulses.
* **Procedure Forms (`/clinical-notes/anik-laser`, `/clinical-notes/davs-eswt`):** Interactive **3-Column Human Body Anatomical Findings Chart** with treated body regions (Neck, Low Back, Left Ankle) and clinical observations (`NAD`, `AAO X3`, `A1-A3`).

---

### 4️⃣ Counselor (Jordan Miller) — *Behavioral Health & Psychotherapy*
* **Dashboard (`/dashboard/counselor`):** Active counseling cases and mental health intakes.
* **Counseling Sessions (`/clinical-notes/counselor-session`):** Psychotherapy progress notes (CBT Trauma Processing) with DSM-5/ICD-10 psychiatric diagnostic codes (`F43.10` PTSD, `F41.1` GAD, `F43.0` Acute Stress).
* **Billing Connection:** Transmits session units into Counselor Statement #1024-C ($1,140.00).

---

### 5️⃣ Billing Staff (Rachel Green) — *Financials & Legal Claims*
* **Dashboard (`/dashboard/billing-staff`):** Unbilled cases, total accounts receivable, and claims pending review.
* **Four Bills Ledger (`/billing/four-bills`):** Unified ledger combining all 4 practice provider statements:
  1. JOSMIC Wellness Center (#120197): `$1,214.00`
  2. DAV'S Anatomy (#121559): `$9,870.00`
  3. ANIK Laser Therapy (#121560): `$18,920.00`
  4. Counselor Practice (#1024-C): `$1,140.00`
  * **Unified Total:** **`$31,144.00`**
* **CMS-1500 Claims (`/cms-1500`):** 1-Click generation of official 33-box red-grid HCFA claim forms.
* **Patient Packet Builder (`/documents/packet-builder`):** Compiles complete legal packets (Cover Page + Medical Narrative + Statement + CMS-1500).
* **Payments & Adjustments (`/billing/payments`):** Posts attorney settlement checks and updates balances.
* **Accounts Aging (`/billing/aging`):** 0-30, 31-60, 61-90+ day lien aging buckets.

---

### 6️⃣ Super Admin (Sarah Connor) — *Clinic Director & Governance*
* **Dashboard (`/dashboard/super-admin`):** Executive clinic KPIs, revenue breakdown, and patient volume.
* **Staff & Team (`/admin/staff`):** User management, role permissions, and credential governance.
* **Practice Providers (`/admin/providers`):** NPI, Tax ID, and address management for all 4 practice entities.
* **Fee Schedules & CPT (`/admin/services`):** Master pricing controls for CPT codes (99204, 0101T, 97039, 90834).
* **Audit & Compliance (`/admin/audit-logs`):** Immutable HIPAA access trail with timestamp, user ID, IP address, and resource accessed.
* **System Settings (`/settings/general`):** Weekend rules, SMS gateway, and security policies.
