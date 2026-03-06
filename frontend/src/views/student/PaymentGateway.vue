<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <div class="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] animate-fade-in">
      
      <!-- Left Side: Order Info -->
      <div :class="['w-full lg:w-1/3 p-8 text-white flex flex-col justify-between relative overflow-hidden transition-colors duration-500', providerColor]">
        <!-- Decorative Background -->
        <div class="absolute top-[-50px] left-[-50px] w-32 h-32 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-[-20px] right-[-20px] w-48 h-48 rounded-full bg-white opacity-10"></div>
        
        <div class="relative z-10">
          <div class="h-10 mb-8 flex items-center gap-2">
             <span class="material-symbols-outlined text-3xl">lock</span>
             <span class="font-bold text-xl tracking-wider">SECURE PAY</span>
          </div>
          <h1 class="text-3xl font-bold mb-2">Checkout</h1>
          <p class="opacity-90 text-sm">Complete your payment to finalize registration.</p>
        </div>

        <div class="relative z-10 space-y-6">
          <div>
            <p class="text-xs uppercase tracking-wider opacity-75 mb-1">Total Amount</p>
            <p class="text-4xl font-black tracking-tight">{{ formatCurrency(amount) }}</p>
          </div>
          
          <div class="space-y-3 text-sm opacity-90 border-t border-white/20 pt-4">
             <div class="flex justify-between">
                <span>Order ID</span>
                <span class="font-mono">{{ transactionId }}</span>
             </div>
             <div class="flex justify-between">
                <span>Description</span>
                <span>Graduation Package</span>
             </div>
          </div>
        </div>

        <div class="relative z-10 text-xs opacity-70 mt-auto pt-8">
          <p>&copy; 2026 Stitch Ceremony. All rights reserved.</p>
        </div>
      </div>

      <!-- Right Side: Payment Methods -->
      <div class="w-full lg:w-2/3 bg-white dark:bg-gray-800 flex flex-col relative">
         <!-- Header -->
         <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Select Payment Method</h2>
            <button @click="cancelPayment" class="text-sm text-gray-500 hover:text-red-500 transition-colors">Cancel</button>
         </div>

         <!-- Method Tabs -->
         <div class="flex border-b border-gray-100 dark:border-gray-700">
            <button 
               v-for="method in paymentMethods" 
               :key="method.id"
               @click="selectedMethod = method.id"
               :class="['flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 relative', selectedMethod === method.id ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50']"
            >
               <span class="material-symbols-outlined text-lg">{{ method.icon }}</span>
               {{ method.name }}
               <div v-if="selectedMethod === method.id" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></div>
            </button>
         </div>

         <!-- Content Area -->
         <div class="flex-1 p-8 overflow-y-auto">
            
            <!-- E-Wallet Section -->
            <div v-if="selectedMethod === 'wallet'" class="space-y-6">
               <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">You will be redirected to the selected wallet app or website to complete payment.</p>
               <div class="grid grid-cols-2 gap-4">
                  <button @click="redirectPayment('momo')" class="group p-4 border rounded-xl hover:border-[#a50064] hover:bg-[#a50064]/5 transition-all text-left flex flex-col gap-3">
                     <img :src="momoLogo" class="h-8 w-8 object-contain rounded-lg" alt="MoMo">
                     <div>
                        <p class="font-bold text-gray-900 dark:text-white group-hover:text-[#a50064]">MoMo Wallet</p>
                        <p class="text-xs text-gray-500">Fast & Secure</p>
                     </div>
                  </button>
                  <button @click="redirectPayment('vnpay')" class="group p-4 border rounded-xl hover:border-[#005ba3] hover:bg-[#005ba3]/5 transition-all text-left flex flex-col gap-3">
                     <img :src="vnpayLogo" class="h-8 w-auto object-contain rounded-lg" alt="VNPay">
                     <div>
                        <p class="font-bold text-gray-900 dark:text-white group-hover:text-[#005ba3]">VNPay QR</p>
                        <p class="text-xs text-gray-500">Scan & Pay</p>
                     </div>
                  </button>
               </div>
            </div>

            <!-- Bank Transfer Section -->
            <div v-else-if="selectedMethod === 'bank_transfer'" class="space-y-6">
               <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Select your bank to proceed with direct transfer.</p>
               <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <button 
                     v-for="bank in banks" 
                     :key="bank.code"
                     @click="selectedBank = bank.code"
                     :class="['p-3 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all h-24', selectedBank === bank.code ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700']"
                  >
                     <img v-if="bank.logo" :src="bank.logo" class="h-8 w-auto object-contain" :alt="bank.code" />
                     <div v-else class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        {{ bank.code }}
                     </div>
                     <span class="text-[10px] font-medium text-center text-gray-700 dark:text-gray-300">{{ bank.name }}</span>
                  </button>
               </div>

               <div class="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                  <button 
                     @click="redirectPayment('bank_transfer')" 
                     :disabled="!selectedBank"
                     class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                  >
                     <span>Proceed with {{ banks.find(b => b.code === selectedBank)?.name || 'Transfer' }}</span>
                     <span class="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
               </div>
            </div>

            <!-- Credit/Debit Card Section -->
            <div v-else-if="selectedMethod === 'card'" class="space-y-6">
               <!-- Card Type Selection -->
               <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Type</label>
                  <div class="flex gap-3">
                     <button 
                        v-for="type in cardTypes" 
                        :key="type.id"
                        @click="cardForm.type = type.id"
                        :class="['flex-1 py-3 text-xs font-bold uppercase rounded-lg border transition-all flex items-center justify-center gap-2', cardForm.type === type.id ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600']"
                     >  
                        <img v-if="type.logo" :src="type.logo" class="h-6 w-auto object-contain" />
                        <span v-else>{{ type.name }}</span>
                     </button>
                  </div>
               </div>

               <!-- Card Form -->
               <div class="space-y-4 animate-fade-in">
                  <div>
                     <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                     <div class="relative">
                        <input type="text" v-model="cardForm.number" placeholder="0000 0000 0000 0000" class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:font-mono" />
                        <span class="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">credit_card</span>
                        <img v-if="cardForm.type === 'visa'" :src="visaLogo" class="absolute right-3 top-2.5 h-5 w-auto" />
                        <img v-if="cardForm.type === 'mastercard'" :src="mastercardLogo" class="absolute right-3 top-2.5 h-5 w-auto" />
                     </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                        <input type="text" v-model="cardForm.expiry" placeholder="MM/YY" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:font-mono text-center" />
                     </div>
                     <div>
                        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">CVV/CVC</label>
                        <div class="relative">
                           <input type="text" v-model="cardForm.cvv" placeholder="123" class="w-full pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:font-mono text-center" />
                           <span class="material-symbols-outlined absolute right-3 top-2.5 text-gray-400 text-lg cursor-help" title="3-digit code on back">help</span>
                        </div>
                     </div>
                  </div>

                  <div>
                     <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Cardholder Name</label>
                     <input type="text" v-model="cardForm.name" placeholder="NGUYEN VAN A" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase" />
                  </div>
               </div>

               <div class="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button 
                     @click="processCardPayment" 
                     :disabled="isProcessing"
                     class="w-full py-3 bg-gray-900 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                  >
                     <div v-if="isProcessing" class="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                     <span>{{ isProcessing ? 'Processing Payment...' : `Pay ${formatCurrency(amount)}` }}</span>
                  </button>
               </div>
            </div>

         </div>
         
         <!-- Redirecting Overlay -->
         <div v-if="isRedirecting" class="absolute inset-0 z-20 bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
            <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Redirecting...</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">Connecting to {{ redirectTarget }} Gateway</p>
         </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Import Logos
