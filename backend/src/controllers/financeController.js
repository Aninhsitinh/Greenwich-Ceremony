import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all registrations with refund status
 */
export const getRefundStatus = async (req, res, next) => {
    try {
        const registrations = await prisma.registration.findMany({
            where: {
                registrationStatus: 'confirmed'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        studentId: true,
                        major: true,
                        payments: {
                            where: {
                                paymentType: 'graduation_package',
                                status: 'completed'
                            },
                            select: {
                                id: true,
                                amount: true,
                                transactionId: true,
                                status: true,
                                paymentMethod: true,
                                createdAt: true
                            }
                        }
                    }
                }
            }
        });

        // Calculate refundable amount for each registration
        const data = registrations.map(reg => {
            const totalPaid = reg.user.payments.reduce((sum, p) => sum + p.amount, 0);
            return {
                ...reg,
                refundableAmount: totalPaid
            };
        });

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Process a refund for a registration
 */
export const processRefund = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { refundAmount, refundDate } = req.body;

        const registration = await prisma.registration.update({
            where: { id },
            data: {
                isDepositRefunded: true,
                refundAmount: parseInt(refundAmount) || 0,
                refundDate: refundDate ? new Date(refundDate) : new Date()
            }
        });

        res.status(200).json({
            success: true,
            message: 'Refund processed successfully',
            data: registration
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Bulk process refunds
 */
export const bulkProcessRefunds = async (req, res, next) => {
    try {
        const { registrationIds } = req.body;

        const results = [];
        for (const id of registrationIds) {
            // Find registration and its refundable amount
            const reg = await prisma.registration.findUnique({
                where: { id },
                include: {
                    user: {
                        include: {
                            payments: {
                                where: { paymentType: 'graduation_package', status: 'completed' }
                            }
                        }
                    }
                }
            });

            if (reg && !reg.isDepositRefunded) {
                const totalPaid = reg.user.payments.reduce((sum, p) => sum + p.amount, 0);
                const updated = await prisma.registration.update({
                    where: { id },
                    data: {
                        isDepositRefunded: true,
                        refundAmount: totalPaid,
                        refundDate: new Date()
                    }
                });
                results.push(updated);
            }
        }

        res.status(200).json({
            success: true,
            message: `Processed ${results.length} refunds successfully`,
            data: results
        });
    } catch (error) {
        next(error);
    }
};
