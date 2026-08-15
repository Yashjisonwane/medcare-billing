// src/services/mock/mockProviderService.js
import { INITIAL_PROVIDER_CONFIGS } from '../../constants/providerConfigs';

const STORAGE_KEY = 'medpractice_providers';

const getStoredProviders = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROVIDER_CONFIGS));
    return INITIAL_PROVIDER_CONFIGS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_PROVIDER_CONFIGS;
  }
};

export const mockProviderService = {
  async getProviders() {
    await new Promise(res => setTimeout(res, 150));
    return getStoredProviders();
  },

  async addProvider(providerData) {
    await new Promise(res => setTimeout(res, 250));
    const providers = getStoredProviders();
    const newId = `prov-${Date.now()}`;
    const newProvider = {
      id: newId,
      name: providerData.name,
      businessName: providerData.businessName || `${providerData.name} LLC`,
      serviceCategory: providerData.serviceCategory || 'Specialized Modality',
      status: 'ACTIVE',
      isPlaceholder: false,
      address: {
        street: providerData.street || '10101 Harwin Dr.',
        suite: providerData.suite || 'Suite 100',
        city: providerData.city || 'Houston',
        state: providerData.state || 'TX',
        zipCode: providerData.zipCode || '77036'
      },
      contact: {
        phone: providerData.phone || '713-555-0100',
        fax: providerData.fax || '832-555-0199',
        email: providerData.email || 'info@provider.test'
      },
      identifiers: {
        taxId: providerData.taxId || '99-0000000',
        npi: providerData.npi || '1000000000',
        ssnOrEin: 'EIN'
      },
      renderingProvider: {
        name: providerData.renderingName || 'Provider Practitioner',
        credentials: providerData.renderingCredentials || 'MD',
        npi: providerData.npi || '1000000000'
      },
      availableServices: [],
      availableDiagnoses: [],
      providerServices: []
    };
    providers[newId] = newProvider;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
    
    // Dispatch a custom event so TopHeader and other components know providers updated
    window.dispatchEvent(new Event('providers-updated'));
    
    return newProvider;
  },

  async updateProvider(id, providerData) {
    await new Promise(res => setTimeout(res, 200));
    const providers = getStoredProviders();
    if (providers[id]) {
      providers[id] = {
        ...providers[id],
        ...providerData,
        address: {
          ...providers[id].address,
          ...providerData.address
        },
        contact: {
          ...providers[id].contact,
          ...providerData.contact
        },
        identifiers: {
          ...providers[id].identifiers,
          ...providerData.identifiers
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
      window.dispatchEvent(new Event('providers-updated'));
      return providers[id];
    }
    throw new Error('Provider not found');
  }
};
