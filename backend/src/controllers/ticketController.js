import prisma from '../prisma.js';
import { formatResponse } from '../utils/helpers.js';
import { generateQRCode, generateTicketNumber } from '../utils/generateQR.js';
import { updateJourneyStatus } from '../utils/journeyHelpers.js';

// @desc    Generate ticket for registered user
// @route   POST /api/tickets/generate
// @access  Private (Student)
export const generateTicket = async (req, res, next) => {
    try {
        const { ticketType = 'student', seatNumber } = req.body;

        // Check if user has completed registration
        const registration = await prisma.registration.findFirst({
            where: {
                userId: req.user.id,
                registrationStatus: { in: ['pending', 'confirmed'] },
            }
        });

        console.log('=== Ticket Generation Debug ===');
        console.log('User ID:', req.user.id);
        console.log('Registration found:', registration);
        console.log('Registration status:', registration?.registrationStatus);

        if (!registration) {
            return res.status(400).json(
                formatResponse(false, 'Please complete your registration first')
            );
        }

        // Check if ticket already exists
        const existingTicket = await prisma.ticket.findFirst({
            where: {
                userId: req.user.id,
                ticketType,
            }
        });

        if (existingTicket) {
            return res.status(200).json(
                formatResponse(true, 'Ticket already exists', { ticket: existingTicket })
            );
        }

        // Generate unique ticket number
        const ticketNumber = generateTicketNumber();

        // Generate QR code data
        const qrData = JSON.stringify({
            ticketNumber,
            userId: req.user.id,
            studentId: req.user.studentId,
            fullName: req.user.fullName,
            ticketType,
            seatNumber,
        });

        // Generate QR code
        const qrCode = await generateQRCode(qrData);

        // Create ticket
        const ticket = await prisma.ticket.create({
            data: {
                userId: req.user.id,
                ticketType,
                qrCode,
                ticketNumber,
                seatNumber,
            },
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true }
                }
            }
        });

        // Update user journey status
        await updateJourneyStatus(req.user.id, { ticketGenerated: true });

        res.status(201).json(
            formatResponse(true, 'Ticket generated successfully', { ticket })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get my tickets
// @route   GET /api/tickets/me
// @access  Private
export const getMyTickets = async (req, res, next) => {
    try {
        const tickets = await prisma.ticket.findMany({
            where: { userId: req.user.id },
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true, profilePhoto: true }
                },
                scannedBy: {
                    select: { fullName: true }
                }
            }
        });

        const mappedTickets = tickets.map(t => ({ ...t, userId: t.user, _id: t.id }));

        res.status(200).json(
            formatResponse(true, 'Tickets retrieved successfully', { tickets: mappedTickets })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get ticket by number
// @route   GET /api/tickets/:ticketNumber
// @access  Private (Staff, Admin)
export const getTicketByNumber = async (req, res, next) => {
    try {
        const { ticketNumber } = req.params;

        const ticket = await prisma.ticket.findUnique({
            where: { ticketNumber },
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true, profilePhoto: true, major: true, classOf: true }
                },
                scannedBy: {
                    select: { fullName: true }
                }
            }
        });

        if (!ticket) {
            return res.status(404).json(
                formatResponse(false, 'Ticket not found')
            );
        }

        const mappedTicket = { ...ticket, userId: ticket.user, _id: ticket.id };

        res.status(200).json(
            formatResponse(true, 'Ticket retrieved successfully', { ticket: mappedTicket })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Scan QR code ticket
// @route   POST /api/tickets/scan
// @access  Private (Staff)
export const scanTicket = async (req, res, next) => {
    try {
        const { ticketNumber } = req.body;

        const ticket = await prisma.ticket.findUnique({
            where: { ticketNumber },
            include: {
                user: {
                    select: { id: true, fullName: true, email: true, studentId: true, profilePhoto: true, major: true, classOf: true }
                }
            }
        });

        if (!ticket) {
            return res.status(404).json(
                formatResponse(false, 'Invalid ticket')
            );
        }

        if (ticket.isScanned) {
            // Even if already scanned, we might want to return seat info if needed,
            // but user flow usually stops valid entry here.
            // However, let's fetch seats anyway for the "already scanned" display if frontend uses it.
            const bookings = await prisma.seatBooking.findMany({
                where: { userId: ticket.userId, status: { not: 'cancelled' } }
            });
            const studentSeats = bookings.filter(b => b.seatType === 'student').map(b => b.seatNumber).sort();
            const guestSeats = bookings.filter(b => b.seatType === 'guest').map(b => b.seatNumber).sort();

            let seatListParts = [];
            if (studentSeats.length) seatListParts.push(`My Seat: ${studentSeats.join(', ')} `);
            if (guestSeats.length) seatListParts.push(`Guest Seats: ${guestSeats.join(', ')} `);
            const seatList = seatListParts.length ? seatListParts.join(' | ') : (ticket.seatNumber || 'N/A');

            return res.status(400).json(
                formatResponse(false, 'Ticket already scanned', {
                    ticket: { ...ticket, userId: ticket.user, _id: ticket.id, seatList }, // Include seatList
                    scannedAt: ticket.scannedAt,
                })
            );
        }

        // Update Registration status
        const registration = await prisma.registration.findFirst({
            where: { userId: ticket.userId }
        });

        if (registration) {
            await prisma.registration.update({
                where: { id: registration.id },
                data: {
                    attendanceConfirmed: true,
                    checkedInById: req.user.id,
                    checkedInAt: new Date()
                }
            });
        }

        // Mark as scanned
        const updatedTicket = await prisma.ticket.update({
            where: { id: ticket.id },
            data: {
                isScanned: true,
                scannedAt: new Date(),
                scannedBy: { connect: { id: req.user.id } }
            },
            include: {
                scannedBy: {
                    select: { fullName: true }
                }
            }
        });

        // Fetch all seats for this user
        const bookings = await prisma.seatBooking.findMany({
            where: { userId: ticket.userId, status: { not: 'cancelled' } }
        });
        const studentSeats = bookings.filter(b => b.seatType === 'student').map(b => b.seatNumber).sort();
        const guestSeats = bookings.filter(b => b.seatType === 'guest').map(b => b.seatNumber).sort();

        let seatListParts = [];
        if (studentSeats.length) seatListParts.push(`My Seat: ${studentSeats.join(', ')} `);
        if (guestSeats.length) seatListParts.push(`Guest Seats: ${guestSeats.join(', ')} `);

        const seatList = seatListParts.length ? seatListParts.join(' | ') : (ticket.seatNumber || 'N/A');

        // Append seatList to ticket object in response
        const ticketObj = { ...updatedTicket, userId: ticket.user, _id: ticket.id, seatList };

        // Create notification for student
        const notification = await prisma.notification.create({
            data: {
                userId: ticket.userId,
                title: 'Check-in Successful',
                message: `Your ticket has been successfully scanned by ${req.user.fullName}.`,
                type: 'system',
                relatedId: ticket.id,
            }
        });

        // Smart Auto-Populate Queue Feature
        let autoAddedToQueue = false;
        let queueStatus = null;
        let queueId = null;
        if (ticket.ticketType === 'student') {
            const existingQueue = await prisma.processionQueue.findFirst({ where: { userId: ticket.userId } });
            if (!existingQueue) {
                const lastEntry = await prisma.processionQueue.findFirst({ orderBy: { queueNumber: 'desc' } });
                const queueNumber = (lastEntry?.queueNumber || 0) + 1;
                const newQueue = await prisma.processionQueue.create({
                    data: {
                        userId: ticket.userId,
                        queueNumber,
                        major: ticket.user.major || 'Unknown',
                        status: 'waiting'
                    }
                });
                autoAddedToQueue = true;
                queueStatus = 'waiting';
                queueId = newQueue.id;
            } else {
                queueStatus = existingQueue.status;
                queueId = existingQueue.id;
            }
        }

        // Broadcast real-time update to Staff and MC
        const io = req.app.get('io');
        if (io) {
            console.log(`[Backend API] Emitting ceremony:ticket_scanned for ${ticket.user.fullName}`);
            io.to('ceremony').emit('ceremony:ticket_scanned', {
                id: updatedTicket.id,
                studentName: ticket.user.fullName,
                major: ticket.user.major,
                seatNumber: seatList,
                timestamp: updatedTicket.scannedAt,
                autoAddedToQueue,
                queueStatus,
                queueId
            });
            // Emit socket event to the student's personal room for notification
            io.to(ticket.userId.toString()).emit('new_notification', notification);
        }

        res.status(200).json(
            formatResponse(true, 'Ticket scanned successfully', { ticket: ticketObj })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private (Admin)
export const getAllTickets = async (req, res, next) => {
    try {
        const { isScanned, ticketType, page = 1, limit = 20 } = req.query;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        const where = {};
        if (isScanned !== undefined) {
            where.isScanned = isScanned === 'true';
        }
        if (ticketType) {
            where.ticketType = ticketType;
        }

        const tickets = await prisma.ticket.findMany({
            where,
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true }
                },
                scannedBy: {
                    select: { fullName: true }
                }
            },
            take: parsedLimit,
            skip: (parsedPage - 1) * parsedLimit,
            orderBy: { createdAt: 'desc' }
        });

        const count = await prisma.ticket.count({ where });

        const mappedTickets = tickets.map(t => ({ ...t, userId: t.user, _id: t.id }));

        res.status(200).json(
            formatResponse(true, 'Tickets retrieved successfully', {
                tickets: mappedTickets,
                totalPages: Math.ceil(count / parsedLimit),
                currentPage: parsedPage,
                total: count,
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get ticket statistics
// @route   GET /api/tickets/stats
// @access  Private (Admin, Staff)
export const getTicketStats = async (req, res, next) => {
    try {
        const totalTickets = await prisma.ticket.count();
        const scannedTickets = await prisma.ticket.count({ where: { isScanned: true } });
        const studentTickets = await prisma.ticket.count({ where: { ticketType: 'student' } });
        const guestTickets = await prisma.ticket.count({ where: { ticketType: 'guest' } });

        res.status(200).json(
            formatResponse(true, 'Statistics retrieved successfully', {
                stats: {
                    total: totalTickets,
                    scanned: scannedTickets,
                    unscanned: totalTickets - scannedTickets,
                    student: studentTickets,
                    guest: guestTickets,
                },
            })
        );
    } catch (error) {
        next(error);
    }
};
