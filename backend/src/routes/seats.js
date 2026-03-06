import express from 'express';
import { body } from 'express-validator';
import {
    getAvailableSeats,
    bookSeat,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    adminUpdateSeat,
} from '../controllers/seatController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const bookSeatValidation = [
    body('seatNumber').notEmpty().withMessage('Seat number is required'),
    body('seatType').isIn(['student', 'guest']).withMessage('Invalid seat type'),
];

// Routes
router.get('/', protect, getAvailableSeats);
router.post('/book', protect, authorize('student'), bookSeatValidation, validate, bookSeat);
router.get('/my-bookings', protect, getMyBookings);
router.delete('/:id', protect, cancelBooking);
router.get('/all', protect, authorize('admin', 'staff', 'mc'), getAllBookings);
router.patch('/:id/admin-update', protect, authorize('admin', 'staff', 'mc'), adminUpdateSeat);

export default router;
