import prisma from '../prisma.js';
import { formatResponse } from '../utils/helpers.js';

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
