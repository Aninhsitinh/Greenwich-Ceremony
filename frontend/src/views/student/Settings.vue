<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    page-title="Settings"
  >
    <div class="w-full max-w-4xl mx-auto px-4 py-6">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-2">
          <div class="icon-container bg-gradient-to-br from-gray-600 to-gray-800 text-white w-14 h-14">
            <span class="material-symbols-outlined text-2xl">settings</span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p class="text-gray-500 dark:text-gray-400">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <!-- Settings Grid -->
      <div class="space-y-6">
        <!-- Account Settings -->
        <div class="glass-card p-6">
          <div class="flex items-center gap-3 mb-6">
            <span class="icon-container bg-blue-100 dark:bg-blue-900/30 text-blue-600">
              <span class="material-symbols-outlined">account_circle</span>
            </span>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Account Settings</h2>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/5 transition-all group">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">email</span>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Email Address</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ user?.email || 'Not set' }}</p>
                </div>
              </div>
              <button class="btn-link">Change</button>
            </div>

            <div class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/5 transition-all group">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">lock</span>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Password</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Last changed 30 days ago</p>
                </div>
              </div>
              <button class="btn-link">Change</button>
            </div>

            <div class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/5 transition-all group">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">security</span>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Two-Factor Authentication</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Add extra security to your account</p>
                </div>
              </div>
              <button class="btn btn-primary py-2 px-4">
                <span class="material-symbols-outlined text-sm">add</span>
                Enable
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="glass-card p-6">
          <div class="flex items-center gap-3 mb-6">
            <span class="icon-container bg-purple-100 dark:bg-purple-900/30 text-purple-600">
              <span class="material-symbols-outlined">notifications</span>
            </span>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-gray-500">email</span>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">Email Notifications</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                </div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="settings.emailNotifications" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-gray-500">sms</span>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">SMS Notifications</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Get important alerts via SMS</p>
                </div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="settings.smsNotifications" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-gray-500">web</span>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">Push Notifications</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Browser notifications</p>
                </div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="settings.pushNotifications" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Appearance -->
        <div class="glass-card p-6">
          <div class="flex items-center gap-3 mb-6">
            <span class="icon-container bg-orange-100 dark:bg-orange-900/30 text-orange-600">
              <span class="material-symbols-outlined">palette</span>
            </span>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Appearance</h2>
          </div>
          
          <div>
            <p class="font-semibold text-gray-900 dark:text-white mb-4">Theme</p>
            <div class="grid grid-cols-3 gap-4">
              <button 
                v-for="theme in themes" 
                :key="theme.value"
                @click="selectedTheme = theme.value"
                :class="[
                  'flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all',
                  selectedTheme === theme.value 
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                ]"
              >
                <span :class="[
                  'material-symbols-outlined text-3xl',
                  selectedTheme === theme.value ? 'text-primary' : 'text-gray-500'
                ]">{{ theme.icon }}</span>
                <span :class="[
                  'text-sm font-semibold',
                  selectedTheme === theme.value ? 'text-primary' : 'text-gray-900 dark:text-white'
                ]">{{ theme.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Privacy & Data -->
        <div class="glass-card p-6">
          <div class="flex items-center gap-3 mb-6">
            <span class="icon-container bg-green-100 dark:bg-green-900/30 text-green-600">
              <span class="material-symbols-outlined">privacy_tip</span>
            </span>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Privacy & Data</h2>
          </div>
          
          <div class="space-y-3">
            <button class="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/5 transition-all group">
              <div class="flex items-center gap-4">
                <span class="icon-container bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                  <span class="material-symbols-outlined">download</span>
                </span>
                <div class="text-left">
                  <p class="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Download Your Data</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Get a copy of your information</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>

            <button class="w-full flex items-center justify-between p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 transition-all group">
              <div class="flex items-center gap-4">
                <span class="icon-container bg-red-500 text-white">
                  <span class="material-symbols-outlined">delete_forever</span>
                </span>
                <div class="text-left">
                  <p class="font-semibold text-red-600">Delete Account</p>
                  <p class="text-sm text-red-500/80">Permanently delete your account</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-red-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex gap-3">
          <button class="btn btn-primary flex-1">
            <span class="material-symbols-outlined">save</span>
            Save Changes
          </button>
          <button class="btn btn-glass">
            Cancel
          </button>
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
  { value: 'auto', label: 'Auto', icon: 'brightness_auto' }
];

const navigation = [
  { path: '/student', icon: 'dashboard', label: 'Dashboard' },
  { path: '/student/registration', icon: 'how_to_reg', label: 'Registration' },
  { path: '/student/ticket', icon: 'confirmation_number', label: 'My Ticket' },
  { path: '/student/seat-booking', icon: 'event_seat', label: 'Seat Booking' },
  { path: '/student/profile', icon: 'person', label: 'Profile' },
  { path: '/student/settings', icon: 'settings', label: 'Settings' }
];

const bottomNavigation = [
  { path: '/student', icon: 'home', label: 'Home' },
  { path: '/student/ticket', icon: 'confirmation_number', label: 'Ticket' },
  { path: '/student/seat-booking', icon: 'event_seat', label: 'Seats' },
  { path: '/student/profile', icon: 'person', label: 'Profile' }
];
</script>

<style scoped>
.toggle {
  @apply relative inline-block w-12 h-6;
}

.toggle input {
  @apply opacity-0 w-0 h-0;
}

.toggle-slider {
  @apply absolute cursor-pointer inset-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-all;
}

.toggle-slider:before {
  content: "";
  @apply absolute h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-all;
}

.toggle input:checked + .toggle-slider {
  @apply bg-primary;
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.btn-link {
  @apply text-primary font-semibold text-sm hover:underline;
}
</style>
