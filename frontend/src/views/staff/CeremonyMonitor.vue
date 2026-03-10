<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
    <!-- Sticky Top Navigation -->
    <div class="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 md:px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link to="/staff" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center">
           <span class="material-symbols-outlined">arrow_back</span>
        </router-link>
        <h1 class="text-xl font-black text-gray-900 dark:text-white">{{ $t('staff.ceremony_monitor') }}</h1>
      </div>
    </div>

    <!-- Main Content Flow -->
    <div class="w-full px-4 md:px-8 py-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white">Ceremony Monitor</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Live bi-directional sync with MC — no need to refresh</p>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm"
          :class="ceremonyConnected
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'">
          <span class="w-2.5 h-2.5 rounded-full" :class="ceremonyConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'"></span>
          <span class="text-xs font-bold" :class="ceremonyConnected ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
            {{ ceremonyConnected ? 'LIVE SYNC ACTIVE' : 'RECONNECTING...' }}
          </span>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- On Stage Panel -->
        <div class="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-3xl p-8 shadow-2xl min-h-[300px] flex flex-col">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

          <h3 class="text-purple-300 text-xs font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-400 text-sm">theater_comedy</span>
            Currently On Stage
          </h3>

          <div v-if="onStageInfo" class="flex-1 flex flex-col justify-center items-center text-center gap-4">
            <div class="w-20 h-20 bg-gradient-to-br from-pink-400 to-orange-400 rounded-3xl flex items-center justify-center shadow-xl shadow-pink-500/30">
              <span class="text-4xl text-white font-black">{{ onStageInfo.studentName?.[0] || '?' }}</span>
            </div>
            <div>
              <h2 class="text-2xl lg:text-3xl font-black text-white leading-tight">{{ onStageInfo.studentName }}</h2>
              <p class="text-purple-200 text-sm mt-1">{{ onStageInfo.major }} · Queue #{{ onStageInfo.queueNumber }}</p>
              <span class="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-pink-500/20 text-pink-300 rounded-full text-xs font-bold border border-pink-500/30 animate-pulse">
                <span class="material-symbols-outlined text-xs">mic</span>
                ON STAGE NOW
              </span>
            </div>
          </div>

          <div v-else class="flex-1 flex flex-col justify-center items-center text-center">
            <span class="material-symbols-outlined text-5xl text-purple-500/30 block mb-3">hourglass_empty</span>
            <p class="text-purple-300/50 text-sm">Waiting for MC to call the next student...</p>
          </div>
        </div>

        <!-- Recent Check-ins Panel -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col min-h-[300px]">
          <h3 class="text-gray-500 dark:text-gray-400 text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-green-500 text-sm">qr_code_scanner</span>
            Recent Check-ins ({{ recentCheckins.length }})
          </h3>

          <div v-if="recentCheckins.length > 0" class="flex-1 overflow-y-auto space-y-2">
            <div v-for="(checkin, idx) in recentCheckins" :key="idx"
              class="flex items-center gap-3 p-3 rounded-xl transition-colors"
              :class="idx === 0 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'">
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-black shrink-0">
                {{ checkin.studentName?.[0] || '?' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-gray-900 dark:text-white text-sm font-semibold truncate">{{ checkin.studentName }}</p>
                <p class="text-gray-500 text-xs truncate">{{ checkin.major || 'Student' }} · Seat {{ checkin.seatNumber || 'N/A' }}</p>
              </div>
              <span class="text-gray-400 text-xs shrink-0 font-mono">{{ formatTS(checkin.timestamp) }}</span>
            </div>
          </div>

          <div v-else class="flex-1 flex flex-col items-center justify-center">
            <span class="material-symbols-outlined text-5xl text-gray-200 dark:text-gray-700 block mb-3">how_to_reg</span>
            <p class="text-gray-400 text-sm">No check-ins yet.</p>
            <p class="text-gray-400 text-xs mt-1">They appear here as staff scan tickets.</p>
          </div>
        </div>
      </div>

      <!-- Queue Activity & Waiting List Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Waiting List Panel -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col min-h-[350px]">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 class="text-gray-500 dark:text-gray-400 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
              <span class="material-symbols-outlined text-yellow-500 text-sm">groups</span>
              Waiting / Ready Status ({{ displayedWaitingList.length }} / {{ waitingList.length }})
            </h3>
            <div class="flex items-center gap-2">
              <select v-model="filterMajor" class="text-xs bg-gray-50 dark:bg-gray-700 border-none rounded-md px-2 py-1.5 focus:ring-0 text-gray-600 dark:text-gray-300 cursor-pointer">
                <option value="">All Majors</option>
                <option v-for="m in uniqueMajors" :key="m" :value="m">{{ m }}</option>
              </select>
              <button @click="fetchQueue" :disabled="loadingQueue" class="text-blue-500 hover:text-blue-600 transition-colors p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50">
                <span class="material-symbols-outlined text-sm font-bold block" :class="{'animate-spin': loadingQueue}">sync</span>
              </button>
            </div>
          </div>

          <div v-if="loadingQueue && waitingList.length === 0" class="flex-1 flex items-center justify-center">
             <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          
          <draggable 
            v-else-if="displayedWaitingList.length > 0" 
            v-model="displayedWaitingList"
            group="staff-queue"
            item-key="id"
            @end="onQueueReorder"
            ghost-class="opacity-50"
            class="flex-1 overflow-y-auto space-y-2 pr-2"
          >
            <template #item="{ element: student }">
              <div 
                class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 cursor-move hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                :class="student.status === 'ready' ? 'bg-yellow-50 dark:bg-yellow-900/10' : 'bg-gray-50 dark:bg-gray-800'">
                
                <span class="material-symbols-outlined text-gray-400 cursor-grab active:cursor-grabbing text-sm shrink-0">drag_indicator</span>
                
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm"
                     :class="student.status === 'ready' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'">
                  #{{ student.queueNumber }}
                </div>
                
                <div class="flex-1 min-w-0 flex items-center justify-between">
                  <div>
                    <p class="text-gray-900 dark:text-white text-sm font-bold truncate">{{ student.studentName }}</p>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="text-gray-500 text-xs truncate">{{ student.major }}</span>
                    </div>
                  </div>
                  <span class="px-2 py-0.5.rounded-full text-[10px] font-bold tracking-wider shrink-0"
                        :class="student.status === 'ready' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'">
                    {{ student.status.toUpperCase() }}
                  </span>
                </div>
              </div>
            </template>
          </draggable>
          
          <div v-else class="flex-1 flex flex-col items-center justify-center text-center px-4">
             <span class="material-symbols-outlined text-5xl text-gray-200 dark:text-gray-700 block mb-3">event_seat</span>
             <p class="text-gray-400 text-sm">Waiting list is empty or no matches found.</p>
             <p class="text-gray-400 text-xs mt-1">Students will appear here as they are added to the procession queue.</p>
          </div>
        </div>

        <!-- Queue Activity Log -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col min-h-[350px]">
          <h3 class="text-gray-500 dark:text-gray-400 text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-500 text-sm">format_list_numbered</span>
            MC Queue Activity Log
          </h3>
          <div v-if="activityLog.length > 0" class="flex-1 overflow-y-auto space-y-2 pr-2">
            <div v-for="(log, idx) in activityLog" :key="idx"
              class="flex items-center gap-3 text-sm py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 px-2 rounded-lg transition-colors">
              <span class="w-2 h-2 rounded-full shrink-0" :class="statusDot(log.status)"></span>
              <span class="text-gray-900 dark:text-white font-medium flex-1 truncate">{{ log.studentName }}</span>
              <span class="text-gray-500 text-xs shrink-0 px-2 py-0.5 rounded-full"
                :class="statusBadge(log.status)">{{ statusLabel(log.status) }}</span>
              <span class="text-gray-400 text-[10px] shrink-0 font-mono">{{ formatTS(log.updatedAt) }}</span>
            </div>
          </div>
          <div v-else class="flex-1 flex flex-col items-center justify-center text-center">
            <span class="material-symbols-outlined text-4xl text-gray-200 dark:text-gray-700 block mb-2">receipt_long</span>
            <p class="text-gray-400 text-sm">MC queue changes will appear here in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { io } from 'socket.io-client';
import api from '@/services/api';
import draggable from 'vuedraggable';

// Same nav as all other staff pages — just added monitor entry
// Data state
const ceremonyConnected = ref(false);
const onStageInfo = ref(null);
const recentCheckins = ref([]);
const activityLog = ref([]);
const waitingList = ref([]);
const filterMajor = ref('');
const loadingQueue = ref(false);
const loadingCheckins = ref(false);
let socket = null;

const formatTS = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const statusLabel = (s) => ({ waiting: 'Waiting', ready: 'Ready', on_stage: 'On Stage', completed: 'Done' }[s] || s);
const statusDot = (s) => ({ waiting: 'bg-gray-400', ready: 'bg-yellow-400', on_stage: 'bg-red-500', completed: 'bg-green-500' }[s] || 'bg-gray-400');
const statusBadge = (s) => ({
  waiting: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  ready: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  on_stage: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
}[s] || 'bg-gray-100 text-gray-600');

// Initial Fetch Queue
const fetchQueue = async () => {
  loadingQueue.value = true;
  try {
    const response = await api.get('/mc/queue');
    if (response.data.success) {
      const queue = response.data.data.queue; // Backend returns { success: true, data: { queue: [...] } }
      
      // Extract who is on stage right now
      const onStage = queue.find(q => q.status === 'on_stage');
      if (onStage) {
        onStageInfo.value = {
          studentName: onStage.user.fullName,
          major: onStage.user.major,
          queueNumber: onStage.queueNumber,
          queueId: onStage.id
        };
      } else {
        onStageInfo.value = null;
      }
      
      // Filter out waiting and ready students for the waiting list panel
      waitingList.value = queue
        .filter(q => q.status === 'waiting' || q.status === 'ready')
        .map(q => ({
          id: q.id,
          studentName: q.user.fullName,
          major: q.user.major,
          queueNumber: q.queueNumber,
          status: q.status
        }))
        .sort((a, b) => a.queueNumber - b.queueNumber);
    }
  } catch (error) {
    console.error('Error fetching procession queue:', error);
  } finally {
    loadingQueue.value = false;
  }
};

const uniqueMajors = computed(() => {
  return [...new Set(waitingList.value.map(s => s.major).filter(Boolean))].sort();
});

const displayedWaitingList = computed({
  get: () => {
    if (!filterMajor.value) return waitingList.value;
    return waitingList.value.filter(s => s.major === filterMajor.value);
  },
  set: (newVal) => {
    if (!filterMajor.value) {
      waitingList.value = newVal;
      return;
    }
    
    // Merge the dragged filtered list back into the main list
    // We do this by finding the relative positions of the original filtered items in the main list
    // and replacing them in order with the newly ordered filtered items.
    const originalFilteredIndices = [];
    waitingList.value.forEach((item, index) => {
      if (item.major === filterMajor.value) {
        originalFilteredIndices.push(index);
      }
    });

    const updatedList = [...waitingList.value];
    // Put the newly ordered items back into the slots they originally occupied
    for (let i = 0; i < originalFilteredIndices.length; i++) {
      updatedList[originalFilteredIndices[i]] = newVal[i];
    }
    
    waitingList.value = updatedList;
  }
});

const onQueueReorder = async () => {
  try {
    const orderedIds = waitingList.value.map(s => s.id);
    await api.patch('/mc/queue/reorder', { orderedIds });
  } catch (error) {
    console.error('Failed to update queue order', error);
    fetchQueue(); // Reload correct order on failure
  }
};

// Initial Fetch Recent Check-ins
const fetchRecentCheckins = async () => {
  loadingCheckins.value = true;
  try {
    const response = await api.get('/mc/checked-in');
    if (response.data.success && response.data.data.students) {
      const students = response.data.data.students;
      
      // We want the most recent first, so reverse the array if backend sorts ascending
      // Take the top 20
      recentCheckins.value = students.reverse().slice(0, 20).map(s => ({
        id: s.ticketId,
        studentName: s.fullName,
        major: s.major,
        seatNumber: s.seatNumber,
        timestamp: s.scannedAt
      }));
    }
  } catch (error) {
    console.error('Error fetching recent check-ins:', error);
  } finally {
    loadingCheckins.value = false;
  }
};

onMounted(() => {
  fetchQueue();
  fetchRecentCheckins();

  // If VITE_API_URL is just '/api', the proxy is used for HTTP. For WebSockets, we connect directly to avoid proxy drops.
  let backendUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
  if (backendUrl === '/api') backendUrl = 'http://127.0.0.1:5000';
  else backendUrl = backendUrl.replace('/api', '');

  socket = io(backendUrl, { transports: ['websocket', 'polling'] });

  socket.on('connect', () => {
    ceremonyConnected.value = true;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    socket.emit('join', { userId: user.id, role: 'staff' });
    socket.emit('ceremony:join', { role: 'staff', name: user.fullName || 'Staff' });
  });

  socket.on('disconnect', () => { ceremonyConnected.value = false; });

  socket.on('ceremony:student_updated', (data) => {
    console.log('[Staff/Monitor] Received ceremony:student_updated via Socket:', data);
    // 1. Update On Stage Info
    if (data.status === 'on_stage') {
      onStageInfo.value = data;
    } else if (data.status === 'completed' && onStageInfo.value?.queueId === data.queueId) {
      onStageInfo.value = null;
    }

    // 2. Update Waiting List logic
    if (data.status === 'waiting' || data.status === 'ready') {
      // Check if already in waiting list, if so update it, else add it
      const existingIdx = waitingList.value.findIndex(item => item.id === data.queueId);
      if (existingIdx !== -1) {
        waitingList.value[existingIdx].status = data.status;
      } else {
        waitingList.value.push({
          id: data.queueId,
          studentName: data.studentName,
          major: data.major,
          queueNumber: data.queueNumber,
          status: data.status
        });
        // re-sort by queue number
        waitingList.value.sort((a, b) => a.queueNumber - b.queueNumber);
      }
    } else {
      // If status changed to on_stage or completed, remove from waiting list
      waitingList.value = waitingList.value.filter(item => item.id !== data.queueId);
    }

    // 3. Add to activity log history
    activityLog.value.unshift({ ...data, updatedAt: data.updatedAt || new Date() });
    if (activityLog.value.length > 30) activityLog.value.pop();
  });

  socket.on('ceremony:ticket_scanned', (data) => {
    console.log('[Staff/Monitor] Received ceremony:ticket_scanned via Socket:', data);
    recentCheckins.value.unshift({ ...data, timestamp: data.timestamp || new Date() });
    if (recentCheckins.value.length > 20) recentCheckins.value.pop();
  });

  socket.on('ceremony:queue_reordered', (data) => {
    console.log('[Staff/Monitor] Received ceremony:queue_reordered via Socket:', data);
    fetchQueue();
  });
});

onUnmounted(() => {
  if (socket) socket.disconnect();
});
</script>
