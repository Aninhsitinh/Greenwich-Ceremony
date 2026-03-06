<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('staff.support_chat')"
  >
    <div class="h-[calc(100vh-theme(spacing.16)-env(safe-area-inset-bottom))] lg:h-[calc(100vh-0px)] flex bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden m-4 lg:m-6">
        
      <!-- Sidebar: Conversation List -->
      <div class="hidden md:flex w-80 border-r border-gray-200 dark:border-gray-700 flex-col bg-white dark:bg-gray-800">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Active Chats</h2>
          <div class="mt-3 relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Search chat..." 
              class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg text-sm focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto">
          <button
            class="w-full text-left p-4 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-primary"
          >
            <div class="flex justify-between items-start mb-1">
              <h3 class="font-semibold text-gray-900 dark:text-white truncate pr-2">{{ activeStaff.name }}</h3>
              <span class="text-xs text-gray-500 whitespace-nowrap">{{ lastMessageTime }}</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 truncate">Staff Support</p>
            <div class="flex justify-between items-center mt-1">
              <p class="text-sm text-gray-500 truncate pr-2">
                <span v-if="lastMessageSender === 'student'" class="text-xs font-semibold mr-1">You:</span>
                {{ lastMessageText }}
              </p>
            </div>
          </button>
        </div>
      </div>

      <!-- Main Chat Area -->
      <div class="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 relative">
        
        <!-- Header -->
        <div class="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm z-10">
          <div class="flex items-center gap-3">
            <!-- Active Staff Avatar -->
            <div class="relative">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                <img 
                  v-if="activeStaff.avatar" 
                  :src="activeStaff.avatar" 
                  alt="Staff Avatar"
                  class="w-full h-full object-cover"
                />
                <span v-else class="material-symbols-outlined text-xl">support_agent</span>
              </div>
              <!-- Online status dot -->
              <div 
                class="absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full"
                :class="isStaffOnline ? 'bg-green-500' : 'bg-gray-400'"
              ></div>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white">{{ activeStaff.name }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ isStaffOnline ? 'Online' : 'Offline' }}
              </p>
            </div>
          </div>
        </div>

      <!-- Messages Area -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 relative custom-scrollbar">
          <!-- Loading State -->
          <div v-if="loadingHistory" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-10 backdrop-blur-sm">
            <div class="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>

          <!-- Empty State -->
          <div v-if="messages.length === 0 && !loadingHistory" class="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
               <span class="material-symbols-outlined text-4xl text-primary">forum</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">How can we help you?</h3>
            <p class="text-gray-500 dark:text-gray-400">
              Send us a message about your graduation registration, tickets, gown collection, or any other inquiry. A staff member will assist you shortly.
            </p>
          </div>

          <!-- Chat Messages -->
          <div
            v-for="(message, index) in messages"
            :key="message._id || message.id"
            :class="['flex gap-3', message.senderRole === 'student' ? 'flex-row-reverse' : 'flex-row']"
          >
            <!-- Avatar -->
            <div
              v-if="message.senderRole !== 'student'"
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary text-white font-bold text-xs overflow-hidden"
            >
              <img 
                v-if="message.senderId?.profilePhoto || message.profilePhoto" 
                :src="message.senderId?.profilePhoto || message.profilePhoto" 
                alt="Staff Avatar"
                class="w-full h-full object-cover"
              />
              <span v-else>S</span>
            </div>

            <!-- Message Bubble Container -->
            <div :class="['max-w-[70%]', message.senderRole === 'student' ? 'items-end' : 'items-start']">
              <!-- Staff Name Label -->
              <p v-if="message.senderRole !== 'student'" class="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1 pl-1">
                 {{ message.sender?.fullName || message.senderId?.fullName || message.sender || 'Staff Member' }}
              </p>
              <div
                :class="[
                  'px-4 py-2 rounded-2xl',
                  message.senderRole === 'student'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-none shadow-sm'
                ]"
              >
                <p class="text-sm break-words whitespace-pre-wrap">{{ message.text || message.message }}</p>
              </div>
                <p class="text-xs text-gray-400 mt-1 px-2 text-right flex items-center justify-end gap-1">
                  {{ formatTime(message.timestamp || message.createdAt) }}
                  <!-- Read Receipt -->
                  <span v-if="message.senderRole === 'student' && message.isRead" class="text-[10px] text-blue-500 font-medium ml-1 flex items-center">
                    <span class="material-symbols-outlined text-[12px] leading-none">done_all</span>
                  </span>
                  <span v-else-if="message.senderRole === 'student'" class="text-[10px] text-gray-400 font-medium ml-1 flex items-center">
                    <span class="material-symbols-outlined text-[12px] leading-none">check</span>
                  </span>
                </p>
              </div>
            </div>

          <!-- Staff Typing Indicator -->
          <div v-if="staffTyping" class="flex gap-3">
             <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary mt-auto mb-1">
               <span class="material-symbols-outlined text-[16px]">support_agent</span>
             </div>
             <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
               <div class="flex gap-1">
                 <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                 <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                 <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
               </div>
             </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <form @submit.prevent="sendMessage" class="flex gap-3">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type a message..."
              @input="handleTyping"
              class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary transition-all dark:text-white"
            />
            <button
              type="submit"
              :disabled="!newMessage.trim()"
              class="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
            >
              <span class="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import socketService from '@/services/socketService';
