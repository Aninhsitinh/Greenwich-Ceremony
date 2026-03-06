<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('admin.dashboard')"
    :show-notifications="true"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 lg:p-8 text-white mb-6 shadow-xl">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined">admin_panel_settings</span>
              <span class="text-sm uppercase tracking-wider opacity-90">Admin Portal</span>
            </div>
            <h1 class="text-3xl font-bold mb-2">System Overview</h1>
            <p class="text-purple-100">Manage students, registrations, and ceremony operations</p>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-3">
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', stat.bgColor]">
              <span class="material-symbols-outlined text-2xl" :class="stat.textColor">{{ stat.icon }}</span>
            </div>
            <span :class="['text-xs font-bold px-2 py-1 rounded-full', stat.trend.class]">
              {{ stat.trend.text }}
            </span>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ stat.value }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Registration Trends -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Registration Trends</h2>
          <div style="height: 300px">
            <Chart type="line" :data="registrationChartData" />
          </div>
        </div>

        <!-- Status Distribution -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Status Distribution</h2>
          <div style="height: 300px">
            <Chart type="doughnut" :data="statusChartData" />
          </div>
        </div>
      </div>

      <!-- Management Shortcuts -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Management</h2>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="shortcut in managementShortcuts"
            :key="shortcut.label"
            @click="$router.push(shortcut.path)"
            class="flex flex-col items-start p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all group"
          >
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform', shortcut.bgColor]">
              <span class="material-symbols-outlined text-2xl" :class="shortcut.textColor">{{ shortcut.icon }}</span>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ shortcut.label }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ shortcut.description }}</p>
          </button>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activities -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h2>
              <button class="text-primary text-sm font-semibold hover:underline">View All</button>
            </div>
            <div class="space-y-3">
              <div
                v-for="activity in recentActivities"
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
              </div>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="space-y-6">
          <!-- System Health -->
          <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-3xl">verified</span>
              <div>
                <h3 class="font-bold text-lg mb-1">All Systems Healthy</h3>
                <p class="text-sm text-green-100">Last checked: Just now</p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 class="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div class="space-y-2">
              <button
                v-for="action in quickActions"
                :key="action.label"
                @click="$router.push(action.path)"
                class="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-primary/10 transition-colors text-left"
              >
                <span class="material-symbols-outlined text-primary">{{ action.icon }}</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ action.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref } from 'vue';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import Chart from '@/components/Chart.vue';

const navigation = [
  { path: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { path: '/admin/students', icon: 'group', label: 'Student Management' },
  { path: '/admin/registrations', icon: 'how_to_reg', label: 'Registrations' },
  { path: '/admin/tickets', icon: 'confirmation_number', label: 'Ticket Management' },
  { path: '/admin/seats', icon: 'event_seat', label: 'Seat Management' },
  { path: '/admin/announcements', icon: 'campaign', label: 'Announcements' },
  { path: '/admin/settings', icon: 'settings', label: 'System Settings' }
];

const bottomNavigation = [
  { path: '/admin', icon: 'home', label: 'Home' },
  { path: '/admin/students', icon: 'group', label: 'Students' },
  { path: '/admin/registrations', icon: 'how_to_reg', label: 'Register' },
  { path: '/admin/settings', icon: 'settings', label: 'Settings' }
];

const stats = [
  {
    icon: 'group',
    value: '2,547',
    label: 'Total Students',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    textColor: 'text-blue-600',
    trend: { text: '+12%', class: 'bg-green-100 text-green-600' }
  },
  {
    icon: 'how_to_reg',
    value: '1,892',
    label: 'Active Registrations',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    textColor: 'text-green-600',
    trend: { text: '+8%', class: 'bg-green-100 text-green-600' }
  },
  {
    icon: 'confirmation_number',
    value: '1,756',
    label: 'Tickets Generated',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    textColor: 'text-purple-600',
    trend: { text: '+15%', class: 'bg-green-100 text-green-600' }
  },
  {
    icon: 'event_seat',
    value: '4,234/5,000',
    label: 'Seats Booked',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    textColor: 'text-orange-600',
    trend: { text: '85%', class: 'bg-blue-100 text-blue-600' }
  }
];

const registrationChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Registrations',
    data: [450, 680, 920, 1200, 1560, 1892],
    borderColor: 'rgb(10, 71, 194)',
    backgroundColor: 'rgba(10, 71, 194, 0.1)',
    tension: 0.4,
    fill: true
  }]
});

const statusChartData = ref({
  labels: ['Confirmed', 'Pending', 'Cancelled'],
  datasets: [{
    data: [1456, 336, 100],
    backgroundColor: [
      'rgb(34, 197, 94)',
      'rgb(251, 191, 36)',
      'rgb(239, 68, 68)'
    ]
  }]
});

const managementShortcuts = [
  {
    icon: 'group',
    label: 'Student Management',
    description: 'Manage student records',
    path: '/admin/students',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    textColor: 'text-blue-600'
  },
  {
    icon: 'how_to_reg',
    label: 'Registrations',
    description: 'Review and approve',
    path: '/admin/registrations',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    textColor: 'text-green-600'
  },
  {
    icon: 'confirmation_number',
    label: 'Ticket Management',
    description: 'Track ticket status',
    path: '/admin/tickets',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    textColor: 'text-purple-600'
  },
  {
    icon: 'event_seat',
    label: 'Seat Management',
    description: 'Manage seating layout',
    path: '/admin/seats',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    textColor: 'text-orange-600'
  },
  {
    icon: 'campaign',
    label: 'Announcements',
    description: 'Send notifications',
    path: '/admin/announcements',
    bgColor: 'bg-pink-100 dark:bg-pink-900/20',
    textColor: 'text-pink-600'
  },
  {
    icon: 'settings',
    label: 'System Settings',
    description: 'Configure system',
    path: '/admin/settings',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
    textColor: 'text-gray-600 dark:text-gray-400'
  }
];

const recentActivities = [
  {
    id: 1,
    icon: 'person_add',
    iconBg: 'bg-green-500',
    title: 'New Student Registered',
    description: 'John Doe completed registration',
    time: '2 minutes ago'
  },
  {
    id: 2,
    icon: 'how_to_reg',
    iconBg: 'bg-blue-500',
    title: 'Registration Approved',
    description: 'Jane Smith - GCS220045',
    time: '15 minutes ago'
  },
  {
    id: 3,
    icon: 'confirmation_number',
    iconBg: 'bg-purple-500',
    title: 'Ticket Generated',
    description: 'Batch processing completed',
    time: '1 hour ago'
  },
  {
    id: 4,
    icon: 'campaign',
    iconBg: 'bg-orange-500',
    title: 'Announcement Published',
    description: 'Gown collection reminder sent',
    time: '3 hours ago'
  }
];

const quickActions = [
  { icon: 'person_add', label: 'Add Student', path: '/admin/students' },
  { icon: 'campaign', label: 'Send Announcement', path: '/admin/announcements' },
  { icon: 'download', label: 'Export Data', path: '/admin/reports' }
];
</script>
