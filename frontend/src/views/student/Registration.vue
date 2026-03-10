<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('nav.register')"
  >
    <div class="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      <!-- Back Button -->
      <div class="flex items-center justify-between">
        <button @click="$router.push('/student/dashboard')" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
          <span class="text-sm font-semibold">Back to Dashboard</span>
        </button>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 flex items-center gap-3 animate-fade-in">
        <span class="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
        <p class="text-green-700 dark:text-green-300 font-medium">{{ successMessage }}</p>
      </div>

      <div v-if="error" class="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 flex items-center gap-3 animate-fade-in">
        <span class="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
        <p class="text-red-700 dark:text-red-300 font-medium">{{ error }}</p>
      </div>

      <!-- Main Content -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Event Card -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
            <div class="bg-gray-900 dark:bg-gray-700 h-32 relative flex items-center justify-center overflow-hidden">
               <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 20px 20px;"></div>
               <span class="material-symbols-outlined text-gray-700 dark:text-gray-600 text-8xl absolute -bottom-4 -right-4 transform rotate-12">school</span>
               <div class="relative z-10 text-center">
                 <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                   <img src="@/assets/images/2022-Greenwich-Eng.webp" alt="Logo" class="w-10 h-10 object-contain" />
                 </div>
               </div>
            </div>
            
            <div class="p-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">Graduation 2026</h2>
              <p class="text-sm text-gray-500 text-center mb-6">University of Greenwich</p>
              
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-gray-400">calendar_month</span>
                  <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</p>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ settings?.ceremonyDate ? new Date(settings.ceremonyDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Loading...' }}</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-gray-400">schedule</span>
                  <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Time</p>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ settings?.ceremonyDate ? new Date(settings.ceremonyDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Loading...' }}</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-gray-400">location_on</span>
                  <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Venue</p>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ settings?.ceremonyLocation || 'Loading...' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Registration Status / Form -->
        <div class="lg:col-span-2">
          <!-- Existing Registration View -->
          <div v-if="hasRegistration && !editing" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                Your Registration
              </h2>
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                registration.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                registration.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              ]">
                {{ registration.status || 'CONFIRMED' }}
              </span>
            </div>

            <div class="space-y-6">
              <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                <div class="flex items-center gap-3 mb-2">
                   <span class="material-symbols-outlined text-gray-400">person</span>
                   <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Student Info</p>
                </div>
                <p class="font-bold text-gray-900 dark:text-white">{{ authStore.user?.fullName }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ authStore.user?.studentId }}</p>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Guests</p>
                  <p class="font-bold text-gray-900 dark:text-white">1 Guest (Standard)</p>
                </div>
              </div>

              <div v-if="registration.specialNeeds" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Special Needs</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ registration.specialNeeds }}</p>
              </div>
            </div>

            <div class="flex gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
              <button @click="editing = true" class="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-sm">edit</span>
                Edit Details
              </button>
              <button @click="confirmCancel" class="px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Cancel Registration
              </button>
            </div>
          </div>

          <!-- Registration Form -->
          <div v-else class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {{ editing ? 'Update Registration' : 'Confirm Attendance' }}
            </h2>

            <form @submit.prevent="submitRegistration" class="space-y-8">
              <!-- Guest Count (Defaulted to 1) -->
              <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">Number of Guests</label>
                    <p class="text-xs text-gray-500 mt-1">Every student is allowed 1 guest ticket by default.</p>
                  </div>
                  <div class="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 font-bold text-gray-900 dark:text-white">
                    1 Guest
                  </div>
                </div>
              </div>



              <!-- Special Needs -->
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Special Accessibility Needs</label>
                <textarea
                  v-model="form.specialNeeds"
                  rows="3"
                  placeholder="E.g., wheelchair access, sign language interpreter..."
                  class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all dark:text-white resize-none"
                ></textarea>
              </div>

              <!-- Confirmation Checkbox -->
              <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                <label class="flex items-start gap-3 cursor-pointer">
                  <div class="relative flex items-center">
                    <input
                      v-model="form.confirmed"
                      type="checkbox"
                      class="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-gray-900 checked:bg-gray-900 dark:border-gray-600 dark:checked:border-white dark:checked:bg-white"
                    />
                    <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100 dark:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="font-bold text-gray-900 dark:text-white text-sm">I confirm my attendance</p>
                    <p class="text-xs text-gray-500 mt-1">I understand that this registration is required to receive my certificate.</p>
                  </div>
                </label>
              </div>

              <!-- Submit Buttons -->
              <div class="flex gap-4">
                <button
                  v-if="editing"
                  type="button"
                  @click="cancelEdit"
                  class="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="!form.confirmed || loading"
                  class="flex-1 px-6 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <div v-if="loading" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <template v-else>
                    <span class="material-symbols-outlined">check_circle</span>
                    <span>{{ editing ? 'Update Registration' : 'Confirm Attendance' }}</span>
                  </template>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const navigation = computed(() => [
  { path: '/student/dashboard', icon: 'dashboard', label: t('student.nav_dashboard') },
  { path: '/student/profile', icon: 'person', label: t('student.nav_profile') },
  { path: '/student/ticket', icon: 'qr_code_2', label: t('student.nav_ticket') },
  { path: '/student/seat-booking', icon: 'event_seat', label: t('student.nav_seats') },
  { path: '/student/gown-collection', icon: 'checkroom', label: t('student.nav_gown') },
  { path: '/student/booking-confirmation', icon: 'payments', label: t('student.nav_payments') },
  { path: '/student/chat', icon: 'support_agent', label: t('student.nav_chat') }
]);

