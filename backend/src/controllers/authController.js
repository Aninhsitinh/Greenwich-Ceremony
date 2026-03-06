import prisma from '../prisma.js';
import { generateToken } from '../config/jwt.js';
import { formatResponse, generateOTP } from '../utils/helpers.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendOTPEmail } from '../utils/emailService.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { studentId, email, password, fullName, phone, major, classOf } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    studentId ? { studentId: studentId } : {}
                ].filter(condition => Object.keys(condition).length > 0)
            }
        });

        if (existingUser) {
            return res.status(400).json(
                formatResponse(false, 'User with this email or (if provided) student ID already exists')
            );
        }

        // Validate Major and Student ID Prefix
        const validMajors = [
            'Công nghệ thông tin',
            'Trí tuệ nhân tạo',
            'Thiết kế đồ họa & kỹ thuật số',
            'Truyền thông đa phương tiện',
            'Quản trị Kinh doanh',
            'Quản trị Marketing',
            'Logistics và Quản lý Chuỗi cung ứng',
            'Kinh doanh quốc tế',
            'Quản trị Sự kiện',
            'Quản trị Truyền thông'
        ];

        if (major && !validMajors.includes(major)) {
            return res.status(400).json(
                formatResponse(false, 'Invalid major selected')
            );
        }

        if (major && studentId) {
            let expectedPrefix = 'GBS'; // Default to GBS
            const gcsMajors = ['Công nghệ thông tin', 'Trí tuệ nhân tạo'];
            const gdsMajors = ['Thiết kế đồ họa & kỹ thuật số'];

            if (gcsMajors.includes(major)) {
                expectedPrefix = 'GCS';
            } else if (gdsMajors.includes(major)) {
                expectedPrefix = 'GDS';
            }

            if (!studentId.toUpperCase().startsWith(expectedPrefix)) {
                return res.status(400).json(
                    formatResponse(false, `Student ID must start with ${expectedPrefix} for the selected major`)
                );
            }
        }

        // Hash password before save: Prisma doesn't have pre-save hooks easily
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await prisma.user.create({
            data: {
                studentId,
                email,
                password: hashedPassword,
                fullName,
                phone,
                major,
                classOf: parseInt(classOf) || 2026,
            }
        });

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json(
            formatResponse(true, 'User registered successfully', {
                token,
                user: {
                    id: user.id,
                    studentId: user.studentId,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    phone: user.phone,
                    major: user.major,
                    classOf: user.classOf,
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

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json(
                formatResponse(false, 'Invalid credentials')
            );
        }

        // Check password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

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
        const token = generateToken(user.id);

        res.status(200).json(
            formatResponse(true, 'Login successful', {
                token,
                user: {
                    id: user.id,
                    studentId: user.studentId,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    profilePhoto: user.profilePhoto,
                    phone: user.phone,
                    major: user.major,
                    classOf: user.classOf,
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
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                studentId: true,
                email: true,
                fullName: true,
                role: true,
                profilePhoto: true,
                phone: true,
                major: true,
                classOf: true,
                status: true,
                jobTitle: true,
                journeyRegistrationCompleted: true,
                journeyTicketGenerated: true,
                journeySeatsBooked: true,
                journeyGownCollected: true,
                journeyPaymentCompleted: true,
                journeyCurrentStep: true,
                createdAt: true,
                updatedAt: true
            }
        });

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
        const { fullName, phone, profilePhoto, classOf } = req.body;

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { fullName, phone, profilePhoto, classOf: parseInt(classOf) || undefined },
            select: {
                id: true,
                studentId: true,
                email: true,
                fullName: true,
                role: true,
                profilePhoto: true,
                phone: true,
                major: true,
                classOf: true,
                status: true
            }
        });

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

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json(
                formatResponse(false, 'User not found')
            );
        }

        // Generate OTP
        const otp = generateOTP(6);

        // Hash OTP and save to user
        const resetToken = crypto.createHash('sha256').update(otp).digest('hex');

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            }
        });

        // Send OTP via email
        try {
            await sendOTPEmail({ email: user.email, otp });
        } catch (error) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetPasswordToken: null,
                    resetPasswordExpire: null
                }
            });
            return res.status(500).json(
                formatResponse(false, 'Email could not be sent')
            );
        }

        res.status(200).json(
            formatResponse(true, 'OTP sent to email')
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

        const user = await prisma.user.findFirst({
            where: {
                email,
                resetPasswordToken: resetToken,
                resetPasswordExpire: { gt: new Date() },
            }
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

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json(
                formatResponse(false, 'User not found')
            );
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json(
                formatResponse(false, 'Invalid current password')
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        res.status(200).json(
            formatResponse(true, 'Password updated successfully')
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

        const user = await prisma.user.findFirst({
            where: {
                email,
                resetPasswordToken: resetToken,
                resetPasswordExpire: { gt: new Date() },
            }
        });

        if (!user) {
            return res.status(400).json(
                formatResponse(false, 'Invalid or expired reset token')
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Set new password
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpire: null
            }
        });

        res.status(200).json(
            formatResponse(true, 'Password reset successfully')
        );
    } catch (error) {
        next(error);
    }
};
