<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
    <!-- Sticky Top Navigation -->
    <div class="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 md:px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link to="/staff" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center">
           <span class="material-symbols-outlined">arrow_back</span>
        </router-link>
        <h1 class="text-xl font-black text-gray-900 dark:text-white">{{ $t('staff.gown_collection') }}</h1>
      </div>
    </div>

    <!-- Main Content Flow -->
    <div class="w-full px-4 md:px-8 py-6 space-y-6">
      <!-- Ultra Modern Hero -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 p-8 lg:p-10 shadow-2xl">
        <div class="absolute inset-0">
          <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border-2 border-white/30">
              <span class="material-symbols-outlined text-4xl text-white">checkroom</span>
            </div>
            <div>
              <p class="text-white/80 text-sm font-semibold uppercase tracking-wider">Gown Management</p>
              <h1 class="text-4xl font-black text-white">Collection Center</h1>
            </div>
          </div>
          <p class="text-white/90 text-lg max-w-2xl">Track and manage graduation gown distribution efficiently</p>
        </div>
      </div>

      <!-- Animated Stats -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div 
          v-for="(stat, index) in statCards"
          :key="index"
          class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
        >
          <div :class="`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.gradient}`"></div>
          <div class="relative z-10">
            <div :class="`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`">
              <span :class="`material-symbols-outlined text-3xl ${stat.color}`">{{ stat.icon }}</span>
            </div>
            <p class="text-3xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-white transition-colors">{{ stat.value }}</p>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80 transition-colors">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Size Distribution Visualization -->
      <div v-if="statistics?.sizeDistribution?.length" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg overflow-x-auto">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-violet-600">bar_chart</span>
          Size Distribution Analytics
        </h2>
        <div class="flex gap-4 min-w-[600px] justify-between pb-4">
          <div 
            v-for="size in statistics.sizeDistribution" 
            :key="size._id"
            class="text-center group cursor-pointer flex-1"
          >
            <div class="mb-3 relative">
              <div 
                class="mx-auto rounded-t-xl overflow-hidden transition-all duration-500 hover:scale-105"
                :style="{ 
                  height: `${Math.max((size.total / Math.max(...statistics.sizeDistribution.map(s => s.total))) * 150, 20)}px`,
                  width: '60px'
                }"
              >
                <div class="relative h-full bg-gradient-to-t from-violet-600 to-fuchsia-500">
                  <div 
                    class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-500 to-teal-400 transition-all duration-700"
                    :style="{ height: `${(size.collected / size.total) * 100}%` }"
                  ></div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-white font-bold text-sm">{{ size.total }}</span>
                  </div>
                </div>
              </div>
            </div>
            <p class="font-black text-gray-900 dark:text-white text-lg">{{ size._id }}</p>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">{{ size.collected }} collected</p>
            <p class="text-xs text-gray-500 mt-1">{{ size.pending }} pending</p>
          </div>
        </div>
        <div class="flex items-center justify-center gap-8 mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-gradient-to-br from-violet-600 to-fuchsia-500"></div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-gradient-to-br from-emerald-500 to-teal-400"></div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Collected</span>
          </div>
        </div>
      </div>

      <!-- Gown Collection List -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">All Gown Collections</h2>
          <span class="px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-bold">
            {{ gownCollections.length }} records
          </span>
        </div>

        <div v-if="loading" class="text-center py-16">
          <div class="inline-block w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-500 font-medium">Loading gown collections...</p>
        </div>

        <div v-else-if="gownCollections.length === 0" class="text-center py-16">
          <span class="material-symbols-outlined text-8xl text-gray-300 mb-4">checkroom</span>
          <p class="text-gray-500 font-medium text-lg">No gown collections found</p>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="gc in gownCollections" 
            :key="gc._id"
            class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-6 border-2 border-gray-200 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-500 transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6"
          >
            <!-- Student Info -->
            <div class="flex items-start gap-4 flex-1 min-w-0">
              <div class="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-white font-black text-lg md:text-xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                {{ getInitials(gc.userId?.fullName) }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-black text-lg text-gray-900 dark:text-white truncate">{{ gc.userId?.fullName || 'N/A' }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 font-mono">{{ gc.userId?.studentId || 'N/A' }}</p>
                <div class="flex items-center gap-4 mt-2">
                  <span class="text-xs text-gray-500">Size:</span>
                  <span class="px-3 py-1 bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 rounded-lg font-bold text-xs md:text-sm">
                    {{ gc.size }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Status & Actions -->
            <div class="flex flex-row md:flex-col items-center justify-between w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-200 dark:border-gray-700 md:border-t-0 gap-4">
              <!-- Status Display -->
              <div class="text-left md:text-right flex-1 md:flex-none">
                <span 
                  :class="[
                    'px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-bold text-xs md:text-sm inline-block',
                    getStatusClass(gc.status)
                  ]"
                >
                  {{ getStatusLabel(gc.status) }}
                </span>
                <p v-if="gc.collectionDate" class="text-[10px] md:text-xs text-gray-500 mt-2">
                  {{ new Date(gc.collectionDate).toLocaleDateString('en-GB') }}
                </p>
                <p v-else-if="gc.scheduledDate" class="text-[10px] md:text-xs text-gray-500 mt-2">
                  Due: {{ new Date(gc.scheduledDate).toLocaleDateString('en-GB') }}
                </p>
              </div>

              <!-- Status Change Button -->
              <button
                @click.stop="changeStatus(gc)"
                class="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-xs md:text-base flex-shrink-0"
              >
                <span class="material-symbols-outlined text-[20px] md:text-[24px]">sync</span>
                <span class="hidden md:inline">Change Status</span>
                <span class="md:hidden">Update</span>
              </button>
            </div>
            
            <!-- Absolute Notes for Desktop, Inline for Mobile -->
            <div v-if="gc.notes" class="md:absolute top-4 right-4 md:opacity-0 group-hover:opacity-100 transition-opacity mt-4 md:mt-0 p-3 bg-white/90 backdrop-blur dark:bg-gray-800/90 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm z-10 w-full md:w-64">
              <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Notes</p>
              <p class="text-xs text-gray-700 dark:text-gray-300 italic">"{{ gc.notes }}"</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Change Modal -->
      <div 
        v-if="showStatusModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showStatusModal = false"
      >
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-6">Change Gown Status</h3>
          
          <div class="space-y-3 mb-6">
            <button
              v-for="status in statusOptions"
              :key="status.value"
              @click="updateStatus(status.value)"
              :class="[
                'w-full px-6 py-4 rounded-xl font-bold text-left transition-all hover:scale-105',
                status.class
              ]"
            >
              <div class="flex items-center justify-between">
                <span>{{ status.label }}</span>
                <span class="material-symbols-outlined">{{ status.icon }}</span>
              </div>
            </button>
          </div>

          <button
            @click="showStatusModal = false"
            class="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Cancel
          </button>
        </div>
    </div>
  </div>
