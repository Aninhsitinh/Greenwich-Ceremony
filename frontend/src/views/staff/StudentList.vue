<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
    <!-- Sticky Top Navigation -->
    <div class="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 md:px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link to="/staff" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center">
           <span class="material-symbols-outlined">arrow_back</span>
        </router-link>
        <h1 class="text-xl font-black text-gray-900 dark:text-white">{{ $t('staff.student_list') }}</h1>
      </div>
    </div>

    <!-- Main Content Flow -->
    <div class="w-full px-4 md:px-8 py-6 space-y-6">
      <!-- Ultra Modern Hero -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 lg:p-10 shadow-2xl">
        <div class="absolute inset-0">
          <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border-2 border-white/30">
              <span class="material-symbols-outlined text-4xl text-white">group</span>
            </div>
            <div>
              <p class="text-white/80 text-sm font-semibold uppercase tracking-wider">Student Database</p>
              <h1 class="text-4xl font-black text-white">Student Directory</h1>
            </div>
          </div>
          <p class="text-white/90 text-lg max-w-2xl">Comprehensive student information and registration status</p>
        </div>
      </div>

      <!-- Animated Stats -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div 
          v-for="(stat, index) in statCards"
          :key="index"
          class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
        >
          <div :class="`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.gradient}`"></div>
          <div class="relative z-10">
            <div :class="`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`">
              <span :class="`material-symbols-outlined text-3xl ${stat.color}`">{{ stat.icon }}</span>
            </div>
            <p class="text-3xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-white transition-colors">{{ stat.value }}</p>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80 transition-colors">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="md:col-span-2 lg:col-span-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span class="material-symbols-outlined text-emerald-500">search</span>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search students by name, ID, or email..."
                class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
          <input
            v-model="filterMajor"
            type="text"
            placeholder="Filter by major..."
            class="px-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:border-teal-500 transition-all text-gray-900 dark:text-white font-medium"
          />
          <select 
            v-model="filterStatus"
            class="px-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:border-cyan-500 transition-all text-gray-900 dark:text-white font-medium"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Student Cards Grid -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">All Students</h2>
          <div class="flex items-center gap-3">
            <input type="file" ref="studentImportInput" class="hidden" accept=".xlsx, .xls" @change="handleImport">
            <button 
              @click="$refs.studentImportInput.click()"
              :disabled="importing"
              class="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span v-if="importing" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span class="material-symbols-outlined text-lg" v-else>upload_file</span>
              Import Excel
            </button>
            <span class="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-bold w-fit">
              {{ students.length }} students
            </span>
          </div>
        </div>

        <div v-if="loading" class="text-center py-16">
          <div class="inline-block w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-500 font-medium">Loading students...</p>
        </div>

        <div v-else-if="students.length === 0" class="text-center py-16">
          <span class="material-symbols-outlined text-8xl text-gray-300 mb-4">person_off</span>
          <p class="text-gray-500 font-medium text-lg">No students found</p>
        </div>

        <div v-else>
          <!-- Grid View for Modern Look -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div 
              v-for="student in students" 
              :key="student._id"
              class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-6 border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              <!-- Gradient Overlay on Hover -->
              <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300"></div>
              
              <div class="relative z-10">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-4">
                  <div class="flex items-start gap-4 flex-1 min-w-0 w-full">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                      {{ getInitials(student.fullName) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-black text-lg text-gray-900 dark:text-white truncate" :title="student.fullName">{{ student.fullName || 'N/A' }}</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400 font-mono truncate">{{ student.studentId || 'N/A' }}</p>
                      <p class="text-xs text-gray-500 truncate" :title="student.email">{{ student.email || 'N/A' }}</p>
                    </div>
                  </div>
                  <!-- Student Account Status Toggle -->
                  <button 
                    @click.stop="toggleStudentStatus(student._id, student.status)"
                    :disabled="togglingId === student._id"
                    :class="[
                      'px-3 py-1 rounded-lg font-bold text-xs self-start w-fit flex items-center gap-1 transition-all',
                      togglingId === student._id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105',
                      student.status === 'active'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    ]"
                    title="Click to toggle Account Status"
                  >
                    <span v-if="togglingId === student._id" class="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    {{ student.status || 'Unknown' }}
                  </button>
                  </div>

                <!-- Details Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div class="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <p class="text-xs text-gray-500 mb-1">Major</p>
                    <p class="font-bold text-sm text-gray-900 dark:text-white truncate" :title="student.major">{{ student.major || 'N/A' }}</p>
                  </div>
                  <div class="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <p class="text-xs text-gray-500 mb-1">Class Of</p>
                    <p class="font-bold text-sm text-gray-900 dark:text-white">{{ student.classOf || 'N/A' }}</p>
                  </div>
                </div>

                <!-- Registration Status -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-emerald-600 text-sm">how_to_reg</span>
                    <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Registration:</span>
                  </div>
                  <!-- Registration Status Toggle -->
                  <button 
                    v-if="student.registration"
                    @click.stop="toggleRegistrationStatus(student._id, student.registration)"
                    :disabled="togglingId === student._id"
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-bold w-fit flex items-center gap-1 transition-all',
                      togglingId === student._id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105',
                      student.registration.attendanceConfirmed
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                    ]"
                    title="Click to toggle Registration Status"
                  >
                    <span v-if="togglingId === student._id" class="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    {{ student.registration.attendanceConfirmed ? '✓ Confirmed' : 'Pending' }}
                  </button>
                  <span v-else class="text-xs text-gray-400 w-fit">Not Registered</span>
                </div>
                
                <!-- Checked In By -->
                <div v-if="student.registration?.checkedInBy" class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2 sm:pl-6 pt-2 sm:pt-0">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-blue-600 text-sm">assignment_ind</span>
                    <span class="text-xs text-gray-600 dark:text-gray-400">Checked in by:</span>
                  </div>
                  <span class="font-bold text-gray-900 dark:text-white text-xs pl-6 sm:pl-0">{{ student.registration.checkedInBy.fullName }}</span>
                </div>


                <!-- Gown Size if available -->
                <div v-if="student.registration?.gownSize" class="mt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-teal-600 text-sm">checkroom</span>
                    <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Gown Size:</span>
                  </div>
                  <span class="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-bold">
                    {{ student.registration.gownSize }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="students.length > 0 && pagination.total > 1" class="flex flex-col sm:flex-row items-center justify-center gap-2 mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
            <button
              @click="loadPage(pagination.current - 1)"
              :disabled="pagination.current === 1"
              class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              Previous
            </button>
            <span class="w-full sm:w-auto text-center px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold text-gray-900 dark:text-white">
              {{ pagination.current }} / {{ pagination.total }}
            </span>
            <button
              @click="loadPage(pagination.current + 1)"
              :disabled="pagination.current >= pagination.total"
              class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
import { ref, computed, onMounted, onActivated, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import api from '@/services/api';
import { useToast } from 'vue-toastification';

const toast = useToast();

const navigation = computed(() => [
  { path: '/staff', icon: 'dashboard', label: t('staff.nav_dashboard') },
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: t('staff.nav_qr') },
  { path: '/staff/gown-collection', icon: 'checkroom', label: t('staff.nav_gown') },
  { path: '/staff/logistics', icon: 'inventory_2', label: 'Logistics' },
  { path: '/staff/finance', icon: 'payments', label: 'Refunds' },
  { path: '/staff/seat-management', icon: 'event_seat', label: t('staff.nav_seat') },
  { path: '/staff/student-list', icon: 'group', label: t('staff.nav_students') },
  { path: '/staff/monitor', icon: 'monitor_heart', label: t('staff.nav_monitor') },
  { path: '/staff/settings', icon: 'settings', label: t('staff.nav_settings') }
]);

const bottomNavigation = computed(() => [
  { path: '/staff', icon: 'home', label: t('staff.nav_home') },
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: t('staff.nav_scan') },
  { path: '/staff/gown-collection', icon: 'checkroom', label: t('staff.nav_gown') },
  { path: '/staff/logistics', icon: 'inventory_2', label: 'Logistics' },
  { path: '/staff/finance', icon: 'payments', label: 'Refunds' },
  { path: '/staff/student-list', icon: 'group', label: t('staff.nav_students') }
]);

