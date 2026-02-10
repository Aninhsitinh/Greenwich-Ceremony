import SeatBooking from '../models/SeatBooking.js';
import SystemSettings from '../models/SystemSettings.js';
import { formatResponse } from '../utils/helpers.js';
import { updateJourneyStatus } from '../utils/journeyHelpers.js';

// @desc    Get available seats
// @route   GET /api/seats
// @access  Private
export const getAvailableSeats = async (req, res, next) => {
    try {
        // Get all booked seats
        const bookedSeats = await SeatBooking.find({ status: { $ne: 'cancelled' } }).select('seatNumber seatType');

        // Get venue capacity
        const settings = await SystemSettings.findOne();
        const capacity = settings ? settings.venueCapacity : 500;

        res.status(200).json(
            formatResponse(true, 'Seats retrieved successfully', {
                bookedSeats,
                totalCapacity: capacity,
                availableSeats: capacity - bookedSeats.length,
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

        // Check if seat is already booked
        const existingBooking = await SeatBooking.findOne({
            seatNumber,
            status: { $ne: 'cancelled' },
        });

        if (existingBooking) {
            return res.status(400).json(
                formatResponse(false, 'Seat is already booked')
            );
        }

        // Check guest limit
        if (seatType === 'guest') {
            const settings = await SystemSettings.findOne();
            const maxGuests = settings ? settings.maxGuestPerStudent : 2;

            const userGuestBookings = await SeatBooking.countDocuments({
                userId: req.user._id,
                seatType: 'guest',
                status: { $ne: 'cancelled' },
            });

            if (userGuestBookings >= maxGuests) {
                return res.status(400).json(
                    formatResponse(false, `You can only book up to ${maxGuests} guest seats`)
                );
            }
        }

        // Create booking
        const booking = await SeatBooking.create({
            userId: req.user._id,
            seatNumber,
            seatType,
            guestName,
            guestRelation,
            guestPhone,
        });

        await booking.populate('userId', 'fullName email studentId');

        // Update user journey status (mark as seats booked)
        await updateJourneyStatus(req.user._id, { seatsBooked: true });

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
        const bookings = await SeatBooking.find({
            userId: req.user._id,
            status: { $ne: 'cancelled' },
        }).populate('userId', 'fullName email studentId');

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

        const booking = await SeatBooking.findById(id);

        if (!booking) {
            return res.status(404).json(
                formatResponse(false, 'Booking not found')
            );
        }

        // Check ownership
        if (req.user.role === 'student' && booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json(
                formatResponse(false, 'Not authorized to cancel this booking')
            );
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json(
            formatResponse(true, 'Booking cancelled successfully')
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get all bookings
// @route   GET /api/seats/all
// @access  Private (Admin, Staff)
export const getAllBookings = async (req, res, next) => {
    try {
        const { status, seatType, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) {
            query.status = status;
        }
        if (seatType) {
            query.seatType = seatType;
        }

        const bookings = await SeatBooking.find(query)
            .populate('userId', 'fullName email studentId')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await SeatBooking.countDocuments(query);

        res.status(200).json(
            formatResponse(true, 'Bookings retrieved successfully', {
                bookings,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count,
            })
        );
    } catch (error) {
        next(error);
    }
};
