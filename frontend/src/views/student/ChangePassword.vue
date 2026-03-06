<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('student.change_password')"
  >
    <div class="w-full max-w-2xl mx-auto px-4 py-6">
      
      <!-- Back Link -->
      <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors">
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        <span class="text-sm font-semibold">Back to Settings</span>
      </button>

      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
           <h1 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <span class="material-symbols-outlined text-gray-500">lock_reset</span>
             Change Password
           </h1>
           <p class="text-sm text-gray-500 mt-1 ml-8">Update your password securely using email verification.</p>
        </div>
        
        <div class="p-8">
           <!-- Progress Steps -->
           <div class="flex items-center justify-between mb-8 relative max-w-sm mx-auto">
              <div class="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-700 -z-10"></div>
              
              <div class="relative z-10 flex flex-col items-center gap-2">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300"
                  :class="step >= 1 ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'"
                >1</div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500">Verify</span>
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
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500">New Password</span>
              </div>
           </div>

           <!-- Messages -->
           <div v-if="successMessage" class="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 flex items-center gap-3 animate-fade-in">
              <span class="material-symbols-outlined">check_circle</span>
              <span class="font-medium">{{ successMessage }}</span>
           </div>

           <div v-if="errorMessage" class="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-3 animate-fade-in">
              <span class="material-symbols-outlined">error</span>
              <span class="font-medium">{{ errorMessage }}</span>
           </div>

           <!-- Step 1: Request OTP -->
           <div v-if="step === 1" class="space-y-6 animate-slide-up">
              <div class="text-center">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="material-symbols-outlined text-3xl text-gray-600 dark:text-gray-400">mail</span>
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Verify it's you</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-6">
                  We will send a one-time password (OTP) to your email address:<br>
                  <span class="font-bold text-gray-900 dark:text-white">{{ userEmail }}</span>
                </p>
                
                <button 
                   @click="handleRequestOTP" 
                   :disabled="loading"
                   class="w-full md:w-auto px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                   <span v-if="loading" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                   <span v-else>Send Verification Code</span>
                </button>
              </div>
           </div>

           <!-- Step 2: Verify OTP -->
           <form v-else-if="step === 2" @submit.prevent="handleVerifyOTP" class="space-y-6 animate-slide-up max-w-sm mx-auto">
              <div class="text-center">
                 <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Enter Verification Code</h3>
                 <p class="text-sm text-gray-500 dark:text-gray-400">Sent to {{ userEmail }}</p>
              </div>

              <div>
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
                <span class="text-gray-500">Didn't receive code?</span>
                <button type="button" @click="handleRequestOTP" class="font-bold text-gray-900 dark:text-white hover:underline">Resend</button>
              </div>

              <div class="flex gap-4 pt-4">
                 <button type="button" @click="step = 1" class="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Back
                 </button>
                 <button type="submit" :disabled="loading || otp.length !== 6" class="flex-1 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2">
                    <span v-if="loading" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>Verify Code</span>
                 </button>
              </div>
           </form>

           <!-- Step 3: New Password -->
           <form v-else-if="step === 3" @submit.prevent="handleResetPassword" class="space-y-6 animate-slide-up max-w-md mx-auto">
              <div class="text-center mb-6">
                 <h3 class="text-lg font-bold text-gray-900 dark:text-white">Set New Password</h3>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <div class="relative">
                   <input
                     v-model="newPassword"
                     :type="showNewPassword ? 'text' : 'password'"
                     required
                     minlength="6"
                     class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all dark:text-white pr-12"
                   />
                   <button
                     type="button"
                     @click="showNewPassword = !showNewPassword"
                     class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                   >
                     <span class="material-symbols-outlined">{{ showNewPassword ? 'visibility_off' : 'visibility' }}</span>
                   </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                <div class="relative">
                   <input
                     v-model="confirmPassword"
                     :type="showConfirmPassword ? 'text' : 'password'"
                     required
                     class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all dark:text-white pr-12"
                   />
                   <button
                     type="button"
                     @click="showConfirmPassword = !showConfirmPassword"
                     class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                   >
                     <span class="material-symbols-outlined">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
                   </button>
                </div>
              </div>

              <div class="flex gap-4 pt-4">
                 <button type="submit" :disabled="loading" class="w-full px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2">
                    <span v-if="loading" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>Change Password</span>
                 </button>
              </div>
           </form>

        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/authService';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const userEmail = computed(() => authStore.user?.email || '');

// State
const step = ref(1);
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const otp = ref('');
const resetToken = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const navigation = computed(() => [
  { path: '/student/dashboard', icon: 'dashboard', label: t('student.nav_dashboard') },
  { path: '/student/profile', icon: 'person', label: t('student.nav_profile') },
  { path: '/student/ticket', icon: 'qr_code_2', label: t('student.nav_ticket') },
  { path: '/student/seat-booking', icon: 'event_seat', label: t('student.nav_seats') },
  { path: '/student/gown-collection', icon: 'checkroom', label: t('student.nav_gown') },
  { path: '/student/booking-confirmation', icon: 'payments', label: t('student.nav_payments') },
  { path: '/student/chat', icon: 'support_agent', label: t('student.nav_chat') }
]);

const bottomNavigation = [
  { path: '/student/dashboard', icon: 'dashboard', label: 'Home' },
  { path: '/student/ticket', icon: 'qr_code_2', label: 'Ticket' },
  { path: '/student/seat-booking', icon: 'event_seat', label: 'Seats' },
  { path: '/student/profile', icon: 'person', label: 'Profile' }
];

// Step 1: Request OTP
const handleRequestOTP = async () => {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
        await authService.forgotPassword(userEmail.value);
        successMessage.value = 'OTP code sent to your email!';
        setTimeout(() => {
            step.value = 2;
            successMessage.value = '';
        }, 1000);
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Failed to send OTP.';
    } finally {
        loading.value = false;
    }
};

// Step 2: Verify OTP
const handleVerifyOTP = async () => {
    loading.value = true;
    errorMessage.value = '';

    try {
        const response = await authService.verifyOTP(userEmail.value, otp.value);
        if (response.data && response.data.resetToken) {
            resetToken.value = response.data.resetToken;
            step.value = 3;
            successMessage.value = '';
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Invalid OTP code.';
    } finally {
        loading.value = false;
    }
};

// Step 3: Reset Password
const handleResetPassword = async () => {
    errorMessage.value = '';
    
    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match';
        return;
    }

    if (newPassword.value.length < 6) {
        errorMessage.value = 'Password must be at least 6 characters long';
        return;
    }

    loading.value = true;

    try {
        await authService.resetPassword(userEmail.value, resetToken.value, newPassword.value);
        successMessage.value = 'Password changed successfully!';
        setTimeout(() => {
             // Logout or redirect back to profile? 
             // Redirecting to profile seems safer as they are already logged in, 
             // but strictly speaking, password change might require re-login.
             // For better UX, let's keep them logged in but redirect.
            router.push('/student/profile');
        }, 2000);
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Failed to change password';
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
