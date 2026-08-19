// src/components/packets/UnifiedPacketViewer.jsx
import React, { useState, useEffect } from 'react';
import { PACKET_MANIFESTS } from '../../constants/packetManifests';
import { apiBillingService } from '../../services/api/apiBillingService';
import { mapBillToCms1500Claims } from '../../utils/cmsMapper';
import { useUIStore } from '../../store/uiStore';

// Common Components
import { PrintableBillingStatement } from './common/PrintableBillingStatement';
import { CmsRedGridForm } from '../cms/CmsRedGridForm';

// ANIK Components
import { AnikCoverPage } from './anik/AnikCoverPage';
import { AnikTherapyAssessmentForm } from './anik/AnikTherapyAssessmentForm';
import { AnikLaserProcedureForm } from './anik/AnikLaserProcedureForm';
import { AnikNarrativeReport } from './anik/AnikNarrativeReport';
import { AnikFinalReport } from './anik/AnikFinalReport';

// DAV'S Components
import { DavCoverPage } from './davs/DavCoverPage';
import { DavEswtProcedureForm } from './davs/DavEswtProcedureForm';
import { DavProgressNote } from './davs/DavProgressNote';
import { DavFinalNarrative } from './davs/DavFinalNarrative';

// JOSMIC Components
import { JosmicCoverPage } from './josmic/JosmicCoverPage';
import { JosmicPainManagementReport } from './josmic/JosmicPainManagementReport';

// Counselor Components
import { CounselorCoverPage } from './counselor/CounselorCoverPage';
import { CounselorAssessmentForm } from './counselor/CounselorAssessmentForm';

import { 
  Printer, Download, Eye, Edit3, Lock, Unlock, ZoomIn, ZoomOut, 
  Maximize2, ChevronLeft, ChevronRight, FileCheck, AlertCircle, Sparkles, FileText, RotateCcw
} from 'lucide-react';

const getInitialZoom = () => {
  if (typeof window === 'undefined') return 0.9;
  const w = window.innerWidth;
  if (w < 480) return 0.38; // Small phones (iPhone/Galaxy S)
  if (w < 640) return 0.44; // Larger phones
  if (w < 1024) return 0.7;  // Tablets
  return 0.9;               // Desktop
};

