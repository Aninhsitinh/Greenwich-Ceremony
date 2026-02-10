<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    page-title="Gown Collection"
  >
    <div class="w-full max-w-4xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="glass-card p-6 mb-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <span class="material-symbols-outlined text-4xl text-white">checkroom</span>
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Graduation Gown Collection</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Schedule your gown collection appointment</p>
          </div>
        </div>
      </div>

      <!-- Prerequisites Check -->
      <div v-if="!canRequestGown" class="glass-card p-6 mb-6 border-2 border-amber-500/30">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-2xl text-amber-500">lock</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">Complete Previous Steps First</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
              You need to complete seat booking before you can request gown collection.
            </p>
            <router-link to="/student/seat-booking" class="btn btn-primary">
              <span class="material-symbols-outlined">event_seat</span>
              Go to Seat Booking
            </router-link>
          </div>
        </div>
      </div>

      <!-- Existing Request -->
      <div v-else-if="gownRequest && !showForm" class="space-y-6">
        <!-- Status Card -->
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Your Gown Request</h2>
            <span :class="[
              'px-4 py-2 rounded-full text-sm font-semibold',
              gownRequest.status === 'collected' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
              gownRequest.status === 'scheduled' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
              gownRequest.status === 'returned' ? 'bg-gray-500/20 text-gray-600 dark:text-gray-400' :
              'bg-amber-500/20 text-amber-600 dark:text-amber-400'
            ]">
              {{ gownRequest.status.toUpperCase() }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-4 bg-white/5 rounded-xl">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Gown Size</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ gownRequest.size }}</p>
            </div>
            <div class="p-4 bg-white/5 rounded-xl">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Scheduled Date</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatDate(gownRequest.scheduledDate) }}</p>
            </div>
            <div class="p-4 bg-white/5 rounded-xl">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Collection Location</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ gownRequest.collectionLocation }}</p>
            </div>
            <div class="p-4 bg-white/5 rounded-xl">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Deposit</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{ gownRequest.depositPaid ? '✓ Paid' : formatCurrency(gownRequest.depositAmount) }}
              </p>
            </div>
          </div>

          <div v-if="gownRequest.notes" class="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</p>
            <p class="text-sm text-gray-900 dark:text-white">{{ gownRequest.notes }}</p>
          </div>

          <div v-if="gownRequest.status === 'scheduled'" class="mt-6 flex gap-3">
            <button @click="showForm = true" class="btn btn-secondary flex-1">
              <span class="material-symbols-outlined">edit</span>
              Update Request
            </button>
          </div>
        </div>

        <!-- Collection Instructions -->
        <div class="glass-card p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-500">info</span>
            Collection Instructions
          </h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <span class="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
              <span class="text-sm text-gray-600 dark:text-gray-300">Bring your student ID card</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
              <span class="text-sm text-gray-600 dark:text-gray-300">Deposit of 500,000₫ required (refundable upon return)</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
              <span class="text-sm text-gray-600 dark:text-gray-300">Gown must be returned within 3 days after ceremony</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
              <span class="text-sm text-gray-600 dark:text-gray-300">Office hours: Monday - Friday, 8:00 AM - 5:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Request Form -->
      <div v-else-if="canRequestGown" class="space-y-6">
        <!-- Size Selection -->
        <div class="glass-card p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Select Your Gown Size</h2>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <button
              v-for="size in gownSizes"
              :key="size.value"
              @click="selectedSize = size.value"
              :class="[
                'p-6 rounded-2xl border-2 transition-all duration-300',
                selectedSize === size.value
                  ? 'border-purple-500 bg-purple-500/20 scale-[1.02]'
                  : 'border-white/20 bg-white/5 hover:border-purple-500/50'
              ]"
            >
              <div class="text-3xl font-black text-gray-900 dark:text-white mb-2">{{ size.value }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ size.label }}</div>
            </button>
          </div>

          <!-- Size Guide -->
          <div class="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Size Guide:</strong> XS (150-160cm), S (160-165cm), M (165-170cm), L (170-175cm), XL (175-180cm), XXL (180cm+)
            </p>
          </div>
        </div>

        <!-- Schedule Date -->
        <div class="glass-card p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Schedule Collection Date</h2>
          
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Preferred Collection Date
            </label>
            <input
              v-model="scheduledDate"
              type="date"
              :min="minDate"
              :max="maxDate"
              class="w-full h-14 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div class="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <strong>Note:</strong> Collection available from May 20 to June 10, 2024. Please schedule at least 2 days before the ceremony.
            </p>
          </div>
        </div>

        <!-- Additional Notes -->
        <div class="glass-card p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Additional Notes (Optional)</h2>
          
          <textarea
            v-model="notes"
            rows="4"
            placeholder="Any special requests or notes..."
            class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        <!-- Deposit Information -->
        <div class="glass-card p-6 border-2 border-purple-500/30">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-2xl text-purple-500">account_balance_wallet</span>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">Deposit Required</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                A refundable deposit of <strong class="text-purple-600 dark:text-purple-400">500,000₫</strong> is required upon collection.
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Deposit will be fully refunded when you return the gown in good condition.
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex gap-4">
          <button
            v-if="gownRequest"
            @click="showForm = false"
            class="btn btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            @click="submitRequest"
            :disabled="!selectedSize || !scheduledDate || isSubmitting"
            class="btn btn-primary flex-1"
          >
            <div v-if="isSubmitting" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <template v-else>
              <span class="material-symbols-outlined">check_circle</span>
              {{ gownRequest ? 'Update Request' : 'Submit Request' }}
            </template>
          </button>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();

