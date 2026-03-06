<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex lg:flex-col lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <!-- Logo -->
      <div class="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-700">
            <img 
              src="@/assets/images/university-of-greenwich.jpg" 
              alt="University of Greenwich" 
              class="h-10 w-auto object-contain"
            />




        <div>
          <h2 class="font-bold text-gray-900 dark:text-white font-greenwich">Greenwich</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ roleLabel }}</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 overflow-y-auto custom-scrollbar">
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
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all',
                isActive
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </button>
          </router-link>
        </div>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3">
        <router-link 
          to="/student/profile"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all group"
        >
          <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-600">
            <div 
              v-if="userPhoto"
              class="w-full h-full bg-cover bg-center"
              :style="`background-image: url('${userPhoto}')`"
            ></div>
            <span v-else class="text-gray-600 dark:text-gray-300 font-bold">{{ userInitial }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm text-gray-900 dark:text-white truncate">{{ userName }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userEmail }}</p>
          </div>
          <button @click.prevent="handleLogout" class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <span class="material-symbols-outlined text-xl">logout</span>
          </button>
        </router-link>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden relative">
      <!-- Desktop Header (for Language Switcher & Notifications) -->
      <header :class="['hidden lg:flex absolute right-0 z-40 p-4 items-center gap-3', desktopHeaderClass]">
        <LanguageSwitcher />
        <NotificationBell v-if="showNotifications" />
      </header>

      <!-- Mobile Header -->
      <header class="lg:hidden sticky top-0 z-40 flex items-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 py-2">
        <button @click="toggleMobileMenu" class="mr-3">
          <span class="material-symbols-outlined text-gray-600 dark:text-gray-300">menu</span>
        </button>
        <div class="flex items-center gap-2 flex-1 min-w-0">
            <img 
              src="@/assets/images/university-of-greenwich.jpg" 
              alt="Greenwich" 
              class="h-7 w-auto object-contain flex-shrink-0"
            />
          <h2 class="font-bold text-gray-900 dark:text-white text-sm truncate">{{ pageTitle }}</h2>
        </div>
        
        <!-- Header Actions -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <LanguageSwitcher />
          <NotificationBell v-if="showNotifications" />
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto pb-24 lg:pb-0 custom-scrollbar" style="padding-bottom: calc(4rem + env(safe-area-inset-bottom))" >
        <slot></slot>
      </main>

      <!-- Mobile Bottom Navigation -->
      <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700" style="padding-bottom: env(safe-area-inset-bottom)">
        <div class="flex items-center justify-around px-1 py-2.5">
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
                'flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-xl flex-1 transition-all min-w-0',
                isActive
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800'
                  : 'text-gray-400 dark:text-gray-500'
              ]"
            >
              <span class="material-symbols-outlined text-[22px] leading-none" :class="isActive ? 'font-variation-filled' : ''">{{ item.icon }}</span>
              <span class="text-[9px] font-semibold leading-none truncate w-full text-center">{{ item.label }}</span>
            </button>
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="mobileMenuOpen"
      class="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      @click="toggleMobileMenu"
    >
      <div
        class="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] shadow-2xl bg-white dark:bg-gray-800"
        @click.stop
      >
        <!-- Mobile Menu Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <img 
              src="@/assets/images/university-of-greenwich.jpg" 
              alt="University of Greenwich" 
              class="h-10 w-auto object-contain"
            />




            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">Greenwich</h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ roleLabel }}</p>
            </div>
          </div>
          <button @click="toggleMobileMenu" class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <span class="material-symbols-outlined">close</span>
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
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </button>
            </router-link>
          </div>
        </nav>

        <!-- Mobile Menu User -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all">
            <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-600">
              <div 
                v-if="userPhoto"
                class="w-full h-full bg-cover bg-center"
                :style="`background-image: url('${userPhoto}')`"
              ></div>
              <span v-else class="text-gray-600 dark:text-gray-300 font-bold">{{ userInitial }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-gray-900 dark:text-white truncate">{{ userName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userEmail }}</p>
            </div>
            <button @click="handleLogout" class="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0">
              <span class="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Internal Chat Widget (Hidden for students) -->
    <InternalChatWidget v-if="['admin', 'staff', 'mc'].includes(userRole)" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import NotificationBell from './NotificationBell.vue';
import InternalChatWidget from './InternalChatWidget.vue';
import LanguageSwitcher from './LanguageSwitcher.vue';

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
  },
  desktopHeaderClass: {
    type: String,
    default: 'top-0'
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
  if (userRole.value === 'mc') return 'MC Console';
  return 'Student Portal';
});

const userName = computed(() => user.value?.fullName || 'User');
const userEmail = computed(() => user.value?.email || '');
const userInitial = computed(() => userName.value?.charAt(0).toUpperCase() || 'U');
const userPhoto = computed(() => user.value?.profilePhoto || null);

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
.font-variation-filled {
  font-variation-settings: 'FILL' 1;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
