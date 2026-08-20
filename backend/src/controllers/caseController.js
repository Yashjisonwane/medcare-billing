import { prisma } from '../config/db.js';

/**
 * Format a DB Case record to match frontend model structure
 */
const formatCase = (c) => {
  if (!c) return null;
  const p = c.patient || {};
  const rawDx = typeof c.diagnosisCodes === 'string' ? JSON.parse(c.diagnosisCodes) : c.diagnosisCodes;
  const dxList = Array.isArray(rawDx) && rawDx.length > 0 ? rawDx : ['M54.50', 'M54.2', 'S13.4', 'M25.572'];

  return {
    id: c.id,
    caseId: c.caseId,
    patientId: c.patientId,
    patientName: p.firstName ? `${p.firstName} ${p.lastName}`.trim() : (c.patientName || 'Patient Record'),
    patient: {
      id: p.id || c.patientId,
      patientId: p.patientId || c.patientId,
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      dob: p.dob || '05/15/1985',
      sex: p.sex || 'M',
      gender: p.sex || 'M',
      phone: p.phone || '(713) 555-0199',
      email: p.email || '',
      address: p.addressLine1 ? `${p.addressLine1}, ${p.city || 'Houston'}, ${p.state || 'TX'} ${p.zipCode || '77036'}`.trim() : '10101 Harwin Dr., Houston, TX 77036'
    },
    patientDob: p.dob || '05/15/1985',
    patientSex: p.sex || 'M',
    patientAddress: p.addressLine1 ? `${p.addressLine1}, ${p.city || 'Houston'}, ${p.state || 'TX'} ${p.zipCode || '77036'}`.trim() : '10101 Harwin Dr., Houston, TX 77036',
    patientPhone: p.phone || '(713) 555-0199',
    accidentDate: c.accidentDate || '2026-08-16',
    initialDate: c.initialDate || '2026-08-17',
    dischargeDate: c.dischargeDate || '2026-08-19',
    accidentType: c.accidentType || 'AUTO_ACCIDENT',
    accidentState: c.accidentState || 'TX',
    accidentCity: c.accidentCity || 'Houston',
    accidentLocation: c.accidentLocation || 'Houston, TX Metro Area',
    mechanismOfInjury: c.mechanismOfInjury || 'Motor Vehicle Collision with sudden rear-impact deceleration injury',
    policeReportNumber: c.policeReportNumber || 'HPD-2026-88192',
    emergencyTransport: c.emergencyTransport || 'NONE',
    chiefComplaint: c.chiefComplaint || 'Cervicalgia, Lower back tenderness & soft tissue pain',
    injuryBodyParts: c.injuryBodyParts || 'Neck, Low Back, Left Ankle',
    diagnosisCodes: dxList,
    referringProviderName: c.referringProviderName || 'Dr. Segun Adeoye',
    referringProviderNpi: c.referringProviderNpi || '1234567890',
    attorneyName: c.attorneyName || 'Self-Represented (Direct Patient)',
    lawFirm: c.lawFirm || 'Direct Billing / Patient Agreement',
    attorneyAddress: c.attorneyAddress || '11711 Bedford St. Suite 01, Houston, TX 77031',
    attorneyPhone: c.attorneyPhone || '(713) 555-0188',
    attorneyEmail: c.attorneyEmail || 'legal@ojlawfirm.com',
    lawFirmAddress: c.lawFirmAddress || '11711 Bedford St. Suite 01, Houston, TX 77031',
    litigationStatus: c.litigationStatus || 'PRE_LITIGATION',
    insuranceCompany: c.insuranceCompany || 'Geico Auto Insurance Co.',
    insurancePolicyNumber: c.insurancePolicyNumber || 'POL-9928374',
    insuranceClaimNumber: c.insuranceClaimNumber || 'CLM-2025-88192',
    insuranceAdjuster: c.insuranceAdjuster || 'James Wilson',
    insuranceAdjusterPhone: c.insuranceAdjusterPhone || '800-555-0299',
    liabilityStatus: c.liabilityStatus || 'LIABILITY_ACCEPTED',
    caseNotes: c.caseNotes || '',
    assignedProviderIds: typeof c.assignedProviderIds === 'string' ? JSON.parse(c.assignedProviderIds) : c.assignedProviderIds || ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor'],
    status: c.status || 'ACTIVE',
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
        patient: true
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
        patient: true
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

/**
 * Update entire case (including Attorney & Law Firm)
 */
export const updateCase = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const existing = await prisma.case.findFirst({
      where: {
        OR: [{ id }, { caseId: id }]
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    const updated = await prisma.case.update({
      where: { id: existing.id },
      data: {
        ...(data.attorneyName !== undefined && { attorneyName: data.attorneyName }),
        ...(data.lawFirm !== undefined && { lawFirm: data.lawFirm }),
        ...(data.attorneyPhone !== undefined && { attorneyPhone: data.attorneyPhone }),
        ...(data.attorneyEmail !== undefined && { attorneyEmail: data.attorneyEmail }),
        ...(data.lawFirmAddress !== undefined && { lawFirmAddress: data.lawFirmAddress }),
        ...(data.insuranceCompany !== undefined && { insuranceCompany: data.insuranceCompany }),
        ...(data.insurancePolicyNumber !== undefined && { insurancePolicyNumber: data.insurancePolicyNumber }),
        ...(data.insuranceClaimNumber !== undefined && { insuranceClaimNumber: data.insuranceClaimNumber }),
        ...(data.status !== undefined && { status: data.status })
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
    console.error('Error updating case:', error);
    return res.status(500).json({ error: 'Failed to update case.' });
  }
};

/**
 * Delete case by ID
 */
export const deleteCase = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.case.findFirst({
      where: {
        OR: [{ id }, { caseId: id }]
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Case record not found.' });
    }

    await prisma.case.delete({
      where: { id: existing.id }
    });

    return res.status(200).json({ success: true, message: `Accident Case ${existing.caseId} deleted.` });
  } catch (error) {
    console.error('Error deleting case:', error);
    return res.status(500).json({ error: 'Failed to delete accident case.' });
  }
};
