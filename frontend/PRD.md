# Product Requirements Document — Frontend

## Medical Practice Billing & Clinical Documentation Platform

---

## 1. Document Information

| Field | Value |
|---|---|
| Project Name | Medical Practice Billing & Clinical Documentation Platform |
| Working Product Name | MedPractice Pro — temporary name, pending client approval |
| Document | Product Requirements Document |
| Version | 0.9.0 |
| Status | Draft — Awaiting Internal Review and Client Clarification |
| Current Phase | Phase 1 — Frontend Documentation and Planning |
| Future Phase | Phase 2 — Frontend Implementation |
| Approved Frontend Stack | React.js, JavaScript, Tailwind CSS, React Router DOM |
| Backend Status | Not started |
| Database Status | Not started |
| Last Updated | 04 August 2026 |
| Author | Project Team |

---

## 2. Document Purpose

This document defines the frontend product requirements for a medical practice management, clinical documentation, appointment scheduling, reminder, and multi-provider billing application.

The purpose of the current phase is to:

1. Understand and document the complete client requirement.
2. Analyse the existing Google Stitch-exported frontend.
3. Preserve the existing Stitch design without redesigning it.
4. Define the required frontend modules, screens, forms, workflows, states, and interactions.
5. Prepare the frontend for future backend integration.
6. Use mock data and simulated services during frontend development.
7. Avoid backend, database, cloud, and real third-party integrations until the frontend has been completed and approved.

This PRD does not authorise frontend implementation automatically.

Frontend implementation will begin only after the following documents have been reviewed and approved:

- `PRD.md`
- `wireframe.md`
- `flow.md`
- `architecture.md`

---

## 3. Requirement Status Definitions

Every requirement in this PRD uses one of the following statuses:

| Status | Meaning |
|---|---|
| Confirmed | Explicitly requested or confirmed by the client |
| Reference-Derived | Identified from the uploaded PDF reference documents |
| Assumed | Recommended product or UX requirement that has not yet been confirmed by the client |
| TBD | Information is missing and requires client confirmation |

An assumed or reference-derived requirement must not be presented to the client as confirmed until the client approves it.

---

## 4. Executive Summary

The client requires a secure internal medical operations application that allows clinic staff to manage patients, accident-related cases, appointments, clinical documentation, treatment sessions, medical bills, CMS-1500 previews, and complete patient document packets.

The client specifically requested:

- A website or software that can create medical bills similar to the supplied samples.
- AI-assisted doctor-note creation.
- Automatic reminder messages when appointments are booked.
- Support for four separate bills.
- A similar billing and clinical-documentation workflow for a counselor.
- Information about HIPAA-related capabilities.

The same patient accident case may involve services from four separate provider profiles:

1. JOSMIC Wellness Center
2. DAV’S Anatomy
3. ANIK Laser Therapy
4. Counselor Practice — final details pending

The frontend will initially use mock data and simulated interactions. No actual patient data, real authentication, real AI service, real SMS/email delivery, database, claim submission, or server-side PDF generation will be implemented during the frontend-only phase.

---

## 5. Problem Statement

The client currently appears to prepare medical billing statements, CMS-1500 forms, treatment notes, procedure forms, and final reports using separate documents.

This creates several potential operational problems:

- Patient information may need to be entered repeatedly.
- Different providers may use inconsistent document formats.
- Bills and clinical notes may not be connected to the same patient case.
- Appointment reminders may need to be sent manually.
- Treatment records may be distributed across separate files.
- Preparing a complete attorney or insurance packet may require manually combining documents.
- Different staff members may need different levels of access.
- The fourth counselor workflow cannot be added efficiently if every provider is hard-coded separately.

The proposed application will provide one structured frontend where a patient and accident case can be created once and then connected to multiple appointments, notes, treatments, documents, and four independent provider bills.

---

## 6. Product Vision

Create a professional medical operations frontend that enables authorised users to manage the full patient-case workflow from intake through appointment scheduling, clinical documentation, treatment recording, provider billing, CMS-1500 preview, and document-packet preparation.

The interface must look and behave like a secure internal healthcare application rather than a public hospital or marketing website.

---

## 7. Product Goals

### 7.1 Primary Goals

