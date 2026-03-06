import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import { createServer } from 'http';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import registrationRoutes from './routes/registrations.js';
import ticketRoutes from './routes/tickets.js';
import seatRoutes from './routes/seats.js';
import notificationRoutes from './routes/notifications.js';
import paymentRoutes from './routes/paymentRoutes.js';
import gownRoutes from './routes/gownRoutes.js';
import contactRoutes from './routes/contact.js';
import chatRoutes from './routes/chatRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const httpServer = createServer(app);

// Setup CORS options
const corsOptions = {
    origin: function (origin, callback) {
        // Allow all origins in development or no-origin (like Postman)
        if (!origin || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            // Production strict check against FRONTEND_URL
            const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
            if (origin === allowedOrigin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
};

// Initialize Socket.io
const io = new Server(httpServer, {
    cors: corsOptions,
    maxHttpBufferSize: 5e7, // 50MB to allow large Base64 images
});

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies (increased for large base64)
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

// Apply rate limiting to auth routes
app.use('/api/auth', limiter);

// Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Stitch Ceremony Registration API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            registrations: '/api/registrations',
            tickets: '/api/tickets',
        },
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/gown', gownRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chat', chatRoutes);

// Staff routes
import staffRoutes from './routes/staff.js';
app.use('/api/staff', staffRoutes);

// Admin routes
import adminRoutes from './routes/adminRoutes.js';
app.use('/api/admin', adminRoutes);

// Student gown collection routes
import gownCollectionRoutes from './routes/gownCollectionRoutes.js';
app.use('/api/gown-collection', gownCollectionRoutes);

// Quick fix route for development
import quickfixRoutes from './routes/quickfix.js';
app.use('/api/quickfix', quickfixRoutes);

// Post routes
import postRoutes from './routes/postRoutes.js';
app.use('/api/posts', postRoutes);

// Upload routes
import uploadRoutes from './routes/upload.js';
app.use('/api/upload', uploadRoutes);

// System Settings route
import settingsRoutes from './routes/settings.js';
app.use('/api/settings', settingsRoutes);

// MC routes
import mcRoutes from './routes/mc.js';
app.use('/api/mc', mcRoutes);

// Socket.io connection handling
import prisma from './prisma.js';

// Track user online status: Map<userId, Set<socketId>>
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Store user ID when they authenticate/join
    socket.userId = null;
    socket.userRole = null;

    // Join room based on user ID or specific chat room
    socket.on('join', (data) => {
        // Support both old string format and new object format
        const userId = typeof data === 'string' ? data : data?.userId;
        const userRole = typeof data === 'object' ? data?.role : null;

        socket.join(userId);
        socket.userId = userId;
        socket.userRole = userRole;
        console.log(`User ${userId} (${userRole || 'unknown'}) joined personal room`);

        // Track connection for online status
        if (!connectedUsers.has(userId)) {
            connectedUsers.set(userId, new Set());
            // This is their first connection, broadcast they are online
            io.emit('user:online', { userId });
        }
        connectedUsers.get(userId).add(socket.id);
    });

    // Allow clients to check if a specific user is online
    socket.on('check:online_status', (userIds, callback) => {
        if (Array.isArray(userIds) && typeof callback === 'function') {
            const statusMap = {};
            userIds.forEach(id => {
                statusMap[id] = connectedUsers.has(id.toString());
            });
            callback(statusMap);
        }
    });

    // Join explicit chat room (typically same as user ID for student support chat)
    socket.on('chat:join', (roomId) => {
        socket.join(roomId);
        console.log(`Socket joined chat room: ${roomId}`);
    });

    socket.on('chat:leave', (roomId) => {
        socket.leave(roomId);
        console.log(`Socket left chat room: ${roomId}`);
    });

    // Handle chat messages
    socket.on('chat:send', async (data) => {
        try {
            // Save to database
            const newMessage = await prisma.chatMessage.create({
                data: {
                    senderId: data.senderId,
                    receiverId: data.receiverId || null,
                    senderRole: data.senderRole,
                    message: data.text,
                    roomId: data.roomId,
                    isRead: false
                },
                include: {
                    sender: {
                        select: { id: true, fullName: true, role: true, profilePhoto: true }
                    }
                }
            });

            // Format for client
            const messageToSend = {
                id: newMessage.id,
                text: newMessage.message,
                sender: newMessage.sender?.fullName || data.sender,
                profilePhoto: newMessage.sender?.profilePhoto || null,
                senderRole: newMessage.senderRole,
                senderId: newMessage.sender?.id || data.senderId,
                timestamp: newMessage.createdAt,
                roomId: newMessage.roomId,
                isRead: false
            };

            // Broadcast to everyone in the room (including sender to confirm)
            io.to(data.roomId).emit('chat:message', messageToSend);
        } catch (error) {
            console.error('Socket chat save error:', error);
        }
    });

    // Handle typing indicators
    socket.on('chat:typing', (roomId) => {
        socket.to(roomId).emit('chat:typing', { roomId });
    });

    // Handle notifications
    socket.on('send_notification', (data) => {
        io.to(data.userId).emit('new_notification', data);
    });

    // ─────────────────────────────────────────────────────────────
    // CEREMONY REAL-TIME EVENTS (MC ↔ Staff synchronization)
    // ─────────────────────────────────────────────────────────────

    // Join the shared ceremony room (both MC and Staff join this)
    socket.on('ceremony:join', (data) => {
        socket.join('ceremony');
        const role = data?.role || 'unknown';
        const name = data?.name || 'Unknown';
        console.log(`🎓 ${name} (${role}) joined ceremony room`);
        // Notify others in ceremony room that someone joined
        socket.to('ceremony').emit('ceremony:user_joined', { name, role, socketId: socket.id });
    });

    // Legacy: Staff emits this after successfully scanning a ticket
    // We keep this as a fallback but the primary emission happens in ticketController.js
    socket.on('ceremony:ticket_scanned', (data) => {
        socket.to('ceremony').emit('ceremony:ticket_scanned', {
            ...data,
            timestamp: new Date()
        });
        console.log(`🎫 Client-Triggered Ticket scanned: ${data.studentName}`);
    });

    // Staff emits this after confirming a student is seated → MC sees it
    socket.on('ceremony:seat_confirmed', (data) => {
        io.to('ceremony').emit('ceremony:seat_confirmed', {
            ...data,
            timestamp: new Date()
        });
        console.log(`💺 Seat confirmed: ${data.studentName} → ${data.seatNumber}`);
    });

    // MC or Staff emits to broadcast any ceremony announcement
    socket.on('ceremony:announcement', (data) => {
        io.to('ceremony').emit('ceremony:announcement', {
            ...data,
            timestamp: new Date()
        });
    });

    // ─────────────────────────────────────────────────────────────

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
        if (socket.userId && connectedUsers.has(socket.userId)) {
            const userSockets = connectedUsers.get(socket.userId);
            userSockets.delete(socket.id);

            // If they have no more active connections, broadcast offline
            if (userSockets.size === 0) {
                connectedUsers.delete(socket.userId);
                io.emit('user:offline', { userId: socket.userId });
            }
        }
        // Leave ceremony room on disconnect
        socket.leave('ceremony');
    });
});

// Make io accessible to routes
app.set('io', io);

// Error handler middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎓 Stitch Ceremony Registration API                ║
║                                                       ║
║   Server running on port: ${PORT}                      ║
║   Environment: ${process.env.NODE_ENV || 'development'}║
║   Socket.io: Active                                   ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    httpServer.close(() => process.exit(1));
});

export default app;
