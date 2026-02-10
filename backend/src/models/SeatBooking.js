import mongoose from 'mongoose';

const seatBookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    seatNumber: {
        type: String,
        required: [true, 'Please provide seat number'],
    },
    seatType: {
        type: String,
        enum: ['student', 'guest'],
        required: true,
    },
    guestName: {
        type: String,
        default: null,
    },
    guestRelation: {
        type: String,
        enum: ['parent', 'sibling', 'friend', 'other', null],
        default: null,
    },
    guestPhone: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ['booked', 'confirmed', 'cancelled'],
        default: 'booked',
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Index for faster queries
seatBookingSchema.index({ userId: 1 });
seatBookingSchema.index({ seatNumber: 1 });
seatBookingSchema.index({ status: 1 });

// Unique constraint: one seat can only be booked once (if not cancelled)
seatBookingSchema.index(
    { seatNumber: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } }
);

const SeatBooking = mongoose.model('SeatBooking', seatBookingSchema);

export default SeatBooking;
