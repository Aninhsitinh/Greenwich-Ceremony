<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
    <div class="relative flex w-full max-w-[480px] flex-col bg-white dark:bg-background-dark shadow-2xl min-h-screen">
      <!-- Header -->
      <div class="relative">
        <div class="bg-cover bg-center flex flex-col justify-end overflow-hidden min-h-[240px]"
          style="background-image: linear-gradient(180deg, rgba(10, 71, 194, 0.4) 0%, rgba(10, 71, 194, 0.8) 100%), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800');">
          <div class="p-6">
            <h1 class="text-white tracking-tight text-3xl font-bold leading-tight">
              Forgot Password?
            </h1>
            <p class="text-white/90 text-sm mt-2">No worries, we'll send you reset instructions</p>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 w-full h-1 bg-accent-orange"></div>
      </div>

      <!-- Form Section -->
      <div class="flex-1 bg-white dark:bg-background-dark px-6 py-8 -mt-6 rounded-t-3xl relative z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        
        <!-- Success Message -->
        <div v-if="successMessage" class="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-green-600">check_circle</span>
            <div>
              <p class="text-green-600 dark:text-green-400 font-semibold">{{ successMessage }}</p>
              <p class="text-sm text-green-700 dark:text-green-300 mt-1">Please check your email for the OTP code.</p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-red-600 dark:text-red-400 text-sm">{{ errorMessage }}</p>
        </div>

        <!-- Step 1: Request OTP -->
        <form v-if="step === 1" @submit.prevent="handleRequestOTP" class="space-y-4">
          <p class="text-gray-600 dark:text-gray-400 mb-6">Enter your email address and we'll send you an OTP code to reset your password.</p>

          <div class="flex flex-col w-full">
            <label class="text-[#111318] dark:text-white text-sm font-medium leading-normal pb-2">Email Address</label>
            <input
              v-model="email"
              type="email"
              required
              class="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 placeholder:text-[#606e8a] p-[15px] text-base font-normal leading-normal"
              placeholder="student@greenwich.edu.vn"
            />
          </div>

          <div class="mt-8">
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex h-14 items-center justify-center rounded-xl bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">Send OTP Code</span>
              <div v-else class="spinner"></div>
            </button>
          </div>
        </form>

        <!-- Step 2: Verify OTP -->
        <form v-else-if="step === 2" @submit.prevent="handleVerifyOTP" class="space-y-4">
          <p class="text-gray-600 dark:text-gray-400 mb-6">We've sent a 6-digit code to <strong>{{ email }}</strong></p>

          <div class="flex flex-col w-full">
            <label class="text-[#111318] dark:text-white text-sm font-medium leading-normal pb-2">OTP Code</label>
            <input
              v-model="otp"
              type="text"
              required
              maxlength="6"
              class="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 placeholder:text-[#606e8a] p-[15px] text-base font-normal leading-normal text-center tracking-widest font-mono text-2xl"
              placeholder="000000"
              @input="otp = otp.replace(/[^0-9]/g, '')"
            />
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Didn't receive code?</span>
            <button type="button" @click="handleRequestOTP" class="text-primary font-semibold">Resend</button>
          </div>

          <div class="mt-8">
            <button
              type="submit"
              :disabled="loading || otp.length !== 6"
              class="w-full flex h-14 items-center justify-center rounded-xl bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">Verify OTP</span>
              <div v-else class="spinner"></div>
            </button>
          </div>
        </form>

        <!-- Step 3: Reset Password -->
        <form v-else-if="step === 3" @submit.prevent="handleResetPassword" class="space-y-4">
          <p class="text-gray-600 dark:text-gray-400 mb-6">Choose a new password for your account.</p>

          <div class="flex flex-col w-full">
            <label class="text-[#111318] dark:text-white text-sm font-medium leading-normal pb-2">New Password</label>
            <div class="flex w-full items-stretch rounded-lg">
              <input
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 placeholder:text-[#606e8a] p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-[#606e8a] flex border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-gray-800 items-center justify-center pr-[15px] rounded-r-lg border-l-0"
              >
                <span class="material-symbols-outlined text-[24px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col w-full">
            <label class="text-[#111318] dark:text-white text-sm font-medium leading-normal pb-2">Confirm Password</label>
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              class="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 placeholder:text-[#606e8a] p-[15px] text-base font-normal leading-normal"
              placeholder="Re-enter password"
            />
          </div>

          <div class="mt-8">
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex h-14 items-center justify-center rounded-xl bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">Reset Password</span>
              <div v-else class="spinner"></div>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="mt-8 flex items-center justify-center">
          <router-link to="/login" class="flex items-center gap-2 text-primary font-semibold text-sm">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            Back to Login
          </router-link>
        </div>
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
    successMessage.value = 'OTP code sent successfully!';
    step.value = 2;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to send OTP. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleVerifyOTP = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    await authService.verifyOTP(email.value, otp.value);
    step.value = 3;
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
    await authService.resetPassword(email.value, otp.value, newPassword.value);
    alert('Password reset successfully! Please login with your new password.');
    router.push('/login');
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to reset password. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
