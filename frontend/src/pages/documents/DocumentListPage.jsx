// src/pages/documents/DocumentListPage.jsx
import React, { useEffect, useState } from 'react';
import { apiDocumentService } from '../../services/api/apiDocumentService';
import { apiCaseService } from '../../services/api/apiCaseService';
import { FolderOpen, Eye, X, Printer, Upload, Edit, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UnifiedPacketViewer } from '../../components/packets/UnifiedPacketViewer';
import { useUIStore } from '../../store/uiStore';

export const DocumentListPage = () => {
  const [docs, setDocs] = useState([]);
  const [casesList, setCasesList] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  // Import form states
  const [newDocCaseId, setNewDocCaseId] = useState('case-001');
  const [newDocName, setNewDocName] = useState('');
  const [newDocProvider, setNewDocProvider] = useState('JOSMIC Wellness Center');
  const [newDocType, setNewDocType] = useState('Medical Records');
  const [newDocStatus, setNewDocStatus] = useState('COMPLETED');
  const [newDocSize, setNewDocSize] = useState('1.5 MB');

  useEffect(() => {
    apiDocumentService.getDocuments().then(setDocs).catch(console.error);
    apiCaseService.getCases().then(res => {
      if (res && res.length > 0) {
        setCasesList(res);
        setNewDocCaseId(res[0].id || res[0].caseId);
      }
    }).catch(console.error);
  }, []);

  const getProviderId = (providerName) => {
    if (providerName?.includes('ANIK')) return 'prov-anik';
    if (providerName?.includes('DAV')) return 'prov-davs';
    if (providerName?.includes('JOSMIC')) return 'prov-josmic';
    if (providerName?.includes('Counselor')) return 'prov-counselor';
    return 'prov-anik';
  };

  const getEditPath = (doc) => {
    const provider = doc.providerName || '';
    const type = doc.type || '';
    
    if (provider.includes('JOSMIC')) {
      if (type.includes('Bill') || type.includes('Statement')) return '/billing/provider-bills';
      return '/clinical-notes/josmic-pain';
    }
    if (provider.includes('DAV')) {
      if (type.includes('Bill') || type.includes('Statement')) return '/billing/provider-bills';
      return '/clinical-notes/davs-eswt';
    }
    if (provider.includes('ANIK')) {
      if (type.includes('Bill') || type.includes('Statement')) return '/billing/provider-bills';
      return '/clinical-notes/anik-laser';
    }
    if (provider.includes('Counselor')) {
      if (type.includes('Bill') || type.includes('Statement')) return '/billing/provider-bills';
      return '/clinical-notes/counselor-session';
    }
    return '/clinical-notes';
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newDocName.trim()) {
      addToast('Please enter a document name.', 'error');
      return;
    }
    const payload = {
      caseId: newDocCaseId,
      name: newDocName.endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
      providerName: newDocProvider,
      type: newDocType,
      documentType: newDocType,
      status: newDocStatus,
      size: newDocSize
    };
    try {
      await apiDocumentService.uploadDocument(payload);
      addToast(`Document "${payload.name}" imported and attached to case!`, 'success');
      setIsUploadModalOpen(false);
      setNewDocName('');
      // Refresh documents list
      const updatedDocs = await apiDocumentService.getDocuments();
      setDocs(updatedDocs);
    } catch (err) {
      console.error(err);
      addToast('Failed to import document', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Document Management Repository</h1>
          <p className="text-xs text-slate-500">Centralized medical reports, cover pages, billing statements &amp; CMS claim attachments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-1.5 self-start sm:self-auto border border-slate-700 transition"
          >
            <Upload className="w-4 h-4" /> Import Document
          </button>
          <button onClick={() => navigate('/documents/packet-builder')} className="px-3.5 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl shadow hover:bg-teal-700 flex items-center justify-center gap-1.5 self-start sm:self-auto transition">
            <FolderOpen className="w-4 h-4" /> Open Patient Packet Builder
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-3 sm:p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Document Name</th>
                <th className="p-3">Provider Category</th>
                <th className="p-3">Document Type</th>
                <th className="p-3">Date</th>
                <th className="p-3">File Size</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-teal-700">{doc.name}</td>
                  <td className="p-3 font-semibold text-slate-800">{doc.providerName}</td>
                  <td className="p-3 text-slate-600">{doc.type}</td>
                  <td className="p-3 font-mono text-slate-500">{doc.date}</td>
                  <td className="p-3 font-mono text-slate-500">{doc.size}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg inline-flex items-center gap-1 transition shadow-sm text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" /> Preview
                    </button>
                    <button
                      onClick={() => navigate(getEditPath(doc))}
                      className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg inline-flex items-center gap-1 transition shadow-sm text-[11px]"
                    >
                      <Edit className="w-3.5 h-3.5" /> Fill / Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Blank Practice Form Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl h-[95vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 flex-shrink-0">
                  BLANK FORM TEMPLATE
                </span>
                <div className="min-w-0">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-100 truncate">{previewDoc.name}</h2>
                  <p className="text-[10px] text-slate-400 truncate">{previewDoc.providerName} — Clean Form Layout</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                <button onClick={() => window.print()} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1 border border-slate-700">
                  <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Print Blank Form</span><span className="sm:hidden">Print</span>
                </button>
                <button onClick={() => setPreviewDoc(null)} className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800" title="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body — Unfilled Blank Packet Viewer */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-slate-950/60">
              <UnifiedPacketViewer providerId={getProviderId(previewDoc.providerName)} initialBlank={true} />
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-400">
              <p className="text-[10px] sm:text-xs leading-tight">Unfilled Practice Form — Includes Provider Letterhead, Section Headings, Line Grids &amp; Anatomy Diagrams.</p>
              <button onClick={() => setPreviewDoc(null)} className="w-full sm:w-auto px-4 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 flex-shrink-0">
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* IMPORT / UPLOAD DOCUMENT MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-teal-600" /> Import New Document
              </h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Target Patient Accident Case *</label>
                <select
                  value={newDocCaseId}
                  onChange={(e) => setNewDocCaseId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                >
                  {casesList.map(c => (
                    <option key={c.id || c.caseId} value={c.id || c.caseId}>
                      {c.caseId || c.id} — {c.patientName || 'Accident Patient'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Document File Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Police_Accident_Report_Houston_PD"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Practice Provider Category</label>
                <select
                  value={newDocProvider}
                  onChange={(e) => setNewDocProvider(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                >
                  <option value="JOSMIC Wellness Center">JOSMIC Wellness Center (Pain Consult)</option>
                  <option value="DAV'S Anatomy">DAV'S Anatomy (ESWT Shockwave)</option>
                  <option value="ANIK Laser Therapy">ANIK Laser Therapy (Laser Therapy)</option>
                  <option value="Counselor Practice">Counselor Practice (Hope Behavioral)</option>
                  <option value="General Clinic Records">General Clinic Records</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Document Type</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                >
                  <option value="Cover Page">Cover Page</option>
                  <option value="Billing Statement">Billing Statement</option>
                  <option value="Narrative Report">Narrative Report</option>
                  <option value="Medical Report">Medical Report</option>
                  <option value="Procedure Form">Procedure Form</option>
                  <option value="CMS-1500 Claim">CMS-1500 Claim</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Document Status</label>
                  <select
                    value={newDocStatus}
                    onChange={(e) => setNewDocStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="SIGNED">SIGNED</option>
                    <option value="UNSIGNED">UNSIGNED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="FINALISED">FINALISED</option>
                    <option value="UPLOADED">UPLOADED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Simulated Size</label>
                  <input
                    type="text"
                    value={newDocSize}
                    onChange={(e) => setNewDocSize(e.target.value)}
                    placeholder="e.g. 1.2 MB"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow transition"
                >
                  Upload &amp; Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
