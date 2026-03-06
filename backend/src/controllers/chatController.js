import prisma from '../prisma.js';

/**
 * @desc    Get all conversations for admin/staff (list of users who have messaged)
 * @route   GET /api/chat/conversations
 * @access  Private (Admin/Staff only)
 */
export const getConversations = async (req, res) => {
    try {
        // Staff/Admins want to see a list of individual students they are talking to
        // Fetch the latest message per sender where senderRole is student
        const conversations = await prisma.chatMessage.findMany({
            where: {
                senderRole: 'student'
            },
            distinct: ['senderId'],
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                sender: {
                    select: {
                        fullName: true,
                        email: true,
                        studentId: true,
                        profilePhoto: true
                    }
                }
            }
        });

        // Format the response
        const formattedConversations = conversations.map(c => ({
            student: {
                _id: c.senderId,
                fullName: c.sender.fullName,
                email: c.sender.email,
                studentId: c.sender.studentId,
                profilePhoto: c.sender.profilePhoto
            },
            lastMessage: {
                message: c.message,
                createdAt: c.createdAt,
                isRead: c.isRead,
                senderRole: c.senderRole
            },
            roomId: c.roomId
        })).filter(c => c.student !== null); // remove if user was deleted

        res.json({
            success: true,
            data: formattedConversations
        });

    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch conversations',
            error: error.message
        });
    }
};

/**
 * @desc    Get chat history for a specific room (student)
 * @route   GET /api/chat/:roomId/messages
 * @access  Private
 */
export const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;

        // Admin/Staff can read any room. Student can only read their own room.
        if (req.user.role === 'student' && req.user.id !== roomId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this chat room'
            });
        }

        const skip = (page - 1) * limit;

        const messages = await prisma.chatMessage.findMany({
            where: { roomId },
            orderBy: { createdAt: 'asc' }, // Chronological order
            skip,
            take: limit,
            include: {
                sender: {
                    select: { fullName: true, role: true, profilePhoto: true }
                },
                receiver: {
                    select: { fullName: true, role: true, profilePhoto: true }
                }
            }
        });

        const totalMessages = await prisma.chatMessage.count({ where: { roomId } });

        // Transform for frontend compatibility (_id to id)
        const formattedMessages = messages.map(msg => ({
            ...msg,
            _id: msg.id,
            senderId: msg.sender ? { ...msg.sender, _id: msg.senderId } : null,
            receiverId: msg.receiver ? { ...msg.receiver, _id: msg.receiverId } : null
        }));

        res.json({
            success: true,
            data: {
                messages: formattedMessages,
                pagination: {
                    total: totalMessages,
                    page,
                    pages: Math.ceil(totalMessages / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
};

/**
 * @desc    Mark messages as read
 * @route   PUT /api/chat/:roomId/read
 * @access  Private
 */
export const markAsRead = async (req, res) => {
    try {
        const { roomId } = req.params;

        // Mark all messages in this room not sent by the current user as read
        const result = await prisma.chatMessage.updateMany({
            where: {
                roomId,
                senderId: { not: req.user.id },
                isRead: false
            },
            data: { isRead: true }
        });

        if (result.count > 0) {
            const io = req.app.get('io');
            if (io) {
                io.to(roomId).emit('chat:read_receipt', {
                    roomId,
                    readBy: req.user.id,
                    readAt: new Date()
                });
            }
        }

        res.json({
            success: true,
            message: 'Messages marked as read'
        });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark messages as read',
            error: error.message
        });
    }
};
