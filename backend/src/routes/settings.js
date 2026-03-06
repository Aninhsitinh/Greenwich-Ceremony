import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route to get settings (needed for dashboard/countdown)
// Alternatively, could be protected if only logged-in users see dashboard
router.get('/', getSettings);

// Protected route to update settings (Admin/Staff only)
router.put('/', protect, authorize('admin'), updateSettings);

export default router;
