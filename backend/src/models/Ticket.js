import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ticketType: {
        type: String,
        enum: ['student', 'guest'],
        required: true,
    },
    qrCode: {
        type: String,
        required: true,
    },
    ticketNumber: {
        type: String,
        required: true,
        unique: true,
    },
    isScanned: {
        type: Boolean,
        default: false,
    },
    scannedAt: {
        type: Date,
        default: null,
    },
    scannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    seatNumber: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});

// Index for faster queries
ticketSchema.index({ userId: 1 });
ticketSchema.index({ ticketNumber: 1 });
ticketSchema.index({ isScanned: 1 });

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
