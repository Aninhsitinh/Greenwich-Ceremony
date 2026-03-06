<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('admin.seat_management')"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Seat Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Configure seating layout and manage seat assignments</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-blue-600 text-3xl">event_seat</span>
            <Badge variant="info">Total</Badge>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ totalSeats }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Total Seats</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
            <Badge variant="success">Booked</Badge>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ bookedSeats }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Booked</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-orange-600 text-3xl">pending</span>
            <Badge variant="warning">Available</Badge>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ availableSeats }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Available</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-purple-600 text-3xl">percent</span>
            <Badge variant="default">Occupancy</Badge>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ occupancyRate }}%</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
        </div>
      </div>

      <!-- Seating Layout -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Seating Layout</h2>
          <div class="flex gap-2">
            <button
              @click="showLayoutEditor = true"
              class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <span class="material-symbols-outlined">edit</span>
              <span class="hidden sm:inline">Edit Layout</span>
            </button>
            <button class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
              <span class="material-symbols-outlined">save</span>
              <span class="hidden sm:inline">Save Changes</span>
            </button>
          </div>
        </div>

        <!-- Stage -->
        <div class="mb-8">
          <div class="bg-gradient-to-r from-gray-700 to-gray-800 text-white text-center py-4 rounded-xl shadow-lg">
            <span class="material-symbols-outlined text-4xl mb-2">stage</span>
            <p class="font-bold text-lg">STAGE</p>
          </div>
        </div>

        <!-- Seating Grid -->
        <div class="space-y-4">
          <div v-for="section in sections" :key="section.name" class="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h3 class="font-bold text-gray-900 dark:text-white mb-4 text-center">{{ section.name }}</h3>
            <div class="grid gap-2" :style="{ gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))` }">
              <button
                v-for="seat in section.seats"
                :key="seat.id"
                @click="selectSeat(seat)"
                :class="[
                  'aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all',
                  seat.status === 'booked' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 cursor-not-allowed' :
                  seat.status === 'reserved' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:border-primary border-2 border-transparent'
                ]"
                :disabled="seat.status === 'booked'"
              >
                <span class="material-symbols-outlined text-lg">{{ seat.status === 'booked' ? 'person' : 'event_seat' }}</span>
                <span class="mt-1">{{ seat.number }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="mt-6 flex flex-wrap gap-4 justify-center">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-gray-300"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Available</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Reserved</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Booked</span>
          </div>
        </div>
      </div>

      <!-- Seat Assignments -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Seat Assignments</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Seat</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Guest Name</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Student</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Assigned</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="assignment in recentAssignments" :key="assignment.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                  <button
                    @click="unassignSeat(assignment)"
                    class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    title="Unassign"
                  >
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
import Badge from '@/components/Badge.vue';

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

const showLayoutEditor = ref(false);

const sections = ref([
  {
    name: 'Section A - VIP',
    columns: 10,
    seats: Array.from({ length: 50 }, (_, i) => ({
      id: `A-${i + 1}`,
      number: `A-${i + 1}`,
      status: i < 30 ? 'booked' : i < 40 ? 'reserved' : 'available'
    }))
  },
  {
    name: 'Section B - General',
    columns: 12,
    seats: Array.from({ length: 60 }, (_, i) => ({
      id: `B-${i + 1}`,
      number: `B-${i + 1}`,
      status: i < 20 ? 'booked' : i < 35 ? 'reserved' : 'available'
    }))
  }
]);

const recentAssignments = ref([
  {
    id: 1,
    seatNumber: 'A-15',
    guestName: 'Mrs. Jane Doe',
    studentName: 'John Doe',
    studentId: 'GCS220001',
    assignedAt: '2026-06-10 10:30'
  },
  {
    id: 2,
    seatNumber: 'B-22',
    guestName: 'Mr. Robert Smith',
    studentName: 'Jane Smith',
    studentId: 'GCS220002',
    assignedAt: '2026-06-10 11:15'
  }
]);

const totalSeats = computed(() => {
  return sections.value.reduce((sum, section) => sum + section.seats.length, 0);
});

const bookedSeats = computed(() => {
  return sections.value.reduce((sum, section) => 
    sum + section.seats.filter(s => s.status === 'booked').length, 0
  );
});

const availableSeats = computed(() => {
  return sections.value.reduce((sum, section) => 
    sum + section.seats.filter(s => s.status === 'available').length, 0
  );
});

const occupancyRate = computed(() => {
  return Math.round((bookedSeats.value / totalSeats.value) * 100);
});

const selectSeat = (seat) => {
  if (seat.status === 'booked') return;
  console.log('Selected seat:', seat.number);
};

const unassignSeat = (assignment) => {
  if (confirm(`Unassign seat ${assignment.seatNumber}?`)) {
    recentAssignments.value = recentAssignments.value.filter(a => a.id !== assignment.id);
  }
};
</script>
