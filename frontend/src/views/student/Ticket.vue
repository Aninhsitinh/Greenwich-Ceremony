<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark pb-24">
    <!-- Premium Header with Glassmorphism -->
    <div class="sticky top-0 z-50 glass border-b border-white/10">
      <div class="flex items-center justify-between p-4 max-w-2xl mx-auto">
        <button @click="$router.back()" class="icon-container bg-primary/10 hover:bg-primary hover:text-white transition-all">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">My E-Ticket</h2>
        <button @click="downloadTicket" class="icon-container bg-primary/10 hover:bg-primary hover:text-white transition-all">
          <span class="material-symbols-outlined">download</span>
        </button>
      </div>
    </div>

    <div class="p-4 max-w-2xl mx-auto">
      <!-- No Ticket State - Premium Empty State -->
      <div v-if="!ticket && !loading" class="glass-card p-10 text-center">
        <div class="relative inline-block mb-6">
          <div class="w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-3xl flex items-center justify-center float">
            <span class="material-symbols-outlined text-5xl text-primary">confirmation_number</span>
          </div>
          <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-sm">add</span>
          </div>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Ticket Yet</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
          Complete your registration to unlock your digital graduation pass
        </p>
        <button 
          @click="generateTicket" 
          :disabled="generating" 
          class="btn btn-primary w-full max-w-xs mx-auto"
        >
          <span v-if="!generating" class="flex items-center gap-2">
            <span class="material-symbols-outlined">qr_code_2</span>
            Generate Ticket
          </span>
          <div v-else class="spinner"></div>
        </button>
      </div>

      <!-- Premium Ticket Display -->
      <div v-else-if="ticket" class="relative">
        <!-- Decorative Background Glow -->
        <div class="absolute -inset-4 bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-500/30 rounded-3xl blur-2xl opacity-60"></div>
        
        <div class="relative glass-card overflow-hidden">
          <!-- Ticket Header with Animated Gradient -->
          <div class="relative overflow-hidden">
            <div class="absolute inset-0 gradient-bg opacity-90"></div>
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
            
            <!-- Floating decorative elements -->
            <div class="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl float"></div>
            <div class="absolute bottom-4 left-4 w-16 h-16 bg-yellow-400/20 rounded-full blur-lg float" style="animation-delay: -1s"></div>
            
            <div class="relative z-10 p-8 text-white">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                    <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span class="text-xs font-semibold uppercase tracking-wider">Valid Entry</span>
                  </div>
                  <p class="text-sm opacity-90">FPT Greenwich University</p>
                  <h2 class="text-3xl font-bold mt-1">Graduation 2024</h2>
                </div>
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span class="material-symbols-outlined text-4xl">school</span>
                </div>
              </div>
              
              <div class="flex items-center gap-6 text-sm">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined">calendar_today</span>
                  <span>June 20, 2024</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined">schedule</span>
                  <span>9:30 AM</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ticket Cutout Decoration -->
          <div class="relative flex items-center justify-between px-2">
            <div class="w-6 h-6 bg-background-light dark:bg-background-dark rounded-full -ml-3"></div>
            <div class="flex-1 border-t-2 border-dashed border-gray-200 dark:border-gray-700 mx-2"></div>
            <div class="w-6 h-6 bg-background-light dark:bg-background-dark rounded-full -mr-3"></div>
          </div>

          <!-- QR Code Section - Premium Design -->
          <div class="p-8 flex flex-col items-center">
            <div class="relative">
              <!-- QR Glow Effect -->
              <div class="absolute -inset-4 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-3xl blur-xl"></div>
              
              <div class="relative qr-container bg-white p-6 rounded-2xl shadow-2xl">
                <img :src="ticket.qrCode" alt="QR Code" class="w-48 h-48" />
              </div>
            </div>
            
            <p class="text-sm font-mono text-gray-500 dark:text-gray-400 mt-6 tracking-wider">
              {{ ticket.ticketNumber }}
            </p>
            
            <div :class="[
              'mt-3 badge',
              ticket.isScanned ? 'badge-success' : 'badge-info'
            ]">
              <span class="material-symbols-outlined text-sm">{{ ticket.isScanned ? 'check_circle' : 'verified' }}</span>
              {{ ticket.isScanned ? 'SCANNED' : 'VALID' }}
            </div>
          </div>

          <!-- Ticket Details Grid -->
          <div class="grid grid-cols-2 gap-4 p-6 bg-gray-50 dark:bg-gray-800/50">
            <div class="glass-card !p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Student Name</p>
              <p class="font-bold text-gray-900 dark:text-white">{{ user?.fullName || 'N/A' }}</p>
            </div>
            <div class="glass-card !p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Student ID</p>
              <p class="font-bold text-gray-900 dark:text-white">{{ user?.studentId || 'N/A' }}</p>
            </div>
            <div class="glass-card !p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Seat Number</p>
              <p class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">event_seat</span>
                {{ ticket.seatNumber || 'TBA' }}
              </p>
            </div>
            <div class="glass-card !p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Ticket Type</p>
              <p class="font-bold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">confirmation_number</span>
                {{ ticket.ticketType }}
              </p>
            </div>
          </div>

          <!-- Scanned Info (if applicable) -->
          <div v-if="ticket.isScanned" class="p-4 border-t border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
            <div class="flex items-center gap-3">
              <div class="icon-container bg-green-500 text-white">
                <span class="material-symbols-outlined">check</span>
              </div>
              <div>
                <p class="text-sm font-semibold text-green-800 dark:text-green-400">Check-in Complete</p>
                <p class="text-xs text-green-600 dark:text-green-500">{{ formatDate(ticket.scannedAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Important Notes - Premium Alert -->
          <div class="m-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
            <div class="flex gap-3">
              <div class="icon-container bg-gradient-to-br from-amber-500 to-orange-500 text-white flex-shrink-0">
                <span class="material-symbols-outlined">info</span>
              </div>
              <div>
                <p class="text-sm font-bold text-amber-800 dark:text-amber-200 mb-2">Important Notes</p>
                <ul class="text-xs text-amber-700 dark:text-amber-300 space-y-2">
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">qr_code_scanner</span>
                    Present this QR code at the entrance
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">schedule</span>
                    Arrive 30 minutes before ceremony
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">screenshot</span>
                    Screenshot for offline access
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-2 gap-4 mt-6">
          <button @click="shareTicket" class="btn btn-glass">
            <span class="material-symbols-outlined">share</span>
            Share
          </button>
          <button @click="downloadTicket" class="btn btn-primary">
            <span class="material-symbols-outlined">download</span>
            Download
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="flex flex-col justify-center items-center h-64 gap-4">
        <div class="spinner spinner-primary w-10 h-10"></div>
        <p class="text-gray-500 dark:text-gray-400">Loading your ticket...</p>
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

const ticket = ref(null);
const loading = ref(false);
const generating = ref(false);

const fetchTicket = async () => {
  loading.value = true;
  try {
    const response = await api.get('/tickets/me');
    if (response.data.success && response.data.data.tickets.length > 0) {
      ticket.value = response.data.data.tickets[0];
    }
  } catch (error) {
    console.error('Error fetching ticket:', error);
  } finally {
    loading.value = false;
  }
};

const generateTicket = async () => {
  generating.value = true;
  try {
    const response = await api.post('/tickets/generate', {
      ticketType: 'student'
    });
    if (response.data.success) {
      ticket.value = response.data.data.ticket;
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to generate ticket. Please complete your registration first.');
  } finally {
    generating.value = false;
  }
};

const downloadTicket = () => {
  if (!ticket.value) return;
  
  const link = document.createElement('a');
  link.href = ticket.value.qrCode;
  link.download = `ticket-${ticket.value.ticketNumber}.png`;
  link.click();
};

const shareTicket = async () => {
  if (!ticket.value || !navigator.share) return;
  
  try {
    await navigator.share({
      title: 'My Graduation Ticket',
      text: `FPT Greenwich Graduation 2024 - Ticket: ${ticket.value.ticketNumber}`,
      url: window.location.href
    });
  } catch (err) {
    console.log('Share cancelled or failed');
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchTicket();
});
</script>

<style scoped>
.qr-container {
  position: relative;
}

.qr-container::before {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(135deg, #0a47c2, #6366f1, #8b5cf6);
  border-radius: 1.25rem;
  z-index: -1;
}
</style>
