// src/constants/packetManifests.js

/**
 * Provider-Specific Page Manifests
 * ANIK: 16 Pages
 * DAV'S: 14 Pages
 * JOSMIC: 7 Pages
 */

export const PACKET_MANIFESTS = {
  'prov-anik': {
    providerId: 'prov-anik',
    providerName: 'ANIK Laser Therapy',
    totalPages: 16,
    pages: [
      { pageNumber: 1, id: 'anik-cover', type: 'COVER', title: 'Patient & Case Cover Page', componentKey: 'AnikCoverPage' },
      { pageNumber: 2, id: 'anik-bill-1', type: 'BILLING', title: 'Provider Billing Statement (Page 1)', componentKey: 'PrintableBillingStatement', pageIndex: 0 },
      { pageNumber: 3, id: 'anik-bill-2', type: 'BILLING', title: 'Provider Billing Statement (Page 2 - Ledger)', componentKey: 'PrintableBillingStatement', pageIndex: 1 },
      { pageNumber: 4, id: 'anik-cms-1', type: 'CMS-1500', title: 'CMS-1500 Claim (01/22/2026)', componentKey: 'CmsRedGridForm', claimIndex: 0 },
      { pageNumber: 5, id: 'anik-cms-2', type: 'CMS-1500', title: 'CMS-1500 Claim (01/24/2026)', componentKey: 'CmsRedGridForm', claimIndex: 1 },
      { pageNumber: 6, id: 'anik-cms-3', type: 'CMS-1500', title: 'CMS-1500 Claim (01/26/2026)', componentKey: 'CmsRedGridForm', claimIndex: 2 },
      { pageNumber: 7, id: 'anik-assess', type: 'ASSESSMENT', title: 'Therapy Assessment Chart', componentKey: 'AnikTherapyAssessmentForm' },
      { pageNumber: 8, id: 'anik-proc-1', type: 'PROCEDURE', title: 'Laser Procedure Form (01/22/2026)', componentKey: 'AnikLaserProcedureForm', dos: '01/22/2026' },
      { pageNumber: 9, id: 'anik-proc-2', type: 'PROCEDURE', title: 'Laser Procedure Form (01/24/2026)', componentKey: 'AnikLaserProcedureForm', dos: '01/24/2026' },
      { pageNumber: 10, id: 'anik-proc-3', type: 'PROCEDURE', title: 'Laser Procedure Form (01/26/2026)', componentKey: 'AnikLaserProcedureForm', dos: '01/26/2026' },
      { pageNumber: 11, id: 'anik-narr-1', type: 'NARRATIVE', title: 'Initial Narrative Report (Page 1)', componentKey: 'AnikNarrativeReport', reportPage: 1 },
      { pageNumber: 12, id: 'anik-narr-2', type: 'NARRATIVE', title: 'Initial Narrative Report (Page 2)', componentKey: 'AnikNarrativeReport', reportPage: 2 },
      { pageNumber: 13, id: 'anik-narr-3', type: 'NARRATIVE', title: 'Initial Narrative Report (Page 3)', componentKey: 'AnikNarrativeReport', reportPage: 3 },
      { pageNumber: 14, id: 'anik-final-1', type: 'NARRATIVE', title: 'Final Medical / Discharge Report (Page 1)', componentKey: 'AnikFinalReport', reportPage: 1 },
      { pageNumber: 15, id: 'anik-final-2', type: 'NARRATIVE', title: 'Final Medical / Discharge Report (Page 2)', componentKey: 'AnikFinalReport', reportPage: 2 },
      { pageNumber: 16, id: 'anik-final-3', type: 'NARRATIVE', title: 'Final Medical / Discharge Report (Page 3)', componentKey: 'AnikFinalReport', reportPage: 3 },
    ]
  },

  'prov-davs': {
    providerId: 'prov-davs',
    providerName: "DAV'S Anatomy",
    totalPages: 14,
    pages: [
      { pageNumber: 1, id: 'davs-cover', type: 'COVER', title: 'Patient & Case Cover Page', componentKey: 'DavCoverPage' },
      { pageNumber: 2, id: 'davs-bill-1', type: 'BILLING', title: 'Provider Billing Statement (Page 1)', componentKey: 'PrintableBillingStatement', pageIndex: 0 },
      { pageNumber: 3, id: 'davs-bill-2', type: 'BILLING', title: 'Provider Billing Statement (Page 2 - Ledger)', componentKey: 'PrintableBillingStatement', pageIndex: 1 },
      { pageNumber: 4, id: 'davs-cms-1', type: 'CMS-1500', title: 'CMS-1500 Claim (01/06/2026)', componentKey: 'CmsRedGridForm', claimIndex: 0 },
      { pageNumber: 5, id: 'davs-cms-2', type: 'CMS-1500', title: 'CMS-1500 Claim (01/07/2026)', componentKey: 'CmsRedGridForm', claimIndex: 1 },
      { pageNumber: 6, id: 'davs-cms-3', type: 'CMS-1500', title: 'CMS-1500 Claim (01/08/2026)', componentKey: 'CmsRedGridForm', claimIndex: 2 },
      { pageNumber: 7, id: 'davs-proc-1', type: 'PROCEDURE', title: 'ESWT Shockwave Form (01/06/2026)', componentKey: 'DavEswtProcedureForm', dos: '01/06/2026' },
      { pageNumber: 8, id: 'davs-proc-2', type: 'PROCEDURE', title: 'ESWT Shockwave Form (01/07/2026)', componentKey: 'DavEswtProcedureForm', dos: '01/07/2026' },
      { pageNumber: 9, id: 'davs-proc-3', type: 'PROCEDURE', title: 'ESWT Shockwave Form (01/08/2026)', componentKey: 'DavEswtProcedureForm', dos: '01/08/2026' },
      { pageNumber: 10, id: 'davs-prog-1', type: 'ASSESSMENT', title: 'Clinical Progress Note (Page 1)', componentKey: 'DavProgressNote', notePage: 1 },
      { pageNumber: 11, id: 'davs-prog-2', type: 'ASSESSMENT', title: 'Clinical Progress Note (Page 2)', componentKey: 'DavProgressNote', notePage: 2 },
      { pageNumber: 12, id: 'davs-final-1', type: 'NARRATIVE', title: 'Shockwave Narrative Report (Page 1)', componentKey: 'DavFinalNarrative', reportPage: 1 },
      { pageNumber: 13, id: 'davs-final-2', type: 'NARRATIVE', title: 'Shockwave Narrative Report (Page 2)', componentKey: 'DavFinalNarrative', reportPage: 2 },
      { pageNumber: 14, id: 'davs-final-3', type: 'NARRATIVE', title: 'Shockwave Narrative Report (Page 3)', componentKey: 'DavFinalNarrative', reportPage: 3 },
    ]
  },

  'prov-josmic': {
    providerId: 'prov-josmic',
    providerName: 'JOSMIC Wellness Center',
    totalPages: 7,
    pages: [
      { pageNumber: 1, id: 'josmic-cover', type: 'COVER', title: 'Patient & Case Cover Page', componentKey: 'JosmicCoverPage' },
      { pageNumber: 2, id: 'josmic-bill-1', type: 'BILLING', title: 'Provider Billing Statement', componentKey: 'PrintableBillingStatement', pageIndex: 0 },
      { pageNumber: 3, id: 'josmic-cms-1', type: 'CMS-1500', title: 'CMS-1500 Claim (12/30/2025)', componentKey: 'CmsRedGridForm', claimIndex: 0 },
      { pageNumber: 4, id: 'josmic-pain-1', type: 'NARRATIVE', title: 'Pain Management Report (Page 1)', componentKey: 'JosmicPainManagementReport', reportPage: 1 },
      { pageNumber: 5, id: 'josmic-pain-2', type: 'NARRATIVE', title: 'Pain Management Report (Page 2)', componentKey: 'JosmicPainManagementReport', reportPage: 2 },
      { pageNumber: 6, id: 'josmic-pain-3', type: 'NARRATIVE', title: 'Pain Management Report (Page 3)', componentKey: 'JosmicPainManagementReport', reportPage: 3 },
      { pageNumber: 7, id: 'josmic-pain-4', type: 'NARRATIVE', title: 'Pain Management Report (Page 4)', componentKey: 'JosmicPainManagementReport', reportPage: 4 },
    ]
  },

  'prov-counselor': {
    providerId: 'prov-counselor',
    providerName: 'Counselor Practice (Hope Behavioral Health)',
    totalPages: 4,
    pages: [
      { pageNumber: 1, id: 'counselor-cover', type: 'COVER', title: 'Patient & Case Cover Page', componentKey: 'CounselorCoverPage' },
      { pageNumber: 2, id: 'counselor-assess', type: 'ASSESSMENT', title: 'Behavioral Health & Psychotherapy Assessment', componentKey: 'CounselorAssessmentForm' },
      { pageNumber: 3, id: 'counselor-bill-1', type: 'BILLING', title: 'Provider Billing Statement (#1024-C)', componentKey: 'PrintableBillingStatement', pageIndex: 0 },
      { pageNumber: 4, id: 'counselor-cms-1', type: 'CMS-1500', title: 'CMS-1500 Claim (01/05/2026)', componentKey: 'CmsRedGridForm', claimIndex: 0 },
    ]
  }
};