import momoLogo from '@/assets/images/MOMO-Logo-App.png';
import vnpayLogo from '@/assets/images/vnpay-logo-vinadesign-25-12-59-16.jpg';
import bidvLogo from '@/assets/images/logo-bidv-20220426071253.jpg';
import acbLogo from '@/assets/images/thumbnail-logo-ACB.jpg';
import mbLogo from '@/assets/images/013-Logo-PNG-FILE-NganHang-MB-Bank.jpg';
import visaLogo from '@/assets/images/visa-logo-preview.png';
import mastercardLogo from '@/assets/images/mastercard-new-logo-content-2019.webp';
import techcombankLogo from '@/assets/images/thumbnail-logo-techcombank.jpg';
import vpbankLogo from '@/assets/images/vpbank-logo.png';
import tpbankLogo from '@/assets/images/thebank_logotpbank_1588408748.jpg';
import msbLogo from '@/assets/images/msb-logo-vector-16-e1717748748425.png';
import napasLogo from '@/assets/images/images.png'; // Placeholder based on filenames
import vcbLogo from '@/assets/images/vietcombank.png';

const route = useRoute();
const router = useRouter();

const selectedMethod = ref('wallet');
const selectedBank = ref(null);
const isProcessing = ref(false);
const isRedirecting = ref(false);
const redirectTarget = ref('');

