import express from 'express';
import prisma from '../prisma.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Quick fix: Auto-confirm pending registrations
router.post('/fix-registrations', protect, async (req, res) => {
    try {
        const result = await prisma.registration.updateMany({
            where: { registrationStatus: 'pending' },
            data: {
                registrationStatus: 'confirmed',
                attendanceConfirmed: true
            }
        });

        res.json({
            success: true,
            message: `Updated ${result.count} registrations to confirmed status`,
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
