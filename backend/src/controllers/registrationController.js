import Registration from '../models/Registration.js';
import SystemSettings from '../models/SystemSettings.js';
import { formatResponse } from '../utils/helpers.js';

// @desc    Create ceremony registration
// @route   POST /api/registrations
// @access  Private (Student)
export const createRegistration = async (req, res, next) => {
    try {
        const { ceremonyDate, gownSize, specialRequirements } = req.body;

        // Check if registration is open
        const settings = await SystemSettings.findOne();
        if (settings && !settings.isRegistrationOpen) {
            return res.status(400).json(
                formatResponse(false, 'Registration is currently closed')
            );
        }

        // Check if user already registered
        const existingRegistration = await Registration.findOne({
            userId: req.user._id,
            registrationStatus: { $ne: 'cancelled' }
        });

        if (existingRegistration) {
            return res.status(400).json(
                formatResponse(false, 'You have already registered for the ceremony')
            );
        }

        // Create registration
        const registration = await Registration.create({
            userId: req.user._id,
            ceremonyDate,
            gownSize,
            specialRequirements,
            registrationStatus: 'confirmed',  // Auto-confirm for students
            attendanceConfirmed: true,
        });

        await registration.populate('userId', 'fullName email studentId');

        res.status(201).json(
            formatResponse(true, 'Registration created successfully', { registration })
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
        const registration = await Registration.findOne({ userId: req.user._id })
            .populate('userId', 'fullName email studentId profilePhoto');

        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'No registration found')
            );
        }

        res.status(200).json(
            formatResponse(true, 'Registration retrieved successfully', { registration })
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
        const { gownSize, specialRequirements } = req.body;

        let registration = await Registration.findById(id);

        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'Registration not found')
            );
        }

        // Check ownership (students can only update their own)
        if (req.user.role === 'student' && registration.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json(
                formatResponse(false, 'Not authorized to update this registration')
            );
        }

        registration.gownSize = gownSize || registration.gownSize;
        registration.specialRequirements = specialRequirements || registration.specialRequirements;

        await registration.save();
        await registration.populate('userId', 'fullName email studentId');

        res.status(200).json(
            formatResponse(true, 'Registration updated successfully', { registration })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Private
export const cancelRegistration = async (req, res, next) => {
    try {
        const { id } = req.params;

        const registration = await Registration.findById(id);

        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'Registration not found')
            );
        }

        // Check ownership
        if (req.user.role === 'student' && registration.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json(
                formatResponse(false, 'Not authorized to cancel this registration')
            );
        }

        registration.registrationStatus = 'cancelled';
        await registration.save();

        res.status(200).json(
            formatResponse(true, 'Registration cancelled successfully')
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get all registrations
// @route   GET /api/registrations
// @access  Private (Admin, Staff)
export const getAllRegistrations = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) {
            query.registrationStatus = status;
        }

        const registrations = await Registration.find(query)
            .populate('userId', 'fullName email studentId major classOf')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Registration.countDocuments(query);

        res.status(200).json(
            formatResponse(true, 'Registrations retrieved successfully', {
                registrations,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count,
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Confirm registration
// @route   PUT /api/registrations/:id/confirm
// @access  Private (Admin)
export const confirmRegistration = async (req, res, next) => {
    try {
        const { id } = req.params;

        const registration = await Registration.findById(id);

        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'Registration not found')
            );
        }

        registration.registrationStatus = 'confirmed';
        registration.attendanceConfirmed = true;
        await registration.save();

        await registration.populate('userId', 'fullName email studentId');

        res.status(200).json(
            formatResponse(true, 'Registration confirmed successfully', { registration })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Mark gown as collected
// @route   PUT /api/registrations/:id/gown-collected
// @access  Private (Staff)
export const markGownCollected = async (req, res, next) => {
    try {
        const { id } = req.params;

        const registration = await Registration.findById(id);

        if (!registration) {
            return res.status(404).json(
                formatResponse(false, 'Registration not found')
            );
        }

        registration.gownCollected = true;
        registration.gownCollectionTime = new Date();
        await registration.save();

        res.status(200).json(
            formatResponse(true, 'Gown collection recorded successfully', { registration })
        );
    } catch (error) {
        next(error);
    }
};
