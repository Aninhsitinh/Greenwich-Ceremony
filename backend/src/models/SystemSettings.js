import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
    ceremonyDate: {
        type: Date,
        required: true,
    },
    registrationDeadline: {
        type: Date,
        required: true,
    },
    maxGuestPerStudent: {
        type: Number,
        default: 2,
    },
    gownCollectionStartDate: {
        type: Date,
        required: true,
    },
    gownCollectionEndDate: {
        type: Date,
        required: true,
    },
    venueCapacity: {
        type: Number,
        default: 500,
    },
    isRegistrationOpen: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

export default SystemSettings;
