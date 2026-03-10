import express from 'express';
import { getRefundStatus, processRefund, bulkProcessRefunds } from '../controllers/financeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'staff'));

router.get('/refunds', getRefundStatus);
router.patch('/refund/:id', processRefund);
router.post('/refund/bulk', bulkProcessRefunds);

export default router;
