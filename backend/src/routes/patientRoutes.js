import express from 'express';
import { getPatients, getPatientById, createPatient, updatePatient } from '../controllers/patientController.js';

const router = express.Router();

router.get('/', getPatients);
router.get('/:id', getPatientById);
router.post('/', createPatient);
router.put('/:id', updatePatient);

export default router;
