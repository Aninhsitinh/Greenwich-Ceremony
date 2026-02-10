import api from './api';

// Registration endpoints
export const registrationService = {
    // Get current user's registration
    getMyRegistration: () => api.get('/registrations/me'),

    // Create new registration
    createRegistration: (data) => api.post('/registrations', data),

    // Update registration
    updateRegistration: (id, data) => api.put(`/registrations/${id}`, data),

    // Cancel registration
    cancelRegistration: (id) => api.delete(`/registrations/${id}`),

    // Get all registrations (admin)
    getAllRegistrations: (params) => api.get('/registrations', { params }),
};

// Ticket endpoints
export const ticketService = {
    // Generate ticket
    generateTicket: (data) => api.post('/tickets/generate', data),

    // Get my tickets
    getMyTickets: () => api.get('/tickets/me'),

    // Scan ticket (staff)
    scanTicket: (ticketNumber) => api.post('/tickets/scan', { ticketNumber }),

    // Get ticket stats (admin/staff)
    getTicketStats: () => api.get('/tickets/stats'),

    // Download ticket QR code
    downloadTicket: (ticketId) => api.get(`/tickets/${ticketId}/download`, { responseType: 'blob' }),
};

// Seat endpoints
export const seatService = {
    // Get seat availability
    getAvailability: () => api.get('/seats'),

    // Book seat
    bookSeat: (data) => api.post('/seats/book', data),

    // Get my bookings
    getMyBookings: () => api.get('/seats/my-bookings'),

    // Cancel booking
    cancelBooking: (id) => api.delete(`/seats/${id}`),

    // Get all bookings (admin)
    getAllBookings: (params) => api.get('/seats/all', { params }),
};

// Announcement endpoints
export const announcementService = {
    // Get all announcements
    getAnnouncements: (params) => api.get('/announcements', { params }),

    // Create announcement (admin)
    createAnnouncement: (data) => api.post('/announcements', data),

    // Update announcement (admin)
    updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),

    // Delete announcement (admin)
    deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
};

// Notification endpoints
export const notificationService = {
    // Get my notifications
    getMyNotifications: (params) => api.get('/notifications/me', { params }),

    // Mark as read
    markAsRead: (id) => api.put(`/notifications/${id}/read`),

    // Mark all as read
    markAllAsRead: () => api.put('/notifications/read-all'),

    // Send notification (admin)
    sendNotification: (data) => api.post('/notifications/send', data),

    // Broadcast notification (admin)
    broadcastNotification: (data) => api.post('/notifications/broadcast', data),
};

export default {
    registration: registrationService,
    ticket: ticketService,
    seat: seatService,
    announcement: announcementService,
    notification: notificationService,
};
