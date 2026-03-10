<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
    <!-- Sticky Top Navigation -->
    <div class="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 md:px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link to="/staff" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center">
           <span class="material-symbols-outlined">arrow_back</span>
        </router-link>
        <h1 class="text-xl font-black text-gray-900 dark:text-white">Finance Management</h1>
      </div>
    </div>

    <!-- Main Content Flow -->
    <div class="w-full px-4 md:px-8 py-6 space-y-6">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 lg:p-10 shadow-2xl text-white">
        <div class="absolute inset-0">
          <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border-2 border-white/30">
              <span class="material-symbols-outlined text-4xl">payments</span>
            </div>
            <div>
              <p class="text-white/80 text-sm font-semibold uppercase tracking-wider">Financial Administration</p>
              <h1 class="text-4xl font-black">Deposit Refunds</h1>
            </div>
          </div>
          <p class="text-white/90 text-lg max-w-2xl">Manage and confirm deposit returns (Back Phí) for graduated students</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
              <span class="material-symbols-outlined">group</span>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Confirmed Students</p>
              <p class="text-2xl font-black text-gray-900 dark:text-white">{{ refundData.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
              <span class="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Successfully Refunded</p>
              <p class="text-2xl font-black text-emerald-600">{{ refundedCount }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
              <span class="material-symbols-outlined">pending_actions</span>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Refunds</p>
              <p class="text-2xl font-black text-orange-600">{{ pendingCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-emerald-500">search</span>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search student ID or name..."
              class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:border-emerald-500 focus:bg-white transition-all text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <select 
              v-model="filterStatus"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:border-emerald-500 transition-all text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Refund</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div class="flex items-center gap-4">
            <input type="file" ref="paymentImportInput" class="hidden" accept=".xlsx, .xls" @change="handlePaymentImport">
            <button 
              @click="$refs.paymentImportInput.click()"
              :disabled="importingPayments"
              class="px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              <span v-if="importingPayments" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span class="material-symbols-outlined text-lg" v-else>upload_file</span>
              Import Payments
            </button>
            <button 
              @click="handleBulkRefund"
              :disabled="selectedIds.length === 0 || processing"
              class="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined">payments</span>
              Bulk Refund ({{ selectedIds.length }})
            </button>
          </div>
        </div>
      </div>

      <!-- Refund Table -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th class="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    @change="toggleSelectAll"
                    :checked="isAllSelected"
                    class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Student</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Refund Date</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr 
                v-for="reg in filteredRefunds" 
                :key="reg.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                :class="{'opacity-50': processingId === reg.id}"
              >
                <td class="px-6 py-4">
                  <input 
                    v-if="!reg.isDepositRefunded"
                    type="checkbox" 
                    v-model="selectedIds" 
                    :value="reg.id"
                    class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
                <td class="px-6 py-4 text-center">
                  <span 
                    class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                    :class="reg.isDepositRefunded ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'"
                  >
                    {{ reg.isDepositRefunded ? 'Refunded' : 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="font-bold text-gray-900 dark:text-white">{{ reg.user?.fullName }}</p>
                    <p class="text-xs text-gray-500 font-mono">{{ reg.user?.studentId }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="font-black text-gray-900 dark:text-white" v-if="reg.isDepositRefunded">
                    {{ formatCurrency(reg.refundAmount) }}
                  </p>
                  <p v-else-if="reg.refundableAmount > 0" class="font-black text-blue-600 dark:text-blue-400">
                    {{ formatCurrency(reg.refundableAmount) }}
                  </p>
                  <p v-else class="text-gray-400 italic">No deposit found</p>
                </td>
                <td class="px-6 py-4">
                  <p v-if="reg.refundDate" class="text-xs text-gray-600 dark:text-gray-400">
                    {{ formatDate(reg.refundDate) }}
                  </p>
                  <p v-else class="text-[10px] text-gray-400">N/A</p>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="openInvoiceModal(reg)"
                      class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Invoice"
                    >
                      <span class="material-symbols-outlined">receipt_long</span>
                    </button>
                    <button 
                      v-if="!reg.isDepositRefunded"
                      @click="processSingleRefund(reg)"
                      :disabled="processingId === reg.id"
                      class="px-4 py-2 bg-emerald-600 text-white text-xs font-black rounded-lg hover:scale-105 transition-all shadow-md"
                    >
                      Confirm
                    </button>
                    <span v-else class="text-emerald-500 font-black text-xs">COMPLETE</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Invoice Detail Modal -->
    <div v-if="showInvoiceModal && selectedRegForInvoice" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showInvoiceModal = false"></div>
      <div class="relative bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg p-8 shadow-2xl overflow-hidden">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
        
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white">Payment Invoice</h3>
              <p class="text-gray-500 font-medium">Student: {{ selectedRegForInvoice.user.fullName }}</p>
            </div>
            <button @click="showInvoiceModal = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-500">Student ID</span>
                <span class="font-bold font-mono">{{ selectedRegForInvoice.user.studentId }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Major</span>
                <span class="font-bold">{{ selectedRegForInvoice.user.major || 'N/A' }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-black uppercase tracking-widest text-gray-400">Payment Records</h4>
              <div v-if="selectedRegForInvoice.user.payments.length === 0" class="text-center py-4 text-gray-400 italic text-sm">
                No payment records found
              </div>
              <div 
                v-for="payment in selectedRegForInvoice.user.payments" 
                :key="payment.id"
                class="p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-indigo-300 transition-colors"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded uppercase">Graduation Package</span>
                  <span class="font-black text-gray-900 dark:text-white">{{ formatCurrency(payment.amount) }}</span>
                </div>
                <div class="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <p class="text-gray-400 uppercase font-bold text-[9px]">Transaction ID</p>
                    <p class="font-mono text-gray-700 dark:text-gray-300">{{ payment.transactionId }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-gray-400 uppercase font-bold text-[9px]">Payment Date</p>
                    <p class="text-gray-700 dark:text-gray-300">{{ formatDate(payment.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase">Total Reflective Deposit</p>
                <p class="text-2xl font-black text-indigo-600">{{ formatCurrency(selectedRegForInvoice.refundableAmount) }}</p>
              </div>
              <button 
                @click="showInvoiceModal = false"
                class="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-sm hover:scale-105 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '@/services/api';
import { useToast } from 'vue-toastification';

const { t } = useI18n();
const toast = useToast();

const refundData = ref([]);
const loading = ref(true);
const processing = ref(false);
const importingPayments = ref(false);
const paymentImportInput = ref(null);
const processingId = ref(null);
const searchQuery = ref('');
const filterStatus = ref('all');
const selectedIds = ref([]);
const showInvoiceModal = ref(false);
const selectedRegForInvoice = ref(null);

const refundedCount = computed(() => refundData.value.filter(r => r.isDepositRefunded).length);
const pendingCount = computed(() => refundData.value.filter(r => !r.isDepositRefunded).length);

const filteredRefunds = computed(() => {
  let filtered = refundData.value;
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r => 
      r.user?.fullName?.toLowerCase().includes(q) || 
      r.user?.studentId?.toLowerCase().includes(q)
    );
  }
  
  if (filterStatus.value === 'pending') {
    filtered = filtered.filter(r => !r.isDepositRefunded);
  } else if (filterStatus.value === 'refunded') {
    filtered = filtered.filter(r => r.isDepositRefunded);
  }
  
  return filtered;
});

const isAllSelected = computed(() => {
  const pendingIds = filteredRefunds.value.filter(r => !r.isDepositRefunded).map(r => r.id);
  return pendingIds.length > 0 && pendingIds.every(id => selectedIds.value.includes(id));
});

const toggleSelectAll = (event) => {
  const pendingIds = filteredRefunds.value.filter(r => !r.isDepositRefunded).map(r => r.id);
  if (event.target.checked) {
    selectedIds.value = [...new Set([...selectedIds.value, ...pendingIds])];
  } else {
    selectedIds.value = selectedIds.value.filter(id => !pendingIds.includes(id));
  }
};

const loadRefundData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/finance/refunds');
    if (response.data.success) {
      refundData.value = response.data.data;
    }
  } catch (error) {
    console.error('Error loading finance data:', error);
    toast.error('Failed to load refund records');
  } finally {
    loading.value = false;
  }
};

const openInvoiceModal = (reg) => {
  selectedRegForInvoice.value = reg;
  showInvoiceModal.value = true;
};

const processSingleRefund = async (reg) => {
  processingId.value = reg.id;
  try {
    const response = await api.patch(`/finance/refund/${reg.id}`, {
      refundAmount: reg.refundableAmount || 0
    });
    
    if (response.data.success) {
      const index = refundData.value.findIndex(r => r.id === reg.id);
      if (index !== -1) {
        refundData.value[index] = { ...refundData.value[index], ...response.data.data };
      }
      toast.success('Refund processed successfully');
    }
  } catch (error) {
    console.error('Error processing refund:', error);
    toast.error('Failed to process refund');
  } finally {
    processingId.value = null;
  }
};

const handleBulkRefund = async () => {
  processing.value = true;
  try {
    const response = await api.post('/finance/refund/bulk', {
      registrationIds: selectedIds.value
      // Backend will calculate for each or we could pass a mapping, but for now simple bulk using internal calculation is better or we just don't pass amount and let backend handle it
    });
    
    if (response.data.success) {
      toast.success(`Successfully processed ${selectedIds.value.length} refunds`);
      selectedIds.value = [];
      await loadRefundData();
    }
  } catch (error) {
    console.error('Error bulk refunding:', error);
    toast.error('Failed to process bulk refunds');
  } finally {
    processing.value = false;
  }
};

const handlePaymentImport = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  importingPayments.value = true;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/import/payments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (response.data.success) {
      toast.success(response.data.message);
      await loadRefundData();
    }
  } catch (error) {
    console.error('Error importing payments:', error);
    toast.error(error.response?.data?.message || 'Failed to import payments');
  } finally {
    importingPayments.value = false;
    if (event.target) event.target.value = '';
  }
};

const formatCurrency = (amt) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amt);
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
};

onMounted(() => {
  loadRefundData();
});
</script>
