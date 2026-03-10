<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
    <!-- Sticky Top Navigation -->
    <div class="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 md:px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link to="/staff" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center">
           <span class="material-symbols-outlined">arrow_back</span>
        </router-link>
        <h1 class="text-xl font-black text-gray-900 dark:text-white">{{ $t('staff.support_chat') }}</h1>
      </div>
    </div>

    <!-- Main Content Flow -->
    <div class="w-full px-4 md:px-8 py-6 space-y-6">
      <div class="h-[calc(100vh-theme(spacing.32)-env(safe-area-inset-bottom))] flex bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    
    <!-- Sidebar: Conversation List -->
    <div class="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Active Chats</h2>
        <div class="mt-3 relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search students..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg text-sm focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          >
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div v-if="loadingConversations" class="flex justify-center p-8">
          <div class="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        
        <div v-else-if="filteredConversations.length === 0" class="p-8 text-center text-gray-500">
          <span class="material-symbols-outlined text-4xl mb-2 opacity-50">forum</span>
          <p>No active conversations found</p>
        </div>
        
        <button
          v-else
          v-for="conv in filteredConversations"
          :key="conv.student._id"
          @click="selectConversation(conv)"
          :class="[
            'w-full text-left p-4 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
            selectedStudent?._id === conv.student._id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
          ]"
        >
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate pr-2">{{ conv.student.fullName }}</h3>
            <span class="text-xs text-gray-500 whitespace-nowrap">{{ formatTime(conv.lastMessage.createdAt) }}</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ conv.student.studentId }}</p>
          <div class="flex justify-between items-center mt-1">
            <p class="text-sm text-gray-500 truncate pr-2">
              <span v-if="conv.lastMessage.senderRole !== 'student'" class="text-xs font-semibold mr-1">You:</span>
              {{ conv.lastMessage.message }}
            </p>
            <div v-if="!conv.lastMessage.isRead && conv.lastMessage.senderRole === 'student'" class="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0"></div>
          </div>
        </button>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      
      <template v-if="selectedStudent">
        <!-- Chat Header -->
        <div class="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm z-10">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {{ selectedStudent.fullName.charAt(0).toUpperCase() }}
              </div>
              <!-- Online Status Dot -->
              <div 
                class="absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full"
                :class="isStudentOnline ? 'bg-green-500' : 'bg-gray-400'"
              ></div>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white">{{ selectedStudent.fullName }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                <span :class="isStudentOnline ? 'text-green-500 font-medium' : ''">{{ isStudentOnline ? 'Online' : 'Offline' }}</span> • {{ selectedStudent.studentId }}
              </p>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
          <div v-if="loadingMessages" class="flex justify-center p-4">
            <div class="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
          
          <div
            v-else
            v-for="msg in messages"
            :key="msg._id"
            :class="['flex gap-3', msg.senderRole !== 'student' ? 'flex-row-reverse' : 'flex-row']"
          >
            <!-- Avatar -->
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold overflow-hidden"
              :class="msg.senderRole !== 'student' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
            >
              <img 
                v-if="msg.senderId?.profilePhoto || msg.profilePhoto" 
                :src="msg.senderId?.profilePhoto || msg.profilePhoto" 
                :alt="msg.senderRole !== 'student' ? 'Staff' : 'Student'"
                class="w-full h-full object-cover"
              />
              <span v-else>
                {{ msg.senderRole !== 'student' ? 'S' : selectedStudent.fullName.charAt(0).toUpperCase() }}
              </span>
            </div>

            <!-- Bubble -->
            <div :class="['max-w-[70%]', msg.senderRole !== 'student' ? 'items-end' : 'items-start']">
              <div
                :class="[
                  'px-4 py-2 rounded-2xl',
                  msg.senderRole !== 'student'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-none shadow-sm'
                ]"
              >
                <p class="text-sm break-words whitespace-pre-wrap">{{ msg.text || msg.message }}</p>
              </div>
              <p class="text-xs text-gray-400 mt-1 px-2 text-right flex items-center justify-end gap-1">
                {{ formatTime(msg.timestamp || msg.createdAt) }}
                <!-- Read Receipt -->
                <span v-if="msg.senderRole !== 'student' && msg.isRead" class="text-[10px] text-blue-500 font-medium ml-1 flex items-center">
                  <span class="material-symbols-outlined text-[12px] leading-none">done_all</span>
                </span>
                <span v-else-if="msg.senderRole !== 'student'" class="text-[10px] text-gray-400 font-medium ml-1 flex items-center">
                  <span class="material-symbols-outlined text-[12px] leading-none">check</span>
                </span>
              </p>
            </div>
          </div>
          
          <div v-if="isTyping" class="flex gap-3">
             <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
               {{ selectedStudent.fullName.charAt(0).toUpperCase() }}
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

        <!-- Input Box -->
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
      </template>

      <!-- Empty State -->
      <div v-else class="flex-1 flex flex-col justify-center items-center p-8 text-center bg-gray-50 dark:bg-gray-900">
        <div class="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-4xl text-primary">forum</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Support Chat</h3>
        <p class="text-gray-500 dark:text-gray-400 max-w-sm">
          Select a conversation from the left sidebar to view messages and respond to student inquiries.
        </p>
      </div>

    </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import socketService from '@/services/socketService';
