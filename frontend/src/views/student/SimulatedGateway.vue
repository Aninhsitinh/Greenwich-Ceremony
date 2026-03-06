<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
      
      <!-- Header with Provider Info -->
      <div :class="['p-6 text-white text-center relative overflow-hidden transition-colors duration-500', providerStyle.color]">
        <div class="absolute top-[-50px] left-[-50px] w-32 h-32 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-[-20px] right-[-20px] w-48 h-48 rounded-full bg-white opacity-10"></div>
        
        <div class="relative z-10">
           <img :src="providerStyle.logo" alt="Provider Logo" class="h-16 mx-auto mb-4 bg-white rounded-lg p-2 shadow-sm object-contain">
           <h2 class="text-2xl font-bold">{{ isCardPayment ? 'Payment Verification' : `${providerStyle.name} Payment` }}</h2>
           <p class="opacity-90">{{ formatCurrency(amount) }}</p>
        </div>
      </div>

      <!-- Content Area -->
      <div class="p-8 flex flex-col items-center">
         
         <!-- Success State (Shared) -->
         <div v-if="isSuccess" class="py-8 animate-fade-in text-center">
            <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-small">
               <span class="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-8">Redirecting back to merchant...</p>
            <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
         </div>

         <!-- Card OTP Verification Flow -->
         <div v-else-if="isCardPayment" class="w-full">
            <div class="text-center mb-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    To complete your transaction, please verify your identity via OTP sent to your email.
                </p>
            </div>

            <div class="space-y-4">
                <!-- Step 1: Email Input -->
                <div v-if="otpStep === 1" class="space-y-4 animate-fade-in">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                        <input 
                            v-model="otpEmail"
                            type="email" 
                            placeholder="student@example.com"
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <button 
                        @click="sendOtp"
                        :disabled="!isValidEmail || isProcessing"
                        :class="['w-full py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2', providerStyle.color, (!isValidEmail || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110']"
                    >
                        <span v-if="isProcessing" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>{{ isProcessing ? 'Sending...' : 'Send OTP' }}</span>
                    </button>
                </div>

                <!-- Step 2: OTP Input -->
                <div v-if="otpStep === 2" class="space-y-4 animate-fade-in">
                    <div class="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-sm text-center">
                        Code sent to <strong>{{ otpEmail }}</strong>
                    </div>
                    
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Enter OTP Code</label>
                        <input 
                            v-model="otpCode"
                            type="text" 
                            placeholder="123456"
                            maxlength="6"
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center tracking-[0.5em] font-mono text-xl"
                        />
                    </div>

                    <div v-if="otpError" class="text-red-500 text-sm text-center font-medium animate-shake">
                        {{ otpError }}
                    </div>

                    <button 
                        @click="verifyOtp"
                        :disabled="otpCode.length !== 6 || isProcessing"
                        :class="['w-full py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2', providerStyle.color, (otpCode.length !== 6 || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110']"
                    >
                        <span v-if="isProcessing" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>{{ isProcessing ? 'Verifying...' : 'Confirm Payment' }}</span>
                    </button>
                    
                    <button @click="otpStep = 1" class="w-full text-sm text-gray-500 hover:text-blue-500 underline">
                        Resend Code
                    </button>
                </div>

                <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                    <button @click="cancelPayment" class="w-full text-gray-400 hover:text-red-500 text-sm transition-colors">
                        Cancel Transaction
                    </button>
                </div>
            </div>
         </div>

         <!-- QR Scan Flow (Original) -->
         <div v-else class="w-full flex flex-col items-center">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Open your <strong>{{ providerStyle.name }} App</strong> and scan this code</p>
            
            <div class="relative group mx-auto w-64 h-64 bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 mb-8 flex items-center justify-center shadow-inner">
               <img :src="qrUrl" alt="QR Code" class="w-full h-full object-contain mix-blend-multiply opacity-90" />
               <!-- Scan Animation -->
               <div :class="['absolute top-0 left-0 w-full h-1 shadow-[0_0_10px_rgba(0,0,0,0.2)] animate-scan', providerStyle.color.replace('bg-', 'bg-').replace('from-', 'bg-')]"></div>
            </div>

            <!-- Timer (Fake) -->
            <div class="flex items-center justify-center gap-2 text-sm text-red-500 font-mono mb-6 bg-red-50 dark:bg-red-900/10 py-2 rounded-lg">
               <span class="material-symbols-outlined text-base">timer</span>
               <span>Expires in {{ timeLeft }}</span>
            </div>

            <div class="space-y-3 w-full">
               <button 
                  @click="confirmQrPayment" 
                  :disabled="isProcessing"
                  :class="['w-full py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95', providerStyle.color, isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110']"
               >
                  <div v-if="isProcessing" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{{ isProcessing ? 'Processing...' : 'Confirm Payment on App' }}</span>
               </button>
               
               <button 
                  @click="cancelPayment" 
                  class="w-full text-gray-400 hover:text-red-500 text-sm transition-colors py-2"
               >
                  Cancel Transaction
               </button>
            </div>
         </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
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

