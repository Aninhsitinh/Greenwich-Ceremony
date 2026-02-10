<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark pb-24">
    <!-- Premium Header with Glassmorphism -->
    <div class="sticky top-0 z-50 glass border-b border-white/10">
      <div class="flex items-center justify-between p-4 max-w-2xl mx-auto">
        <button @click="$router.back()" class="icon-container bg-primary/10 hover:bg-primary hover:text-white transition-all">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">My Profile</h2>
        <button @click="handleLogout" class="icon-container bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-500 hover:text-white transition-all">
          <span class="material-symbols-outlined">logout</span>
        </button>
      </div>
    </div>

    <div class="p-4 max-w-2xl mx-auto">
      <!-- Profile Hero Card -->
      <div class="relative overflow-hidden glass-card p-8 mb-6">
        <!-- Background decoration -->
        <div class="absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-2xl"></div>
        <div class="absolute -left-16 -bottom-16 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-2xl"></div>
        
        <div class="relative z-10 flex flex-col items-center">
          <!-- Avatar with gradient border -->
          <div class="relative mb-6">
            <div class="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-primary via-purple-500 to-pink-500">
              <div class="w-full h-full rounded-full bg-white dark:bg-gray-900 p-1">
                <div 
                  class="w-full h-full rounded-full bg-cover bg-center"
                  :style="`background-image: url('https://ui-avatars.com/api/?name=${user?.fullName}&background=0a47c2&color=fff&size=200')`"
                ></div>
              </div>
            </div>
            <button class="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-primary to-purple-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">photo_camera</span>
            </button>
          </div>
          
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user?.fullName || 'Student' }}</h3>
          <p class="text-gray-500 dark:text-gray-400 mt-1">{{ user?.email }}</p>
          
          <!-- Badges -->
          <div class="flex flex-wrap justify-center gap-2 mt-4">
            <span class="badge badge-info">{{ user?.role || 'Student' }}</span>
            <span class="badge badge-success">Class of {{ user?.classOf || '2024' }}</span>
            <span v-if="user?.major" class="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">{{ user?.major }}</span>
          </div>
        </div>
      </div>

      <!-- Edit Mode Button -->
      <button 
        v-if="!editing"
        @click="editing = true"
        class="btn btn-primary w-full mb-6"
      >
        <span class="material-symbols-outlined">edit</span>
        Edit Profile
      </button>

      <!-- Success/Error Messages -->
      <Transition name="slide-up">
        <div v-if="successMessage" class="mb-4 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3">
          <span class="material-symbols-outlined text-green-600">check_circle</span>
          <p class="text-green-700 dark:text-green-400">{{ successMessage }}</p>
        </div>
      </Transition>

      <Transition name="slide-up">
        <div v-if="errorMessage" class="mb-4 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
          <span class="material-symbols-outlined text-red-600">error</span>
          <p class="text-red-700 dark:text-red-400">{{ errorMessage }}</p>
        </div>
      </Transition>

      <!-- Profile Information Card -->
      <div class="glass-card p-6 mb-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span class="icon-container bg-gradient-to-br from-primary to-purple-500 text-white">
            <span class="material-symbols-outlined">person</span>
          </span>
          Personal Information
        </h3>
        
        <form @submit.prevent="handleUpdate" class="space-y-5">
          <!-- Student ID (Read-only) -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-gray-400">badge</span>
              Student ID
            </label>
            <input
              :value="user?.studentId"
              disabled
              class="input bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
            />
          </div>

          <!-- Full Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-gray-400">person</span>
              Full Name
            </label>
            <input
              v-model="formData.fullName"
              :disabled="!editing"
              type="text"
              class="input"
              :class="{ 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed': !editing }"
            />
          </div>

          <!-- Email (Read-only) -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-gray-400">email</span>
              Email
            </label>
            <input
              :value="user?.email"
              disabled
              type="email"
              class="input bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-gray-400">phone</span>
              Phone Number
            </label>
            <input
              v-model="formData.phone"
              :disabled="!editing"
              type="tel"
              placeholder="Enter phone number"
              class="input"
              :class="{ 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed': !editing }"
            />
          </div>

          <!-- Major (Read-only) -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-gray-400">school</span>
              Major
            </label>
            <input
              :value="user?.major"
              disabled
              class="input bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
            />
          </div>

          <!-- Action Buttons -->
          <div v-if="editing" class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="btn btn-primary flex-1"
            >
              <span v-if="loading" class="spinner"></span>
              <span v-else class="flex items-center gap-2">
                <span class="material-symbols-outlined">save</span>
                Save Changes
              </span>
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="btn btn-glass"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Account Settings -->
      <div class="glass-card p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span class="icon-container bg-gradient-to-br from-gray-500 to-gray-700 text-white">
            <span class="material-symbols-outlined">settings</span>
          </span>
          Account Settings
        </h3>
        
        <div class="space-y-3">
          <button class="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group">
            <div class="flex items-center gap-4">
              <div class="icon-container bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                <span class="material-symbols-outlined">lock</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Change Password</span>
            </div>
            <span class="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>

          <button class="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group">
            <div class="flex items-center gap-4">
              <div class="icon-container bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                <span class="material-symbols-outlined">notifications</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Notification Settings</span>
            </div>
            <span class="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>

          <button class="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group">
            <div class="flex items-center gap-4">
              <div class="icon-container bg-green-100 dark:bg-green-900/30 text-green-600">
                <span class="material-symbols-outlined">privacy_tip</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Privacy Settings</span>
            </div>
            <span class="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>

          <button 
            @click="handleLogout" 
            class="w-full flex items-center justify-between p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition-all group"
          >
            <div class="flex items-center gap-4">
              <div class="icon-container bg-red-500 text-white">
                <span class="material-symbols-outlined">logout</span>
              </div>
              <span class="font-semibold text-red-600">Logout</span>
            </div>
            <span class="material-symbols-outlined text-red-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const editing = ref(false);
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const formData = ref({
  fullName: '',
  phone: ''
});

const loadProfile = () => {
  formData.value = {
    fullName: user.value?.fullName || '',
    phone: user.value?.phone || ''
  };
};

const handleUpdate = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await authStore.updateProfile(formData.value);
    successMessage.value = 'Profile updated successfully!';
    editing.value = false;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to update profile.';
  } finally {
    loading.value = false;
  }
};

const cancelEdit = () => {
  editing.value = false;
  loadProfile();
  errorMessage.value = '';
};

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    authStore.logout();
    router.push('/login');
  }
};

onMounted(() => {
  loadProfile();
});
</script>
