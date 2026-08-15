# Clinic Workflow & Operational Manual

This document defines the operational workflows and roles within the clinical platform, tracking a patient's lifecycle from intake to attorney settlement.

---

## 1. Patient Lifecycle Diagram

```text
  [1. Receptionist Intake] ──> [2. MD Consult (JOSMIC)] ──> [3. Physical Therapy (DAV'S & ANIK)]
             │                                                                 │
             ▼                                                                 ▼
[6. Super Admin Governance] <── [5. Billing & claims (Rachel)] <── [4. Counseling (Hope Behavioral)]
```

---

## 2. Dynamic Scope Filtering

Throughout the application, the **Top Header Provider Dropdown Selector** serves as a global scope filter for non-receptionist roles. 
Selecting a specific provider (e.g., *JOSMIC Wellness Center* or a dynamically registered provider) automatically restricts scheduling and queue lists across the system:
* **Appointments Calendar (`/appointments/calendar`)**: Displays and schedules slots exclusively for the chosen provider.
* **Master Dashboard (`/dashboard/super-admin`)**: Filters total appointments and self-booking KPI count cards.
* **Front Desk Check-in Queue (`/appointments/checkin`)**: Displays only patient lobby arrivals matching the selected provider.

Selecting *All Practice Providers (6 Modalities)* resets the views to show all clinic-wide activities.

---

## 3. End-to-End Operational Lifecycle: Case Study

To illustrate the unified workflow, consider a typical clinic case study:

### 🚗 Incident Details
* **Patient**: John Doe (SAMPLE TESTING), DOB: `10/08/1974`, Patient ID: `141849159`
* **Accident**: Motor Vehicle Collision (MVC) on `12/27/2025` causing neck, lumbar spine, and ankle injuries, accompanied by post-accident anxiety.
* **Attorney**: OJ Lawal & Associates (Letter of Protection signed).
* **Auto Insurance**: State Farm Insurance (Claim #SF-889201).

---

## 4. Step-by-Step Staff Workflows & Roles

### Step 1: Patient Registration & Scheduling (Receptionist)
1. **Intake**: Navigate to `/patients` and select **New Patient**. Fill out demographics, including full name, DOB, address, and masked SSN.
2. **Case Creation**: Navigate to `/cases` and select **Create Case**. Fill in the accident date (`12/27/2025`), accident type (`AUTO_ACCIDENT`), select the assigned attorney (firm name and toggle "LOP Signed"), and input the auto insurance details.
3. **Appointment Booking**: Navigate to the calendar (`/appointments/calendar`). Book an initial consultation with the provider **JOSMIC Wellness Center**.
   * *Rule*: The scheduling system checks for weekend closures or US Federal holidays. Attempting to schedule on a closed day prompts the user to select the next business day.
   * *Automation*: Once booked, a simulated SMS/Email reminder is queued in the system with status `Sent - Demo`.

### Step 2: Clinical Evaluation & Referral (Doctor / MD)
1. **Dashboard Check-In**: The doctor logs in (`/dashboard/doctor`), sees John Doe in the waiting room list, and clicks **Begin Evaluation**.
2. **JOSMIC Pain Report**: The doctor completes the pain assessment form:
   * Selects pain regions (Cervical Spine, Lumbar Spine, Right Ankle).
   * Rates severity (e.g., 7/10 on the NRS scale).
   * Assigns ICD-10 diagnosis codes (`S13.4` Cervical sprain, `S33.5` Lumbar strain, `M54.50` Low back pain).
   * Sets the consultation CPT code (`99204`, charge `$1,214.00`).
3. **AI Assist Charting**: To speed up clinical entry, the doctor clicks the **AI Note Assistant** panel, pastes raw dictation notes, and clicks **Generate Draft**. The system fills in structured Subjective, Objective, Assessment, and Plan fields.
4. **Treatment Orders**: The doctor prescribes procedure courses for:
   * Shockwave Therapy (DAV'S Anatomy)
   * Laser Therapy (ANIK Laser Therapy)
   * Psychotherapy (Counselor Practice)
5. **Electronic Signature**: The doctor clicks **Sign Note**, opening a canvas to sign and seal the report, changing its status to `SIGNED`.

### Step 3: Physical Therapy Execution (Physical Therapist)
1. **Roster Review**: The therapist logs in (`/dashboard/therapist`), selects John Doe from the list, and opens the session sheet.
2. **Shockwave Session (DAV'S Anatomy)**:
   * Records vitals (Blood pressure, Heart rate) and checks the patient consent toggle.
   * Documents shockwave parameters: Bar settings, Hz settings, and total wave count.
   * Selects treated anatomical regions (Neck, Low Back) on the body diagram.
   * Appends CPT codes `0101T` (Shockwave treatment, `$1,000.00`) and `97124` (Massage, `$90.00`) to the ledger.
3. **Laser Session (ANIK Laser Therapy)**:
   * Documents session number, laser duration, wavelength (e.g., 800nm), and total energy (e.g., 236,000 Joules).
   * Appends CPT codes `97039` (Laser Therapy, `$2,000.00`) and `10001` (Protective eye glasses, `$50.00`) to the ledger.

### Step 4: Psychotherapy & Counseling (Counselor)
1. **Mental Health Intake**: The counselor logs in (`/dashboard/counselor`), opens John Doe's behavioral chart, and logs the session.
2. **Counseling Note**: Completes progress notes utilizing CBT techniques for post-accident trauma.
3. **Diagnostic Coding**: Input DSM-5/ICD-10 codes (`F43.10` PTSD, `F41.1` Generalized Anxiety).
4. **Billing Transmission**: Transmits the session units (CPT `90834`, charge `$150.00`) directly to the Counselor Statement ledger.

### Step 5: Billing, CMS-1500, & Legal Packets (Billing Staff)
1. **Four Bills Ledger**: The billing clerk navigates to `/billing/four-bills` and opens John Doe's case ledger.
2. **Review Ledgers**: The system consolidates all four provider bills under the case:
   * **JOSMIC**: `$1,214.00`
   * **DAV'S**: `$9,870.00` (e.g., initial visit + shockwave sessions)
   * **ANIK**: `$18,920.00` (e.g., laser therapy sessions)
   * **Counselor**: `$1,140.00` (e.g., psychotherapy sessions)
   * **Consolidated Case Total**: **`$31,144.00`**
3. **CMS-1500 Generation**: Mapped with 1-click onto standard HCFA red grids. The clerk verifies box numbers (Box 1a policy ID, Box 10 auto accident check, Box 21 diagnoses, Box 24 service lines, Box 33 billing credentials).
4. **Payment Posting**: Once settlement checks arrive from the attorney, the clerk clicks **Post Payment/Adjustment** on the ledger to reduce balance due.
5. **Lien Aging Review**: The clerk views accounts receivable in `/billing/aging` to check unpaid invoices in 30, 60, and 90+ day columns.
6. **Legal Packet Compiler**: Compiles the final packet. Selects the medical charts, billing statements, and CMS-1500 forms, and compiles them into a single, merged document tree for attorney review.

### Step 6: Clinic Governance & Security Auditing (Super Admin)
1. **KPI Reports**: Inspects consolidated practice revenues, patient counts, and modality utilization split percentages.
2. **Audit Trails**: Navigates to `/admin/audit-logs`. Inspects the immutable list of HIPAA actions to verify who accessed patient PHI and when.
3. **Fee Schedules**: Updates master billing code pricing (e.g. modifying CPT `99204` default charge).
