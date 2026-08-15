// src/pages/admin/StaffListPage.jsx
import React, { useEffect, useState } from 'react';
import { mockStaffService } from '../../services/mock/mockStaffService';
import { Shield, PlusCircle, User } from 'lucide-react';

export const StaffListPage = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    mockStaffService.getStaff().then(setStaff);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Staff & Operational Roles Directory</h1>
          <p className="text-xs text-on-surface-variant">User accounts, role assignments, MFA status & route permission guards</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container text-on-surface-variant uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3.5">Staff Name</th>
                <th className="p-3.5">Operational Role</th>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">MFA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {staff.map((usr) => (
                <tr key={usr.id} className="hover:bg-surface">
                  <td className="p-3.5 font-bold text-on-surface flex items-center gap-2">
                    <img src={usr.avatar} alt={usr.name} className="w-7 h-7 rounded-full object-cover" />
                    {usr.name}
                  </td>
                  <td className="p-3.5"><span className="px-2.5 py-0.5 bg-secondary-container/10 text-secondary-container rounded-full font-bold">{usr.role}</span></td>
                  <td className="p-3.5 text-on-surface-variant">{usr.title}</td>
                  <td className="p-3.5 font-mono text-on-surface-variant">{usr.email}</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-bold rounded text-[10px]">Enabled (Demo)</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
