<template>
  <div class="w-full max-w-7xl mx-auto px-4 py-6 space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-2xl font-black text-gray-900 dark:text-white">Student Attendance</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Track who has checked in vs. not yet arrived
        </p>
      </div>
      <button @click="fetchStudents"
        class="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-sm font-semibold rounded-lg transition-colors">
        <span class="material-symbols-outlined text-sm">refresh</span> Refresh
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
        <p class="text-3xl font-black text-gray-900 dark:text-white">{{ summary.total }}</p>
        <p class="text-xs text-gray-500 mt-1">Total Students</p>
      </div>
      <div class="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800/50 rounded-xl p-4 text-center shadow-sm">
        <p class="text-3xl font-black text-green-600 dark:text-green-400">{{ summary.checkedIn }}</p>
        <p class="text-xs text-gray-500 mt-1">Checked In ✅</p>
      </div>
      <div class="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800/50 rounded-xl p-4 text-center shadow-sm">
        <p class="text-3xl font-black text-red-600 dark:text-red-400">{{ summary.notCheckedIn }}</p>
        <p class="text-xs text-gray-500 mt-1">Not Arrived ❌</p>
      </div>
      <div class="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800/50 rounded-xl p-4 text-center shadow-sm">
        <p class="text-3xl font-black text-purple-600 dark:text-purple-400">{{ summary.checkedInRate }}%</p>
        <p class="text-xs text-gray-500 mt-1">Arrival Rate</p>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Check-in Progress</span>
        <span class="text-sm font-bold text-gray-900 dark:text-white">{{ summary.checkedIn }} / {{ summary.total }}</span>
      </div>
      <div class="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-700"
          :style="`width: ${summary.checkedInRate}%`">
        </div>
      </div>
    </div>

    <!-- Filters + Search -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">search</span>
        <input v-model="search" @input="debouncedFetch" type="text"
          placeholder="Search name, student ID, or major..."
          class="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
      </div>
      <div class="flex gap-2">
        <button v-for="f in statusFilters" :key="f.value" @click="setFilter(f.value)"
          class="px-3 py-2 text-xs font-semibold rounded-lg border transition-colors"
          :class="activeFilter === f.value
            ? 'bg-purple-600 border-purple-500 text-white'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'">
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Table / List -->
    <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      <!-- Desktop table header -->
      <div class="hidden md:grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        <div class="col-span-4">Student</div>
        <div class="col-span-2">Major</div>
        <div class="col-span-2">Seat</div>
        <div class="col-span-2">Check-in</div>
        <div class="col-span-2">Queue Status</div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <div class="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="displayedStudents.length === 0" class="text-center py-16">
        <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 block mb-3">groups</span>
        <p class="text-gray-500">No students found</p>
      </div>

      <!-- Student rows -->
      <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
        <div v-for="student in displayedStudents" :key="student.id"
          class="flex flex-col md:grid md:grid-cols-12 md:gap-2 items-start md:items-center px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors gap-2">

          <!-- Name + ID -->
          <div class="col-span-4 flex items-center gap-3 w-full md:w-auto">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              :class="student.isCheckedIn ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'">
              {{ student.fullName?.[0]?.toUpperCase() || '?' }}
            </div>
            <div class="min-w-0">
              <p class="text-gray-900 dark:text-white text-sm font-semibold truncate">{{ student.fullName }}</p>
              <p class="text-gray-500 text-xs font-mono">{{ student.studentId }}</p>
            </div>
          </div>

          <!-- Major -->
          <div class="col-span-2 hidden md:block">
            <span class="text-gray-600 dark:text-gray-400 text-xs">{{ student.major || '–' }}</span>
          </div>

          <!-- Seat -->
          <div class="col-span-2 hidden md:block">
            <span v-if="student.seatNumber"
              class="inline-block px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-mono rounded">
              {{ student.seatNumber }}
            </span>
            <span v-else class="text-gray-400 text-xs">No seat</span>
          </div>

          <!-- Check-in status -->
          <div class="col-span-2 flex items-center gap-2">
            <span v-if="student.isCheckedIn"
              class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
              <span class="material-symbols-outlined text-xs">check_circle</span>
              Checked In
            </span>
            <span v-else-if="student.hasTicket"
              class="inline-flex items-center gap-1 px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
              <span class="material-symbols-outlined text-xs">cancel</span>
              Not Arrived
            </span>
            <span v-else
              class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-semibold rounded-full">
              <span class="material-symbols-outlined text-xs">block</span>
              No Ticket
            </span>
            <!-- Mobile: also show major + seat -->
            <span class="md:hidden text-gray-500 text-xs">{{ student.major }} {{ student.seatNumber ? '· ' + student.seatNumber : '' }}</span>
          </div>

          <!-- Queue status -->
          <div class="col-span-2 hidden md:block">
            <span v-if="student.queueStatus"
              class="inline-block px-2 py-1 text-xs font-semibold rounded-full"
              :class="queueBadge(student.queueStatus)">
              {{ queueLabel(student.queueStatus) }}
            </span>
            <span v-else class="text-gray-400 text-xs">–</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Real-time update toast -->
    <Transition name="toast">
      <div v-if="toast" class="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 bg-gray-900 border border-purple-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl">
        <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        <span class="text-white text-sm">{{ toast }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '@/services/api';

const students = ref([]);
const summary = ref({ total: 0, checkedIn: 0, notCheckedIn: 0, checkedInRate: 0, hasTicket: 0 });
const loading = ref(true);
const search = ref('');
const activeFilter = ref('all');
const toast = ref('');
let toastTimeout = null;
let socket = null;
let debounceTimer = null;

const statusFilters = [
  { label: 'All', value: 'all' },
  { label: 'Checked In', value: 'checkedIn' },
  { label: 'Not Arrived', value: 'notArrived' },
  { label: 'On Stage', value: 'onStage' },
  { label: 'Completed', value: 'completed' },
];

const displayedStudents = computed(() => {
  let list = students.value;
  if (activeFilter.value === 'checkedIn') list = list.filter(s => s.isCheckedIn);
  else if (activeFilter.value === 'notArrived') list = list.filter(s => !s.isCheckedIn);
  else if (activeFilter.value === 'onStage') list = list.filter(s => s.queueStatus === 'on_stage');
  else if (activeFilter.value === 'completed') list = list.filter(s => s.queueStatus === 'completed');
  return list;
});

const fetchStudents = async () => {
  loading.value = true;
  try {
    const params = {};
    if (search.value) params.search = search.value;
    const res = await api.get('/mc/students', { params });
    if (res.data.success) {
      students.value = res.data.data.students;
      summary.value = res.data.data.summary;
    }
  } catch (e) { /* silent */ } finally {
    loading.value = false;
  }
};

const setFilter = (f) => { activeFilter.value = f; };

const debouncedFetch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchStudents, 400);
};

const queueLabel = (s) => ({ waiting: 'Waiting', ready: 'Ready', on_stage: 'On Stage', completed: 'Done' }[s] || s);
const queueBadge = (s) => ({
  waiting: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  ready: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  on_stage: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
}[s] || 'bg-gray-100 text-gray-600');

const showToast = (msg) => {
  toast.value = msg;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.value = ''; }, 3000);
};

onMounted(async () => {
  await fetchStudents();

  const waitForSocket = setInterval(() => {
    socket = window._ceremonySocket;
    if (socket) {
      clearInterval(waitForSocket);
      // When a ticket is scanned → refresh student list
      socket.on('ceremony:ticket_scanned', (data) => {
        showToast(`✅ Checked In: ${data.studentName}`);
        fetchStudents();
      });
      socket.on('ceremony:student_updated', () => {
        fetchStudents();
      });
    }
  }, 300);
});

onUnmounted(() => {
  clearTimeout(toastTimeout);
  clearTimeout(debounceTimer);
  if (socket) {
    socket.off('ceremony:ticket_scanned');
    socket.off('ceremony:student_updated');
  }
});
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateY(20px); }
.toast-leave-to { opacity: 0; transform: translateX(20px); }
</style>
