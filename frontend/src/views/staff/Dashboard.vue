<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    page-title="Staff Dashboard"
    :show-notifications="true"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6">
      <!-- Header Card -->
      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white mb-6 shadow-xl">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined">badge</span>
              <span class="text-sm uppercase tracking-wider opacity-90">Staff Portal</span>
            </div>
            <h1 class="text-3xl font-bold mb-2">Welcome, {{ user?.fullName }}</h1>
            <p class="text-blue-100">Manage ceremony operations and student check-ins</p>
          </div>
          <div class="hidden lg:block">
            <div class="bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl border border-white/30">
              <p class="text-xs uppercase tracking-wider mb-1">Today's Date</p>
              <p class="text-2xl font-bold">{{ currentDate }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm"
        >
          <div class="flex items-center justify-between mb-3">
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', stat.bgColor]">
              <span class="material-symbols-outlined text-2xl" :class="stat.textColor">{{ stat.icon }}</span>
            </div>
            <span :class="['text-xs font-semibold px-2 py-1 rounded-full', stat.badge.class]">
              {{ stat.badge.text }}
            </span>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ stat.value }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            v-for="action in quickActions"
            :key="action.label"
            @click="$router.push(action.path)"
            :class="[
              'flex flex-col items-center justify-center gap-3 p-6 rounded-xl transition-all hover:scale-105',
              action.variant === 'primary'
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary'
            ]"
          >
            <span class="material-symbols-outlined text-4xl">{{ action.icon }}</span>
            <span class="font-semibold text-sm text-center">{{ action.label }}</span>
          </button>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Recent Activity + Scan Stats -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Scan Statistics -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Today's Scan Activity</h2>
              <button class="text-primary text-sm font-semibold hover:underline">View All</button>
            </div>
            <div class="grid grid-cols-3 gap-4 mb-4">
              <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p class="text-3xl font-bold text-green-600">{{ scanStats.valid }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Valid Scans</p>
              </div>
              <div class="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p class="text-3xl font-bold text-red-600">{{ scanStats.invalid }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Invalid</p>
              </div>
              <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p class="text-3xl font-bold text-blue-600">{{ scanStats.total }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Total</p>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div class="space-y-3">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', activity.iconBg]">
                  <span class="material-symbols-outlined text-white text-lg">{{ activity.icon }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-sm text-gray-900 dark:text-white">{{ activity.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ activity.description }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
                </div>
                <span :class="['text-xs font-semibold px-2 py-1 rounded-full', activity.badge.class]">
                  {{ activity.badge.text }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Tasks + Alerts -->
        <div class="space-y-6">
          <!-- Pending Tasks -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Pending Tasks</h2>
            <div class="space-y-3">
              <div
                v-for="task in pendingTasks"
                :key="task.id"
                class="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
              >
                <input type="checkbox" class="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ task.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ task.due }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- System Status -->
          <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-3xl">verified</span>
              <div>
                <h3 class="font-bold text-lg mb-1">All Systems Operational</h3>
                <p class="text-sm text-green-100">Check-in system running smoothly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const navigation = [
  { path: '/staff', icon: 'dashboard', label: 'Dashboard' },
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: 'QR Scanner' },
  { path: '/staff/gown-collection', icon: 'checkroom', label: 'Gown Collection' },
  { path: '/staff/seat-management', icon: 'event_seat', label: 'Seat Management' },
  { path: '/staff/student-list', icon: 'group', label: 'Student List' },
  { path: '/staff/settings', icon: 'settings', label: 'Settings' }
];

const bottomNavigation = [
  { path: '/staff', icon: 'home', label: 'Home' },
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: 'Scan' },
  { path: '/staff/gown-collection', icon: 'checkroom', label: 'Gown' },
  { path: '/staff/student-list', icon: 'group', label: 'Students' }
];

const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const stats = [
  {
    icon: 'confirmation_number',
    value: '247',
    label: 'Total Registrations',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    textColor: 'text-blue-600',
    badge: { text: '+12 today', class: 'bg-blue-100 text-blue-600' }
  },
  {
    icon: 'verified',
    value: '189',
    label: 'Confirmed Students',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    textColor: 'text-green-600',
    badge: { text: '76%', class: 'bg-green-100 text-green-600' }
  },
  {
    icon: 'qr_code_scanner',
    value: '45',
    label: 'Scanned Today',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    textColor: 'text-purple-600',
    badge: { text: 'Live', class: 'bg-purple-100 text-purple-600' }
  },
  {
    icon: 'checkroom',
    value: '123',
    label: 'Gowns Collected',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    textColor: 'text-orange-600',
    badge: { text: '65%', class: 'bg-orange-100 text-orange-600' }
  }
];

const quickActions = [
  { icon: 'qr_code_scanner', label: 'Scan QR Code', path: '/staff/qr-scanner', variant: 'primary' },
  { icon: 'checkroom', label: 'Gown Collection', path: '/staff/gown-collection' },
  { icon: 'event_seat', label: 'Seat Management', path: '/staff/seat-management' },
  { icon: 'group', label: 'Student List', path: '/staff/student-list' }
];

const scanStats = ref({
  valid: 42,
  invalid: 3,
  total: 45
});

const recentActivity = [
  {
    id: 1,
    icon: 'qr_code_scanner',
    iconBg: 'bg-green-500',
    title: 'Ticket Scanned Successfully',
    description: 'John Doe - GCS220001',
    time: '2 minutes ago',
    badge: { text: 'Valid', class: 'bg-green-100 text-green-600' }
  },
  {
    id: 2,
    icon: 'checkroom',
    iconBg: 'bg-blue-500',
    title: 'Gown Collected',
    description: 'Jane Smith - Size M',
    time: '5 minutes ago',
    badge: { text: 'Completed', class: 'bg-blue-100 text-blue-600' }
  },
  {
    id: 3,
    icon: 'warning',
    iconBg: 'bg-red-500',
    title: 'Invalid Ticket Detected',
    description: 'Duplicate scan attempt',
    time: '12 minutes ago',
    badge: { text: 'Alert', class: 'bg-red-100 text-red-600' }
  },
  {
    id: 4,
    icon: 'event_seat',
    iconBg: 'bg-purple-500',
    title: 'Seat Assignment Updated',
    description: 'Row A, Seat 15',
    time: '25 minutes ago',
    badge: { text: 'Updated', class: 'bg-purple-100 text-purple-600' }
  }
];

const pendingTasks = [
  { id: 1, title: 'Verify student registrations', due: 'Due today' },
  { id: 2, title: 'Update seating arrangement', due: 'Due tomorrow' },
  { id: 3, title: 'Prepare gown inventory', due: 'Due in 3 days' }
];
</script>
