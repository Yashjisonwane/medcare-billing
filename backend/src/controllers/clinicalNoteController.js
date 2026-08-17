import { prisma } from '../config/db.js';

/**
 * Format a DB ClinicalNote record to match frontend expectations
 */
const formatNote = (n) => {
  if (!n) return null;
  return {
    id: n.id,
    patientId: n.patientId,
    patientName: n.patient ? `${n.patient.firstName} ${n.patient.lastName}`.trim() : 'Unknown Patient',
    caseId: n.caseId,
    providerId: n.providerId,
    providerName: n.provider?.name || 'Unknown Provider',
    type: n.noteType,
    noteType: n.noteType,
    title: n.title,
    date: n.date,
    status: n.status,
    author: n.author,
    signedBy: n.signedBy,
    signedAt: n.signedAt,
    signatureUrl: n.signatureUrl,
    soapSubjective: n.soapSubjective || '',
    soapObjective: n.soapObjective || '',
    soapAssessment: n.soapAssessment || '',
    soapPlan: n.soapPlan || '',
    anatomicalDiagramData: n.anatomicalDiagramData || '',
    content: typeof n.content === 'string' ? JSON.parse(n.content) : n.content || {},
    addendums: typeof n.addendums === 'string' ? JSON.parse(n.addendums) : n.addendums || [],
    createdAt: n.createdAt
  };
};

/**
 * Get clinical notes list with optional filters
 */
export const getNotes = async (req, res) => {
  const { patientId, providerId, status } = req.query;

  try {
    const where = {};
    if (patientId) where.patientId = patientId;
    if (providerId) where.providerId = providerId;
    if (status) where.status = status;

    const notes = await prisma.clinicalNote.findMany({
      where,
      include: {
        patient: { select: { firstName: true, lastName: true } },
        provider: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(notes.map(formatNote));
  } catch (error) {
    console.error('Error fetching clinical notes:', error);
    return res.status(500).json({ error: 'Internal server error fetching notes.' });
  }
};

/**
 * Get clinical note by ID
 */
export const getNoteById = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await prisma.clinicalNote.findUnique({
      where: { id },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        provider: { select: { name: true } }
      }
    });

    if (!note) {
      return res.status(404).json({ error: 'Clinical note not found.' });
    }

    return res.status(200).json(formatNote(note));
  } catch (error) {
    console.error('Error fetching note by ID:', error);
    return res.status(500).json({ error: 'Failed to retrieve clinical note.' });
  }
};

/**
 * Create clinical note draft
 */
export const createNote = async (req, res) => {
  const data = req.body;

  if (!data.patientId || !data.caseId || !data.providerId || !data.type) {
    return res.status(400).json({ error: 'patientId, caseId, providerId, and type are required.' });
  }

  const generatedId = `note-${Date.now()}`;
  const currentDateStr = new Date().toLocaleDateString('en-US');

  try {
    const newNote = await prisma.clinicalNote.create({
      data: {
        id: generatedId,
        patientId: data.patientId,
        caseId: data.caseId,
        providerId: data.providerId,
        noteType: data.type,
        title: data.title || 'Clinical Evaluation',
        date: currentDateStr,
        status: 'DRAFT',
        author: data.author || 'Attending Clinician',
        soapSubjective: data.soapSubjective || '',
        soapObjective: data.soapObjective || '',
        soapAssessment: data.soapAssessment || '',
        soapPlan: data.soapPlan || '',
        content: data.content || {},
        addendums: []
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        provider: { select: { name: true } }
      }
    });

    return res.status(201).json(formatNote(newNote));
  } catch (error) {
    console.error('Error creating clinical note:', error);
    return res.status(500).json({ error: 'Failed to create clinical note draft.' });
  }
};

/**
 * Sign and lock clinical note
 */
