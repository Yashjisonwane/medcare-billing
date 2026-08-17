import { prisma } from '../config/db.js';

/**
 * Format a DB Case record to match frontend model structure
 */
const formatCase = (c) => {
  if (!c) return null;
  return {
    id: c.id,
    caseId: c.caseId,
    patientId: c.patientId,
    patientName: c.patient ? `${c.patient.firstName} ${c.patient.lastName}`.trim() : 'Unknown Patient',
    accidentDate: c.accidentDate,
    initialDate: c.initialDate,
    dischargeDate: c.dischargeDate,
    accidentType: c.accidentType,
    accidentState: c.accidentState,
    accidentCity: c.accidentCity,
    accidentLocation: c.accidentLocation,
    mechanismOfInjury: c.mechanismOfInjury,
    policeReportNumber: c.policeReportNumber,
    emergencyTransport: c.emergencyTransport,
    chiefComplaint: c.chiefComplaint,
    injuryBodyParts: c.injuryBodyParts,
    diagnosisCodes: typeof c.diagnosisCodes === 'string' ? JSON.parse(c.diagnosisCodes) : c.diagnosisCodes || [],
    referringProviderName: c.referringProviderName,
    referringProviderNpi: c.referringProviderNpi,
    attorneyName: c.attorneyName,
    lawFirm: c.lawFirm,
    attorneyAddress: c.attorneyAddress,
    attorneyPhone: c.attorneyPhone,
    attorneyEmail: c.attorneyEmail,
    lawFirmAddress: c.lawFirmAddress,
    litigationStatus: c.litigationStatus,
    insuranceCompany: c.insuranceCompany,
    insurancePolicyNumber: c.insurancePolicyNumber,
    insuranceClaimNumber: c.insuranceClaimNumber,
    insuranceAdjuster: c.insuranceAdjuster,
    insuranceAdjusterPhone: c.insuranceAdjusterPhone,
    liabilityStatus: c.liabilityStatus,
    caseNotes: c.caseNotes,
    assignedProviderIds: typeof c.assignedProviderIds === 'string' ? JSON.parse(c.assignedProviderIds) : c.assignedProviderIds || [],
    status: c.status,
    createdAt: c.createdAt
  };
};

/**
 * Get cases list (supports search and patientId filter)
 */
export const getCases = async (req, res) => {
  const { search, patientId } = req.query;

  try {
    const where = {};

    if (patientId) {
      where.patientId = patientId;
    }

    if (search) {
      const q = search.toLowerCase();
      where.OR = [
        { caseId: { contains: q } },
        { attorneyName: { contains: q } },
        { lawFirm: { contains: q } },
        { patient: { firstName: { contains: q } } },
        { patient: { lastName: { contains: q } } }
      ];
    }

    const cases = await prisma.case.findMany({
      where,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(cases.map(formatCase));
  } catch (error) {
    console.error('Error fetching cases:', error);
    return res.status(500).json({ error: 'Internal server error fetching cases.' });
  }
};

/**
 * Get case details by ID
 */
export const getCaseById = async (req, res) => {
  const { id } = req.params;

  try {
    const caseObj = await prisma.case.findFirst({
      where: {
        OR: [
          { id },
          { caseId: id }
        ]
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!caseObj) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    return res.status(200).json(formatCase(caseObj));
  } catch (error) {
    console.error('Error fetching case by ID:', error);
    return res.status(500).json({ error: 'Failed to retrieve case details.' });
  }
};

/**
 * Register new case for a patient
 */
export const createCase = async (req, res) => {
  const data = req.body;

  if (!data.patientId || !data.accidentType || !data.accidentState) {
    return res.status(400).json({ error: 'patientId, accidentType, and accidentState are required.' });
  }

  const generatedId = `case-${Date.now()}`;
  const generatedCaseStr = `CASE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  try {
    // Confirm patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Associated patient not found.' });
    }

    const newCase = await prisma.case.create({
      data: {
        id: generatedId,
        caseId: generatedCaseStr,
        patientId: data.patientId,
        accidentDate: data.accidentDate || '',
        initialDate: data.initialDate || '',
        dischargeDate: data.dischargeDate || '',
        accidentType: data.accidentType,
        accidentState: data.accidentState,
        accidentCity: data.accidentCity || '',
        accidentLocation: data.accidentLocation || '',
        mechanismOfInjury: data.mechanismOfInjury || '',
        policeReportNumber: data.policeReportNumber || '',
        emergencyTransport: data.emergencyTransport || '',
        chiefComplaint: data.chiefComplaint || '',
        injuryBodyParts: data.injuryBodyParts || '',
        diagnosisCodes: data.diagnosisCodes || [],
        referringProviderName: data.referringProviderName || '',
        referringProviderNpi: data.referringProviderNpi || '',
        attorneyName: data.attorneyName || '',
        lawFirm: data.lawFirm || '',
        attorneyAddress: data.attorneyAddress || '',
        attorneyPhone: data.attorneyPhone || '',
        attorneyEmail: data.attorneyEmail || '',
        lawFirmAddress: data.lawFirmAddress || '',
        litigationStatus: data.litigationStatus || 'UNFILED',
        insuranceCompany: data.insuranceCompany || '',
        insurancePolicyNumber: data.insurancePolicyNumber || '',
        insuranceClaimNumber: data.insuranceClaimNumber || '',
        insuranceAdjuster: data.insuranceAdjuster || '',
        insuranceAdjusterPhone: data.insuranceAdjusterPhone || '',
        liabilityStatus: data.liabilityStatus || 'PENDING',
        caseNotes: data.caseNotes || '',
        assignedProviderIds: data.assignedProviderIds || ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor'],
        status: 'ACTIVE'
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return res.status(201).json(formatCase(newCase));
  } catch (error) {
    console.error('Error creating case:', error);
    return res.status(500).json({ error: 'Failed to register patient case.' });
  }
};

/**
 * Update case assigned providers
 */
export const updateAssignedProviders = async (req, res) => {
  const { id } = req.params;
  const { providerIds } = req.body;

  if (!Array.isArray(providerIds)) {
    return res.status(400).json({ error: 'providerIds must be an array.' });
  }

  try {
    const existing = await prisma.case.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    const updated = await prisma.case.update({
      where: { id },
      data: {
        assignedProviderIds: providerIds
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return res.status(200).json(formatCase(updated));
  } catch (error) {
    console.error('Error updating case assigned providers:', error);
    return res.status(500).json({ error: 'Failed to update assigned providers.' });
  }
};
