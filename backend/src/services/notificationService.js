// backend/src/services/notificationService.js
import nodemailer from 'nodemailer';
import { prisma } from '../config/db.js';
import { logger } from '../config/logger.js';

/**
 * Creates Nodemailer Transporter if SMTP credentials exist in .env
 */
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';

  if (!host || !user || !pass) {
    return null; // Not configured yet
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
};

/**
 * Generic email dispatcher with auto-fallback to audit logging
 */
export const dispatchEmail = async ({ to, subject, html, text, eventType = 'GENERAL_NOTIFICATION', metadata = {} }) => {
  const from = process.env.SMTP_FROM || '"F&M Health & Wellness" <no-reply@medcarepractice.com>';
  const transporter = getTransporter();

  const timestamp = new Date();

  // If live SMTP is configured in .env, send real email!
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text: text || html.replace(/<[^>]*>?/gm, ''),
        html
      });

      logger.info(`[Email Dispatcher] Live email sent to ${to} for event ${eventType} - MessageId: ${info.messageId}`);

      // Log to database
      try {
        await prisma.reminderLog.create({
          data: {
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            patientId: metadata.patientId || 'system',
            patientName: metadata.patientName || to,
            phone: metadata.phone || '',
            type: 'EMAIL',
            channel: 'EMAIL',
            status: 'DELIVERED',
            message: subject,
            scheduledFor: timestamp,
            sentAt: timestamp
          }
        });
      } catch (dbErr) {}

      return {
        success: true,
        mode: 'LIVE_SMTP',
        messageId: info.messageId,
        recipient: to,
        timestamp
      };
    } catch (err) {
      logger.error(`[Email Dispatcher] Failed to send live email via SMTP: ${err.message}`);
      return {
        success: false,
        mode: 'LIVE_SMTP_FAILED',
        error: err.message,
        recipient: to
      };
    }
  }

  // Fallback mode (Plug & Play - Ready for API Key)
  logger.info(`[Email Dispatcher (Ready)] Event: ${eventType} -> Destination: ${to} | Subject: "${subject}" (SMTP key pending in .env)`);

  try {
    await prisma.reminderLog.create({
      data: {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        patientId: metadata.patientId || 'system',
        patientName: metadata.patientName || to,
        phone: metadata.phone || '',
        type: 'EMAIL',
        channel: 'EMAIL',
        status: 'QUEUED_READY',
        message: `${subject} (Plug & Play Ready)`,
        scheduledFor: timestamp,
        sentAt: timestamp
      }
    });
  } catch (dbErr) {}

  return {
    success: true,
    mode: 'QUEUED_READY',
    notice: 'Notification prepared and logged. Add SMTP credentials to .env to deliver real-time inbox emails.',
    recipient: to,
    subject,
    timestamp
  };
};

/**
 * 1. Appointment Reminder Email Template (24h Before)
 */
export const sendAppointmentReminderEmail = async ({ patientName, patientEmail, doctorName, appointmentDate, appointmentTime, serviceType }) => {
  const subject = `Appointment Reminder: Your upcoming visit with ${doctorName || 'F&M Health & Wellness'}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="background-color: #0f766e; padding: 16px; border-radius: 8px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px; font-weight: bold;">F&M Health & Wellness Center</h2>
        <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">10101 Harwin Dr., Houston, TX 77036 · 713-485-5700</p>
      </div>

      <div style="padding: 24px 8px;">
        <h3 style="color: #0f172a; margin-top: 0;">Upcoming Appointment Reminder</h3>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">Hello <strong>${patientName}</strong>,</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">This is a friendly reminder of your upcoming medical appointment:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0f766e; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Date:</strong> ${appointmentDate}</p>
          <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Time:</strong> ${appointmentTime}</p>
          <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Provider:</strong> ${doctorName || 'Attending Physician'}</p>
          <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Service:</strong> ${serviceType || 'Comprehensive Evaluation'}</p>
          <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Location:</strong> 10101 Harwin Dr., Houston, TX 77036</p>
        </div>

        <p style="color: #64748b; font-size: 12px;">If you need to reschedule or have any questions, please reply to this email or call our front desk at (713) 485-5700.</p>
      </div>
    </div>
  `;

  return dispatchEmail({
    to: patientEmail,
    subject,
    html,
    eventType: 'APPOINTMENT_REMINDER',
    metadata: { patientName }
  });
};

