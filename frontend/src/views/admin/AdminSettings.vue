<template>
  <div class="w-full max-w-4xl mx-auto space-y-6">
    
    <!-- Profile Header / Hero -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col md:flex-row items-center gap-8">
        
        <!-- Avatar Section -->
        <div class="relative group">
          <div class="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-indigo-600">
            <div 
              class="w-full h-full rounded-full bg-cover bg-center border-4 border-white dark:border-gray-800"
              :style="avatarStyle"
            ></div>
          </div>
          
          <!-- Upload Button -->
          <button 
            @click="$refs.fileInput.click()"
            class="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
            :class="{ 'opacity-50 cursor-wait': uploadingPhoto }"
            :disabled="uploadingPhoto"
          >
            <span class="material-symbols-outlined text-lg">photo_camera</span>
          </button>
          <input 
            ref="fileInput" 
            type="file" 
            accept="image/*" 
            @change="handlePhotoUpload" 
            class="hidden"
          />
        </div>

        <div class="text-center md:text-left flex-1">
          <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-2">{{ profile?.fullName || 'Loading...' }}</h1>
          <p class="text-gray-500 dark:text-gray-400 mb-4">{{ profile?.email }}</p>
          <div class="flex flex-wrap justify-center md:justify-start gap-2">
            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider">
              {{ profile?.role || 'Admin' }}
            </span>
             <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-wider">
                Active
              </span>
          </div>
        </div>

        <div class="flex flex-col gap-3 w-full md:w-auto">
          <button
            v-if="!isEditing"
            @click="startEdit"
            class="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-lg">edit</span>
            Edit Profile
          </button>
          <button
            @click="openPasswordModal"
            class="px-6 py-2.5 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-lg">lock</span>
            Change Password
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Mode - Form -->
    <div v-if="isEditing" class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div class="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
        <span class="material-symbols-outlined text-gray-900 dark:text-white">edit_square</span>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Edit Information</h2>
      </div>

      <form @submit.prevent="saveProfile" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              v-model="editForm.fullName"
              type="text"
              required
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input
              v-model="editForm.phone"
              type="tel"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              v-model="editForm.email"
              type="email"
              disabled
              class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-not-allowed opacity-70"
            />
            <p class="text-xs text-gray-500 mt-1">Email cannot be changed contact support.</p>
          </div>
        </div>

        <div class="flex items-center gap-4 pt-4">
          <button
            type="submit"
            :disabled="saving"
            class="flex-1 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <div v-if="saving" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span v-else>Save Changes</span>
          </button>
          <button
            type="button"
            @click="cancelEdit"
            :disabled="saving"
            class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Success Message -->
    <div 
      v-if="showSuccessMessage"
      class="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce z-50"
    >
      <span class="material-symbols-outlined text-2xl">check_circle</span>
      <div>
        <p class="font-bold">Success!</p>
        <p class="text-sm opacity-90">{{ successMessageText }}</p>
      </div>
    </div>

    <!-- System Settings Section -->
    <SystemSettings />

    <!-- Password Change Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined">lock_reset</span>
            Change Password
          </h3>
          <button @click="closePasswordModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="passwordError" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center gap-2">
          <span class="material-symbols-outlined text-lg">error</span>
          {{ passwordError }}
        </div>
         <div v-if="passwordSuccess" class="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm font-medium flex items-center gap-2">
          <span class="material-symbols-outlined text-lg">check_circle</span>
          {{ passwordSuccess }}
        </div>

        <!-- Step 1: Request OTP -->
        <div v-if="passwordStep === 1" class="text-center space-y-4">
             <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                <span class="material-symbols-outlined text-3xl text-gray-600 dark:text-gray-400">mail</span>
             </div>
             <p class="text-gray-600 dark:text-gray-300 text-sm">
                We will send a verification code to:<br>
                <span class="font-bold text-gray-900 dark:text-white">{{ profile?.email }}</span>
             </p>
             <button 
                @click="handleRequestOTP" 
                :disabled="changingPassword"
                class="w-full px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold hover:opacity-90 flex items-center justify-center gap-2"
             >
                <span v-if="changingPassword" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                <span v-else>Send Code</span>
             </button>
        </div>

        <!-- Step 2: Verify OTP -->
        <form v-else-if="passwordStep === 2" @submit.prevent="handleVerifyOTP" class="space-y-4">
           <div class="text-center">
               <p class="text-sm text-gray-500 dark:text-gray-400">Enter code sent to {{ profile?.email }}</p>
           </div>
           <input
              v-model="passwordOtp"
              type="text"
              required
              maxlength="6"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none font-mono text-xl text-center tracking-widest"
              placeholder="000000"
              @input="passwordOtp = passwordOtp.replace(/[^0-9]/g, '')"
           />
           <div class="flex gap-3">
              <button 
                 type="button" 
                 @click="passwordStep = 1"
                 class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                 Back
              </button>
              <button 
                 type="submit" 
                 :disabled="changingPassword || passwordOtp.length !== 6"
                 class="flex-1 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold hover:opacity-90 flex items-center justify-center gap-2"
              >
                 <span v-if="changingPassword" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                 <span v-else>Verify</span>
              </button>
           </div>
        </form>

        <!-- Step 3: New Password -->
        <form v-else-if="passwordStep === 3" @submit.prevent="handleResetPassword" class="space-y-4">
           <div>
             <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
             <input 
               v-model="passwordForm.newPassword"
               type="password" 
               required
               minlength="6"
               class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none"
             />
           </div>
           <div>
             <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
             <input 
               v-model="passwordForm.confirmPassword"
               type="password" 
               required
               class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none"
             />
           </div>
           <div class="pt-2">
             <button 
               type="submit" 
               :disabled="changingPassword"
               class="w-full px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold hover:opacity-90 flex items-center justify-center gap-2"
             >
               <div v-if="changingPassword" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
               <span v-else>Update Password</span>
             </button>
           </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import SystemSettings from '@/components/SystemSettings.vue';
