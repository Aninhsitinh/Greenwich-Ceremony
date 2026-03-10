<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('student.payment_title')"
  >
    <div class="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      <!-- Back Button -->
      <div class="flex items-center justify-between">
        <button @click="$router.push('/student/dashboard')" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
          <span class="text-sm font-semibold">Back to Dashboard</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div class="w-10 h-10 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400 font-medium">Loading details...</p>
      </div>

      <!-- Main Content -->
      <div v-else class="grid lg:grid-cols-3 gap-6">
        <!-- Order Summary -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <span class="material-symbols-outlined text-gray-400">receipt_long</span>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Booking Summary</h2>
            </div>

            <div class="p-6">
              <!-- Empty State -->
              <div v-if="!gownCollection && seatBookings.length === 0" class="text-center py-8">
                <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                  <span class="material-symbols-outlined text-gray-400 text-3xl">shopping_cart_off</span>
                </div>
                <p class="text-gray-500 dark:text-gray-400 mb-6">No items to pay for</p>
                <router-link to="/student/dashboard" class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold transition-all">
                  Go to Dashboard
                </router-link>
              </div>

              <div v-else class="space-y-4">
                <!-- Gown Rental -->
                <div v-if="gownCollection" class="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 flex items-center justify-center">
                      <span class="material-symbols-outlined text-xl">checkroom</span>
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900 dark:text-white">Graduation Gown Rental</h3>
                      <p class="text-sm text-gray-500">Size: {{ gownCollection.size }} • Scheduled</p>
                    </div>
                  </div>
                  <span class="font-bold text-gray-900 dark:text-white">500,000₫</span>
                </div>

                <!-- Seat Bookings -->
                <div v-for="(seat, index) in seatBookings" :key="seat.id || seat._id" class="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                  <div class="flex items-center gap-4">
                    <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', getSeatTypeColor(seat)]">
                      <span class="material-symbols-outlined text-xl">{{ getSeatTypeIcon(seat) }}</span>
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900 dark:text-white">Guest Seat Ticket</h3>
                      <p class="text-sm text-gray-500">Seat {{ seat.seatNumber }} • {{ seat.guestName || `Guest ${index + 1}` }}</p>
                    </div>
                  </div>
                  <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(getSeatPrice(seat)) }}</span>
                </div>
              </div>
            </div>

            <!-- Total Footer -->
            <div v-if="totalAmount > 0" class="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-gray-900 dark:text-white">Total Amount</span>
                <span class="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {{ formatCurrency(totalAmount) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Actions -->
        <div class="lg:col-span-1">
          <div v-if="totalAmount > 0 && !paymentCompleted" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <h3 class="font-bold text-gray-900 dark:text-white mb-4">Complete Payment</h3>
            <p class="text-sm text-gray-500 mb-6">Proceed to our secure gateway to choose your payment method.</p>
            
            <button 
              @click="navigateToGateway"
              class="w-full py-4 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] shadow-lg"
            >
              <span>Pay {{ formatCurrency(totalAmount) }}</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <!-- Successful Payment State -->
          <div v-if="paymentCompleted" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center sticky top-24 animate-fade-in">
            <div class="w-16 h-16 rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-3xl">check</span>
            </div>
            
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful
            </h2>
            <p class="text-gray-500 dark:text-gray-400 mb-6">
              Your booking is confirmed.
            </p>

            <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6 text-sm">
              <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-500">Transaction ID</span>
                <span class="font-mono font-bold text-gray-900 dark:text-white">{{ transactionId }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-gray-500">Amount Paid</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(paidAmount || totalAmount) }}</span>
              </div>
            </div>

            <button @click="$router.push('/student/dashboard')" class="w-full py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { t } = useI18n();

const loading = ref(true);
const gownCollection = ref(null);
const seatBookings = ref([]);
const paymentCompleted = ref(false);
const transactionId = ref('');
const paidAmount = ref(0);

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

const loadBookingData = async () => {
  loading.value = true;
  try {
    try {
      const gownRes = await api.get('/gown-collection/my-collection');
      if (gownRes.data.success && gownRes.data.data.gownCollection) {
        gownCollection.value = gownRes.data.data.gownCollection;
      }
    } catch (err) {
      console.log('No gown collection found');
    }

    try {
      const seatsRes = await api.get('/seats/my-bookings');
      if (seatsRes.data.success) {
        seatBookings.value = seatsRes.data.data.bookings || [];
      }
    } catch (err) {
      console.log('No seat bookings found');
    }

    // Check for existing successful payments
    try {
        const paymentRes = await api.get('/payments/my-payments');
        if (paymentRes.data.success && paymentRes.data.data.payments.length > 0) {
            const completedPayment = paymentRes.data.data.payments.find(p => p.status === 'completed');
            if (completedPayment) {
                paymentCompleted.value = true;
     localStorage.removeItem('current_txn_id');
                transactionId.value = completedPayment.transactionId;
                paidAmount.value = completedPayment.amount;
            }
        }
    } catch (err) {
        console.log('Error checking payment status');
    }
  } finally {
    loading.value = false;
  }
};

const getSeatPrice = (seat) => {
  return 100000;
};

const getSeatTypeColor = (seat) => {
  return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
};

const getSeatTypeIcon = (seat) => {
  return 'event_seat';
};

const totalAmount = computed(() => {
  let total = 0;
  if (gownCollection.value) {
    total += 500000;
  }
  seatBookings.value.forEach(seat => {
    total += getSeatPrice(seat);
  });
  return total;
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};



const navigateToGateway = () => {
    console.log('Navigating to gateway with amount:', totalAmount.value);
    
    if (!transactionId.value) {
        transactionId.value = (function() { let s = localStorage.getItem('current_txn_id'); if (!s) { s = 'TXN-' + (authStore.user?.studentId || Date.now().toString().slice(-8)); localStorage.setItem('current_txn_id', s); } return s; })();
    }
    
    router.push({
        name: 'StudentPaymentGateway',
        query: {
            amount: totalAmount.value,
            transactionId: transactionId.value
        }
    });
};

onMounted(async () => {
  await loadBookingData();
  
  // Check for Transaction ID from query (persistence)
  if (route.query.transactionId) {
     transactionId.value = route.query.transactionId;
  } else if (!transactionId.value) {
     // Initialize new if not present
     transactionId.value = (function() { let s = localStorage.getItem('current_txn_id'); if (!s) { s = 'TXN-' + (authStore.user?.studentId || Date.now().toString().slice(-8)); localStorage.setItem('current_txn_id', s); } return s; })();
  }

  // Check for return from Payment Gateway (Success)
  if (route.query.status === 'success' && route.query.transactionId) {
     paymentCompleted.value = true;
     localStorage.removeItem('current_txn_id');
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
