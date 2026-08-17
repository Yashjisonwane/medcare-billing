import { prisma } from '../config/db.js';

/**
 * Helper to format a DB Appointment record matching the frontend schema
 */
const formatAppointment = (a) => {
  if (!a) return null;
  return {
    id: a.id,
    patientId: a.patientId,
    patientName: a.patient ? `${a.patient.firstName} ${a.patient.lastName}`.trim() : a.patientName || 'Unknown Patient',
    patientPhone: a.patient?.phone || a.patientPhone || '',
    patientEmail: a.patient?.email || a.patientEmail || '',
    patientDob: a.patient?.dob || a.patientDob || '',
    caseId: a.caseId,
    providerId: a.providerId,
    providerName: a.provider?.name || a.providerName || 'Unknown Provider',
    appointmentType: a.appointmentType,
    date: a.date,
    startTime: a.startTime,
    endTime: a.endTime,
    location: a.location,
    status: a.status,
    bookingRef: a.bookingRef,
    bookingChannel: a.bookingChannel,
    reminderStatus: a.reminderStatus,
    reminderPreference: a.reminderPreference,
    reasonForVisit: a.reasonForVisit,
    cptCode: a.cptCode,
    rescheduleReason: a.rescheduleReason || '',
    cancelReason: a.cancelReason || '',
    createdAt: a.createdAt
  };
};

/**
 * Get appointments list with optional filters (date, patientId, providerId)
 */
export const getAppointments = async (req, res) => {
  const { date, patientId, providerId } = req.query;

  try {
    const where = {};
    if (date) where.date = date;
    if (patientId) where.patientId = patientId;
    if (providerId) where.providerId = providerId;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            dob: true
          }
        },
        provider: {
          select: {
            name: true
          }
        }
      },
      orderBy: { appointmentDate: 'asc' }
    });

    return res.status(200).json(appointments.map(formatAppointment));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ error: 'Internal server error fetching appointments.' });
  }
};

/**
 * Create/schedule new appointment
 */
export const createAppointment = async (req, res) => {
  const data = req.body;

  if (!data.patientId || !data.providerId || !data.date || !data.startTime) {
    return res.status(400).json({ error: 'patientId, providerId, date, and startTime are required.' });
  }

  const generatedId = `apt-${Date.now()}`;

  try {
    const newApt = await prisma.appointment.create({
      data: {
        id: generatedId,
        patientId: data.patientId,
        caseId: data.caseId || null,
        providerId: data.providerId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime || '09:30 AM',
        status: 'SCHEDULED',
        bookingChannel: data.bookingChannel || 'Clinic Staff Portal',
        reminderStatus: 'Sent - SMS Queued',
        reminderPreference: data.reminderPreference || 'SMS',
        reasonForVisit: data.reasonForVisit || '',
        appointmentType: data.appointmentType || 'Consultation',
        cptCode: data.cptCode || '99204',
        location: data.location || 'Suite 774'
      },
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        },
        provider: {
          select: { name: true }
        }
      }
    });

    return res.status(201).json(formatAppointment(newApt));
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({ error: 'Failed to schedule appointment.' });
  }
};

/**
 * Get available slots for a provider on a date
 */
export const getAvailableSlots = async (req, res) => {
  const { providerId, date } = req.query;

  if (!providerId || !date) {
    return res.status(400).json({ error: 'providerId and date are required.' });
  }

  try {
    // 1. Check if weekend (local timezone check based on split)
    const dateObj = new Date(`${date}T00:00:00`);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
      return res.status(200).json({
        isClosed: true,
        isWeekend: true,
        isHoliday: false,
        reason: 'Clinic closed on weekends',
        slots: []
      });
    }

    // 2. Fetch existing appointments for date
    const bookedApts = await prisma.appointment.findMany({
      where: {
        providerId,
        date,
        status: { not: 'CANCELLED' }
      },
      select: { startTime: true }
    });

    const bookedTimes = bookedApts.map(a => a.startTime);

    const defaultTimeSlots = [
      '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
      '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
    ];

    const slots = defaultTimeSlots.map(time => ({
      time,
      available: !bookedTimes.includes(time)
    }));

    return res.status(200).json({
      isClosed: false,
      isWeekend: false,
      isHoliday: false,
      slots
    });
  } catch (error) {
    console.error('Error calculating available slots:', error);
    return res.status(500).json({ error: 'Failed to retrieve available slots.' });
  }
};

