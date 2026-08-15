# Backend REST API Specification (Proposed)

This document specifies the backend REST API endpoints designed to replace the frontend's mock services layer (`src/services/mock/*`).

---

## 1. Global Specifications

* **Base URL**: `https://api.medpractice-pro.test/v1`
* **Content-Type**: `application/json`
* **Authentication**: Bearer Token in Request Header (`Authorization: Bearer <JWT_TOKEN>`)
* **Standard HTTP Response Codes**:
  * `200 OK`: Request succeeded.
  * `201 Created`: Resource successfully created.
  * `400 Bad Request`: Input validation failed.
  * `401 Unauthorized`: Token missing, expired, or invalid.
  * `403 Forbidden`: Role does not have permission to access the resource.
  * `404 Not Found`: Target resource does not exist.
  * `500 Internal Server Error`: Server failure.

---

## 2. Authentication API (`mockAuthService`)

### 2.1. User Login
* **Endpoint**: `POST /auth/login`
* **Access**: Public
* **Request Payload**:
  ```json
  {
    "email": "admin@example.test",
    "password": "hashed_password_string"
  }
  ```
* **Response Payload (200 OK)**:
  ```json
  {
    "token": "jwt_header.payload.signature_string",
    "user": {
      "id": "usr-sa",
      "email": "admin@example.test",
      "name": "Sarah Connor",
      "role": "Super Admin"
    }
  }
  ```

### 2.2. MFA Verification
* **Endpoint**: `POST /auth/mfa/verify`
* **Access**: Public (Requires temporary session token)
* **Request Payload**:
  ```json
  {
    "tempToken": "temp_session_token_string",
    "code": "123456"
  }
  ```
* **Response Payload (200 OK)**:
  ```json
  {
    "token": "final_jwt_token_string",
    "user": {
      "id": "usr-sa",
      "email": "admin@example.test",
      "role": "Super Admin"
    }
  }
  ```

---

## 3. Practice Providers Registry API (`mockProviderService`)

### 3.1. Get Providers List
* **Endpoint**: `GET /providers`
* **Access**: Authorized Roles
* **Response Payload (200 OK)**:
  ```json
  {
    "prov-josmic": {
      "id": "prov-josmic",
      "name": "JOSMIC Wellness Center",
      "businessName": "JOSMIC Wellness Center LLC",
      "serviceCategory": "Pain Management Consultation",
      "status": "ACTIVE",
      "address": {
        "street": "10101 Harwin Dr.",
        "suite": "Suite 274",
        "city": "Houston",
        "state": "TX",
        "zipCode": "77036"
      },
      "identifiers": {
        "taxId": "993723387",
        "npi": "R7637"
      }
    }
  }
  ```

### 3.2. Register New Provider
* **Endpoint**: `POST /providers`
* **Access**: Super Admin, Clinic Admin
* **Request Payload**:
  ```json
  {
    "name": "HOPE Behavioral Health",
    "businessName": "Hope Behavioral Health LLC",
    "serviceCategory": "Counseling & Mental Health",
    "street": "10101 Harwin Dr.",
    "suite": "Suite 774-C",
    "city": "Houston",
    "state": "TX",
    "zipCode": "77036",
    "phone": "713-555-0188",
    "email": "intake@hope.com",
    "taxId": "84-7891234",
    "npi": "1487965213",
    "renderingName": "Jordan Miller",
    "renderingCredentials": "LCSW, BCD"
  }
  ```
* **Response Payload (201 Created)**:
  ```json
  {
    "id": "prov-12948194",
    "name": "HOPE Behavioral Health",
    "status": "ACTIVE"
  }
  ```

### 3.3. Update Provider Profile Settings
* **Endpoint**: `PUT /providers/:id`
* **Access**: Super Admin, Clinic Admin
* **Request Payload**:
  ```json
  {
    "phone": "713-555-9999",
    "email": "admin@hopebehavioral.com"
  }
  ```
* **Response Payload (200 OK)**:
  ```json
  {
    "id": "prov-counselor",
    "name": "Counselor Practice (Hope Behavioral Health)",
    "contact": {
      "phone": "713-555-9999",
      "email": "admin@hopebehavioral.com"
    }
  }
  ```

---

## 4. Patients & Cases API (`mockPatientService` & `mockCaseService`)

### 4.1. Get Patients List
* **Endpoint**: `GET /patients`
* **Access**: Super Admin, Clinic Admin, Receptionist, Doctor, Therapist, Counselor, Billing Staff
* **Query Parameters**:
  * `search` (string, optional) - Filters by patient name, phone, or DOB.
* **Response Payload (200 OK)**:
  ```json
  [
    {
      "id": "141849159",
      "firstName": "SAMPLE TESTING",
      "lastName": "John Doe",
      "dob": "1974-10-08",
      "phone": "713-555-0199",
      "email": "johndoe@example.test",
      "address": {
        "street": "742 Evergreen Terrace",
        "city": "Springfield",
        "state": "TX",
        "zipCode": "77001"
      }
    }
  ]
  ```

### 4.2. Get Patient Cases
* **Endpoint**: `GET /patients/:patientId/cases`
* **Access**: Authorized Roles
* **Response Payload (200 OK)**:
  ```json
  [
    {
      "id": "case-99201",
      "patientId": "141849159",
      "accidentDate": "2025-12-27",
      "accidentType": "AUTO_ACCIDENT",
      "accidentState": "TX",
      "attorney": {
        "firmName": "OJ Lawal & Associates",
        "lopSigned": true
      },
      "insurance": {
        "carrier": "State Farm Insurance",
        "policyNumber": "SF-889201",
        "claimNumber": "SF-889201-01"
      },
      "diagnosisCodes": ["S13.4", "S33.5", "M54.50"]
    }
  ]
  ```

