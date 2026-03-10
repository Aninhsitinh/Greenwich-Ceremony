import prisma from '../prisma.js';
import { formatResponse } from '../utils/helpers.js';

// @desc    Create gown collection for student
// @route   POST /api/gown-collection
// @access  Private (Student)
export const createGownCollection = async (req, res, next) => {
    try {
        const { size, scheduledDate, notes } = req.body;
        const userId = req.user.id;

        // Check if student has a registration
        const registration = await prisma.registration.findFirst({ where: { userId } });
        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'Please complete ceremony registration first')
            );
        }

        // Check if gown collection already exists
        const existingGownCollection = await prisma.gownCollection.findFirst({ where: { userId } });
        if (existingGownCollection) {
            return res.status(400).json(
                formatResponse(false, 'Gown collection already exists. Please update instead.')
            );
        }

        const colDate = scheduledDate ? new Date(scheduledDate) : new Date();

        // Create gown collection - AUTOMATED as 'collected'
        const gownCollection = await prisma.gownCollection.create({
            data: {
                userId,
                registrationId: registration.id,
                size,
                scheduledDate: colDate,
                collectionDate: colDate,
                status: 'collected',
                notes
            }
        });

        // Update User journey status
        await prisma.user.update({
            where: { id: userId },
            data: {
                journeyGownCollected: true,
                journeyCurrentStep: 5 // Move to next step (Payment/Confirmation)
            }
        });

        // Update Registration record
        await prisma.registration.update({
            where: { id: registration.id },
            data: {
                gownCollected: true,
                gownSize: size,
                gownCollectionTime: colDate
            }
        });

        // Emit real-time update to staff
        const io = req.app.get('io');
        if (io) {
            io.to('ceremony').emit('gown:updated', {
                studentId: req.user.studentId,
                studentName: req.user.fullName,
                size,
                status: 'collected',
                collectionDate: colDate
            });
        }

        res.status(201).json(
            formatResponse(true, 'Gown collection recorded successfully', {
                gownCollection
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get student's gown collection
// @route   GET /api/gown-collection/my-collection
// @access  Private (Student)
export const getMyGownCollection = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const gownCollection = await prisma.gownCollection.findFirst({
            where: { userId },
            include: {
                registration: {
                    select: { ceremonyDate: true, attendanceConfirmed: true }
                },
                user: {
                    select: { fullName: true, email: true, studentId: true }
                }
            }
        });

        if (!gownCollection) {
            return res.status(200).json(
                formatResponse(true, 'No gown collection found. Please create one.', { gownCollection: null })
            );
        }

        res.status(200).json(
            formatResponse(true, 'Gown collection retrieved', {
                gownCollection
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Update gown size (only if not collected)
// @route   PATCH /api/gown-collection/:id
// @access  Private (Student)
export const updateGownSize = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { size, scheduledDate, notes } = req.body;
        const userId = req.user.id;

        const gownCollection = await prisma.gownCollection.findFirst({
            where: { id, userId }
        });

        if (!gownCollection) {
            return res.status(404).json(
                formatResponse(false, 'Gown collection not found')
            );
        }

        // Only allow updates if not yet collected
        if (gownCollection.status === 'collected' || gownCollection.status === 'returned') {
            return res.status(400).json(
                formatResponse(false, 'Cannot update gown that has been collected or returned')
            );
        }

        // Update fields
        const updatedData = {};
        if (size) updatedData.size = size;
        if (scheduledDate) updatedData.scheduledDate = new Date(scheduledDate);
        if (notes !== undefined) updatedData.notes = notes;

        const updatedGownCollection = await prisma.gownCollection.update({
            where: { id: gownCollection.id },
            data: updatedData
        });

        res.status(200).json(
            formatResponse(true, 'Gown collection updated successfully', {
                gownCollection: updatedGownCollection
            })
        );
    } catch (error) {
        next(error);
    }
};
