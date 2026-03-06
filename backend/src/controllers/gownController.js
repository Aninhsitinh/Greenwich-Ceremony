import prisma from '../prisma.js';
import { formatResponse } from '../utils/helpers.js';

// @desc    Request gown collection
// @route   POST /api/gown/request
// @access  Private (Student)
export const requestGownCollection = async (req, res, next) => {
    try {
        const { size, scheduledDate, notes } = req.body;

        // Check if user has completed seat booking
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user.journeySeatsBooked) {
            return res.status(403).json(
                formatResponse(false, 'Please complete seat booking before requesting gown collection')
            );
        }

        // Check if already has a gown request
        const existingRequest = await prisma.gownCollection.findFirst({
            where: {
                userId: req.user.id,
                status: { in: ['pending', 'scheduled', 'collected'] }
            }
        });

        if (existingRequest) {
            return res.status(400).json(
                formatResponse(false, 'You already have an active gown collection request')
            );
        }

        const registration = await prisma.registration.findFirst({ where: { userId: req.user.id } });

        if (!registration) {
            return res.status(400).json(
                formatResponse(false, 'Please complete registration before requesting a gown')
            );
        }

        // Create gown collection request
        const gownCollection = await prisma.gownCollection.create({
            data: {
                userId: req.user.id,
                registrationId: registration.id,
                size,
                scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
                status: 'scheduled',
                notes,
            }
        });

        // Update user journey status
        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                journeyGownCollected: false,
                journeyCurrentStep: 4
            }
        });

        res.status(201).json(
            formatResponse(true, 'Gown collection request created successfully', { gownCollection })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get my gown collection request
// @route   GET /api/gown/my-request
// @access  Private (Student)
export const getMyGownRequest = async (req, res, next) => {
    try {
        const gownCollection = await prisma.gownCollection.findFirst({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(
            formatResponse(true, 'Gown collection request retrieved successfully', { gownCollection })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Mark gown as collected
// @route   PUT /api/gown/:id/collect
// @access  Private (Staff, Admin)
export const markAsCollected = async (req, res, next) => {
    try {
        const gownCollection = await prisma.gownCollection.findUnique({
            where: { id: req.params.id }
        });

        if (!gownCollection) {
            return res.status(404).json(
                formatResponse(false, 'Gown collection request not found')
            );
        }

        const updatedGownCollection = await prisma.gownCollection.update({
            where: { id: gownCollection.id },
            data: {
                status: 'collected',
                collectionDate: new Date()
            }
        });

        // Update user journey status
        await prisma.user.update({
            where: { id: gownCollection.userId },
            data: { journeyGownCollected: true }
        });

        res.status(200).json(
            formatResponse(true, 'Gown marked as collected successfully', { gownCollection: updatedGownCollection })
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'Gown collection request not found'));
        }
        next(error);
    }
};

// @desc    Mark gown as returned
// @route   PUT /api/gown/:id/return
// @access  Private (Staff, Admin)
export const markAsReturned = async (req, res, next) => {
    try {
        const gownCollection = await prisma.gownCollection.findUnique({
            where: { id: req.params.id }
        });

        if (!gownCollection) {
            return res.status(404).json(
                formatResponse(false, 'Gown collection request not found')
            );
        }

        const updatedGownCollection = await prisma.gownCollection.update({
            where: { id: gownCollection.id },
            data: {
                status: 'returned',
                returnDate: new Date()
            }
        });

        res.status(200).json(
            formatResponse(true, 'Gown marked as returned successfully', { gownCollection: updatedGownCollection })
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'Gown collection request not found'));
        }
        next(error);
    }
};

// @desc    Get all gown collection requests (Admin/Staff)
// @route   GET /api/gown
// @access  Private (Admin, Staff)
export const getAllGownRequests = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const where = {};
        if (status) where.status = status;

        const gownRequests = await prisma.gownCollection.findMany({
            where,
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true }
                }
            },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: { scheduledDate: 'asc' }
        });

        const count = await prisma.gownCollection.count({ where });

        res.status(200).json(
            formatResponse(true, 'Gown collection requests retrieved successfully', {
                gownRequests,
                totalPages: Math.ceil(count / parseInt(limit)),
                currentPage: parseInt(page),
                total: count,
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Update gown collection request
// @route   PUT /api/gown/:id
// @access  Private (Student - own request only)
export const updateGownRequest = async (req, res, next) => {
    try {
        const { size, scheduledDate, notes } = req.body;

        const gownCollection = await prisma.gownCollection.findUnique({
            where: { id: req.params.id }
        });

        if (!gownCollection) {
            return res.status(404).json(
                formatResponse(false, 'Gown collection request not found')
            );
        }

        // Check ownership
        if (gownCollection.userId !== req.user.id) {
            return res.status(403).json(
                formatResponse(false, 'Not authorized to update this request')
            );
        }

        // Only allow updates if not yet collected
        if (gownCollection.status === 'collected' || gownCollection.status === 'returned') {
            return res.status(400).json(
                formatResponse(false, 'Cannot update already collected or returned gown')
            );
        }

        const updatedData = {};
        if (size) updatedData.size = size;
        if (scheduledDate) updatedData.scheduledDate = new Date(scheduledDate);
        if (notes !== undefined) updatedData.notes = notes;

        const updatedGownCollection = await prisma.gownCollection.update({
            where: { id: gownCollection.id },
            data: updatedData
        });

        res.status(200).json(
            formatResponse(true, 'Gown collection request updated successfully', { gownCollection: updatedGownCollection })
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'Gown collection request not found'));
        }
        next(error);
    }
};
