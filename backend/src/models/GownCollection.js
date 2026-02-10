import mongoose from 'mongoose';

const gownCollectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    registrationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration',
        required: true,
    },
    size: {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        required: true,
    },
    collectionDate: {
        type: Date,
        default: null,
    },
    scheduledDate: {
        type: Date,
        required: true,
    },
    returnDate: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ['pending', 'scheduled', 'collected', 'returned'],
        default: 'pending',
    },
    depositPaid: {
        type: Boolean,
        default: false,
    },
    depositAmount: {
        type: Number,
        default: 500000, // 500k VND deposit
    },
    notes: {
        type: String,
        default: null,
    },
    collectionLocation: {
        type: String,
        default: 'Main Office - Building A, Room 101',
    },
}, {
    timestamps: true,
});

// Index for faster queries
gownCollectionSchema.index({ userId: 1 });
gownCollectionSchema.index({ status: 1 });
gownCollectionSchema.index({ scheduledDate: 1 });

const GownCollection = mongoose.model('GownCollection', gownCollectionSchema);

export default GownCollection;
