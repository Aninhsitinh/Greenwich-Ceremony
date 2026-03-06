
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed h-full z-30 transition-transform duration-300 transform lg:translate-x-0" :class="{ '-translate-x-full': !sidebarOpen }">
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <router-link to="/admin/users" class="flex items-center gap-3">
          <img src="@/assets/images/university-of-greenwich.jpg" alt="Logo" class="w-8 h-8 object-contain" />
          <span class="font-bold text-gray-900 dark:text-white">Admin Portal</span>
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="[
            $route.path === item.href
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
          {{ item.name }}
        </router-link>
      </nav>

      <!-- User Menu -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user?.fullName || 'Admin' }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user?.email }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
        >
          <span class="material-symbols-outlined text-lg">logout</span>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
      <!-- Top Header (Mobile only) -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 lg:hidden sticky top-0 z-20">
        <button @click="sidebarOpen = !sidebarOpen" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <span class="font-semibold text-gray-900 dark:text-white">Admin Portal</span>
        <div class="w-6"></div> <!-- Spacer -->
      </header>

      <!-- Content -->
      <main class="flex-1 p-6">
        <router-view></router-view>
      </main>
    </div>

    <!-- Mobile Sidebar Backdrop -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black/50 z-20 lg:hidden"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const sidebarOpen = ref(false);

const user = computed(() => authStore.user);

const userInitials = computed(() => {
  if (!user.value?.fullName) return 'A';
  return user.value.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const navigation = [
  { name: 'Accounts', href: '/admin/users', icon: 'manage_accounts'},
  { name: 'Posts', href: '/admin/posts', icon: 'article' },
  { name: 'Settings', href: '/admin/settings', icon: 'settings' },
];

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
