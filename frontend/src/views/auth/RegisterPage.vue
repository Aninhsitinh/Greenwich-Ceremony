<template>
  <div class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-3 mb-6">
          <img 
            src="@/assets/images/university-of-greenwich.jpg" 
            alt="Greenwich Vietnam" 
            class="h-12 w-auto object-contain"
          />




          <div class="text-left">
            <h2 class="text-gray-900 dark:text-white text-base font-semibold">Greenwich Vietnam</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Graduation Portal 2024</p>
          </div>
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
        <p class="text-gray-600 dark:text-gray-400">Join the graduation ceremony</p>
      </div>

      <!-- Register Card -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
        <!-- Success/Error Alert -->
        <Alert v-if="success" variant="success" class="mb-6">
          Registration successful! Redirecting to login...
        </Alert>
        <Alert v-if="error" variant="error" class="mb-6">
          {{ error }}
        </Alert>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              v-model="form.fullName"
              type="text"
              required
              placeholder="John Doe"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
            />
          </div>

          <!-- Student ID -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Student ID</label>
            <input
              v-model="form.studentId"
              type="text"
              required
              :placeholder="studentIdPlaceholder"
              :pattern="studentIdPattern"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Format: {{ studentIdPrefix }} followed by 6 digits</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="your.email@student.fpt.edu.vn"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
            />
          </div>

          <!-- Major & Class -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Major</label>
              <select
                v-model="form.major"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
              >
                <option value="">Select...</option>
                <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                <option value="Trí tuệ nhân tạo">Trí tuệ nhân tạo</option>
                <option value="Thiết kế đồ họa & kỹ thuật số">Thiết kế đồ họa & kỹ thuật số</option>
                <option value="Truyền thông đa phương tiện">Truyền thông đa phương tiện</option>
                <option value="Quản trị Kinh doanh">Quản trị Kinh doanh</option>
                <option value="Quản trị Marketing">Quản trị Marketing</option>
                <option value="Logistics và Quản lý Chuỗi cung ứng">Logistics và Quản lý Chuỗi cung ứng</option>
                <option value="Kinh doanh quốc tế">Kinh doanh quốc tế</option>
                <option value="Quản trị Sự kiện">Quản trị Sự kiện</option>
                <option value="Quản trị Truyền thông">Quản trị Truyền thông</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class Of</label>
              <input
                v-model="form.classOf"
                type="number"
                required
                min="2020"
                max="2030"
                placeholder="2024"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="Minimum 6 characters"
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

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
            <input
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Re-enter password"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
            />
          </div>

          <!-- Terms & Conditions -->
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="form.agreeToTerms"
              type="checkbox"
              required
              class="mt-0.5 w-4 h-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900 dark:focus:ring-white"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              I agree to the <router-link to="/terms" class="text-gray-900 dark:text-white font-medium hover:underline" target="_blank">Terms & Conditions</router-link> and <router-link to="/privacy" class="text-gray-900 dark:text-white font-medium hover:underline" target="_blank">Privacy Policy</router-link>
            </span>
          </label>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Loading v-if="loading" class="w-5 h-5" />
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Sign In Link -->
        <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <router-link
            to="/login"
            class="font-medium text-gray-900 dark:text-white hover:underline transition-colors"
          >
            Sign in here
          </router-link>
        </p>
      </div>

      <!-- Footer -->
      <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2024 FPT Greenwich. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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

const studentIdPrefix = computed(() => {
  if (!form.value.major) return 'GCS';
  
  const gcsMajors = ['Công nghệ thông tin', 'Trí tuệ nhân tạo'];
  const gdsMajors = ['Thiết kế đồ họa & kỹ thuật số'];
  
  if (gcsMajors.includes(form.value.major)) return 'GCS';
  if (gdsMajors.includes(form.value.major)) return 'GDS';
  
  // Everyone else (including Truyền thông đa phương tiện) gets GBS
  return 'GBS';
});

const studentIdPlaceholder = computed(() => {
  return `${studentIdPrefix.value}200123`;
});

const studentIdPattern = computed(() => {
  return `^${studentIdPrefix.value}\\d{6}$`;
});

const handleRegister = async () => {
  error.value = '';
  
  // Validate passwords match
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match';
    return;
  }

  // Validate Student ID Prefix
  if (!form.value.studentId.startsWith(studentIdPrefix.value)) {
    error.value = `Student ID must start with ${studentIdPrefix.value} for your major.`;
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
