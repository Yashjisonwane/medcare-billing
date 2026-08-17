import express from 'express';
import { getCases, getCaseById, createCase, updateAssignedProviders } from '../controllers/caseController.js';

const router = express.Router();

router.get('/', getCases);
router.get('/:id', getCaseById);
router.post('/', createCase);
router.put('/:id/providers', updateAssignedProviders);

export default router;
