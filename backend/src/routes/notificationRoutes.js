// backend/src/routes/notificationRoutes.js
import express from 'express';
import { testEmailDispatch, getNotificationLogs } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/test-email', testEmailDispatch);
router.get('/logs', getNotificationLogs);

export default router;
