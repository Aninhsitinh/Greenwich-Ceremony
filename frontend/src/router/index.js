import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: () => import('@/views/LandingPage.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/LoginPage.vue'),
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/auth/RegisterPage.vue'),
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/auth/ForgotPassword.vue'),
    },
    // Student Routes
    {
        path: '/student',
        redirect: '/student/dashboard',
        meta: { requiresAuth: true, role: 'student' },
        children: [
            {
                path: 'dashboard',
                name: 'StudentDashboard',
                component: () => import('@/views/student/Dashboard.vue'),
            },
            {
                path: 'registration',
                name: 'StudentRegistration',
                component: () => import('@/views/student/Registration.vue'),
            },
            {
                path: 'seat-booking',
                name: 'StudentSeatBooking',
                component: () => import('@/views/student/SeatBooking.vue'),
            },
            {
                path: 'ticket',
                name: 'StudentTicket',
                component: () => import('@/views/student/Ticket.vue'),
            },
            {
                path: 'profile',
                name: 'StudentProfile',
                component: () => import('@/views/student/Profile.vue'),
            },
            {
                path: 'settings',
                name: 'StudentSettings',
                component: () => import('@/views/student/Settings.vue'),
            },
            {
                path: 'payment',
                name: 'StudentPayment',
                component: () => import('@/views/student/Payment.vue'),
            },
            {
                path: 'booking-confirmation',
                name: 'StudentBookingConfirmation',
                component: () => import('@/views/student/BookingConfirmation.vue'),
            },
            {
                path: 'notifications',
                name: 'StudentNotifications',
                component: () => import('@/views/student/Notifications.vue'),
            },
            {
                path: 'help',
                name: 'StudentHelp',
                component: () => import('@/views/student/Help.vue'),
            },
            {
                path: 'gown-collection',
                name: 'StudentGownCollection',
                component: () => import('@/views/student/GownCollection.vue'),
            },
        ],
    },
    // Staff Routes
    {
        path: '/staff',
        meta: { requiresAuth: true, role: 'staff' },
        children: [
            {
                path: '',
                name: 'StaffDashboard',
                component: () => import('@/views/staff/Dashboard.vue'),
            },
            {
                path: 'qr-scanner',
                name: 'StaffQRScanner',
                component: () => import('@/views/staff/QRScanner.vue'),
            },
            {
                path: 'gown-collection',
                name: 'StaffGownCollection',
                component: () => import('@/views/staff/GownCollection.vue'),
            },
            {
                path: 'seat-management',
                name: 'StaffSeatManagement',
                component: () => import('@/views/staff/SeatManagement.vue'),
            },
            {
                path: 'student-list',
                name: 'StaffStudentList',
                component: () => import('@/views/staff/StudentList.vue'),
            },
            {
                path: 'settings',
                name: 'StaffSettings',
                component: () => import('@/views/staff/Settings.vue'),
            },
        ],
    },
    // Admin Routes
    {
        path: '/admin',
        meta: { requiresAuth: true, role: 'admin' },
        children: [
            {
                path: '',
                name: 'AdminDashboard',
                component: () => import('@/views/admin/Dashboard.vue'),
            },
            {
                path: 'students',
                name: 'AdminStudents',
                component: () => import('@/views/admin/StudentManagement.vue'),
            },
            {
                path: 'registrations',
                name: 'AdminRegistrations',
                component: () => import('@/views/admin/RegistrationManagement.vue'),
            },
            {
                path: 'tickets',
                name: 'AdminTickets',
                component: () => import('@/views/admin/TicketManagement.vue'),
            },
            {
                path: 'seats',
                name: 'AdminSeats',
                component: () => import('@/views/admin/SeatManagement.vue'),
            },
            {
                path: 'announcements',
                name: 'AdminAnnouncements',
                component: () => import('@/views/admin/Announcements.vue'),
            },
            {
                path: 'settings',
                name: 'AdminSettings',
                component: () => import('@/views/admin/SystemSettings.vue'),
            },
        ],
    },
    // 404 Not Found
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth) {
        if (!authStore.isAuthenticated) {
            next('/login');
        } else if (to.meta.role && authStore.userRole !== to.meta.role) {
            // Redirect to appropriate dashboard based on role
            next(`/${authStore.userRole}`);
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
