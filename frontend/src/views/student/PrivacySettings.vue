<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('nav.settings')"
  >
    <div class="w-full max-w-2xl mx-auto px-4 py-6">
      
      <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors">
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        <span class="text-sm font-semibold">Back to Settings</span>
      </button>

      <div class="space-y-6">
        <!-- Visibility Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h2 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-gray-500">visibility</span>
              Profile Visibility
            </h2>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
             <div class="p-4 flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Public Profile</p>
                  <p class="text-sm text-gray-500">Allow other students to find you</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.profileVisible" @change="saveSettings" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-900 dark:peer-checked:bg-white"></div>
                </label>
             </div>
             
             <div class="p-4 flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Show Contact Info</p>
                  <p class="text-sm text-gray-500">Display email on your profile card</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.showContact" @change="saveSettings" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-900 dark:peer-checked:bg-white"></div>
                </label>
             </div>

             <div class="p-4 flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Show Seat</p>
                  <p class="text-sm text-gray-500">Let others see where you are sitting</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.showSeat" @change="saveSettings" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-900 dark:peer-checked:bg-white"></div>
                </label>
             </div>
          </div>
        </div>

        <!-- Data Management -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h2 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-gray-500">database</span>
              Data Management
            </h2>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
             <button class="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Request Data Export</p>
                  <p class="text-sm text-gray-500">Download a copy of your personal data</p>
                </div>
                <span class="material-symbols-outlined text-gray-400">download</span>
             </button>
             
             <button @click="confirmDeleteAccount" class="w-full text-left p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                <div>
                  <p class="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                  <p class="text-sm text-red-500/70">Permanently delete account and data</p>
                </div>
                <span class="material-symbols-outlined text-red-400">delete</span>
             </button>
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
  profileVisible: true,
  showContact: false,
  showSeat: true,
  analytics: true,
  performance: true
});

const saveSettings = () => {
  localStorage.setItem('privacySettings', JSON.stringify(settings.value));
  showSuccess('Privacy settings updated');
};

const loadSettings = () => {
  const saved = localStorage.getItem('privacySettings');
  if (saved) {
    settings.value = JSON.parse(saved);
  }
};

const confirmDeleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    // API call would go here
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
