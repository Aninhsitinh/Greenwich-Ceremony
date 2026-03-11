<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
    <!-- Sticky Top Navigation -->
    <div class="sticky top-0 z-40 bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border-b border-white/20 px-4 md:px-6 py-3 flex items-center justify-between shadow-xl">
      <div class="absolute inset-0 mesh-gradient opacity-10 -z-10"></div>

      <div class="flex items-center gap-4">
        <button @click="$router.push('/student/dashboard')" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center">
           <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-xl font-black text-gray-900 dark:text-white">{{ $t('student.gown_title') }}</h1>
      </div>
    </div>

    <div class="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      


      <!-- Prerequisites Check -->
      <div v-if="!canRequestGown" class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-amber-600 dark:text-amber-500 text-3xl">lock</span>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Complete Previous Steps First</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">You need to complete seat booking before you can request gown collection.</p>
            <router-link to="/student/seat-booking" class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors">
              <span class="material-symbols-outlined text-sm">event_seat</span>
              Go to Seat Booking
            </router-link>
          </div>
        </div>
      </div>

      <!-- Existing Request View -->
      <div v-else-if="gownRequest && !showForm" class="space-y-6">
        <!-- Status Card -->
        <div class="glass-card p-8 border-transparent relative overflow-hidden">
          <div class="absolute inset-0 mesh-gradient opacity-5 -z-10"></div>
          <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-4xl text-purple-600 dark:text-purple-400">checkroom</span>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Your Gown Collection</h1>
                <p class="text-gray-500 dark:text-gray-400">Collection details and recorded status</p>
              </div>
            </div>
            <span :class="[
              'px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider',
              gownRequest.status === 'collected' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              gownRequest.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              gownRequest.status === 'returned' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            ]">
              {{ gownRequest.status }}
            </span>
          </div>

          <!-- Info Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="glass-card p-6 border-transparent hover-lift">
              <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Gown Size</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ gownRequest.size }}</p>
            </div>

            <div class="glass-card p-6 border-transparent hover-lift">
              <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Scheduled Date</p>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-gray-400">calendar_today</span>
                <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatDate(gownRequest.scheduledDate) }}</p>
              </div>
            </div>

            <div class="glass-card p-6 border-transparent hover-lift">
              <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Location</p>
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-gray-400">location_on</span>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ gownRequest.collectionLocation }}</p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="gownRequest.notes" class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 mb-6">
            <p class="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-semibold mb-1">Your Notes</p>
            <p class="text-sm text-blue-900 dark:text-blue-100">{{ gownRequest.notes }}</p>
          </div>

          <!-- Actions -->
          <div v-if="gownRequest.status === 'scheduled'">
            <button @click="showForm = true" class="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <span class="material-symbols-outlined">edit</span>
              Update Request
            </button>
          </div>
        </div>

        <!-- Collection Instructions -->
        <div class="glass-card p-6 border-transparent">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-600">info</span>
            Collection Instructions
          </h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-3 text-gray-600 dark:text-gray-400">
              <span class="material-symbols-outlined text-green-500 text-xl">check_circle</span>
              <span>Bring your student ID card</span>
            </li>
            <li class="flex items-start gap-3 text-gray-600 dark:text-gray-400">
              <span class="material-symbols-outlined text-green-500 text-xl">check_circle</span>
              <span>Gown must be returned within 3 days after ceremony</span>
            </li>
            <li class="flex items-start gap-3 text-gray-600 dark:text-gray-400">
              <span class="material-symbols-outlined text-green-500 text-xl">check_circle</span>
              <span>Office hours: Monday - Friday, 8:00 AM - 5:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Request Form -->
      <div v-else-if="canRequestGown" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Record Gown Collection</h1>

        <!-- Size Selection -->
        <div class="mb-10">
          <h2 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-gray-400">straighten</span>
            Select Size
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            <button
              v-for="size in gownSizes"
              :key="size.value"
              @click="selectedSize = size.value"
              :class="[
                'p-4 rounded-lg border-2 text-center transition-all',
                selectedSize === size.value
                  ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900 ring-2 ring-gray-200 dark:ring-gray-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600'
              ]"
            >
              <div class="text-xl font-bold mb-1">{{ size.value }}</div>
              <div class="text-[10px] opacity-80">{{ size.label }}</div>
            </button>
          </div>
          <div class="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-xs text-blue-700 dark:text-blue-300">
            <strong>Size Guide:</strong> XS (150-160cm), S (160-165cm), M (165-170cm), L (170-175cm), XL (175-180cm), XXL (180cm+)
          </div>
        </div>

        <!-- Schedule Date -->
        <div class="mb-10">
          <h2 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-gray-400">calendar_today</span>
            Select Date
          </h2>
          <input
            v-model="scheduledDate"
            type="date"
            :min="minDate"
            :max="maxDate"
            class="w-full h-12 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all"
          />
          <p class="mt-2 text-xs text-gray-500">Collection available from May 20 to June 10, 2026</p>
        </div>

        <!-- Notes -->
        <div class="mb-10">
          <h2 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-gray-400">note</span>
            Notes
          </h2>
          <textarea
            v-model="notes"
            rows="3"
            placeholder="Any special requests..."
            class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all resize-none"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <button 
            @click="gownRequest ? (showForm = false) : $router.back()" 
            class="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submitRequest"
            :disabled="!selectedSize || !scheduledDate || isSubmitting"
            class="flex-1 px-6 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <div v-if="isSubmitting" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <template v-else>
              <span class="material-symbols-outlined text-lg">send</span>
              <span>Record Collection</span>
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const gownRequest = ref(null);
const selectedSize = ref('');
const scheduledDate = ref('');
const notes = ref('');
const isSubmitting = ref(false);
const showForm = ref(false);
const hasSeatBookings = ref(false);

