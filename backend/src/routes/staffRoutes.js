import express from 'express';
import { getStaff, createStaff } from '../controllers/staffController.js';

const router = express.Router();

router.get('/', getStaff);
router.post('/', createStaff);

export default router;
