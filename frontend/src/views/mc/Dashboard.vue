<template>
  <div class="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">

    <!-- Welcome Banner -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 p-6 shadow-xl">
      <div class="absolute inset-0">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      <div class="relative z-10 flex items-center justify-between">
        <div>
          <p class="text-purple-200 text-sm font-semibold uppercase tracking-wider">{{ $t('mc.host', 'MC Host') }}</p>
          <h1 class="text-2xl lg:text-3xl font-black text-white mt-1">{{ $t('mc.welcome', 'Welcome') }}, {{ user?.fullName }}</h1>
          <p class="text-purple-200 text-sm mt-1">{{ currentDateTime }}</p>
        </div>
        <div class="hidden md:flex flex-col items-end gap-1">
          <div class="px-3 py-1.5 bg-white/20 rounded-full text-white text-xs font-semibold">
            {{ overviewData.students?.checkedIn || 0 }} / {{ overviewData.students?.total || 0 }} {{ $t('mc.checked_in', 'Checked In') }}
          </div>
          <div class="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
            <div class="h-full bg-white rounded-full transition-all duration-700"
              :style="`width: ${overviewData.students?.checkedInRate || 0}%`"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label"
        class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <span class="text-gray-500 dark:text-gray-400 text-xs font-medium">{{ stat.label }}</span>
          <div class="w-9 h-9 rounded-lg flex items-center justify-center" :class="stat.bg">
            <span class="material-symbols-outlined text-sm" :class="stat.color">{{ stat.icon }}</span>
          </div>
        </div>
        <p class="text-3xl font-black text-gray-900 dark:text-white">{{ stat.value ?? '–' }}</p>
      </div>
    </div>

    <!-- Two columns -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Live Check-in Feed -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
        <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <h3 class="text-gray-900 dark:text-white font-semibold text-sm">{{ $t('mc.live_feed', 'Live Check-in Feed') }}</h3>
          </div>
          <div class="flex items-center gap-3">
            <!-- Refresh Button -->
            <button @click="refreshFeed" :disabled="isRefreshingFeed" 
              class="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-50 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center justify-center cursor-pointer"
              title="Refresh Live Feed">
              <span class="material-symbols-outlined text-sm" :class="{ 'animate-spin': isRefreshingFeed }">refresh</span>
            </button>
            
            <!-- 4. Major Filtering -->
            <select v-model="filterMajor" class="text-xs bg-gray-50 dark:bg-gray-700 border-none rounded-md px-2 py-1 focus:ring-0 text-gray-600 dark:text-gray-300 cursor-pointer">
              <option value="">{{ $t('mc.all_majors', 'All Majors') }}</option>
              <option v-for="m in uniqueMajors" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
        </div>
        <div class="overflow-y-auto max-h-96 divide-y divide-gray-100 dark:divide-gray-700 flex-1">
          <div v-if="filteredCheckins.length === 0"
            class="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500">
            <span class="material-symbols-outlined text-4xl mb-2">qr_code_scanner</span>
            <p class="text-sm">{{ $t('mc.no_checkins', 'No check-ins to display.') }}</p>
          </div>
          <div v-for="(item, idx) in filteredCheckins" :key="idx"
            class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group relative"
            :class="{ 'bg-green-50/50 dark:bg-green-900/10': idx === 0 && !item.isLate, 'bg-red-50/50 dark:bg-red-900/10': item.isLate }">
            
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                 :class="item.isLate ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'">
              {{ item.studentName?.[0]?.toUpperCase() || '?' }}
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <p class="text-gray-900 dark:text-white text-sm font-medium truncate flex items-center gap-2">
                  {{ item.studentName }}
                  <!-- 3. Highlight Late Arrivals -->
                  <span v-if="item.isLate" class="text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-900/50 px-1.5 py-0.5 rounded uppercase">{{ $t('mc.late', 'Late') }}</span>
                  <span v-if="item.autoAddedToQueue" class="text-[10px] font-bold bg-purple-100 text-purple-600 dark:bg-purple-900/50 px-1.5 py-0.5 rounded whitespace-nowrap hidden sm:inline-block">{{ $t('mc.auto_queued', 'Auto-Queued') }}</span>
                </p>
                <span class="text-xs shrink-0 font-mono" :class="item.isLate ? 'text-red-500' : 'text-gray-400'">{{ formatTime(item.timestamp) }}</span>
              </div>
              <p class="text-gray-500 text-xs truncate mt-0.5">{{ item.major }} · {{ $t('mc.seat', 'Seat') }} {{ item.seatNumber || 'N/A' }}</p>
            </div>

            <!-- 5. Quick Action (Idea 5 Adapted for Dashboard) -->
            <button v-if="item.queueStatus === 'waiting' || item.autoAddedToQueue" 
                    @click="markReady(item)"
                    class="opacity-0 group-hover:opacity-100 absolute right-3 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">bolt</span> {{ $t('mc.ready', 'Ready') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Ceremony Progress -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-gray-900 dark:text-white font-semibold text-sm">{{ $t('mc.ceremony_progress', 'Ceremony Progress') }}</h3>
        </div>
        <div class="p-5 space-y-4">
          <div v-for="phase in ceremonyPhases" :key="phase.label" class="space-y-1.5">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" :class="phase.dot"></span>
                <span class="text-gray-700 dark:text-gray-300 text-sm">{{ phase.label }}</span>
              </div>
              <span class="text-gray-900 dark:text-white font-bold text-sm">{{ phase.count }}</span>
            </div>
            <div class="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700" :class="phase.bar"
                :style="`width: ${ceremonyTotal > 0 ? Math.round((phase.count / ceremonyTotal) * 100) : 0}%`">
              </div>
            </div>
          </div>
          <div class="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span class="text-gray-500 text-sm">{{ $t('mc.overall_completion', 'Overall completion') }}</span>
            <span class="text-2xl font-black text-purple-600 dark:text-purple-400">
              {{ overviewData.ceremony?.progressRate || 0 }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <h3 class="text-gray-900 dark:text-white font-semibold text-sm mb-4">{{ $t('mc.quick_actions', 'Quick Actions') }}</h3>
      <div class="flex flex-wrap gap-3">
        <router-link to="/mc/ceremony"
          class="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
          <span class="material-symbols-outlined text-sm">theater_comedy</span>
          {{ $t('mc.nav_ceremony', 'Ceremony Control') }}
        </router-link>
        <router-link to="/mc/students"
          class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
          <span class="material-symbols-outlined text-sm">groups</span>
          {{ $t('mc.nav_students', 'Student Attendance') }}
        </router-link>
        <button @click="autoPopulate" :disabled="autoPopulating"
          class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
          <span class="material-symbols-outlined text-sm">playlist_add</span>
          {{ autoPopulating ? $t('mc.adding', 'Adding...') : $t('mc.auto_fill', 'Auto-fill Queue') }}
        </button>
        <router-link to="/mc/lookup"
          class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-sm font-semibold rounded-lg transition-colors">
          <span class="material-symbols-outlined text-sm">manage_search</span>
          {{ $t('mc.nav_lookup', 'Student Lookup') }}
        </router-link>
      </div>
    </div>
    <!-- Toast for Auto features -->
    <Transition name="toast">
      <div v-if="toastMsg" class="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 bg-gray-900 border border-purple-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl">
        <span class="material-symbols-outlined text-purple-400 animate-bounce">auto_awesome</span>
        <span class="text-white text-sm" v-html="toastMsg"></span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';
import api from '@/services/api';

const authStore = useAuthStore();
const { t } = useI18n();
const user = computed(() => authStore.user);
const overviewData = ref({ students: {}, ceremony: {} });
const liveCheckins = ref([]);
const isRefreshingFeed = ref(false);
const autoPopulating = ref(false);
const filterMajor = ref('');
const toastMsg = ref('');
let toastTimeout = null;
let socket = null;
let refreshInterval = null;

const stats = computed(() => [
  { label: t('mc.total_students', 'Total Students'), value: overviewData.value.students?.total, icon: 'groups', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { label: t('mc.checked_in', 'Checked In'), value: overviewData.value.students?.checkedIn, icon: 'how_to_reg', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { label: t('mc.on_stage', 'On Stage'), value: overviewData.value.ceremony?.onStage, icon: 'mic', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { label: t('mc.completed', 'Completed'), value: overviewData.value.ceremony?.completed, icon: 'task_alt', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
]);

const ceremonyTotal = computed(() => overviewData.value.ceremony?.totalQueued || 0);

const ceremonyPhases = computed(() => [
  { label: t('mc.waiting', 'Waiting'), count: overviewData.value.ceremony?.waiting || 0, dot: 'bg-gray-400', bar: 'bg-gray-400' },
  { label: t('mc.ready', 'Ready'), count: overviewData.value.ceremony?.ready || 0, dot: 'bg-yellow-400', bar: 'bg-yellow-400' },
  { label: t('mc.on_stage', 'On Stage'), count: overviewData.value.ceremony?.onStage || 0, dot: 'bg-orange-400', bar: 'bg-orange-500' },
  { label: t('mc.completed', 'Completed'), count: overviewData.value.ceremony?.completed || 0, dot: 'bg-green-400', bar: 'bg-green-500' },
]);

const currentDateTime = computed(() =>
  new Date().toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
);

const fetchOverview = async () => {
  try {
    const res = await api.get('/mc/overview');
    if (res.data.success) overviewData.value = res.data.data;
  } catch (e) { /* silent */ }
};

const autoPopulate = async () => {
  autoPopulating.value = true;
  try {
    await api.post('/mc/queue/auto-populate');
    await fetchOverview();
  } catch (e) { /* silent */ } finally {
    autoPopulating.value = false;
  }
};

const formatTime = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

// 1. Initial Load Sync feature
const fetchRecentCheckins = async () => {
  try {
    const res = await api.get('/mc/checked-in');
    if (res.data.success && res.data.data.students) {
      const isCeremonyStarted = (overviewData.value.ceremony?.onStage + overviewData.value.ceremony?.completed) > 0;
      
      const students = res.data.data.students.reverse().slice(0, 30).map(s => ({
        id: s.ticketId,
        studentName: s.fullName,
        major: s.major,
        seatNumber: s.seatNumber,
        timestamp: s.scannedAt,
        queueId: s.queueId,
        queueStatus: s.queueStatus,
        autoAddedToQueue: false,
        isLate: false // Assume past history wasn't strictly late unless we track it, but we can evaluate based on timestamp if needed. We'll leave it false for history.
      }));
      liveCheckins.value = students;
    }
  } catch (e) { /* silent */ }
};

const refreshFeed = async () => {
  isRefreshingFeed.value = true;
  await fetchRecentCheckins();
  await fetchOverview(); // Also fresh stats when manual block refresh
  setTimeout(() => isRefreshingFeed.value = false, 500); // UI visual delay for feedback
};

const uniqueMajors = computed(() => [...new Set(liveCheckins.value.map(c => c.major).filter(Boolean))]);
const filteredCheckins = computed(() => {
  if (!filterMajor.value) return liveCheckins.value;
  return liveCheckins.value.filter(c => c.major === filterMajor.value);
});

const showToast = (msg) => {
  toastMsg.value = msg;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toastMsg.value = ''; }, 4000);
};

const markReady = async (item) => {
  try {
    if (!item.queueId) {
       showToast(`Cannot mark ready: Missing Queue ID from backend.`);
       return;
    }
    const res = await api.patch(`/mc/queue/${item.queueId}/status`, { status: 'ready' });
    if (res.data.success) {
      showToast(`<strong>${item.studentName}</strong> marked as Ready!`);
      item.queueStatus = 'ready'; // Optmistic UI update
    }
  } catch(e) {
    showToast(`Error updating status: ${e.response?.data?.message || e.message}`);
  }
};

onMounted(async () => {
  await fetchOverview();
  await fetchRecentCheckins();
  refreshInterval = setInterval(fetchOverview, 15000);

  const waitForSocket = setInterval(() => {
    socket = window._ceremonySocket;
    if (socket) {
      clearInterval(waitForSocket);
      socket.on('ceremony:ticket_scanned', (data) => {
        console.log('[MC/Dashboard] Received ceremony:ticket_scanned via Socket:', data);
        
        // 3. Highlight Late Arrivals
        const isCeremonyStarted = (overviewData.value.ceremony?.onStage + overviewData.value.ceremony?.completed) > 0;
        const mappedData = {
          ...data,
          isLate: isCeremonyStarted // If ceremony is already running, anyone arriving now is late
        };

        liveCheckins.value.unshift(mappedData);
        if (liveCheckins.value.length > 30) liveCheckins.value.pop();
        
        fetchOverview();
        
        // 2. Auto-Populate Notification
        if (data.autoAddedToQueue) {
          showToast(`<strong>${data.studentName}</strong> arrived.<br/>Auto-added to waiting queue!`);
        }
      });
    }
  }, 300);
});

onUnmounted(() => {
  clearInterval(refreshInterval);
  clearTimeout(toastTimeout);
  if (socket) socket.off('ceremony:ticket_scanned');
});
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from { opacity: 0; transform: translateY(20px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(20px) scale(0.9); }
</style>
