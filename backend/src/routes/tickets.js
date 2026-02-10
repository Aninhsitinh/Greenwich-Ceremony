import express from 'express';
import { body } from 'express-validator';
import {
    generateTicket,
    getMyTickets,
    getTicketByNumber,
    scanTicket,
    getAllTickets,
    getTicketStats,
} from '../controllers/ticketController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const scanTicketValidation = [
    body('ticketNumber').notEmpty().withMessage('Ticket number is required'),
];

// Routes
router.post('/generate', protect, authorize('student'), generateTicket);
router.get('/me', protect, getMyTickets);
router.get('/stats', protect, authorize('admin', 'staff'), getTicketStats);
router.get('/:ticketNumber', protect, authorize('staff', 'admin'), getTicketByNumber);
router.post('/scan', protect, authorize('staff', 'admin'), scanTicketValidation, validate, scanTicket);
router.get('/', protect, authorize('admin'), getAllTickets);

export default router;
