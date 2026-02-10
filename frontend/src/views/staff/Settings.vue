<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    page-title="Settings"
  >
    <div class="w-full max-w-4xl mx-auto px-4 py-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
      </div>

      <div class="space-y-6">
        <!-- Profile Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile Information</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Full Name</label>
              <input
                type="text"
                value="Staff Member"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Email</label>
              <input
                type="email"
                value="staff@fpt.edu.vn"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Notifications</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">Email Notifications</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Receive email updates</p>
              </div>
              <input type="checkbox" checked class="w-5 h-5 text-primary rounded focus:ring-primary" />
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">Push Notifications</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Receive push notifications</p>
              </div>
              <input type="checkbox" class="w-5 h-5 text-primary rounded focus:ring-primary" />
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <button class="w-full px-6 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 shadow-lg">
          Save Changes
        </button>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

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
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: 'Scanner' },
  { path: '/staff/student-list', icon: 'group', label: 'Students' },
  { path: '/staff/settings', icon: 'settings', label: 'Settings' }
];
</script>
