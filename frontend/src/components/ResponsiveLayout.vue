<template>
  <div class="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden">
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <!-- Logo -->
      <div class="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-800">
        <div class="flex size-12 items-center justify-center bg-white rounded-xl p-1.5 shadow-sm">
          <img 
            src="@/assets/images/inprep-partner-logos-06-300x200.png" 
            alt="University of Greenwich" 
            class="w-full h-full object-contain"
          />
        </div>
        <div>
          <h2 class="font-bold text-gray-900 dark:text-white font-greenwich">Greenwich</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ roleLabel }}</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 overflow-y-auto">
        <div class="space-y-1">
          <router-link
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            v-slot="{ isActive }"
            custom
          >
            <button
              @click="$router.push(item.path)"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-greenwich-navy dark:bg-greenwich-blue text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
            >
              <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </button>
          </router-link>
        </div>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <div class="w-10 h-10 rounded-full bg-greenwich-blue/10 flex items-center justify-center">
            <span class="text-greenwich-navy dark:text-greenwich-blue font-bold">{{ userInitial }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm text-gray-900 dark:text-white truncate">{{ userName }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ userEmail }}</p>
          </div>
          <button @click="handleLogout" class="text-gray-400 hover:text-red-500">
            <span class="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Mobile Header -->
      <header class="lg:hidden sticky top-0 z-40 flex items-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
        <button @click="toggleMobileMenu" class="mr-3">
          <span class="material-symbols-outlined text-gray-600 dark:text-gray-300">menu</span>
        </button>
        <div class="flex items-center gap-2 flex-1">
          <div class="flex size-9 items-center justify-center bg-white rounded-lg p-1 shadow-sm">
            <img 
              src="@/assets/images/inprep-partner-logos-06-300x200.png" 
              alt="Greenwich" 
              class="w-full h-full object-contain"
            />
          </div>
          <h2 class="font-bold text-gray-900 dark:text-white">{{ pageTitle }}</h2>
        </div>
        <NotificationBell v-if="showNotifications" />
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <slot></slot>
      </main>

      <!-- Mobile Bottom Navigation -->
      <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-bottom">
        <div class="flex items-center justify-around px-2 py-2">
          <router-link
            v-for="item in bottomNavigation"
            :key="item.path"
            :to="item.path"
            v-slot="{ isActive }"
            custom
          >
            <button
              @click="$router.push(item.path)"
              :class="[
                'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg flex-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              ]"
            >
              <span class="material-symbols-outlined text-2xl">{{ item.icon }}</span>
              <span class="text-xs font-semibold">{{ item.label }}</span>
            </button>
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="mobileMenuOpen"
      class="lg:hidden fixed inset-0 z-50 bg-black/50"
      @click="toggleMobileMenu"
    >
      <div
        class="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl"
        @click.stop
      >
        <!-- Mobile Menu Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white">
              <span class="material-symbols-outlined text-xl">school</span>
            </div>
            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">Greenwich</h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ roleLabel }}</p>
            </div>
          </div>
          <button @click="toggleMobileMenu">
            <span class="material-symbols-outlined text-gray-600 dark:text-gray-300">close</span>
          </button>
        </div>

        <!-- Mobile Menu Navigation -->
        <nav class="p-4 overflow-y-auto" style="max-height: calc(100vh - 200px)">
          <div class="space-y-1">
            <router-link
              v-for="item in navigation"
              :key="item.path"
              :to="item.path"
              v-slot="{ isActive }"
              custom
            >
              <button
                @click="navigateAndClose(item.path)"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
              >
                <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </button>
            </router-link>
          </div>
        </nav>

        <!-- Mobile Menu User -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="text-primary font-bold">{{ userInitial }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-gray-900 dark:text-white truncate">{{ userName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ userEmail }}</p>
            </div>
            <button @click="handleLogout" class="text-gray-400 hover:text-red-500">
              <span class="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import NotificationBell from './NotificationBell.vue';

const props = defineProps({
  navigation: {
    type: Array,
    default: () => []
  },
  bottomNavigation: {
    type: Array,
    default: () => []
  },
  pageTitle: {
    type: String,
    default: 'Dashboard'
  },
  showNotifications: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const authStore = useAuthStore();
const mobileMenuOpen = ref(false);

const user = computed(() => authStore.user);
const userRole = computed(() => authStore.userRole);

const roleLabel = computed(() => {
  if (userRole.value === 'admin') return 'Admin Portal';
  if (userRole.value === 'staff') return 'Staff Portal';
  return 'Student Portal';
});

const userName = computed(() => user.value?.fullName || 'User');
const userEmail = computed(() => user.value?.email || '');
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const navigateAndClose = (path) => {
  router.push(path);
  mobileMenuOpen.value = false;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
/* Mobile menu animations */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.mobile-menu-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Bottom navigation */
.bottom-nav-enter-active,
.bottom-nav-leave-active {
  transition: all 0.3s ease;
}

.bottom-nav-enter-from,
.bottom-nav-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

/* Smooth scroll */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 59, 92, 0.3) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 59, 92, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 59, 92, 0.5);
}
</style>
