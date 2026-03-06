import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
    getStudentAttendance,
    getProcessionQueue,
    getCeremonyOverview,
    getCheckedInStudents,
    updateStudentCeremonyStatus,
    addToProcessionQueue,
    autoPopulateQueue,
    reorderProcessionQueue
} from '../controllers/mcController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// MC + Staff + Admin can access ceremony data
router.use(restrictTo('mc', 'staff', 'admin'));

// Student attendance (all students + check-in status)
router.get('/students', getStudentAttendance);

// Ceremony overview stats
router.get('/overview', getCeremonyOverview);

// Checked-in students (scanned tickets)
router.get('/checked-in', getCheckedInStudents);

// Procession Queue
router.get('/queue', getProcessionQueue);
router.post('/queue', addToProcessionQueue);
router.post('/queue/auto-populate', autoPopulateQueue);
router.patch('/queue/reorder', reorderProcessionQueue);
router.patch('/queue/:id/status', updateStudentCeremonyStatus);

export default router;
