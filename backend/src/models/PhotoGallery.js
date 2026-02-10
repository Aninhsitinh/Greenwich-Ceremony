import mongoose from 'mongoose';

const photoGallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide title'],
    },
    description: {
        type: String,
        default: null,
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide image URL'],
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    ceremonyDate: {
        type: Date,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Index for faster queries
photoGallerySchema.index({ ceremonyDate: -1 });
photoGallerySchema.index({ tags: 1 });

const PhotoGallery = mongoose.model('PhotoGallery', photoGallerySchema);

export default PhotoGallery;