// State
const loading = ref(true);
const importing = ref(false);
const studentImportInput = ref(null);
const togglingId = ref(null); // Track which student is currently being toggled
const students = ref([]);
const statistics = ref(null);
const pagination = ref({ current: 1, total: 1, count: 0, totalItems: 0 });

// Filters
const searchQuery = ref('');
const filterMajor = ref('');
const filterStatus = ref('');



// Computed stats
const statCards = computed(() => [
  {
    icon: 'school',
    value: statistics.value?.total || 0,
    label: 'Total Students',
    bg: 'bg-emerald-100 dark:bg-emerald-900/20',
    color: 'text-emerald-600',
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-500'
  },
  {
    icon: 'check_circle',
    value: statistics.value?.active || 0,
    label: 'Active',
    bg: 'bg-teal-100 dark:bg-teal-900/20',
    color: 'text-teal-600',
    gradient: 'bg-gradient-to-br from-teal-500 to-cyan-500'
  },
  {
    icon: 'how_to_reg',
    value: statistics.value?.registered || 0,
    label: 'Registered',
    bg: 'bg-cyan-100 dark:bg-cyan-900/20',
    color: 'text-cyan-600',
    gradient: 'bg-gradient-to-br from-cyan-500 to-blue-500'
  },
  {
    icon: 'verified',
    value: statistics.value?.confirmed || 0,
    label: 'Confirmed',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    color: 'text-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-500'
  },
  {
    icon: 'percent',
    value: `${statistics.value?.registrationRate || 0}%`,
    label: 'Registration Rate',
    bg: 'bg-indigo-100 dark:bg-indigo-900/20',
    color: 'text-indigo-600',
    gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500'
  }
]);

