import express from 'express';
import { getDocuments, uploadDocument, buildPatientPacket } from '../controllers/documentController.js';

const router = express.Router();

router.get('/', getDocuments);
router.post('/', uploadDocument);
router.post('/packet', buildPatientPacket);

export default router;
