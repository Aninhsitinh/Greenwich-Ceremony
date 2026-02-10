import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ceremonyDate: {
        type: Date,
        required: true,
    },
    gownSize: {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        required: [true, 'Please select gown size'],
    },
    gownCollected: {
        type: Boolean,
        default: false,
    },
    gownCollectionTime: {
        type: Date,
        default: null,
    },
    attendanceConfirmed: {
        type: Boolean,
        default: false,
    },
    registrationStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
    specialRequirements: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});

// Index for faster queries
registrationSchema.index({ userId: 1 });
registrationSchema.index({ registrationStatus: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