1. Preserve and complete the approved Google Stitch visual design.
2. Provide a single frontend for managing patient and accident-case information.
3. Support four separate provider bills under one patient case.
4. Support provider-specific clinical and procedure forms.
5. Provide AI-assisted clinical-note mock workflows.
6. Provide appointment booking and reminder configuration UI.
7. Provide billing-statement and CMS-1500 editor/preview interfaces.
8. Provide document management and patient-packet preparation.
9. Provide role-based dashboards, navigation, and UI visibility.
10. Make the frontend ready for future API integration without redesigning the UI.

### 7.2 Secondary Goals

1. Reduce repeated patient-data entry.
2. Standardise provider documents.
3. Improve visibility of unsigned notes and pending bills.
4. Allow staff to understand the state of every appointment, note, bill, and document.
5. Support future providers through configurable provider profiles.

---

## 8. Non-Goals for the Current Phase

The following are explicitly outside the current frontend phase:

- Backend APIs
- Database schemas or migrations
- Real user authentication
- Real MFA verification
- JWT or session-server implementation
- Real AI model integration
- Real SMS sending
- Real email sending
- Real electronic signatures
- Real cloud file storage
- Real audit-log enforcement
- Server-side PDF generation
- Electronic insurance claim submission
- EDI 837P generation
- Clearinghouse integration
- Payment gateway integration
- Insurance eligibility verification
- Patient portal
- Attorney portal
- Insurance portal
- Native mobile application
- Full multi-tenant SaaS subscription functionality
- Claims adjudication
- Automated diagnosis
- Automated medical coding
- Autonomous AI clinical decision-making
- Claims of HIPAA certification or completed HIPAA compliance

Mock and visual demonstrations of selected features may be developed during Phase 2.

---

## 9. Source Material

### 9.1 Client Messages

The following client requirements are considered confirmed:

| Client Requirement | Product Interpretation | Status |
|---|---|---|
| Create a bill like the supplied examples | Medical billing statement editor and preview | Confirmed |
| Add AI doctor’s note | AI-assisted note-drafting interface | Confirmed |
| Send reminders when appointments are booked | Appointment reminder configuration and delivery-status UI | Confirmed |
| Add another bill | Multi-provider billing support | Confirmed |
| Something similar for a counselor | Counselor provider, clinical note, and billing placeholder | Confirmed |
| Four bills are required | Four independent provider bills under one patient case | Confirmed |
| Asked whether it has HIPAA | HIPAA-aligned security and privacy requirements must be considered | Confirmed |

### 9.2 JOSMIC Wellness Center Reference Packet

The seven-page JOSMIC reference packet contains:

- Patient and accident information
- Billing statement
- CMS-1500 reference form
- Pain-management assessment and report
- Provider signature section

Reference-derived sample service information includes:

- Procedure code `99204`
- Description: Pain Consult
- Sample charge: `$1,214.00`

The JOSMIC clinical form contains fields for:

- Patient details
- Chief complaint
- Pain type
- Pain locations
- Mechanism of injury
- Pain severity
- Medical history
- Physical examination
- Diagnosis
- Treatment recommendations
- Follow-up
- Provider signature section

All business details, prices, provider identifiers, addresses, codes, and phone numbers appearing in the sample must be treated as unverified reference values.

### 9.3 DAV’S Anatomy Reference Packet

The fourteen-page DAV’S Anatomy reference packet contains:

- Patient and accident cover information
- Billing statement
- Multiple CMS-1500 reference forms
- ESWT/shockwave procedure forms
- Progress documentation
- Final treatment documentation
- Provider signature sections

Reference-derived sample service information includes:

| Code | Description | Sample Charge |
|---|---|---:|
| 99204 | Initial Visit II | $250.00 |
| 0101T | Shockwave / ESWT | $1,000.00 |
| 10001 | Eye Protective Glasses | $50.00 |
| 97124 | Massage Therapy I | $90.00 |
| 99214 | Final Visit II | $200.00 |

The ESWT procedure forms include fields such as:

