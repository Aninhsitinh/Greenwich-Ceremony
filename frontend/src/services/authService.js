import api from './api';

export const authService = {
    // Login
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    async getCurrentUser() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Update profile
    async updateProfile(profileData) {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
    },

    // Forgot password
    async forgotPassword(email) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Verify OTP
    async verifyOTP(email, otp) {
        const response = await api.post('/auth/verify-otp', { email, otp });
        return response.data;
    },

    // Reset password
    async resetPassword(email, resetToken, newPassword) {
        const response = await api.post('/auth/reset-password', {
            email,
            resetToken,
            newPassword,
        });
        return response.data;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    // Get stored user
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};
