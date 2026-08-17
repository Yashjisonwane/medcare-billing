import { prisma } from '../config/db.js';

/**
 * Format audit logs for frontend compatibility
 */
const formatLog = (l) => {
  if (!l) return null;
  return {
    id: l.id,
    timestamp: l.timestamp || new Date(l.createdAt).toLocaleString(),
    user: l.userName || l.user || 'Demo User',
    role: l.role || 'Clinician',
    action: l.action,
    resource: l.resource || '',
    patientId: l.patientId || 'N/A',
    ipAddress: l.ipAddress || '192.168.1.100 (Demo Session)'
  };
};

/**
 * Get audit logs list
 */
export const getLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(logs.map(formatLog));
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return res.status(500).json({ error: 'Failed to retrieve compliance audit logs.' });
  }
};

/**
 * Write compliance audit entry
 */
export const logAction = async (req, res) => {
  const { user, action, resource, patientId } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'Action parameter is required.' });
  }

  const generatedId = `audit-${Date.now()}`;
  const currentDateStr = new Date().toLocaleString();

  try {
    const newLog = await prisma.auditLog.create({
      data: {
        id: generatedId,
        userId: user?.id || null,
        userName: user?.name || user?.fullName || 'Demo User',
        user: user?.name || user?.fullName || 'Demo User',
        role: user?.role || 'Clinician',
        action,
        resource: resource || '',
        patientId: patientId || 'N/A',
        ipAddress: req.ip || '192.168.1.100',
        timestamp: currentDateStr
      }
    });

    return res.status(201).json(formatLog(newLog));
  } catch (error) {
    console.error('Error saving compliance log:', error);
    return res.status(500).json({ error: 'Failed to log compliance action.' });
  }
};
