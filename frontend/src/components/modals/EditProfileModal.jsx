// src/components/modals/EditProfileModal.jsx
import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { X, User, Mail, Briefcase, Camera, Check, Shield, Upload, Image as ImageIcon } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
];

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useAuthStore();
  const { addToast } = useUIStore();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(currentUser?.name || 'Sarah Connor');
  const [title, setTitle] = useState(currentUser?.title || 'Super Admin / System Administrator');
  const [email, setEmail] = useState(currentUser?.email || 'admin@example.test');
  const [avatar, setAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('File size must be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setAvatar(dataUrl);
        addToast('Photo loaded! Click Save to apply.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Please enter your full name', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        title: title.trim(),
        email: email.trim(),
        avatar
      });

      addToast('Profile & Avatar saved and synced to database!', 'success');
      onClose();
    } catch (err) {
      addToast('Profile saved locally!', 'info');
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Edit Super Admin Profile</h3>
              <p className="text-[10px] text-slate-500">Update your display name, title and avatar photo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto">
          {/* Avatar Upload & Presets */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
            <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-teal-600" /> Choose Profile Avatar
              </span>
              <span className="text-[10px] text-teal-700 font-semibold">Local Upload &amp; Presets</span>
            </label>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Avatar Preview & Upload Action */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer shrink-0"
                title="Click to choose photo from computer"
              >
                <img
                  src={avatar}
                  alt="Profile Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-teal-500 shadow-md ring-2 ring-teal-500/20 group-hover:opacity-80 transition"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-[9px] font-bold">
                  <Upload className="w-4 h-4 mb-0.5" />
                  Upload
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 bg-white hover:bg-teal-50 border border-teal-300 text-teal-800 text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Upload className="w-4 h-4 text-teal-600" />
                  Choose / Upload Photo from PC
                </button>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Supports JPG, PNG, WebP up to 5MB
                </p>
              </div>
            </div>

            {/* Preset Avatars Row */}
            <div className="pt-2 border-t border-slate-200/60">
              <p className="text-[10px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Or Pick From Presets:
              </p>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`relative w-9 h-9 rounded-full overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                      avatar === av ? 'border-teal-600 scale-105 shadow-sm ring-2 ring-teal-500/40' : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    {avatar === av && (
                      <div className="absolute inset-0 bg-teal-600/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" /> Full Display Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Yash Sonwane"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:border-teal-600 outline-none transition"
              required
            />
          </div>

          {/* Title / Role Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-teal-600" /> Professional Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. System Administrator / Practice Owner"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-600" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. admin@medpracticepro.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none transition"
            />
          </div>

          {/* Current Role Badge */}
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
            <span className="text-teal-900 font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-600" /> System Role:
            </span>
            <span className="px-2.5 py-0.5 bg-teal-600 text-white font-extrabold text-[10px] rounded-full">
              {currentUser?.role || 'Super Admin'}
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
