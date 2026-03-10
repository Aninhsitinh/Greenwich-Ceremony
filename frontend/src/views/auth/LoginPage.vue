<template>
  <div class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-3 mb-6">
          <img 
            src="@/assets/images/university-of-greenwich.jpg" 
            alt="University of Greenwich" 
            class="h-12 w-auto object-contain"
          />
          <div class="text-left">
            <div class="text-base font-semibold text-gray-900 dark:text-white">University of Greenwich</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Graduation Portal 2026</div>
          </div>
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('auth.welcome_back') }}</h1>
        <p class="text-gray-600 dark:text-gray-400">{{ $t('auth.sign_in') }}</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
        <!-- Error Message -->
        <Alert v-if="error" variant="error" class="mb-6">
          {{ error }}
        </Alert>

        <!-- Role Selector -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{{ $t('auth.login') }}</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              @click="selectedRole = 'student'"
              class="h-12 flex items-center justify-center gap-2 rounded-lg font-medium transition-all border text-sm"
              :class="selectedRole === 'student'
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'"
            >
              <span class="material-symbols-outlined text-xl">person</span>
              Student
            </button>
            <button
              type="button"
              @click="selectedRole = 'staff'"
              class="h-12 flex items-center justify-center gap-2 rounded-lg font-medium transition-all border text-sm"
              :class="selectedRole === 'staff'
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'"
            >
              <span class="material-symbols-outlined text-xl">badge</span>
              Staff
            </button>
            <button
              type="button"
              @click="selectedRole = 'mc'"
              class="h-12 flex items-center justify-center gap-2 rounded-lg font-medium transition-all border text-sm"
              :class="selectedRole === 'mc'
                ? 'bg-purple-700 text-white border-purple-600'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'"
            >
              <span class="material-symbols-outlined text-xl">mic</span>
              MC
            </button>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('auth.email') }}</label>
            <input
              v-model="form.email"
              type="email"
              required
              :placeholder="selectedRole === 'student' ? 'student@greenwich.edu' : 'staff@greenwich.edu'"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('auth.password') }}</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Enter your password"
                class="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                class="w-4 h-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900 dark:focus:ring-white"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('common.save') !== 'Save' ? $t('common.save') : 'Remember me' }}</span>
            </label>
            <router-link
              to="/forgot-password"
              class="text-sm font-medium text-gray-900 dark:text-white hover:underline transition-colors"
            >
              {{ $t('auth.forgot_password') }}
            </router-link>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Loading v-if="loading" class="w-5 h-5" />
            <template v-else>
              <span>{{ $t('auth.sign_in') }}</span>
            </template>
          </button>
        </form>



        <!-- Staff Note -->
        <div v-if="selectedRole === 'staff'" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-gray-500 dark:text-gray-400">info</span>
            <div class="text-xs text-gray-600 dark:text-gray-300">
              <p class="font-semibold mb-1 text-gray-900 dark:text-white">Staff Access</p>
              <p>Use your university staff credentials. Contact IT for assistance.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2026 University of Greenwich. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Alert from '@/components/Alert.vue';
import Loading from '@/components/Loading.vue';

const router = useRouter();
const authStore = useAuthStore();

const selectedRole = ref('student');
const form = ref({
  email: '',
  password: '',
  rememberMe: false
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password
    });
    
    const role = authStore.userRole;
    
    // Role validation
    if (selectedRole.value === 'staff' && role === 'student') {
      error.value = 'This is not a staff account. Please select "Student".';
      await authStore.logout();
      loading.value = false;
      return;
    }

    if (selectedRole.value === 'student' && (role === 'staff' || role === 'admin' || role === 'mc')) {
      error.value = 'This is a staff/MC account. Please select the correct role.';
      await authStore.logout();
      loading.value = false;
      return;
    }

    if (selectedRole.value === 'mc' && role !== 'mc') {
      error.value = 'This account does not have MC access.';
      await authStore.logout();
      loading.value = false;
      return;
    }
    
    // Redirect
    const redirectMap = {
      admin: '/admin',
      staff: '/staff',
      mc: '/mc/dashboard',
      student: '/student',
    };
    router.push(redirectMap[role] || '/student');
  } catch (err) {
    console.error('Login error:', err);
    error.value = err.response?.data?.message || 'Invalid email or password. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