import api from '@/services/api';

const authStore = useAuthStore();
const { t } = useI18n();

const conversations = ref([]);
const loadingConversations = ref(false);
const searchQuery = ref('');

const selectedStudent = ref(null);
const messages = ref([]);
const loadingMessages = ref(false);
const newMessage = ref('');
const isTyping = ref(false);
const isStudentOnline = ref(false);
const messagesContainer = ref(null);
let typingTimeout = null;

const checkOnlineStatus = () => {
    if (selectedStudent.value) {
        socketService.checkOnlineStatus([selectedStudent.value._id], (statusMap) => {
            isStudentOnline.value = statusMap[selectedStudent.value._id] || false;
        });
    }
};

// Fetch active conversations
const fetchConversations = async () => {
    loadingConversations.value = true;
    try {
        const response = await api.get('/chat/conversations');
        if (response.data.success) {
            conversations.value = response.data.data;
        }
    } catch (error) {
        console.error('Failed to fetch conversations:', error);
    } finally {
        loadingConversations.value = false;
    }
};

const filteredConversations = computed(() => {
    if (!searchQuery.value) return conversations.value;
    const query = searchQuery.value.toLowerCase();
    return conversations.value.filter(c => 
        c.student.fullName.toLowerCase().includes(query) || 
        c.student.studentId.toLowerCase().includes(query)
    );
});

// Format timestamp
const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    // If this year, show month/day
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });
};

const scrollToBottom = async () => {
    await nextTick();
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};

const selectConversation = async (conv) => {
    // Leave previous room
    if (selectedStudent.value) {
        socketService.leaveRoom(selectedStudent.value._id);
    }

    selectedStudent.value = conv.student;
    messages.value = [];
    
    // Mark as read locally
    conv.lastMessage.isRead = true;

    // Join new room
    socketService.joinRoom(selectedStudent.value._id);
    checkOnlineStatus();
    
    // Fetch History
    loadingMessages.value = true;
    try {
        const response = await api.get(`/chat/${selectedStudent.value._id}/messages`);
        if (response.data.success) {
            messages.value = response.data.data.messages;
            scrollToBottom();
            
            // Mark server messages as read async
            api.put(`/chat/${selectedStudent.value._id}/read`).catch(console.error);
        }
    } catch (error) {
        console.error('Failed to load messages:', error);
    } finally {
        loadingMessages.value = false;
    }
};