/**
 * 2. Appointment Booking Confirmation Email
 */
export const sendBookingConfirmationEmail = async ({ patientName, patientEmail, doctorName, appointmentDate, appointmentTime }) => {
  const subject = `Booking Confirmed: F&M Health & Wellness Appointment`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="background-color: #0f766e; padding: 16px; border-radius: 8px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">F&M Health & Wellness</h2>
        <p style="margin: 4px 0 0; font-size: 12px;">Appointment Confirmation</p>
      </div>
      <div style="padding: 20px 8px; color: #334155; font-size: 14px;">
        <p>Dear <strong>${patientName}</strong>,</p>
        <p>Your appointment has been successfully scheduled and confirmed:</p>
        <div style="background: #f1f5f9; padding: 14px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${appointmentDate} at ${appointmentTime}</p>
          <p style="margin: 4px 0;"><strong>Attending Clinician:</strong> ${doctorName}</p>
        </div>
        <p style="font-size: 12px; color: #64748b;">Please arrive 10 minutes early with your photo ID.</p>
      </div>
    </div>
  `;

  return dispatchEmail({
    to: patientEmail,
    subject,
    html,
    eventType: 'BOOKING_CONFIRMATION',
    metadata: { patientName }
  });
};

/**
 * 3. New Patient Welcome Email
 */
export const sendNewPatientWelcomeEmail = async ({ patientName, patientEmail, mrn }) => {
  const subject = `Welcome to F&M Health & Wellness Center`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="background-color: #0f766e; padding: 16px; border-radius: 8px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">Welcome to F&M Health & Wellness</h2>
      </div>
      <div style="padding: 20px 8px; color: #334155; font-size: 14px;">
        <p>Dear <strong>${patientName}</strong>,</p>
        <p>Thank you for choosing F&M Health & Wellness Center for your personalized care and recovery.</p>
        <p><strong>Your Medical Record Number (MRN):</strong> ${mrn || 'Assigned in Clinic'}</p>
        <p>Our team of multidisciplinary specialists is committed to your complete physical rehabilitation.</p>
      </div>
    </div>
  `;

  return dispatchEmail({
    to: patientEmail,
    subject,
    html,
    eventType: 'NEW_PATIENT_WELCOME',
    metadata: { patientName }
  });
};

/**
 * 4. Billing Payment Notification (To Staff / Patient)
 */
export const sendPaymentPostedNotification = async ({ staffEmail, patientName, statementNumber, amountPaid, paymentMethod, remainingBalance }) => {
  const subject = `Payment Notification: $${amountPaid} posted on Statement #${statementNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="background-color: #0284c7; padding: 16px; border-radius: 8px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">Payment Posted Alert</h2>
      </div>
      <div style="padding: 20px 8px; color: #334155; font-size: 14px;">
        <p>A new transaction has been posted:</p>
        <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px; border-radius: 4px; margin: 12px 0;">
          <p style="margin: 4px 0;"><strong>Patient:</strong> ${patientName}</p>
          <p style="margin: 4px 0;"><strong>Amount Paid:</strong> $${amountPaid}</p>
          <p style="margin: 4px 0;"><strong>Method:</strong> ${paymentMethod}</p>
          <p style="margin: 4px 0;"><strong>Remaining Balance:</strong> $${remainingBalance}</p>
        </div>
      </div>
    </div>
  `;

  return dispatchEmail({
    to: staffEmail || 'billing@medpracticepro.com',
    subject,
    html,
    eventType: 'BILLING_PAYMENT_NOTIFICATION'
  });
};

// Aliases for backward compatibility across controllers
export const sendAppointmentEmailNotification = sendAppointmentReminderEmail;
export const sendAppointmentEmail = sendAppointmentReminderEmail;
export default {
  dispatchEmail,
  sendAppointmentReminderEmail,
  sendAppointmentEmailNotification,
  sendAppointmentEmail,
  sendBookingConfirmationEmail,
  sendNewPatientWelcomeEmail,
  sendPaymentPostedNotification
};