import api from '@/services/api';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

// Navigation Config
const navigation = computed(() => [
  { path: '/student/dashboard', icon: 'dashboard', label: t('student.nav_dashboard') },
  { path: '/student/profile', icon: 'person', label: t('student.nav_profile') },
  { path: '/student/ticket', icon: 'qr_code_2', label: t('student.nav_ticket') },
  { path: '/student/seat-booking', icon: 'event_seat', label: t('student.nav_seats') },
  { path: '/student/gown-collection', icon: 'checkroom', label: t('student.nav_gown') },
  { path: '/student/booking-confirmation', icon: 'payments', label: t('student.nav_payments') },
  { path: '/student/chat', icon: 'support_agent', label: t('student.nav_chat') }
]);

const bottomNavigation = computed(() => [
  { path: '/student/dashboard', icon: 'dashboard', label: t('student.nav_home') },
  { path: '/student/ticket', icon: 'qr_code_2', label: t('student.nav_ticket_short') },
  { path: '/student/seat-booking', icon: 'event_seat', label: t('student.nav_seats_short') },
  { path: '/student/profile', icon: 'person', label: t('student.nav_profile') }
]);

// Chat Logic
const authStore = useAuthStore();
const { t } = useI18n();
const roomId = computed(() => authStore.user?.id || authStore.user?._id);

const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null);
const loadingHistory = ref(false);
const staffTyping = ref(false);
let typingTimeout = null;

// Dynamically compute the active staff name and avatar based on the most recent message from staff
const activeStaff = computed(() => {
    for (let i = messages.value.length - 1; i >= 0; i--) {
        if (messages.value[i].senderRole !== 'student') {
            const senderInfo = messages.value[i].senderId || {};
            const id = senderInfo._id || senderInfo.id || messages.value[i].senderId;
            return {
                id: typeof id === 'object' ? null : id,
                name: senderInfo.fullName || messages.value[i].sender || 'Staff Member',
                avatar: senderInfo.profilePhoto || messages.value[i].profilePhoto || null
            };
        }
    }
    return { id: null, name: 'Staff Support', avatar: null };
});

const isStaffOnline = ref(false);

const checkOnlineStatus = () => {
    if (activeStaff.value.id) {
        socketService.checkOnlineStatus([activeStaff.value.id], (statusMap) => {
            isStaffOnline.value = statusMap[activeStaff.value.id] || false;
        });
    }
};

watch(() => activeStaff.value.id, (newId) => {
    if (newId) checkOnlineStatus();
});

const lastMessage = computed(() => {
    if (messages.value.length === 0) return null;
    return messages.value[messages.value.length - 1];
});

