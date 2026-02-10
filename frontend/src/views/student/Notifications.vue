<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pb-24">
    <!-- Premium Header -->
    <div class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between p-4 max-w-4xl mx-auto">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ unreadCount }} unread messages</p>
          </div>
        </div>
        <button @click="markAllRead" class="text-primary text-sm font-semibold hover:underline">
          Mark all read
        </button>
      </div>
    </div>

    <div class="p-4 max-w-4xl mx-auto">
      <!-- Quick Actions -->
      <div class="flex gap-3 mb-6 overflow-x-auto pb-2">
        <button 
          v-for="filter in filters" 
          :key="filter.id"
          @click="activeFilter = filter.id"
          :class="[
            'px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all',
            activeFilter === filter.id 
              ? 'bg-primary text-white shadow-lg' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          {{ filter.label }}
          <span v-if="filter.count" class="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-white/20">{{ filter.count }}</span>
        </button>
      </div>

      <!-- Notifications List -->
      <div v-if="filteredNotifications.length > 0" class="space-y-3">
        <TransitionGroup name="list">
          <div 
            v-for="(notification, index) in filteredNotifications" 
            :key="notification._id"
            @click="viewNotification(notification)"
            :class="[
              'glass-card p-4 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.01]',
              !notification.isRead && 'border-l-4 border-l-primary'
            ]"
            :style="{ animationDelay: index * 50 + 'ms' }"
          >
            <div class="flex items-start gap-4">
              <div :class="[
                'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0',
                getNotificationStyle(notification.type).bg
              ]">
                <span :class="['material-symbols-outlined text-2xl', getNotificationStyle(notification.type).text]">
                  {{ getNotificationStyle(notification.type).icon }}
                </span>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <h4 :class="[
                    'font-bold truncate',
                    notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                  ]">
                    {{ notification.title }}
                  </h4>
                  <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {{ formatTime(notification.createdAt) }}
                  </span>
                </div>
                <p :class="[
                  'text-sm line-clamp-2',
                  notification.isRead ? 'text-gray-500 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'
                ]">
                  {{ notification.message }}
                </p>
                
                <!-- Action Button -->
                <div v-if="notification.actionUrl" class="mt-3">
                  <button 
                    @click.stop="goToAction(notification)"
                    class="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    {{ notification.actionText || 'View Details' }}
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
              
              <!-- Unread Indicator -->
              <div v-if="!notification.isRead" class="w-3 h-3 rounded-full bg-primary flex-shrink-0 animate-pulse"></div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Empty State -->
      <div v-else class="glass-card p-12 text-center">
        <div class="relative inline-block mb-6">
          <div class="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
          <div class="relative w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-5xl text-gray-400">notifications_off</span>
          </div>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No Notifications</h3>
        <p class="text-gray-500 dark:text-gray-400">You're all caught up! Check back later for updates.</p>
      </div>

      <!-- Load More -->
      <div v-if="hasMore" class="text-center mt-6">
        <button @click="loadMore" class="px-6 py-3 bg-white dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
          Load More
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();

const activeFilter = ref('all');
const hasMore = ref(false);

const filters = [
  { id: 'all', label: 'All', count: null },
  { id: 'unread', label: 'Unread', count: 3 },
  { id: 'announcements', label: 'Announcements', count: null },
  { id: 'reminders', label: 'Reminders', count: null },
];

// Demo notifications
const notifications = ref([
  {
    _id: '1',
    type: 'success',
    title: 'Registration Confirmed',
    message: 'Your graduation registration has been confirmed. You can now book seats for your guests.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000),
    actionUrl: '/student/seat-booking',
    actionText: 'Book Seats'
  },
  {
    _id: '2',
    type: 'warning',
    title: 'Payment Reminder',
    message: 'Please complete your payment for gown rental before June 1st to avoid late fees.',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000),
    actionUrl: '/student/payment',
    actionText: 'Pay Now'
  },
  {
    _id: '3',
    type: 'info',
    title: 'Ceremony Schedule Updated',
    message: 'The graduation ceremony schedule has been updated. Please check the new timing and venue details.',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000),
    actionUrl: null
  },
  {
    _id: '4',
    type: 'announcement',
    title: 'Photo Package Now Available',
    message: 'Professional photo packages are now available for booking. Capture your special moments!',
    isRead: true,
    createdAt: new Date(Date.now() - 172800000),
    actionUrl: '/student/payment',
    actionText: 'View Packages'
  },
  {
    _id: '5',
    type: 'success',
    title: 'Ticket Generated',
    message: 'Your graduation ticket has been generated. You can download it from the My Ticket section.',
    isRead: true,
    createdAt: new Date(Date.now() - 259200000),
    actionUrl: '/student/ticket',
    actionText: 'View Ticket'
  },
]);

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.isRead).length;
});

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') return notifications.value;
  if (activeFilter.value === 'unread') return notifications.value.filter(n => !n.isRead);
  if (activeFilter.value === 'announcements') return notifications.value.filter(n => n.type === 'announcement');
  if (activeFilter.value === 'reminders') return notifications.value.filter(n => n.type === 'warning');
  return notifications.value;
});

const getNotificationStyle = (type) => {
  const styles = {
    success: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600', icon: 'check_circle' },
    warning: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600', icon: 'warning' },
    info: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600', icon: 'info' },
    announcement: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600', icon: 'campaign' },
    error: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600', icon: 'error' },
  };
  return styles[type] || styles.info;
};

const formatTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
  
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const viewNotification = (notification) => {
  notification.isRead = true;
  // Could also make API call to mark as read
};

const goToAction = (notification) => {
  notification.isRead = true;
  if (notification.actionUrl) {
    router.push(notification.actionUrl);
  }
};

const markAllRead = () => {
  notifications.value.forEach(n => n.isRead = true);
};

const loadMore = async () => {
  // Load more notifications from API
};

onMounted(async () => {
  try {
    const response = await api.get('/notifications');
    if (response.data.success && response.data.data.notifications) {
      notifications.value = response.data.data.notifications;
    }
  } catch (error) {
    console.log('Using demo notifications');
  }
});
</script>

<style scoped>
.glass-card {
  @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
