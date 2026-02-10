/**
 * Format response data
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @param {object} data - Response data
 * @returns {object} Formatted response
 */
export const formatResponse = (success, message, data = null) => {
    const response = {
        success,
        message,
    };

    if (data) {
        response.data = data;
    }

    return response;
};

/**
 * Calculate pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {object} Pagination metadata
 */
export const getPagination = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);

    return {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};

/**
 * Generate random OTP
 * @param {number} length - OTP length
 * @returns {string} Random OTP
 */
export const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }

    return otp;
};

/**
 * Create room ID for chat
 * @param {string} userId1 - First user ID
 * @param {string} userId2 - Second user ID
 * @returns {string} Room ID
 */
export const createRoomId = (userId1, userId2) => {
    return [userId1, userId2].sort().join('-');
};
