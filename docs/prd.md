# Product Requirements Document (PRD)

## MedPractice Pro — Medical Billing & Clinical Documentation Platform

---

## 1. Document Overview
* **Status**: Approved System Specification
* **Current Phase**: Documentation and Design Validation
* **Target Stack**: React.js, JavaScript, Tailwind CSS, React Router DOM, Zustand (Frontend), REST API (Backend)
* **Goal**: Provide a single, integrated operations interface for a multi-provider clinic to handle patient intake, case management, scheduling, clinical assessments, treatment session recording, legal attorney packet compilation, and multi-practice billing ledger operations.

---

## 2. Problem Statement
Clinics operating multiple providers or practicing under distinct corporate entities often struggle with administrative overhead, duplicate data entries, and legal documentation fragmentation. 
Specifically, the clinic requires support for four separate provider bills under one patient case initially:
1. **JOSMIC Wellness Center** (Pain Management Consultation)
2. **DAV’S Anatomy** (Shockwave/ESWT Therapy)
3. **ANIK Laser Therapy** (Laser Therapy)
4. **Counselor Practice** (Behavioral Health and Counseling - Hope Behavioral)

To prevent duplicate administrative entries, the application must tie patient demographics, accident information (insurance, attorney LOP), appointments, clinical notes, and all independent bills together under a single unified Case structure. 
Furthermore, the application must allow the clinic directory to dynamically register new providers and specialties to scale beyond the initial 4 configurations.

---

## 3. Product Vision & Goals
* **Unified Case File**: A single client intake creates a patient record and accident case that references all appointments, notes, treatments, and bills.
* **Preserved UI Aesthetics**: Match the approved look and feel of the Google Stitch-exported interface (Deep Navy `#031635`, Bright Clinical Blue `#2d5bff`, clean tabular columns, and modern tabular fonts).
* **Multi-Practice Ledger**: View and manage multiple separate billing ledgers under one case, with independent totals, line adjustments, and insurance payments.
* **AI-Assisted Charting**: Provide a clinical helper interface to draft structured SOAP notes from rough provider descriptions or voice transcript simulations.
* **Automated Scheduling Reminders**: Send queue-based SMS/Email messages to patients when visits are booked and track transmission logs.
* **Dynamic Provider Profiles**: Allow Super Admins to dynamically configure and add new practice provider accounts (Name, Business names, Tax ID, NPI credentials, address, and specialty categories) from the settings console, automatically updating all dropdown selectors.
* **Legal Packet compiler**: Generate a single legal packet PDF containing the case cover page, medical notes, ledger statements, and filled CMS-1500 claims for attorney review.

---

## 4. Feature Requirements

### 4.1. Patient & Case Intake
* **Demographics**: Name, DOB, Sex, Address, SSN (masked by default), Phone, Email.
* **Accident Details**: Date of injury, state of accident, accident type (Auto, slip & fall, work injury).
* **Billing Details**: Auto Insurance carrier, policy number, claim number, primary attorney, and Letter of Protection (LOP) signed status.

### 4.2. Appointment Scheduling & Reminders
* **Calendar Management**: Interactive clinic calendar displaying appointments by provider.
* **Weekend and Holiday Checks**: Block bookings on weekends or US Federal holidays automatically (rescheduling to the next business day).
* **Automated Reminders**: Queue SMS/Email notifications on booking, updating delivery status in real-time (`Sent`, `Delivered`, `Failed`).

### 4.3. Dynamic Provider Registry
* **Provider Configurator**: Forms to configure new facility entities, business titles, addresses, contact details, Tax IDs, rendering NPI codes, and practitioners credentials.
* **Header & View Binding**: Sync dropdown selectors dynamically so that newly registered providers show up globally in filter scopes without page reloads.

### 4.4. Multi-Provider Clinical Forms
* **JOSMIC (Doctor / MD)**: Comprehensive Pain Assessment, Chief Complaint, Pain locations, Severity index, diagnosis codes (ICD-10), and treatment referrals.
* **DAV'S Anatomy (Therapist)**: Shockwave (ESWT) procedure forms documenting blood pressure, heart rate, consent check, BLT cream, shock settings (Bar, Hz, pulse count), and anatomical region diagram findings.
* **ANIK Laser Therapy (Therapist)**: Laser Therapy procedure forms documenting session numbers, wavelength, total energy (Joules), and anatomical regions.
* **Counselor Practice (Counselor)**: Psychotherapy progress notes (CBT Trauma Processing) with DSM-5/ICD-10 psychiatric diagnostic codes (e.g., PTSD, Anxiety).
* **AI Assistant Panel**: Context panel allowing providers to click "Generate Draft" to convert rough physician dictation text into a professional SOAP note format.

### 4.5. Billing Ledger & CMS-1500
* **Independent Ledgers**: Separate billing statements with billing provider detail configurations.
* **Service Line Editor**: Input Date of Service, Place of Service, CPT code, Modifiers, Diagnosis Pointer, Unit count, Charges, Payments (Insurance, Patient, Other), and Adjustments.
* **Red-Grid Preview**: Highlight inputs on top of a standard NUCC red-grid background image for pixel-perfect printable forms.

---

## 5. Non-Goals (Scope Limits for Phase 1 & 2)
* **Real Authentication**: Phase 1 & 2 use demo credentials and client-side roles. True JWT session signing is deferred to backend integration.
* **Real SMS/Email Sending**: Reminders are simulated via a mock database queue.
* **Real AI Integrations**: The AI SOAP Note generator uses deterministic client-side text responses.
* **Server-side PDF Assembly**: Document merging and printing are handled via native browser print styles in Phase 2.
* **Real Claim Submission**: Clearinghouse connections or EDI 837P transmission are omitted.
