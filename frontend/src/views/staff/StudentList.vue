<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    page-title="Student List"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student List</h1>
        <p class="text-gray-600 dark:text-gray-400">View and manage all registered students</p>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, ID, or email..."
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
            />
          </div>
          <select
            v-model="filterStatus"
            class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
          >
            <option value="">All Status</option>
            <option value="registered">Registered</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>
          <select
            v-model="filterMajor"
            class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
          >
            <option value="">All Majors</option>
            <option value="CS">Computer Science</option>
            <option value="IT">Information Technology</option>
            <option value="SE">Software Engineering</option>
            <option value="BA">Business Administration</option>
          </select>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-blue-600">group</span>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ filteredStudents.length }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-green-600">verified</span>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ confirmedCount }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Confirmed</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-orange-600">pending</span>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ pendingCount }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Pending</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-purple-600">checkroom</span>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ gownCollectedCount }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Gowns Collected</p>
        </div>
      </div>

      <!-- Student Table -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">All Students</h2>
          <button class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
            <span class="material-symbols-outlined">download</span>
            <span class="hidden sm:inline">Export</span>
          </button>
        </div>

        <DataTable
          :headers="tableHeaders"
          :data="filteredStudents"
          :searchable="false"
          :paginated="true"
          :items-per-page="10"
        >
          <template #cell-student="{ row }">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-primary font-bold">{{ row.name.charAt(0) }}</span>
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">{{ row.name }}</p>
                <p class="text-xs text-gray-500">{{ row.studentId }}</p>
              </div>
            </div>
          </template>
          <template #cell-contact="{ row }">
            <div>
              <p class="text-sm text-gray-900 dark:text-white">{{ row.email }}</p>
              <p class="text-xs text-gray-500">{{ row.phone }}</p>
            </div>
          </template>
          <template #cell-status="{ row }">
            <Badge :variant="row.status === 'Confirmed' ? 'success' : row.status === 'Pending' ? 'warning' : 'default'">
              {{ row.status }}
            </Badge>
          </template>
          <template #cell-gown="{ row }">
            <span v-if="row.gownCollected" class="text-green-600 text-sm font-semibold">✓ Collected</span>
            <span v-else class="text-orange-600 text-sm font-semibold">Pending</span>
          </template>
          <template #cell-actions="{ row }">
            <div class="flex gap-2">
              <button
                @click="viewStudent(row)"
                class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                title="View Details"
              >
                <span class="material-symbols-outlined text-lg">visibility</span>
              </button>
              <button
                @click="editStudent(row)"
                class="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                title="Edit"
              >
                <span class="material-symbols-outlined text-lg">edit</span>
              </button>
            </div>
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
const filterStatus = ref('');
const filterMajor = ref('');

const students = ref([
  {
    id: 1,
    name: 'John Doe',
    studentId: 'GCS220001',
    email: 'john.doe@student.fpt.edu.vn',
    phone: '+84 123 456 789',
    major: 'CS',
    status: 'Confirmed',
    gownCollected: true
  },
  {
    id: 2,
    name: 'Jane Smith',
    studentId: 'GCS220002',
    email: 'jane.smith@student.fpt.edu.vn',
    phone: '+84 987 654 321',
    major: 'IT',
    status: 'Confirmed',
    gownCollected: true
  },
  {
    id: 3,
    name: 'Bob Wilson',
    studentId: 'GCS220003',
    email: 'bob.wilson@student.fpt.edu.vn',
    phone: '+84 555 123 456',
    major: 'SE',
    status: 'Pending',
    gownCollected: false
  },
  {
    id: 4,
    name: 'Alice Johnson',
    studentId: 'GCS220004',
    email: 'alice.j@student.fpt.edu.vn',
    phone: '+84 444 567 890',
    major: 'BA',
    status: 'Confirmed',
    gownCollected: false
  }
]);

const tableHeaders = [
  { key: 'student', label: 'Student', sortable: true },
  { key: 'contact', label: 'Contact', sortable: false },
  { key: 'major', label: 'Major', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'gown', label: 'Gown', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

const filteredStudents = computed(() => {
  let result = students.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.studentId.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
    );
  }

  if (filterStatus.value) {
    result = result.filter(s => s.status.toLowerCase() === filterStatus.value.toLowerCase());
  }

  if (filterMajor.value) {
    result = result.filter(s => s.major === filterMajor.value);
  }

  return result;
});

const confirmedCount = computed(() => students.value.filter(s => s.status === 'Confirmed').length);
const pendingCount = computed(() => students.value.filter(s => s.status === 'Pending').length);
const gownCollectedCount = computed(() => students.value.filter(s => s.gownCollected).length);

const viewStudent = (student) => {
  console.log('View student:', student);
};

const editStudent = (student) => {
  console.log('Edit student:', student);
};
</script>