const lastMessageText = computed(() => lastMessage.value?.text || lastMessage.value?.message || 'No messages yet');
const lastMessageTime = computed(() => lastMessage.value ? formatTime(lastMessage.value.timestamp || lastMessage.value.createdAt) : '');
const lastMessageSender = computed(() => lastMessage.value?.senderRole || '');

const fetchChatHistory = async () => {
    if (!roomId.value) return;
    
    loadingHistory.value = true;
    
    try {
        const response = await api.get(`/chat/${roomId.value}/messages`);
        if (response.data.success) {
            messages.value = response.data.data.messages;
            checkOnlineStatus();
            scrollToBottom();
            markMessagesAsRead();
        }
    } catch (error) {
        console.error('Failed to load chat history:', error);
    } finally {
        loadingHistory.value = false;
    }
};

const markMessagesAsRead = () => {
    if (messages.value.some(m => !m.isRead && m.senderRole !== 'student')) {
        api.put(`/chat/${roomId.value}/read`).catch(console.error);
    }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !roomId.value) return;

  const text = newMessage.value.trim();

  socketService.sendChatMessage({
    roomId: roomId.value,
    senderId: authStore.user.id || authStore.user._id,
    senderRole: authStore.user.role,
    text: text
  });

  newMessage.value = '';
};

const handleTyping = () => {
    if (!roomId.value) return;
    socketService.sendTyping(roomId.value);
    if (typingTimeout) clearTimeout(typingTimeout);
};

const handleIncomingMessage = (msg) => {
    if (msg.roomId === roomId.value) {
        messages.value.push(msg);
        scrollToBottom();
        
        if (msg.senderRole !== 'student') {
            api.put(`/chat/${roomId.value}/read`).catch(console.error);
        }
    }
};

const handleTypingIndicator = (data) => {
    if (data.roomId === roomId.value) {
        staffTyping.value = true;
        if (typingTimeout) clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            staffTyping.value = false;
        }, 3000);
    }
};

const handleUserOnline = (data) => {
    if (activeStaff.value.id === data.userId) {
        isStaffOnline.value = true;
    }
};

const handleUserOffline = (data) => {
    if (activeStaff.value.id === data.userId) {
        isStaffOnline.value = false;
    }
};

const handleReadReceipt = (data) => {
    if (data.roomId === roomId.value) {
        messages.value.forEach(m => {
            if (m.senderRole === 'student' && !m.isRead) {
                m.isRead = true;
            }
        });
    }
};

const connectStudentSocket = () => {
    if (!socketService.isConnected()) {
        socketService.connect(authStore.token, authStore.user?.id || authStore.user?._id);
    }
    if (roomId.value) {
        socketService.joinRoom(roomId.value);
    }
    fetchChatHistory();
    socketService.on('chat:message', handleIncomingMessage);
    socketService.on('chat:typing', handleTypingIndicator);
    socketService.on('user:online', handleUserOnline);
    socketService.on('user:offline', handleUserOffline);
    socketService.on('chat:read_receipt', handleReadReceipt);
};

onMounted(() => {
    if (authStore.isAuthenticated && authStore.user?.role === 'student') {
        connectStudentSocket();
    }
});

watch(() => authStore.isAuthenticated, (newVal) => {
    if (newVal && authStore.user?.role === 'student') {
        connectStudentSocket();
    } else {
        socketService.disconnect();
    }
});

onUnmounted(() => {
    if (roomId.value) {
        socketService.leaveRoom(roomId.value);
    }
    socketService.off('chat:message', handleIncomingMessage);
    socketService.off('chat:typing', handleTypingIndicator);
    socketService.off('user:online', handleUserOnline);
    socketService.off('user:offline', handleUserOffline);
    socketService.off('chat:read_receipt', handleReadReceipt);
});

watch(messages, () => {
  scrollToBottom();
}, { deep: true });
</script>

<style scoped>
@keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-4px); }
}
.animate-bounce {
    animation: bounce 1.4s infinite;
}

/* Custom Scrollbar for Chat Messages */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
</style>
