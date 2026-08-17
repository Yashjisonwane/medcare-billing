import express from 'express';
import { getProviders, createProvider, updateProvider } from '../controllers/providerController.js';

const router = express.Router();

router.get('/', getProviders);
router.post('/', createProvider);
router.put('/:id', updateProvider);

export default router;
