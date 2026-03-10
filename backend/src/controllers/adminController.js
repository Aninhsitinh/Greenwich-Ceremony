import prisma from '../prisma.js';
import { formatResponse } from '../utils/helpers.js';
import bcrypt from 'bcryptjs';

// @desc    Get all users with their roles, statuses, and creation dates
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;

        const where = {};
        if (role) where.role = role;

        if (search) {
            const searchLower = search.toLowerCase();
            where.OR = [
                { fullName: { contains: searchLower, mode: 'insensitive' } },
                { email: { contains: searchLower, mode: 'insensitive' } },
                { studentId: { contains: searchLower, mode: 'insensitive' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                studentId: true,
                email: true,
                fullName: true,
                role: true,
                profilePhoto: true,
                phone: true,
                major: true,
                classOf: true,
                status: true,
                jobTitle: true,
                journeyRegistrationCompleted: true,
                journeyTicketGenerated: true,
                journeySeatsBooked: true,
                journeyGownCollected: true,
                journeyPaymentCompleted: true,
                journeyCurrentStep: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: parseInt(limit)
        });

        const total = await prisma.user.count({ where });

        res.status(200).json(
            formatResponse(true, 'Users retrieved successfully', {
                users,
                pagination: {
                    current: parseInt(page),
                    total: Math.ceil(total / parseInt(limit)),
                    count: users.length,
                    totalItems: total
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Update a user's role
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['student', 'staff', 'admin', 'mc'].includes(role)) {
            return res.status(400).json(
                formatResponse(false, 'Invalid role provided.')
            );
        }

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return res.status(404).json(formatResponse(false, 'User not found.'));
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true
            }
        });

        res.status(200).json(
            formatResponse(true, `User role successfully updated to ${role}`, { user: updatedUser })
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'User not found.'));
        }
        next(error);
    }
};

// @desc    Create a new staff account with default password
// @route   POST /api/admin/users/staff
// @access  Private (Admin)
export const createStaffAccount = async (req, res, next) => {
    try {
        const { email, fullName } = req.body;

        if (!email || !fullName) {
            return res.status(400).json(formatResponse(false, 'Please provide email and full name.'));
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json(formatResponse(false, 'An account with this email already exists.'));
        }

        // Hash default password '123456'
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // Create the staff user
        const newStaff = await prisma.user.create({
            data: {
                email,
                fullName,
                password: hashedPassword,
                role: 'staff'
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true
            }
        });

        res.status(201).json(
            formatResponse(true, 'Staff account created successfully with default password "123456"', { user: newStaff })
        );
    } catch (error) {
        next(error);
    }
};
