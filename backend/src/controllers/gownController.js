import GownCollection from '../models/GownCollection.js';
import User from '../models/User.js';
import { formatResponse } from '../utils/helpers.js';

// @desc    Request gown collection
// @route   POST /api/gown/request
// @access  Private (Student)
export const requestGownCollection = async (req, res, next) => {
    try {
        const { size, scheduledDate, notes } = req.body;

        // Check if user has completed seat booking
        const user = await User.findById(req.user._id);
        if (!user.journeyStatus.seatsBooked) {
            return res.status(403).json(
                formatResponse(false, 'Please complete seat booking before requesting gown collection')
            );
        }

        // Check if already has a gown request
        const existingRequest = await GownCollection.findOne({
            userId: req.user._id,
            status: { $in: ['pending', 'scheduled', 'collected'] }
        });

        if (existingRequest) {
            return res.status(400).json(
                formatResponse(false, 'You already have an active gown collection request')
            );
        }

        // Create gown collection request
        const gownCollection = await GownCollection.create({
            userId: req.user._id,
            registrationId: req.user.registrationId, // Assuming this exists
            size,
            scheduledDate,
            status: 'scheduled',
            notes,
        });

        // Update user journey status
        user.journeyStatus.gownCollected = false; // Will be true when actually collected
        user.journeyStatus.currentStep = 4;
        await user.save();

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
        const gownCollection = await GownCollection.findOne({ userId: req.user._id })
            .sort({ createdAt: -1 });

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
        const gownCollection = await GownCollection.findById(req.params.id);

        if (!gownCollection) {
            return res.status(404).json(
                formatResponse(false, 'Gown collection request not found')
            );
        }

        gownCollection.status = 'collected';
        gownCollection.collectionDate = new Date();
        await gownCollection.save();

        // Update user journey status
        const user = await User.findById(gownCollection.userId);
        user.journeyStatus.gownCollected = true;
        await user.save();

        res.status(200).json(
            formatResponse(true, 'Gown marked as collected successfully', { gownCollection })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Mark gown as returned
// @route   PUT /api/gown/:id/return
// @access  Private (Staff, Admin)
export const markAsReturned = async (req, res, next) => {
    try {
        const gownCollection = await GownCollection.findById(req.params.id);

        if (!gownCollection) {
            return res.status(404).json(
                formatResponse(false, 'Gown collection request not found')
            );
        }

        gownCollection.status = 'returned';
        gownCollection.returnDate = new Date();
        await gownCollection.save();

        res.status(200).json(
            formatResponse(true, 'Gown marked as returned successfully', { gownCollection })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get all gown collection requests (Admin/Staff)
// @route   GET /api/gown
// @access  Private (Admin, Staff)
export const getAllGownRequests = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;

        const gownRequests = await GownCollection.find(query)
            .populate('userId', 'fullName email studentId')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ scheduledDate: 1 });

        const count = await GownCollection.countDocuments(query);

        res.status(200).json(
            formatResponse(true, 'Gown collection requests retrieved successfully', {
                gownRequests,
                totalPages: Math.ceil(count / limit),
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

        const gownCollection = await GownCollection.findById(req.params.id);

        if (!gownCollection) {
            return res.status(404).json(
                formatResponse(false, 'Gown collection request not found')
            );
        }

        // Check ownership
        if (gownCollection.userId.toString() !== req.user._id.toString()) {
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

        if (size) gownCollection.size = size;
        if (scheduledDate) gownCollection.scheduledDate = scheduledDate;
        if (notes !== undefined) gownCollection.notes = notes;

        await gownCollection.save();

        res.status(200).json(
            formatResponse(true, 'Gown collection request updated successfully', { gownCollection })
        );
    } catch (error) {
        next(error);
    }
};
