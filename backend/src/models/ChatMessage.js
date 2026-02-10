import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null, // null means message to support
    },
    senderRole: {
        type: String,
        enum: ['student', 'staff', 'admin', 'mc'],
        required: true,
    },
    message: {
        type: String,
        required: [true, 'Message cannot be empty'],
    },
    attachments: {
        type: [String],
        default: [],
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    roomId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

// Index for faster queries
chatMessageSchema.index({ roomId: 1, createdAt: -1 });
chatMessageSchema.index({ senderId: 1, receiverId: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
