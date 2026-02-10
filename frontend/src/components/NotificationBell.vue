<template>
  <div class="relative">
    <!-- Notification Bell -->
    <button
      @click="toggleDropdown"
      class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <span class="material-symbols-outlined text-2xl text-gray-600 dark:text-gray-300">
        notifications
      </span>
      <span
        v-if="unreadCount > 0"
        class="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-bold text-gray-900 dark:text-white">Notifications</h3>
        <button
          v-if="unreadCount > 0"
          @click="handleMarkAllAsRead"
          class="text-xs text-primary hover:underline font-semibold"
        >
          Mark all as read
        </button>
      </div>

      <!-- Notifications List -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="loading" class="p-8 text-center">
          <Loading />
        </div>

        <div v-else-if="notifications.length === 0" class="p-8 text-center">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span class="material-symbols-outlined text-3xl text-gray-400">notifications_off</span>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-sm">No notifications yet</p>
        </div>

        <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
          <div
            v-for="notification in notifications"
            :key="notification._id"
            @click="handleNotificationClick(notification)"
            :class="[
              'p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors',
              !notification.read && 'bg-blue-50 dark:bg-blue-900/10'
            ]"
          >
            <div class="flex items-start gap-3">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', getIconBg(notification.type)]">
                <span class="material-symbols-outlined text-white">
                  {{ getIcon(notification.type) }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm text-gray-900 dark:text-white">
                  {{ notification.title }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {{ formatTime(notification.createdAt) }}
                </p>
              </div>
              <div v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="viewAll"
          class="w-full text-center text-sm text-primary hover:underline font-semibold"
        >
          View All Notifications
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import { timeAgo } from '@/utils/helpers';
import Loading from './Loading.vue';

const notificationStore = useNotificationStore();
const showDropdown = ref(false);

const notifications = computed(() => notificationStore.notifications.slice(0, 10));
const unreadCount = computed(() => notificationStore.unreadCount);
const loading = computed(() => notificationStore.loading);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value && notifications.value.length === 0) {
    notificationStore.fetchNotifications();
  }
};

const handleNotificationClick = (notification) => {
  if (!notification.read) {
    notificationStore.markAsRead(notification._id);
  }
  // Navigate based on notification type
  // TODO: Implement navigation logic
};

const handleMarkAllAsRead = () => {
  notificationStore.markAllAsRead();
};

const viewAll = () => {
  showDropdown.value = false;
  // Navigate to notifications page
  // TODO: Implement navigation
};

const getIcon = (type) => {
  const icons = {
    announcement: 'campaign',
    registration: 'how_to_reg',
    ticket: 'confirmation_number',
    seat: 'event_seat',
    system: 'info',
    chat: 'chat'
  };
  return icons[type] || 'notifications';
};

const getIconBg = (type) => {
  const colors = {
    announcement: 'bg-blue-500',
    registration: 'bg-green-500',
    ticket: 'bg-purple-500',
    seat: 'bg-orange-500',
    system: 'bg-gray-500',
    chat: 'bg-pink-500'
  };
  return colors[type] || 'bg-blue-500';
};

const formatTime = (date) => {
  return timeAgo(date);
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (showDropdown.value && !event.target.closest('.relative')) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
