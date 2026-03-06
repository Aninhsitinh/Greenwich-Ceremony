<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">receipt_long</span>
            Payment Records
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Transaction history for {{ user.fullName }} ({{ user.studentId }})
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="flex justify-center p-12">
            <Loading />
        </div>
        
        <div v-else-if="payments.length === 0" class="text-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
            <span class="material-symbols-outlined text-5xl text-gray-400 mb-3">account_balance_wallet</span>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">No Payment History</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">This user has not generated any invoices yet.</p>
        </div>

        <div v-else class="space-y-6">
            <div v-for="payment in payments" :key="payment._id" class="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:border-primary/30 transition-colors">
                
                <!-- Payment Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <div class="flex items-center gap-3">
                            <span class="font-bold text-gray-900 dark:text-white text-lg">
                                Invoice #{{ payment.transactionId ? payment.transactionId.slice(-6).toUpperCase() : payment._id.toString().slice(-6).toUpperCase() }}
                            </span>
                            <span :class="[
                                'px-3 py-1 text-xs font-bold rounded-full',
                                {
                                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': payment.status === 'completed',
                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': payment.status === 'pending',
                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': payment.status === 'failed' || payment.status === 'refunded'
                                }
                            ]">
                                {{ payment.status.toUpperCase() }}
                            </span>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Generated on {{ formatDateTime(payment.createdAt) }}
                        </p>
                    </div>
                    <div class="text-left sm:text-right">
                        <p class="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ formatCurrency(payment.amount) }}</p>
                    </div>
                </div>

                <!-- Payment Details Grid -->
                <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <!-- Line Items -->
                    <div>
                        <h4 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Line Items</h4>
                        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-gray-700">
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-gray-600 dark:text-gray-300">Registration Fee ({{ payment.ticketType?.toUpperCase() || 'STUDENT' }})</span>
                                <span class="font-bold text-gray-900 dark:text-white">
                                    {{ formatCurrency(payment.ticketType === 'adult' ? 100 : (payment.ticketType === 'child' ? 50 : 0)) }}
                                </span>
                            </div>
                            
                            <!-- Detailed Breakdown Extracted from Amount -->
                            <div v-if="payment.amount > 0" class="flex justify-between items-center text-sm">
                                <span class="text-gray-600 dark:text-gray-300">Base Cost</span>
                                <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(payment.amount) }}</span>
                            </div>
                            
                            <hr class="border-gray-200 dark:border-gray-700 my-2" />
                            <div class="flex justify-between items-center font-bold">
                                <span class="text-gray-900 dark:text-white">Total</span>
                                <span class="text-emerald-600 dark:text-emerald-400">{{ formatCurrency(payment.amount) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Metadata -->
                    <div>
                        <h4 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Transaction Details</h4>
                        <ul class="space-y-3 text-sm">
                            <li class="flex items-center justify-between">
                                <span class="text-gray-500 dark:text-gray-400">Transaction ID</span>
                                <span class="font-mono text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ payment.transactionId || payment._id }}</span>
                            </li>
                            <li class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                                <span class="text-gray-500 dark:text-gray-400">Payment Method</span>
                                <span class="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[16px]">account_balance</span>
                                    {{ payment.paymentMethod || 'Bank Transfer' }}
                                </span>
                            </li>
                            <li class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3" v-if="payment.paidAt">
                                <span class="text-gray-500 dark:text-gray-400">Processed At</span>
                                <span class="font-medium text-gray-900 dark:text-white">{{ formatDateTime(payment.paidAt) }}</span>
                            </li>
                            <li class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3" v-if="payment.registrationId">
                                <span class="text-gray-500 dark:text-gray-400">Linked Registration</span>
                                <span class="font-medium text-primary hover:underline cursor-pointer" @click="viewRegistration(payment.registrationId)">View Registration &rarr;</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { formatCurrency, formatDateTime } from '@/utils/helpers';
import Loading from '@/components/Loading.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);

const router = useRouter();
const toast = useToast();
const loading = ref(true);
const payments = ref([]);

const loadPayments = async () => {
    loading.value = true;
    try {
        const response = await api.get(`/staff/students/${props.user._id}/payments`);
        if (response.data.success) {
            payments.value = response.data.data.payments;
        }
    } catch (error) {
        console.error('Failed to load user payments:', error);
        toast.error('Could not load specific payment invoices for this user.');
    } finally {
        loading.value = false;
    }
};

const viewRegistration = (reg) => {
    router.push('/staff/student-list'); // Redirect to student list in staff portal
};

onMounted(() => {
    loadPayments();
});
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
