import Payment from '../models/Payment.js';
import { formatResponse } from '../utils/helpers.js';

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
export const createPayment = async (req, res, next) => {
    try {
        const { amount, paymentType, paymentMethod, transactionId, status, items, notes } = req.body;

        const payment = await Payment.create({
            userId: req.user._id,
            amount,
            paymentType,
            paymentMethod,
            transactionId,
            status: status || 'pending',
            items: items || [],
            notes,
        });

        res.status(201).json(
            formatResponse(true, 'Payment created successfully', { payment })
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
        const payments = await Payment.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        const totalPaid = payments
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);

        const pendingAmount = payments
            .filter(p => p.status === 'pending')
            .reduce((sum, p) => sum + p.amount, 0);

        res.status(200).json(
            formatResponse(true, 'Payments retrieved successfully', {
                payments,
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
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json(
                formatResponse(false, 'Payment not found')
            );
        }

        // Check ownership
        if (req.user.role === 'student' && payment.userId.toString() !== req.user._id.toString()) {
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

        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json(
                formatResponse(false, 'Payment not found')
            );
        }

        if (status) payment.status = status;
        if (transactionId) payment.transactionId = transactionId;
        if (receiptUrl) payment.receiptUrl = receiptUrl;

        await payment.save();

        res.status(200).json(
            formatResponse(true, 'Payment updated successfully', { payment })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get all payments (Admin/Staff)
// @route   GET /api/payments
// @access  Private (Admin, Staff)
export const getAllPayments = async (req, res, next) => {
    try {
        const { status, paymentType, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (paymentType) query.paymentType = paymentType;

        const payments = await Payment.find(query)
            .populate('userId', 'fullName email studentId')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Payment.countDocuments(query);

        // Calculate totals
        const allPayments = await Payment.find({});
        const totalReceived = allPayments
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
        const totalPending = allPayments
            .filter(p => p.status === 'pending')
            .reduce((sum, p) => sum + p.amount, 0);

        res.status(200).json(
            formatResponse(true, 'Payments retrieved successfully', {
                payments,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                total: count,
                summary: {
                    totalReceived,
                    totalPending,
                    completedCount: allPayments.filter(p => p.status === 'completed').length,
                    pendingCount: allPayments.filter(p => p.status === 'pending').length
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
        const payment = await Payment.findById(req.params.id)
            .populate('userId', 'fullName email studentId');

        if (!payment) {
            return res.status(404).json(
                formatResponse(false, 'Payment not found')
            );
        }

        // Check ownership
        if (req.user.role === 'student' && payment.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json(
                formatResponse(false, 'Not authorized to access this receipt')
            );
        }

        // Generate receipt data
        const receipt = {
            receiptNumber: `RCP-${payment._id.toString().slice(-8).toUpperCase()}`,
            date: payment.createdAt,
            student: {
                name: payment.userId.fullName,
                email: payment.userId.email,
                studentId: payment.userId.studentId
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
