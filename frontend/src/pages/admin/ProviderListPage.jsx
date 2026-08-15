// src/pages/admin/ProviderListPage.jsx
import React, { useState, useEffect } from 'react';
import { mockProviderService } from '../../services/mock/mockProviderService';
import { maskTaxId, maskNpi } from '../../utils/formatters';
import { Shield, Eye, EyeOff, AlertTriangle, Edit3, Plus, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const ProviderListPage = () => {
  const [providers, setProviders] = useState({});
  const [showSensitive, setShowSensitive] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { addToast } = useUIStore();

  // Form states for adding provider
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [street, setStreet] = useState('');
  const [suite, setSuite] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('TX');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taxId, setTaxId] = useState('');
  const [npi, setNpi] = useState('');
  const [renderingName, setRenderingName] = useState('');
  const [renderingCredentials, setRenderingCredentials] = useState('');

  const loadProviders = () => {
    mockProviderService.getProviders().then(setProviders);
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const toggleShowSensitive = (provId) => {
    setShowSensitive(prev => ({ ...prev, [provId]: !prev[provId] }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !taxId.trim() || !npi.trim()) {
      addToast('Please fill out the required fields.', 'error');
      return;
    }
    const payload = {
      name,
      businessName,
      serviceCategory,
      street,
      suite,
      city,
      state,
      zipCode,
      phone,
      email,
      taxId,
      npi,
      renderingName,
      renderingCredentials
    };
    try {
      await mockProviderService.addProvider(payload);
      addToast('New provider configured successfully!', 'success');
      setIsAddModalOpen(false);
      
      // Reset form
      setName('');
      setBusinessName('');
      setServiceCategory('');
      setStreet('');
      setSuite('');
      setCity('');
      setZipCode('');
      setPhone('');
      setEmail('');
      setTaxId('');
      setNpi('');
      setRenderingName('');
      setRenderingCredentials('');
      
      // Reload
      loadProviders();
    } catch (err) {
      addToast('Failed to add provider', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Provider Profiles & Billing Configurations</h1>
          <p className="text-xs text-slate-500">Legal entity identities, Tax IDs, NPI registrations & service categories</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-1.5 self-start sm:self-auto border border-teal-500 transition"
        >
          <Plus className="w-4 h-4" /> Add New Provider
        </button>
      </div>

      <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-900 flex items-start gap-3">
        <Shield className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Provider Identifier Security Notice</p>
          <p className="text-[11px] text-teal-800">
            Provider Tax IDs & NPI numbers are sensitive identifiers restricted to authorized Provider Settings. They are masked by default across all screens and cards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(providers).map((prov) => {
          const isVisible = showSensitive[prov.id];
          const isCounselor = prov.id === 'prov-counselor';

          return (
            <div key={prov.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between medical-card-hover">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">{prov.serviceCategory}</span>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                    prov.isPlaceholder ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}>
                    {prov.isPlaceholder ? 'Configuration Pending' : 'Active'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{prov.name}</h3>

                {/* Masked Identifiers */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Federal Tax ID (EIN):</span>
                    <span className="font-mono font-bold text-slate-900">{maskTaxId(prov.identifiers?.taxId || 'XX-XXXXXXX', isVisible)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Rendering NPI:</span>
                    <span className="font-mono font-bold text-slate-900">{maskNpi(prov.identifiers?.npi || 'XXXXXXXXXX', isVisible)}</span>
                  </div>
                </div>

                {isCounselor && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <p className="font-bold text-amber-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Pending Client Setup Items:
                    </p>
                    <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-700">
                      <li>Awaiting Client Details</li>
                      <li>Billing Configuration Pending</li>
                      <li>Services and Prices Pending</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => toggleShowSensitive(prov.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-teal-600 cursor-pointer"
                >
                  {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {isVisible ? 'Hide Identifiers' : 'Show Masked Identifiers'}
                </button>

                <button
                  type="button"
                  onClick={() => addToast(`Editing provider ${prov.name} (Demo)`, 'info')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔴 ADD NEW PROVIDER DIALOG MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-teal-600" /> Configure New Practice Provider
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Provider/Facility Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. HOPE Behavioral Health"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Corporate Business Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Hope Behavioral Health LLC"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Service Specialty Category</label>
                <input
                  type="text"
                  placeholder="e.g. Counseling & Mental Health, Acupuncture"
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-3">
                <h3 className="text-xs font-bold text-slate-700 mb-2">Facility Contact Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Street Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 10101 Harwin Dr."
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Suite/Room</label>
                    <input
                      type="text"
                      placeholder="e.g. Suite 774-C"
                      value={suite}
                      onChange={(e) => setSuite(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City</label>
                    <input
                      type="text"
                      placeholder="Houston"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">State</label>
                    <input
                      type="text"
                      placeholder="TX"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Zip Code</label>
                    <input
                      type="text"
                      placeholder="77036"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="713-555-0188"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="contact@hope.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <h3 className="text-xs font-bold text-slate-700 mb-2">Identifiers & Rendering Practitioner</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Federal Tax ID (EIN) *</label>
                    <input
                      type="text"
                      placeholder="e.g. 84-7891234"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rendering NPI *</label>
                    <input
                      type="text"
                      placeholder="e.g. 1487965213"
                      value={npi}
                      onChange={(e) => setNpi(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rendering Provider Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Jordan Miller"
                      value={renderingName}
                      onChange={(e) => setRenderingName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Practitioner Credentials</label>
                    <input
                      type="text"
                      placeholder="e.g. LCSW, BCD"
                      value={renderingCredentials}
                      onChange={(e) => setRenderingCredentials(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
