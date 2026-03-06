<template>
  <!-- Global Internal Chat Widget -->
  <div class="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 font-sans flex flex-col items-end">
    <!-- Chat Panel -->
    <Transition name="slide-fade">
      <div 
        v-if="isOpen" 
        class="mb-4 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right"
        style="height: 500px; max-height: calc(100vh - 120px);"
      >
        <!-- Header -->
        <div class="bg-gray-900 dark:bg-gray-950 p-4 flex justify-between items-center text-white">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-yellow-500">campaign</span>
            <div>
              <h3 class="font-bold text-sm">Internal Communication</h3>
              <p class="text-[10px] text-gray-400">MC & Staff Only</p>
            </div>
          </div>
          <button @click="toggleChat" class="text-gray-400 hover:text-white transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Messages Area -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 custom-scrollbar">
          <div v-if="loading" class="flex justify-center p-4">
            <div class="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
          
          <div v-if="messages.length === 0 && !loading" class="text-center text-gray-400 dark:text-gray-500 text-sm py-10">
            No messages yet. Send an alert!
          </div>

          <div
            v-else
            v-for="msg in messages"
            :key="msg._id || msg.id"
            :class="['flex gap-2', msg.senderId === currentUserId ? 'flex-row-reverse' : 'flex-row']"
          >
            <!-- Avatar -->
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold overflow-hidden"
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
            <div :class="['max-w-[75%]', msg.senderId === currentUserId ? 'items-end' : 'items-start']">
              <p v-if="msg.senderId !== currentUserId" class="text-[10px] text-gray-500 mb-1 ml-1">
                {{ typeof msg.sender === 'object' ? (msg.sender?.fullName || 'Unknown') : (msg.sender || msg.senderId?.fullName || 'Unknown') }}
                <span class="uppercase text-[9px] font-bold ml-1" :class="msg.senderRole === 'mc' ? 'text-purple-500' : 'text-blue-500'">
                  ({{ msg.senderRole }})
                </span>
              </p>
              
              <div
                :class="[
                  'px-3 py-2 rounded-2xl text-sm shadow-sm',
                  msg.senderId === currentUserId
                    ? 'bg-gray-900 text-white dark:bg-gray-700 rounded-br-none'
                    : msg.senderRole === 'mc'
                      ? 'bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 text-gray-900 dark:text-white rounded-bl-none'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                ]"
              >
                <p class="break-words whitespace-pre-wrap">{{ msg.text || msg.message }}</p>
              </div>
              <p class="text-[10px] text-gray-400 mt-1" :class="msg.senderId === currentUserId ? 'text-right' : 'text-left'">
                {{ formatTime(msg.timestamp || msg.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Input Box -->
        <div class="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <form @submit.prevent="sendMessage" class="flex gap-2 relative">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type an alert..."
              class="flex-1 pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 transition-all text-sm dark:text-white"
            />
            <button
              type="submit"
              :disabled="!newMessage.trim() || sending"
              class="absolute right-1 top-1 w-8 h-8 bg-gray-900 dark:bg-gray-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-all"
            >
              <span class="material-symbols-outlined text-sm" style="margin-left: 2px;">send</span>
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- FAB Button -->
    <button
      @click="toggleChat"
      class="w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center relative z-50"
    >
      <span class="material-symbols-outlined text-2xl" v-if="!isOpen">headset_mic</span>
      <span class="material-symbols-outlined text-2xl" v-else>close</span>
      
      <!-- Unread Badge -->
      <span 
        v-if="unreadCount > 0 && !isOpen" 
        class="absolute -top-1 -right-1 flex h-5 w-5 bg-red-500 rounded-full items-center justify-center text-white text-[10px] font-bold shadow-md border-2 border-white dark:border-gray-900"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
      <!-- Ping Animation -->
      <span v-if="unreadCount > 0 && !isOpen" class="animate-ping absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-400 opacity-75"></span>
    </button>

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

const isOpen = ref(false);
const messages = ref([]);
const newMessage = ref('');
const loading = ref(false);
const sending = ref(false);
const unreadCount = ref(0);
const messagesContainer = ref(null);
const pingAudio = ref(null);

const ROOM_ID = 'ceremony_internal';

const currentUserId = computed(() => authStore.user?.id || authStore.user?._id);
const currentUserRole = computed(() => authStore.user?.role);

// A simple notification sound
const playPing = () => {
  try {
    // Basic beep synthesized via Web Audio API if no MP3
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
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

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    unreadCount.value = 0;
    scrollToBottom();
  }
};

const loadHistory = async () => {
  loading.value = true;
  try {
    // API endpoint allows staff/admin/mc to fetch any room's history
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
  } catch (err) {
    console.error('Error sending message', err);
    toast.error('Failed to send message');
  } finally {
    sending.value = false;
  }
};

const handleIncomingMessage = (msg) => {
  if (msg.roomId !== ROOM_ID) return;
  
  // Deduplicate (since socket.io might echo back to sender)
  const exists = messages.value.find(m => (m._id || m.id) === (msg._id || msg.id));
  if (!exists) {
    messages.value.push(msg);
  }
  
  if (isOpen.value) {
    scrollToBottom();
  } else {
    // If it's a new message not from me, show alert
    if (msg.senderId !== currentUserId.value) {
      unreadCount.value++;
      playPing();
      
      const roleBadge = msg.senderRole === 'mc' ? '🎤 MC' : '👔 Staff';
      toast.info(`[${roleBadge} Alert]\n${msg.text || msg.message}`, {
        timeout: 6000,
        position: 'bottom-left'
      });
    }
  }
};

onMounted(() => {
  // Connect and join internal room if not student
  if (authStore.user && ['mc', 'staff', 'admin'].includes(authStore.user.role)) {
    // Connect if not already connected
    if (!socketService.isConnected()) {
      socketService.connect(authStore.token, currentUserId.value);
    }
    
    // Join immediately if already connected, otherwise wait for connect
    if (socketService.isConnected()) {
      socketService.joinRoom(ROOM_ID);
    }
    
    // Always rejoin on connect (handles reconnects and initial delayed connects)
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
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px) scale(0.9);
  opacity: 0;
}

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
