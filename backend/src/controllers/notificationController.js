// backend/src/controllers/notificationController.js
import {
  dispatchEmail,
  sendAppointmentReminderEmail,
  sendBookingConfirmationEmail,
  sendNewPatientWelcomeEmail,
  sendPaymentPostedNotification
} from '../services/notificationService.js';
import { prisma } from '../config/db.js';

/**
 * Send a test email to verify SMTP configuration
 */
export const testEmailDispatch = async (req, res) => {
  const { recipientEmail, eventType } = req.body;

  const targetEmail = recipientEmail || 'test@medpracticepro.com';

  try {
    let result;

    if (eventType === 'APPOINTMENT_REMINDER') {
      result = await sendAppointmentReminderEmail({
        patientName: 'Test Patient (Yash)',
        patientEmail: targetEmail,
        doctorName: 'Dr. Segun Adeoye (Attending Physician)',
        appointmentDate: new Date().toLocaleDateString(),
        appointmentTime: '10:30 AM',
        serviceType: 'Initial Comprehensive Pain Evaluation'
      });
    } else if (eventType === 'NEW_PATIENT_WELCOME') {
      result = await sendNewPatientWelcomeEmail({
        patientName: 'Test Patient (Yash)',
        patientEmail: targetEmail,
        mrn: 'MRN-2026-9988'
      });
    } else {
      result = await dispatchEmail({
        to: targetEmail,
        subject: 'F&M Health & Wellness — Email System Connectivity Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #cbd5e1; border-radius: 8px;">
            <h2 style="color: #0f766e; margin-top: 0;">✅ Email Connectivity Test Successful</h2>
            <p>Your MedCare Billing &amp; Clinical notification engine is fully connected and operational!</p>
            <p style="font-size: 12px; color: #64748b;">Timestamp: ${new Date().toISOString()}</p>
          </div>
        `,
        eventType: 'CONNECTIVITY_TEST'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email dispatch test processed successfully',
      result
    });
  } catch (error) {
    console.error('Error in testEmailDispatch:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process email test dispatch',
      details: error.message
    });
  }
};

/**
 * Get notification logs
 */
export const getNotificationLogs = async (req, res) => {
  try {
    const logs = await prisma.reminderLog.findMany({
      orderBy: { sentAt: 'desc' },
      take: 50
    });
    return res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching notification logs:', error);
    return res.status(500).json({ error: 'Failed to fetch notification logs.' });
  }
};
