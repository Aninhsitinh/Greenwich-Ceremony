import express from 'express';
import { body } from 'express-validator';
import {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    broadcastNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const broadcastValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
];

// Routes
router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);
router.post('/broadcast', protect, authorize('admin'), broadcastValidation, validate, broadcastNotification);

export default router;
