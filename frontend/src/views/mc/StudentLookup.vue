<template>
  <div class="w-full max-w-7xl mx-auto px-4 py-6 space-y-5">
    <div>
      <h2 class="text-2xl font-black text-gray-900 dark:text-white">Student Lookup</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Search students by name, ID, seat number, or major</p>
    </div>

    <!-- Search Bar -->
    <div class="relative">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
      <input v-model="searchQuery" @input="debouncedSearch" type="text"
        placeholder="Type a name, student ID, or seat number..."
        class="w-full pl-12 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm" />
      <button v-if="searchQuery" @click="searchQuery = ''; results = []; searched = false"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    </div>

    <!-- Status Filter Chips -->
    <div class="flex flex-wrap gap-2">
      <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value; performSearch()"
        class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
        :class="activeFilter === f.value
          ? 'bg-purple-600 border-purple-500 text-white'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'">
        {{ f.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Results -->
    <div v-else-if="results.length > 0" class="space-y-3">
      <p class="text-gray-500 dark:text-gray-400 text-xs">{{ results.length }} result{{ results.length !== 1 ? 's' : '' }} found</p>
      <div v-for="student in results" :key="student.id"
        class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
            :class="student.isCheckedIn ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'">
            {{ student.fullName?.[0]?.toUpperCase() || '?' }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <h3 class="text-gray-900 dark:text-white font-bold">{{ student.fullName }}</h3>
              <!-- Check-in badge -->
              <span v-if="student.isCheckedIn"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                <span class="material-symbols-outlined text-xs">check_circle</span> Checked In
              </span>
              <span v-else
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
                <span class="material-symbols-outlined text-xs">cancel</span> Not Arrived
              </span>
              <!-- Queue badge -->
              <span v-if="student.queueStatus"
                class="inline-block px-2 py-0.5 text-xs font-semibold rounded-full"
                :class="queueBadge(student.queueStatus)">
                {{ queueLabel(student.queueStatus) }}
              </span>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ student.studentId }} · {{ student.major }} · Class of {{ student.classOf }}</p>

            <div class="flex flex-wrap gap-4 mt-3">
              <div class="flex items-center gap-1.5 text-xs text-gray-500">
                <span class="material-symbols-outlined text-sm text-blue-500">event_seat</span>
                Seat: <strong class="text-gray-900 dark:text-white ml-1">{{ student.seatNumber || 'Not booked' }}</strong>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-gray-500">
                <span class="material-symbols-outlined text-sm text-green-500">qr_code_scanner</span>
                Checked in: <strong class="text-gray-900 dark:text-white ml-1">{{ student.scannedAt ? formatTime(student.scannedAt) : 'No' }}</strong>
              </div>
              <div v-if="student.queueNumber" class="flex items-center gap-1.5 text-xs text-gray-500">
                <span class="material-symbols-outlined text-sm text-yellow-500">format_list_numbered</span>
                Queue #: <strong class="text-gray-900 dark:text-white ml-1">{{ student.queueNumber }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty result -->
    <div v-else-if="searched" class="text-center py-16">
      <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 block mb-3">person_search</span>
      <p class="text-gray-500 dark:text-gray-400">No students matched your search.</p>
    </div>

    <!-- Initial state -->
    <div v-else class="text-center py-16">
      <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 block mb-3">manage_search</span>
      <p class="text-gray-500 dark:text-gray-400 text-sm">Enter a name, student ID, or seat number to search.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';

const searchQuery = ref('');
const results = ref([]);
const loading = ref(false);
const searched = ref(false);
const activeFilter = ref('all');

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Checked In', value: 'checked_in' },
  { label: 'Not Arrived', value: 'not_arrived' },
  { label: 'Waiting', value: 'waiting' },
  { label: 'Completed', value: 'completed' },
];

let debounceTimer = null;
const debouncedSearch = () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(performSearch, 400); };

const performSearch = async () => {
  if (!searchQuery.value.trim() && activeFilter.value === 'all') { results.value = []; searched.value = false; return; }
  loading.value = true;
  searched.value = true;
  try {
    const params = {};
    if (searchQuery.value.trim()) params.search = searchQuery.value;

    const res = await api.get('/mc/students', { params });
    if (res.data.success) {
      let data = res.data.data.students;

      if (activeFilter.value === 'checked_in') data = data.filter(s => s.isCheckedIn);
      else if (activeFilter.value === 'not_arrived') data = data.filter(s => !s.isCheckedIn);
      else if (activeFilter.value === 'waiting') data = data.filter(s => s.queueStatus === 'waiting');
      else if (activeFilter.value === 'completed') data = data.filter(s => s.queueStatus === 'completed');

      results.value = data;
    }
  } catch (e) { results.value = []; } finally { loading.value = false; }
};

const queueLabel = (s) => ({ waiting: 'Waiting', ready: 'Ready', on_stage: 'On Stage', completed: 'Done' }[s] || s);
const queueBadge = (s) => ({
  waiting: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  ready: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  on_stage: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
}[s] || 'bg-gray-100 text-gray-600');
const formatTime = (ts) => { if (!ts) return '–'; return new Date(ts).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }); };
</script>
