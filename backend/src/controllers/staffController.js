import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';

/**
 * Format DB User matching frontend staff profile schema
 */
const formatStaff = (u) => {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email,
    name: u.name || u.fullName || 'Staff User',
    role: u.role,
    title: u.title || 'Specialist',
    status: u.status || 'ACTIVE',
    avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
  };
};

/**
 * Get staff registry
 */
export const getStaff = async (req, res) => {
  try {
    const staff = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(staff.map(formatStaff));
  } catch (error) {
    console.error('Error fetching staff directory:', error);
    return res.status(500).json({ error: 'Failed to retrieve staff directory.' });
  }
};

/**
 * Register new staff account
 */
export const createStaff = async (req, res) => {
  const data = req.body;

  if (!data.email || !data.role || !data.name) {
    return res.status(400).json({ error: 'email, role, and name are required fields.' });
  }

  const generatedId = `usr-${Date.now()}`;

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const newStaff = await prisma.user.create({
      data: {
        id: generatedId,
        email: data.email,
        passwordHash,
        name: data.name,
        fullName: data.name,
        role: data.role,
        title: data.title || 'Staff Specialist',
        avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        status: 'ACTIVE'
      }
    });

    return res.status(201).json(formatStaff(newStaff));
  } catch (error) {
    console.error('Error creating staff profile:', error);
    return res.status(500).json({ error: 'Failed to register staff profile.' });
  }
};