import api from '@/services/api';
import { authService } from '@/services/authService';

const authStore = useAuthStore();

// State
const loading = ref(true);
const saving = ref(false);
const isEditing = ref(false);
const profile = ref(null);
const showSuccessMessage = ref(false);
const successMessageText = ref('Your changes have been saved successfully');

// Password Change State
const showPasswordModal = ref(false);
const passwordStep = ref(1);
const passwordOtp = ref('');
const resetToken = ref('');
const passwordForm = ref({
  newPassword: '',
  confirmPassword: ''
});
const changingPassword = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

// Photo Upload State
const fileInput = ref(null);
const uploadingPhoto = ref(false);

const editForm = ref({
  fullName: '',
  email: '',
  phone: ''
});

const avatarStyle = computed(() => {
  if (profile.value?.profilePhoto) {
    return `background-image: url('${profile.value.profilePhoto}')`;
  }
  return `background-image: url('https://ui-avatars.com/api/?name=${profile.value?.fullName || 'Admin'}&background=3b82f6&color=fff&size=200')`;
});

// Load profile
const loadProfile = async () => {
  loading.value = true;
  try {
    const response = await api.get('/auth/me');
    if (response.data.success) {
      profile.value = response.data.data.user;
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  } finally {
    loading.value = false;
  }
};

// Start editing
const startEdit = () => {
  editForm.value = {
    fullName: profile.value?.fullName || '',
    email: profile.value?.email || '',
    phone: profile.value?.phone || ''
  };
  isEditing.value = true;
};

// Cancel editing
const cancelEdit = () => {
  isEditing.value = false;
  editForm.value = { fullName: '', email: '', phone: '' };
};

// Save profile
const saveProfile = async () => {
  saving.value = true;
  try {
    const response = await api.put('/auth/profile', {
        fullName: editForm.value.fullName,
        phone: editForm.value.phone
    });
    if (response.data.success) {
      profile.value = response.data.data.user;
      authStore.user = response.data.data.user; // Update store
      isEditing.value = false;
      showSuccess('Profile Updated!', 'Your changes have been saved successfully');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Failed to update profile. Please try again.');
  } finally {
    saving.value = false;
  }
};

// Handle Photo Upload
const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Image size must be less than 5MB');
    return;
  }

  uploadingPhoto.value = true;

  try {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target.result;
      
      try {
        const response = await api.put('/auth/profile', {
          profilePhoto: base64Image
        });

        if (response.data.success) {
          profile.value = response.data.data.user;
          authStore.user = response.data.data.user;
          showSuccess('Photo Updated!', 'Your profile photo has been updated');
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo');
      } finally {
        uploadingPhoto.value = false;
      }
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error reading file:', error);
    uploadingPhoto.value = false;
  }
};

// Password Change Logic
const openPasswordModal = () => {
  passwordForm.value = { newPassword: '', confirmPassword: '' };
  passwordOtp.value = '';
  resetToken.value = '';
  passwordStep.value = 1;
  passwordError.value = '';
  passwordSuccess.value = '';
  showPasswordModal.value = true;
};

const closePasswordModal = () => {
  showPasswordModal.value = false;
};

// Step 1: Request OTP
const handleRequestOTP = async () => {
    changingPassword.value = true;
    passwordError.value = '';
    passwordSuccess.value = '';

    try {
        await authService.forgotPassword(profile.value.email);
        passwordSuccess.value = 'OTP sent!';
        setTimeout(() => {
            passwordStep.value = 2;
            passwordSuccess.value = '';
        }, 1000);
    } catch (error) {
        passwordError.value = error.response?.data?.message || 'Failed to send OTP.';
    } finally {
        changingPassword.value = false;
    }
};

// Step 2: Verify OTP
const handleVerifyOTP = async () => {
    changingPassword.value = true;
    passwordError.value = '';

    try {
        const response = await authService.verifyOTP(profile.value.email, passwordOtp.value);
        if (response.data && response.data.resetToken) {
            resetToken.value = response.data.resetToken;
            passwordStep.value = 3;
            passwordSuccess.value = '';
        } else {
            throw new Error('Invalid response');
        }
    } catch (error) {
        passwordError.value = error.response?.data?.message || 'Invalid OTP code.';
    } finally {
        changingPassword.value = false;
    }
};

// Step 3: Reset Password
const handleResetPassword = async () => {
    passwordError.value = '';
    
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordError.value = 'Passwords do not match';
        return;
    }

    if (passwordForm.value.newPassword.length < 6) {
        passwordError.value = 'Password must be at least 6 characters';
        return;
    }

    changingPassword.value = true;

    try {
        await authService.resetPassword(profile.value.email, resetToken.value, passwordForm.value.newPassword);
        showSuccess('Password Changed!', 'Your password has been updated successfully');
        closePasswordModal();
    } catch (error) {
        passwordError.value = error.response?.data?.message || 'Failed to change password';
    } finally {
        changingPassword.value = false;
    }
};

const showSuccess = (title, message) => {
  successMessageText.value = message;
  showSuccessMessage.value = true;
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
};

onMounted(() => {
  loadProfile();
});

onActivated(() => {
  loadProfile();
});
</script>
