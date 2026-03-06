<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('student.payment_title')"
  >
    <div class="w-full max-w-4xl mx-auto px-4 py-6">
      <!-- Info Banner -->
      <div class="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 text-center">
        <span class="material-symbols-outlined text-4xl text-blue-600 dark:text-blue-400 mb-2">payments</span>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Payment Portal</h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-4">
          Please use the Booking Confirmation page to view your summary and complete payments for your tickets and gown rental.
        </p>
        <router-link to="/student/booking-confirmation" class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold hover:opacity-90 transition-opacity">
          Go to Booking Confirmation
          <span class="material-symbols-outlined">arrow_forward</span>
        </router-link>
      </div>

      <!-- Payment History (Read Only) -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
           <h3 class="font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        
        <div v-if="loading" class="p-12 text-center">
           <div class="w-8 h-8 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>

        <div v-else-if="payments.length === 0" class="p-12 text-center">
           <span class="material-symbols-outlined text-gray-300 dark:text-gray-600 text-4xl mb-2">receipt_long</span>
           <p class="text-gray-500">No payment history found</p>
        </div>

        <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="payment in payments" :key="payment.id || payment._id" class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
             <div class="flex items-center gap-4">
                <div :class="[
                   'w-10 h-10 rounded-lg flex items-center justify-center',
                   payment.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-600'
                ]">
                   <span class="material-symbols-outlined">{{ payment.status === 'completed' ? 'check' : 'schedule' }}</span>
                </div>
                <div>
                  <p class="font-bold text-gray-900 dark:text-white">{{ payment.paymentType }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(payment.createdAt) }} • {{ payment.transactionId }}</p>
                </div>
             </div>
             <span class="font-mono font-bold text-gray-900 dark:text-white">{{ formatCurrency(payment.amount) }}</span>
          </div>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

const router = useRouter();
const { t } = useI18n();
const payments = ref([]);
const loading = ref(true);

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

const loadPaymentHistory = async () => {
  loading.value = true;
  try {
    const response = await api.get('/payments/my-payments');
    if (response.data.success) {
      payments.value = response.data.data.payments || [];
    }
  } catch (error) {
    console.log('No payment history');
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB');
};

onMounted(() => {
  loadPaymentHistory();
});
</script>
