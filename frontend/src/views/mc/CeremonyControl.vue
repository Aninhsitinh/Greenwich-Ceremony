<template>
  <div class="w-full max-w-7xl mx-auto px-4 py-6 space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-2xl font-black text-gray-900 dark:text-white">Ceremony Control</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Real-time bidirectional sync with Staff</p>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="filterMajor" @change="fetchQueue"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500">
          <option value="">All Majors</option>
          <option v-for="m in majors" :key="m" :value="m">{{ m }}</option>
        </select>
        <button @click="fetchQueue"
          class="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-sm rounded-lg transition-colors">
          <span class="material-symbols-outlined text-sm">refresh</span>
        </button>
      </div>
    </div>

    <!-- On Stage Hero -->
    <div v-if="onStageStudent"
      class="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl p-5 shadow-xl">
      <div class="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      <div class="relative z-10 flex items-center gap-4">
        <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0">
          {{ onStageStudent.user?.fullName?.[0] || '?' }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="px-2 py-0.5 bg-white/30 text-white text-xs font-bold rounded-full uppercase animate-pulse">🎤 ON STAGE</span>
            <span class="text-white/70 text-xs">#{{ onStageStudent.queueNumber }}</span>
          </div>
          <h3 class="text-white text-xl font-black truncate">{{ onStageStudent.user?.fullName }}</h3>
          <p class="text-orange-200 text-sm">{{ onStageStudent.major }} · Class of {{ onStageStudent.user?.classOf }}</p>
          <p class="text-orange-200/70 text-xs mt-1">
            Seat: {{ onStageStudent.user?.seatBookings?.[0]?.seatNumber || 'N/A' }}
            · Called: {{ formatTime(onStageStudent.callTime) }}
          </p>
        </div>
        <button @click="updateStatus(onStageStudent, 'completed')"
          class="shrink-0 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all flex items-center gap-2 text-sm">
          <span class="material-symbols-outlined text-sm">task_alt</span>
          Done
        </button>
      </div>
    </div>

    <!-- No on-stage placeholder -->
    <div v-else class="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center">
      <span class="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-600 block mb-3">theater_comedy</span>
      <p class="text-gray-500 dark:text-gray-400 text-sm">No student on stage. Call one from the Ready queue below.</p>
    </div>

    <!-- 3-Column Queue Board -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

      <!-- Ready Column -->
      <div class="bg-white dark:bg-gray-800 border border-yellow-200 dark:border-yellow-800/40 rounded-xl flex flex-col shadow-sm">
        <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span class="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
          <span class="text-gray-900 dark:text-white text-sm font-semibold">Ready ({{ readyList.length }})</span>
        </div>
        <div class="flex-1 overflow-y-auto max-h-96 divide-y divide-gray-100 dark:divide-gray-700">
          <div v-if="readyList.length === 0" class="text-center text-gray-400 text-xs py-8">No one ready</div>
          <draggable 
            v-else
            v-model="readyList" 
            group="ready" 
            item-key="id" 
            @end="onQueueReorder"
            ghost-class="opacity-50"
          >
            <template #item="{ element: item }">
              <div class="p-3 cursor-move hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="material-symbols-outlined text-gray-400 cursor-grab active:cursor-grabbing text-sm">drag_indicator</span>
                  <span class="text-yellow-600 dark:text-yellow-400 text-xs font-bold">#{{ item.queueNumber }}</span>
                  <span class="text-gray-900 dark:text-white text-sm font-semibold flex-1 truncate">{{ item.user?.fullName }}</span>
                </div>
                <p class="text-gray-500 text-xs mb-2 truncate ml-6">{{ item.major }} · Seat {{ item.user?.seatBookings?.[0]?.seatNumber || 'N/A' }}</p>
                <button @click="updateStatus(item, 'on_stage')" :disabled="!!onStageStudent"
                  class="w-full py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                  <span class="material-symbols-outlined text-xs">mic</span> Call to Stage
                </button>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- Waiting Column -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col shadow-sm">
        <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span class="w-2.5 h-2.5 bg-gray-400 rounded-full"></span>
          <span class="text-gray-900 dark:text-white text-sm font-semibold">Waiting ({{ waitingList.length }})</span>
        </div>
        <div class="flex-1 overflow-y-auto max-h-96 divide-y divide-gray-100 dark:divide-gray-700">
          <div v-if="waitingList.length === 0" class="text-center text-gray-400 text-xs py-8">Queue is empty</div>
          <draggable 
            v-else
            v-model="waitingList" 
            group="waiting" 
            item-key="id" 
            @end="onQueueReorder"
            ghost-class="opacity-50"
          >
            <template #item="{ element: item }">
              <div class="p-3 cursor-move hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="material-symbols-outlined text-gray-400 cursor-grab active:cursor-grabbing text-sm">drag_indicator</span>
                  <span class="text-gray-500 text-xs font-bold">#{{ item.queueNumber }}</span>
                  <span class="text-gray-900 dark:text-white text-sm font-semibold flex-1 truncate">{{ item.user?.fullName }}</span>
                </div>
                <p class="text-gray-500 text-xs mb-2 truncate ml-6">{{ item.major }} · Seat {{ item.user?.seatBookings?.[0]?.seatNumber || 'N/A' }}</p>
                <button @click="updateStatus(item, 'ready')"
                  class="w-full py-1.5 bg-yellow-500 hover:bg-yellow-400 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                  <span class="material-symbols-outlined text-xs">notifications_active</span> Mark Ready
                </button>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- Completed Column -->
      <div class="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800/40 rounded-xl flex flex-col shadow-sm">
        <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span class="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
          <span class="text-gray-900 dark:text-white text-sm font-semibold">Completed ({{ completedList.length }})</span>
        </div>
        <div class="flex-1 overflow-y-auto max-h-96 divide-y divide-gray-100 dark:divide-gray-700">
          <div v-if="completedList.length === 0" class="text-center text-gray-400 text-xs py-8">None completed yet</div>
          <div v-for="item in completedList" :key="item.id" class="flex items-center gap-2 px-4 py-3">
            <span class="material-symbols-outlined text-green-500 text-base">check_circle</span>
            <div class="flex-1 min-w-0">
              <p class="text-gray-900 dark:text-white text-xs font-semibold truncate">{{ item.user?.fullName }}</p>
              <p class="text-gray-500 text-xs">{{ formatTime(item.completedTime) }}</p>
            </div>
            <span class="text-gray-400 text-xs shrink-0">#{{ item.queueNumber }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 bg-gray-900 border border-purple-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl">
        <span class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
        <span class="text-white text-sm">{{ toast }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '@/services/api';
import draggable from 'vuedraggable';

const queue = ref([]);
const filterMajor = ref('');
const toast = ref('');
let toastTimeout = null;
let socket = null;

// We need the lists to be settable by draggable, so we use computed with get/set
const waitingList = computed({
  get: () => {
    return queue.value
      .filter(q => q.status === 'waiting')
      .sort((a, b) => a.queueNumber - b.queueNumber);
  },
  set: (val) => {
    // Draggable updates the array, we sync back to 'queue'
    const otherStatus = queue.value.filter(q => q.status !== 'waiting');
    queue.value = [...otherStatus, ...val];
  }
});

const readyList = computed({
  get: () => queue.value.filter(q => q.status === 'ready').sort((a, b) => a.queueNumber - b.queueNumber),
  set: (val) => {
    const otherStatus = queue.value.filter(q => q.status !== 'ready');
    queue.value = [...otherStatus, ...val];
  }
});

const onQueueReorder = async (evt) => {
  try {
    // Determine which list was manipulated based on item status or context
    // The visual queue lists are already updated by vuedraggable's `v-model`
    // We can bundle both into a single order array and send to backend
    // Or just send ALL ordered items so the backend resets queueNumbers accurately
    
    // Sort all active people (waiting + ready) visually to be submitted to backend
    const allOrdered = [
      ...waitingList.value,
      ...readyList.value
    ];
    
    const orderedIds = allOrdered.map(q => q.id);
    await api.patch('/mc/queue/reorder', { orderedIds });
    showToast('Queue reordered automatically');
  } catch (error) {
    showToast('Failed to save queue order limit');
    fetchQueue(); // restore state on error
  }
};

const onStageStudent = computed(() => queue.value.find(q => q.status === 'on_stage'));
const completedList = computed(() => queue.value.filter(q => q.status === 'completed').slice(0, 20));
const majors = computed(() => [...new Set(queue.value.map(q => q.major).filter(Boolean))]);

const fetchQueue = async () => {
  try {
    const params = {};
    if (filterMajor.value) params.major = filterMajor.value;
    const res = await api.get('/mc/queue', { params });
    if (res.data.success) queue.value = res.data.data.queue;
  } catch (e) { /* silent */ }
};

const updateStatus = async (item, newStatus) => {
  try {
    await api.patch(`/mc/queue/${item.id}/status`, { status: newStatus });
    const idx = queue.value.findIndex(q => q.id === item.id);
    if (idx !== -1) {
      queue.value[idx] = { ...queue.value[idx], status: newStatus,
        callTime: newStatus === 'on_stage' ? new Date() : queue.value[idx].callTime,
        completedTime: newStatus === 'completed' ? new Date() : queue.value[idx].completedTime
      };
    }
    showToast(`${item.user?.fullName} → ${statusLabel(newStatus)}`);
  } catch (e) {
    showToast('Error updating status');
  }
};

const statusLabel = (s) => ({ waiting: 'Waiting', ready: 'Ready', on_stage: 'On Stage', completed: 'Completed' }[s] || s);
const formatTime = (ts) => { if (!ts) return '–'; return new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); };
const showToast = (msg) => { toast.value = msg; clearTimeout(toastTimeout); toastTimeout = setTimeout(() => { toast.value = ''; }, 3000); };

onMounted(async () => {
  await fetchQueue();
  const waitForSocket = setInterval(() => {
    socket = window._ceremonySocket;
    if (socket) {
      clearInterval(waitForSocket);
      socket.on('ceremony:student_updated', (data) => {
        console.log('[MC/Control] Received ceremony:student_updated via Socket:', data);
        const idx = queue.value.findIndex(q => q.id === data.queueId);
        if (idx !== -1) {
          // Merge new status and timestamps, AND patch the user profile deeply if it exists
          queue.value[idx] = { 
            ...queue.value[idx], 
            status: data.status, 
            callTime: data.callTime, 
            completedTime: data.completedTime,
            user: {
              ...queue.value[idx].user,
              profilePhoto: data.profilePhoto, // Ensure profilePhoto is propagated
            }
          };
        }
        showToast(`🔄 ${data.studentName} → ${statusLabel(data.status)} (by ${data.updatedBy})`);
      });
      socket.on('ceremony:ticket_scanned', (data) => { 
        console.log('[MC/Control] Received ceremony:ticket_scanned via Socket:', data);
        fetchQueue(); 
      });
      socket.on('ceremony:queue_updated', (data) => { 
        console.log('[MC/Control] Received ceremony:queue_updated via Socket:', data);
        fetchQueue(); 
      });
      socket.on('ceremony:queue_reordered', (data) => {
        console.log('[MC/Control] Received ceremony:queue_reordered via Socket:', data);
        fetchQueue();
      });
    }
  }, 300);
});

onUnmounted(() => {
  clearTimeout(toastTimeout);
  if (socket) {
    socket.off('ceremony:student_updated');
    socket.off('ceremony:ticket_scanned');
    socket.off('ceremony:queue_updated');
  }
});
</script>
<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateY(20px); }
.toast-leave-to { opacity: 0; transform: translateX(20px); }
</style>