export const UnifiedPacketViewer = ({ providerId = 'prov-anik', initialBlank = false, selectedCase = null }) => {
  const manifest = PACKET_MANIFESTS[providerId] || PACKET_MANIFESTS['prov-anik'];
  const [bill, setBill] = useState(null);
  const [cmsClaims, setCmsClaims] = useState([]);
  
  const [viewMode, setViewMode] = useState('FULL_PACKET'); // 'FULL_PACKET' or 'SINGLE_FORM'
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activeTabFilter, setActiveTabFilter] = useState('ALL');
  const [zoomLevel, setZoomLevel] = useState(getInitialZoom);
  const [isLocked, setIsLocked] = useState(false);
  const [blankPracticeMode, setBlankPracticeMode] = useState(initialBlank);
  const [qaMode, setQaMode] = useState(false);

  const { addToast } = useUIStore();

  const billMap = { 
    'prov-anik': 'bill-anik-001', 
    'prov-davs': 'bill-davs-001', 
    'prov-josmic': 'bill-josmic-001',
    'prov-counselor': 'bill-counselor-001'
  };
  const targetBillId = billMap[providerId] || 'bill-anik-001';

  useEffect(() => {
    setBlankPracticeMode(initialBlank);
  }, [initialBlank]);

  useEffect(() => {
    const fetchBillAndClaims = async () => {
      try {
        if (!selectedCase) return;
        const caseIdentifier = selectedCase.id || selectedCase.caseId;
        const res = await apiBillingService.getFourBillsByCase(caseIdentifier);
        
        if (res && res.allBills) {
          const providerBill = res.allBills.find(b => b.providerId === providerId);
          if (providerBill) {
            setBill(providerBill);
            const claims = mapBillToCms1500Claims(providerBill, selectedCase, { 
              id: providerId, 
              identifiers: { taxId: providerBill.provider?.identifiers?.taxId || '993723387' } 
            });
            setCmsClaims(claims);
          }
        }
      } catch (err) {
        console.error('Failed to fetch DB billing data:', err);
      }
    };
    fetchBillAndClaims();
  }, [selectedCase, providerId]);

  // Adjust zoom on screen resize
  useEffect(() => {
    const handleResize = () => {
      const targetZoom = getInitialZoom();
      if (window.innerWidth < 640 && zoomLevel > 0.6) {
        setZoomLevel(targetZoom);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [zoomLevel]);

  const handlePrint = () => {
    window.print();
  };

  const handleFinaliseLock = () => {
    setIsLocked(!isLocked);
    addToast(isLocked ? 'Document unlocked for editing.' : 'Document finalized & locked read-only.', isLocked ? 'info' : 'success');
  };

  const toggleBlankPracticeMode = () => {
    setBlankPracticeMode(!blankPracticeMode);
    addToast(
      !blankPracticeMode ? 'Switched to Blank Practice Form (All fields empty for custom typing).' : 'Restored Demo Patient Case Data.',
      'info'
    );
  };

  const handleFitScreen = () => {
    setZoomLevel(getInitialZoom());
  };

  const renderPageComponent = (pageDef) => {
    const key = pageDef.componentKey;
    if (key === 'PrintableBillingStatement') {
      return <PrintableBillingStatement bill={blankPracticeMode ? null : bill} pageIndex={pageDef.pageIndex || 0} />;
    }
    if (key === 'CmsRedGridForm') {
      const claim = cmsClaims[pageDef.claimIndex || 0];
      return <CmsRedGridForm claim={claim} blankMode={blankPracticeMode} />;
    }
    
    // ANIK Components
    if (key === 'AnikCoverPage') return <AnikCoverPage readOnly={isLocked} blankMode={blankPracticeMode} packetData={selectedCase} />;
    if (key === 'AnikTherapyAssessmentForm') return <AnikTherapyAssessmentForm readOnly={isLocked} blankMode={blankPracticeMode} packetData={selectedCase} serviceLines={bill ? bill.serviceLines : []} />;
    if (key === 'AnikLaserProcedureForm') return <AnikLaserProcedureForm dos={blankPracticeMode ? '' : pageDef.dos} readOnly={isLocked} blankMode={blankPracticeMode} packetData={selectedCase} />;
    if (key === 'AnikNarrativeReport') return <AnikNarrativeReport reportPage={pageDef.reportPage} blankMode={blankPracticeMode} packetData={selectedCase} />;
    if (key === 'AnikFinalReport') return <AnikFinalReport reportPage={pageDef.reportPage} blankMode={blankPracticeMode} packetData={selectedCase} />;

    // DAV'S Components
    if (key === 'DavCoverPage') return <DavCoverPage blankMode={blankPracticeMode} packetData={selectedCase} />;
    if (key === 'DavEswtProcedureForm') return <DavEswtProcedureForm dos={blankPracticeMode ? '' : pageDef.dos} readOnly={isLocked} blankMode={blankPracticeMode} packetData={selectedCase} />;
    if (key === 'DavProgressNote') return <DavProgressNote notePage={pageDef.notePage} blankMode={blankPracticeMode} packetData={selectedCase} />;
    if (key === 'DavFinalNarrative') return <DavFinalNarrative reportPage={pageDef.reportPage} blankMode={blankPracticeMode} packetData={selectedCase} />;

    // JOSMIC Components
    if (key === 'JosmicCoverPage') return <JosmicCoverPage blankMode={blankPracticeMode} packetData={selectedCase} />;
    if (key === 'JosmicPainManagementReport') return <JosmicPainManagementReport reportPage={pageDef.reportPage} blankMode={blankPracticeMode} packetData={selectedCase} />;

    // Counselor Components
    if (key === 'CounselorCoverPage') return <CounselorCoverPage blankMode={blankPracticeMode} packetData={selectedCase} />;
    if (key === 'CounselorAssessmentForm') return <CounselorAssessmentForm blankMode={blankPracticeMode} packetData={selectedCase} />;

    return <div className="p-12 text-center text-xs text-slate-400">Component {key} placeholder</div>;
  };

  const filteredPages = manifest.pages.filter(p => {
    if (activeTabFilter === 'ALL') return true;
    return p.type === activeTabFilter;
  });

  return (
    <div className="space-y-4">
      
      {/* TOOLBAR CONTROLS (Hidden during printing) */}
      <div className="bg-slate-900 text-white p-3 sm:p-4 rounded-xl border border-slate-800 shadow-xl space-y-3 print:hidden">
        
        {/* Top Header Line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xs sm:text-base font-extrabold text-white flex items-center gap-2 truncate">
              <FileCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span className="truncate">{manifest.providerName}</span>
            </h2>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {manifest.totalPages} Pages | {blankPracticeMode ? <span className="text-amber-400 font-bold">UNFILLED BLANK PRACTICE FORM</span> : <span>Patient: <strong className="text-white">{selectedCase ? selectedCase.patientName : 'SELECT A CASE'}</strong></span>}
            </p>
          </div>

          {/* Action Buttons â€” Responsive row on mobile */}
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
            <button
              onClick={toggleBlankPracticeMode}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition ${
                blankPracticeMode ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-slate-700'
              }`}
            >
              {blankPracticeMode ? <RotateCcw className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden sm:inline">{blankPracticeMode ? 'Fill Demo Data' : 'Clear All to Unfilled Blank Form'}</span>
              <span className="sm:hidden">{blankPracticeMode ? 'Fill Data' : 'Blank Form'}</span>
            </button>

            <button
              onClick={handleFinaliseLock}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition ${
                isLocked ? 'bg-slate-700 text-slate-300' : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isLocked ? 'Locked' : 'Finalise'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Print Complete Packet ({manifest.totalPages} Pages)</span>
              <span className="sm:hidden">Print ({manifest.totalPages}p)</span>
            </button>
          </div>
        </div>

        {/* Viewing Modes & Category Tabs Toolbar */}
        <div className="flex flex-col gap-2.5 border-t border-slate-800 pt-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 self-start sm:self-auto">
              <button
                onClick={() => setViewMode('FULL_PACKET')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition flex items-center gap-1 ${
                  viewMode === 'FULL_PACKET' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full Packet (Continuous Scroll)</span>
                <span className="sm:hidden">Full Packet</span>
              </button>
              <button
                onClick={() => setViewMode('SINGLE_FORM')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition flex items-center gap-1 ${
                  viewMode === 'SINGLE_FORM' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Single Form Edit Mode</span>
                <span className="sm:hidden">Single Form</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.05, 0.25))} className="p-0.5 hover:text-white" title="Zoom Out"><ZoomOut className="w-3.5 h-3.5" /></button>
                <span className="w-10 text-center font-bold text-teal-300 text-[11px]">{Math.round(zoomLevel * 100)}%</span>
                <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.05, 1.3))} className="p-0.5 hover:text-white" title="Zoom In"><ZoomIn className="w-3.5 h-3.5" /></button>
              </div>
              <button
                onClick={handleFitScreen}
                className="px-2 py-1 bg-teal-600 hover:bg-teal-700 rounded-lg text-xs font-bold text-white flex items-center gap-1"
                title="Fit sheet to screen width"
              >
                <Maximize2 className="w-3 h-3" /> Fit
              </button>
            </div>
          </div>

          {/* Section Category Tabs â€” Horizontal Touch Scroll */}
          <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold text-slate-300 py-1 scrollbar-none">
            {['ALL', 'COVER', 'BILLING', 'CMS-1500', 'ASSESSMENT', 'PROCEDURE', 'NARRATIVE'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTabFilter(tab)}
                className={`px-2.5 py-1 rounded-md transition flex-shrink-0 ${
                  activeTabFilter === tab ? 'bg-slate-700 text-teal-300 font-bold border border-slate-600' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

        </div>

      </div>

      {qaMode && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2 print:hidden">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>Reference Sample â€” Displaying sample reference PDF overlays.</span>
        </div>
      )}

      {/* CANVAS RENDERING CONTAINER â€” Fully Responsive Wrapper */}
      <div className="overflow-x-auto p-2 sm:p-6 bg-slate-950 rounded-2xl border border-slate-800 flex justify-center print:bg-white print:p-0 print:border-none min-h-[450px]">
        
        {/* MODE 1: FULL PACKET CONTINUOUS SCROLL */}
        {viewMode === 'FULL_PACKET' && (
          <div
            className="w-full flex flex-col items-center space-y-6 print:space-y-0"
          >
            {filteredPages.map((pageDef) => (
              <div key={pageDef.id} className="relative group w-full flex flex-col items-center">
                <div className="text-[10px] font-mono text-slate-400 font-bold mb-1 print:hidden self-center">
                  PAGE {pageDef.pageNumber} OF {manifest.totalPages} â€” {pageDef.title}
                </div>
                
                {/* Scaled Sheet Container */}
                <div
                  className="w-full flex justify-center overflow-x-auto"
                  style={{ minHeight: `${1100 * zoomLevel + 20}px` }}
                >
                  <div
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease',
                      marginBottom: `${(1 - zoomLevel) * -1100}px`
                    }}
                  >
                    {renderPageComponent(pageDef)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE 2: SINGLE FORM EDIT VIEW */}
        {viewMode === 'SINGLE_FORM' && (
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="w-full max-w-2xl flex items-center justify-between bg-slate-800 p-2.5 rounded-xl text-white text-xs font-mono print:hidden">
              <button
                disabled={activePageIndex === 0}
                onClick={() => setActivePageIndex(prev => prev - 1)}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Previous</span>
              </button>
              <span className="text-[11px] truncate px-2">Page {activePageIndex + 1} / {manifest.totalPages}: <strong>{manifest.pages[activePageIndex]?.title}</strong></span>
              <button
                disabled={activePageIndex === manifest.pages.length - 1}
                onClick={() => setActivePageIndex(prev => prev + 1)}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span> <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div
              className="w-full flex justify-center overflow-x-auto"
              style={{ minHeight: `${1100 * zoomLevel + 20}px` }}
            >
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.2s ease',
                  marginBottom: `${(1 - zoomLevel) * -1100}px`
                }}
              >
                {renderPageComponent(manifest.pages[activePageIndex] || manifest.pages[0])}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
