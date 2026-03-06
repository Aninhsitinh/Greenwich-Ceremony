<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 mb-4">
          <img src="@/assets/images/2022-Greenwich-Eng.webp" alt="University of Greenwich" class="h-16 w-auto object-contain" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">Follow the steps to recover your account</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
        
        <!-- Progress Steps -->
        <div class="flex items-center justify-between mb-8 relative">
          <div class="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-700 -z-10"></div>
          
          <div class="relative z-10 flex flex-col items-center gap-2">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300"
              :class="step >= 1 ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'"
            >1</div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500">Email</span>
          </div>

          <div class="relative z-10 flex flex-col items-center gap-2">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300"
              :class="step >= 2 ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'"
            >2</div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500">OTP</span>
          </div>

          <div class="relative z-10 flex flex-col items-center gap-2">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300"
              :class="step >= 3 ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'"
            >3</div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500">Reset</span>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 animate-fade-in">
          <span class="material-symbols-outlined text-green-600">check_circle</span>
          <p class="text-sm font-medium text-green-700 dark:text-green-300">{{ successMessage }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 animate-fade-in">
          <span class="material-symbols-outlined text-red-600">error</span>
          <p class="text-sm font-medium text-red-700 dark:text-red-300">{{ errorMessage }}</p>
        </div>

        <!-- Step 1: Email Form -->
        <form v-if="step === 1" @submit.prevent="handleRequestOTP" class="space-y-5 animate-slide-up">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all font-medium text-gray-900 dark:text-white"
              placeholder="student@greenwich.edu.vn"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <span v-if="!loading">Send OTP Code</span>
            <div v-else class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          </button>
        </form>

        <!-- Step 2: OTP Form -->
        <form v-else-if="step === 2" @submit.prevent="handleVerifyOTP" class="space-y-5 animate-slide-up">
          <div class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">Enter the 6-digit code sent to</p>
            <p class="font-bold text-gray-900 dark:text-white">{{ email }}</p>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">OTP Code</label>
            <input
              v-model="otp"
              type="text"
              required
              maxlength="6"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all font-mono text-2xl text-center tracking-[0.5em] text-gray-900 dark:text-white"
              placeholder="000000"
              @input="otp = otp.replace(/[^0-9]/g, '')"
            />
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">Didn't receive it?</span>
            <button type="button" @click="handleRequestOTP" class="font-bold text-gray-900 dark:text-white hover:underline">Resend Code</button>
          </div>

          <button
            type="submit"
            :disabled="loading || otp.length !== 6"
            class="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <span v-if="!loading">Verify & Proceed</span>
            <div v-else class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          </button>
        </form>

        <!-- Step 3: New Password Form -->
        <form v-else-if="step === 3" @submit.prevent="handleResetPassword" class="space-y-5 animate-slide-up">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">New Password</label>
            <div class="relative">
              <input
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all font-medium text-gray-900 dark:text-white"
                placeholder="Min 6 characters"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Confirm Password</label>
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all font-medium text-gray-900 dark:text-white"
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <span v-if="!loading">Reset Password</span>
            <div v-else class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          </button>
        </form>

      </div>

      <!-- Footer Action -->
      <div class="text-center mt-8">
        <router-link to="/login" class="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService';

const router = useRouter();

const step = ref(1); // 1: Request OTP, 2: Verify OTP, 3: Reset Password
const email = ref('');
const otp = ref('');
const resetToken = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleRequestOTP = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await authService.forgotPassword(email.value);
    successMessage.value = 'OTP code sent to your email!';
    setTimeout(() => {
      step.value = 2;
      successMessage.value = ''; // Clear for next step
    }, 1000);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to send OTP. Please check your email.';
  } finally {
    loading.value = false;
  }
};

const handleVerifyOTP = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await authService.verifyOTP(email.value, otp.value);
    if (response.data && response.data.resetToken) {
        resetToken.value = response.data.resetToken;
        step.value = 3;
        successMessage.value = '';
    } else {
        throw new Error('Invalid response from server');
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Invalid OTP code. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    // Use resetToken.value instead of otp.value
    await authService.resetPassword(email.value, resetToken.value, newPassword.value);
    successMessage.value = 'Password reset successfully!';
    setTimeout(() => {
        router.push('/login');
    }, 1500);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to reset password. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