/**
 * Auto-book from patient self-service portal
 */
export const autoBookAppointment = async (req, res) => {
  const data = req.body;

  if (!data.patientName || !data.patientPhone || !data.date || !data.time) {
    return res.status(400).json({ error: 'patientName, patientPhone, date, and time are required.' });
  }

  try {
    // Split firstName and lastName
    const nameParts = data.patientName.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Portal';
    const lastName = nameParts.slice(1).join(' ') || 'Patient';

    // 1. Find or create a mock/placeholder patient in the database to link to
    let patient = await prisma.patient.findFirst({
      where: {
        phone: data.patientPhone
      }
    });

    if (!patient) {
      const newPatientId = `pat-self-${Date.now()}`;
      const mockMrn = `${Math.floor(100000000 + Math.random() * 900000000)}`;
      patient = await prisma.patient.create({
        data: {
          id: newPatientId,
          patientId: mockMrn,
          firstName,
          lastName,
          phone: data.patientPhone,
          email: data.patientEmail || '',
          dob: data.patientDob || '',
          sex: 'M',
          status: 'ACTIVE',
          assignedProviderIds: [data.providerId || 'prov-josmic'],
          createdAt: new Date().toISOString().split('T')[0]
        }
      });
    }

    const generatedId = `apt-auto-${Date.now()}`;
    const bookingRef = `SELF-${Math.floor(100000 + Math.random() * 900000)}`;

    const newApt = await prisma.appointment.create({
      data: {
        id: generatedId,
        patientId: patient.id,
        providerId: data.providerId || 'prov-josmic',
        date: data.date,
        startTime: data.time,
        endTime: data.endTime || '09:30 AM',
        status: 'SCHEDULED',
        bookingRef,
        bookingChannel: 'Patient Online Self-Booking Portal',
        reminderStatus: 'Automated SMS/Email Queued',
        reminderPreference: 'SMS',
        reasonForVisit: data.reasonForVisit || 'Patient Self-Scheduled Visit',
        appointmentType: data.appointmentType || 'Consultation',
        cptCode: data.cptCode || '99204',
        location: 'Suite 774 - Main Clinic'
      },
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        },
        provider: {
          select: { name: true }
        }
      }
    });

    return res.status(201).json(formatAppointment(newApt));
  } catch (error) {
    console.error('Error in portal self booking:', error);
    return res.status(500).json({ error: 'Failed to process self-booking.' });
  }
};

/**
 * Update appointment status (CHECKED_IN, CANCELLED, etc.)
 */
export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        provider: { select: { name: true } }
      }
    });

    return res.status(200).json(formatAppointment(updated));
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ error: 'Failed to update visit status.' });
  }
};

/**
 * Reschedule appointment
 */
export const reschedule = async (req, res) => {
  const { id } = req.params;
  const { date, startTime, endTime, reason } = req.body;

  try {
    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        date,
        startTime,
        endTime,
        rescheduleReason: reason,
        status: 'RESCHEDULED'
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        provider: { select: { name: true } }
      }
    });

    return res.status(200).json(formatAppointment(updated));
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    return res.status(500).json({ error: 'Failed to reschedule appointment.' });
  }
};

/**
 * Cancel appointment
 */
export const cancel = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelReason: reason
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        provider: { select: { name: true } }
      }
    });

    return res.status(200).json(formatAppointment(updated));
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return res.status(500).json({ error: 'Failed to cancel appointment.' });
  }
};

/**
 * General update details (CPT lines etc.)
 */
export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        reasonForVisit: updateData.reasonForVisit,
        location: updateData.location,
        appointmentType: updateData.appointmentType,
        cptCode: updateData.cptCode,
        status: updateData.status
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        provider: { select: { name: true } }
      }
    });

    return res.status(200).json(formatAppointment(updated));
  } catch (error) {
    console.error('Error updating appointment metadata:', error);
    return res.status(500).json({ error: 'Failed to update appointment.' });
  }
};
