import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide title'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
    },
    category: {
        type: String,
        enum: ['urgent', 'updates', 'general'],
        default: 'general',
    },
    coverImage: {
        type: String,
        default: null,
    },
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    targetAudience: {
        type: [String],
        enum: ['student', 'staff', 'admin', 'mc', 'all'],
        default: ['all'],
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    publishDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Index for faster queries
announcementSchema.index({ isPublished: 1, publishDate: -1 });
announcementSchema.index({ category: 1 });

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
