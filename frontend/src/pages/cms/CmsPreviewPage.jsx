// src/pages/cms/CmsPreviewPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCms1500Service } from '../../services/mock/mockCms1500Service';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { CmsRedGridForm } from '../../components/cms/CmsRedGridForm';
import { useUIStore } from '../../store/uiStore';
import { 
  ArrowLeft, Printer, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  Maximize2, Download, AlertTriangle, FileCheck, ShieldAlert 
} from 'lucide-react';

export const CmsPreviewPage = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [claims, setClaims] = useState([]);
  const [activeClaimIndex, setActiveClaimIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 640 ? 0.45 : 1));
  const [printAllMode, setPrintAllMode] = useState(false);
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    mockBillingService.getBillById(id).then(setBill);
    mockCms1500Service.getClaimsByBillId(id).then(res => {
      setClaims(res || []);
      setActiveClaimIndex(0);
    });
  }, [id]);

  // Adjust zoom for mobile view on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && zoomLevel > 0.6) {
        setZoomLevel(0.45);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [zoomLevel]);

  if (!bill || claims.length === 0) {
    return <div className="p-8 text-xs text-slate-500">Loading date-grouped CMS-1500 claim reference...</div>;
  }

  const currentClaim = claims[activeClaimIndex];

  const handleNextClaim = () => {
    if (activeClaimIndex < claims.length - 1) {
      setActiveClaimIndex(prev => prev + 1);
    }
  };

  const handlePrevClaim = () => {
    if (activeClaimIndex > 0) {
      setActiveClaimIndex(prev => prev - 1);
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
  const handleFitWidth = () => {
    if (window.innerWidth < 640) {
      setZoomLevel(0.45);
    } else {
      setZoomLevel(0.95);
    }
  };

  const handlePrintCurrent = () => {
    setPrintAllMode(false);
    setTimeout(() => window.print(), 150);
  };

  const handlePrintAll = () => {
    setPrintAllMode(true);
    addToast(`Preparing all ${claims.length} claims for print...`, 'info');
    setTimeout(() => {
      window.print();
      setPrintAllMode(false);
    }, 200);
  };

  const handleSavePdf = () => {
    addToast('Generated PDF export simulation for CMS claim.', 'success');
  };

  return (
    <div className="space-y-4">
      
      {/* APP HEADER CONTROLS (Hidden during Printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)} 
            className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-2xs transition flex items-center gap-2 cursor-pointer group"
            title="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>

          <button 
            onClick={() => navigate('/cms-1500')} 
            className="px-3 py-2 text-xs font-bold text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-xl transition cursor-pointer"
          >
            Claims Queue
          </button>

          <button 
            onClick={() => navigate('/billing/provider-bills')} 
            className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer hidden md:inline-block"
          >
            Provider Bills Ledger
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleSavePdf} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5 text-slate-600" /> Save PDF
          </button>
          <button onClick={handlePrintCurrent} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
            <Printer className="w-3.5 h-3.5" /> Print Claim
          </button>
          {claims.length > 1 && (
            <button onClick={handlePrintAll} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
              <Printer className="w-3.5 h-3.5" /> Print All ({claims.length})
            </button>
          )}
        </div>
      </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <FileCheck className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-xs text-slate-300">
              <strong className="text-white">Standard HCFA CMS-1500 (02/12):</strong> Form mapped to Box 1-33 NUCC Compliance
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full font-bold text-xs shrink-0 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>✓ Ready to File &bull; Generated &amp; Validated</span>
          </div>
        </div>

      {/* VIEWER NAVIGATION TOOLBAR (Hidden during Printing) */}
      <div className="bg-slate-900 text-white p-3 sm:p-4 rounded-xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        
        {/* Pagination & Claim Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevClaim}
              disabled={activeClaimIndex === 0}
              className="p-1 rounded-lg hover:bg-slate-800 disabled:opacity-40 text-slate-300"
              title="Previous Claim"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextClaim}
              disabled={activeClaimIndex === claims.length - 1}
              className="p-1 rounded-lg hover:bg-slate-800 disabled:opacity-40 text-slate-300"
              title="Next Claim"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div>
            <p className="text-xs font-bold text-white">
              Claim <span className="text-teal-400">{activeClaimIndex + 1}</span> of <span className="text-teal-400">{claims.length}</span> - DOS: <strong className="text-white">{currentClaim.dosDisplay}</strong>
            </p>
            <p className="text-[10px] text-slate-400 truncate">{bill.providerName} | Total: <strong className="text-teal-300">${currentClaim.box28TotalCharge}</strong></p>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
          <span className="text-[10px] text-slate-400 sm:hidden">Zoom Form:</span>
          <div className="flex items-center gap-1.5">
            <button onClick={handleZoomOut} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-300 w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={handleZoomIn} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={handleFitWidth} className="px-2 py-1 bg-teal-600 hover:bg-teal-700 rounded-lg text-xs font-bold text-white flex items-center gap-1" title="Fit to Screen">
              <Maximize2 className="w-3.5 h-3.5" /> Fit
            </button>
          </div>
        </div>

      </div>

      {/* CLAIM CANVAS VIEWER - Responsive Container */}
      <div className="overflow-x-auto p-2 sm:p-6 bg-slate-950 rounded-2xl border border-slate-800 flex justify-center print:bg-white print:p-0 print:border-none min-h-[500px]">
        
        {/* Single Claim View mode */}
        {!printAllMode && (
          <div
            className="w-full flex justify-center overflow-x-auto"
            style={{ minHeight: `${842 * zoomLevel}px` }}
          >
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease',
                marginBottom: `${(1 - zoomLevel) * -500}px`
              }}
            >
              <CmsRedGridForm claim={currentClaim} />
            </div>
          </div>
        )}

        {/* Print All Claims mode */}
        {printAllMode && (
          <div className="space-y-0 w-full">
            {claims.map((claimItem) => (
              <CmsRedGridForm key={claimItem.claimId} claim={claimItem} />
            ))}
          </div>
        )}

      </div>

      {/* BOTTOM NAVIGATION FOOTER (Hidden during Printing) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <button 
          onClick={() => navigate(-1)} 
          className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Back to Claims / Ledger</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button 
            onClick={handlePrintCurrent} 
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print Current Claim
          </button>
        </div>
      </div>
    </div>
  );
};

