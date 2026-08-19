import { prisma } from '../config/db.js';

/**
 * Format document matching frontend expectations
 */
const formatDoc = (d) => {
  if (!d) return null;
  return {
    id: d.id,
    caseId: d.caseId,
    name: d.name,
    type: d.documentType || d.type || 'Other',
    documentType: d.documentType || d.type || 'Other',
    providerName: d.providerName || '',
    date: d.date || '',
    status: d.status || 'UPLOADED',
    size: d.size || '1.0 MB',
    url: d.url || '',
    uploadedAt: d.uploadedAt
  };
};

/**
 * Get documents list
 */
export const getDocuments = async (req, res) => {
  const { providerName, type } = req.query;

  try {
    const where = {};
    if (providerName) where.providerName = providerName;
    if (type) {
      where.OR = [
        { type },
        { documentType: type }
      ];
    }

    const docs = await prisma.document.findMany({
      where,
      orderBy: { uploadedAt: 'desc' }
    });

    return res.status(200).json(docs.map(formatDoc));
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ error: 'Internal server error retrieving documents.' });
  }
};

/**
 * Upload/Register document metadata
 */
export const uploadDocument = async (req, res) => {
  const data = req.body;

  if (!data.name) {
    return res.status(400).json({ error: 'name is required.' });
  }

  const generatedId = `doc-${Date.now()}`;
  const currentDateStr = new Date().toLocaleDateString('en-US');
  const targetCaseId = data.caseId || 'case-001';

  try {
    const newDoc = await prisma.document.create({
      data: {
        id: generatedId,
        caseId: targetCaseId,
        name: data.name,
        documentType: data.documentType || data.type || 'Medical Records',
        type: data.type || data.documentType || 'Medical Records',
        providerName: data.providerName || 'JOSMIC Wellness Center',
        date: data.date || currentDateStr,
        status: data.status || 'UPLOADED',
        size: data.size || '1.2 MB',
        url: data.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    });

    return res.status(201).json(formatDoc(newDoc));
  } catch (error) {
    console.error('Error saving document details:', error);
    return res.status(500).json({ error: 'Failed to upload document.' });
  }
};

/**
 * Bundle patient document packet
 */
export const buildPatientPacket = async (req, res) => {
  const { selectedDocIds, caseId } = req.body;

  if (!Array.isArray(selectedDocIds) || !caseId) {
    return res.status(400).json({ error: 'selectedDocIds (array) and caseId are required.' });
  }

  try {
    const docCount = selectedDocIds.length;
    return res.status(200).json({
      packetId: `PKT-${Date.now()}`,
      caseId,
      docCount,
      estimatedPages: docCount * 4,
      generatedAt: new Date().toLocaleString(),
      status: 'GENERATED_DEMO',
      downloadUrl: '#demo-packet-download'
    });
  } catch (error) {
    console.error('Error compiling patient packet:', error);
    return res.status(500).json({ error: 'Failed to bundle patient packet.' });
  }
};
