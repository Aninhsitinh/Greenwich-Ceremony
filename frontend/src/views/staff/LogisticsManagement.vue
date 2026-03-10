<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
    <!-- Sticky Top Navigation -->
    <div class="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 md:px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link to="/staff" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center">
           <span class="material-symbols-outlined">arrow_back</span>
        </router-link>
        <h1 class="text-xl font-black text-gray-900 dark:text-white">Logistics Management</h1>
      </div>
    </div>

    <!-- Main Content Flow -->
    <div class="w-full px-4 md:px-8 py-6 space-y-6">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 p-8 lg:p-10 shadow-2xl text-white">
        <div class="absolute inset-0">
          <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border-2 border-white/30">
              <span class="material-symbols-outlined text-4xl">inventory_2</span>
            </div>
            <div>
              <p class="text-white/80 text-sm font-semibold uppercase tracking-wider">Attendance & Logistics</p>
              <h1 class="text-4xl font-black">Item Collection</h1>
            </div>
          </div>
          <p class="text-white/90 text-lg max-w-2xl">Track and confirm invitation and wristband collection for students</p>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span class="material-symbols-outlined text-rose-500">search</span>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by student ID or name..."
              class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:border-rose-500 focus:bg-white transition-all text-gray-900 dark:text-white"
            />
          </div>
          <div class="flex gap-2">
            <select 
              v-model="filterStatus"
              class="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:border-rose-500 transition-all text-gray-900 dark:text-white"
            >
              <option value="all">All Collection Status</option>
              <option value="pending">Pending Any</option>
              <option value="completed">All Collected</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Student List -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Student</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Invitation</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Wristband</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Confirmation</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                <td colspan="5" class="px-6 py-4 h-16 bg-gray-50/50 dark:bg-gray-800/50"></td>
              </tr>
              <tr 
                v-else 
                v-for="reg in filteredRegistrations" 
                :key="reg.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                :class="{'opacity-50': processingId === reg.id}"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                      {{ reg.user?.fullName?.charAt(0) || '?' }}
                    </div>
                    <div>
                      <p class="font-bold text-gray-900 dark:text-white">{{ reg.user?.fullName }}</p>
                      <p class="text-xs text-gray-500 font-mono">{{ reg.user?.studentId }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <button 
                    @click="toggleItem(reg, 'invitation')"
                    :disabled="processingId === reg.id"
                    class="w-10 h-10 rounded-xl transition-all flex items-center justify-center mx-auto border-2 shadow-sm"
                    :class="reg.invitationCollected 
                      ? 'bg-emerald-500 border-emerald-600 text-white' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-300 hover:border-emerald-400'"
                  >
                    <span class="material-symbols-outlined">{{ reg.invitationCollected ? 'check_circle' : 'mail' }}</span>
                  </button>
                </td>
                <td class="px-6 py-4 text-center">
                  <button 
                    @click="toggleItem(reg, 'wristband')"
                    :disabled="processingId === reg.id"
                    class="w-10 h-10 rounded-xl transition-all flex items-center justify-center mx-auto border-2 shadow-sm"
                    :class="reg.wristbandCollected 
                      ? 'bg-blue-500 border-blue-600 text-white' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-300 hover:border-blue-400'"
                  >
                    <span class="material-symbols-outlined">{{ reg.wristbandCollected ? 'check_circle' : 'watch' }}</span>
                  </button>
                </td>
                <td class="px-6 py-4">
                  <div v-if="reg.collectionConfirmedAt" class="space-y-1">
                    <p class="text-xs font-bold text-gray-900 dark:text-white">
                      {{ formatDate(reg.collectionConfirmedAt) }}
                    </p>
                    <p class="text-[10px] text-gray-500">By: {{ reg.collectionConfirmedBy?.fullName || 'Staff' }}</p>
                  </div>
                  <span v-else class="text-[10px] text-gray-400 font-medium">Not confirmed</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button 
                    v-if="!reg.invitationCollected || !reg.wristbandCollected"
                    @click="collectAll(reg)"
                    :disabled="processingId === reg.id"
                    class="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black rounded-lg hover:scale-105 transition-all shadow-md"
                  >
                    Collect All
                  </button>
                  <span v-else class="text-emerald-500 font-black text-xs uppercase tracking-widest">
                    Completed
                  </span>
                </td>
              </tr>
              <tr v-if="!loading && filteredRegistrations.length === 0">
                <td colspan="5" class="px-6 py-20 text-center">
                  <span class="material-symbols-outlined text-gray-300 text-6xl mb-2">person_off</span>
                  <p class="text-gray-500 font-medium">No students found matching your search</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import socketService from '@/services/socketService';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();

const registrations = ref([]);
const loading = ref(true);
const processingId = ref(null);
const searchQuery = ref('');
const filterStatus = ref('all');

const filteredRegistrations = computed(() => {
  let filtered = registrations.value;
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r => 
      r.user?.fullName?.toLowerCase().includes(q) || 
      r.user?.studentId?.toLowerCase().includes(q)
    );
  }
  
  if (filterStatus.value === 'pending') {
    filtered = filtered.filter(r => !r.invitationCollected || !r.wristbandCollected);
  } else if (filterStatus.value === 'completed') {
    filtered = filtered.filter(r => r.invitationCollected && r.wristbandCollected);
  }
  
  return filtered;
});

