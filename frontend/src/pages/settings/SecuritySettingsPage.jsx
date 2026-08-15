// src/pages/settings/SecuritySettingsPage.jsx
import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { ShieldCheck, Lock, Save } from 'lucide-react';

export const SecuritySettingsPage = () => {
  const [mfaRequired, setMfaRequired] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('15 Minutes');
  const { addToast } = useUIStore();

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Security settings updated (Demo)!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Security & Privacy Controls UI</h1>
        <p className="text-xs text-on-surface-variant">Multi-Factor Authentication policy preview, session timeout & password controls</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
        <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant">
          <div>
            <p className="text-xs font-bold text-on-surface">Require Multi-Factor Authentication (MFA)</p>
            <p className="text-[11px] text-on-surface-variant">Enforce 6-digit pin code upon staff login</p>
          </div>
          <input
            type="checkbox"
            checked={mfaRequired}
            onChange={(e) => setMfaRequired(e.target.checked)}
            className="w-4 h-4 rounded text-secondary-container focus:ring-secondary-container"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">Session Idle Timeout</label>
          <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="w-full px-3 py-2 text-xs border rounded bg-surface">
            <option value="15 Minutes">15 Minutes (HIPAA Aligned Baseline)</option>
            <option value="30 Minutes">30 Minutes</option>
            <option value="60 Minutes">60 Minutes</option>
          </select>
        </div>

        <button type="submit" className="px-5 py-2 bg-secondary-container text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 ml-auto">
          <Save className="w-4 h-4" /> Save Security Policies
        </button>
      </form>
    </div>
  );
};
