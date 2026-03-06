<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('student.profile_title')"
  >
    <div class="w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
      
      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3 animate-fade-in">
        <span class="material-symbols-outlined text-green-600">check_circle</span>
        <p class="text-green-700 font-medium">{{ successMessage }}</p>
      </div>

      <div v-if="errorMessage" class="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3 animate-fade-in">
        <span class="material-symbols-outlined text-red-600">error</span>
        <p class="text-red-700 font-medium">{{ errorMessage }}</p>
      </div>

      <!-- Profile Hero Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div class="flex flex-col items-center">
          <!-- Avatar -->
          <div class="relative mb-6">
            <div class="w-32 h-32 rounded-full p-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              <div 
                class="w-full h-full rounded-full bg-cover bg-center bg-gray-100 dark:bg-gray-700"
                :style="avatarStyle"
              ></div>
            </div>
            <input 
              ref="fileInput" 
              type="file" 
              accept="image/*" 
              @change="handlePhotoUpload" 
              class="hidden"
            />
            <button 
              @click="$refs.fileInput.click()"
              class="absolute bottom-0 right-0 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-lg">photo_camera</span>
            </button>
          </div>
          
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ user?.fullName || 'Student' }}</h1>
          <p class="text-gray-500 dark:text-gray-400 mb-6">{{ user?.email }}</p>
          
          <!-- Badges -->
          <div class="flex flex-wrap justify-center gap-2">
            <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wide">{{ user?.role || 'Student' }}</span>
            <span class="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-bold uppercase tracking-wide">Class of {{ user?.classOf || '2026' }}</span>
            <span v-if="user?.major" class="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold uppercase tracking-wide">{{ user?.major }}</span>
          </div>
        </div>
      </div>

      <!-- Edit Button -->
      <button 
        v-if="!editing"
        @click="editing = true"
        class="w-full py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
      >
        <span class="material-symbols-outlined">edit</span>
        Edit Profile
      </button>

      <!-- Profile Information Form -->
      <div v-if="editing" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
        <div class="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
          <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <span class="material-symbols-outlined text-gray-900 dark:text-white">person</span>
          </div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h2>
        </div>

        <form @submit.prevent="handleUpdate" class="space-y-4">
          <!-- Student ID (Read-only) -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase text-xs tracking-wider">
              Student ID
            </label>
            <input
              :value="user?.studentId"
              disabled
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <!-- Full Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase text-xs tracking-wider">
              Full Name *
            </label>
            <input
              v-model="formData.fullName"
              type="text"
              required
              class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase text-xs tracking-wider">
              Email
            </label>
            <input
              :value="user?.email"
              disabled
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase text-xs tracking-wider">
              Phone Number
            </label>
            <input
              v-model="formData.phoneNumber"
              type="tel"
              class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
            />
          </div>

          <!-- Class Of -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase text-xs tracking-wider">
              Class Of
            </label>
            <input
              v-model="formData.classOf"
              type="number"
              min="2020"
              max="2030"
              class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
            />
          </div>

          <!-- Major (Read-only) -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase text-xs tracking-wider">
              Major
            </label>
            <input
              :value="user?.major"
              disabled
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="cancelEdit"
              class="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <div v-if="loading" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <template v-else>
                <span class="material-symbols-outlined text-lg">save</span>
                {{ $t('common.save') }} Changes
              </template>
            </button>
          </div>
        </form>
      </div>

      <!-- Account Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
          <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <span class="material-symbols-outlined text-gray-900 dark:text-white">settings</span>
          </div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Account Settings</h2>
        </div>
        
        <div class="space-y-2">
          <router-link 
            to="/student/change-password"
            class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-blue-600 dark:text-blue-400">lock</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ $t('student.change_password') }}</span>
            </div>
            <span class="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </router-link>

          <router-link 
            to="/student/notification-settings"
            class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-purple-600 dark:text-purple-400">notifications</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Notification Settings</span>
            </div>
            <span class="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </router-link>

          <router-link 
            to="/student/privacy-settings"
            class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-green-600 dark:text-green-400">privacy_tip</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Privacy Settings</span>
            </div>
            <span class="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </router-link>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const editing = ref(false);
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const formData = ref({
  fullName: '',
  phoneNumber: '',
  classOf: ''
});

