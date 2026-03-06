import prisma from '../prisma.js';

/**
 * Update user's journey status
 * @param {String} userId - User ID
 * @param {Object} updates - Journey status updates
 * @returns {Promise<User>} Updated user
 */
export const updateJourneyStatus = async (userId, updates) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new Error('User not found');
    }

    const data = {};
    let currentStep = user.journeyCurrentStep;

    if (updates.registrationCompleted !== undefined) {
        data.journeyRegistrationCompleted = updates.registrationCompleted;
        if (updates.registrationCompleted) currentStep = Math.max(currentStep, 2);
    }

    if (updates.ticketGenerated !== undefined) {
        data.journeyTicketGenerated = updates.ticketGenerated;
        if (updates.ticketGenerated) currentStep = Math.max(currentStep, 3);
    }

    if (updates.seatsBooked !== undefined) {
        data.journeySeatsBooked = updates.seatsBooked;
        if (updates.seatsBooked) currentStep = Math.max(currentStep, 4);
    }

    if (updates.gownCollected !== undefined) {
        data.journeyGownCollected = updates.gownCollected;
        if (updates.gownCollected) currentStep = Math.max(currentStep, 5);
    }

    if (updates.paymentCompleted !== undefined) {
        data.journeyPaymentCompleted = updates.paymentCompleted;
    }

    data.journeyCurrentStep = currentStep;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data
    });

    return updatedUser;
};

/**
 * Check if user can proceed to next step
 * @param {Object} user - User object
 * @param {Number} requiredStep - Required step (1-5)
 * @returns {Boolean}
 */
export const canProceedToStep = (user, requiredStep) => {
    if (!user) return false;

    switch (requiredStep) {
        case 1: // Registration - always allowed
            return true;
        case 2: // Ticket - requires registration
            return user.journeyRegistrationCompleted;
        case 3: // Seats - requires ticket
            return user.journeyTicketGenerated;
        case 4: // Gown - requires seats
            return user.journeySeatsBooked;
        case 5: // Payment - requires gown
            return user.journeyGownCollected;
        default:
            return false;
    }
};
