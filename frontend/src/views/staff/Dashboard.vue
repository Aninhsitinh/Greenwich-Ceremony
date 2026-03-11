<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('staff.dashboard')"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Hero Section -->
      <div class="glass-card mesh-gradient animate-mesh p-8 border-none overflow-hidden relative group">
        <!-- Subtle noise overlay for texture -->
        <div class="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div class="flex items-start justify-between relative z-10">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
                <span class="material-symbols-outlined text-2xl text-white">workspace_premium</span>
              </div>
              <div>
                <p class="text-white/60 text-xs font-black uppercase tracking-[0.2em]">{{ $t('staff.dashboard') }}</p>
                <h1 class="text-3xl font-black text-white drop-shadow-md">{{ $t('auth.welcome_back') }}!</h1>
              </div>
            </div>
            <p class="text-xl font-black text-white max-w-2xl drop-shadow-sm">
              {{ user?.fullName }}
            </p>
            <p class="text-white/80 mt-1 font-medium italic">Manage ceremony operations with confidence</p>
          </div>
          
          <!-- Date Card -->
          <div class="hidden lg:block text-right">
            <div class="glass-card bg-white/10 p-4 border-white/20 backdrop-blur-md neon-glow-success">
              <p class="text-white/50 text-xs uppercase tracking-widest mb-1 font-bold">Today</p>
              <p class="text-2xl font-black text-white drop-shadow-sm">{{ currentDate }}</p>
              <div class="mt-2 flex items-center justify-end gap-2">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                <span class="text-white/70 text-xs font-bold uppercase tracking-tighter">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <template v-if="loading">
          <div v-for="i in 4" :key="i" class="glass-card p-6 h-40 flex flex-col justify-between border-transparent">
            <SkeletonLoader width="40px" height="40px" />
            <SkeletonLoader width="60%" height="24px" />
            <SkeletonLoader width="100%" height="8px" />
          </div>
        </template>
        <template v-else>
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            class="glass-card p-6 border-transparent hover-lift group"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white" :class="stat.iconBgClass">
                <span class="material-symbols-outlined text-xl">{{ stat.icon }}</span>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="stat.badge.class">
                {{ stat.badge.text }}
              </span>
            </div>
            
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {{ stat.value }}
            </h3>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ stat.label }}
            </p>
            
            <!-- Progress bar -->
            <div v-if="stat.progress" class="mt-4">
              <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-1000"
                  :class="stat.progressClass"
                  :style="{ width: `${stat.progress}%` }"
                ></div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Quick Actions & Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quick Actions -->
        <div class="lg:col-span-1">
          <div class="glass-card p-6 border-transparent h-full">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-gray-900 dark:text-white">bolt</span>
              {{ $t('student.quick_actions') }}
            </h2>
            <div class="space-y-3">
              <router-link
                v-for="action in quickActions"
                :key="action.path"
                :to="action.path"
                class="block group"
              >
                <div class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 press-feedback"
                  :class="action.variant === 'primary' 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                    : 'glass-card border-transparent hover:border-primary/30 text-gray-900 dark:text-white'"
                >
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                    :class="action.variant === 'primary' ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'"
                  >
                    <span class="material-symbols-outlined text-xl" 
                      :class="action.variant === 'primary' ? 'text-white dark:text-gray-900' : 'text-gray-900 dark:text-white'"
                    >
                      {{ action.icon }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <p class="font-bold text-sm">
                      {{ action.label }}
                    </p>
                    <p class="text-xs opacity-70">
                      {{ action.description || 'Click to open' }}
                    </p>
                  </div>
                  <span class="material-symbols-outlined text-sm opacity-50 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="lg:col-span-2">
          <div class="glass-card p-6 border-transparent h-full">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-gray-900 dark:text-white">schedule</span>
                Recent Activity
              </h2>
              <button class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium underline">View All</button>
            </div>
            
            <div class="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              <template v-if="loading">
                <div v-for="i in 5" :key="i" class="flex items-start gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50">
                   <SkeletonLoader width="40px" height="40px" />
                   <div class="flex-1 space-y-2">
                     <SkeletonLoader width="40%" height="16px" />
                     <SkeletonLoader width="70%" height="12px" />
                   </div>
                </div>
              </template>
              <template v-else>
                <div 
                  v-for="activity in recentActivity" 
                  :key="activity.id"
                  class="flex items-start gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                >
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white" :class="activity.iconBgClass">
                    <span class="material-symbols-outlined text-lg">{{ activity.icon }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ activity.title }}</p>
                    <p class="text-xs text-gray-500 truncate mt-0.5">{{ activity.description }}</p>
                    <p class="text-[10px] text-gray-400 mt-1">{{ activity.time }}</p>
                  </div>
                  <span class="px-2 py-1 rounded text-[10px] font-bold flex-shrink-0" :class="activity.badge.class">
                    {{ activity.badge.text }}
                  </span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Scan Stats -->
      <div v-if="scanStats.total > 0" class="bg-gray-900 dark:bg-white rounded-lg p-6 shadow-sm text-white dark:text-gray-900">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold mb-4">Today's Scan Statistics</h3>
            <div class="flex items-center gap-8">
              <div>
                <p class="text-3xl font-black">{{ scanStats.valid }}</p>
                <p class="text-xs opacity-70 uppercase tracking-wider font-semibold">Valid</p>
              </div>
              <div>
                <p class="text-3xl font-black">{{ scanStats.invalid }}</p>
                <p class="text-xs opacity-70 uppercase tracking-wider font-semibold">Invalid</p>
              </div>
              <div class="w-px h-10 bg-white/20 dark:bg-black/10"></div>
              <div>
                <p class="text-3xl font-black">{{ scanStats.total }}</p>
                <p class="text-xs opacity-70 uppercase tracking-wider font-semibold">Total</p>
              </div>
            </div>
          </div>
          <div class="hidden lg:block relative">
             <div class="flex items-center gap-2 neon-glow-info px-4 py-2 rounded-xl">
                <span class="text-4xl font-bold">{{ Math.round((scanStats.valid / scanStats.total) * 100) }}%</span>
                <span class="text-sm font-medium opacity-70">Success Rate</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { computed, ref, onMounted, onActivated } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import api from '@/services/api';
