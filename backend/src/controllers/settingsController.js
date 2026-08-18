import { prisma } from '../config/db.js';
import { logger } from '../config/logger.js';

export const getSettings = async (req, res) => {
  try {
    let setting = await prisma.generalSetting.findUnique({
      where: { id: 'default' }
    });
    
    if (!setting) {
      return res.status(200).json({ data: null });
    }
    
    return res.status(200).json(setting.data);
  } catch (error) {
    logger.error('Error fetching general settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settingsData = req.body;
    
    const setting = await prisma.generalSetting.upsert({
      where: { id: 'default' },
      update: { data: settingsData },
      create: { id: 'default', data: settingsData }
    });
    
    return res.status(200).json(setting.data);
  } catch (error) {
    logger.error('Error updating general settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
