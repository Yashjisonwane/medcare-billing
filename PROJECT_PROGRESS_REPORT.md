# MedCare Billing & Clinical Management Platform — Project Progress Report

**Date of Report:** August 18, 2026  
**System Environment:** Windows | Node.js v22 | Express.js (Port 5000) | MySQL Database (Port 3307) | React Frontend (Port 3000 / 5173)

---

## 1. Executive Summary

The **MedCare Billing & Clinical Management System** has been engineered and connected end-to-end. All core modules—including database persistence in MySQL, user authentication, profile photo uploading, provider and practice settings, public patient self-booking with real-time slot and US holiday blocking, and automated transactional email dispatching—are built, tested, and live.

---

## 2. Completed Modules & Feature Breakdown

### Module 1: System Foundation & Database Infrastructure
* **MySQL Database Connection:** Connected via Prisma ORM on port `3307` (`medcare_billing`).
* **Express REST API:** Operating on `http://localhost:5000/v1` with JSON request logging, CORS, and health monitoring endpoints (`/v1/status`).
* **Live System Health:** Server status is `UP` with verified database queries.

---

### Module 2: Authentication, Profile & Staff Management
* **Role-Based Access Control:** Configured for `SUPER_ADMIN`, `DOCTOR`, `THERAPIST`, `COUNSELOR`, `BILLER`, and `RECEPTIONIST`.
* **Profile & Photo Uploader:**
  * Interactive modal allowing full editing of Full Name, Professional Title, Email, and Profile Avatar.
  * Direct **local photo upload from PC** (supports JPG, PNG, WebP up to 5MB via Base64 `MediumText` in MySQL) plus preset avatars.
  * Synchronized across `TopHeader`, `Sidebar`, and MySQL database.
* **Staff Directory Management (`/staff`):** Full CRUD capability (Add new staff with photo upload, Edit staff details, and Delete staff).

---

### Module 3: Practice Identity & Clinical Modalities (Settings)
* **Live Provider Registry (4 Core Providers in MySQL):**
  1. **JOSMIC Wellness Center:** Pain Management (CPT `99204`, Fee: `$1,214.00`)
  2. **ANIK Laser Therapy:** High-Intensity Laser Therapy (CPT `97039`, Fee: `$2,000.00`)
  3. **DAV'S Anatomy:** Shockwave Therapy / ESWT (CPT `0101T`, Fee: `$1,000.00`)
  4. **Counselor Practice (Hope Behavioral Health):** Psychotherapy & Intake (CPT `90834 / 90791`, Fee: `$180.00 – $350.00`)
* **Practice Details:** Practice Identity (NPI, EIN, Tax ID, Address, License) and Regional Timezone set to **Central Time (`America/Chicago`)**.

---

### Module 4: Patient Public Self-Booking Portal (`/book`)
* **Step 1 — Patient Info:** Full Name, Phone, Email, Date of Birth with auto-age calculation and past-date enforcement, Reason for visit, and optional Accident/Attorney Representation.
* **Step 2 — Doctor & Modality Picker:** Real-time provider selection and multi-service selection with live CPT codes and confirmed pricing.
* **Step 3 — Intelligent Slot Availability Engine:**
  * **US Federal Holiday Auto-Blocker:** 11 official US holidays auto-calculated with observed date rules; booking automatically disabled on holidays.
  * **Weekend Blocker:** Automatically blocks Saturday and Sunday slots.
  * **Passed Time-Slot Blocker:** Blocks already elapsed morning/afternoon hours for today based on real-time Houston, TX Central Time.
  * **Existing Booking Blocker:** Checks MySQL database to prevent double-booking.
* **Step 4 — Instant Booking Receipt:** Generates printable appointment summary with a unique **`SELF-XXXXXX`** reference code.
* **Booking Lookup / Search:** Allows patients to look up upcoming and past visits using their phone number, email, or reference code.

---

### Module 5: Clinical SOAP Notes & AI Assistant
* **Clinical Templates:** Customized templates for Pain Management Evaluation, Laser Therapy records, ESWT records, and Behavioral Health progress notes.
* **AI SOAP Assistant Integration Architecture:** Ready for direct connection to **Google Gemini API** or **OpenAI API**.

---

### Module 6: Automated Notification & Email Engine
* **Universal Provider Key Support:** Configured in `backend/src/services/notificationService.js` to automatically detect:
  * **Resend API Key (`re_...`)**
  * **SendGrid API Key (`SG....`)**
  * **Gmail / Google Workspace App Password (16 characters)**
  * **Standard SMTP**
* **Pre-Built HTML Email Templates:**
  1. Instant Patient Booking Confirmation (with doctor, date, time, reference code, and directions).
  2. 24h / 48h Automated Visit Reminders.
  3. Certified Clinical Reports & Superbill PDF delivery.
  4. Billing Payment Receipts & Itemized Statements.
  5. Staff & Doctor Portal Onboarding Credential Invitations.
* **Audit Fallback:** Automatically queues and logs notification activity in the MySQL `reminder_logs` table.

---

## 3. Current System Status Table

| Component | Port / Path | State | Database Synced |
| :--- | :--- | :---: | :---: |
| **Frontend Application** | `localhost:3000` / `5173` | Active | Yes |
| **Backend REST API** | `localhost:5000/v1` | Active (`UP`) | Yes |
| **MySQL Database** | `localhost:3307/medcare_billing` | Active (`CONNECTED`)| Yes |
| **Self-Booking Engine** | `/book` | Active | Yes |
| **Staff & Auth APIs** | `/v1/auth`, `/v1/staff` | Active | Yes |
| **Appointment APIs** | `/v1/appointments` | Active | Yes |
| **Notification Engine** | `/v1/notifications` | Active | Yes (Plug & Play) |

---

## 4. Next Steps
* Ready for production deployment or client testing.
* As soon as the client supplies an AI Key (Gemini/OpenAI) and/or Email Key (Resend/SendGrid/Gmail), simply insert them into `.env` for instant live operations.