const bottomNavigation = computed(() => [
  { path: '/student/dashboard', icon: 'dashboard', label: t('student.nav_home') },
  { path: '/student/ticket', icon: 'qr_code_2', label: t('student.nav_ticket_short') },
  { path: '/student/seat-booking', icon: 'event_seat', label: t('student.nav_seats_short') },
  { path: '/student/profile', icon: 'person', label: t('student.nav_profile') }
]);

const registration = ref(null);
const settings = ref(null);
const editing = ref(false);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');

const form = ref({
  specialNeeds: '',
  guestCount: 1,
  confirmed: false
});

const hasRegistration = computed(() => !!registration.value);

const loadSettings = async () => {
  try {
    const response = await api.get('/settings');
    if (response.data.success) {
      settings.value = response.data.data;
    }
  } catch (err) {
    console.error('Error loading settings:', err);
  }
};

const loadRegistration = async () => {
  try {
    const response = await api.get('/registrations/me');
    if (response.data.success && response.data.data && response.data.data.registration) {
      registration.value = response.data.data.registration;
      // Populate form for editing
      form.value = {
        specialNeeds: registration.value.specialNeeds || '',
        guestCount: 1,
        confirmed: true
      };
    }
  } catch (err) {
    if (err.response?.status === 404) {
      registration.value = null;
    } else {
      console.error('Error loading registration:', err);
      error.value = 'Failed to load registration data';
    }
  }
};

const submitRegistration = async () => {
  if (!form.value.confirmed) {
    error.value = 'Please confirm your attendance';
    return;
  }

  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const data = {
      ceremonyDate: settings.value?.ceremonyDate || '2026-06-15',
      specialNeeds: form.value.specialNeeds,
      guestCount: 1
    };

    if (editing.value) {
      await api.put(`/registrations/${registration.value.id || registration.value._id}`, data);
      successMessage.value = 'Registration updated successfully!';
      editing.value = false;
      await loadRegistration();
    } else {
      await api.post('/registrations', data);
      await authStore.refreshUser();
      successMessage.value = 'Attendance confirmed! Redirecting to dashboard...';
      
      setTimeout(() => {
        router.push('/student/dashboard');
      }, 1500);
    }
  } catch (err) {
    console.error('Registration error:', err);
    error.value = err.response?.data?.message || 'Failed to register. Please try again.';
  } finally {
    loading.value = false;
  }
};

const cancelEdit = () => {
  editing.value = false;
  loadRegistration();
};

const confirmCancel = () => {
  if (confirm('Are you sure you want to cancel your registration? This action cannot be undone.')) {
    cancelRegistration();
  }
};

const cancelRegistration = async () => {
  loading.value = true;
  try {
    await api.delete(`/registrations/${registration.value.id || registration.value._id}`);
    registration.value = null;
    successMessage.value = 'Registration cancelled successfully';
    form.value = {
      specialNeeds: '',
      guestCount: 1,
      confirmed: false
    };
  } catch (err) {
    error.value = 'Failed to cancel registration';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadSettings();
  loadRegistration();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
