import { defineStore } from 'pinia';
import { authService } from '@/services/authService';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: authService.getUser(),
        token: localStorage.getItem('token'),
        isAuthenticated: authService.isAuthenticated(),
    }),

    getters: {
        isStudent: (state) => state.user?.role === 'student',
        isStaff: (state) => state.user?.role === 'staff',
        isAdmin: (state) => state.user?.role === 'admin',
        isMC: (state) => state.user?.role === 'mc',
        userRole: (state) => state.user?.role || null,
    },

    actions: {
        async login(credentials) {
            try {
                const data = await authService.login(credentials);
                this.user = data.data.user;
                this.token = data.data.token;
                this.isAuthenticated = true;
                return data;
            } catch (error) {
                throw error;
            }
        },

        logout() {
            authService.logout();
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
        },

        async fetchCurrentUser() {
            try {
                const data = await authService.getCurrentUser();
                this.user = data.data.user;
                return data;
            } catch (error) {
                this.logout();
                throw error;
            }
        },

        async updateProfile(profileData) {
            try {
                const data = await authService.updateProfile(profileData);
                this.user = data.data.user;
                localStorage.setItem('user', JSON.stringify(data.data.user));
                return data;
            } catch (error) {
                throw error;
            }
        },

        async refreshUser() {
            try {
                const data = await authService.getCurrentUser();
                this.user = data.data.user;
                localStorage.setItem('user', JSON.stringify(data.data.user));
                return data;
            } catch (error) {
                console.error('Failed to refresh user:', error);
                throw error;
            }
        },
    },
});