const sendMessage = () => {
    if (!newMessage.value.trim() || !selectedStudent.value) return;

    socketService.sendChatMessage({
        roomId: selectedStudent.value._id, // Room is the student ID
        receiverId: selectedStudent.value._id, 
        senderId: authStore.user.id || authStore.user._id,
        senderRole: authStore.user.role,
        text: newMessage.value.trim()
    });

    newMessage.value = '';
};

const handleTyping = () => {
    if (!selectedStudent.value) return;
    
    socketService.sendTyping(selectedStudent.value._id);
    if (typingTimeout) clearTimeout(typingTimeout);
};

const handleIncomingMessage = (msg) => {
    // If the message belongs to the active conversation, push it
    if (selectedStudent.value && msg.roomId === selectedStudent.value._id) {
        messages.value.push(msg);
        scrollToBottom();
        
        // Mark as read if user is currently looking at this
        if (msg.senderRole === 'student') {
            api.put(`/chat/${selectedStudent.value._id}/read`).catch(console.error);
        }
    }
    
    // Always update conversation list
    updateConversationList(msg);
};

const updateConversationList = (msg) => {
    const existingIndex = conversations.value.findIndex(c => c.roomId === msg.roomId || c.student._id === msg.roomId);
    
    if (existingIndex !== -1) {
        // Update existing
        const conv = conversations.value[existingIndex];
        conv.lastMessage = {
            message: msg.text || msg.message,
            createdAt: msg.timestamp || msg.createdAt,
            isRead: msg.senderRole !== 'student' || (selectedStudent.value && selectedStudent.value._id === msg.roomId),
            senderRole: msg.senderRole
        };
        // Move to top
        conversations.value.splice(existingIndex, 1);
        conversations.value.unshift(conv);
    } else {
        // New conversation, easiest is to just re-fetch the list
        fetchConversations();
    }
};

const handleTypingIndicator = (data) => {
    if (selectedStudent.value && data.roomId === selectedStudent.value._id) {
        isTyping.value = true;
        if (typingTimeout) clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            isTyping.value = false;
        }, 3000);
    }
};

const handleUserOnline = (data) => {
    if (selectedStudent.value && selectedStudent.value._id === data.userId) {
        isStudentOnline.value = true;
    }
};

const handleUserOffline = (data) => {
    if (selectedStudent.value && selectedStudent.value._id === data.userId) {
        isStudentOnline.value = false;
    }
};

const handleReadReceipt = (data) => {
    // Update local messages array
    if (selectedStudent.value && data.roomId === selectedStudent.value._id) {
        messages.value.forEach(m => {
            if (m.senderRole !== 'student' && !m.isRead) {
                m.isRead = true;
            }
        });
    }
    
    // Also update the conversations list preview so it says read
    const existingIndex = conversations.value.findIndex(c => c.roomId === data.roomId || c.student._id === data.roomId);
    if (existingIndex !== -1) {
        conversations.value[existingIndex].lastMessage.isRead = true;
    }
};

onMounted(() => {
    if (!socketService.isConnected()) {
        socketService.connect(authStore.token, authStore.user?.id || authStore.user?._id);
    }
    
    fetchConversations();
    
    socketService.on('chat:message', handleIncomingMessage);
    socketService.on('chat:typing', handleTypingIndicator);
    socketService.on('user:online', handleUserOnline);
    socketService.on('user:offline', handleUserOffline);
    socketService.on('chat:read_receipt', handleReadReceipt);
});

onUnmounted(() => {
    if (selectedStudent.value) {
        socketService.leaveRoom(selectedStudent.value._id);
    }
    socketService.off('chat:message', handleIncomingMessage);
    socketService.off('chat:typing', handleTypingIndicator);
    socketService.off('user:online', handleUserOnline);
    socketService.off('user:offline', handleUserOffline);
    socketService.off('chat:read_receipt', handleReadReceipt);
});
</script>

<style scoped>
@keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-4px); }
}
.animate-bounce {
    animation: bounce 1.4s infinite;
}
</style>
