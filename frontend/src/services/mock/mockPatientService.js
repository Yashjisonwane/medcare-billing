const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';
const TOKEN_KEY = 'medpractice_auth_token';

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const mockPatientService = {
  async getPatients(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.providerId) params.append('providerId', filters.providerId);

    try {
      const res = await fetch(`${API_BASE}/patients?${params.toString()}`, {
        headers: getHeaders()
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve patients list.');
      }
      return await res.json();
    } catch (err) {
      console.warn('[mockPatientService] API fetch failed, checking local fixtures fallback:', err.message);
      // Fallback
      const localPts = JSON.parse(localStorage.getItem('medcare_patients_cache') || '[]');
      return localPts;
    }
  },

  async getPatientById(id) {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      throw new Error('Failed to retrieve patient profile details.');
    }
    return res.json();
  },

  async createPatient(patientData) {
    try {
      const res = await fetch(`${API_BASE}/patients`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(patientData)
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create patient profile.');
    } catch (error) {
      console.warn('[mockPatientService] Backend create error, fallback local storage:', error.message);
      // Fallback local patient creation if backend unavailable
      const newId = `pat-${Date.now()}`;
      const newMrn = `${Math.floor(100000000 + Math.random() * 900000000)}`;
      const newPatient = {
        id: newId,
        patientId: newMrn,
        firstName: patientData.firstName,
        middleName: patientData.middleName || '',
        lastName: patientData.lastName,
        dob: patientData.dob || '',
        sex: patientData.sex || 'M',
        phone: patientData.phone || '',
        email: patientData.email || '',
        ssn: patientData.ssn || '',
        address: patientData.address || {
          street: patientData.street || '',
          suite: patientData.suite || '',
          city: patientData.city || '',
          state: patientData.state || '',
          zipCode: patientData.zipCode || ''
        },
        communicationPref: patientData.communicationPref || 'SMS',
        consentStatus: patientData.consentStatus || 'SIGNED',
        assignedProviderIds: patientData.assignedProviderIds || ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor'],
        status: 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      const cached = JSON.parse(localStorage.getItem('medcare_patients_cache') || '[]');
      cached.unshift(newPatient);
      localStorage.setItem('medcare_patients_cache', JSON.stringify(cached));
      
      return newPatient;
    }
  },

  async updatePatient(id, updates) {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update patient profile.');
    }
    return res.json();
  }
};
