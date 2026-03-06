<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mt-6">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <span class="material-symbols-outlined text-white text-2xl">settings_system_daydream</span>
        </div>
        System Settings
      </h2>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>

    <form v-else @submit.prevent="saveSettings" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Ceremony Date -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ceremony Date & Time</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-blue-500">event</span>
            </div>
            <input
              v-model="settings.ceremonyDate"
              type="datetime-local"
              required
              class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-900 dark:text-white font-medium"
            />
          </div>
          <p class="text-xs text-gray-500 mt-2">This date controls the countdown timer on the student dashboard.</p>
        </div>

        <!-- Registration Deadline -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Registration Deadline</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-red-500">timer_off</span>
            </div>
            <input
              v-model="settings.registrationDeadline"
              type="datetime-local"
              required
              class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-red-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-900 dark:text-white font-medium"
            />
          </div>
        </div>

        <!-- Gown Collection Start -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gown Collection Start</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-amber-500">checkroom</span>
            </div>
            <input
              v-model="settings.gownCollectionStartDate"
              type="datetime-local"
              required
              class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-amber-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-900 dark:text-white font-medium"
            />
          </div>
        </div>

        <!-- Gown Collection End -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gown Collection End</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-amber-500">schedule</span>
            </div>
            <input
              v-model="settings.gownCollectionEndDate"
              type="datetime-local"
              required
              class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-amber-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-900 dark:text-white font-medium"
            />
          </div>
        </div>

        <!-- Ceremony Location -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ceremony Location</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-blue-500">location_on</span>
            </div>
            <input
              v-model="settings.ceremonyLocation"
              type="text"
              class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-900 dark:text-white font-medium"
              placeholder="e.g. University Arena"
            />
          </div>
          <div class="mt-2 relative">
             <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-blue-400 text-sm">link</span>
            </div>
            <input
              v-model="settings.ceremonyMapLink"
              type="url"
              class="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-700 dark:text-gray-300"
              placeholder="Google Maps Link"
            />
          </div>
        </div>

        <!-- Gown Collection Location -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gown Collection Location</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-amber-500">location_on</span>
            </div>
            <input
              v-model="settings.gownCollectionLocation"
              type="text"
              class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-amber-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-900 dark:text-white font-medium"
              placeholder="e.g. Building A, Room 101"
            />
          </div>
          <div class="mt-2 relative">
             <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-amber-400 text-sm">link</span>
            </div>
            <input
              v-model="settings.gownCollectionMapLink"
              type="url"
              class="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-amber-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-700 dark:text-gray-300"
              placeholder="Google Maps Link"
            />
          </div>
        </div>

        <!-- Rehearsal Date -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Rehearsal Date & Time</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-purple-500">event</span>
            </div>
            <input
              v-model="settings.rehearsalDate"
              type="datetime-local"
              class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-900 dark:text-white font-medium"
            />
          </div>
        </div>

        <!-- Rehearsal Location -->
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Rehearsal Location</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-purple-500">location_on</span>
            </div>
            <input
              v-model="settings.rehearsalLocation"
              type="text"
              class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-900 dark:text-white font-medium"
              placeholder="e.g. Main Hall"
            />
          </div>
           <div class="mt-2 relative">
             <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-purple-400 text-sm">link</span>
            </div>
            <input
              v-model="settings.rehearsalMapLink"
              type="url"
              class="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-700 dark:text-gray-300"
              placeholder="Google Maps Link"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <button
          type="submit"
          :disabled="saving"
          class="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-black text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined" v-if="!saving">save</span>
          <div v-else class="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          {{ saving ? 'Updating Settings...' : 'Update Settings' }}
        </button>
      </div>
    </form>
    
    <!-- Success Message -->
    <div 
        v-if="showSuccessMessage"
        class="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce z-50"
      >
        <span class="material-symbols-outlined text-3xl">check_circle</span>
        <div>
          <p class="font-bold">Settings Updated!</p>
          <p class="text-sm opacity-90">System configurations have been saved.</p>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const loading = ref(true);
const saving = ref(false);
const showSuccessMessage = ref(false);

const settings = ref({
  ceremonyDate: '',
  ceremonyLocation: '',
  ceremonyMapLink: '',
  registrationDeadline: '',
  gownCollectionStartDate: '',
  gownCollectionEndDate: '',
  gownCollectionLocation: '',
  gownCollectionMapLink: '',
  rehearsalDate: '',
  rehearsalLocation: '',
  rehearsalMapLink: ''
});

// Format date for datetime-local input
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().slice(0, 16);
};

// Load settings
const loadSettings = async () => {
  loading.value = true;
  try {
    const response = await api.get('/settings');
    if (response.data.success) {
      const data = response.data.data;
      settings.value = {
        ceremonyDate: formatDateForInput(data.ceremonyDate),
        ceremonyLocation: data.ceremonyLocation || '',
        ceremonyMapLink: data.ceremonyMapLink || '',
        registrationDeadline: formatDateForInput(data.registrationDeadline),
        gownCollectionStartDate: formatDateForInput(data.gownCollectionStartDate),
        gownCollectionEndDate: formatDateForInput(data.gownCollectionEndDate),
        gownCollectionLocation: data.gownCollectionLocation || '',
        gownCollectionMapLink: data.gownCollectionMapLink || '',
        rehearsalDate: formatDateForInput(data.rehearsalDate),
        rehearsalLocation: data.rehearsalLocation || '',
        rehearsalMapLink: data.rehearsalMapLink || ''
      };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  } finally {
    loading.value = false;
  }
};

// Save settings
const saveSettings = async () => {
  saving.value = true;
  try {
    const response = await api.put('/settings', settings.value);
    if (response.data.success) {
      showSuccessMessage.value = true;
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 3000);
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Failed to save settings');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>
