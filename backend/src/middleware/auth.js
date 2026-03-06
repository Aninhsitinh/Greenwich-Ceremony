import { verifyToken } from '../config/jwt.js';
import prisma from '../prisma.js';

export const protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }

    try {
        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }

        // Get user from token
        req.user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (req.user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Account is inactive or suspended',
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`,
            });
        }

        next();
    };
};

// Alias for authorize (for compatibility)
export const restrictTo = authorize;
