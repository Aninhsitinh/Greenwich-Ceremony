import prisma from '../prisma.js';
import { formatResponse } from '../utils/helpers.js';

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: parsedLimit,
            skip: (parsedPage - 1) * parsedLimit
        });

        const count = await prisma.notification.count({
            where: { userId: req.user.id }
        });

        const unreadCount = await prisma.notification.count({
            where: { userId: req.user.id, isRead: false }
        });

        res.status(200).json(
            formatResponse(true, 'Notifications retrieved successfully', {
                notifications,
                totalPages: Math.ceil(count / parsedLimit),
                currentPage: parsedPage,
                total: count,
                unreadCount,
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;

        const notification = await prisma.notification.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!notification) {
            return res.status(404).json(
                formatResponse(false, 'Notification not found')
            );
        }

        const updatedNotification = await prisma.notification.update({
            where: { id: notification.id },
            data: { isRead: true }
        });

        res.status(200).json(
            formatResponse(true, 'Notification marked as read', { notification: updatedNotification })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id, isRead: false },
            data: { isRead: true }
        });

        res.status(200).json(
            formatResponse(true, 'All notifications marked as read')
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const notification = await prisma.notification.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!notification) {
            return res.status(404).json(
                formatResponse(false, 'Notification not found')
            );
        }

        await prisma.notification.delete({
            where: { id: notification.id }
        });

        res.status(200).json(
            formatResponse(true, 'Notification deleted successfully')
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Broadcast notification
// @route   POST /api/notifications/broadcast
// @access  Private (Admin)
export const broadcastNotification = async (req, res, next) => {
    try {
        const { title, message, type, targetRole } = req.body;

        // Get users to notify
        const where = { status: 'active' };
        if (targetRole && targetRole !== 'all') {
            where.role = targetRole;
        }

        const users = await prisma.user.findMany({ where });

        // Create notifications for all users
        const notifications = users.map(user => ({
            userId: user.id,
            title,
            message,
            type: type || 'info',
        }));

        await prisma.notification.createMany({
            data: notifications
        });

        // Emit Socket.io event
        const io = req.app.get('io');
        if (io) {
            users.forEach(user => {
                io.to(user.id.toString()).emit('new_notification', {
                    title,
                    message,
                    type,
                });
            });
        }

        res.status(200).json(
            formatResponse(true, `Notification sent to ${users.length} users`)
        );
    } catch (error) {
        next(error);
    }
};
