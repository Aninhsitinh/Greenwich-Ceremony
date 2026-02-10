import express from 'express';
import Registration from '../models/Registration.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Quick fix: Auto-confirm pending registrations
router.post('/fix-registrations', protect, async (req, res) => {
    try {
        const result = await Registration.updateMany(
            { registrationStatus: 'pending' },
            {
                $set: {
                    registrationStatus: 'confirmed',
                    attendanceConfirmed: true
                }
            }
        );

        res.json({
            success: true,
            message: `Updated ${result.modifiedCount} registrations to confirmed status`,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
