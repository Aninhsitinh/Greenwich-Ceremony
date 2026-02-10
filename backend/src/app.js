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

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
});

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

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

// Quick fix route for development
import quickfixRoutes from './routes/quickfix.js';
app.use('/api/quickfix', quickfixRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Join room based on user ID
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    // Handle chat messages
    socket.on('chat_message', (data) => {
        io.to(data.receiverId).emit('new_message', data);
    });

    // Handle notifications
    socket.on('send_notification', (data) => {
        io.to(data.userId).emit('new_notification', data);
    });

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
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

httpServer.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎓 Stitch Ceremony Registration API                ║
║                                                       ║
║   Server running on port: ${PORT}                    ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
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
