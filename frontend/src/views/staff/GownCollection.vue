<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    page-title="Gown Collection"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 lg:p-8 text-white mb-6 shadow-xl">
        <h1 class="text-3xl font-bold mb-2">Gown Collection Management</h1>
        <p class="text-purple-100">Track and manage graduation gown distribution</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl text-green-600">checkroom</span>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ stats.collected }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Collected</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl text-orange-600">pending</span>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ stats.pending }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Pending</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl text-blue-600">inventory</span>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ stats.available }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Available</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl text-purple-600">percent</span>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ collectionRate }}%</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Collection Rate</p>
        </div>
      </div>

      <!-- Search and Scanner -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Mark as Collected</h2>
        <div class="flex gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Enter Student ID or Ticket Number..."
            class="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
          />
          <button
            @click="markCollected"
            class="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90"
          >
            <span class="material-symbols-outlined">checkroom</span>
          </button>
        </div>
      </div>

      <!-- Collection List -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Recent Collections</h2>
          <div class="flex gap-2">
            <button class="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
              Collected
            </button>
            <button class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold">
              Pending
            </button>
          </div>
        </div>

        <DataTable
          :headers="tableHeaders"
          :data="collectionData"
          :searchable="true"
          :paginated="true"
        >
          <template #cell-student="{ row }">
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">{{ row.name }}</p>
              <p class="text-xs text-gray-500">{{ row.studentId }}</p>
            </div>
          </template>
          <template #cell-size="{ row }">
            <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {{ row.size }}
            </span>
          </template>
          <template #cell-status="{ row }">
            <Badge :variant="row.status === 'Collected' ? 'success' : 'warning'">
              {{ row.status }}
            </Badge>
          </template>
          <template #cell-actions="{ row }">
            <button
              v-if="row.status === 'Pending'"
              @click="collectGown(row)"
              class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90"
            >
              Mark Collected
            </button>
            <span v-else class="text-green-600 text-sm font-semibold">
              ✓ Collected
            </span>
          </template>
        </DataTable>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import DataTable from '@/components/DataTable.vue';
import Badge from '@/components/Badge.vue';

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
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: 'Scan' },
  { path: '/staff/gown-collection', icon: 'checkroom', label: 'Gown' },
  { path: '/staff/student-list', icon: 'group', label: 'Students' }
];

const searchQuery = ref('');
const stats = ref({
  collected: 456,
  pending: 234,
  available: 120,
  total: 690
});

const collectionRate = computed(() => {
  return Math.round((stats.value.collected / stats.value.total) * 100);
});

const tableHeaders = [
  { key: 'student', label: 'Student', sortable: true },
  { key: 'size', label: 'Size', sortable: true },
  { key: 'collectedAt', label: 'Collected At', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

const collectionData = ref([
  {
    id: 1,
    name: 'John Doe',
    studentId: 'GCS220001',
    size: 'M',
    collectedAt: '2024-06-10 10:30',
    status: 'Collected'
  },
  {
    id: 2,
    name: 'Jane Smith',
    studentId: 'GCS220002',
    size: 'S',
    collectedAt: '2024-06-10 10:45',
    status: 'Collected'
  },
  {
    id: 3,
    name: 'Bob Wilson',
    studentId: 'GCS220003',
    size: 'L',
    collectedAt: '-',
    status: 'Pending'
  }
]);

const markCollected = () => {
  // Implementation
  console.log('Marking as collected:', searchQuery.value);
};

const collectGown = (row) => {
  row.status = 'Collected';
  row.collectedAt = new Date().toLocaleString();
  stats.value.collected++;
  stats.value.pending--;
};
</script>
