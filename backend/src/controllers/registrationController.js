import prisma from '../prisma.js';
import { formatResponse } from '../utils/helpers.js';

// @desc    Create ceremony registration
// @route   POST /api/registrations
// @access  Private (Student)
export const createRegistration = async (req, res, next) => {
    try {
        const { ceremonyDate, gownSize, specialRequirements, dietaryRequirements, specialNeeds, guestCount } = req.body;

        // Check if registration is open
        const settings = await prisma.systemSettings.findFirst();
        if (settings && !settings.isRegistrationOpen) {
            return res.status(400).json(
                formatResponse(false, 'Registration is currently closed')
            );
        }

        // Check if user already registered
        const existingRegistration = await prisma.registration.findFirst({
            where: {
                userId: req.user.id,
                registrationStatus: { not: 'cancelled' }
            }
        });

        if (existingRegistration) {
            return res.status(400).json(
                formatResponse(false, 'You have already registered for the ceremony')
            );
        }

        // Create registration
        const registration = await prisma.registration.create({
            data: {
                userId: req.user.id,
                ceremonyDate: ceremonyDate ? new Date(ceremonyDate) : new Date(),
                gownSize,
                specialRequirements,
                dietaryRequirements,
                specialNeeds,
                guestCount,
                registrationStatus: 'confirmed',  // Auto-confirm for students
                attendanceConfirmed: true,
            },
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true }
                }
            }
        });

        const mappedRegistration = { ...registration, student: registration.user, _id: registration.id, status: registration.registrationStatus };

        res.status(201).json(
            formatResponse(true, 'Registration created successfully', { registration: mappedRegistration })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get my registration
// @route   GET /api/registrations/me
// @access  Private
export const getMyRegistration = async (req, res, next) => {
    try {
        const registration = await prisma.registration.findFirst({
            where: { userId: req.user.id },
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true, profilePhoto: true }
                }
            }
        });

        if (!registration) {
            return res.status(200).json(
                formatResponse(true, 'No registration found', { registration: null })
            );
        }

        const mappedRegistration = { ...registration, student: registration.user, _id: registration.id, status: registration.registrationStatus };

        res.status(200).json(
            formatResponse(true, 'Registration retrieved successfully', { registration: mappedRegistration })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Update registration
// @route   PUT /api/registrations/:id
// @access  Private
export const updateRegistration = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { gownSize, specialRequirements, specialNeeds, guestCount } = req.body;

        let registration = await prisma.registration.findUnique({
            where: { id }
        });

        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'Registration not found')
            );
        }

        // Check ownership (students can only update their own)
        if (req.user.role === 'student' && registration.userId !== req.user.id) {
            return res.status(403).json(
                formatResponse(false, 'Not authorized to update this registration')
            );
        }

        const updatedData = {};
        if (gownSize) updatedData.gownSize = gownSize;
        if (specialRequirements) updatedData.specialRequirements = specialRequirements;
        if (specialNeeds !== undefined) updatedData.specialNeeds = specialNeeds;
        if (guestCount !== undefined) updatedData.guestCount = guestCount;

        registration = await prisma.registration.update({
            where: { id },
            data: updatedData,
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true }
                }
            }
        });

        const mappedRegistration = { ...registration, student: registration.user, _id: registration.id, status: registration.registrationStatus };

        res.status(200).json(
            formatResponse(true, 'Registration updated successfully', { registration: mappedRegistration })
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'Registration not found'));
        }
        next(error);
    }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Private
export const cancelRegistration = async (req, res, next) => {
    try {
        const { id } = req.params;

        const registration = await prisma.registration.findUnique({
            where: { id }
        });

        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'Registration not found')
            );
        }

        // Check ownership
        if (req.user.role === 'student' && registration.userId !== req.user.id) {
            return res.status(403).json(
                formatResponse(false, 'Not authorized to cancel this registration')
            );
        }

        await prisma.registration.update({
            where: { id },
            data: { registrationStatus: 'cancelled' }
        });

        res.status(200).json(
            formatResponse(true, 'Registration cancelled successfully')
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'Registration not found'));
        }
        next(error);
    }
};