// Load students
const loadStudents = async (page = 1) => {
  loading.value = true;
  try {
    const params = { page, limit: 20 };
    if (searchQuery.value) params.search = searchQuery.value;
    if (filterMajor.value) params.major = filterMajor.value;
    if (filterStatus.value) params.status = filterStatus.value;

    const response = await api.get('/staff/students', { params });
    if (response.data.success) {
      students.value = response.data.data.students;
      statistics.value = response.data.data.statistics;
      pagination.value = response.data.data.pagination;
    }
  } catch (error) {
    console.error('Error loading students:', error);
  } finally {
    loading.value = false;
  }
};

const loadPage = (page) => {
  loadStudents(page);
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const toggleStudentStatus = async (studentId, currentStatus) => {
  if (togglingId.value) return;
  togglingId.value = studentId;

  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  
  try {
    const response = await api.patch(`/staff/students/${studentId}/status`, { status: newStatus });
    if (response.data.success) {
      toast.success(response.data.message || `Student status updated to ${newStatus}`);
      // find index and update
      const index = students.value.findIndex(s => s._id === studentId);
      if (index !== -1) {
        students.value[index].status = newStatus;
      }
    }
  } catch (error) {
    console.error('Error toggling student status:', error);
    toast.error(error.response?.data?.message || 'Failed to update student status');
  } finally {
    togglingId.value = null;
  }
};

const toggleRegistrationStatus = async (studentId, currentRegistration) => {
  if (togglingId.value) return;
  if (!currentRegistration || !currentRegistration._id) {
     toast.warning('Student does not have a valid registration to update.');
     return;
  }
  
  togglingId.value = studentId;
  const currentStatus = currentRegistration.attendanceConfirmed ? 'confirmed' : 'pending';
  const newStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed';

  try {
    const response = await api.patch(`/registrations/${currentRegistration._id}/status`, { status: newStatus });
    if (response.data.success) {
      toast.success(response.data.message || `Registration marked as ${newStatus}`);
      const index = students.value.findIndex(s => s._id === studentId);
      if (index !== -1) {
        students.value[index].registration.attendanceConfirmed = newStatus === 'confirmed';
      }
    }
  } catch (error) {
    console.error('Error toggling registration status:', error);
    toast.error(error.response?.data?.message || 'Failed to update registration status');
  } finally {
    togglingId.value = null;
  }
};

const handleImport = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  importing.value = true;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/import/students', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (response.data.success) {
      toast.success(response.data.message);
      loadStudents(1);
    }
  } catch (error) {
    console.error('Error importing students:', error);
    toast.error(error.response?.data?.message || 'Failed to import students');
  } finally {
    importing.value = false;
    // Reset input
    if (event.target) event.target.value = '';
  }
};

watch([searchQuery, filterMajor, filterStatus], () => {
  loadStudents(1);
}, { debounce: 500 });

onMounted(() => {
  loadStudents();
});

onActivated(() => {
  loadStudents();
});
</script>
