import express from 'express';
import { body } from 'express-validator';
import {
    createRegistration,
    getMyRegistration,
    updateRegistration,
    cancelRegistration,
    getAllRegistrations,
    confirmRegistration,
    markGownCollected,
} from '../controllers/registrationController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const createRegistrationValidation = [
    body('ceremonyDate').isISO8601().withMessage('Please provide a valid ceremony date'),
    body('gownSize').isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']).withMessage('Invalid gown size'),
];

// Routes
router.post('/', protect, authorize('student'), createRegistrationValidation, validate, createRegistration);
router.get('/me', protect, getMyRegistration);
router.get('/', protect, authorize('admin', 'staff'), getAllRegistrations);
router.put('/:id', protect, updateRegistration);
router.delete('/:id', protect, cancelRegistration);
router.put('/:id/confirm', protect, authorize('admin'), confirmRegistration);
router.put('/:id/gown-collected', protect, authorize('staff', 'admin'), markGownCollected);

export default router;