// @desc    Get all registrations
// @route   GET /api/registrations
// @access  Private (Admin, Staff)
export const getAllRegistrations = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        const where = {};
        if (status) {
            where.registrationStatus = status;
        }

        const registrations = await prisma.registration.findMany({
            where,
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true, major: true, classOf: true }
                }
            },
            take: parsedLimit,
            skip: (parsedPage - 1) * parsedLimit,
            orderBy: { createdAt: 'desc' }
        });

        const count = await prisma.registration.count({ where });

        const mappedRegistrations = registrations.map(r => ({
            ...r,
            student: r.user,
            _id: r.id,
            status: r.registrationStatus
        }));

        res.status(200).json(
            formatResponse(true, 'Registrations retrieved successfully', {
                registrations: mappedRegistrations,
                totalPages: Math.ceil(count / parsedLimit),
                currentPage: parsedPage,
                total: count,
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle registration status
// @route   PATCH /api/registrations/:id/status
// @access  Private (Admin, Staff)
export const toggleRegistrationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed'].includes(status)) {
            return res.status(400).json(
                formatResponse(false, 'Invalid status value. Must be pending or confirmed.')
            );
        }

        const registration = await prisma.registration.findUnique({
            where: { id }
        });

        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'Registration not found')
            );
        }

        const updatedData = {
            registrationStatus: status,
            attendanceConfirmed: status === 'confirmed'
        };

        if (status === 'confirmed') {
            updatedData.checkedInById = req.user.id;
            updatedData.checkedInAt = new Date();
        } else {
            updatedData.checkedInById = null;
            updatedData.checkedInAt = null;
        }

        const updatedRegistration = await prisma.registration.update({
            where: { id },
            data: updatedData,
            include: {
                user: {
                    select: { id: true, fullName: true, email: true, studentId: true }
                }
            }
        });

        // Create a notification for the student
        const notificationMessage = status === 'confirmed'
            ? 'Your registration has been confirmed and checked-in by staff.'
            : 'Your registration status has been reverted to pending.';

        const notification = await prisma.notification.create({
            data: {
                userId: updatedRegistration.user.id,
                title: 'Registration Status Updated',
                message: notificationMessage,
                type: 'registrationUpdate',
                relatedId: updatedRegistration.id,
            }
        });

        // Emit socket event if io is available
        const io = req.app.get('io');
        if (io) {
            io.to(updatedRegistration.user.id.toString()).emit('new_notification', notification);
        }

        res.status(200).json(
            formatResponse(true, `Registration status updated to ${status}`, { registration: updatedRegistration })
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'Registration not found'));
        }
        next(error);
    }
};

// @desc    Confirm registration
// @route   PUT /api/registrations/:id/confirm
// @access  Private (Admin)
export const confirmRegistration = async (req, res, next) => {
    try {
        const { id } = req.params;

        const registration = await prisma.registration.findUnique({
            where: { id }
        });

        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'Registration not found')
            );
        }

        const updatedRegistration = await prisma.registration.update({
            where: { id },
            data: {
                registrationStatus: 'confirmed',
                attendanceConfirmed: true
            },
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true }
                }
            }
        });

        res.status(200).json(
            formatResponse(true, 'Registration confirmed successfully', { registration: updatedRegistration })
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'Registration not found'));
        }
        next(error);
    }
};

// @desc    Mark gown as collected
// @route   PUT /api/registrations/:id/gown-collected
// @access  Private (Staff)
export const markGownCollected = async (req, res, next) => {
    try {
        const { id } = req.params;

        const registration = await prisma.registration.findUnique({
            where: { id }
        });

        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'Registration not found')
            );
        }

        const updatedRegistration = await prisma.registration.update({
            where: { id },
            data: {
                gownCollected: true,
                gownCollectionTime: new Date()
            }
        });

        res.status(200).json(
            formatResponse(true, 'Gown collection recorded successfully', { registration: updatedRegistration })
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'Registration not found'));
        }
        next(error);
    }
};
