import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
    requestGownCollection,
    getMyGownRequest,
    markAsCollected,
    markAsReturned,
    getAllGownRequests,
    updateGownRequest
} from '../controllers/gownController.js';

const router = express.Router();

// Private routes (authenticated users)
router.use(protect);

// Student routes
router.post('/request', requestGownCollection);
router.get('/my-request', getMyGownRequest);
router.put('/:id', updateGownRequest);

// Admin/Staff routes
router.get('/', authorize('admin', 'staff'), getAllGownRequests);
router.put('/:id/collect', authorize('admin', 'staff'), markAsCollected);
router.put('/:id/return', authorize('admin', 'staff'), markAsReturned);

export default router;
