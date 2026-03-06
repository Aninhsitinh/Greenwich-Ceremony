export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error('Error:', err);

    // Prisma Not Found Error (usually when trying to findUnique or update with non-existent ID)
    if (err.code === 'P2025') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    // Prisma Unique Constraint Violation
    if (err.code === 'P2002') {
        const field = err.meta?.target?.[0] || 'Field';
        const message = `${field} already exists`;
        error = { message, statusCode: 400 };
    }

    // Prisma Validation Error
    if (err.name === 'PrismaClientValidationError') {
        const message = err.message.split('\n').pop() || 'Validation Error';
        error = { message, statusCode: 400 };
    }

    const statusCode = error.statusCode || error.status || err.statusCode || err.status || 500;

    res.status(statusCode).json({
        success: false,
        message: error.message || 'Server Error',
    });
};