const profilePhoto = ref(null);
const uploadingPhoto = ref(false);

const user = computed(() => authStore.user);

const avatarStyle = computed(() => {
  if (profilePhoto.value) {
    return `background-image: url('${profilePhoto.value}')`;
  }
  if (user.value?.profilePhoto) {
    return `background-image: url('${user.value.profilePhoto}')`;
  }
  return `background-image: url('https://ui-avatars.com/api/?name=${user.value?.fullName}&background=111827&color=fff&size=200')`;
});

const initializeFormData = () => {
  formData.value = {
    fullName: user.value?.fullName || '',
    phoneNumber: user.value?.phone || '',
    classOf: user.value?.classOf || 2026
  };
  profilePhoto.value = user.value?.profilePhoto || null;
};

// ... Navigation constants
const navigation = computed(() => [
  { path: '/student/dashboard', icon: 'dashboard', label: t('student.nav_dashboard') },
  { path: '/student/profile', icon: 'person', label: t('student.nav_profile') },
  { path: '/student/ticket', icon: 'qr_code_2', label: t('student.nav_ticket') },
  { path: '/student/seat-booking', icon: 'event_seat', label: t('student.nav_seats') },
  { path: '/student/gown-collection', icon: 'checkroom', label: t('student.nav_gown') },
  { path: '/student/booking-confirmation', icon: 'payments', label: t('student.nav_payments') },
  { path: '/student/chat', icon: 'support_agent', label: t('student.nav_chat') }
]);

const bottomNavigation = computed(() => [
  { path: '/student/dashboard', icon: 'dashboard', label: t('student.nav_home') },
  { path: '/student/ticket', icon: 'qr_code_2', label: t('student.nav_ticket_short') },
  { path: '/student/seat-booking', icon: 'event_seat', label: t('student.nav_seats_short') },
  { path: '/student/profile', icon: 'person', label: t('student.nav_profile') }
]);

const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showError('Please select an image file');
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showError('Image size must be less than 5MB');
    return;
  }

  uploadingPhoto.value = true;
  clearMessages();

  try {
    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target.result;
      profilePhoto.value = base64Image;

      // Upload to server
      try {
        const response = await api.put('/auth/profile', {
          profilePhoto: base64Image
        });

        if (response.data.success) {
          await authStore.refreshUser();
          showSuccess('Profile photo updated successfully!');
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
        showError(error.response?.data?.message || 'Failed to upload photo');
        profilePhoto.value = user.value?.profilePhoto || null;
      } finally {
        uploadingPhoto.value = false;
      }
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error reading file:', error);
    showError('Failed to read image file');
    uploadingPhoto.value = false;
  }
};

const handleUpdate = async () => {
  loading.value = true;
  clearMessages();

  try {
    const response = await api.put('/auth/profile', formData.value);
    
    if (response.data.success) {
      await authStore.refreshUser();
      showSuccess('Profile updated successfully!');
      editing.value = false;
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    showError(error.response?.data?.message || 'Failed to update profile');
  } finally {
    loading.value = false;
  }
};

const cancelEdit = () => {
  editing.value = false;
  initializeFormData();
  clearMessages();
};

const showSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => { successMessage.value = ''; }, 5000);
};

const showError = (message) => {
  errorMessage.value = message;
  setTimeout(() => { errorMessage.value = ''; }, 5000);
};

const clearMessages = () => {
  successMessage.value = '';
  errorMessage.value = '';
};

onMounted(() => {
  initializeFormData();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