const loadRegistrations = async () => {
  loading.value = true;
  try {
    const response = await api.get('/registrations', { params: { limit: 1000 } });
    if (response.data.success) {
      registrations.value = response.data.data.registrations || [];
    }
  } catch (error) {
    console.error('Error loading registrations:', error);
    toast.error('Failed to load students');
  } finally {
    loading.value = false;
  }
};

const toggleItem = async (reg, item) => {
  processingId.value = reg.id;
  try {
    const payload = {};
    if (item === 'invitation') payload.invitationCollected = !reg.invitationCollected;
    if (item === 'wristband') payload.wristbandCollected = !reg.wristbandCollected;
    
    const response = await api.patch(`/registrations/${reg.id}/logistics`, payload);
    if (response.data.success) {
      // Update local state
      const updated = response.data.data.registration;
      const index = registrations.value.findIndex(r => r.id === reg.id);
      if (index !== -1) {
        registrations.value[index] = { ...registrations.value[index], ...updated };
      }
      toast.success('Logistics status updated');
    }
  } catch (error) {
    console.error('Error toggling logistics:', error);
    toast.error('Failed to update status');
  } finally {
    processingId.value = null;
  }
};

const collectAll = async (reg) => {
  processingId.value = reg.id;
  try {
    const response = await api.patch(`/registrations/${reg.id}/logistics`, {
      invitationCollected: true,
      wristbandCollected: true
    });
    if (response.data.success) {
      const updated = response.data.data.registration;
      const index = registrations.value.findIndex(r => r.id === reg.id);
      if (index !== -1) {
        registrations.value[index] = { ...registrations.value[index], ...updated };
      }
      toast.success('All items marked as collected');
    }
  } catch (error) {
    console.error('Error collecting all:', error);
    toast.error('Failed to update status');
  } finally {
    processingId.value = null;
  }
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  loadRegistrations();
  
  // Real-time synchronization
  if (authStore.user) {
    socketService.emit('ceremony:join', { 
      role: authStore.user.role, 
      name: authStore.user.fullName 
    });
  }

  socketService.on('logistics:updated', (data) => {
    const index = registrations.value.findIndex(r => r.id === data.registrationId);
    if (index !== -1) {
      // Create a shallow copy and update specific fields
      registrations.value[index] = {
        ...registrations.value[index],
        invitationCollected: data.invitationCollected,
        wristbandCollected: data.wristbandCollected,
        collectionConfirmedAt: data.collectionConfirmedAt,
        collectionConfirmedBy: { fullName: data.confirmedBy }
      };
      
      // Flash the row (optional, can be handled by CSS if needed)
      toast.info(`Updated: ${data.studentName} collection state changed`, { 
        timeout: 2000,
        position: 'bottom-right'
      });
    }
  });
});
</script>

<style scoped>
</style>
