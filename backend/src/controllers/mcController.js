import prisma from '../prisma.js';
import { formatResponse } from '../utils/helpers.js';

// @desc    Get student attendance list (all students + check-in + seat info)
// @route   GET /api/mc/students
// @access  Private (MC, Staff, Admin)
export const getStudentAttendance = async (req, res, next) => {
    try {
        const { search, checkedIn, page = 1, limit = 100 } = req.query;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        const where = { role: 'student' };
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { studentId: { contains: search, mode: 'insensitive' } },
                { major: { contains: search, mode: 'insensitive' } }
            ];
        }

        const skip = (parsedPage - 1) * parsedLimit;

        const students = await prisma.user.findMany({
            where,
            select: {
                id: true,
                fullName: true,
                studentId: true,
                major: true,
                classOf: true,
                profilePhoto: true,
                email: true,
                tickets: {
                    where: { ticketType: 'student' },
                    select: { isScanned: true, scannedAt: true, ticketNumber: true, ticketType: true }
                },
                seatBookings: {
                    where: { status: { not: 'cancelled' }, seatType: 'student' },
                    select: { seatNumber: true, status: true }
                },
                processionQueues: {
                    select: { queueNumber: true, status: true }
                }
            },
            orderBy: { fullName: 'asc' },
            skip,
            take: parsedLimit
        });

        const total = await prisma.user.count({ where: { role: 'student' } });

        const enriched = students.map(s => {
            const studentTicket = s.tickets.find(t => t.ticketType === 'student');
            const hasTicket = !!studentTicket;
            const isCheckedIn = studentTicket?.isScanned || false;
            const seatNumber = s.seatBookings?.[0]?.seatNumber || null;
            const queue = s.processionQueues?.[0] || null;

            return {
                id: s.id,
                fullName: s.fullName,
                studentId: s.studentId,
                major: s.major,
                classOf: s.classOf,
                profilePhoto: s.profilePhoto,
                email: s.email,
                hasTicket,
                isCheckedIn,
                scannedAt: studentTicket?.scannedAt || null,
                seatNumber,
                queueNumber: queue?.queueNumber || null,
                queueStatus: queue?.status || null
            };
        });

        // Apply checkedIn filter after enrichment if requested
        const filtered = checkedIn !== undefined
            ? enriched.filter(s => String(s.isCheckedIn) === checkedIn)
            : enriched;

        const checkedInCount = enriched.filter(s => s.isCheckedIn).length;
        const notCheckedInCount = enriched.filter(s => !s.isCheckedIn).length;
        const hasTicketCount = enriched.filter(s => s.hasTicket).length;

        res.status(200).json(
            formatResponse(true, 'Student attendance retrieved', {
                students: filtered,
                summary: {
                    total,
                    hasTicket: hasTicketCount,
                    checkedIn: checkedInCount,
                    notCheckedIn: notCheckedInCount,
                    checkedInRate: total > 0 ? Math.round((checkedInCount / total) * 100) : 0
                },
                pagination: {
                    current: parsedPage,
                    total: Math.ceil(total / parsedLimit),
                    count: filtered.length,
                    totalItems: total
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get full procession queue with user + seat info
// @route   GET /api/mc/queue
// @access  Private (MC, Staff, Admin)
export const getProcessionQueue = async (req, res, next) => {
    try {
        const { status, major } = req.query;

        const where = {};
        if (status) where.status = status;
        if (major) where.major = { contains: major, mode: 'insensitive' };

        const queue = await prisma.processionQueue.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        studentId: true,
                        major: true,
                        classOf: true,
                        profilePhoto: true,
                        email: true,
                        seatBookings: {
                            where: { status: { not: 'cancelled' }, seatType: 'student' },
                            select: { seatNumber: true, seatType: true }
                        },
                        tickets: {
                            where: { isScanned: true },
                            select: { isScanned: true, scannedAt: true, ticketNumber: true }
                        }
                    }
                }
            },
            orderBy: [{ queueNumber: 'asc' }]
        });

        res.status(200).json(
            formatResponse(true, 'Procession queue retrieved', { queue, count: queue.length })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get ceremony overview stats
// @route   GET /api/mc/overview
// @access  Private (MC, Staff, Admin)
export const getCeremonyOverview = async (req, res, next) => {
    try {
        const totalStudents = await prisma.user.count({ where: { role: 'student' } });
        const checkedIn = await prisma.ticket.count({ where: { isScanned: true, ticketType: 'student' } });
        const seated = await prisma.seatBooking.count({ where: { status: 'confirmed' } });

        const onStage = await prisma.processionQueue.count({ where: { status: 'on_stage' } });
        const completed = await prisma.processionQueue.count({ where: { status: 'completed' } });
        const waiting = await prisma.processionQueue.count({ where: { status: 'waiting' } });
        const ready = await prisma.processionQueue.count({ where: { status: 'ready' } });
        const totalQueued = await prisma.processionQueue.count();

        res.status(200).json(
            formatResponse(true, 'Ceremony overview retrieved', {
                students: {
                    total: totalStudents,
                    checkedIn,
                    seated,
                    checkedInRate: totalStudents > 0 ? Math.round((checkedIn / totalStudents) * 100) : 0
                },
                ceremony: {
                    totalQueued,
                    waiting,
                    ready,
                    onStage,
                    completed,
                    progressRate: totalQueued > 0 ? Math.round((completed / totalQueued) * 100) : 0
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get all students who have checked in (ticket scanned) with seat info
// @route   GET /api/mc/checked-in
// @access  Private (MC, Staff, Admin)
export const getCheckedInStudents = async (req, res, next) => {
    try {
        const scannedTickets = await prisma.ticket.findMany({
            where: { isScanned: true, ticketType: 'student' },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        studentId: true,
                        major: true,
                        classOf: true,
                        profilePhoto: true,
                        seatBookings: {
                            where: { status: { not: 'cancelled' }, seatType: 'student' },
                            select: { seatNumber: true, seatType: true, status: true }
                        },
                        processionQueues: {
                            select: { id: true, queueNumber: true, status: true, callTime: true }
                        }
                    }
                }
            },
            orderBy: { scannedAt: 'asc' }
        });

        const students = scannedTickets.map(t => ({
            ticketId: t.id,
            ticketNumber: t.ticketNumber,
            scannedAt: t.scannedAt,
            ...t.user,
            seatNumber: t.user.seatBookings?.[0]?.seatNumber || null,
            queueId: t.user.processionQueues?.[0]?.id || null,
            queueStatus: t.user.processionQueues?.[0]?.status || null,
            queueNumber: t.user.processionQueues?.[0]?.queueNumber || null
        }));

        res.status(200).json(
            formatResponse(true, 'Checked-in students retrieved', { students, count: students.length })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Update student's procession queue status
// @route   PATCH /api/mc/queue/:id/status
// @access  Private (MC, Staff, Admin)
export const updateStudentCeremonyStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['waiting', 'ready', 'on_stage', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json(formatResponse(false, `Invalid status. Must be one of: ${validStatuses.join(', ')}`));
        }

        const updateData = { status };
        if (status === 'on_stage') updateData.callTime = new Date();
        if (status === 'completed') updateData.completedTime = new Date();

        let queueEntry;
        try {
            queueEntry = await prisma.processionQueue.update({
                where: { id },
                data: updateData,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            studentId: true,
                            major: true,
                            classOf: true,
                            profilePhoto: true,
                            seatBookings: {
                                where: { status: { not: 'cancelled' }, seatType: 'student' },
                                select: { seatNumber: true }
                            }
                        }
                    }
                }
            });
        } catch (err) {
            if (err.code === 'P2025') {
                return res.status(404).json(formatResponse(false, 'Queue entry not found'));
            }
            throw err;
        }

        // Broadcast real-time update to all in ceremony room via Socket.io
        const io = req.app.get('io');
        if (io) {
            io.to('ceremony').emit('ceremony:student_updated', {
                queueId: queueEntry.id,
                userId: queueEntry.user.id,
                studentName: queueEntry.user.fullName,
                studentId: queueEntry.user.studentId,
                major: queueEntry.user.major,
                classOf: queueEntry.user.classOf,
                profilePhoto: queueEntry.user.profilePhoto,
                seatNumber: queueEntry.user.seatBookings?.[0]?.seatNumber || null,
                queueNumber: queueEntry.queueNumber,
                status: queueEntry.status,
                callTime: queueEntry.callTime,
                completedTime: queueEntry.completedTime,
                updatedBy: req.user.fullName,
                updatedByRole: req.user.role,
                updatedAt: new Date()
            });
        }

        res.status(200).json(
            formatResponse(true, `Student status updated to ${status}`, { queueEntry })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Add student to procession queue
// @route   POST /api/mc/queue
// @access  Private (MC, Staff, Admin)
export const addToProcessionQueue = async (req, res, next) => {
    try {
        const { userId, major } = req.body;

        const existing = await prisma.processionQueue.findFirst({ where: { userId } });
        if (existing) {
            return res.status(400).json(formatResponse(false, 'Student is already in the procession queue'));
        }

        const lastEntry = await prisma.processionQueue.findFirst({ orderBy: { queueNumber: 'desc' } });
        const queueNumber = (lastEntry?.queueNumber || 0) + 1;

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { major: true } });
        const entry = await prisma.processionQueue.create({
            data: { userId, queueNumber, major: major || user?.major || 'Unknown', status: 'waiting' },
            include: {
                user: { select: { fullName: true, studentId: true, major: true, classOf: true } }
            }
        });

        const io = req.app.get('io');
        if (io) {
            io.to('ceremony').emit('ceremony:student_updated', {
                queueId: entry.id,
                userId: entry.user.id,
                studentName: entry.user.fullName,
                studentId: entry.user.studentId,
                major: entry.user.major,
                classOf: entry.user.classOf,
                queueNumber: entry.queueNumber,
                status: entry.status,
                action: 'added'
            });
        }

        res.status(201).json(formatResponse(true, 'Student added to procession queue', { entry }));
    } catch (error) {
        next(error);
    }
};

// @desc    Reorder procession queue (Drag and drop support)
// @route   PATCH /api/mc/queue/reorder
// @access  Private (MC, Staff, Admin)
export const reorderProcessionQueue = async (req, res, next) => {
    try {
        const { orderedIds } = req.body;

        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
            return res.status(400).json(formatResponse(false, 'orderedIds array is required'));
        }

        // We update the queue numbers sequentially based on the array order.
        // We'll use a transaction to ensure all updates succeed or fail together.
        const updates = orderedIds.map((id, index) => {
            return prisma.processionQueue.update({
                where: { id },
                data: { queueNumber: index + 1 } // Reset to 1-based index matching the new dragged order
            });
        });

        await prisma.$transaction(updates);

        // Fetch the updated queue to broadcast
        const updatedQueue = await prisma.processionQueue.findMany({
            where: { id: { in: orderedIds } },
            select: { id: true, queueNumber: true, status: true }
        });

        // Broadcast the new order
        const io = req.app.get('io');
        if (io) {
            io.to('ceremony').emit('ceremony:queue_reordered', {
                items: updatedQueue
            });
        }

        res.status(200).json(formatResponse(true, 'Queue reordered successfully', { updatedCount: orderedIds.length }));
    } catch (error) {
        next(error);
    }
};


// @desc    Auto-populate procession queue from checked-in students
// @route   POST /api/mc/queue/auto-populate
// @access  Private (MC, Staff, Admin)
export const autoPopulateQueue = async (req, res, next) => {
    try {
        const checkedInTickets = await prisma.ticket.findMany({
            where: { isScanned: true, ticketType: 'student' },
            include: {
                user: {
                    select: {
                        id: true,
                        major: true,
                        processionQueues: { select: { id: true } }
                    }
                }
            }
        });

        const notInQueue = checkedInTickets.filter(t => t.user.processionQueues.length === 0);

        if (notInQueue.length === 0) {
            return res.status(200).json(formatResponse(true, 'All checked-in students are already in queue', { added: 0 }));
        }

        const lastEntry = await prisma.processionQueue.findFirst({ orderBy: { queueNumber: 'desc' } });
        let nextNumber = (lastEntry?.queueNumber || 0) + 1;

        notInQueue.sort((a, b) => (a.user.major || '').localeCompare(b.user.major || ''));

        const created = await prisma.$transaction(
            notInQueue.map(t =>
                prisma.processionQueue.create({
                    data: {
                        userId: t.user.id,
                        queueNumber: nextNumber++,
                        major: t.user.major || 'Unknown',
                        status: 'waiting'
                    }
                })
            )
        );

        const io = req.app.get('io');
        if (io) {
            io.to('ceremony').emit('ceremony:queue_updated', { total: created.length, message: `${created.length} students added to queue` });
        }

        res.status(201).json(formatResponse(true, `${created.length} students added to procession queue`, { added: created.length }));
    } catch (error) {
        next(error);
    }
};
