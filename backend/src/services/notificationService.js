// backend/src/services/notificationService.js
import nodemailer from 'nodemailer';

/**
 * Production-Ready Safe Email Notification Engine
 * - Connects to real SMTP (Gmail, SendGrid, Resend, Brevo, AWS SES) when credentials are provided in .env
 * - Non-blocking asynchronous dispatch with timeout protection to prevent key blocking & server stalls
 * - Graceful fallback logging when offline or credentials pending
 */

// Initialize SMTP Transporter
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) {
    return null; // SMTP credentials not yet provided in .env
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 5000, // 5s timeout to prevent hanging
    greetingTimeout: 5000,
    socketTimeout: 8000
  });
};

/**
 * Send Appointment Confirmation Email to Patient
 */
export const sendAppointmentEmailNotification = async ({
  toEmail,
  patientName,
  bookingRef,
  date,
  time,
  providerName,
  location = 'Suite 774 - Main Clinic',
  appointmentType = 'Medical Consultation & Evaluation'
}) => {
  if (!toEmail || !toEmail.includes('@')) {
    console.warn('⚠️ [EMAIL NOTIFICATION] Skipped: Invalid patient email address.');
    return { success: false, reason: 'Invalid email' };
  }

  const transporter = createTransporter();

  const fromAddress = process.env.SMTP_FROM || `"F&M Health & Wellness" <${process.env.SMTP_USER || 'no-reply@medcarepractice.com'}>`;
  const subject = `Appointment Confirmed [${bookingRef}] — F&M Health & Wellness`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #0f766e 0%, #115e59 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">F&M Health & Wellness</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #ccfbf1;">Medical Practice & Specialized Care Center</p>
      </div>

      <!-- Content Body -->
      <div style="padding: 28px 24px; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 4px 12px; rounded-full; border-radius: 9999px; border: 1px solid #bbf7d0;">
            ✓ BOOKING CONFIRMED
          </span>
          <h2 style="margin: 10px 0 4px 0; font-size: 18px; font-weight: 700; color: #0f172a;">Your Visit is Scheduled!</h2>
          <p style="margin: 0; font-size: 13px; color: #64748b;">Dear <strong>${patientName}</strong>, your appointment details are below:</p>
        </div>

        <!-- Appointment Card -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Booking Reference:</td>
              <td style="padding: 8px 0; font-weight: 800; color: #0f766e; text-align: right; font-family: monospace; font-size: 14px;">${bookingRef}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Attending Practice:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #0f172a; text-align: right;">${providerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Service / Visit Type:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #334155; text-align: right;">${appointmentType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Date & Time:</td>
              <td style="padding: 8px 0; font-weight: 800; color: #0f172a; text-align: right;">${date} at ${time}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Clinic Location:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #334155; text-align: right;">${location}</td>
            </tr>
          </table>
        </div>

        <!-- Instructions -->
        <div style="background-color: #f0fdfa; border-left: 4px solid #0f766e; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px; font-size: 12px; color: #134e4a;">
          <strong>Important Instructions:</strong> Please arrive 10 minutes prior to your scheduled time with your photo ID, insurance/claim information, and police accident report if applicable.
        </div>

        <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
          Need to reschedule or have questions? Please call our reception at <strong>(713) 555-0100</strong>.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
        © 2026 F&M Health & Wellness Center LLC. All rights reserved. HIPAA Protected Health Information.
      </div>
    </div>
  `;

  // If live SMTP configured, dispatch real email
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        subject,
        html: htmlContent
      });
      console.log(`🚀 [LIVE SMTP EMAIL DELIVERED] MessageId: ${info.messageId} | Recipient: ${toEmail} | Ref: ${bookingRef}`);
      return { success: true, messageId: info.messageId, live: true };
    } catch (smtpError) {
      console.error('⚠️ [SMTP SEND ERROR - Safe Fallback]:', smtpError.message);
      return { success: false, error: smtpError.message, live: false };
    }
  } else {
    // Graceful simulation log when credentials are not yet entered in .env
    console.log(`📬 [SIMULATED EMAIL LOGGED] To: ${toEmail} | Ref: ${bookingRef} | Status: Ready for Live SMTP Credentials in .env`);
    return { success: true, live: false, simulated: true };
  }
};
