<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pb-24">
    <!-- Premium Header -->
    <div class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between p-4 max-w-4xl mx-auto">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Payment</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">Complete your payment</p>
          </div>
        </div>
        <img src="@/assets/images/2022-Greenwich-Eng.webp" alt="University of Greenwich" class="h-10 object-contain" />
      </div>
    </div>

    <div class="p-4 max-w-4xl mx-auto">
      <!-- Payment Summary Card -->
      <div class="relative overflow-hidden rounded-3xl mb-6">
        <div class="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-purple-700"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div class="relative z-10 p-8 text-white">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span class="material-symbols-outlined text-3xl">payments</span>
            </div>
            <div>
              <p class="text-blue-100 text-sm">Total Amount</p>
              <p class="text-4xl font-black">{{ formatCurrency(totalAmount) }}</p>
            </div>
          </div>
          
          <!-- Payment Items Summary -->
          <div class="space-y-2">
            <div v-for="item in paymentItems" :key="item.id" class="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-lg">{{ item.icon }}</span>
                <span>{{ item.name }}</span>
              </div>
              <span class="font-bold">{{ formatCurrency(item.price) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method Selection -->
      <div class="glass-card p-6 mb-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">credit_card</span>
          Select Payment Method
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            v-for="method in paymentMethods" 
            :key="method.id"
            @click="selectedMethod = method.id"
            :class="[
              'relative p-6 rounded-2xl border-2 transition-all group',
              selectedMethod === method.id 
                ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]' 
                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
            ]"
          >
            <div class="flex flex-col items-center gap-3">
              <div :class="[
                'w-16 h-16 rounded-2xl flex items-center justify-center transition-all',
                selectedMethod === method.id ? method.activeBg : 'bg-gray-100 dark:bg-gray-800'
              ]">
                <span :class="[
                  'material-symbols-outlined text-3xl',
                  selectedMethod === method.id ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                ]">{{ method.icon }}</span>
              </div>
              <div class="text-center">
                <p :class="[
                  'font-bold',
                  selectedMethod === method.id ? 'text-primary' : 'text-gray-900 dark:text-white'
                ]">{{ method.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ method.description }}</p>
              </div>
            </div>
            
            <!-- Selected Indicator -->
            <div v-if="selectedMethod === method.id" class="absolute top-3 right-3">
              <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-sm">check</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- QR Payment Section -->
      <Transition name="scale-fade">
        <div v-if="selectedMethod === 'qr'" class="glass-card p-6 mb-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">qr_code_2</span>
            Scan QR Code to Pay
          </h3>
          
          <div class="flex flex-col items-center">
            <div class="relative mb-6">
              <div class="absolute -inset-4 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-3xl blur-xl"></div>
              <div class="relative bg-white p-6 rounded-2xl shadow-xl">
                <img :src="qrCodeUrl" alt="Payment QR Code" class="w-48 h-48" />
              </div>
            </div>
            
            <div class="text-center mb-6">
              <p class="text-gray-600 dark:text-gray-400 mb-2">Scan with your banking app</p>
              <p class="text-sm text-gray-500">Transaction will be verified automatically</p>
            </div>
            
            <div class="flex flex-wrap justify-center gap-4">
              <div class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <span class="material-symbols-outlined text-green-600">verified</span>
                <span class="text-sm font-semibold">VNPay</span>
              </div>
              <div class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <span class="material-symbols-outlined text-pink-600">verified</span>
                <span class="text-sm font-semibold">MoMo</span>
              </div>
              <div class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <span class="material-symbols-outlined text-blue-600">verified</span>
                <span class="text-sm font-semibold">ZaloPay</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Card Payment Section -->
      <Transition name="scale-fade">
        <div v-if="selectedMethod === 'card'" class="glass-card p-6 mb-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">credit_card</span>
            Card Details
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">credit_card</span>
                <input 
                  v-model="cardDetails.number"
                  type="text" 
                  placeholder="1234 5678 9012 3456"
                  class="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expiry Date</label>
                <input 
                  v-model="cardDetails.expiry"
                  type="text" 
                  placeholder="MM/YY"
                  class="w-full h-14 px-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">CVV</label>
                <input 
                  v-model="cardDetails.cvv"
                  type="text" 
                  placeholder="123"
                  class="w-full h-14 px-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cardholder Name</label>
              <input 
                v-model="cardDetails.name"
                type="text" 
                placeholder="NGUYEN VAN A"
                class="w-full h-14 px-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all uppercase"
              />
            </div>
          </div>
        </div>
      </Transition>

      <!-- Cash Payment Section -->
      <Transition name="scale-fade">
        <div v-if="selectedMethod === 'cash'" class="glass-card p-6 mb-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">payments</span>
            Cash Payment Instructions
          </h3>
          
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-amber-600 text-2xl">info</span>
              </div>
              <div>
                <h4 class="font-bold text-gray-900 dark:text-white mb-2">Pay at Finance Office</h4>
                <ul class="space-y-2 text-gray-600 dark:text-gray-400">
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm text-amber-600">location_on</span>
                    Room A105, Building A, FPT Greenwich
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm text-amber-600">schedule</span>
                    Mon - Fri: 8:00 AM - 5:00 PM
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm text-amber-600">confirmation_number</span>
                    Bring your Student ID card
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-semibold text-primary">Note:</span> Your booking will be reserved for 48 hours. 
              Please complete payment within this time to confirm your seats.
            </p>
          </div>
        </div>
      </Transition>

      <!-- Payment History -->
      <div class="glass-card p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">history</span>
            Payment History
          </h3>
          <span class="badge badge-info">{{ payments.length }} transactions</span>
        </div>
        
        <div v-if="payments.length === 0" class="text-center py-10">
          <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-4xl text-gray-400">receipt_long</span>
          </div>
          <p class="text-gray-500 dark:text-gray-400">No payment history yet</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="payment in payments" 
            :key="payment._id" 
            class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
          >
            <div class="flex items-center gap-4">
              <div :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center',
                payment.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' : 
                payment.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30' : 
                'bg-red-100 dark:bg-red-900/30'
              ]">
                <span :class="[
                  'material-symbols-outlined text-2xl',
                  payment.status === 'completed' ? 'text-green-600' : 
                  payment.status === 'pending' ? 'text-amber-600' : 
                  'text-red-600'
                ]">
                  {{ payment.status === 'completed' ? 'check_circle' : payment.status === 'pending' ? 'schedule' : 'cancel' }}
                </span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white">{{ payment.paymentType }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(payment.createdAt) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(payment.amount) }}</p>
              <span :class="[
                'text-xs font-semibold uppercase px-2 py-1 rounded-full',
                payment.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                payment.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              ]">
                {{ payment.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm Payment Button -->
      <button 
        @click="processPayment"
        :disabled="!selectedMethod || processing"
        class="w-full h-16 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        <div v-if="processing" class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <template v-else>
          <span class="material-symbols-outlined text-2xl">lock</span>
          <span>Pay {{ formatCurrency(totalAmount) }}</span>
        </template>
      </button>
      
      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        <span class="material-symbols-outlined text-sm align-middle">verified_user</span>
        Secured by 256-bit SSL encryption
      </p>
    </div>

    <!-- Payment Result Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showResultModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Transition name="scale-fade">
            <div v-if="showResultModal" class="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
              <!-- Success State -->
              <div v-if="paymentResult === 'success'" class="text-center p-8">
                <div class="relative inline-block mb-6">
                  <div class="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
                  <div class="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto">
                    <span class="material-symbols-outlined text-5xl text-white animate-bounce">check</span>
                  </div>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">Your payment has been processed successfully.</p>
                
                <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-6">
                  <div class="flex justify-between mb-2">
                    <span class="text-gray-500">Transaction ID</span>
                    <span class="font-mono font-bold text-gray-900 dark:text-white">{{ transactionId }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Amount</span>
                    <span class="font-bold text-green-600">{{ formatCurrency(totalAmount) }}</span>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <button @click="downloadReceipt" class="btn btn-glass">
                    <span class="material-symbols-outlined">download</span>
                    Receipt
                  </button>
                  <button @click="closeModal" class="btn btn-primary">
                    Done
                  </button>
                </div>
              </div>
              
              <!-- Failed State -->
              <div v-else class="text-center p-8">
                <div class="relative inline-block mb-6">
                  <div class="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
                  <div class="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto">
                    <span class="material-symbols-outlined text-5xl text-white">close</span>
                  </div>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Failed</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">{{ errorMessage }}</p>
                
                <div class="grid grid-cols-2 gap-4">
                  <button @click="closeModal" class="btn btn-glass">
                    Cancel
                  </button>
                  <button @click="retryPayment" class="btn btn-primary">
                    <span class="material-symbols-outlined">refresh</span>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const route = useRoute();

const selectedMethod = ref(null);
const processing = ref(false);
const showResultModal = ref(false);
const paymentResult = ref(null);
const transactionId = ref('');
const errorMessage = ref('');
const payments = ref([]);

const cardDetails = ref({
  number: '',
  expiry: '',
  cvv: '',
  name: ''
});

const paymentMethods = [
  { 
    id: 'card', 
    name: 'Bank Card', 
    description: 'Visa, Mastercard, JCB',
    icon: 'credit_card',
    activeBg: 'bg-gradient-to-br from-blue-500 to-blue-700'
  },
  { 
    id: 'qr', 
    name: 'QR Payment', 
    description: 'VNPay, MoMo, ZaloPay',
    icon: 'qr_code_2',
    activeBg: 'bg-gradient-to-br from-purple-500 to-purple-700'
  },
  { 
    id: 'cash', 
    name: 'Cash', 
    description: 'Pay at office',
    icon: 'payments',
    activeBg: 'bg-gradient-to-br from-green-500 to-green-700'
  },
];

const paymentItems = computed(() => {
  const items = [];
  // Get from route query or default items
  const bookingData = route.query;
  
  if (bookingData.gownRental) {
    items.push({ id: 'gown', name: 'Gown Rental', price: 500000, icon: 'checkroom' });
  }
  if (bookingData.photoPackage) {
    items.push({ id: 'photo', name: 'Photo Package', price: 300000, icon: 'photo_camera' });
  }
  if (bookingData.vipSeats) {
    const vipCount = parseInt(bookingData.vipSeats) || 0;
    if (vipCount > 0) {
      items.push({ id: 'vip', name: `VIP Seats x${vipCount}`, price: vipCount * 200000, icon: 'star' });
    }
  }
  if (bookingData.regularSeats) {
    const regularCount = parseInt(bookingData.regularSeats) || 0;
    if (regularCount > 0) {
      items.push({ id: 'regular', name: `Regular Seats x${regularCount}`, price: regularCount * 100000, icon: 'event_seat' });
    }
  }
  
  // Default items if no query params
  if (items.length === 0) {
    items.push(
      { id: 'gown', name: 'Gown Rental', price: 500000, icon: 'checkroom' },
      { id: 'photo', name: 'Photo Package', price: 300000, icon: 'photo_camera' }
    );
  }
  
  return items;
});

const totalAmount = computed(() => {
  return paymentItems.value.reduce((sum, item) => sum + item.price, 0);
});

const qrCodeUrl = computed(() => {
  // Generate a demo QR code URL
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=GREENWICH_PAY_${totalAmount.value}_${Date.now()}`;
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const processPayment = async () => {
  if (!selectedMethod.value) return;
  
  processing.value = true;
  
  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success/failure (90% success rate for demo)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      transactionId.value = 'TXN' + Date.now().toString().slice(-10);
      paymentResult.value = 'success';
      
      // Create payment record
      try {
        await api.post('/payments', {
          amount: totalAmount.value,
          paymentType: 'graduation_package',
          paymentMethod: selectedMethod.value,
          transactionId: transactionId.value,
          status: 'completed'
        });
      } catch (e) {
        console.log('Payment record creation skipped');
      }
    } else {
      paymentResult.value = 'failed';
      errorMessage.value = 'Transaction declined. Please check your payment details and try again.';
    }
    
    showResultModal.value = true;
  } catch (error) {
    paymentResult.value = 'failed';
    errorMessage.value = error.message || 'An error occurred during payment processing.';
    showResultModal.value = true;
  } finally {
    processing.value = false;
  }
};

const downloadReceipt = () => {
  // Trigger receipt download
  alert('Receipt download will be implemented');
};

const closeModal = () => {
  showResultModal.value = false;
  if (paymentResult.value === 'success') {
    router.push('/student');
  }
};

const retryPayment = () => {
  showResultModal.value = false;
  paymentResult.value = null;
};

const loadPaymentHistory = async () => {
  try {
    const response = await api.get('/payments/my-payments');
    if (response.data.success) {
      payments.value = response.data.data.payments || [];
    }
  } catch (error) {
    console.log('No payment history');
  }
};

onMounted(() => {
  loadPaymentHistory();
});
</script>

<style scoped>
.glass-card {
  @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl;
}

.btn {
  @apply h-12 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:scale-105;
}

.btn-glass {
  @apply bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
}

.badge {
  @apply px-3 py-1 rounded-full text-xs font-bold;
}

.badge-info {
  @apply bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400;
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.3s ease;
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