</div>
</template>

<script setup>
const { t } = useI18n();
import { ref, computed, onMounted, onActivated } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '@/services/api';

// State
const loading = ref(true);
const gownCollections = ref([]);
const statistics = ref(null);
const showStatusModal = ref(false);
const selectedGownCollection = ref(null);

// Status options
const statusOptions = [
  { value: 'pending', label: 'Pending', icon: 'schedule', class: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  { value: 'scheduled', label: 'Scheduled', icon: 'event', class: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { value: 'collected', label: 'Collected', icon: 'check_circle', class: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  { value: 'returned', label: 'Returned', icon: 'keyboard_return', class: 'bg-purple-100 text-purple-700 hover:bg-purple-200' }
];

// Computed
const statCards = computed(() => [
  {
    icon: 'inventory_2',
    value: statistics.value?.total || 0,
    label: 'Total Gowns',
    bg: 'bg-violet-100 dark:bg-violet-900/20',
    color: 'text-violet-600',
    gradient: 'bg-gradient-to-br from-violet-500 to-purple-500'
  },
  {
    icon: 'check_circle',
    value: statistics.value?.collected || 0,
    label: 'Collected',
    bg: 'bg-emerald-100 dark:bg-emerald-900/20',
    color: 'text-emerald-600',
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-500'
  },
  {
    icon: 'pending',
    value: statistics.value?.pending || 0,
    label: 'Pending',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    color: 'text-orange-600',
    gradient: 'bg-gradient-to-br from-orange-500 to-amber-500'
  },
  {
    icon: 'event',
    value: statistics.value?.scheduled || 0,
    label: 'Scheduled',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    color: 'text-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500'
  },
  {
    icon: 'percent',
    value: `${statistics.value?.collectionRate || 0}%`,
    label: 'Collection Rate',
    bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/20',
    color: 'text-fuchsia-600',
    gradient: 'bg-gradient-to-br from-fuchsia-500 to-pink-500'
  }
]);

// Methods
const loadGownCollectionData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/staff/gown-collection');
    if (response.data.success) {
      gownCollections.value = response.data.data.gownCollections;
      statistics.value = response.data.data.statistics;
    }
  } catch (error) {
    console.error('Error loading gown collection data:', error);
  } finally {
    loading.value = false;
  }
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    collected: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    returned: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
  };
  return classes[status] || classes.pending;
};

const getStatusLabel = (status) => {
  const labels = {
    pending: '⏳ Pending',
    scheduled: '📅 Scheduled',
    collected: '✅ Collected',
    returned: '🔄 Returned'
  };
  return labels[status] || status;
};

const changeStatus = (gownCollection) => {
  selectedGownCollection.value = gownCollection;
  showStatusModal.value = true;
};

const updateStatus = async (newStatus) => {
  try {
    const response = await api.patch(`/staff/gown-collection/${selectedGownCollection.value._id}`, {
      status: newStatus
    });

    if (response.data.success) {
      showStatusModal.value = false;
      await loadGownCollectionData();
    }
  } catch (error) {
    console.error('Error updating gown status:', error);
    alert('Failed to update status. Please try again.');
  }
};

onMounted(() => {
  loadGownCollectionData();
});

onActivated(() => {
  loadGownCollectionData();
});
</script>