const provider = computed(() => route.query.provider || 'momo');
const amount = computed(() => Number(route.query.amount) || 0);
const transactionId = computed(() => route.query.transactionId || 'TXN-UNKNOWN');
const isCardPayment = computed(() => provider.value.startsWith('card_'));

const isProcessing = ref(false);
const isSuccess = ref(false);
const timeLeft = ref('15:00');
let timerInterval;

// OTP Logic
const otpStep = ref(1);
const otpEmail = ref('');
const otpCode = ref('');
const otpError = ref('');
const isValidEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(otpEmail.value));
const CORRECT_OTP = '123456';

const providerConfig = {
  momo: { color: 'bg-gradient-to-br from-[#a50064] to-[#c11c84]', name: 'MoMo Wallet', logo: momoLogo },
  vnpay: { color: 'bg-gradient-to-r from-[#005ba3] to-[#ed1c24]', name: 'VNPay', logo: vnpayLogo },
  BIDV: { color: 'bg-[#006F45]', name: 'BIDV', logo: bidvLogo },
  ACB: { color: 'bg-[#0060af]', name: 'ACB', logo: acbLogo },
  VCB: { color: 'bg-[#74c043]', name: 'Vietcombank', logo: vcbLogo },
  MB: { color: 'bg-[#18328c]', name: 'MB Bank', logo: mbLogo },
  TCB: { color: 'bg-[#cf091d]', name: 'Techcombank', logo: techcombankLogo },
  VPB: { color: 'bg-[#00b050]', name: 'VPBank', logo: vpbankLogo },
  TPB: { color: 'bg-[#672481]', name: 'TPBank', logo: tpbankLogo },
  MSB: { color: 'bg-[#ea5d20]', name: 'MSB', logo: msbLogo },
  // Cards
  card_visa: { color: 'bg-[#1a1f71]', name: 'Visa Secure', logo: visaLogo },
  card_mastercard: { color: 'bg-[#eb001b]', name: 'Mastercard ID Check', logo: mastercardLogo },
  card_napas: { color: 'bg-[#007cc3]', name: 'Napas', logo: napasLogo },
};

const providerStyle = computed(() => {
  if (provider.value.startsWith('card_')) {
      return providerConfig[provider.value] || providerConfig['card_visa'];
  }
  return providerConfig[provider.value] || { color: 'bg-gray-800', name: 'Payment Gateway', logo: '' };
});

const qrUrl = computed(() => {
   const data = `${provider.value}_${amount.value}_${transactionId.value}`;
   return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${data}`;
});

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const startTimer = () => {
    let seconds = 15 * 60;
    timerInterval = setInterval(() => {
        seconds--;
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        timeLeft.value = `${m}:${s}`;
        if (seconds <= 0) clearInterval(timerInterval);
    }, 1000);
};

// QR Confirmation
const confirmQrPayment = async () => {
   isProcessing.value = true;
   await new Promise(resolve => setTimeout(resolve, 2000));
   finishTransaction();
};

// Card OTP Logic
const expectedOtp = ref('123456'); 
import api from '@/services/api';

const sendOtp = async () => {
    isProcessing.value = true;
    try {
        const response = await api.post('/payments/otp', {
            email: otpEmail.value,
            amount: amount.value,
            provider: providerStyle.value.name
        });
        
        if (response.data.success) {
             expectedOtp.value = response.data.data.otp; 
             otpStep.value = 2;
        }
    } catch (error) {
        console.error('Failed to send OTP:', error);
        alert('Failed to send OTP. Please check your email and try again.');
    } finally {
        isProcessing.value = false;
    }
};

const verifyOtp = async () => {
    isProcessing.value = true;
    otpError.value = '';
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    if (otpCode.value === expectedOtp.value.toString()) { 
        finishTransaction();
    } else {
        isProcessing.value = false;
        otpError.value = 'Invalid verification code. Please check your email.';
        otpCode.value = '';
    }
};

const finishTransaction = async () => {
   isProcessing.value = true;
   
   let method = 'online';
   if (isCardPayment.value) method = 'card';
   else method = 'qr'; 

   try {
       await api.post('/payments', {
           amount: amount.value,
           paymentType: 'graduation_package', 
           paymentMethod: method, 
           transactionId: transactionId.value,
           status: 'completed',
           notes: `Payment via ${providerConfig[provider.value]?.name || provider.value}`
       });
       
       isSuccess.value = true;
       setTimeout(() => {
          router.push({
             path: '/student/booking-confirmation',
             query: {
                 status: 'success',
                 transactionId: transactionId.value,
                 provider: provider.value
             }
          });
       }, 2000);
   } catch (error) {
       console.error('Failed to save payment:', error);
       alert('Payment verified but failed to save record. Please contact support.');
       isProcessing.value = false;
   }
};

const cancelPayment = () => {
    router.go(-1);
};

onMounted(() => {
    if (!isCardPayment.value) {
        startTimer();
    }
});

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
@keyframes scan {
  0% { top: 0; }
  50% { top: 100%; }
  100% { top: 0; }
}
.animate-scan {
  animation: scan 2s infinite linear;
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-bounce-small {
  animation: bounce 1s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-shake {
    animation: shake 0.5s;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>
