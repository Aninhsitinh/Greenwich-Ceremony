<template>
  <!-- Floating Chat Button -->
  <Transition name="fade">
    <button
      v-if="!isOpen"
      @click="toggleChat"
      class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
    >
      <span class="material-symbols-outlined text-2xl">chat</span>
      <div v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
        {{ unreadCount }}
      </div>
    </button>
  </Transition>

  <!-- Chat Window -->
  <Transition name="slide-up">
    <div
      v-if="isOpen"
      class="fixed bottom-6 right-6 z-50 w-full sm:w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      style="max-width: calc(100vw - 3rem)"
    >
      <!-- Chat Header -->
      <div class="bg-gradient-to-r from-primary to-blue-600 p-4 text-white flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span class="material-symbols-outlined">psychology</span>
            </div>
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 class="font-bold">AI Assistant</h3>
            <p class="text-xs text-blue-100">{{ aiTyping ? 'Typing...' : 'Powered by Gemini' }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="resetConversation" class="p-2 hover:bg-white/10 rounded-lg transition-colors" title="New conversation">
            <span class="material-symbols-outlined text-lg">refresh</span>
          </button>
          <button @click="minimizeChat" class="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <span class="material-symbols-outlined">minimize</span>
          </button>
          <button @click="toggleChat" class="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <!-- Messages Area -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-4xl text-primary">psychology</span>
          </div>
          <h4 class="font-bold text-gray-900 dark:text-white mb-2">AI Assistant Powered by Gemini</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Ask me anything about the graduation ceremony!</p>
          
          <!-- Quick Actions -->
          <div class="mt-6 space-y-2">
            <button
              v-for="suggestion in quickSuggestions"
              :key="suggestion"
              @click="sendQuickMessage(suggestion)"
              class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-left hover:border-primary transition-colors"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex gap-3',
            message.isUser ? 'flex-row-reverse' : 'flex-row'
          ]"
        >
          <!-- Avatar -->
          <div
            v-if="!message.isUser"
            class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
          >
            <span class="material-symbols-outlined text-lg text-primary">psychology</span>
          </div>

          <!-- Message Bubble -->
          <div :class="['max-w-[80%]', message.isUser ? 'items-end' : 'items-start']">
            <div
              :class="[
                'px-4 py-3 rounded-2xl',
                message.isUser
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-none'
              ]"
            >
              <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.text }}</p>
            </div>
            <p class="text-xs text-gray-400 mt-1 px-2">{{ formatTime(message.timestamp) }}</p>
          </div>
        </div>

        <!-- AI Typing Indicator -->
        <div v-if="aiTyping" class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-lg text-primary">psychology</span>
          </div>
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-bl-none">
            <div class="flex gap-1.5">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-red-600">error</span>
            <div>
              <p class="text-sm font-semibold text-red-800 dark:text-red-400">Error</p>
              <p class="text-xs text-red-600 dark:text-red-400 mt-1">{{ errorMessage }}</p>
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
            :disabled="aiTyping"
            placeholder="Ask me anything..."
            class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-primary dark:text-white placeholder:text-gray-500 disabled:opacity-50"
          />
          <button
            type="submit"
            :disabled="!newMessage.trim() || aiTyping"
            class="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span class="material-symbols-outlined">{{ aiTyping ? 'hourglass_empty' : 'send' }}</span>
          </button>
        </form>
        <p class="text-xs text-gray-400 text-center mt-2">
          <span class="inline-flex items-center gap-1">
            Powered by 
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Google Gemini AI
          </span>
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from 'vue';
import geminiService from '@/services/geminiService';

const isOpen = ref(false);
const isMinimized = ref(false);
const messages = ref([]);
const newMessage = ref('');
const aiTyping = ref(false);
const unreadCount = ref(0);
const messagesContainer = ref(null);
const errorMessage = ref('');

const quickSuggestions = [
  '📋 How do I register for the ceremony?',
  '🎫 Where can I find my ticket?',
  '💺 How do I book seats for my guests?',
  '👔 Tell me about gown collection'
];

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    unreadCount.value = 0;
    isMinimized.value = false;
    errorMessage.value = '';
  }
};

const minimizeChat = () => {
  isMinimized.value = true;
  isOpen.value = false;
};

const resetConversation = () => {
  messages.value = [];
  geminiService.resetChat();
  errorMessage.value = '';
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || aiTyping.value) return;

  const userMessage = newMessage.value.trim();
  
  // Add user message
  messages.value.push({
    id: Date.now(),
    text: userMessage,
    timestamp: new Date(),
    isUser: true
  });

  newMessage.value = '';
  errorMessage.value = '';
  scrollToBottom();

  // Show typing indicator
  aiTyping.value = true;

  try {
    // Send to Gemini AI
    const result = await geminiService.sendMessage(userMessage);
    
    aiTyping.value = false;

    if (result.success) {
      // Add AI response
      messages.value.push({
        id: Date.now(),
        text: result.message,
        timestamp: new Date(),
        isUser: false
      });
    } else {
      errorMessage.value = result.message;
      
      // Try fallback response
      const fallback = geminiService.getQuickResponse(userMessage);
      if (fallback) {
        messages.value.push({
          id: Date.now(),
          text: fallback,
          timestamp: new Date(),
          isUser: false
        });
      }
    }

    scrollToBottom();

    if (!isOpen.value) {
      unreadCount.value++;
    }
  } catch (error) {
    aiTyping.value = false;
    errorMessage.value = 'Failed to get AI response. Please try again.';
    console.error('Chat error:', error);
  }
};

const sendQuickMessage = (suggestion) => {
  newMessage.value = suggestion;
  sendMessage();
};

watch(messages, () => {
  scrollToBottom();
}, { deep: true });

onMounted(() => {
  // Test if Gemini is initialized
  if (!geminiService.genAI) {
    console.warn('Gemini AI not initialized. Check API key.');
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100px) scale(0.9);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(50px) scale(0.95);
}

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
