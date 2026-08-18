// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { RoleGuard } from '../components/layout/RoleGuard';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { MfaVerifyPage } from '../pages/auth/MfaVerifyPage';
import { PermissionDeniedPage } from '../pages/auth/PermissionDeniedPage';

// Dashboard Pages
import { SuperAdminDashboard } from '../pages/dashboards/SuperAdminDashboard';
import { ReceptionistDashboard } from '../pages/dashboards/ReceptionistDashboard';
import { DoctorDashboard } from '../pages/dashboards/DoctorDashboard';
import { TherapistDashboard } from '../pages/dashboards/TherapistDashboard';
import { CounselorDashboard } from '../pages/dashboards/CounselorDashboard';
import { BillingStaffDashboard } from '../pages/dashboards/BillingStaffDashboard';

// Patient & Case Pages
import { PatientListPage } from '../pages/patients/PatientListPage';
import { AddPatientPage } from '../pages/patients/AddPatientPage';
import { PatientProfilePage } from '../pages/patients/PatientProfilePage';
import { CaseListPage } from '../pages/cases/CaseListPage';
import { AddCasePage } from '../pages/cases/AddCasePage';
import { CaseDetailsPage } from '../pages/cases/CaseDetailsPage';

// Appointment Pages
import { CalendarPage } from '../pages/appointments/CalendarPage';
import { ScheduleAppointmentPage } from '../pages/appointments/ScheduleAppointmentPage';
import { CheckInPage } from '../pages/appointments/CheckInPage';
import { ReminderStatusPage } from '../pages/appointments/ReminderStatusPage';
import { PatientSelfBookingPage } from '../pages/appointments/PatientSelfBookingPage';

// Clinical Pages
import { ClinicalNotesListPage } from '../pages/clinical/ClinicalNotesListPage';
import { AiAssistantPage } from '../pages/clinical/AiAssistantPage';
import { AssessmentsAndFormsPage } from '../pages/clinical/AssessmentsAndFormsPage';
import { JosmicPainFormPage } from '../pages/clinical/JosmicPainFormPage';
import { DavsEswtFormPage } from '../pages/clinical/DavsEswtFormPage';
import { AnikLaserFormPage } from '../pages/clinical/AnikLaserFormPage';
import { CounselorSessionPage } from '../pages/clinical/CounselorSessionPage';
import { ClinicalNoteEditorPage } from '../pages/clinical/ClinicalNoteEditorPage';

// Billing & CMS Pages
import { FourBillsPage } from '../pages/billing/FourBillsPage';
import { BillingOverviewPage } from '../pages/billing/BillingOverviewPage';
import { PaymentsAndAdjustmentsPage } from '../pages/billing/PaymentsAndAdjustmentsPage';
import { CreateBillPage } from '../pages/billing/CreateBillPage';
import { BillDetailsPage } from '../pages/billing/BillDetailsPage';
import { AgingSummaryPage } from '../pages/billing/AgingSummaryPage';

// Treatment Pages
import { TreatmentSessionsPage } from '../pages/treatments/TreatmentSessionsPage';
import { CmsClaimListPage } from '../pages/cms/CmsClaimListPage';
import { CmsPreviewPage } from '../pages/cms/CmsPreviewPage';

// Document Pages
import { DocumentListPage } from '../pages/documents/DocumentListPage';
import { PacketBuilderPage } from '../pages/documents/PacketBuilderPage';

