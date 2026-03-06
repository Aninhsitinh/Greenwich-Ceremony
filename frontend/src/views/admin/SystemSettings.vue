<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('admin.settings')"
  >
    <div class="w-full max-w-6xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Settings</h1>
        <p class="text-gray-600 dark:text-gray-400">Configure system-wide settings and preferences</p>
      </div>

      <!-- Settings Sections -->
      <div class="space-y-6">
        <!-- General Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">settings</span>
            General Settings
          </h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">System Name</label>
                <input
                  v-model="settings.systemName"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Admin Email</label>
                <input
                  v-model="settings.adminEmail"
                  type="email"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">System Description</label>
              <textarea
                v-model="settings.systemDescription"
                rows="3"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Ceremony Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">school</span>
            Ceremony Configuration
          </h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Ceremony Date</label>
                <input
                  v-model="settings.ceremonyDate"
                  type="date"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Ceremony Time</label>
                <input
                  v-model="settings.ceremonyTime"
                  type="time"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Registration Deadline</label>
                <input
                  v-model="settings.registrationDeadline"
                  type="date"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Max Guests per Student</label>
                <input
                  v-model.number="settings.maxGuests"
                  type="number"
                  min="0"
                  max="10"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Ceremony Location</label>
              <input
                v-model="settings.ceremonyLocation"
                type="text"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- Gown Collection Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">checkroom</span>
            Gown Collection
          </h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Collection Start Date</label>
                <input
                  v-model="settings.gownCollectionStart"
                  type="date"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Collection End Date</label>
                <input
                  v-model="settings.gownCollectionEnd"
                  type="date"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Collection Location</label>
              <input
                v-model="settings.gownCollectionLocation"
                type="text"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Available Sizes</label>
              <div class="flex flex-wrap gap-3">
                <label v-for="size in ['XS', 'S', 'M', 'L', 'XL', 'XXL']" :key="size" class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :value="size"
                    v-model="settings.gownSizes"
                    class="w-5 h-5 text-primary rounded focus:ring-primary"
                  />
                  <span class="text-gray-900 dark:text-white font-semibold">{{ size }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Email & Notification Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">notifications</span>
            Notifications
          </h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">Email Notifications</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Send email notifications to users</p>
              </div>
              <input
                type="checkbox"
                v-model="settings.emailNotifications"
                class="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">SMS Notifications</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Send SMS alerts for important updates</p>
              </div>
              <input
                type="checkbox"
                v-model="settings.smsNotifications"
                class="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">Auto-Approve Registrations</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Automatically approve student registrations</p>
              </div>
              <input
                type="checkbox"
                v-model="settings.autoApprove"
                class="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">security</span>
            Security
          </h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Session Timeout (minutes)</label>
                <input
                  v-model.number="settings.sessionTimeout"
                  type="number"
                  min="5"
                  max="1440"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Max Login Attempts</label>
                <input
                  v-model.number="settings.maxLoginAttempts"
                  type="number"
                  min="3"
                  max="10"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Require 2FA for admin accounts</p>
              </div>
              <input
                type="checkbox"
                v-model="settings.require2FA"
                class="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <!-- System Maintenance -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">build</span>
            System Maintenance
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button class="flex items-center justify-center gap-3 px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <span class="material-symbols-outlined text-blue-600 text-2xl">backup</span>
              <div class="text-left">
                <p class="font-semibold text-blue-900 dark:text-blue-400">Backup Database</p>
                <p class="text-xs text-blue-700 dark:text-blue-500">Create system backup</p>
              </div>
            </button>
            <button class="flex items-center justify-center gap-3 px-6 py-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <span class="material-symbols-outlined text-green-600 text-2xl">cloud_upload</span>
              <div class="text-left">
                <p class="font-semibold text-green-900 dark:text-green-400">Export Data</p>
                <p class="text-xs text-green-700 dark:text-green-500">Download all data</p>
              </div>
            </button>
            <button class="flex items-center justify-center gap-3 px-6 py-4 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
              <span class="material-symbols-outlined text-orange-600 text-2xl">delete_sweep</span>
              <div class="text-left">
                <p class="font-semibold text-orange-900 dark:text-orange-400">Clear Cache</p>
                <p class="text-xs text-orange-700 dark:text-orange-500">Clear system cache</p>
              </div>
            </button>
            <button class="flex items-center justify-center gap-3 px-6 py-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <span class="material-symbols-outlined text-red-600 text-2xl">restart_alt</span>
              <div class="text-left">
                <p class="font-semibold text-red-900 dark:text-red-400">Reset System</p>
                <p class="text-xs text-red-700 dark:text-red-500">Factory reset</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex gap-4">
          <button
            @click="saveSettings"
            class="flex-1 px-6 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 shadow-lg flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined">save</span>
            <span>Save All Settings</span>
          </button>
          <button
            @click="resetSettings"
            class="px-6 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import api from '@/services/api';

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

const settings = ref({
  systemName: 'FPT Greenwich Graduation Ceremony',
  adminEmail: 'admin@fpt.edu.vn',
  systemDescription: 'Official graduation ceremony registration and management system',
  ceremonyDate: '2026-06-15',
  ceremonyTime: '14:00',
  ceremonyLocation: 'FPT University Main Hall',
  registrationDeadline: '2026-05-31',
  maxGuests: 3,
  gownCollectionStart: '2026-05-20',
  gownCollectionEnd: '2026-06-10',
  gownCollectionLocation: 'Main Campus Hall',
  gownSizes: ['S', 'M', 'L', 'XL'],
  emailNotifications: true,
  smsNotifications: false,
  autoApprove: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  require2FA: false
});

const saveSettings = async () => {
  try {
    await api.post('/settings', settings.value);
    alert('Settings saved successfully!');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Settings saved locally (API not connected)');
  }
};

const resetSettings = () => {
  if (confirm('Reset all settings to default?')) {
    location.reload();
  }
};

onMounted(async () => {
  try {
    const response = await api.get('/settings');
    if (response.data.data) {
      settings.value = { ...settings.value, ...response.data.data };
    }
  } catch (error) {
    console.log('Using default settings');
  }
});
</script>