const amount = computed(() => Number(route.query.amount) || 0);
const transactionId = computed(() => route.query.transactionId || 'TXN-UNKNOWN');

const paymentMethods = [
  { id: 'wallet', name: 'E-Wallet', icon: 'account_balance_wallet' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: 'account_balance' },
  { id: 'card', name: 'Bank Card', icon: 'credit_card' }
];

const banks = [
  { code: 'BIDV', name: 'BIDV', logo: bidvLogo },
  { code: 'ACB', name: 'ACB', logo: acbLogo },
  { code: 'VCB', name: 'Vietcombank', logo: vcbLogo },
  { code: 'MB', name: 'MB Bank', logo: mbLogo },
  { code: 'TCB', name: 'Techcombank', logo: techcombankLogo },
  { code: 'VPB', name: 'VPBank', logo: vpbankLogo },
  { code: 'TPB', name: 'TPBank', logo: tpbankLogo },
  { code: 'MSB', name: 'MSB', logo: msbLogo }
];

const cardTypes = [
  { id: 'visa', name: 'Visa', logo: visaLogo },
  { id: 'mastercard', name: 'Mastercard', logo: mastercardLogo },
  { id: 'napas', name: 'Napas', logo: napasLogo }
];

const cardForm = reactive({
  type: 'visa',
  number: '',
  expiry: '',
  cvv: '',
  name: ''
});

const providerColor = computed(() => {
  if (selectedMethod.value === 'wallet') return 'bg-gradient-to-br from-[#a50064] to-[#c11c84]'; // MoMo vibe
  if (selectedMethod.value === 'bank_transfer') return 'bg-gradient-to-br from-blue-600 to-blue-800'; // Bank vibe
  return 'bg-gradient-to-br from-slate-700 to-slate-900'; // Card vibe
});

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const redirectPayment = (target) => {
  isRedirecting.value = true;
  redirectTarget.value = target === 'momo' ? 'MoMo' : (target === 'vnpay' ? 'VNPay' : (target === 'zalopay' ? 'ZaloPay' : (target === 'bank_transfer' ? 'Banking' : target)));
  
  // Simulate Redirect Delay
  setTimeout(() => {
     router.push({
       name: 'StudentSimulatedGateway',
       query: {
         amount: amount.value,
         transactionId: transactionId.value,
         provider: target === 'bank_transfer' ? selectedBank.value : target
       }
     });
  }, 1500);
};

const processCardPayment = async () => {
  if (!cardForm.number || !cardForm.cvv || !cardForm.name) {
    alert('Please fill in all card details');
    return;
  }
  
  isProcessing.value = true;
  // Simulate API processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  router.push({
     name: 'StudentSimulatedGateway',
     query: {
       amount: amount.value,
       transactionId: transactionId.value,
       provider: `card_${cardForm.type}`
     }
  });
};

const cancelPayment = () => {
  router.push({
    path: '/student/booking-confirmation',
    query: { transactionId: transactionId.value }
  });
};
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
