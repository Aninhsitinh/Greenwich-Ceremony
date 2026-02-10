<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style="background: linear-gradient(135deg, #003B5C 0%, #00A3E0 50%, #003B5C 100%);">
    <!-- Animated Background -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute w-96 h-96 rounded-full blur-3xl" style="top: 10%; left: 10%; background: #FFB81C; animation: floatAnimation 8s ease-in-out infinite;"></div>
      <div class="absolute w-96 h-96 rounded-full blur-3xl" style="bottom: 10%; right: 10%; background: #00A3E0; animation: floatAnimation 8s ease-in-out infinite; animation-delay: -4s;"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo Header -->
      <div class="text-center mb-8 animate-fade-in">
        <div class="inline-flex items-center justify-center w-32 h-32 bg-white rounded-3xl shadow-2xl mb-6 p-3">
          <img 
            src="@/assets/images/inprep-partner-logos-06-300x200.png" 
            alt="University of Greenwich" 
            class="w-full h-full object-contain"
          />
        </div>
        <h1 class="text-4xl font-bold text-white mb-2" style="font-family: 'Montserrat', sans-serif;">Welcome Back</h1>
        <p class="text-blue-100 text-lg">Graduation Ceremony Portal 2024</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-xl" style="background: rgba(255, 255, 255, 0.95);">
        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 rounded-xl flex items-center gap-3" style="background: #fee2e2; border: 1px solid #fecaca;">
          <span class="material-symbols-outlined" style="color: #dc2626;">error</span>
          <p class="text-sm" style="color: #991b1b;">{{ error }}</p>
        </div>

        <!-- Role Selector -->
        <div class="mb-6">
          <label class="block text-sm font-semibold mb-3" style="color: #374151;">Login As</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="selectedRole = 'student'"
              class="h-14 flex items-center justify-center gap-2 rounded-xl font-semibold transition-all border-2"
              :style="selectedRole === 'student' 
                ? 'background: #00A3E0; color: white; border-color: #00A3E0; box-shadow: 0 4px 12px rgba(0, 163, 224, 0.3);' 
                : 'background: #f3f4f6; color: #374151; border-color: #e5e7eb;'"
            >
              <span class="material-symbols-outlined">person</span>
              Student
            </button>
            <button
              type="button"
              @click="selectedRole = 'staff'"
              class="h-14 flex items-center justify-center gap-2 rounded-xl font-semibold transition-all border-2"
              :style="selectedRole === 'staff' 
                ? 'background: #003B5C; color: white; border-color: #003B5C; box-shadow: 0 4px 12px rgba(0, 59, 92, 0.3);' 
                : 'background: #f3f4f6; color: #374151; border-color: #e5e7eb;'"
            >
              <span class="material-symbols-outlined">badge</span>
              Staff
            </button>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold mb-2" style="color: #374151;">Email Address</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl" style="color: #9ca3af;">mail</span>
              <input
                v-model="form.email"
                type="email"
                required
                :placeholder="selectedRole === 'student' ? 'student@greenwich.edu' : 'staff@greenwich.edu'"
                class="w-full h-14 pl-14 pr-4 rounded-xl border-2 transition-all focus:outline-none"
                style="background: #f9fafb; border-color: #e5e7eb; color: #111827;"
                @focus="emailFocused = true"
                @blur="emailFocused = false"
                :style="emailFocused ? 'border-color: #00A3E0; box-shadow: 0 0 0 4px rgba(0, 163, 224, 0.1);' : ''"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-semibold mb-2" style="color: #374151;">Password</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl" style="color: #9ca3af;">lock</span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Enter your password"
                class="w-full h-14 pl-14 pr-14 rounded-xl border-2 transition-all focus:outline-none"
                style="background: #f9fafb; border-color: #e5e7eb; color: #111827;"
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
                :style="passwordFocused ? 'border-color: #00A3E0; box-shadow: 0 0 0 4px rgba(0, 163, 224, 0.1);' : ''"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style="color: #9ca3af;"
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
                class="w-4 h-4 rounded"
                style="accent-color: #00A3E0;"
              />
              <span class="text-sm" style="color: #6b7280;">Remember me</span>
            </label>
            <router-link
              to="/forgot-password"
              class="text-sm font-semibold transition-colors"
              style="color: #00A3E0;"
            >
              Forgot password?
            </router-link>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-14 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            :style="getButtonStyle"
            @mouseover="buttonHovered = true"
            @mouseleave="buttonHovered = false"
          >
            <div v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <template v-else>
              <span class="material-symbols-outlined">login</span>
              Sign In as {{ selectedRole === 'student' ? 'Student' : 'Staff' }}
            </template>
          </button>
        </form>

        <!-- Sign Up Link -->
        <p v-if="selectedRole === 'student'" class="mt-6 text-center text-sm" style="color: #6b7280;">
          Don't have an account?
          <router-link
            to="/register"
            class="font-bold transition-colors ml-1"
            style="color: #00A3E0;"
          >
            Sign up now
          </router-link>
        </p>

        <!-- Staff Note -->
        <div v-if="selectedRole === 'staff'" class="mt-6 p-4 rounded-xl" style="background: rgba(0, 59, 92, 0.05); border: 1px solid rgba(0, 59, 92, 0.1);">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined" style="color: #003B5C;">info</span>
            <div class="text-xs" style="color: #4b5563;">
              <p class="font-semibold mb-1" style="color: #003B5C;">Staff Access</p>
              <p>Use your university staff credentials. Contact IT for assistance.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <p class="mt-8 text-center text-sm text-white opacity-80">
        © 2024 University of Greenwich. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

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
const emailFocused = ref(false);
const passwordFocused = ref(false);
const buttonHovered = ref(false);

const getButtonStyle = computed(() => {
  let baseStyle = selectedRole.value === 'student'
    ? 'background: linear-gradient(135deg, #00A3E0 0%, #0891b2 100%); color: white; box-shadow: 0 4px 14px rgba(0, 163, 224, 0.4);'
    : 'background: linear-gradient(135deg, #003B5C 0%, #00A3E0 100%); color: white; box-shadow: 0 4px 14px rgba(0, 59, 92, 0.4);';
  
  if (buttonHovered.value && !loading.value) {
    baseStyle += ' transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 163, 224, 0.5);';
  }
  
  return baseStyle;
});

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
    
    if (selectedRole.value === 'student' && (role === 'staff' || role === 'admin')) {
      error.value = 'This is a staff account. Please select "Staff".';
      await authStore.logout();
      loading.value = false;
      return;
    }
    
    // Redirect
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'staff') {
      router.push('/staff');
    } else {
      router.push('/student');
    }
  } catch (err) {
    console.error('Login error:', err);
    error.value = err.response?.data?.message || 'Invalid email or password. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@keyframes floatAnimation {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes spinAnimation {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spinAnimation 0.8s linear infinite;
}
</style>
