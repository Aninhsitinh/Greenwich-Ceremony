import mongoose from 'mongoose';

const processionQueueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    queueNumber: {
        type: Number,
        required: true,
    },
    major: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['waiting', 'ready', 'on-stage', 'completed'],
        default: 'waiting',
    },
    callTime: {
        type: Date,
        default: null,
    },
    completedTime: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

// Index for faster queries
processionQueueSchema.index({ queueNumber: 1 });
processionQueueSchema.index({ status: 1 });
processionQueueSchema.index({ major: 1 });

const ProcessionQueue = mongoose.model('ProcessionQueue', processionQueueSchema);

export default ProcessionQueue;
