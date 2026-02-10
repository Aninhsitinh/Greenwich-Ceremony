import Ticket from '../models/Ticket.js';
import Registration from '../models/Registration.js';
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
        const registration = await Registration.findOne({
            userId: req.user._id,
            registrationStatus: { $in: ['pending', 'confirmed'] },
        });

        console.log('=== Ticket Generation Debug ===');
        console.log('User ID:', req.user._id);
        console.log('Registration found:', registration);
        console.log('Registration status:', registration?.registrationStatus);

        if (!registration) {
            return res.status(400).json(
                formatResponse(false, 'Please complete your registration first')
            );
        }

        // Check if ticket already exists
        const existingTicket = await Ticket.findOne({
            userId: req.user._id,
            ticketType,
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
            userId: req.user._id,
            studentId: req.user.studentId,
            fullName: req.user.fullName,
            ticketType,
            seatNumber,
        });

        // Generate QR code
        const qrCode = await generateQRCode(qrData);

        // Create ticket
        const ticket = await Ticket.create({
            userId: req.user._id,
            ticketType,
            qrCode,
            ticketNumber,
            seatNumber,
        });

        await ticket.populate('userId', 'fullName email studentId');

        // Update user journey status
        await updateJourneyStatus(req.user._id, { ticketGenerated: true });

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
        const tickets = await Ticket.find({ userId: req.user._id })
            .populate('userId', 'fullName email studentId profilePhoto')
            .populate('scannedBy', 'fullName');

        res.status(200).json(
            formatResponse(true, 'Tickets retrieved successfully', { tickets })
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

        const ticket = await Ticket.findOne({ ticketNumber })
            .populate('userId', 'fullName email studentId profilePhoto major classOf')
            .populate('scannedBy', 'fullName');

        if (!ticket) {
            return res.status(404).json(
                formatResponse(false, 'Ticket not found')
            );
        }

        res.status(200).json(
            formatResponse(true, 'Ticket retrieved successfully', { ticket })
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

        const ticket = await Ticket.findOne({ ticketNumber })
            .populate('userId', 'fullName email studentId profilePhoto');

        if (!ticket) {
            return res.status(404).json(
                formatResponse(false, 'Invalid ticket')
            );
        }

        if (ticket.isScanned) {
            return res.status(400).json(
                formatResponse(false, 'Ticket already scanned', {
                    ticket,
                    scannedAt: ticket.scannedAt,
                })
            );
        }

        // Mark as scanned
        ticket.isScanned = true;
        ticket.scannedAt = new Date();
        ticket.scannedBy = req.user._id;

        await ticket.save();
        await ticket.populate('scannedBy', 'fullName');

        res.status(200).json(
            formatResponse(true, 'Ticket scanned successfully', { ticket })
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

        const query = {};
        if (isScanned !== undefined) {
            query.isScanned = isScanned === 'true';
        }
        if (ticketType) {
            query.ticketType = ticketType;
        }

        const tickets = await Ticket.find(query)
            .populate('userId', 'fullName email studentId')
            .populate('scannedBy', 'fullName')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Ticket.countDocuments(query);

        res.status(200).json(
            formatResponse(true, 'Tickets retrieved successfully', {
                tickets,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
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
        const totalTickets = await Ticket.countDocuments();
        const scannedTickets = await Ticket.countDocuments({ isScanned: true });
        const studentTickets = await Ticket.countDocuments({ ticketType: 'student' });
        const guestTickets = await Ticket.countDocuments({ ticketType: 'guest' });

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