---

## 5. Appointments & Reminders API (`mockAppointmentService` & `mockReminderService`)

### 5.1. Get Appointments
* **Endpoint**: `GET /appointments`
* **Access**: Authorized Roles
* **Query Parameters**:
  * `patientId` (string, optional)
  * `providerId` (string, optional)
  * `date` (string, optional) - format `YYYY-MM-DD`
* **Response Payload (200 OK)**:
  ```json
  [
    {
      "id": "apt-1",
      "patientId": "141849159",
      "patientName": "SAMPLE TESTING (John Doe)",
      "providerId": "prov-josmic",
      "date": "2026-08-17",
      "startTime": "08:30 AM",
      "endTime": "09:00 AM",
      "status": "SCHEDULED",
      "reminderStatus": "Sent - SMS Queued"
    }
  ]
  ```

### 5.2. Get Available Time Slots
* **Endpoint**: `GET /appointments/available-slots`
* **Access**: Public / Internal
* **Query Parameters**:
  * `providerId` (string, required)
  * `date` (string, required) - format `YYYY-MM-DD`
* **Response Payload (200 OK)**:
  ```json
  {
    "isClosed": false,
    "isWeekend": false,
    "isHoliday": false,
    "slots": [
      { "time": "08:30 AM", "available": true },
      { "time": "09:00 AM", "available": false }
    ]
  }
  ```

---

## 6. Clinical Documentation API (`mockClinicalNoteService`)

### 6.1. Save Clinical Note
* **Endpoint**: `POST /clinical-notes`
* **Access**: Doctor, Therapist, Counselor
* **Request Payload**:
  ```json
  {
    "patientId": "141849159",
    "caseId": "case-99201",
    "providerId": "prov-josmic",
    "noteType": "PAIN_EVALUATION",
    "content": {
      "chiefComplaint": "Cervical and low back stiffness following MVC.",
      "severity": 7,
      "symptoms": ["stiffness", "muscle_spasms"]
    },
    "diagnosisCodes": ["S13.4", "M54.50"]
  }
  ```
* **Response Payload (201 Created)**:
  ```json
  {
    "id": "note-120197",
    "createdAt": "2026-08-15T12:00:00Z",
    "status": "UNSIGNED",
    "patientId": "141849159",
    "providerId": "prov-josmic",
    "noteType": "PAIN_EVALUATION"
  }
  ```

### 6.2. AI SOAP Draft Helper
* **Endpoint**: `POST /clinical-notes/ai-suggest`
* **Access**: Doctor, Therapist, Counselor
* **Request Payload**:
  ```json
  {
    "providerId": "prov-josmic",
    "rawTranscript": "patient complains of lower back pain after car crash, pain is 8 out of 10. physical exam shows tender lumbar spine. recommended laser therapy session."
  }
  ```
* **Response Payload (200 OK)**:
  ```json
  {
    "soapDraft": {
      "subjective": "Lumbar back pain following a Motor Vehicle Collision. Pain reported as 8/10 on NRS.",
      "objective": "Palpation reveals localized tenderness and muscle guarding in the lumbar spine.",
      "assessment": "Post-traumatic lumbar strain (ICD-10: S33.5).",
      "plan": "Schedule Class IV Laser Therapy treatments and pain management consultations."
    }
  }
  ```

---

## 7. Billing API (`mockBillingService`)

### 7.1. Get Billing Statement
* **Endpoint**: `GET /billing/cases/:caseId/bills`
* **Access**: Billing Staff, Super Admin
* **Response Payload (200 OK)**:
  ```json
  {
    "caseId": "case-99201",
    "totals": {
      "totalCharges": 31144.00,
      "totalPayments": 0.00,
      "totalAdjustments": 0.00,
      "balanceDue": 31144.00
    },
    "providers": {
      "josmic": {
        "billId": "bill-jos-101",
        "charges": 1214.00,
        "balance": 1214.00,
        "items": [
          { "dateOfService": "2026-08-17", "cptCode": "99204", "charge": 1214.00 }
        ]
      },
      "davs": {
        "billId": "bill-dav-102",
        "charges": 9870.00,
        "balance": 9870.00
      },
      "anik": {
        "billId": "bill-ank-103",
        "charges": 18920.00,
        "balance": 18920.00
      },
      "counselor": {
        "billId": "bill-cns-104",
        "charges": 1140.00,
        "balance": 1140.00
      }
    }
  }
  ```

### 7.2. Post Ledger Payment/Adjustment
* **Endpoint**: `POST /billing/bills/:billId/transactions`
* **Access**: Billing Staff, Super Admin
* **Request Payload**:
  ```json
  {
    "type": "PAYMENT", 
    "source": "INSURANCE", 
    "amount": 500.00,
    "referenceNumber": "CHK-992019",
    "notes": "Attorney settlement check payment"
  }
  ```
* **Response Payload (200 OK)**:
  ```json
  {
    "transactionId": "tx-2041",
    "billId": "bill-jos-101",
    "remainingBalance": 714.00
  }
  ```

---

## 8. Audit Compliance Logger (`mockAuditService`)

### 8.1. Log Action
* **Endpoint**: `POST /audit-logs`
* **Access**: System Internal (Automatically triggered by actions)
* **Request Payload**:
  ```json
  {
    "userId": "usr-sa",
    "userName": "Sarah Connor",
    "userRole": "Super Admin",
    "action": "VIEW_PHI",
    "resource": "patient_id:141849159",
    "ipAddress": "192.168.1.10",
    "details": "Viewed patient chart and unmasked SSN/Tax ID"
  }
  ```
* **Response Payload (201 Created)**:
  ```json
  {
    "status": "Logged"
  }
  ```
