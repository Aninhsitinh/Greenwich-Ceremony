import prisma from '../prisma.js';
import { formatResponse } from '../utils/helpers.js';
import { updateJourneyStatus } from '../utils/journeyHelpers.js';

// @desc    Get available seats
// @route   GET /api/seats
// @access  Private
export const getAvailableSeats = async (req, res, next) => {
    try {
        // Get all booked seats with essential user info for labels
        const booked = await prisma.seatBooking.findMany({
            where: { status: { not: 'cancelled' } },
            include: {
                user: {
                    select: {
                        fullName: true,
                        studentId: true,
                        journeyPaymentCompleted: true
                    }
                }
            }
        });

        // Transform results to include the correct occupant label based on payment status
        const transformedBookedSeats = booked.map(seat => {
            let label = 'Occupied';
            if (seat.user) {
                // Modified for Staff: always show Full Name if staff/admin
                if (req.user.role !== 'student') {
                    label = seat.user.fullName;
                } else {
                    // Rule for students: If paid, show Full Name. If only registered, show Student ID.
                    if (seat.user.journeyPaymentCompleted) {
                        label = seat.user.fullName;
                    } else {
                        label = seat.user.studentId || 'Registered';
                    }
                }
            }

            // Return limited info for privacy/security while fulfilling the "sync" requirement
            return {
                id: seat.id,
                seatNumber: seat.seatNumber,
                seatType: seat.seatType,
                guestName: seat.guestName,
                occupant: label,
                studentId: seat.user?.studentId,
                isPaid: seat.user?.journeyPaymentCompleted || false,
                // Full details for non-students
                ...((req.user.role !== 'student') ? {
                    user: seat.user,
                    guestRelation: seat.guestRelation,
                    guestPhone: seat.guestPhone
                } : {})
            };
        });

        // Get venue capacity
        const settings = await prisma.systemSettings.findFirst();
        const capacity = settings ? settings.venueCapacity : 600;

        res.status(200).json(
            formatResponse(true, 'Seats retrieved successfully', {
                bookedSeats: transformedBookedSeats,
                totalCapacity: capacity,
                availableSeats: capacity - transformedBookedSeats.length,
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Book seat
// @route   POST /api/seats/book
// @access  Private (Student)
export const bookSeat = async (req, res, next) => {
    try {
        const { seatNumber, seatType, guestName, guestRelation, guestPhone } = req.body;

        // NEW LOGIC: Paired seat format [row].[group].[type] (e.g., a.1.1)
        const seatParts = seatNumber.split('.');
        if (seatParts.length !== 3) {
            return res.status(400).json(formatResponse(false, 'Invalid seat format. Expected Row.Group.Type (e.g., a.1.1)'));
        }

        const rowLetter = seatParts[0].toLowerCase();
        const seatGroup = parseInt(seatParts[1]);
        const seatSubtype = parseInt(seatParts[2]); // 1: Student, 2: Guest

        // Enforce seatType based on seatSubtype
        if (seatSubtype === 1 && seatType !== 'student') {
            return res.status(400).json(formatResponse(false, 'Seat X.Y.1 must be booked as "student"'));
        }
        if (seatSubtype === 2 && seatType !== 'guest') {
            return res.status(400).json(formatResponse(false, 'Seat X.Y.2 must be booked as "guest"'));
        }

        // Check if seat is already booked
        const existingBooking = await prisma.seatBooking.findFirst({
            where: {
                seatNumber,
                status: { not: 'cancelled' },
            }
        });

        if (existingBooking) {
            return res.status(400).json(formatResponse(false, 'Seat is already booked'));
        }

        // Logic for paired booking
        if (seatType === 'student') {
            // Check if student already has a seat
            const existingStudentSeat = await prisma.seatBooking.findFirst({
                where: {
                    userId: req.user.id,
                    seatType: 'student',
                    status: { not: 'cancelled' },
                }
            });
            if (existingStudentSeat) {
                return res.status(400).json(formatResponse(false, 'You have already booked your student seat'));
            }
        }

        if (seatType === 'guest') {
            // Check registration for guest count
            const registration = await prisma.registration.findFirst({
                where: { userId: req.user.id }
            });

            if (!registration) {
                return res.status(400).json(formatResponse(false, 'Please complete your registration first'));
            }

            if (registration.guestCount < 1) {
                return res.status(400).json(formatResponse(false, 'Your registration does not include guest seats'));
            }

            // Ensure they book the guest seat in THEIR group (the one matching their student seat)
            const myStudentSeat = await prisma.seatBooking.findFirst({
                where: {
                    userId: req.user.id,
                    seatType: 'student',
                    status: { not: 'cancelled' },
                }
            });

            if (!myStudentSeat) {
                return res.status(400).json(formatResponse(false, 'Please book your student seat first'));
            }

            const studentSeatParts = myStudentSeat.seatNumber.split('.');
            const studentRow = studentSeatParts[0].toLowerCase();
            const studentGroup = parseInt(studentSeatParts[1]);

            if (rowLetter !== studentRow || seatGroup !== studentGroup) {
                return res.status(400).json(formatResponse(false, `You must book guest seat ${studentRow}.${studentGroup}.2 to match your student seat`));
            }

            const existingGuestSeat = await prisma.seatBooking.findFirst({
                where: {
                    userId: req.user.id,
                    seatType: 'guest',
                    status: { not: 'cancelled' },
                }
            });
            if (existingGuestSeat) {
                return res.status(400).json(formatResponse(false, 'You have already booked your guest seat'));
            }
        }

        // Create booking
        const booking = await prisma.seatBooking.create({
            data: {
                userId: req.user.id,
                seatNumber,
                seatType,
                rowLetter,
                seatGroup,
                guestName,
                guestRelation,
                guestPhone,
            },
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true }
                }
            }
        });

        // Update user journey status
        await updateJourneyStatus(req.user.id, { seatsBooked: true });

        res.status(201).json(
            formatResponse(true, 'Seat booked successfully', { booking })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get my bookings
// @route   GET /api/seats/my-bookings
// @access  Private
export const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await prisma.seatBooking.findMany({
            where: {
                userId: req.user.id,
                status: { not: 'cancelled' },
            },
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true }
                }
            }
        });

        res.status(200).json(
            formatResponse(true, 'Bookings retrieved successfully', { bookings })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel booking
// @route   DELETE /api/seats/:id
// @access  Private
export const cancelBooking = async (req, res, next) => {
    try {
        const { id } = req.params;

        const booking = await prisma.seatBooking.findUnique({
            where: { id }
        });

        if (!booking) {
            return res.status(404).json(
                formatResponse(false, 'Booking not found')
            );
        }

        // Check ownership
        if (req.user.role === 'student' && booking.userId !== req.user.id) {
            return res.status(403).json(
                formatResponse(false, 'Not authorized to cancel this booking')
            );
        }

        await prisma.seatBooking.update({
            where: { id },
            data: { status: 'cancelled' }
        });

        res.status(200).json(
            formatResponse(true, 'Booking cancelled successfully')
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'Booking not found'));
        }
        next(error);
    }
};

// @desc    Get all bookings
// @route   GET /api/seats/all
// @access  Private (Admin, Staff)
export const getAllBookings = async (req, res, next) => {
    try {
        const { status, seatType, page = 1, limit = 20 } = req.query;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        const where = {};
        if (status) {
            where.status = status;
        }
        if (seatType) {
            where.seatType = seatType;
        }

        const bookings = await prisma.seatBooking.findMany({
            where,
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true }
                }
            },
            take: parsedLimit,
            skip: (parsedPage - 1) * parsedLimit,
            orderBy: { createdAt: 'desc' }
        });

        const count = await prisma.seatBooking.count({ where });

        res.status(200).json(
            formatResponse(true, 'Bookings retrieved successfully', {
                bookings,
                totalPages: Math.ceil(count / parsedLimit),
                currentPage: parsedPage,
                total: count,
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Update a booking's seat number (Staff/Admin)
// @route   PATCH /api/seats/:id/admin-update
// @access  Private (Admin, Staff, MC)
export const adminUpdateSeat = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newSeatNumber } = req.body;

        if (!newSeatNumber) {
            return res.status(400).json(formatResponse(false, 'newSeatNumber is required'));
        }

        const booking = await prisma.seatBooking.findUnique({
            where: { id }
        });

        if (!booking) {
            return res.status(404).json(formatResponse(false, 'Booking not found'));
        }

        // Check if the new seat is already taken by someone else (optional: you may allow overlaps for event day shuffling, but best to warn or prevent)
        const existingBooking = await prisma.seatBooking.findFirst({
            where: {
                seatNumber: newSeatNumber,
                status: { not: 'cancelled' },
                id: { not: id } // Exclude the current booking
            }
        });

        if (existingBooking) {
            return res.status(400).json(formatResponse(false, `Seat ${newSeatNumber} is already booked by another attendee`));
        }

        const updatedBooking = await prisma.seatBooking.update({
            where: { id },
            data: { seatNumber: newSeatNumber },
            include: { user: { select: { fullName: true } } }
        });

        // Optional: Broadcast changes to sockets if you want live seat updates everywhere
        const io = req.app.get('io');
        if (io) {
            io.to('ceremony').emit('ceremony:queue_updated', {
                message: `Seat updated for ${updatedBooking.user.fullName}`
            });
        }

        res.status(200).json(
            formatResponse(true, 'Seat updated successfully', { booking: updatedBooking })
        );
    } catch (error) {
        next(error);
    }
};
