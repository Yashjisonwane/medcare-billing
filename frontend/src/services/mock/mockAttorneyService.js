// frontend/src/services/mock/mockAttorneyService.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/v1';

const FALLBACK_ATTORNEYS = [
  {
    id: 'atty-1',
    name: 'OJ Lawal, Esq.',
    firm: 'OJ Law Firm & Associates LLC',
    phone: '713-555-0188',
    email: 'attorney@ojlawfirm.com',
    address: '11711 Bedford St. Suite 01, Houston TX 77031',
    caseManager: 'Maria Gonzalez (713-555-0300)',
    lienAgreementType: 'LETTER_OF_PROTECTION',
    status: 'ACTIVE'
  },
  {
    id: 'atty-2',
    name: 'Marcus Vance, Esq.',
    firm: 'Law Offices of Marcus Vance',
    phone: '713-555-0219',
    email: 'mvance@vancelaw.com',
    address: '2400 Richmond Ave Suite 300, Houston TX 77098',
    caseManager: 'David Chen (713-555-0220)',
    lienAgreementType: 'LETTER_OF_PROTECTION',
    status: 'ACTIVE'
  },
  {
    id: 'atty-3',
    name: 'Robert Cole, Attorney',
    firm: 'Cole & Partners Injury Law',
    phone: '713-555-0442',
    email: 'rcole@colelaw.com',
    address: '5000 Westheimer Rd Suite 450, Houston TX 77056',
    caseManager: 'Jessica Taylor (713-555-0443)',
    lienAgreementType: 'LETTER_OF_PROTECTION',
    status: 'ACTIVE'
  },
  {
    id: 'atty-4',
    name: 'Sarah Jenkins, Esq.',
    firm: 'Davis & Associates Injury Law Group',
    phone: '713-555-0300',
    email: 'sjenkins@davisinjury.com',
    address: '1001 Fannin St Suite 1200, Houston TX 77002',
    caseManager: 'Carlos Ramos (713-555-0301)',
    lienAgreementType: 'LETTER_OF_PROTECTION',
    status: 'ACTIVE'
  }
];

export const mockAttorneyService = {
  async getAttorneys(search = '') {
    try {
      const url = search ? `${API_BASE}/attorneys?search=${encodeURIComponent(search)}` : `${API_BASE}/attorneys`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return FALLBACK_ATTORNEYS;
    }
  },

  async createAttorney(data) {
    try {
      const res = await fetch(`${API_BASE}/attorneys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to register attorney.');
      }
      return await res.json();
    } catch (e) {
      const newObj = {
        id: `atty-${Date.now()}`,
        ...data,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      FALLBACK_ATTORNEYS.unshift(newObj);
      return newObj;
    }
  }
};
