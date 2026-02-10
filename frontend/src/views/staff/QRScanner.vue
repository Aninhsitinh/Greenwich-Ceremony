<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark pb-24">
    <!-- Header -->
    <div class="sticky top-0 z-50 flex items-center bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 p-4 justify-between">
      <button @click="$router.back()" class="flex size-10 items-center justify-center rounded-lg text-gray-600 dark:text-gray-300">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h2 class="text-primary dark:text-blue-400 text-lg font-bold">QR Code Scanner</h2>
      <div class="w-10"></div>
    </div>

    <div class="p-4 max-w-2xl mx-auto">
      <!-- Scanner Stats -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ scannedToday }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Scanned Today</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ totalValid }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Valid Tickets</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ totalInvalid }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Invalid</p>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="scanResult && scanResult.success" class="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-pulse">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
          <div>
            <p class="text-green-600 dark:text-green-400 font-bold">✓ Ticket Valid!</p>
            <p class="text-sm text-green-700 dark:text-green-300">{{ scanResult.message }}</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="scanResult && !scanResult.success" class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-red-600 text-3xl">cancel</span>
          <div>
            <p class="text-red-600 dark:text-red-400 font-bold">✗ Invalid Ticket</p>
            <p class="text-sm text-red-700 dark:text-red-300">{{ scanResult.message }}</p>
          </div>
        </div>
      </div>

      <!-- Scanner Input -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Scan Ticket</h3>
        
        <!-- QR Scanner Placeholder -->
        <div class="mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-8 text-center">
          <div class="flex flex-col items-center gap-4">
            <div class="w-32 h-32 border-4 border-dashed border-primary rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined text-6xl text-primary">qr_code_scanner</span>
            </div>
            <p class="text-gray-600 dark:text-gray-400">Camera scanner coming soon</p>
            <p class="text-xs text-gray-500 dark:text-gray-500">Use manual input below for now</p>
          </div>
        </div>

        <!-- Manual Input -->
        <form @submit.prevent="handleScan" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ticket Number
            </label>
            <input
              v-model="ticketNumber"
              ref="ticketInput"
              required
              type="text"
              placeholder="GRAD-2024-XXXXXXXXXX-XXX"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white font-mono text-sm"
              @input="ticketNumber = ticketNumber.toUpperCase()"
            />
            <p class="text-xs text-gray-500 mt-1">Paste or type the ticket number</p>
          </div>

          <button
            type="submit"
            :disabled="scanning || !ticketNumber"
            class="w-full px-6 py-4 bg-primary text-white rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            <span v-if="!scanning" class="flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">qr_code_scanner</span>
              Scan Ticket
            </span>
            <div v-else class="spinner mx-auto"></div>
          </button>
        </form>
      </div>

      <!-- Scanned Ticket Details -->
      <div v-if="lastScannedTicket" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Last Scanned Ticket</h3>
        
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Student Name</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ lastScannedTicket.userId?.fullName }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Student ID</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ lastScannedTicket.userId?.studentId }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Ticket Number</span>
            <span class="font-mono text-xs text-gray-900 dark:text-white">{{ lastScannedTicket.ticketNumber }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Seat Number</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ lastScannedTicket.seatNumber || 'N/A' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Scanned At</span>
            <span class="text-sm text-gray-900 dark:text-white">{{ formatTime(lastScannedTicket.scannedAt) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Scanned By</span>
            <span class="text-sm text-gray-900 dark:text-white">{{ user?.fullName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const ticketNumber = ref('');
const ticketInput = ref(null);
const scanning = ref(false);
const scanResult = ref(null);
const lastScannedTicket = ref(null);

const scannedToday = ref(0);
const totalValid = ref(0);
const totalInvalid = ref(0);

const handleScan = async () => {
  scanning.value = true;
  scanResult.value = null;

  try {
    const response = await api.post('/tickets/scan', {
      ticketNumber: ticketNumber.value.trim()
    });

    if (response.data.success) {
      scanResult.value = {
        success: true,
        message: `Ticket scanned successfully for ${response.data.data.ticket.userId?.fullName}`
      };
      lastScannedTicket.value = response.data.data.ticket;
      totalValid.value++;
      scannedToday.value++;

      // Play success sound (if available)
      playSound('success');

      // Clear after 3 seconds
      setTimeout(() => {
        scanResult.value = null;
        ticketNumber.value = '';
        ticketInput.value?.focus();
      }, 3000);
    }
  } catch (error) {
    scanResult.value = {
      success: false,
      message: error.response?.data?.message || 'Invalid or already scanned ticket'
    };
    totalInvalid.value++;

    // Play error sound (if available)
    playSound('error');

    // Clear after 3 seconds
    setTimeout(() => {
      scanResult.value = null;
      ticketNumber.value = '';
      ticketInput.value?.focus();
    }, 3000);
  } finally {
    scanning.value = false;
  }
};

const playSound = (type) => {
  // Optional: Implement sound feedback
  if (type === 'success') {
    // Play success beep
  } else {
    // Play error buzzer
  }
};

const formatTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  // Focus input on mount
  ticketInput.value?.focus();

  // Fetch today's stats
  // TODO: Implement stats API
});
</script>
