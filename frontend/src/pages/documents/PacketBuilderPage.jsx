// src/pages/documents/PacketBuilderPage.jsx
import React, { useEffect, useState } from 'react';
import { mockDocumentService } from '../../services/mock/mockDocumentService';
import { useUIStore } from '../../store/uiStore';
import { FolderOpen, CheckSquare, Download, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PacketBuilderPage = () => {
  const [docs, setDocs] = useState([]);
  const [selectedIds, setSelectedIds] = useState(['doc-001', 'doc-002', 'doc-003', 'doc-004']);
  const [isBuilding, setIsBuilding] = useState(false);
  const [packetResult, setPacketResult] = useState(null);
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    mockDocumentService.getDocuments().then(setDocs);
  }, []);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBuildPacket = async () => {
    setIsBuilding(true);
    try {
      const res = await mockDocumentService.buildPatientPacket(selectedIds, 'case-001');
      setPacketResult(res);
      addToast(`Master Patient Document Packet ${res.packetId} generated!`, 'success');
    } catch (err) {
      addToast('Failed to build packet', 'error');
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/documents')} className="flex items-center gap-1 text-xs font-bold text-secondary-container hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Document Repository
      </button>

      <div>
        <h1 className="text-2xl font-bold text-on-surface">Patient Document Packet Builder</h1>
        <p className="text-xs text-on-surface-variant">Compile multi-provider clinical notes, billing statements & CMS forms into a single attorney packet</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Tree Selector */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-secondary-container" /> Select Documents for Master Packet ({selectedIds.length} Selected)
          </h2>

          <div className="space-y-2">
            {docs.map((d) => {
              const isChecked = selectedIds.includes(d.id);
              return (
                <div
                  key={d.id}
                  onClick={() => toggleSelect(d.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    isChecked ? 'border-secondary-container bg-surface-container-low' : 'border-outline-variant hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={isChecked} readOnly className="rounded text-secondary-container focus:ring-secondary-container" />
                    <div>
                      <p className="text-xs font-bold text-on-surface">{d.name}</p>
                      <p className="text-[10px] text-on-surface-variant">{d.providerName} | {d.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-on-surface-variant">{d.size}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Packet Summary & Generation Panel */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-secondary-container" /> Packet Compilation Summary
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-on-surface-variant">Selected Files:</span><span className="font-bold text-on-surface">{selectedIds.length} Documents</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Estimated Pages:</span><span className="font-bold text-on-surface">{selectedIds.length * 4} Pages</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Included Providers:</span><span className="font-bold text-emerald-600">4 Providers</span></div>
            </div>

            <button
              onClick={handleBuildPacket}
              disabled={isBuilding || selectedIds.length === 0}
              className="w-full py-2.5 bg-secondary-container hover:bg-secondary text-white font-bold text-xs rounded-lg shadow transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> {isBuilding ? 'Compiling Packet...' : 'Generate Master Packet (Demo)'}
            </button>
          </div>

          {packetResult && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 text-xs">
              <p className="font-bold text-emerald-700">Master Packet Ready (Demo)</p>
              <p className="text-[11px] text-on-surface-variant">ID: {packetResult.packetId}</p>
              <button
                onClick={() => addToast('Simulated packet PDF downloaded to browser memory!', 'success')}
                className="w-full mt-2 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" /> Download Demo PDF Packet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