- Patient name
- Date of birth
- Sex
- Procedure date and time
- Consent confirmation
- Allergies
- Blood pressure
- Heart rate
- Patient history
- Findings
- Nerve-block injection
- Treatment areas
- Bar setting
- Hz setting
- Dose
- Total waves or treatment amount
- BLT cream application
- Reaction or bruising
- Comments
- Pre-treatment instructions
- Treatment protocol
- Post-procedure instructions
- Provider signature section

All values are configurable samples and must not become permanent business rules.

### 9.4 ANIK Laser Therapy Reference Packet

The sixteen-page ANIK reference packet contains:

- Billing statement
- Multiple CMS-1500 reference forms
- Therapy assessment
- Laser procedure forms
- Initial narrative
- Progress documentation
- Final or discharge report
- Provider signature sections

Reference-derived sample service information includes:

| Code | Description | Sample Charge |
|---|---|---:|
| 97039 | Laser Therapy | $2,000.00 |
| 10001 | Eye Protective Glasses | $50.00 |
| 97124 | Massage Therapy I | $90.00 |
| 99213 | Follow-Up Consultation | $500.00 |

The laser procedure forms include fields such as:

- Patient name
- Date of birth
- Sex
- Procedure date and time
- Consent confirmation
- Allergies
- Session number
- Findings
- Procedure tolerated
- Duration completed
- Blood pressure
- Heart rate
- Nerve-block injection
- Treatment areas
- Total treatment time
- Dose
- Wavelength
- Total energy
- General condition
- Additional comments
- Post-procedure instructions
- Provider signature section

All values are configurable samples and must not become permanent business rules.

### 9.5 Counselor Provider

The counselor is the fourth required provider.

The following are confirmed:

- A fourth bill is required.
- The provider category is counseling.
- The counselor must have a clinical-documentation workflow.
- The counselor must be connected to the same patient-case structure.

The following remain TBD:

- Business name
- Address
- Phone and email
- Provider credentials
- Tax ID
- NPI
- Services
- Procedure codes
- Diagnosis codes
- Pricing
- Note format
- Treatment plan format
- Final report format
- CMS-1500 requirement
- Exact bill template

No missing counselor details may be invented.

---

## 10. Stitch Design Preservation

The Google Stitch-exported UI is considered the approved visual reference for the frontend.

Antigravity and the development team must not:

- Redesign existing screens
- Replace existing layouts
- Change the approved visual hierarchy
- Generate a new design system
- Change colours without approval
- Change typography without approval
- Replace existing icons without approval
- Modify existing images or illustrations
- Regenerate existing images
- Change image aspect ratios or cropping
- Replace existing cards, tables, forms, buttons, tabs, headers, or sidebar styling
- Rebuild existing screens using a different visual direction
- Remove existing screens or components
- Replace the current framework during documentation

When missing UI elements are required, they must follow the closest existing Stitch design pattern.

Any proposed design change must be documented under:

> Proposed UI Changes Requiring Approval

No proposed design change may be applied automatically.

---

## 11. Current and Future Technology Stack

### 11.1 Phase 1 — Documentation

No frontend implementation will be performed during Phase 1.

Required outputs:

- `PRD.md`
- `wireframe.md`
- `flow.md`
- `architecture.md`

### 11.2 Phase 2 — Frontend Implementation

The approved frontend stack is:

- React.js
- JavaScript
- Tailwind CSS
- React Router DOM

Potential supporting libraries may include:

- React Hook Form
- Zod
- Zustand
- TanStack Query
- Lucide React
- Recharts
- date-fns

The final supporting-library list must be reviewed in `architecture.md`.

The frontend must use JavaScript files unless a later decision explicitly approves TypeScript.

Suggested extension examples:

- `.jsx`
- `.js`

Examples:

- `mockPatientService.js`
- `mockBillingService.js`
- `providerConfig.js`
- `PatientProfile.jsx`

---

## 12. Core Product Structure

The frontend should represent the following relationship:

```text
Clinic Organisation
    └── Provider Profiles
          └── Patients
                └── Accident / Legal Cases
                      ├── Assigned Providers
                      ├── Appointments
                      ├── Reminders
                      ├── Clinical Notes
                      ├── Treatment Sessions
                      ├── Four Independent Bills
                      ├── CMS-1500 Records
                      └── Documents and Patient Packets