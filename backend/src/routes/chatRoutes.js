import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getConversations, getMessages, markAsRead } from '../controllers/chatController.js';

const router = express.Router();

// Apply protection to all chat routes
router.use(protect);

// Staff/Admin routes
router.get('/conversations', authorize('admin', 'staff'), getConversations);

// Shared routes (access control inside controller based on roomId)
router.get('/:roomId/messages', getMessages);
router.put('/:roomId/read', markAsRead);

export default router;
