<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('admin.announcements')"
  >
    <div class="w-full max-w-4xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Announcements</h1>
        <p class="text-gray-600 dark:text-gray-400">Create and manage system-wide announcements</p>
      </div>

      <!-- Create New Announcement -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Send New Announcement</h2>
        <form @submit.prevent="sendAnnouncement" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Title</label>
            <input
              v-model="newAnnouncement.title"
              type="text"
              placeholder="Important Notice..."
              required
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Message</label>
            <textarea
              v-model="newAnnouncement.message"
              rows="4"
              placeholder="Type your announcement message..."
              required
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white resize-none"
            ></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Priority</label>
              <select
                v-model="newAnnouncement.priority"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Target Audience</label>
              <select
                v-model="newAnnouncement.audience"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
              >
                <option value="all">All Users</option>
                <option value="students">Students Only</option>
                <option value="staff">Staff Only</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined">campaign</span>
              <span>Send Announcement</span>
            </button>
            <button
              type="button"
              @click="resetForm"
              class="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <!-- Previous Announcements -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Announcements</h2>
        <div class="space-y-4">
          <div
            v-for="announcement in announcements"
            :key="announcement.id"
            class="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-l-4"
            :class="{
              'border-red-500': announcement.priority === 'urgent',
              'border-orange-500': announcement.priority === 'high',
              'border-blue-500': announcement.priority === 'medium',
              'border-gray-400': announcement.priority === 'low'
            }"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    announcement.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/20' :
                    announcement.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/20' :
                    announcement.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    'bg-gray-100 dark:bg-gray-800'
                  ]"
                >
                  <span
                    class="material-symbols-outlined"
                    :class="{
                      'text-red-600': announcement.priority === 'urgent',
                      'text-orange-600': announcement.priority === 'high',
                      'text-blue-600': announcement.priority === 'medium',
                      'text-gray-600': announcement.priority === 'low'
                    }"
                  >
                    campaign
                  </span>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-white">{{ announcement.title }}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-gray-500">{{ announcement.date }}</span>
                    <span class="text-xs text-gray-400">•</span>
                    <Badge :variant="announcement.priority === 'urgent' ? 'error' : announcement.priority === 'high' ? 'warning' : 'default'">
                      {{ announcement.priority }}
                    </Badge>
                    <Badge variant="info">{{ announcement.audience }}</Badge>
                  </div>
                </div>
              </div>
              <button class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ announcement.message }}</p>
            <div class="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span class="material-symbols-outlined text-lg">visibility</span>
                <span>{{ announcement.views }} views</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span class="material-symbols-outlined text-lg">done_all</span>
                <span>{{ announcement.reached }} reached</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref } from 'vue';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import Badge from '@/components/Badge.vue';

const navigation = [
  { path: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { path: '/admin/students', icon: 'group', label: 'Student Management' },
  { path: '/admin/registrations', icon: 'how_to_reg', label: 'Registrations' },
  { path: '/admin/tickets', icon: 'confirmation_number', label: 'Ticket Management' },
  { path: '/admin/seats', icon: 'event_seat', label: 'Seat Management' },
  { path: '/admin/announcements', icon: 'campaign', label: 'Announcements' },
  { path: '/admin/settings', icon: 'settings', label: 'System Settings' }
];

const bottomNavigation = [
  { path: '/admin', icon: 'home', label: 'Home' },
  { path: '/admin/students', icon: 'group', label: 'Students' },
  { path: '/admin/registrations', icon: 'how_to_reg', label: 'Register' },
  { path: '/admin/settings', icon: 'settings', label: 'Settings' }
];

const newAnnouncement = ref({
  title: '',
  message: '',
  priority: 'medium',
  audience: 'all'
});

const announcements = ref([
  {
    id: 1,
    title: 'Gown Collection Reminder',
    message: 'Please remember to collect your graduation gown between May 20-June 10. Bring your student ID and ticket confirmation.',
    priority: 'high',
    audience: 'students',
    date: '2026-05-15',
    views: 1234,
    reached: 980
  },
  {
    id: 2,
    title: 'Ceremony Rehearsal Schedule',
    message: 'Mandatory rehearsal for all graduating students will be held on June 14, 2026 at 2:00 PM in the Main Hall.',
    priority: 'urgent',
    audience: 'students',
    date: '2026-05-10',
    views: 2145,
    reached: 1890
  },
  {
    id: 3,
    title: 'Parking Information',
    message: 'Free parking will be available for all ceremony attendees. Please arrive early to secure a parking spot.',
    priority: 'medium',
    audience: 'all',
    date: '2026-05-05',
    views: 856,
    reached: 650
  }
]);

const sendAnnouncement = () => {
  const announcement = {
    id: Date.now(),
    ...newAnnouncement.value,
    date: new Date().toISOString().split('T')[0],
    views: 0,
    reached: 0
  };
  
  announcements.value.unshift(announcement);
  resetForm();
  
  // Show success message
  alert('Announcement sent successfully!');
};

const resetForm = () => {
  newAnnouncement.value = {
    title: '',
    message: '',
    priority: 'medium',
    audience: 'all'
  };
};
</script>
