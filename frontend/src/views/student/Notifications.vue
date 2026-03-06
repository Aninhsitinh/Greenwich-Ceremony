<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('student.notifications_title')"
  >
    <div class="w-full max-w-4xl mx-auto px-4 py-6">
      
      <!-- Quick Actions -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button 
            v-for="filter in filters" 
            :key="filter.id"
            @click="activeFilter = filter.id"
            :class="[
              'px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors border',
              activeFilter === filter.id 
                ? 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:border-white dark:text-gray-900' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
            ]"
          >
            {{ filter.label }}
            <span v-if="filter.count" class="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-gray-200 dark:bg-gray-600/50 text-gray-800 dark:text-gray-200">{{ filter.count }}</span>
          </button>
        </div>
        
        <button @click="markAllRead" class="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
           Mark all read
        </button>
      </div>

      <!-- Notifications List -->
      <div class="space-y-4">
        <div v-if="filteredNotifications.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
           <span class="material-symbols-outlined text-gray-300 dark:text-gray-600 text-5xl mb-3">notifications_off</span>
           <h3 class="text-lg font-bold text-gray-900 dark:text-white">No notifications</h3>
           <p class="text-gray-500 text-sm">You're all caught up!</p>
        </div>

        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id || notification._id"
          @click="viewNotification(notification)"
          :class="[
            'p-4 bg-white dark:bg-gray-800 rounded-lg border transition-colors cursor-pointer relative overflow-hidden',
            notification.isRead ? 'border-gray-200 dark:border-gray-700' : 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10'
          ]"
        >
           <div v-if="!notification.isRead" class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
           
           <div class="flex items-start gap-4">
             <div :class="[
               'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
               getNotificationStyle(notification.type).bg
             ]">
               <span :class="['material-symbols-outlined text-xl', getNotificationStyle(notification.type).text]">
                 {{ getNotificationStyle(notification.type).icon }}
               </span>
             </div>
             
             <div class="flex-1 min-w-0">
               <div class="flex items-start justify-between gap-4">
                 <h4 :class="['font-semibold text-sm', notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white']">
                   {{ notification.title }}
                 </h4>
                 <span class="text-xs text-gray-400 whitespace-nowrap">{{ formatTime(notification.createdAt) }}</span>
               </div>
               
               <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{{ notification.message }}</p>
               
               <div v-if="notification.actionUrl" class="mt-3">
                 <button 
                   @click.stop="goToAction(notification)"
                   class="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1 hover:underline"
                 >
                   {{ notification.actionText || 'View Details' }}
                   <span class="material-symbols-outlined text-sm">arrow_forward</span>
                 </button>
               </div>
             </div>
           </div>
        </div>
      </div>
      
      <!-- Load More -->
      <div v-if="hasMore" class="text-center mt-6">
        <button @click="loadMore" class="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Load More
        </button>
      </div>

    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

const router = useRouter();
const { t } = useI18n();

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

const activeFilter = ref('all');
const hasMore = ref(false);

const filters = [
  { id: 'all', label: 'All', count: null },
  { id: 'unread', label: 'Unread', count: 3 },
  { id: 'announcements', label: 'Announcements', count: null },
  { id: 'reminders', label: 'Reminders', count: null },
];

const notifications = ref([
  {
    id: '1',
    type: 'success',
    title: 'Registration Confirmed',
    message: 'Your graduation registration has been confirmed. You can now book seats for your guests.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000),
    actionUrl: '/student/seat-booking',
    actionText: 'Book Seats'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Payment Reminder',
    message: 'Please complete your payment for gown rental before June 1st to avoid late fees.',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000),
    actionUrl: '/student/payment',
    actionText: 'Pay Now'
  },
  {
    id: '3',
    type: 'info',
    title: 'Ceremony Schedule Updated',
    message: 'The graduation ceremony schedule has been updated. Please check the new timing and venue details.',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000),
    actionUrl: null
  },
  {
    id: '4',
    type: 'announcement',
    title: 'Photo Package Now Available',
    message: 'Professional photo packages are now available for booking. Capture your special moments!',
    isRead: true,
    createdAt: new Date(Date.now() - 172800000),
    actionUrl: '/student/payment',
    actionText: 'View Packages'
  },
]);

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') return notifications.value;
  if (activeFilter.value === 'unread') return notifications.value.filter(n => !n.isRead);
  if (activeFilter.value === 'announcements') return notifications.value.filter(n => n.type === 'announcement');
  if (activeFilter.value === 'reminders') return notifications.value.filter(n => n.type === 'warning');
  return notifications.value;
});

const getNotificationStyle = (type) => {
  const styles = {
    success: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', icon: 'check_circle' },
    warning: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', icon: 'warning' },
    info: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', icon: 'info' },
    announcement: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', icon: 'campaign' },
    error: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', icon: 'error' },
  };
  return styles[type] || styles.info;
};

const formatTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const viewNotification = (notification) => {
  notification.isRead = true;
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
  // Mock load more
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
