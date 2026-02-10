import User from '../models/User.js';

/**
 * Update user's journey status
 * @param {String} userId - User ID
 * @param {Object} updates - Journey status updates
 * @returns {Promise<User>} Updated user
 */
export const updateJourneyStatus = async (userId, updates) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    // Update journey status fields
    if (updates.registrationCompleted !== undefined) {
        user.journeyStatus.registrationCompleted = updates.registrationCompleted;
        if (updates.registrationCompleted) user.journeyStatus.currentStep = Math.max(user.journeyStatus.currentStep, 2);
    }

    if (updates.ticketGenerated !== undefined) {
        user.journeyStatus.ticketGenerated = updates.ticketGenerated;
        if (updates.ticketGenerated) user.journeyStatus.currentStep = Math.max(user.journeyStatus.currentStep, 3);
    }

    if (updates.seatsBooked !== undefined) {
        user.journeyStatus.seatsBooked = updates.seatsBooked;
        if (updates.seatsBooked) user.journeyStatus.currentStep = Math.max(user.journeyStatus.currentStep, 4);
    }

    if (updates.gownCollected !== undefined) {
        user.journeyStatus.gownCollected = updates.gownCollected;
        if (updates.gownCollected) user.journeyStatus.currentStep = Math.max(user.journeyStatus.currentStep, 5);
    }

    if (updates.paymentCompleted !== undefined) {
        user.journeyStatus.paymentCompleted = updates.paymentCompleted;
    }

    await user.save();
    return user;
};

/**
 * Check if user can proceed to next step
 * @param {Object} user - User object
 * @param {Number} requiredStep - Required step (1-5)
 * @returns {Boolean}
 */
export const canProceedToStep = (user, requiredStep) => {
    if (!user || !user.journeyStatus) return false;

    switch (requiredStep) {
        case 1: // Registration - always allowed
            return true;
        case 2: // Ticket - requires registration
            return user.journeyStatus.registrationCompleted;
        case 3: // Seats - requires ticket
            return user.journeyStatus.ticketGenerated;
        case 4: // Gown - requires seats
            return user.journeyStatus.seatsBooked;
        case 5: // Payment - requires gown
            return user.journeyStatus.gownCollected;
        default:
            return false;
    }
};
