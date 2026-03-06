<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('admin.ticket_management')"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ticket Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage and verify ceremony tickets</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <span class="material-symbols-outlined text-4xl opacity-80 mb-2">confirmation_number</span>
          <p class="text-3xl font-bold mb-1">{{ totalTickets }}</p>
          <p class="text-sm text-purple-100">Total Tickets</p>
        </div>
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <span class="material-symbols-outlined text-4xl opacity-80 mb-2">verified</span>
          <p class="text-3xl font-bold mb-1">{{ verifiedTickets }}</p>
          <p class="text-sm text-green-100">Verified</p>
        </div>
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <span class="material-symbols-outlined text-4xl opacity-80 mb-2">qr_code</span>
          <p class="text-3xl font-bold mb-1">{{ activeTickets }}</p>
          <p class="text-sm text-blue-100">Active</p>
        </div>
        <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white shadow-lg">
          <span class="material-symbols-outlined text-4xl opacity-80 mb-2">block</span>
          <p class="text-3xl font-bold mb-1">{{ invalidTickets }}</p>
          <p class="text-sm text-red-100">Invalid</p>
        </div>
      </div>

      <!-- QR Scanner -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Verify</h2>
        <div class="flex gap-4">
          <input
            v-model="ticketCode"
            type="text"
            placeholder="Enter ticket code or scan QR..."
            class="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
            @keyup.enter="verifyTicket"
          />
          <button
            @click="verifyTicket"
            class="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 flex items-center gap-2"
          >
            <span class="material-symbols-outlined">qr_code_scanner</span>
            <span class="hidden sm:inline">Verify</span>
          </button>
        </div>
        
        <!-- Verification Result -->
        <div v-if="verificationResult" class="mt-4 p-4 rounded-xl" :class="verificationResult.valid ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500' : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-3xl" :class="verificationResult.valid ? 'text-green-600' : 'text-red-600'">
              {{ verificationResult.valid ? 'check_circle' : 'cancel' }}
            </span>
            <div class="flex-1">
              <h3 class="font-bold text-lg mb-1" :class="verificationResult.valid ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'">
                {{ verificationResult.valid ? 'Valid Ticket' : 'Invalid Ticket' }}
              </h3>
              <p class="text-sm" :class="verificationResult.valid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                {{ verificationResult.message }}
              </p>
              <div v-if="verificationResult.valid && verificationResult.ticket" class="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="font-semibold">Student:</span> {{ verificationResult.ticket.studentName }}
                </div>
                <div>
                  <span class="font-semibold">ID:</span> {{ verificationResult.ticket.studentId }}
                </div>
                <div>
                  <span class="font-semibold">Seat:</span> {{ verificationResult.ticket.seatNumber || 'Not assigned' }}
                </div>
                <div>
                  <span class="font-semibold">Status:</span> {{ verificationResult.ticket.status }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tickets Table -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">All Tickets</h2>
            <button class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
              <span class="material-symbols-outlined">download</span>
              <span class="hidden sm:inline">Export</span>
            </button>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 Search tickets..."
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Ticket ID</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Student</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">QR Code</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Seat</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="ticket in filteredTickets"
                :key="ticket._id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td class="px-6 py-4">
                  <span class="font-mono text-sm text-gray-900 dark:text-white">{{ ticket.ticketNumber }}</span>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ ticket.student?.fullName }}</p>
                    <p class="text-xs text-gray-500">{{ ticket.student?.studentId }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <img :src="ticket.qrCode" alt="QR Code" class="w-16 h-16 rounded" />
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-900 dark:text-white">{{ ticket.seatNumber || 'Not assigned' }}</span>
                </td>
                <td class="px-6 py-4">
                  <Badge :variant="ticket.isValid ? 'success' : 'error'">
                    {{ ticket.isValid ? 'Valid' : 'Invalid' }}
                  </Badge>
                </td>
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <button
                      @click="viewTicket(ticket)"
                      class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      title="View"
                    >
                      <span class="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    <button
                      @click="downloadTicket(ticket)"
                      class="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                      title="Download"
                    >
                      <span class="material-symbols-outlined text-lg">download</span>
                    </button>
                    <button
                      v-if="ticket.isValid"
                      @click="invalidateTicket(ticket)"
                      class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title="Invalidate"
                    >
                      <span class="material-symbols-outlined text-lg">block</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import Badge from '@/components/Badge.vue';
import api from '@/services/api';

const navigation = [
  { path: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { path: '/admin/students', icon: 'group', label: 'Student Management' },
  { path: '/admin/registrations', icon: 'how_to_reg', label: 'Registrations' },
  { path: '/admin/tickets', icon: 'confirmation_number', label: 'Ticket Management' },
  { path: '/admin/seats', icon: 'event_seat', label: 'Seat Management' },
  { path: '/admin/announcements', icon: 'campaign', label: 'Announcements' },
  { path: '/admin/settings', icon: 'settings', label: 'System Settings' }
];

const bottomNavigation = [
  { path: '/admin', icon: 'home', label: 'Home' },
  { path: '/admin/students', icon: 'group', label: 'Students' },
  { path: '/admin/registrations', icon: 'how_to_reg', label: 'Register' },
  { path: '/admin/settings', icon: 'settings', label: 'Settings' }
];

const tickets = ref([]);
const searchQuery = ref('');
const ticketCode = ref('');
const verificationResult = ref(null);

const filteredTickets = computed(() => {
  if (!searchQuery.value) return tickets.value;
  const query = searchQuery.value.toLowerCase();
  return tickets.value.filter(t =>
    t.ticketNumber?.toLowerCase().includes(query) ||
    t.student?.fullName?.toLowerCase().includes(query) ||
    t.student?.studentId?.toLowerCase().includes(query)
  );
});

const totalTickets = computed(() => tickets.value.length);
const verifiedTickets = computed(() => tickets.value.filter(t => t.isVerified).length);
const activeTickets = computed(() => tickets.value.filter(t => t.isValid).length);
const invalidTickets = computed(() => tickets.value.filter(t => !t.isValid).length);

const fetchTickets = async () => {
  try {
    const response = await api.get('/tickets');
    tickets.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching tickets:', error);
    // Mock data
    tickets.value = [
      {
        _id: '1',
        ticketNumber: 'TKT-2026-001',
        student: {
          fullName: 'John Doe',
          studentId: 'GCS220001'
        },
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=TKT-2026-001',
        seatNumber: 'A-15',
        isValid: true,
        isVerified: false
      }
    ];
  }
};

const verifyTicket = async () => {
  if (!ticketCode.value.trim()) return;
  
  try {
    const response = await api.post('/tickets/verify', { ticketCode: ticketCode.value });
    verificationResult.value = {
      valid: true,
      message: 'Ticket verified successfully!',
      ticket: response.data.data
    };
  } catch (error) {
    verificationResult.value = {
      valid: false,
      message: error.response?.data?.message || 'Invalid or expired ticket'
    };
  }
  
  setTimeout(() => {
    verificationResult.value = null;
    ticketCode.value = '';
  }, 5000);
};

const viewTicket = (ticket) => {
  alert(`Viewing ticket: ${ticket.ticketNumber}`);
};

const downloadTicket = (ticket) => {
  alert(`Downloading ticket: ${ticket.ticketNumber}`);
};

const invalidateTicket = async (ticket) => {
  if (confirm(`Are you sure you want to invalidate ticket ${ticket.ticketNumber}?`)) {
    try {
      await api.patch(`/tickets/${ticket._id}`, { isValid: false });
      ticket.isValid = false;
    } catch (error) {
      console.error('Error invalidating ticket:', error);
      alert('Failed to invalidate ticket');
    }
  }
};

onMounted(() => {
  fetchTickets();
});
</script>
