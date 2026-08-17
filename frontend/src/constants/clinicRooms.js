// src/constants/clinicRooms.js

export const DEFAULT_CLINIC_ROOMS = [
  // JOSMIC Wellness Center
  { id: 'rm-josmic-1', providerId: 'prov-josmic', providerName: 'JOSMIC Wellness Center', name: 'Exam Room 1 (Main Consult)', suite: 'Suite 774' },
  { id: 'rm-josmic-2', providerId: 'prov-josmic', providerName: 'JOSMIC Wellness Center', name: 'Exam Room 2 (Spine & Joint)', suite: 'Suite 774' },
  { id: 'rm-josmic-3', providerId: 'prov-josmic', providerName: 'JOSMIC Wellness Center', name: 'Procedure Suite A (Injections)', suite: 'Suite 774' },

  // DAV'S Anatomy
  { id: 'rm-davs-1', providerId: 'prov-davs', providerName: "DAV'S Anatomy", name: 'Shockwave ESWT Bay 1', suite: 'Suite 320' },
  { id: 'rm-davs-2', providerId: 'prov-davs', providerName: "DAV'S Anatomy", name: 'Shockwave ESWT Bay 2', suite: 'Suite 320' },
  { id: 'rm-davs-3', providerId: 'prov-davs', providerName: "DAV'S Anatomy", name: 'Musculoskeletal Therapy Bay', suite: 'Suite 320' },

  // ANIK Laser Therapy
  { id: 'rm-anik-1', providerId: 'prov-anik', providerName: 'ANIK Laser Therapy', name: 'Laser Therapy Suite 1 (HILT)', suite: 'Suite 274' },
  { id: 'rm-anik-2', providerId: 'prov-anik', providerName: 'ANIK Laser Therapy', name: 'Laser Therapy Suite 2 (Deep Tissue)', suite: 'Suite 274' },
  { id: 'rm-anik-3', providerId: 'prov-anik', providerName: 'ANIK Laser Therapy', name: 'Rehabilitation & Modality Room', suite: 'Suite 274' },

  // Counselor Practice
  { id: 'rm-coun-1', providerId: 'prov-counselor', providerName: 'Counselor Practice', name: 'Counseling Room 101 (Private)', suite: 'Suite 104' },
  { id: 'rm-coun-2', providerId: 'prov-counselor', providerName: 'Counselor Practice', name: 'Psychotherapy Suite 102 (Trauma/PTSD)', suite: 'Suite 104' },
  { id: 'rm-coun-3', providerId: 'prov-counselor', providerName: 'Counselor Practice', name: 'Telehealth Consultation Bay', suite: 'Suite 104' },

  // General Clinic Triage
  { id: 'rm-gen-1', providerId: 'GENERAL', providerName: 'General Clinic', name: 'Triage & Vital Intake Bay', suite: 'Suite 774' },
];

const STORAGE_KEY = 'medpractice_clinic_rooms_v1';

export const getDynamicClinicRooms = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_CLINIC_ROOMS;
};

export const saveDynamicClinicRooms = (rooms) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  } catch {}
};

export const addCustomClinicRoom = (roomName, suite = 'Main Clinic', providerId = 'GENERAL', providerName = 'General Clinic') => {
  const current = getDynamicClinicRooms();
  const newRoom = {
    id: `rm-custom-${Date.now()}`,
    providerId,
    providerName,
    name: roomName,
    suite
  };
  const updated = [...current, newRoom];
  saveDynamicClinicRooms(updated);
  return newRoom;
};
