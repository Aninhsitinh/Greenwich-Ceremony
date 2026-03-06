import prisma from '../prisma.js';
import { formatResponse } from '../utils/helpers.js';

// @desc    Get dashboard statistics for staff
// @route   GET /api/staff/statistics
// @access  Private (Staff, Admin)
export const getDashboardStatistics = async (req, res, next) => {
    try {
        // Total students
        const totalStudents = await prisma.user.count({ where: { role: 'student' } });

        // Registration statistics
        const totalRegistrations = await prisma.registration.count();
        const confirmedRegistrations = await prisma.registration.count({
            where: {
                registrationStatus: { in: ['pending', 'confirmed'] }
            }
        });
        const registrationRate = totalStudents > 0
            ? Math.round((totalRegistrations / totalStudents) * 100)
            : 0;

        // Ticket statistics
        const totalTickets = await prisma.ticket.count();
        const ticketGenerationRate = totalStudents > 0
            ? Math.round((totalTickets / totalStudents) * 100)
            : 0;

        // Seat statistics
        const totalSeatsBooked = await prisma.seatBooking.count({
            where: { status: { not: 'cancelled' } }
        });
        const totalCapacity = 500; // Update based on venue capacity

        const availableSeats = totalCapacity - totalSeatsBooked;
        const occupancyRate = Math.round((totalSeatsBooked / totalCapacity) * 100);

        // Gown collection stats
        const gownsCollected = await prisma.registration.count({ where: { gownCollected: true } });
        const gownCollectionRate = totalRegistrations > 0
            ? Math.round((gownsCollected / totalRegistrations) * 100)
            : 0;

        // Recent registrations (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentRegistrations = await prisma.registration.count({
            where: { createdAt: { gte: sevenDaysAgo } }
        });

        // Gown size distribution
        const gownSizeGroup = await prisma.registration.groupBy({
            by: ['gownSize'],
            _count: { gownSize: true }
        });

        const gownSizeDistribution = gownSizeGroup.map(g => ({
            size: g.gownSize || 'Unknown',
            count: g._count.gownSize
        }));

        // Attendance confirmation rate
        const attendanceConfirmed = await prisma.registration.count({
            where: { attendanceConfirmed: true }
        });
        const confirmationRate = totalRegistrations > 0
            ? Math.round((attendanceConfirmed / totalRegistrations) * 100)
            : 0;

        res.status(200).json(
            formatResponse(true, 'Statistics retrieved successfully', {
                overview: {
                    totalStudents,
                    totalRegistrations,
                    confirmedRegistrations,
                    registrationRate,
                    totalTickets,
                    ticketGenerationRate,
                    recentRegistrations
                },
                seats: {
                    totalCapacity,
                    totalBooked: totalSeatsBooked,
                    available: availableSeats,
                    occupancyRate
                },
                gowns: {
                    totalCollected: gownsCollected,
                    collectionRate: gownCollectionRate,
                    sizeDistribution: gownSizeDistribution
                },
                attendance: {
                    confirmed: attendanceConfirmed,
                    confirmationRate
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get recent registrations list
// @route   GET /api/staff/registrations/recent
// @access  Private (Staff, Admin)
export const getRecentRegistrations = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const registrations = await prisma.registration.findMany({
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        const mappedRegistrations = registrations.map(r => ({ ...r, userId: r.user, _id: r.id }));

        res.status(200).json(
            formatResponse(true, 'Recent registrations retrieved', {
                registrations: mappedRegistrations,
                count: registrations.length
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get all registrations with filters
// @route   GET /api/staff/registrations
// @access  Private (Staff, Admin)
export const getAllRegistrations = async (req, res, next) => {
    try {
        const { status, gownSize, page = 1, limit = 20 } = req.query;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        const where = {};
        if (status) where.registrationStatus = status;
        if (gownSize) where.gownSize = gownSize;

        const skip = (parsedPage - 1) * parsedLimit;

        const registrations = await prisma.registration.findMany({
            where,
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true, phone: true, major: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: parsedLimit
        });

        const mappedRegistrations = registrations.map(r => ({ ...r, userId: r.user, _id: r.id }));

        const total = await prisma.registration.count({ where });

        res.status(200).json(
            formatResponse(true, 'Registrations retrieved', {
                registrations: mappedRegistrations,
                pagination: {
                    current: parsedPage,
                    total: Math.ceil(total / parsedLimit),
                    count: registrations.length,
                    totalItems: total
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get gown collection list with statistics
// @route   GET /api/staff/gown-collection
// @access  Private (Staff, Admin)
export const getGownCollectionList = async (req, res, next) => {
    try {
        const { size, status, search, page = 1, limit = 20 } = req.query;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        const where = {};
        if (size) where.size = size;
        if (status) where.status = status;

        if (search) {
            where.user = {
                OR: [
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { studentId: { contains: search, mode: 'insensitive' } }
                ]
            };
        }

        const skip = (parsedPage - 1) * parsedLimit;

        // Get gown collections with user and registration details
        const gownCollections = await prisma.gownCollection.findMany({
            where,
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true, phone: true }
                },
                registration: {
                    select: { gownSize: true, ceremonyDate: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: parsedLimit
        });

        const total = await prisma.gownCollection.count({ where });

        // Get statistics
        const totalGowns = await prisma.gownCollection.count();
        const collectedGowns = await prisma.gownCollection.count({ where: { status: 'collected' } });
        const pendingGowns = await prisma.gownCollection.count({ where: { status: 'pending' } });
        const scheduledGowns = await prisma.gownCollection.count({ where: { status: 'scheduled' } });

        // Size distribution
        const sizeGroup = await prisma.gownCollection.groupBy({
            by: ['size', 'status'],
            _count: { id: true }
        });

        const uniqueSizes = [...new Set(sizeGroup.map(g => g.size || 'Unknown'))];

        const sizeDistribution = uniqueSizes.map(sizeStr => {
            const sizeStats = sizeGroup.filter(g => (g.size || 'Unknown') === sizeStr);
            const totalForSize = sizeStats.reduce((sum, g) => sum + g._count.id, 0);
            const collectedForSize = sizeStats.find(g => g.status === 'collected')?._count.id || 0;
            const pendingForSize = sizeStats.find(g => g.status === 'pending')?._count.id || 0;

            return {
                _id: sizeStr,
                total: totalForSize,
                collected: collectedForSize,
                pending: pendingForSize
            };
        }).sort((a, b) => a._id.localeCompare(b._id));

        const mappedGowns = gownCollections.map(gc => ({ ...gc, userId: gc.user, _id: gc.id }));

        res.status(200).json(
            formatResponse(true, 'Gown collection data retrieved', {
                gownCollections: mappedGowns,
                statistics: {
                    total: totalGowns,
                    collected: collectedGowns,
                    pending: pendingGowns,
                    scheduled: scheduledGowns,
                    collectionRate: totalGowns > 0 ? Math.round((collectedGowns / totalGowns) * 100) : 0,
                    sizeDistribution
                },
                pagination: {
                    current: parsedPage,
                    total: Math.ceil(total / parsedLimit),
                    count: gownCollections.length,
                    totalItems: total
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Update gown collection status
// @route   PATCH /api/staff/gown-collection/:gownCollectionId
// @access  Private (Staff, Admin)
export const updateGownStatus = async (req, res, next) => {
    try {
        const { gownCollectionId } = req.params;
        const { status } = req.body;

        // Valid status transitions
        const validStatuses = ['pending', 'scheduled', 'collected', 'returned'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json(
                formatResponse(false, 'Invalid status value')
            );
        }

        const updateData = { status };

        // Set collectionDate when status changes to 'collected'
        if (status === 'collected') {
            updateData.collectionDate = new Date();
        }

        // Set returnDate when status changes to 'returned'
        if (status === 'returned') {
            updateData.returnDate = new Date();
        }

        let gownCollection;
        try {
            gownCollection = await prisma.gownCollection.update({
                where: { id: gownCollectionId },
                data: updateData,
                include: {
                    user: {
                        select: { id: true, fullName: true, email: true, studentId: true }
                    },
                    registration: {
                        select: { gownSize: true, ceremonyDate: true }
                    }
                }
            });
        } catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json(formatResponse(false, 'Gown collection record not found'));
            }
            throw error;
        }

        // Create notification for student
        const notificationMessage = status === 'collected'
            ? 'Your graduation gown has been marked as collected.'
            : status === 'returned'
                ? 'Your graduation gown has been marked as returned.'
                : `Your graduation gown collection status has been updated to ${status}.`;

        const notification = await prisma.notification.create({
            data: {
                userId: gownCollection.user.id,
                title: 'Gown Collection Update',
                message: notificationMessage,
                type: 'system',
                relatedId: gownCollection.id,
            }
        });

        const io = req.app.get('io');
        if (io) {
            io.to(gownCollection.user.id.toString()).emit('new_notification', notification);
        }

        res.status(200).json(
            formatResponse(true, 'Gown collection status updated successfully', {
                gownCollection
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get seat management data with statistics
// @route   GET /api/staff/seat-management
// @access  Private (Staff, Admin)
export const getSeatManagementData = async (req, res, next) => {
    try {
        const { seatType, page = 1, limit = 50 } = req.query;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        const where = { status: { not: 'cancelled' } };
        if (seatType) where.seatType = seatType;

        const skip = (parsedPage - 1) * parsedLimit;

        // Get seat bookings with user details
        const seats = await prisma.seatBooking.findMany({
            where,
            include: {
                user: {
                    select: { fullName: true, email: true, studentId: true, phone: true }
                }
            },
            orderBy: { seatNumber: 'asc' },
            skip,
            take: parsedLimit
        });

        const total = await prisma.seatBooking.count({ where });

        // Statistics
        const totalCapacity = 500;

        const totalBooked = await prisma.seatBooking.count({ where: { status: { not: 'cancelled' } } });
        const guestSeats = await prisma.seatBooking.count({ where: { seatType: 'guest', status: { not: 'cancelled' } } });
        const studentSeats = await prisma.seatBooking.count({ where: { seatType: 'student', status: { not: 'cancelled' } } });

        const mappedSeats = seats.map(s => ({ ...s, userId: s.user, _id: s.id }));

        res.status(200).json(
            formatResponse(true, 'Seat management data retrieved', {
                seats: mappedSeats,
                statistics: {
                    totalCapacity,
                    totalBooked,
                    available: totalCapacity - totalBooked,
                    occupancyRate: Math.round((totalBooked / totalCapacity) * 100),
                    guestSeats,
                    studentSeats
                },
                pagination: {
                    current: parsedPage,
                    total: Math.ceil(total / parsedLimit),
                    count: seats.length,
                    totalItems: total
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get student list with filters and search
// @route   GET /staff/students
// @access  Private (Staff, Admin)
export const getStudentList = async (req, res, next) => {
    try {
        const { major, status, search, page = 1, limit = 20 } = req.query;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        const where = { role: 'student' };

        // Apply filters
        if (status) where.status = status;
        if (major) where.major = { contains: major, mode: 'insensitive' };

        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { studentId: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        const skip = (parsedPage - 1) * parsedLimit;

        // Get students
        let students = await prisma.user.findMany({
            where,
            select: {
                id: true,
                fullName: true,
                email: true,
                studentId: true,
                phone: true,
                major: true,
                classOf: true,
                status: true,
                profilePhoto: true
            },
            orderBy: { fullName: 'asc' },
            skip,
            take: parsedLimit
        });

        // Get registration data and seat booking data for each student
        const studentIds = students.map(s => s.id);

        const registrations = await prisma.registration.findMany({
            where: { userId: { in: studentIds } },
            select: {
                userId: true,
                registrationStatus: true,
                gownSize: true,
                gownCollected: true,
                attendanceConfirmed: true,
                checkedInAt: true,
                checkedInBy: {
                    select: { fullName: true }
                }
            }
        });

        const seatBookings = await prisma.seatBooking.findMany({
            where: { userId: { in: studentIds }, status: { not: 'cancelled' } },
            select: {
                userId: true,
                seatNumber: true,
                seatType: true,
                guestName: true,
                guestRelation: true,
                status: true
            }
        });

        // Map registration and seat booking data to students
        students = students.map(student => {
            const registration = registrations.find(r => r.userId === student.id);
            const seats = seatBookings.filter(s => s.userId === student.id);
            return {
                ...student,
                _id: student.id,
                registration: registration ? { ...registration, _id: registration.id } : null,
                seatBookings: seats,
                seatsBooked: seats.length > 0
            };
        });

        const total = await prisma.user.count({ where });

        // Statistics
        const totalStudents = await prisma.user.count({ where: { role: 'student' } });
        const activeStudents = await prisma.user.count({ where: { role: 'student', status: 'active' } });
        const registeredStudents = await prisma.registration.count();
        const confirmedStudents = await prisma.registration.count({ where: { attendanceConfirmed: true } });

        res.status(200).json(
            formatResponse(true, 'Student list retrieved', {
                students,
                statistics: {
                    total: totalStudents,
                    active: activeStudents,
                    registered: registeredStudents,
                    confirmed: confirmedStudents,
                    registrationRate: totalStudents > 0 ? Math.round((registeredStudents / totalStudents) * 100) : 0
                },
                pagination: {
                    current: parsedPage,
                    total: Math.ceil(total / parsedLimit),
                    count: students.length,
                    totalItems: total
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle student status (active/inactive)
// @route   PATCH /api/staff/students/:id/status
// @access  Private (Staff, Admin)
export const toggleStudentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json(
                formatResponse(false, 'Invalid status value. Must be active or inactive.')
            );
        }

        const student = await prisma.user.findUnique({
            where: { id }
        });

        if (!student) {
            return res.status(404).json(
                formatResponse(false, 'Student not found')
            );
        }

        if (student.role !== 'student') {
            return res.status(400).json(
                formatResponse(false, 'Cannot change status of non-student users from this endpoint')
            );
        }

        const updatedStudent = await prisma.user.update({
            where: { id },
            data: { status }
        });

        // Create a notification for the student
        const notification = await prisma.notification.create({
            data: {
                userId: student.id,
                title: 'Account Status Updated',
                message: `Your account status has been updated to ${status} by a staff member.`,
                type: 'system'
            }
        });

        // Emit socket event if io is available
        const io = req.app.get('io');
        if (io) {
            io.to(student.id.toString()).emit('new_notification', notification);
        }

        res.status(200).json(
            formatResponse(true, `Student status updated to ${status}`, {
                student: { id: student.id, status: updatedStudent.status }
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get staff profile
// @route   GET /staff/profile
// @access  Private (Staff, Admin)
export const getStaffProfile = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json(
                formatResponse(false, 'User not found')
            );
        }

        delete user.password;

        res.status(200).json(
            formatResponse(true, 'Profile retrieved successfully', {
                user
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Update staff profile
// @route   PATCH /staff/profile
// @access  Private (Staff, Admin)
export const updateStaffProfile = async (req, res, next) => {
    try {
        const { fullName, phone, email, profilePhoto, jobTitle } = req.body;

        // Build update object with only provided fields
        const updateFields = {};
        if (fullName) updateFields.fullName = fullName;
        if (phone) updateFields.phone = phone;
        if (email) updateFields.email = email;
        if (profilePhoto) updateFields.profilePhoto = profilePhoto;
        if (jobTitle) updateFields.jobTitle = jobTitle;

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: updateFields
        });

        delete user.password;

        res.status(200).json(
            formatResponse(true, 'Profile updated successfully', {
                user
            })
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'User not found'));
        }
        next(error);
    }
};

// @desc    Get a specific user's payment and invoice history
// @route   GET /api/staff/students/:id/payments
// @access  Private (Staff, Admin)
export const getUserPayments = async (req, res, next) => {
    try {
        const { id } = req.params;

        const payments = await prisma.payment.findMany({
            where: { userId: id },
            orderBy: { createdAt: 'desc' }
        });

        const mappedPayments = payments.map(p => ({ ...p, _id: p.id }));

        res.status(200).json(
            formatResponse(true, 'User payment history retrieved', { payments: mappedPayments })
        );
    } catch (error) {
        next(error);
    }
};
