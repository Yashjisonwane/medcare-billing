// src/pages/admin/StaffListPage.jsx
import React, { useEffect, useState } from 'react';
import { mockStaffService } from '../../services/mock/mockStaffService';
import { Shield, PlusCircle, User, Plus, X, Save, Mail, UserCheck } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

export const StaffListPage = () => {
  const [staff, setStaff] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addToast } = useUIStore();

  const [form, setForm] = useState({
    name: '',
    role: 'Billing Staff',
    title: 'Billing Specialist',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
  });

  const loadStaff = () => {
    mockStaffService.getStaff().then(setStaff).catch(err => {
      console.error('Failed to load staff:', err);
    });
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      addToast('Please enter Staff Name and Email.', 'warning');
      return;
    }

    setSaving(true);
    try {
      await mockStaffService.createStaff(form);
      addToast(`Staff member "${form.name}" registered successfully to backend database!`, 'success');
      setIsAddModalOpen(false);
      setForm({
        name: '',
        role: 'Billing Staff',
        title: 'Billing Specialist',
        email: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
      });
      loadStaff();
    } catch (err) {
      console.error('Failed to create staff:', err);
      addToast('Failed to create staff account', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Staff &amp; Operational Roles Directory</h1>
          <p className="text-xs text-slate-500">Live MySQL database user accounts, role assignments, MFA status &amp; route permission guards</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 self-start sm:self-auto transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Staff Member
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-extrabold text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Staff Name</th>
                <th className="p-3.5">Operational Role</th>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5 text-center">MFA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                    <img src={usr.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                    <span>{usr.name}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-full font-bold text-[11px]">
                      {usr.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">{usr.title}</td>
                  <td className="p-3.5 font-mono text-slate-600">{usr.email}</td>
                  <td className="p-3.5 text-center">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-full text-[10px]">
                      Enabled (Demo)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Add New Staff Member</h2>
                  <p className="text-[10px] text-slate-500">Register live user in database users table</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-xl transition cursor-pointer">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Full Staff Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. John Watson"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Operational Role *</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className={inputCls}
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Therapist">Therapist</option>
                  <option value="Counselor">Counselor</option>
                  <option value="Billing Staff">Billing Staff</option>
                  <option value="Receptionist">Receptionist</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Job Title / Specialty *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Attending Clinical Specialist"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jwatson@clinic.test"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Registering...' : 'Save Staff Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
