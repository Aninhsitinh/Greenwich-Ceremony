import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
    createPayment,
    getMyPayments,
    getPaymentById,
    updatePaymentStatus,
    getAllPayments,
    generateReceipt,
    sendOTP
} from '../controllers/paymentController.js';

const router = express.Router();

// Private routes (authenticated users)
router.use(protect);

// Student routes
router.post('/', createPayment);
router.post('/otp', sendOTP);
router.get('/my-payments', getMyPayments);
router.get('/:id', getPaymentById);
router.get('/:id/receipt', generateReceipt);

// Admin/Staff routes
router.get('/', authorize('admin', 'staff'), getAllPayments);
router.put('/:id', authorize('admin', 'staff'), updatePaymentStatus);

export default router;