const navigation = [
  { path: '/student', icon: 'dashboard', label: 'Dashboard' },
  { path: '/student/registration', icon: 'how_to_reg', label: 'Registration' },
  { path: '/student/ticket', icon: 'confirmation_number', label: 'My Ticket' },
  { path: '/student/seat-booking', icon: 'event_seat', label: 'Seat Booking' },
  { path: '/student/payment', icon: 'payments', label: 'Payment' },
  { path: '/student/notifications', icon: 'notifications', label: 'Notifications' },
  { path: '/student/profile', icon: 'person', label: 'Profile' },
  { path: '/student/gown-collection', icon: 'checkroom', label: 'Gown Collection' },
  { path: '/student/help', icon: 'help', label: 'Help & Support' },
  { path: '/student/settings', icon: 'settings', label: 'Settings' }
];

const bottomNavigation = [
  { path: '/student', icon: 'home', label: 'Home' },
  { path: '/student/ticket', icon: 'confirmation_number', label: 'Ticket' },
  { path: '/student/seat-booking', icon: 'event_seat', label: 'Seats' },
  { path: '/student/notifications', icon: 'notifications', label: 'Alerts' },
  { path: '/student/profile', icon: 'person', label: 'Profile' }
];

const gownRequest = ref(null);
const selectedSize = ref('');
const scheduledDate = ref('');
const notes = ref('');
const isSubmitting = ref(false);
const showForm = ref(false);

const gownSizes = [
  { value: 'XS', label: '150-160cm' },
  { value: 'S', label: '160-165cm' },
  { value: 'M', label: '165-170cm' },
  { value: 'L', label: '170-175cm' },
  { value: 'XL', label: '175-180cm' },
  { value: 'XXL', label: '180cm+' }
];

const canRequestGown = computed(() => {
  return authStore.user?.journeyStatus?.seatsBooked || false;
});

const minDate = computed(() => {
  const date = new Date('2024-05-20');
  return date.toISOString().split('T')[0];
});

const maxDate = computed(() => {
  const date = new Date('2024-06-10');
  return date.toISOString().split('T')[0];
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const fetchGownRequest = async () => {
  try {
    const response = await api.get('/gown/my-request');
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

const submitRequest = async () => {
  if (!selectedSize.value || !scheduledDate.value) {
    alert('Please select size and scheduled date');
    return;
  }

  isSubmitting.value = true;

  try {
    const data = {
      size: selectedSize.value,
      scheduledDate: scheduledDate.value,
      notes: notes.value
    };

    if (gownRequest.value) {
      // Update existing request
      await api.put(`/gown/${gownRequest.value._id}`, data);
      alert('Gown request updated successfully!');
    } else {
      // Create new request
      await api.post('/gown/request', data);
      alert('Gown request submitted successfully!');
    }

    showForm.value = false;
    await fetchGownRequest();
  } catch (error) {
    console.error('Error submitting gown request:', error);
    alert(error.response?.data?.message || 'Failed to submit request. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchGownRequest();
});
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
}

.btn {
  @apply h-14 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2;
}

.btn-primary {
  @apply bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-white/10 text-gray-900 dark:text-white hover:bg-white/20;
}
</style>
