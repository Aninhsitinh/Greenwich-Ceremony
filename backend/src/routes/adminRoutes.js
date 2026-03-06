import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
    getAllUsers,
    updateUserRole
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

// User Management
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);

export default router;
