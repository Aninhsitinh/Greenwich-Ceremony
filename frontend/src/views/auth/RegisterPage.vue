<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-4">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-2xl mb-4">
          <span class="material-symbols-outlined text-5xl text-purple-600">person_add</span>
        </div>
        <h1 class="text-4xl font-bold text-white mb-2">Create Account</h1>
        <p class="text-purple-100">Join the graduation ceremony</p>
      </div>

      <!-- Register Card -->
      <div class="bg-white rounded-3xl shadow-2xl p-8">
        <!-- Success/Error Alert -->
        <Alert v-if="success" variant="success" class="mb-6">
          Registration successful! Redirecting to login...
        </Alert>
        <Alert v-if="error" variant="error" class="mb-6">
          {{ error }}
        </Alert>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">person</span>
              <input
                v-model="form.fullName"
                type="text"
                required
                placeholder="John Doe"
                class="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
              />
            </div>
          </div>

          <!-- Student ID -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">badge</span>
              <input
                v-model="form.studentId"
                type="text"
                required
                placeholder="GCS220001"
                pattern="GCS\d{6}"
                class="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">Format: GCS followed by 6 digits</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">email</span>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="your.email@student.fpt.edu.vn"
                class="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
              />
            </div>
          </div>

          <!-- Major & Class -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Major</label>
              <select
                v-model="form.major"
                required
                class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
              >
                <option value="">Select...</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Business Administration">Business Administration</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Class Of</label>
              <input
                v-model="form.classOf"
                type="number"
                required
                min="2020"
                max="2030"
                placeholder="2024"
                class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">lock</span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="Minimum 6 characters"
                class="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">lock</span>
              <input
                v-model="form.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Re-enter password"
                class="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
              />
            </div>
          </div>

          <!-- Terms & Conditions -->
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="form.agreeToTerms"
              type="checkbox"
              required
              class="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-600"
            />
            <span class="text-sm text-gray-600">
              I agree to the <a href="#" class="text-purple-600 font-semibold hover:underline">Terms & Conditions</a> and <a href="#" class="text-purple-600 font-semibold hover:underline">Privacy Policy</a>
            </span>
          </label>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Loading v-if="loading" class="w-5 h-5" />
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Sign In Link -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <router-link
            to="/login"
            class="font-bold text-purple-600 hover:text-purple-700 transition-colors"
          >
            Sign in here
          </router-link>
        </p>
      </div>

      <!-- Footer -->
      <p class="mt-8 text-center text-sm text-white/80">
        © 2024 FPT Greenwich. All rights reserved.
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

const form = ref({
  fullName: '',
  studentId: '',
  email: '',
  major: '',
  classOf: new Date().getFullYear(),
  password: '',
  confirmPassword: '',
  agreeToTerms: false
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref(false);

const handleRegister = async () => {
  error.value = '';
  
  // Validate passwords match
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match';
    return;
  }

  loading.value = true;

  try {
    // Only send required fields (not confirmPassword or agreeToTerms)
    const userData = {
      studentId: form.value.studentId,
      email: form.value.email,
      password: form.value.password,
      fullName: form.value.fullName,
      major: form.value.major,
      classOf: form.value.classOf
    };
    
    await authStore.register(userData);
    success.value = true;
    
    // Redirect to student dashboard after successful registration
    setTimeout(() => {
      router.push('/student');
    }, 1500);
  } catch (err) {
    console.error('Registration error:', err);
    error.value = err.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
