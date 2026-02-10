import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';
import { formatResponse, generateOTP } from '../utils/helpers.js';
import crypto from 'crypto';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { studentId, email, password, fullName, phone, major, classOf } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { studentId }] });

        if (existingUser) {
            return res.status(400).json(
                formatResponse(false, 'User with this email or student ID already exists')
            );
        }

        // Create user
        const user = await User.create({
            studentId,
            email,
            password,
            fullName,
            phone,
            major,
            classOf,
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json(
            formatResponse(true, 'User registered successfully', {
                token,
                user: {
                    id: user._id,
                    studentId: user.studentId,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                },
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json(
                formatResponse(false, 'Please provide email and password')
            );
        }

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json(
                formatResponse(false, 'Invalid credentials')
            );
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json(
                formatResponse(false, 'Invalid credentials')
            );
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json(
                formatResponse(false, 'Account is inactive or suspended')
            );
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json(
            formatResponse(true, 'Login successful', {
                token,
                user: {
                    id: user._id,
                    studentId: user.studentId,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    profilePhoto: user.profilePhoto,
                },
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json(
            formatResponse(true, 'User retrieved successfully', { user })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const { fullName, phone, profilePhoto } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { fullName, phone, profilePhoto },
            { new: true, runValidators: true }
        );

        res.status(200).json(
            formatResponse(true, 'Profile updated successfully', { user })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(
                formatResponse(false, 'User not found')
            );
        }

        // Generate OTP
        const otp = generateOTP(6);

        // Hash OTP and save to user
        const resetToken = crypto.createHash('sha256').update(otp).digest('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // TODO: Send OTP via email
        // For now, return OTP in response (REMOVE IN PRODUCTION)
        res.status(200).json(
            formatResponse(true, 'OTP sent to email', { otp })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        // Hash OTP to compare
        const resetToken = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json(
                formatResponse(false, 'Invalid or expired OTP')
            );
        }

        res.status(200).json(
            formatResponse(true, 'OTP verified successfully', {
                resetToken: resetToken
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json(
                formatResponse(false, 'Invalid or expired reset token')
            );
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json(
            formatResponse(true, 'Password reset successfully')
        );
    } catch (error) {
        next(error);
    }
};
