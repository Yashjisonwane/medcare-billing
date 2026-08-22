// src/pages/documents/PacketBuilderPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiDocumentService } from '../../services/api/apiDocumentService';
import { apiCaseService } from '../../services/api/apiCaseService';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { ROLES } from '../../constants/rolePermissions';
import { FolderOpen, CheckSquare, Download, Sparkles, ArrowLeft, FileText, CheckCircle2, DollarSign, User, Shield } from 'lucide-react';

export const PacketBuilderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCaseId = searchParams.get('caseId') || 'case-001';
  const queryPatientId = searchParams.get('patientId');

  const [docs, setDocs] = useState([]);
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(queryCaseId);
  const [selectedIds, setSelectedIds] = useState(['doc-001', 'doc-002', 'doc-003', 'doc-004']);
  const [isBuilding, setIsBuilding] = useState(false);
  const [packetResult, setPacketResult] = useState(null);
  const { addToast } = useUIStore();
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();

  const canViewBilling = [ROLES.SUPER_ADMIN, ROLES.BILLING_STAFF, ROLES.COUNSELOR].includes(currentUser?.role);

  useEffect(() => {
    apiDocumentService.getDocuments().then(res => {
      if (Array.isArray(res)) setDocs(res);
    }).catch(() => {});

    apiCaseService.getCases().then(res => {
      if (res && res.length > 0) {
        setCases(res);
        if (queryCaseId && res.some(c => c.id === queryCaseId || c.caseId === queryCaseId)) {
          setSelectedCaseId(queryCaseId);
        } else {
          setSelectedCaseId(res[0].id || 'case-001');
        }
      }
    }).catch(() => {});
  }, [queryCaseId]);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === docs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(docs.map(d => d.id));
    }
  };

  const handleBuildPacket = async () => {
    setIsBuilding(true);
    try {
      const res = await apiDocumentService.buildPatientPacket(selectedIds, selectedCaseId);
      setPacketResult(res);
      addToast(`Master Patient Document Packet ${res.packetId} generated!`, 'success');
    } catch (err) {
      addToast('Failed to build packet', 'error');
    } finally {
      setIsBuilding(false);
    }
  };

  const currentCase = cases.find(c => c.id === selectedCaseId || c.caseId === selectedCaseId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button onClick={() => navigate('/documents')} className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Document Repository
        </button>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-2">
          {currentCase && canViewBilling && (
            <button
              onClick={() => navigate(`/billing/provider-bills?caseId=${currentCase.id || selectedCaseId}`)}
              className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <DollarSign className="w-3.5 h-3.5" /> Provider Bills Ledger
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Patient Document Packet Builder</h1>
          <p className="text-xs text-slate-500">Compile multi-provider clinical notes, billing statements &amp; CMS-1500 claims into a single attorney packet</p>
        </div>

        {/* Case Selector Dropdown */}
        <div className="min-w-[240px]">
          <select
            value={selectedCaseId}
            onChange={e => {
              setSelectedCaseId(e.target.value);
              setSearchParams({ caseId: e.target.value });
            }}
            className="w-full px-3 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl border border-slate-200 shadow-sm outline-none cursor-pointer"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.caseId || c.id} — {c.patientName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Tree Selector */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-teal-600" /> Select Documents for Master Packet ({selectedIds.length} Selected)
            </h2>
            <button
              onClick={selectAll}
              className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              {selectedIds.length === docs.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="space-y-2">
            {docs.map((d) => {
              const isChecked = selectedIds.includes(d.id);
              return (
                <div
                  key={d.id}
                  onClick={() => toggleSelect(d.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    isChecked ? 'border-teal-400 bg-teal-50/40' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{d.name}</p>
                      <p className="text-[10px] text-slate-500">{d.providerName} | {d.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{d.size}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Packet Summary & Generation Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-teal-600" /> Packet Compilation Summary
            </h2>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Patient / Case:</span>
                <strong className="text-slate-900 truncate max-w-[150px]">{currentCase?.patientName || 'Demo Patient 001'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Files:</span>
                <strong className="text-slate-900">{selectedIds.length} Documents</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Pages:</span>
                <strong className="text-slate-900">{selectedIds.length * 4} Pages</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Included Providers:</span>
                <strong className="text-emerald-700 font-bold">4 Modalities</strong>
              </div>
            </div>

            <button
              onClick={handleBuildPacket}
              disabled={isBuilding || selectedIds.length === 0}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" /> {isBuilding ? 'Compiling Packet...' : 'Generate Master Legal Packet'}
            </button>
          </div>

          {packetResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
              <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Master Packet Ready
              </p>
              <p className="text-[11px] text-slate-500 font-mono">Packet ID: {packetResult.packetId}</p>
              <button
                onClick={() => addToast('Complete medical-legal packet PDF ready for download!', 'success')}
                className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Complete PDF Packet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
