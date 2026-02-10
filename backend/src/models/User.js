import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: [true, 'Please provide student ID'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
        select: false,
    },
    fullName: {
        type: String,
        required: [true, 'Please provide full name'],
    },
    role: {
        type: String,
        enum: ['student', 'staff', 'admin', 'mc'],
        default: 'student',
    },
    profilePhoto: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        default: null,
    },
    major: {
        type: String,
        default: null,
    },
    classOf: {
        type: Number,
        default: 2024,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
    },
    journeyStatus: {
        registrationCompleted: {
            type: Boolean,
            default: false,
        },
        ticketGenerated: {
            type: Boolean,
            default: false,
        },
        seatsBooked: {
            type: Boolean,
            default: false,
        },
        gownCollected: {
            type: Boolean,
            default: false,
        },
        paymentCompleted: {
            type: Boolean,
            default: false,
        },
        currentStep: {
            type: Number,
            default: 1, // 1: Registration, 2: Ticket, 3: Seats, 4: Gown, 5: Payment
            min: 1,
            max: 5,
        },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
