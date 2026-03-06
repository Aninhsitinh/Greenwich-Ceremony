import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
    getDashboardStatistics,
    getRecentRegistrations,
    getAllRegistrations,
    getGownCollectionList,
    updateGownStatus,
    getSeatManagementData,
    getStudentList,
    toggleStudentStatus,
    getStaffProfile,
    updateStaffProfile,
    getUserPayments
} from '../controllers/staffController.js';

const router = express.Router();

// All routes require staff or admin role
router.use(protect);
router.use(restrictTo('staff', 'admin'));

// Dashboard statistics
router.get('/statistics', getDashboardStatistics);

// Registrations
router.get('/registrations', getAllRegistrations);
router.get('/registrations/recent', getRecentRegistrations);

// Gown Collection
router.get('/gown-collection', getGownCollectionList);
router.patch('/gown-collection/:gownCollectionId', updateGownStatus);

// Seat Management
router.get('/seat-management', getSeatManagementData);

// Students
router.get('/students', getStudentList);
router.patch('/students/:id/status', toggleStudentStatus);
router.get('/students/:id/payments', getUserPayments);

// Profile
router.get('/profile', getStaffProfile);
router.patch('/profile', updateStaffProfile);

export default router;
