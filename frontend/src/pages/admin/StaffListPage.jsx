// src/pages/admin/StaffListPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { mockStaffService } from '../../services/mock/mockStaffService';
import { Shield, PlusCircle, User, Plus, X, Save, Mail, UserCheck, Edit2, Trash2, Upload, Camera, Check } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
];

export const StaffListPage = () => {
  const [staff, setStaff] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [saving, setSaving] = useState(false);
  const { addToast } = useUIStore();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    role: 'Billing Staff',
    title: 'Billing Specialist',
    email: '',
    password: '',
    status: 'ACTIVE',
    avatar: PRESET_AVATARS[0]
  });

  const loadStaff = () => {
    mockStaffService.getStaff().then(setStaff).catch(err => {
      console.error('Failed to load staff:', err);
    });
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setForm(prev => ({ ...prev, avatar: dataUrl }));
        addToast('Photo loaded!', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setForm({
      name: '',
      role: 'Billing Staff',
      title: 'Billing Specialist',
      email: '',
      password: '',
      status: 'ACTIVE',
      avatar: PRESET_AVATARS[0]
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingStaff(member);
    setForm({
      name: member.name || '',
      role: member.role || 'Billing Staff',
      title: member.title || '',
      email: member.email || '',
      password: '',
      status: member.status || 'ACTIVE',
      avatar: member.avatar || PRESET_AVATARS[0]
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteStaff = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete staff account "${name}" from database?`)) return;

    try {
      await mockStaffService.deleteStaff(id);
      addToast(`Staff member "${name}" deleted from database!`, 'success');
      loadStaff();
    } catch (err) {
      console.error('Failed to delete staff:', err);
      addToast('Failed to delete staff account', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      addToast('Please enter Staff Name and Email.', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (editingStaff) {
        await mockStaffService.updateStaff(editingStaff.id, form);
        addToast(`Staff account "${form.name}" updated in database!`, 'success');
      } else {
        await mockStaffService.createStaff(form);
        addToast(`Staff member "${form.name}" registered to MySQL database!`, 'success');
      }
      setIsAddModalOpen(false);
      loadStaff();
    } catch (err) {
      console.error('Failed to save staff:', err);
      addToast('Failed to save staff account', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Staff &amp; Operational Roles Directory</h1>
          <p className="text-xs text-slate-500">Live MySQL database user accounts, role assignments, and permission guards</p>
        </div>
        <button
          onClick={handleOpenAdd}
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
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
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
                    <span className={`px-2.5 py-0.5 font-bold rounded-full text-[10px] border ${
                      usr.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {usr.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(usr)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition cursor-pointer"
                        title="Edit Staff Member"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(usr.id, usr.name)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Staff Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                  </h2>
                  <p className="text-[10px] text-slate-500">Persist live user in MySQL database</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-xl transition cursor-pointer">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {/* Photo Upload & Presets */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-teal-600" /> Staff Photo / Avatar
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <img
                    src={form.avatar}
                    alt="Staff Avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shrink-0"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white hover:bg-teal-50 border border-teal-300 text-teal-800 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload from Device
                  </button>
                </div>
              </div>

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

              <div>
                <label className={labelCls}>Password {editingStaff ? '(Leave blank to keep current)' : '*'}</label>
                <input
                  type="password"
                  required={!editingStaff}
                  placeholder={editingStaff ? "••••••••" : "Enter account password"}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className={inputCls}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
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
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : editingStaff ? 'Update Staff Member' : 'Save Staff Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
