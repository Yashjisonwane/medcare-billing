// src/services/mock/mockAppointmentService.js
import { INITIAL_APPOINTMENTS } from './mockDataFixtures';
import { isUSFederalHoliday, isClinicClosed, getNextBusinessDay } from '../../constants/usHolidays';

const STORAGE_KEY = 'medpractice_appointments';

const getStoredAppointments = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
    return INITIAL_APPOINTMENTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_APPOINTMENTS;
  }
};

const saveAppointments = (apts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apts));
};

export const mockAppointmentService = {
  async getAppointments(filters = {}) {
    await new Promise(res => setTimeout(res, 200));
    let apts = getStoredAppointments();

    if (filters.patientId) {
      apts = apts.filter(a => a.patientId === filters.patientId);
    }
    if (filters.providerId) {
      apts = apts.filter(a => a.providerId === filters.providerId);
    }
    if (filters.date) {
      apts = apts.filter(a => a.date === filters.date);
    }

    return apts;
  },

  async createAppointment(aptData) {
    await new Promise(res => setTimeout(res, 300));
    const apts = getStoredAppointments();
    const newApt = {
      id: `apt-${Date.now()}`,
      status: 'SCHEDULED',
      reminderStatus: 'Sent - Demo',
      ...aptData
    };
    apts.unshift(newApt);
    saveAppointments(apts);
    return newApt;
  },

  async getAvailableSlots(providerId, dateStr) {
    await new Promise(res => setTimeout(res, 150));
    const closedCheck = isClinicClosed(dateStr);
    if (closedCheck.isClosed) {
      return { 
        isClosed: true, 
        isWeekend: closedCheck.isWeekend, 
        isHoliday: closedCheck.isHoliday, 
        reason: closedCheck.reason,
        holidayName: closedCheck.holidayName || '', 
        slots: [] 
      };
    }

    const defaultTimeSlots = [
      '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
      '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
    ];

    const apts = getStoredAppointments().filter(a => a.date === dateStr && a.status !== 'CANCELLED');
    const bookedTimes = apts.map(a => a.startTime);

    const slots = defaultTimeSlots.map(time => ({
      time,
      available: !bookedTimes.includes(time)
    }));

    return { isClosed: false, isWeekend: false, isHoliday: false, slots };
  },

  async autoBookAppointment(bookingData) {
    await new Promise(res => setTimeout(res, 350));
    const apts = getStoredAppointments();
    
    // Automatically roll to next business day if scheduled on closed weekend/holiday
    let bookingDate = bookingData.date;
    const closedCheck = isClinicClosed(bookingDate);
    if (closedCheck.isClosed) {
      bookingDate = getNextBusinessDay(bookingDate);
    }
    
    const bookingRef = `SELF-${Math.floor(100000 + Math.random() * 900000)}`;
    const newApt = {
      id: `apt-auto-${Date.now()}`,
      bookingRef,
      bookingChannel: 'Patient Online Self-Booking Portal',
      status: 'SCHEDULED',
      reminderStatus: 'Automated SMS/Email Queued',
      date: bookingDate,
      startTime: bookingData.time || '09:00 AM',
      endTime: bookingData.endTime || '09:30 AM',
      patientName: bookingData.patientName,
      patientPhone: bookingData.patientPhone,
      patientEmail: bookingData.patientEmail,
      patientDob: bookingData.patientDob,
      providerId: bookingData.providerId || 'prov-josmic',
      providerName: bookingData.providerName || 'JOSMIC Wellness Center',
      appointmentType: bookingData.appointmentType || 'Initial Pain Consultation',
      cptCode: bookingData.cptCode || '99204',
      reasonForVisit: bookingData.reasonForVisit || 'Patient Self-Scheduled Visit',
      location: 'Suite 774 - Main Clinic',
      createdAt: new Date().toISOString()
    };

    apts.unshift(newApt);
    saveAppointments(apts);
    return newApt;
  },

  async searchPatientBookings(queryStr) {
    await new Promise(res => setTimeout(res, 200));
    if (!queryStr || !queryStr.trim()) return [];
    const q = queryStr.trim().toLowerCase();
    const apts = getStoredAppointments();
    
    return apts.filter(a => {
      const matchPhone = a.patientPhone && a.patientPhone.replaceAll('-', '').includes(q.replaceAll('-', ''));
      const matchEmail = a.patientEmail && a.patientEmail.toLowerCase().includes(q);
      const matchRef = a.bookingRef && a.bookingRef.toLowerCase().includes(q);
      const matchName = a.patientName && a.patientName.toLowerCase().includes(q);
      return matchPhone || matchEmail || matchRef || matchName;
    });
  },

  async updateStatus(id, newStatus) {
    await new Promise(res => setTimeout(res, 150));
    const apts = getStoredAppointments();
    const index = apts.findIndex(a => a.id === id);
    if (index !== -1) {
      apts[index].status = newStatus;
      saveAppointments(apts);
      return apts[index];
    }
    throw new Error('Appointment not found');
  },

  async reschedule(id, newDate, newStartTime, newEndTime, reason) {
    await new Promise(res => setTimeout(res, 250));
    const apts = getStoredAppointments();
    const index = apts.findIndex(a => a.id === id);
    if (index !== -1) {
      apts[index].date = newDate;
      apts[index].startTime = newStartTime;
      apts[index].endTime = newEndTime;
      apts[index].rescheduleReason = reason;
      apts[index].status = 'RESCHEDULED';
      saveAppointments(apts);
      return apts[index];
    }
    throw new Error('Appointment not found');
  },

  async cancel(id, reason) {
    await new Promise(res => setTimeout(res, 200));
    const apts = getStoredAppointments();
    const index = apts.findIndex(a => a.id === id);
    if (index !== -1) {
      apts[index].status = 'CANCELLED';
      apts[index].cancelReason = reason;
      saveAppointments(apts);
      return apts[index];
    }
    throw new Error('Appointment not found');
  },

  async updateAppointment(id, updateData) {
    await new Promise(res => setTimeout(res, 250));
    const apts = getStoredAppointments();
    const index = apts.findIndex(a => a.id === id);
    if (index !== -1) {
      // Normalize serviceLines if provided
      const existing = apts[index];
      const updated = {
        ...existing,
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      // Keep cptCode string in sync with first service line or joined codes
      if (updated.serviceLines && updated.serviceLines.length > 0) {
        updated.cptCode = updated.serviceLines.map(l => l.cptCode).filter(Boolean).join(', ');
        updated.modifiers = updated.serviceLines
          .map(l => [l.modifier1, l.modifier2, l.modifier3, l.modifier4].filter(Boolean).join('-'))
          .filter(Boolean)
          .join(', ');
      }
      
      apts[index] = updated;
      saveAppointments(apts);
      return updated;
    }
    throw new Error('Appointment not found');
  }
};

