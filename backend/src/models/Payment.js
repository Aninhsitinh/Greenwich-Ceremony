import mongoose from 'mongoose';

const paymentItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    }
}, { _id: false });

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: [true, 'Please provide amount'],
    },
    paymentType: {
        type: String,
        enum: ['gown_rental', 'photo_package', 'additional_guest', 'graduation_package', 'other'],
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['bank_transfer', 'cash', 'online', 'qr', 'card'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    transactionId: {
        type: String,
        default: null,
    },
    receiptUrl: {
        type: String,
        default: null,
    },
    items: [paymentItemSchema],
    notes: {
        type: String,
        default: null,
    }
}, {
    timestamps: true,
});

// Index for faster queries
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
