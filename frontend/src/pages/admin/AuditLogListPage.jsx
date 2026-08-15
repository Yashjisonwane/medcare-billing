// src/pages/admin/AuditLogListPage.jsx
import React, { useEffect, useState } from 'react';
import { mockAuditService } from '../../services/mock/mockAuditService';
import { Activity, ShieldAlert } from 'lucide-react';

export const AuditLogListPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    mockAuditService.getLogs().then(setLogs);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Security & Operational Audit Trails</h1>
        <p className="text-xs text-on-surface-variant">Immutable activity logs, chart signatures, bill finalisations & demo IP session tracking</p>
      </div>

      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-800 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>"Frontend audit records are demonstration records only. Real immutable audit logging requires backend implementation."</span>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container text-on-surface-variant uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Action Code</th>
                <th className="p-3.5">Resource Description</th>
                <th className="p-3.5">IP Session Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface">
                  <td className="p-3.5 font-mono text-on-surface-variant">{log.timestamp}</td>
                  <td className="p-3.5 font-bold text-on-surface">{log.user}</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 bg-secondary-container/10 text-secondary-container rounded font-bold">{log.role}</span></td>
                  <td className="p-3.5 font-mono text-emerald-600 font-bold">{log.action}</td>
                  <td className="p-3.5 text-on-surface">{log.resource}</td>
                  <td className="p-3.5 font-mono text-on-surface-variant text-[11px]">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
