<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Staff Navigation Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40 transform transition-transform duration-300 ease-in-out" :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }">
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-8">Staff Portal</h2>
        
        <nav class="space-y-2">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            active-class="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
          >
            <span class="mr-3">{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </router-link>
        </nav>

        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <button @click="logout" class="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <span class="mr-3">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile Menu Toggle -->
    <button @click="sidebarOpen = !sidebarOpen" class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <span class="text-2xl">☰</span>
    </button>

    <!-- Main Content Area -->
    <div class="lg:ml-64 min-h-screen">
      <div class="p-6">
        <RouterView />
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const sidebarOpen = ref(window.innerWidth >= 1024);

const navItems = [
  { name: 'Dashboard', path: '/staff/dashboard', icon: '📊' },
  { name: 'Student List', path: '/staff/students', icon: '👥' },
  { name: 'QR Scanner', path: '/staff/qr-scanner', icon: '📷' },
  { name: 'Gown Collection', path: '/staff/gown-collection', icon: '🎓' },
  { name: 'Seat Management', path: '/staff/seats', icon: '💺' },
  { name: 'Settings', path: '/staff/settings', icon: '⚙️' },
];

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};
</script>
