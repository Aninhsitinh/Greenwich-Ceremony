<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    page-title="Seat Management"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Seat Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage guest seat assignments</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <span class="material-symbols-outlined text-4xl opacity-80 mb-2">event_seat</span>
          <p class="text-3xl font-bold mb-1">{{ totalSeats }}</p>
          <p class="text-sm text-blue-100">Total Seats</p>
        </div>
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <span class="material-symbols-outlined text-4xl opacity-80 mb-2">check_circle</span>
          <p class="text-3xl font-bold mb-1">{{ bookedSeats }}</p>
          <p class="text-sm text-green-100">Booked</p>
        </div>
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
          <span class="material-symbols-outlined text-4xl opacity-80 mb-2">pending</span>
          <p class="text-3xl font-bold mb-1">{{ availableSeats }}</p>
          <p class="text-sm text-orange-100">Available</p>
        </div>
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <span class="material-symbols-outlined text-4xl opacity-80 mb-2">percent</span>
          <p class="text-3xl font-bold mb-1">{{ occupancyRate }}%</p>
          <p class="text-sm text-purple-100">Occupancy</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button class="flex items-center gap-3 px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <span class="material-symbols-outlined text-blue-600 text-2xl">add_circle</span>
            <div class="text-left">
              <p class="font-semibold text-blue-900 dark:text-blue-400">Assign Seat</p>
              <p class="text-xs text-blue-700 dark:text-blue-500">Manually assign seat</p>
            </div>
          </button>
          <button class="flex items-center gap-3 px-6 py-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <span class="material-symbols-outlined text-green-600 text-2xl">swap_horiz</span>
            <div class="text-left">
              <p class="font-semibold text-green-900 dark:text-green-400">Swap Seats</p>
              <p class="text-xs text-green-700 dark:text-green-500">Exchange seat assignments</p>
            </div>
          </button>
          <button class="flex items-center gap-3 px-6 py-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <span class="material-symbols-outlined text-purple-600 text-2xl">visibility</span>
            <div class="text-left">
              <p class="font-semibold text-purple-900 dark:text-purple-400">View Layout</p>
              <p class="text-xs text-purple-700 dark:text-purple-500">See full seating map</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Recent Assignments -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Recent Assignments</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Seat</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Guest</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Student</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Time</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="assignment in assignments" :key="assignment.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4">
                  <span class="font-mono font-bold text-primary">{{ assignment.seatNumber }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-gray-900 dark:text-white">{{ assignment.guestName }}</span>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ assignment.studentName }}</p>
                    <p class="text-xs text-gray-500">{{ assignment.studentId }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ assignment.assignedAt }}</span>
                </td>
                <td class="px-6 py-4">
                  <button class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Remove">
                    <span class="material-symbols-outlined text-lg">close</span>
                  </button>
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
import { ref, computed } from 'vue';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

const navigation = [
  { path: '/staff', icon: 'dashboard', label: 'Dashboard' },
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: 'QR Scanner' },
  { path: '/staff/gown-collection', icon: 'checkroom', label: 'Gown Collection' },
  { path: '/staff/seat-management', icon: 'event_seat', label: 'Seat Management' },
  { path: '/staff/student-list', icon: 'group', label: 'Student List' },
  { path: '/staff/settings', icon: 'settings', label: 'Settings' }
];

const bottomNavigation = [
  { path: '/staff', icon: 'home', label: 'Home' },
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: 'Scanner' },
  { path: '/staff/student-list', icon: 'group', label: 'Students' },
  { path: '/staff/settings', icon: 'settings', label: 'Settings' }
];

const totalSeats = ref(300);
const bookedSeats = ref(180);
const availableSeats = computed(() => totalSeats.value - bookedSeats.value);
const occupancyRate = computed(() => Math.round((bookedSeats.value / totalSeats.value) * 100));

const assignments = ref([
  {
    id: 1,
    seatNumber: 'A-15',
    guestName: 'Mrs. Jane Doe',
    studentName: 'John Doe',
    studentId: 'GCS220001',
    assignedAt: '10:30 AM'
  },
  {
    id: 2,
    seatNumber: 'B-22',
    guestName: 'Mr. Robert Smith',
    studentName: 'Jane Smith',
    studentId: 'GCS220002',
    assignedAt: '11:15 AM'
  }
]);
</script>