import SkeletonLoader from '@/components/SkeletonLoader.vue';

const authStore = useAuthStore();
const { t } = useI18n();
const user = computed(() => authStore.user);

const navigation = computed(() => [
  { path: '/staff', icon: 'dashboard', label: t('staff.nav_dashboard') },
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: t('staff.nav_qr') },
  { path: '/staff/gown-collection', icon: 'checkroom', label: t('staff.nav_gown') },
  { path: '/staff/logistics', icon: 'inventory_2', label: 'Logistics' },
  { path: '/staff/finance', icon: 'payments', label: 'Refunds' },
  { path: '/staff/seat-management', icon: 'event_seat', label: t('staff.nav_seat') },
  { path: '/staff/student-list', icon: 'group', label: t('staff.nav_students') },
  { path: '/staff/monitor', icon: 'monitor_heart', label: t('staff.nav_monitor') },
  { path: '/staff/settings', icon: 'settings', label: t('staff.nav_settings') },
  { path: '/staff/chat', icon: 'support_agent', label: t('staff.nav_chat') }
]);

const bottomNavigation = computed(() => [
  { path: '/staff', icon: 'home', label: t('staff.nav_home') },
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: t('staff.nav_scan') },
  { path: '/staff/gown-collection', icon: 'checkroom', label: t('staff.nav_gown') },
  { path: '/staff/logistics', icon: 'inventory_2', label: 'Logistics' },
  { path: '/staff/finance', icon: 'payments', label: 'Refunds' },
  { path: '/staff/student-list', icon: 'group', label: t('staff.nav_students') }
]);

const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

// Real-time data from MongoDB
const loading = ref(true);
const statistics = ref(null);
const recentRegistrations = ref([]);

