<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('nav.notifications')"
  >
    <div class="w-full max-w-2xl mx-auto px-4 py-6">
      
      <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors">
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        <span class="text-sm font-semibold">Back to Settings</span>
      </button>

      <div class="space-y-6">
        <!-- Email Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h2 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-gray-500">email</span>
              Email Notifications
            </h2>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
             <div class="p-4 flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Event Updates</p>
                  <p class="text-sm text-gray-500">Schedule changes and important updates</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.emailEventUpdates" @change="saveSettings" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-900 dark:peer-checked:bg-white"></div>
                </label>
             </div>
             
             <div class="p-4 flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Registration Status</p>
                  <p class="text-sm text-gray-500">Updates on your registration and booking</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.emailRegistration" @change="saveSettings" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-900 dark:peer-checked:bg-white"></div>
                </label>
             </div>

             <div class="p-4 flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Payment Receipts</p>
                  <p class="text-sm text-gray-500">Invoices and payment confirmations</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.emailTickets" @change="saveSettings" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-900 dark:peer-checked:bg-white"></div>
                </label>
             </div>
          </div>
        </div>

        <!-- Push Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h2 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-gray-500">notifications_active</span>
              Push Notifications
            </h2>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
             <div class="p-4 flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Reminders</p>
                  <p class="text-sm text-gray-500">Upcoming deadlines and event reminders</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.pushReminders" @change="saveSettings" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-900 dark:peer-checked:bg-white"></div>
                </label>
             </div>
             
             <div class="p-4 flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Announcements</p>
                  <p class="text-sm text-gray-500">Important school announcements</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.pushAnnouncements" @change="saveSettings" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-900 dark:peer-checked:bg-white"></div>
                </label>
             </div>
          </div>
        </div>

      </div>

      <!-- Toast Message -->
      <div v-if="successMessage" class="fixed bottom-6 right-6 px-4 py-2 bg-gray-900 text-white rounded-lg shadow-lg text-sm font-medium animate-fade-in-up z-50">
        {{ successMessage }}
      </div>

    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

const successMessage = ref('');

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

const settings = ref({
  emailEventUpdates: true,
  emailRegistration: true,
  emailTickets: true,
  pushReminders: true,
  pushAnnouncements: true,
  marketingNews: false,
  marketingOffers: false
});

const saveSettings = () => {
  localStorage.setItem('notificationSettings', JSON.stringify(settings.value));
  showSuccess('Settings updated');
};

const loadSettings = () => {
  const saved = localStorage.getItem('notificationSettings');
  if (saved) {
    settings.value = JSON.parse(saved);
  }
};

const showSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => { successMessage.value = ''; }, 3000);
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
