import prisma from '../prisma.js';
import { formatResponse, generateOTP } from '../utils/helpers.js';
import { sendPaymentOTP } from '../utils/emailService.js';

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
export const createPayment = async (req, res, next) => {
    try {
        const { amount, paymentType, paymentMethod, transactionId, status, items, notes } = req.body;

        const payment = await prisma.payment.create({
            data: {
                userId: req.user.id,
                amount,
                paymentType,
                paymentMethod,
                transactionId,
                status: status || 'pending',
                // Prisma Json type needs to be a valid JSON object or array. Wait, in schema it's `Json?`.
                items: items || [],
                notes,
            }
        });

        res.status(201).json(
            formatResponse(true, 'Payment created successfully', { payment })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Send Payment OTP
// @route   POST /api/payments/otp
// @access  Public
export const sendOTP = async (req, res, next) => {
    try {
        const { email, amount, provider } = req.body;

        if (!email) {
            return res.status(400).json(formatResponse(false, 'Email is required'));
        }

        const otp = generateOTP(6);

        await sendPaymentOTP({
            email,
            otp,
            amount: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0),
            provider: provider || 'Card Payment'
        });

        res.status(200).json(
            formatResponse(true, 'OTP sent successfully', { otp })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get my payments
// @route   GET /api/payments/my-payments
// @access  Private
export const getMyPayments = async (req, res, next) => {
    try {
        const payments = await prisma.payment.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        const totalPaid = payments
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);

        const pendingAmount = payments
            .filter(p => p.status === 'pending')
            .reduce((sum, p) => sum + p.amount, 0);

        const mappedPayments = payments.map(p => ({ ...p, _id: p.id }));

        res.status(200).json(
            formatResponse(true, 'Payments retrieved successfully', {
                payments: mappedPayments,
                summary: {
                    totalPaid,
                    pendingAmount,
                    paymentCount: payments.length
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = async (req, res, next) => {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: req.params.id }
        });

        if (!payment) {
            return res.status(404).json(
                formatResponse(false, 'Payment not found')
            );
        }

        // Check ownership
        if (req.user.role === 'student' && payment.userId !== req.user.id) {
            return res.status(403).json(
                formatResponse(false, 'Not authorized to view this payment')
            );
        }

        res.status(200).json(
            formatResponse(true, 'Payment retrieved successfully', { payment })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Update payment status (Admin/Staff)
// @route   PUT /api/payments/:id
// @access  Private (Admin, Staff)
export const updatePaymentStatus = async (req, res, next) => {
    try {
        const { status, transactionId, receiptUrl } = req.body;

        const payment = await prisma.payment.findUnique({
            where: { id: req.params.id }
        });

        if (!payment) {
            return res.status(404).json(
                formatResponse(false, 'Payment not found')
            );
        }

        const updatedData = {};
        if (status) updatedData.status = status;
        if (transactionId) updatedData.transactionId = transactionId;
        if (receiptUrl) updatedData.receiptUrl = receiptUrl;

        const updatedPayment = await prisma.payment.update({
            where: { id: payment.id },
            data: updatedData
        });

        res.status(200).json(
            formatResponse(true, 'Payment updated successfully', { payment: updatedPayment })
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'Payment not found'));
        }
        next(error);
    }
};

// @desc    Get all payments (Admin/Staff)
// @route   GET /api/payments
// @access  Private (Admin, Staff)
export const getAllPayments = async (req, res, next) => {
    try {
        const { status, paymentType, page = 1, limit = 20 } = req.query;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        const where = {};
        if (status) where.status = status;
        if (paymentType) where.paymentType = paymentType;

        const payments = await prisma.payment.findMany({
            where,
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true }
                }
            },
            take: parsedLimit,
            skip: (parsedPage - 1) * parsedLimit,
            orderBy: { createdAt: 'desc' }
        });

        const count = await prisma.payment.count({ where });

        // Calculate totals using aggregations
        const totals = await prisma.payment.groupBy({
            by: ['status'],
            _sum: { amount: true },
            _count: { id: true }
        });

        const completedStats = totals.find(t => t.status === 'completed') || { _sum: { amount: 0 }, _count: { id: 0 } };
        const pendingStats = totals.find(t => t.status === 'pending') || { _sum: { amount: 0 }, _count: { id: 0 } };

        const mappedPayments = payments.map(p => ({ ...p, _id: p.id }));

        res.status(200).json(
            formatResponse(true, 'Payments retrieved successfully', {
                payments: mappedPayments,
                totalPages: Math.ceil(count / parsedLimit),
                currentPage: parsedPage,
                total: count,
                summary: {
                    totalReceived: completedStats._sum.amount,
                    totalPending: pendingStats._sum.amount,
                    completedCount: completedStats._count.id,
                    pendingCount: pendingStats._count.id
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Generate payment receipt
// @route   GET /api/payments/:id/receipt
// @access  Private
export const generateReceipt = async (req, res, next) => {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: req.params.id },
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true }
                }
            }
        });

        if (!payment) {
            return res.status(404).json(
                formatResponse(false, 'Payment not found')
            );
        }

        // Check ownership
        if (req.user.role === 'student' && payment.userId !== req.user.id) {
            return res.status(403).json(
                formatResponse(false, 'Not authorized to access this receipt')
            );
        }

        // Generate receipt data
        const receipt = {
            receiptNumber: `RCP-${(payment.transactionId || payment.id).slice(-8).toUpperCase()}`,
            date: payment.createdAt,
            student: {
                name: payment.user.fullName,
                email: payment.user.email,
                studentId: payment.user.studentId
            },
            payment: {
                amount: payment.amount,
                type: payment.paymentType,
                method: payment.paymentMethod,
                transactionId: payment.transactionId,
                status: payment.status
            },
            institution: {
                name: 'FPT Greenwich Vietnam',
                address: '590 Vo Van Kiet, District 1, HCMC',
                phone: '(028) 7300 6789',
                email: 'graduation@greenwich.edu.vn'
            }
        };

        res.status(200).json(
            formatResponse(true, 'Receipt generated successfully', { receipt })
        );
    } catch (error) {
        next(error);
    }
};
