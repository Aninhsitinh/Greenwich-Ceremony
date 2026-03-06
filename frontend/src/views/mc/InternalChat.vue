<template>
  <div class="h-[calc(100vh-theme(spacing.16)-env(safe-area-inset-bottom))] lg:h-[calc(100vh-0px)] flex bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden m-4 lg:m-6">
    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
      
      <!-- Chat Header -->
      <div class="p-4 bg-gray-900 dark:bg-gray-950 border-b border-gray-800 flex justify-between items-center text-white rounded-t-2xl z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
            <span class="material-symbols-outlined">campaign</span>
          </div>
          <div>
            <h3 class="font-bold">Internal Communication</h3>
            <p class="text-xs text-gray-400">MC & Staff Only • Real-time Alerts</p>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-gray-50 dark:bg-gray-900 custom-scrollbar">
        <div v-if="loading" class="flex justify-center p-4">
          <div class="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
        </div>
        
        <div v-if="messages.length === 0 && !loading" class="flex-1 flex flex-col justify-center items-center text-center text-gray-400 dark:text-gray-500 text-sm py-20 h-full">
          <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">forum</span>
          <p class="text-lg font-semibold text-gray-500 dark:text-gray-400">No messages yet.</p>
          <p>Send an alert to all Staff members responding to the ceremony!</p>
        </div>

        <div
          v-else
          v-for="msg in messages"
          :key="msg._id || msg.id"
          :class="['flex gap-3', msg.senderId === currentUserId ? 'flex-row-reverse' : 'flex-row']"
        >
          <!-- Avatar -->
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold overflow-hidden shadow-sm"
            :class="msg.senderRole === 'mc' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'"
          >
            <img 
              v-if="msg.profilePhoto || msg.senderId?.profilePhoto" 
              :src="msg.profilePhoto || msg.senderId?.profilePhoto" 
              class="w-full h-full object-cover"
            />
            <span v-else>
              {{ msg.senderRole === 'mc' ? 'MC' : 'STF' }}
            </span>
          </div>

          <!-- Bubble -->
          <div :class="['max-w-[75%] lg:max-w-[60%]', msg.senderId === currentUserId ? 'items-end' : 'items-start']">
            <p v-if="msg.senderId !== currentUserId" class="text-xs text-gray-500 mb-1 ml-1 align-baseline">
              {{ typeof msg.sender === 'object' ? (msg.sender?.fullName || 'Unknown') : (msg.sender || msg.senderId?.fullName || 'Unknown') }}
              <span class="uppercase text-[10px] font-bold ml-1 px-2 py-0.5 rounded-full" 
                :class="msg.senderRole === 'mc' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'">
                {{ msg.senderRole }}
              </span>
            </p>
            
            <div
              :class="[
                'px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed',
                msg.senderId === currentUserId
                  ? 'bg-gray-900 text-white dark:bg-gray-700 rounded-br-none'
                  : msg.senderRole === 'mc'
                    ? 'bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 text-gray-900 dark:text-white rounded-bl-none'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-none'
              ]"
            >
              <p class="break-words whitespace-pre-wrap">{{ msg.text || msg.message }}</p>
            </div>
            <p class="text-xs text-gray-400 mt-1" :class="msg.senderId === currentUserId ? 'text-right' : 'text-left'">
              {{ formatTime(msg.timestamp || msg.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Input Box -->
      <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
        <form @submit.prevent="sendMessage" class="flex gap-3">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type an alert to all Staff..."
            class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-purple-500 transition-all font-medium dark:text-white"
          />
          <button
            type="submit"
            :disabled="!newMessage.trim() || sending"
            class="px-6 py-3 bg-gray-900 dark:bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
          >
            <span class="hidden sm:inline">Send</span>
            <span class="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>

    </div>

    <!-- Audio Player for Pings -->
    <audio ref="pingAudio" preload="auto">
      <source src="data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import socketService from '@/services/socketService';
import api from '@/services/api';

const authStore = useAuthStore();
const toast = useToast();

const messages = ref([]);
const newMessage = ref('');
const loading = ref(false);
const sending = ref(false);
const messagesContainer = ref(null);
const pingAudio = ref(null);

const ROOM_ID = 'ceremony_internal';

const currentUserId = computed(() => authStore.user?.id || authStore.user?._id);
const currentUserRole = computed(() => authStore.user?.role);

// A simple notification sound
const playPing = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.error('Audio play failed', e);
  }
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const loadHistory = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/chat/${ROOM_ID}/messages?limit=100`);
    if (response.data.success) {
      messages.value = response.data.data.messages;
      scrollToBottom();
    }
  } catch (err) {
    console.error('Failed to load internal chat history', err);
  } finally {
    loading.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return;
  
  sending.value = true;
  try {
    socketService.sendChatMessage({
      roomId: ROOM_ID,
      receiverId: null, // Broadcast to room
      senderId: currentUserId.value,
      senderRole: currentUserRole.value,
      text: newMessage.value.trim()
    });
    newMessage.value = '';
    scrollToBottom();
  } catch (err) {
    console.error('Error sending message', err);
    toast.error('Failed to send message');
  } finally {
    sending.value = false;
  }
};

const handleIncomingMessage = (msg) => {
  if (msg.roomId !== ROOM_ID) return;
  
  const exists = messages.value.find(m => (m._id || m.id) === (msg._id || msg.id));
  if (!exists) {
    messages.value.push(msg);
  }
  
  scrollToBottom();

  if (msg.senderId !== currentUserId.value) {
    playPing();
    const roleBadge = msg.senderRole === 'mc' ? '🎤 MC' : '👔 Staff';
    toast.info(`[${roleBadge} Alert]\n${msg.text || msg.message}`, {
      timeout: 6000,
      position: 'bottom-left'
    });
  }
};

onMounted(() => {
  if (authStore.user && ['mc', 'staff', 'admin'].includes(authStore.user.role)) {
    if (!socketService.isConnected()) {
      socketService.connect(authStore.token, currentUserId.value);
    }
    
    if (socketService.isConnected()) {
      socketService.joinRoom(ROOM_ID);
    }
    
    socketService.on('connect', () => {
      socketService.joinRoom(ROOM_ID);
    });
    
    socketService.on('chat:message', handleIncomingMessage);
    
    loadHistory();
  }
});

onUnmounted(() => {
  socketService.leaveRoom(ROOM_ID);
  socketService.off('chat:message', handleIncomingMessage);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
</style>