const gownSizes = [
  { value: 'XS', label: '150-160cm' },
  { value: 'S', label: '160-165cm' },
  { value: 'M', label: '165-170cm' },
  { value: 'L', label: '170-175cm' },
  { value: 'XL', label: '175-180cm' },
  { value: 'XXL', label: '180cm+' }
];

// ... Navigation constants
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

const canRequestGown = computed(() => {
  return hasSeatBookings.value;
});

const minDate = computed(() => {
  const date = new Date('2026-05-20');
  return date.toISOString().split('T')[0];
});

const maxDate = computed(() => {
  const date = new Date('2026-06-10');
  return date.toISOString().split('T')[0];
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const fetchGownRequest = async () => {
  try {
    const response = await api.get('/gown-collection/my-collection');
    if (response.data.success && response.data.data.gownCollection) {
      gownRequest.value = response.data.data.gownCollection;
      selectedSize.value = gownRequest.value.size;
      scheduledDate.value = new Date(gownRequest.value.scheduledDate).toISOString().split('T')[0];
      notes.value = gownRequest.value.notes || '';
    }
  } catch (error) {
    console.log('No existing gown request');
  }
};

const checkSeatBookings = async () => {
  try {
    const response = await api.get('/seats/my-bookings');
    if (response.data.success) {
      const bookings = response.data.data.bookings || [];
      hasSeatBookings.value = bookings.length > 0;
    }
  } catch (error) {
    console.log('No seat bookings found');
    hasSeatBookings.value = false;
  }
};

const submitRequest = async () => {
  if (!selectedSize.value || !scheduledDate.value) {
    alert('Please select size and scheduled date');
    return;
  }

  isSubmitting.value = true;

  try {
    const requestData = {
      size: selectedSize.value,
      scheduledDate: scheduledDate.value,
      notes: notes.value,
      collectionLocation: 'Main Office - Building A, Room 101',
      depositAmount: 500000,
      depositPaid: false
    };

    let response;
    if (gownRequest.value) {
      response = await api.put('/gown-collection', requestData);
    } else {
      response = await api.post('/gown-collection', requestData);
    }

    if (response.data.success) {
      alert(gownRequest.value ? 'Collection details updated!' : 'Gown collection recorded successfully!');
      await fetchGownRequest();
      showForm.value = false;
    }
  } catch (error) {
    console.error('Error submitting request:', error);
    alert(error.response?.data?.message || 'Failed to submit request. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  checkSeatBookings();
  fetchGownRequest();
});
</script>