// Admin & Settings Pages
import { StaffListPage } from '../pages/admin/StaffListPage';
import { ProviderListPage } from '../pages/admin/ProviderListPage';
import { ServicesPage } from '../pages/admin/ServicesPage';
import { AuditLogListPage } from '../pages/admin/AuditLogListPage';
import { ReportsPage } from '../pages/admin/ReportsPage';
import { GeneralSettingsPage } from '../pages/settings/GeneralSettingsPage';
import { SecuritySettingsPage } from '../pages/settings/SecuritySettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth & Patient Self-Booking Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/mfa-verify" element={<MfaVerifyPage />} />
      <Route path="/book" element={<PatientSelfBookingPage />} />
      <Route path="/patient-portal/book" element={<PatientSelfBookingPage />} />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <RoleGuard>
            <AppLayout />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="/dashboard/super-admin" replace />} />
        <Route path="403" element={<PermissionDeniedPage />} />

        {/* Dashboards */}
        <Route path="dashboard/super-admin" element={<SuperAdminDashboard />} />
        <Route path="dashboard/clinic-admin" element={<Navigate to="/dashboard/super-admin" replace />} />
        <Route path="dashboard/receptionist" element={<ReceptionistDashboard />} />
        <Route path="dashboard/doctor" element={<DoctorDashboard />} />
        <Route path="dashboard/therapist" element={<TherapistDashboard />} />
        <Route path="dashboard/counselor" element={<CounselorDashboard />} />
        <Route path="dashboard/billing-staff" element={<BillingStaffDashboard />} />

        {/* Patients & Cases */}
        <Route path="patients" element={<PatientListPage />} />
        <Route path="patients/new" element={<AddPatientPage />} />
        <Route path="patients/:id/profile" element={<PatientProfilePage />} />
        <Route path="cases" element={<CaseListPage />} />
        <Route path="cases/new" element={<AddCasePage />} />
        <Route path="cases/:id" element={<CaseDetailsPage />} />

        {/* Appointments */}
        <Route path="appointments/calendar" element={<CalendarPage />} />
        <Route path="appointments/new" element={<ScheduleAppointmentPage />} />
        <Route path="appointments/self-booking" element={<PatientSelfBookingPage />} />
        <Route path="appointments/checkin" element={<CheckInPage />} />
        <Route path="appointments/reminders" element={<ReminderStatusPage />} />

        {/* Clinical Documentation & AI Assistant */}
        <Route path="clinical-notes" element={<ClinicalNotesListPage />} />
        <Route path="clinical-notes/new" element={<ClinicalNoteEditorPage />} />
        <Route path="clinical-notes/ai-assistant" element={<AiAssistantPage />} />
        <Route path="clinical-notes/assessments" element={<AssessmentsAndFormsPage />} />
        <Route path="clinical-notes/josmic-pain" element={<JosmicPainFormPage />} />
        <Route path="clinical-notes/davs-eswt" element={<DavsEswtFormPage />} />
        <Route path="clinical-notes/anik-laser" element={<AnikLaserFormPage />} />
        <Route path="clinical-notes/counselor-session" element={<CounselorSessionPage />} />
        <Route path="clinical-notes/:id" element={<ClinicalNoteEditorPage />} />
        <Route path="clinical-notes/:id/edit" element={<ClinicalNoteEditorPage />} />

        {/* Treatments & Sessions */}
        <Route path="treatments" element={<TreatmentSessionsPage />} />

        {/* Billing & CMS-1500 */}
        <Route path="billing/overview" element={<BillingOverviewPage />} />
        <Route path="billing/provider-bills" element={<FourBillsPage />} />
        <Route path="billing/four-bills" element={<Navigate to="/billing/provider-bills" replace />} />
        <Route path="billing/six-bills" element={<Navigate to="/billing/provider-bills" replace />} />
        <Route path="billing/payments" element={<PaymentsAndAdjustmentsPage />} />
        <Route path="billing/create" element={<CreateBillPage />} />
        <Route path="billing/bills/:id" element={<BillDetailsPage />} />
        <Route path="billing/aging" element={<AgingSummaryPage />} />
        <Route path="cms-1500" element={<CmsClaimListPage />} />
        <Route path="cms-1500/:id/preview" element={<CmsPreviewPage />} />
        <Route path="cms/claims" element={<Navigate to="/cms-1500" replace />} />
        <Route path="cms/preview/:id" element={<CmsPreviewPage />} />

        {/* Documents & Packet Builder */}
        <Route path="documents" element={<DocumentListPage />} />
        <Route path="documents/packet-builder" element={<PacketBuilderPage />} />
        <Route path="documents/packets" element={<PacketBuilderPage />} />
        <Route path="documents/builder" element={<PacketBuilderPage />} />

        {/* Administration & Settings */}
        <Route path="admin/staff" element={<StaffListPage />} />
        <Route path="admin/providers" element={<ProviderListPage />} />
        <Route path="admin/services" element={<ServicesPage />} />
        <Route path="admin/audit-logs" element={<AuditLogListPage />} />
        <Route path="admin/reports" element={<ReportsPage />} />
        <Route path="settings/general" element={<GeneralSettingsPage />} />
        <Route path="settings/security" element={<SecuritySettingsPage />} />
      </Route>

      {/* Fallback wildcard */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
