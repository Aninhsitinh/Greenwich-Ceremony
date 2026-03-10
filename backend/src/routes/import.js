import express from 'express';
import multer from 'multer';
import { importStudents, importPayments } from '../controllers/importController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// All import routes are protected and restricted to staff/admin
router.use(protect);
router.use(authorize('admin', 'staff'));

router.post('/students', upload.single('file'), importStudents);
router.post('/payments', upload.single('file'), importPayments);

export default router;
