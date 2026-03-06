<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('mc.console_title', 'MC Console')"
    :show-notifications="false"
    desktop-header-class="top-11"
  >
    <!-- Live sync status badge injected via slot override isn't available,
         so we add a sticky bar at the top of main content -->
    <div class="sticky top-0 z-30 bg-purple-900/95 backdrop-blur-sm border-b border-purple-700/50 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
        <span class="text-purple-200 text-xs font-semibold tracking-wide uppercase">{{ $t('mc.live_sync', 'MC Console — Ceremony Live Sync') }}</span>
      </div>
      <div class="flex items-center gap-1.5 text-xs"
        :class="socketConnected ? 'text-green-400' : 'text-red-400'">
        <span class="w-1.5 h-1.5 rounded-full"
          :class="socketConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'"></span>
        {{ socketConnected ? $t('mc.connected', 'Connected') : $t('mc.disconnected', 'Disconnected') }}
      </div>
    </div>

    <router-view />
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import InternalChatWidget from '@/components/InternalChatWidget.vue';
import { io } from 'socket.io-client';

const authStore = useAuthStore();
const { t } = useI18n();
const user = computed(() => authStore.user);
const socketConnected = ref(false);

const navigation = computed(() => [
  { path: '/mc/dashboard', icon: 'dashboard', label: t('mc.nav_dashboard', 'Dashboard') },
  { path: '/mc/students', icon: 'groups', label: t('mc.nav_students', 'Student Attendance') },
  { path: '/mc/ceremony', icon: 'theater_comedy', label: t('mc.nav_ceremony', 'Ceremony Control') },
  { path: '/mc/lookup', icon: 'manage_search', label: t('mc.nav_lookup', 'Student Lookup') },
  { path: '/mc/settings', icon: 'settings', label: t('mc.nav_settings', 'Settings') },
]);

const bottomNavigation = computed(() => [
  { path: '/mc/dashboard', icon: 'dashboard', label: t('mc.nav_dashboard', 'Dashboard') },
  { path: '/mc/students', icon: 'groups', label: t('mc.nav_attendance_short', 'Attendance') },
  { path: '/mc/ceremony', icon: 'theater_comedy', label: t('mc.nav_ceremony_short', 'Ceremony') },
  { path: '/mc/lookup', icon: 'manage_search', label: t('mc.nav_lookup_short', 'Lookup') },
]);

let socket = null;

onMounted(() => {
  // If VITE_API_URL is just '/api', the proxy is used for HTTP. For WebSockets, we connect directly to avoid proxy drops.
  let backendUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
  if (backendUrl === '/api') backendUrl = 'http://127.0.0.1:5000';
  else backendUrl = backendUrl.replace('/api', '');

  socket = io(backendUrl, { transports: ['websocket', 'polling'] });

  socket.on('connect', () => {
    socketConnected.value = true;
    socket.emit('join', { userId: user.value?.id, role: 'mc' });
    socket.emit('ceremony:join', { role: 'mc', name: user.value?.fullName });
  });

  socket.on('disconnect', () => { socketConnected.value = false; });

  // Make socket globally available for child views
  window._ceremonySocket = socket;
});

onUnmounted(() => {
  if (socket) socket.disconnect();
  window._ceremonySocket = null;
});
</script>
