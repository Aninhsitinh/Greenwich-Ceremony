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
        path: '/posts/:id',
        name: 'PostDetail',
        component: () => import('@/views/PostDetail.vue'),
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
    // Quick Links Pages
    {
        path: '/about',
        name: 'About',
        component: () => import('@/views/About.vue'),
    },
    {
        path: '/programs',
        name: 'Programs',
        component: () => import('@/views/Programs.vue'),
    },
    {
        path: '/contact',
        name: 'Contact',
        component: () => import('@/views/Contact.vue'),
    },
    {
        path: '/faq',
        name: 'FAQ',
        component: () => import('@/views/FAQ.vue'),
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
                path: 'change-password',
                name: 'StudentChangePassword',
                component: () => import('@/views/student/ChangePassword.vue'),
            },
            {
                path: 'notification-settings',
                name: 'StudentNotificationSettings',
                component: () => import('@/views/student/NotificationSettings.vue'),
            },
            {
                path: 'privacy-settings',
                name: 'StudentPrivacySettings',
                component: () => import('@/views/student/PrivacySettings.vue'),
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
                path: 'payment-gateway',
                name: 'StudentPaymentGateway',
                component: () => import('@/views/student/PaymentGateway.vue'),
            },
            {
                path: 'gateway-simulation',
                name: 'StudentSimulatedGateway',
                component: () => import('@/views/student/SimulatedGateway.vue'),
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
            {
                path: 'chat',
                name: 'StudentSupportChat',
                component: () => import('@/views/student/StudentChat.vue'),
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
                alias: 'seats',
                name: 'StaffSeatManagement',
                component: () => import('@/views/staff/SeatManagement.vue'),
            },
            {
                path: 'monitor',
                name: 'StaffCeremonyMonitor',
                component: () => import('@/views/staff/CeremonyMonitor.vue'),
            },
            {
                path: 'chat',
                name: 'StaffSupportChat',
                component: () => import('@/views/staff/SupportChat.vue'),
            },
            {
                path: 'student-list',
                alias: 'students',
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
        component: () => import('@/views/admin/AdminLayout.vue'),
        meta: { requiresAuth: true, role: 'admin' },
        children: [
            {
                path: '',
                redirect: '/admin/users',
            },
            {
                path: 'dashboard',
                name: 'AdminDashboard',
                component: () => import('@/views/admin/PostManagement.vue'),
            },
            {
                path: 'users',
                name: 'AdminUsers',
                component: () => import('@/views/admin/UserManagement.vue'),
            },
            {
                path: 'posts',
                name: 'AdminPosts',
                component: () => import('@/views/admin/PostManagement.vue'),
            },
            {
                path: 'settings',
                name: 'AdminSettings',
                component: () => import('@/views/admin/AdminSettings.vue'),
            },
        ],
    },
    // MC Routes
    {
        path: '/mc',
        component: () => import('@/views/mc/MCLayout.vue'),
        meta: { requiresAuth: true, role: 'mc' },
        children: [
            {
                path: '',
                redirect: '/mc/dashboard',
            },
            {
                path: 'dashboard',
                name: 'MCDashboard',
                component: () => import('@/views/mc/Dashboard.vue'),
            },
            {
                path: 'students',
                name: 'MCStudentAttendance',
                component: () => import('@/views/mc/StudentAttendance.vue'),
            },
            {
                path: 'ceremony',
                name: 'MCCeremony',
                component: () => import('@/views/mc/CeremonyControl.vue'),
            },
            {
                path: 'chat',
                name: 'MCInternalChat',
                component: () => import('@/views/mc/InternalChat.vue'),
            },
            {
                path: 'lookup',
                name: 'MCLookup',
                component: () => import('@/views/mc/StudentLookup.vue'),
            },
            {
                path: 'settings',
                name: 'MCSettings',
                component: () => import('@/views/mc/MCSettings.vue'),
            },
        ],
    },
    // Legal Pages
    {
        path: '/terms',
        name: 'TermsAndConditions',
        component: () => import('@/views/TermsAndConditions.vue'),
    },
    {
        path: '/privacy',
        name: 'PrivacyPolicy',
        component: () => import('@/views/PrivacyPolicy.vue'),
    },
    // Public Live Screen
    {
        path: '/live',
        name: 'PublicLiveDisplay',
        component: () => import('@/views/live/PublicDisplay.vue'),
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
            const roleRedirectMap = {
                student: '/student/dashboard',
                staff: '/staff',
                admin: '/admin/users',
                mc: '/mc/dashboard',
            };
            next(roleRedirectMap[authStore.userRole] || '/');
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
