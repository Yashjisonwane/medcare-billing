import React, { useState, useEffect } from 'react';
import { Tag, X, Save, Edit3, Plus, Shield } from 'lucide-react';

export const ServicesPage = () => {
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('medcare_services');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingSvc, setViewingSvc] = useState(null);
  const [form, setForm] = useState({ cptCode: '', description: '', fee: '', type: 'Standard' });

  const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition';
  const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

  useEffect(() => {
    localStorage.setItem('medcare_services', JSON.stringify(services));
  }, [services]);

  const openAddModal = () => {
    setForm({ cptCode: '', description: '', fee: '', type: 'Standard' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (svc) => {
    setForm({
      cptCode: svc.cptCode,
      description: svc.description,
      fee: svc.fee,
      type: svc.type
    });
    setEditingId(svc.id);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setServices(services.map(s => s.id === editingId ? { ...form, id: editingId } : s));
    } else {
      const newService = {
        ...form,
        id: Date.now().toString()
      };
      setServices([...services, newService]);
    }
    setIsModalOpen(false);
    setForm({ cptCode: '', description: '', fee: '', type: 'Standard' });
    setEditingId(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Fee Schedules & CPT</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Manage service codes, standard rates, and payer-specific fee schedules.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Service / CPT
        </button>
      </div>
      
      {services.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
          <Tag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Service Catalog Configuration</h3>
          <p className="text-sm max-w-md mx-auto">This module allows configuration of CPT codes and associated fee schedules for the practice. Click "Add Service / CPT" to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-extrabold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">CPT Code</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Service Type</th>
                  <th className="p-3.5 text-right">Standard Fee</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">
                      {svc.cptCode}
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">
                      {svc.description}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-full font-bold text-[11px]">
                        {svc.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-700">
                      ${parseFloat(svc.fee || 0).toFixed(2)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-full text-[10px]">
                        Active
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => setViewingSvc(svc)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-bold transition cursor-pointer"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => openEditModal(svc)}
                          className="text-amber-600 hover:text-amber-800 text-xs font-bold transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setServices(services.filter(s => s.id !== svc.id))} 
                          className="text-red-600 hover:text-red-800 text-xs font-bold transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{editingId ? 'Edit Service / CPT' : 'Add New Service / CPT'}</h2>
                  <p className="text-[10px] text-slate-500">Register a new service code in the catalog</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-xl transition cursor-pointer">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className={labelCls}>CPT Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 99213"
                  value={form.cptCode}
                  onChange={e => setForm({ ...form, cptCode: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Office Visit, Established Patient"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Standard Fee ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={form.fee}
                    onChange={e => setForm({ ...form, fee: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Service Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className={inputCls}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Procedure">Procedure</option>
                    <option value="Evaluation">Evaluation</option>
                    <option value="Therapy">Therapy</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-xl flex items-center gap-2 shadow-md shadow-teal-500/20 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingSvc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">View Service Details</h2>
                </div>
              </div>
              <button onClick={() => setViewingSvc(null)} className="p-1.5 hover:bg-slate-200 rounded-xl transition cursor-pointer">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div>
                <span className="block text-xs font-bold text-slate-500 mb-1">CPT Code</span>
                <span className="font-medium text-slate-900">{viewingSvc.cptCode}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-500 mb-1">Description</span>
                <span className="font-medium text-slate-900">{viewingSvc.description}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-slate-500 mb-1">Standard Fee</span>
                  <span className="font-medium text-slate-900">${parseFloat(viewingSvc.fee || 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 mb-1">Service Type</span>
                  <span className="font-medium text-slate-900">{viewingSvc.type}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setViewingSvc(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
