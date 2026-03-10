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
                guestCount: 1,
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
                },
                collectionConfirmedBy: {
                    select: { fullName: true }
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

        // Use a transaction to ensure all cleanup happens together
        await prisma.$transaction(async (tx) => {
            // 1. Update registration status
            await tx.registration.update({
                where: { id },
                data: {
                    registrationStatus: 'cancelled',
                    attendanceConfirmed: false,
                    gownCollected: false,
                    isDepositRefunded: false,
                    refundAmount: 0
                }
            });

            // 2. Delete related tickets
            await tx.ticket.deleteMany({
                where: { userId: registration.userId }
            });

            // 3. Delete seat bookings (releases the seats)
            await tx.seatBooking.deleteMany({
                where: { userId: registration.userId }
            });

            // 4. Delete gown collections
            await tx.gownCollection.deleteMany({
                where: { userId: registration.userId }
            });

            // 5. Delete payments related to this registration/journey
            // (Keeping logs might be better in real systems, but for this requirement we wipe)
            await tx.payment.deleteMany({
                where: { userId: registration.userId }
            });

            // 6. Reset user journey status
            await tx.user.update({
                where: { id: registration.userId },
                data: {
                    journeyRegistrationCompleted: false,
                    journeyTicketGenerated: false,
                    journeySeatsBooked: false,
                    journeyGownCollected: false,
                    journeyPaymentCompleted: false,
                    journeyCurrentStep: 1
                }
            });
        });

        res.status(200).json(
            formatResponse(true, 'Registration and all associated records cancelled successfully')
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
                },
                collectionConfirmedBy: {
                    select: { fullName: true }
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
// @desc    Update logistics status (Invitation/Wristband)
// @route   PATCH /api/registrations/:id/logistics
// @access  Private (Staff, Admin)
export const updateLogisticsStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { invitationCollected, wristbandCollected } = req.body;

        const registration = await prisma.registration.findUnique({
            where: { id }
        });

        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'Registration not found')
            );
        }

        const updatedData = {};
        if (invitationCollected !== undefined) updatedData.invitationCollected = invitationCollected;
        if (wristbandCollected !== undefined) updatedData.wristbandCollected = wristbandCollected;

        const finalInvitation = invitationCollected !== undefined ? !!invitationCollected : registration.invitationCollected;
        const finalWristband = wristbandCollected !== undefined ? !!wristbandCollected : registration.wristbandCollected;

        if (finalInvitation || finalWristband) {
            // Always update staff ID if a staff member is performing the update
            updatedData.collectionConfirmedAt = registration.collectionConfirmedAt || new Date();
            updatedData.collectionConfirmedById = req.user.id;
        } else {
            // Both are false, clear the confirmation info
            updatedData.collectionConfirmedAt = null;
            updatedData.collectionConfirmedById = null;
        }

        const updatedRegistration = await prisma.registration.update({
            where: { id },
            data: updatedData,
            include: {
                user: {
                    select: { fullName: true, studentId: true, major: true }
                },
                collectionConfirmedBy: {
                    select: { fullName: true }
                }
            }
        });

        // Emit real-time update to staff and other clients in the ceremony room
        const io = req.app.get('io');
        if (io) {
            io.to('ceremony').emit('logistics:updated', {
                registrationId: updatedRegistration.id,
                studentId: updatedRegistration.user.studentId,
                studentName: updatedRegistration.user.fullName,
                invitationCollected: updatedRegistration.invitationCollected,
                wristbandCollected: updatedRegistration.wristbandCollected,
                collectionConfirmedAt: updatedRegistration.collectionConfirmedAt,
                confirmedBy: req.user.fullName || 'Staff'
            });

            // Also notify the specific student
            io.to(updatedRegistration.userId).emit('student:logistics_updated', updatedRegistration);
        }

        res.status(200).json(
            formatResponse(true, 'Logistics status updated successfully', { registration: updatedRegistration })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Self confirm item collection
// @route   PUT /api/registrations/me/logistics
// @access  Private (Student)
export const confirmSelfCollection = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { invitationCollected, wristbandCollected } = req.body;

        const registration = await prisma.registration.findFirst({
            where: {
                userId,
                registrationStatus: { not: 'cancelled' }
            }
        });

        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'Registration not found')
            );
        }

        const finalInvitation = invitationCollected !== undefined ? !!invitationCollected : registration.invitationCollected;
        const finalWristband = wristbandCollected !== undefined ? !!wristbandCollected : registration.wristbandCollected;

        const updatedData = {
            invitationCollected: finalInvitation,
            wristbandCollected: finalWristband
        };

        if (finalInvitation || finalWristband) {
            if (!registration.collectionConfirmedAt) {
                updatedData.collectionConfirmedAt = new Date();
            }
        } else {
            updatedData.collectionConfirmedAt = null;
            updatedData.collectionConfirmedById = null;
        }

        const updatedRegistration = await prisma.registration.update({
            where: { id: registration.id },
            data: updatedData,
            include: {
                user: {
                    select: { fullName: true, studentId: true, major: true }
                },
                collectionConfirmedBy: {
                    select: { fullName: true }
                }
            }
        });

        // Emit real-time update to staff in the ceremony room
        const io = req.app.get('io');
        if (io) {
            io.to('ceremony').emit('logistics:updated', {
                registrationId: updatedRegistration.id,
                studentId: updatedRegistration.user.studentId,
                studentName: updatedRegistration.user.fullName,
                invitationCollected: updatedRegistration.invitationCollected,
                wristbandCollected: updatedRegistration.wristbandCollected,
                collectionConfirmedAt: updatedRegistration.collectionConfirmedAt,
                confirmedBy: 'Self Confirmed'
            });

            // Also notify the specific student (in case they have multiple tabs open)
            io.to(updatedRegistration.userId).emit('student:logistics_updated', updatedRegistration);
        }

        res.status(200).json(
            formatResponse(true, 'Collection status updated successfully', { registration: updatedRegistration })
        );
    } catch (error) {
        next(error);
    }
};
