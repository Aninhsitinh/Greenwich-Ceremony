<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
    <!-- Sticky Top Navigation -->
    <div 
      :class="[
        'sticky top-0 z-40 bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border-b border-white/20 px-4 md:px-6 py-3 flex items-center justify-between shadow-xl transition-all duration-500',
        isFocusMode ? '-translate-y-full opacity-0 pointer-events-none absolute' : 'translate-y-0 opacity-100'
      ]"
    >
      <div class="absolute inset-0 mesh-gradient opacity-10 -z-10"></div>
      <div class="flex items-center gap-4">
        <router-link to="/staff" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center">
           <span class="material-symbols-outlined">arrow_back</span>
        </router-link>
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-black text-gray-900 dark:text-white">{{ $t('staff.ceremony_monitor') }}</h1>
          <div class="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span class="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Live Sync</span>
          </div>
        </div>
      </div>
      <button 
        @click="isFocusMode = true" 
        class="btn glass-card border-white/10 text-xs py-1.5 px-4 flex items-center gap-2 hover:bg-white/20 press-feedback"
      >
        <span class="material-symbols-outlined text-sm text-primary">visibility_off</span>
        Focus Mode
      </button>
    </div>

    <!-- Exit Focus Mode Button -->
    <div 
      v-if="isFocusMode"
      class="fixed bottom-6 right-6 z-50 animate-bounce-in"
    >
      <button 
        @click="isFocusMode = false"
        class="w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group press-feedback"
        title="Exit Focus Mode"
      >
        <span class="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">visibility</span>
      </button>
    </div>

    <!-- Main Content Flow -->
    <div class="w-full px-4 md:px-8 py-6 space-y-6">
      <!-- Header -->
      <div 
        :class="[
          'flex items-center justify-between transition-all duration-700',
          isFocusMode ? 'h-0 overflow-hidden opacity-0 mb-0' : ''
        ]"
      >
        <div>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white">Ceremony Monitor</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5 italic">Real-time procession management with bi-directional sync</p>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 rounded-full glass-card border-none shadow-lg"
          :class="ceremonyConnected
            ? 'neon-glow-success'
            : 'neon-glow-error'">
          <span class="w-2.5 h-2.5 rounded-full" :class="ceremonyConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'"></span>
          <span class="text-[10px] font-black tracking-widest uppercase" :class="ceremonyConnected ? 'text-green-500' : 'text-red-500'">
            {{ ceremonyConnected ? 'Live Sync Active' : 'Disconnected' }}
          </span>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- On Stage Panel -->
        <div class="relative overflow-hidden glass-card mesh-gradient animate-mesh border-none p-6 md:p-8 shadow-2xl min-h-[250px] md:min-h-[300px] flex flex-col group hover-lift transition-all duration-700"
             :class="isFocusMode ? 'lg:col-span-1' : ''">
          <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <h3 class="text-white/60 text-[10px] font-black tracking-[0.2em] uppercase mb-6 flex items-center gap-2 relative z-10">
            <span class="material-symbols-outlined text-white/80 text-sm">theater_comedy</span>
            Currently On Stage
          </h3>

          <div v-if="onStageInfo" class="flex-1 flex flex-col justify-center items-center text-center gap-4 relative z-10">
            <div class="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/30 neon-glow-info">
              <span class="text-4xl text-white font-black drop-shadow-lg">{{ onStageInfo.studentName?.[0] || '?' }}</span>
            </div>
            <div>
              <h2 class="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-xl">{{ onStageInfo.studentName }}</h2>
              <p class="text-white/70 text-sm mt-1 md:text-base font-medium italic">{{ onStageInfo.major }} · Queue #{{ onStageInfo.queueNumber }}</p>
              <span class="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-[10px] font-black tracking-widest border border-white/20 neon-glow-success animate-pulse">
                <span class="material-symbols-outlined text-xs">mic</span>
                ON STAGE NOW
              </span>
            </div>
          </div>

          <div v-else class="flex-1 flex flex-col justify-center items-center text-center relative z-10">
            <div class="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
               <span class="material-symbols-outlined text-4xl text-white/20">hourglass_empty</span>
            </div>
            <p class="text-white/40 text-xs font-bold uppercase tracking-widest">Waiting for next student...</p>
          </div>
        </div>

        <!-- Recent Check-ins Panel -->
        <div :class="['glass-card p-6 border-transparent flex flex-col min-h-[300px] hover-lift transition-all duration-700', isFocusMode ? 'h-0 scale-95 opacity-0 pointer-events-none overflow-hidden' : '']">
          <h3 class="text-gray-500 dark:text-gray-400 text-[10px] font-black tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-sm">qr_code_scanner</span>
            Recent Check-ins ({{ recentCheckins.length }})
          </h3>

          <div v-if="recentCheckins.length > 0" class="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
            <div v-for="(checkin, idx) in recentCheckins" :key="idx"
              class="flex items-center gap-3 p-3 rounded-2xl glass-card border-none transition-all duration-300 hover:scale-[1.02]"
              :class="idx === 0 ? 'neon-glow-success bg-green-500/5' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-black shrink-0 shadow-lg">
                {{ checkin.studentName?.[0] || '?' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-gray-900 dark:text-white text-sm font-bold truncate">{{ checkin.studentName }}</p>
                <p class="text-gray-500 text-[10px] font-bold uppercase tracking-tighter truncate">{{ checkin.major || 'Student' }} · Seat {{ checkin.seatNumber || 'N/A' }}</p>
              </div>
              <span class="text-gray-400 text-[10px] shrink-0 font-black italic">{{ formatTS(checkin.timestamp) }}</span>
            </div>
          </div>

          <div v-else class="flex-1 flex flex-col items-center justify-center opacity-40">
            <span class="material-symbols-outlined text-5xl text-gray-400 block mb-3">how_to_reg</span>
            <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">No check-ins yet.</p>
          </div>
        </div>
      </div>

      <!-- Queue Activity & Waiting List Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Waiting List Panel -->
        <div class="glass-card p-6 border-transparent flex flex-col min-h-[350px] md:min-h-[450px] transition-all duration-700" 
             :class="isFocusMode ? 'lg:col-span-1 border-primary/20 neon-glow-info' : ''">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h3 class="text-gray-500 dark:text-gray-400 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2">
              <span class="material-symbols-outlined text-yellow-500 text-sm">groups</span>
              Procession Queue ({{ displayedWaitingList.length }})
            </h3>
            <div class="flex items-center gap-2">
              <select v-model="filterMajor" class="text-[10px] font-black uppercase tracking-widest bg-gray-50/50 dark:bg-gray-700/50 border-none rounded-full px-4 py-2 focus:ring-1 focus:ring-primary text-gray-600 dark:text-gray-300 cursor-pointer">
                <option value="">All Majors</option>
                <option v-for="m in uniqueMajors" :key="m" :value="m">{{ m }}</option>
              </select>
              <button @click="fetchQueue" :disabled="loadingQueue" class="text-primary hover:text-white hover:bg-primary transition-all p-2 rounded-full glass-card border-none disabled:opacity-50 press-feedback shadow-lg">
                <span class="material-symbols-outlined text-sm font-bold block" :class="{'animate-spin': loadingQueue}">sync</span>
              </button>
            </div>
          </div>

          <div v-if="loadingQueue && waitingList.length === 0" class="flex-1 space-y-3">
             <div v-for="i in 5" :key="i" class="h-16 glass-card border-none bg-white/5 animate-shimmer"></div>
          </div>
          
          <draggable 
            v-else-if="displayedWaitingList.length > 0" 
            v-model="displayedWaitingList"
            group="staff-queue"
            item-key="id"
            @end="onQueueReorder"
            ghost-class="opacity-50"
            class="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar"
          >
            <template #item="{ element: student }">
              <div 
                class="flex items-center gap-3 p-3 rounded-2xl glass-card border-none transition-all duration-300 hover:scale-[1.01] hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
                :class="student.status === 'ready' ? 'neon-glow-warning bg-yellow-500/5' : ''">
                
                <span class="material-symbols-outlined text-gray-400 cursor-grab active:cursor-grabbing text-sm shrink-0 group-hover:text-primary transition-colors">drag_indicator</span>
                
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-lg transform group-hover:rotate-3 transition-transform"
                     :class="student.status === 'ready' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'">
                  #{{ student.queueNumber }}
                </div>
                
                <div class="flex-1 min-w-0 flex items-center justify-between">
                  <div>
                    <p class="text-gray-900 dark:text-white text-sm font-black truncate">{{ student.studentName }}</p>
                    <p class="text-gray-500 text-[10px] font-bold uppercase tracking-tighter truncate mt-0.5">{{ student.major }}</p>
                  </div>
                  <span class="px-2 py-1 rounded-md text-[10px] font-black tracking-widest shrink-0 uppercase"
                        :class="student.status === 'ready' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'">
                    {{ student.status }}
                  </span>
                </div>
              </div>
            </template>
          </draggable>
          
          <div v-else class="flex-1 flex flex-col items-center justify-center text-center px-4 opacity-40">
             <span class="material-symbols-outlined text-5xl text-gray-400 block mb-3">event_seat</span>
             <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">Queue is empty or filtered.</p>
          </div>
        </div>

        <!-- Queue Activity Log -->
        <div :class="['glass-card p-6 border-transparent flex flex-col min-h-[350px] md:min-h-[450px] transition-all duration-700', isFocusMode ? 'h-0 scale-95 opacity-0 pointer-events-none overflow-hidden' : '']">
          <h3 class="text-gray-500 dark:text-gray-400 text-[10px] font-black tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-sm">format_list_numbered</span>
            MC Live Queue Log
          </h3>
          <div v-if="activityLog.length > 0" class="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            <div v-for="(log, idx) in activityLog" :key="idx"
              class="flex items-center gap-3 text-sm py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 px-2 rounded-xl transition-colors group">
              <span class="w-2 h-2 rounded-full shrink-0 animate-pulse" :class="statusDot(log.status)"></span>
              <span class="text-gray-900 dark:text-white font-bold flex-1 truncate group-hover:text-primary transition-colors text-xs">{{ log.studentName }}</span>
              <span class="text-gray-500 text-[10px] font-black uppercase tracking-widest shrink-0 px-3 py-1 rounded-full border border-transparent group-hover:border-white/10"
                :class="statusBadge(log.status)">{{ statusLabel(log.status) }}</span>
              <span class="text-gray-400 text-[10px] shrink-0 font-black italic">{{ formatTS(log.updatedAt) }}</span>
            </div>
          </div>
          <div v-else class="flex-1 flex flex-col items-center justify-center text-center opacity-40">
            <span class="material-symbols-outlined text-4xl text-gray-400 block mb-2">receipt_long</span>
            <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">Real-time log waiting...</p>
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

const isFocusMode = ref(false);

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