export const signNote = async (req, res) => {
  const { id } = req.params;
  const { signatureUrl, authorName } = req.body;

  if (!signatureUrl) {
    return res.status(400).json({ error: 'signatureUrl is required to sign note.' });
  }

  try {
    const existing = await prisma.clinicalNote.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Clinical note not found.' });
    }

    const updated = await prisma.clinicalNote.update({
      where: { id },
      data: {
        status: 'SIGNED_LOCKED',
        signatureUrl,
        signedBy: authorName || 'Authorized Physician',
        signedAt: new Date(),
        author: authorName || existing.author
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        provider: { select: { name: true } }
      }
    });

    return res.status(200).json(formatNote(updated));
  } catch (error) {
    console.error('Error signing clinical note:', error);
    return res.status(500).json({ error: 'Failed to sign clinical note.' });
  }
};

/**
 * Amend note adding addendums
 */
export const amendNote = async (req, res) => {
  const { id } = req.params;
  const { addendumText, authorName } = req.body;

  if (!addendumText) {
    return res.status(400).json({ error: 'addendumText is required to amend note.' });
  }

  try {
    const existing = await prisma.clinicalNote.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Clinical note not found.' });
    }

    const currentAddendums = typeof existing.addendums === 'string' 
      ? JSON.parse(existing.addendums) 
      : existing.addendums || [];

    const newAddendum = {
      id: `addendum-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      author: authorName || 'Clinician',
      text: addendumText
    };

    const updated = await prisma.clinicalNote.update({
      where: { id },
      data: {
        status: 'AMENDED',
        addendums: [...currentAddendums, newAddendum]
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        provider: { select: { name: true } }
      }
    });

    return res.status(200).json(formatNote(updated));
  } catch (error) {
    console.error('Error amending clinical note:', error);
    return res.status(500).json({ error: 'Failed to amend clinical note.' });
  }
};

/**
 * Generate AI SOAP suggested text drafts
 */
export const generateAiDraft = async (req, res) => {
  const { promptType, inputData } = req.body;

  if (!promptType) {
    return res.status(400).json({ error: 'promptType is required.' });
  }

  const patientName = inputData?.patientName || 'Demo Patient 001';
  const complaints = inputData?.complaints || 'neck and low back stiffness following auto accident';
  const locations = Array.isArray(inputData?.painLocations) ? inputData.painLocations.join(', ') : 'Neck, Lower Back';

  let draftText = '';

  if (promptType === 'HPI') {
    draftText = `HISTORY OF PRESENT ILLNESS (AI DRAFT):\nThe patient, ${patientName}, presents with acute onset discomfort localized to the ${locations}. Symptoms initiated immediately following a motor vehicle collision. Pain is characterized as sharp and throbbing with functional restrictions during lumbar extension and neck rotation. Patient reports current pain level as 7/10.`;
  } else if (promptType === 'EXAM') {
    draftText = `PHYSICAL EXAMINATION SUMMARY (AI DRAFT):\nInspection: No visible acute trauma or deformity. Palpation demonstrates marked tenderness and bilateral muscle spasm along the paraspinal musculature. Range of Motion: Cervical extension and lumbar flexion are moderately restricted due to discomfort. Neurologic: Intact sensation and 5/5 motor strength bilaterally.`;
  } else if (promptType === 'ASSESSMENT') {
    draftText = `ASSESSMENT & PLAN DRAFT (AI DRAFT):\nDiagnoses: 1. Cervical sprain/strain (S13.4). 2. Lumbar strain (S33.5). 3. Myofascial pain syndrome (M79.1).\nPlan: Initiate conservative physical therapy, ESWT radial shockwave therapy, and laser therapy. Re-evaluate clinical progress in 4 weeks. Patient instructed on home stretching and posture ergonomics.`;
  } else {
    draftText = `CLINICAL SUMMARY (AI DRAFT):\n${patientName} continues to undergo structured multi-provider care for accident-related injuries (${complaints}). Patient demonstrates steady progress with reduced localized tenderness following ongoing laser and shockwave treatment sessions.`;
  }

  return res.status(200).json({
    draftText,
    disclaimer: 'AI-generated content is a draft and must be reviewed and approved by an authorized healthcare provider.',
    generatedAt: new Date().toLocaleTimeString()
  });
};
