// src/pages/appointments/ReminderStatusPage.jsx
import React, { useEffect, useState } from 'react';
import { mockReminderService } from '../../services/mock/mockReminderService';
import { useUIStore } from '../../store/uiStore';
import { Bell, RefreshCw, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReminderStatusPage = () => {
  const [logs, setLogs] = useState([]);
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    mockReminderService.getLogs().then(setLogs);
  }, []);

  const handleSimulateResponse = async (logId, responseStatus) => {
    const updated = await mockReminderService.simulatePatientResponse(logId, responseStatus);
    setLogs(updated);
    addToast(`Simulated patient reminder response: ${responseStatus}`, 'info');
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/appointments/calendar')} className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Calendar
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Automated Appointment Reminder Delivery Logs</h1>
        <p className="text-xs text-slate-500">Simulated SMS & Email delivery tracking, patient confirmations & delivery failure retries</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Sent Time</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Recipient</th>
                <th className="p-3">Message Preview</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Simulate Patient Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono text-slate-500">{log.sentAt}</td>
                  <td className="p-3 font-bold text-slate-900">{log.patientName}</td>
                  <td className="p-3"><span className="px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded font-bold border border-teal-200">{log.channel}</span></td>
                  <td className="p-3 font-mono text-slate-500">{log.recipient}</td>
                  <td className="p-3 text-slate-800 max-w-xs truncate">{log.messagePreview}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status.includes('Confirmed') ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                      log.status.includes('Failed') ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-cyan-50 text-cyan-700 border border-cyan-200'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleSimulateResponse(log.id, 'Delivered - Confirmed')}
                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[11px]"
                    >
                      Confirm (Reply 1)
                    </button>
                    <button
                      onClick={() => handleSimulateResponse(log.id, 'Failed - Demo Retry Needed')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px]"
                    >
                      Simulate Fail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
