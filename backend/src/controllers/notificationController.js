import Notification from '../models/Notification.js';
import { formatResponse } from '../utils/helpers.js';

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Notification.countDocuments({ userId: req.user._id });
        const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

        res.status(200).json(
            formatResponse(true, 'Notifications retrieved successfully', {
                notifications,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
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

        const notification = await Notification.findOne({ _id: id, userId: req.user._id });

        if (!notification) {
            return res.status(404).json(
                formatResponse(false, 'Notification not found')
            );
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json(
            formatResponse(true, 'Notification marked as read', { notification })
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
        await Notification.updateMany(
            { userId: req.user._id, isRead: false },
            { isRead: true }
        );

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

        const notification = await Notification.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!notification) {
            return res.status(404).json(
                formatResponse(false, 'Notification not found')
            );
        }

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
        let query = { status: 'active' };
        if (targetRole && targetRole !== 'all') {
            query.role = targetRole;
        }

        const User = (await import('../models/User.js')).default;
        const users = await User.find(query);

        // Create notifications for all users
        const notifications = users.map(user => ({
            userId: user._id,
            title,
            message,
            type: type || 'info',
        }));

        await Notification.insertMany(notifications);

        // Emit Socket.io event
        const io = req.app.get('io');
        users.forEach(user => {
            io.to(user._id.toString()).emit('new_notification', {
                title,
                message,
                type,
            });
        });

        res.status(200).json(
            formatResponse(true, `Notification sent to ${users.length} users`)
        );
    } catch (error) {
        next(error);
    }
};
