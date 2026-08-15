// src/services/mock/mockDocumentService.js
import { INITIAL_DOCUMENTS } from './mockDataFixtures';

const STORAGE_KEY = 'medpractice_documents';

const getStoredDocuments = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENTS));
    return INITIAL_DOCUMENTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_DOCUMENTS;
  }
};

export const mockDocumentService = {
  async getDocuments(filters = {}) {
    await new Promise(res => setTimeout(res, 200));
    let docs = getStoredDocuments();
    if (filters.providerName) {
      docs = docs.filter(d => d.providerName === filters.providerName);
    }
    if (filters.type) {
      docs = docs.filter(d => d.type === filters.type);
    }
    return docs;
  },

  async uploadDocument(docData) {
    await new Promise(res => setTimeout(res, 400));
    const docs = getStoredDocuments();
    const newDoc = {
      id: `doc-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US'),
      status: 'UPLOADED_DEMO',
      size: '1.2 MB',
      ...docData
    };
    docs.unshift(newDoc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    return newDoc;
  },

  async buildPatientPacket(selectedDocIds, caseId) {
    await new Promise(res => setTimeout(res, 600)); // Simulate bundle compilation
    const docs = getStoredDocuments();
    const selectedDocs = docs.filter(d => selectedDocIds.includes(d.id));
    return {
      packetId: `PKT-${Date.now()}`,
      caseId,
      docCount: selectedDocs.length,
      estimatedPages: selectedDocs.length * 4,
      generatedAt: new Date().toLocaleString(),
      status: 'GENERATED_DEMO',
      downloadUrl: '#demo-packet-download'
    };
  }
};