// Computed stats for UI
const stats = computed(() => {
  if (!statistics.value) return [];
  
  const { overview, seats, gowns } = statistics.value;
  
  return [
    {
      icon: 'groups',
      value: overview?.totalRegistrations || 0,
      label: 'Total Registrations',
      iconBgClass: 'bg-blue-600',
      badge: { 
        text: `+${overview?.recentRegistrations || 0} recent`, 
        class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
      },
      progress: overview?.registrationRate || 0,
      progressClass: 'bg-blue-600'
    },
    {
      icon: 'verified_user',
      value: overview?.confirmedRegistrations || 0,
      label: 'Confirmed Students',
      iconBgClass: 'bg-emerald-600',
      badge: { 
        text: `${overview?.registrationRate || 0}%`, 
        class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
      },
      progress: overview?.registrationRate || 0,
      progressClass: 'bg-emerald-600'
    },
    {
      icon: 'confirmation_number',
      value: overview?.totalTickets || 0,
      label: 'Tickets Generated',
      iconBgClass: 'bg-purple-600',
      badge: { 
        text: `${overview?.ticketGenerationRate || 0}%`, 
        class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
      },
      progress: overview?.ticketGenerationRate || 0,
      progressClass: 'bg-purple-600'
    },
    {
      icon: 'checkroom',
      value: gowns?.totalCollected || 0,
      label: 'Gowns Collected',
      iconBgClass: 'bg-orange-600',
      badge: { 
        text: `${gowns?.collectionRate || 0}%`, 
        class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' 
      },
      progress: gowns?.collectionRate || 0,
      progressClass: 'bg-orange-600'
    }
  ];
});

const quickActions = [
  { 
    icon: 'qr_code_scanner', 
    label: 'Scan QR Code', 
    path: '/staff/qr-scanner', 
    variant: 'primary',
    description: 'Verify student tickets'
  },
  { 
    icon: 'checkroom', 
    label: 'Gown Collection', 
    path: '/staff/gown-collection',
    description: 'Manage gown distribution'
  },
  { 
    icon: 'event_seat', 
    label: 'Seat Management', 
    path: '/staff/seat-management',
    description: 'View seat assignments'
  },
  { 
    icon: 'inventory_2', 
    label: 'Item Logistics', 
    path: '/staff/logistics',
    variant: 'secondary',
    description: 'Invitations & Wristbands'
  },

  { 
    icon: 'payments', 
    label: 'Refunds', 
    path: '/staff/finance',
    description: 'Manage deposit refunds'
  },
  { 
    icon: 'group', 
    label: 'Student List', 
    path: '/staff/student-list',
    description: 'View all students'
  }
];

const scanStats = computed(() => {
  // TODO: Implement real scan stats from backend
  return {
    valid: 0,
    invalid: 0,
    total: 0
  };
});

// Recent activity computed from registrations
const recentActivity = computed(() => {
  if (!recentRegistrations.value || recentRegistrations.value.length === 0) {
    return [];
  }
  
  return recentRegistrations.value.slice(0, 5).map((reg) => {
    const timeAgo = getTimeAgo(new Date(reg.createdAt));
    
    return {
      id: reg._id,
      icon: 'how_to_reg',
      iconBgClass: 'bg-indigo-600',
      title: 'New Registration',
      description: `${reg.userId?.fullName || 'Unknown'} - ${reg.userId?.studentId || 'N/A'}`,
      time: timeAgo,
      badge: { 
        text: reg.registrationStatus === 'confirmed' ? 'Confirmed' : 'Pending', 
        class: reg.registrationStatus === 'confirmed' 
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      }
    };
  });
});

// Load dashboard statistics
const loadStatistics = async () => {
  loading.value = true;
  try {
    const response = await api.get('/staff/statistics');
    if (response.data.success) {
      statistics.value = response.data.data;
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
  } finally {
    loading.value = false;
  }
};

// Load recent registrations
const loadRecentRegistrations = async () => {
  try {
    const response = await api.get('/staff/registrations/recent?limit=10');
    if (response.data.success) {
      recentRegistrations.value = response.data.data.registrations;
    }
  } catch (error) {
    console.error('Error loading recent registrations:', error);
  }
};

// Helper function
const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

// Load on mount
onMounted(() => {
  loadStatistics();
  loadRecentRegistrations();
});

// Reload when navigating back (like student dashboard)
onActivated(() => {
  loadStatistics();
  loadRecentRegistrations();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-700 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400;
}
</style>
