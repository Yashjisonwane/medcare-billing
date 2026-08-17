import express from 'express';
import { 
  getFourBillsByCase, getBillById, createBill, addServiceLine, 
  postPayment, postAdjustment, finaliseBill, getAgingSummary 
} from '../controllers/billingController.js';

const router = express.Router();

// Register paths
router.get('/cases/bills', getFourBillsByCase); // Matches mock call getFourBillsByCase
router.get('/aging', getAgingSummary);
router.get('/bills/:id', getBillById);
router.post('/bills', createBill);
router.post('/bills/:id/service-lines', addServiceLine); // Matches addServiceLine form submit
router.post('/bills/:id/payments', postPayment);
router.post('/bills/:id/adjustments', postAdjustment);
router.post('/bills/:id/finalise', finaliseBill);

export default router;
