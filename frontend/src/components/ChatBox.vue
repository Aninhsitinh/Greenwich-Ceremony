<template>
  <div class="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
    <!-- Chat Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span class="text-primary font-bold text-sm">{{ recipientInitial }}</span>
          </div>
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">{{ recipientName }}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ recipientStatus }}</p>
        </div>
      </div>
      <button @click="$emit('close')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
        <span class="material-symbols-outlined text-gray-500">close</span>
      </button>
    </div>

    <!-- Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'flex gap-3',
          message.isMine ? 'flex-row-reverse' : 'flex-row'
        ]"
      >
        <!-- Avatar -->
        <div v-if="!message.isMine" class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-gray-600 dark:text-gray-300">{{ message.sender.charAt(0) }}</span>
        </div>

        <!-- Message Bubble -->
        <div :class="['max-w-[70%]', message.isMine ? 'items-end' : 'items-start']">
          <div
            :class="[
              'px-4 py-2 rounded-2xl',
              message.isMine
                ? 'bg-primary text-white rounded-br-none'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
            ]"
          >
            <p class="text-sm leading-relaxed">{{ message.text }}</p>
          </div>
          <p class="text-xs text-gray-400 mt-1 px-2">{{ formatTime(message.timestamp) }}</p>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex gap-3">
        <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span class="text-sm font-bold text-gray-600 dark:text-gray-300">{{ recipientInitial }}</span>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-none">
          <div class="flex gap-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <form @submit.prevent="sendMessage" class="flex gap-3">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message..."
          @input="handleTyping"
          class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-primary dark:text-white placeholder:text-gray-500"
        />
        <button
          type="submit"
          :disabled="!newMessage.trim()"
          class="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span class="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import socketService from '@/services/socketService';
import { timeAgo } from '@/utils/helpers';

const props = defineProps({
  roomId: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    default: 'Support'
  },
  recipientStatus: {
    type: String,
    default: 'Online'
  }
});

const emit = defineEmits(['close', 'message-sent']);

const messages = ref([]);
const newMessage = ref('');
const isTyping = ref(false);
const messagesContainer = ref(null);
let typingTimeout = null;

const recipientInitial = computed(() => {
  return props.recipientName.charAt(0).toUpperCase();
});

const formatTime = (timestamp) => {
  return timeAgo(timestamp);
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  const message = {
    id: Date.now(),
    text: newMessage.value,
    sender: 'You',
    timestamp: new Date(),
    isMine: true
  };

  messages.value.push(message);
  
  // Send via socket
  socketService.sendChatMessage({
    roomId: props.roomId,
    text: newMessage.value
  });

  emit('message-sent', message);
  newMessage.value = '';
  scrollToBottom();
};

const handleTyping = () => {
  socketService.sendTyping(props.roomId);
  
  // Clear previous timeout
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
};

const handleIncomingMessage = (message) => {
  messages.value.push({
    id: message.id || Date.now(),
    text: message.text,
    sender: message.sender,
    timestamp: message.timestamp || new Date(),
    isMine: false
  });
  scrollToBottom();
};

const handleTypingIndicator = (data) => {
  if (data.roomId === props.roomId) {
    isTyping.value = true;
    
    // Hide after 3 seconds
    setTimeout(() => {
      isTyping.value = false;
    }, 3000);
  }
};

onMounted(() => {
  // Join room
  socketService.joinRoom(props.roomId);
  
  // Setup listeners
  socketService.onChatMessage(handleIncomingMessage);
  socketService.onTyping(handleTypingIndicator);

  // Load demo messages
  messages.value = [
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: props.recipientName,
      timestamp: new Date(Date.now() - 300000),
      isMine: false
    }
  ];

  scrollToBottom();
});

onUnmounted(() => {
  // Leave room
  socketService.leaveRoom(props.roomId);
});

watch(messages, () => {
  scrollToBottom();
}, { deep: true });
</script>

<style scoped>
@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite;
}
</style>
