<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('nav.settings')"
  >
    <div class="w-full max-w-4xl mx-auto px-4 py-6">
      <!-- Settings Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p class="text-gray-500 dark:text-gray-400">Manage your account preferences and application settings.</p>
      </div>

      <div class="space-y-6">
        <!-- Account Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h2 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-gray-500">account_circle</span>
              Account
            </h2>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Email Address</p>
                <p class="text-sm text-gray-500">{{ user?.email || 'Not set' }}</p>
              </div>
              <button class="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Change</button>
            </div>

            <div class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Password</p>
                <p class="text-sm text-gray-500">Last changed 30 days ago</p>
              </div>
              <button @click="$router.push('/student/change-password')" class="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Change</button>
            </div>

            <div class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                <p class="text-sm text-gray-500">Add extra security to your account</p>
              </div>
              <button class="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Enable</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

const authStore = useAuthStore();
const { t } = useI18n();
const user = computed(() => authStore.user);

const settings = ref({
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: false
});

const selectedTheme = ref('light');

const themes = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
  { value: 'auto', label: 'System', icon: 'brightness_auto' }
];

const navigation = computed(() => [
  { path: '/student/dashboard', icon: 'dashboard', label: t('student.nav_dashboard') },
  { path: '/student/profile', icon: 'person', label: t('student.nav_profile') },
  { path: '/student/ticket', icon: 'qr_code_2', label: t('student.nav_ticket') },
  { path: '/student/seat-booking', icon: 'event_seat', label: t('student.nav_seats') },
  { path: '/student/gown-collection', icon: 'checkroom', label: t('student.nav_gown') },
  { path: '/student/booking-confirmation', icon: 'payments', label: t('student.nav_payments') },
  { path: '/student/chat', icon: 'support_agent', label: t('student.nav_chat') }
]);

const bottomNavigation = [
  { path: '/student/dashboard', icon: 'dashboard', label: 'Home' },
  { path: '/student/ticket', icon: 'qr_code_2', label: 'Ticket' },
  { path: '/student/seat-booking', icon: 'event_seat', label: 'Seats' },
  { path: '/student/profile', icon: 'person', label: 'Profile' }
];
</script>
