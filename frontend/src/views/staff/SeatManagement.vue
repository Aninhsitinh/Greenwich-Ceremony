<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('staff.seat_management')"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Ultra Modern Hero -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-8 lg:p-10 shadow-2xl">
        <div class="absolute inset-0">
          <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border-2 border-white/30">
              <span class="material-symbols-outlined text-4xl text-white">event_seat</span>
            </div>
            <div>
              <p class="text-white/80 text-sm font-semibold uppercase tracking-wider">Venue Management</p>
              <h1 class="text-4xl font-black text-white">Seat Assignments</h1>
            </div>
          </div>
          <p class="text-white/90 text-lg max-w-2xl">Monitor guest seat bookings and venue capacity</p>
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

      <!-- Capacity Visualization -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-cyan-600">insights</span>
          Venue Capacity Overview
        </h2>
        <div class="mb-4">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-bold text-gray-700 dark:text-gray-300">
              {{ statistics?.totalBooked || 0 }} / {{ statistics?.totalCapacity || 0 }} seats
            </span>
            <span class="text-3xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {{ statistics?.occupancyRate || 0 }}%
            </span>
          </div>
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div 
              class="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-1000 ease-out relative"
              :style="{ width: `${statistics?.occupancyRate || 0}%` }"
            >
              <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 mt-6">
          <div class="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl">
            <p class="text-2xl font-black text-cyan-600">{{ statistics?.totalBooked || 0 }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Booked</p>
          </div>
          <div class="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl">
            <p class="text-2xl font-black text-emerald-600">{{ statistics?.available || 0 }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Available</p>
          </div>
          <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
            <p class="text-2xl font-black text-purple-600">{{ statistics?.guestSeats || 0 }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Guest Seats</p>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span class="material-symbols-outlined text-cyan-500">search</span>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by student, seat, or guest name..."
                class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
          <select 
            v-model="filterType"
            class="px-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl focus:border-blue-500 transition-all text-gray-900 dark:text-white font-medium"
          >
            <option value="">All Types</option>
            <option value="guest">Guest Seats</option>
            <option value="student">Student Seats</option>
          </select>
        </div>
      </div>

      <!-- Interactive Seat Map -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-cyan-600">view_module</span>
            Interactive Seat Map
          </h2>
          <div class="flex gap-4 text-sm font-medium">
            <span class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-white border dark:bg-gray-700"></div> Empty</span>
            <span class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-purple-500"></div> Guest</span>
            <span class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-blue-500"></div> Student</span>
          </div>
        </div>

        <div v-if="loading" class="text-center py-16">
          <div class="inline-block w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-500 font-medium">Loading seat map...</p>
        </div>

        <div v-else-if="Object.keys(seatBlocks).length === 0" class="text-center py-16">
          <span class="material-symbols-outlined text-8xl text-gray-300 mb-4">event_seat</span>
          <p class="text-gray-500 font-medium text-lg">No seat assignments found</p>
        </div>

        <div v-else class="flex flex-col items-center pb-20 overflow-x-auto w-full">
          
          <!-- Cinema/Theater Stage Representation -->
          <div class="w-full max-w-4xl flex flex-col items-center mb-16 relative perspective-[1000px]">
             <!-- Stage Screen / Curvature -->
             <div class="w-[80%] h-12 border-t-[12px] border-cyan-500 rounded-[100%] absolute -top-4 shadow-[0_-20px_40px_rgba(6,-182,-212,0.3)]"></div>
             <div class="z-10 bg-gradient-to-b from-gray-100 to-white dark:from-gray-700 dark:to-gray-800 px-16 py-3 rounded-b-3xl shadow-lg border border-gray-200 dark:border-gray-600 uppercase tracking-[0.3em] text-sm font-bold text-gray-400 dark:text-gray-400">
               Main Stage
             </div>
             <!-- Spotlight effects -->
             <div class="absolute top-10 left-1/4 w-32 h-64 bg-cyan-400/10 blur-2xl transform -rotate-12"></div>
             <div class="absolute top-10 right-1/4 w-32 h-64 bg-cyan-400/10 blur-2xl transform rotate-12"></div>
          </div>

          <!-- Iterate over each block as rows -->
          <div class="flex flex-col gap-6 items-center max-w-[100%] min-w-max px-4">
            <div v-for="(members, block) in seatBlocks" :key="block" class="flex items-center gap-6 justify-center group relative">
              
              <!-- Row Label Left -->
              <div class="w-8 text-center text-xl font-black text-gray-400 dark:text-gray-500 group-hover:text-cyan-500 transition-colors select-none">
                {{ block }}
              </div>
              
              <!-- Seats in the Row -->
              <div class="flex gap-2 sm:gap-3 md:gap-4 justify-center">
                <div 
                  v-for="(seat, index) in members" 
                  :key="seat.id"
                  @click="openSeatModal(seat)"
                  class="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-t-2xl rounded-b-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-2 shadow-md hover:shadow-cyan-500/50 border-b-4"
                  :class="[
                    seat.seatType === 'guest' ? 'bg-purple-500 dark:bg-purple-600 border-purple-700 text-white' : 
                    seat.seatType === 'student' ? 'bg-blue-500 dark:bg-blue-600 border-blue-700 text-white' : 
                    'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                  ]"
                >
                  <!-- Add a visual "gap" in the middle of a long row if needed (e.g., aisle) -->
                  <div v-if="index === Math.floor(members.length / 2)" class="absolute -left-3 sm:-left-4 md:-left-6 w-2 sm:w-4 border-l h-full opacity-0 pointer-events-none"></div>

                  <!-- Checked In Indicator / Spotlight -->
                  <div v-if="seat.userId?.tickets?.some(t => t.isScanned)" class="absolute -top-3 w-4 h-4 bg-green-400 rounded-full blur-[2px] animate-pulse shadow-[0_0_10px_#4ade80]"></div>

                  <span class="font-bold text-xs sm:text-sm md:text-base select-none z-10 block mt-1">
                    {{ seat.seatNumber.replace(block, '') || seat.seatNumber }}
                  </span>
                  
                  <!-- Seat Armrests Effect -->
                  <div class="absolute top-2 -left-[2px] w-[2px] h-3/5 bg-black/20 rounded-full"></div>
                  <div class="absolute top-2 -right-[2px] w-[2px] h-3/5 bg-black/20 rounded-full"></div>
                </div>
              </div>

              <!-- Row Label Right -->
              <div class="w-8 text-center text-xl font-black text-gray-400 dark:text-gray-500 group-hover:text-cyan-500 transition-colors select-none">
                {{ block }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seat Detail Modal -->
      <div v-if="selectedSeat" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeSeatModal"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-6 shadow-2xl transform transition-all">
          <button @click="closeSeatModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
          
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
              :class="selectedSeat.seatType === 'guest' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'">
              <span class="text-3xl font-black">{{ selectedSeat.seatNumber }}</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Seat Details</h3>
            <span class="inline-block mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              {{ selectedSeat.seatType }}
            </span>
          </div>

          <div class="space-y-4 mb-8">
            <div v-if="selectedSeat.userId" class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600">
              <div class="flex items-center gap-4 mb-2">
                <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xl overflow-hidden">
                  <span v-if="!selectedSeat.userId.profilePhoto">🎓</span>
                  <img v-else :src="getProfilePicture(selectedSeat.userId.profilePhoto)" class="w-full h-full object-cover" />
                </div>
                <div>
                  <p class="font-bold text-gray-900 dark:text-white text-lg">{{ selectedSeat.userId.fullName }}</p>
                  <p class="text-sm text-gray-500 font-mono">{{ selectedSeat.userId.studentId }}</p>
                </div>
              </div>
              <div v-if="selectedSeat.seatType === 'guest'" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p class="text-sm font-medium text-gray-500">Guest Info</p>
                <p class="font-semibold text-gray-800 dark:text-gray-200">{{ selectedSeat.guestName || 'Not provided' }} ({{ selectedSeat.guestRelation || 'N/A' }})</p>
              </div>
            </div>
          </div>

          <!-- Reassign Area -->
          <div class="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl border border-cyan-100 dark:border-cyan-800">
            <label class="block text-sm font-bold text-cyan-800 dark:text-cyan-300 mb-2">Reassign Seat Number</label>
            <div class="flex gap-2">
              <input 
                v-model="editSeatNumberValue"
                type="text" 
                class="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-transparent rounded-xl focus:border-cyan-500 transition-all font-bold md:text-lg"
                placeholder="e.g. A12"
              />
              <button 
                @click="saveSeat"
                :disabled="isSavingSeat"
                class="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
              >
                <span v-if="isSavingSeat" class="material-symbols-outlined animate-spin">refresh</span>
                <span v-else>Save</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
const { t } = useI18n();
import { ref, computed, onMounted, onActivated, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import api from '@/services/api';

const navigation = computed(() => [
  { path: '/staff', icon: 'dashboard', label: t('staff.nav_dashboard') },
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: t('staff.nav_qr') },
  { path: '/staff/gown-collection', icon: 'checkroom', label: t('staff.nav_gown') },
  { path: '/staff/seat-management', icon: 'event_seat', label: t('staff.nav_seat') },
  { path: '/staff/student-list', icon: 'group', label: t('staff.nav_students') },
  { path: '/staff/monitor', icon: 'monitor_heart', label: t('staff.nav_monitor') },
  { path: '/staff/settings', icon: 'settings', label: t('staff.nav_settings') }
]);

const bottomNavigation = computed(() => [
  { path: '/staff', icon: 'home', label: t('staff.nav_home') },
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: t('staff.nav_scan') },
  { path: '/staff/gown-collection', icon: 'checkroom', label: t('staff.nav_gown') },
  { path: '/staff/student-list', icon: 'group', label: t('staff.nav_students') }
]);

// Real-time data from MongoDB
const loading = ref(true);
const seats = ref([]);
const statistics = ref(null);

const selectedSeat = ref(null);
const editSeatNumberValue = ref('');
const isSavingSeat = ref(false);

// Filters
const searchQuery = ref('');
const filterType = ref('');

// Ceremony Monitor
const ceremonyConnected = ref(false);
const onStageInfo = ref(null);
const recentCheckins = ref([]);
let ceremonySocket = null;

const formatTS = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

// Computed stats
const statCards = computed(() => [
  {
    icon: 'chair',
    value: statistics.value?.totalCapacity || 0,
    label: 'Total Capacity',
    bg: 'bg-cyan-100 dark:bg-cyan-900/20',
    color: 'text-cyan-600',
    gradient: 'bg-gradient-to-br from-cyan-500 to-blue-500'
  },
  {
    icon: 'event_seat',
    value: statistics.value?.totalBooked || 0,
    label: 'Booked',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    color: 'text-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-500'
  },
  {
    icon: 'chair_alt',
    value: statistics.value?.available || 0,
    label: 'Available',
    bg: 'bg-emerald-100 dark:bg-emerald-900/20',
    color: 'text-emerald-600',
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-500'
  },
  {
    icon: 'percent',
    value: `${statistics.value?.occupancyRate || 0}%`,
    label: 'Occupancy',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    color: 'text-purple-600',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
  },
  {
    icon: 'group',
    value: statistics.value?.guestSeats || 0,
    label: 'Guest Seats',
    bg: 'bg-pink-100 dark:bg-pink-900/20',
    color: 'text-pink-600',
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-500'
  }
]);

// Computed filtered seats
const filteredSeats = computed(() => {
  let filtered = seats.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(seat => 
      seat.userId?.fullName?.toLowerCase().includes(query) ||
      seat.userId?.studentId?.toLowerCase().includes(query) ||
      seat.guestName?.toLowerCase().includes(query) ||
      seat.seatNumber?.toLowerCase().includes(query)
    );
  }

  if (filterType.value) {
    filtered = filtered.filter(seat => seat.seatType === filterType.value);
  }

  return filtered;
});

// Format missing items (if we want to generate placeholders for empty seats between min/max numbering, we could do it here)
const seatBlocks = computed(() => {
  const blocks = {};
  filteredSeats.value.forEach(seat => {
    // Extract block letter and number (e.g., "A12" -> Block "A", Num 12)
    const match = seat.seatNumber.match(/^([A-Za-z]+)(\d+)$/);
    const blockLetter = match ? match[1].toUpperCase() : 'UNKNOWN';
    
    if (!blocks[blockLetter]) {
      blocks[blockLetter] = [];
    }
    blocks[blockLetter].push(seat);
  });

  // Sort blocks alphabetically
  const sortedBlocks = {};
  Object.keys(blocks).sort().forEach(key => {
    // Sort seats within block numerically
    sortedBlocks[key] = blocks[key].sort((a, b) => {
      const matchA = a.seatNumber.match(/\d+$/);
      const matchB = b.seatNumber.match(/\d+$/);
      const numA = matchA ? parseInt(matchA[0], 10) : 0;
      const numB = matchB ? parseInt(matchB[0], 10) : 0;
      return numA - numB;
    });
  });
  
  return sortedBlocks;
});

const getProfilePicture = (photo) => {
  if (!photo) return '';
  if (photo.startsWith('http') || photo.startsWith('data:')) return photo;
  return photo.startsWith('/') ? photo : `/${photo}`;
};

// Load data
const loadSeatManagementData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/staff/seat-management', { params: { limit: 1000 } });
    if (response.data.success) {
      seats.value = response.data.data.seats;
      statistics.value = response.data.data.statistics;
    }
  } catch (error) {
    console.error('Error loading seat management data:', error);
  } finally {
    loading.value = false;
  }
};

// Seat Editing Logic
import { useToast } from 'vue-toastification';
const toast = useToast();

const openSeatModal = (seat) => {
  selectedSeat.value = seat;
  editSeatNumberValue.value = seat.seatNumber;
};

const closeSeatModal = () => {
  selectedSeat.value = null;
  editSeatNumberValue.value = '';
};

const saveSeat = async () => {
  if (!selectedSeat.value) return;
  const newSeatNumber = editSeatNumberValue.value?.trim()?.toUpperCase();
  if (!newSeatNumber) return;

  isSavingSeat.value = true;
  try {
    const res = await api.patch(`/seats/${selectedSeat.value.id}/admin-update`, { newSeatNumber });
    if (res.data.success) {
      toast.success(res.data.message || 'Seat updated!');
      const idx = seats.value.findIndex(s => s.id === selectedSeat.value.id);
      if (idx !== -1) {
        seats.value[idx].seatNumber = newSeatNumber;
      }
      closeSeatModal();
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error updating seat');
  } finally {
    isSavingSeat.value = false;
  }
};

onMounted(() => {
  loadSeatManagementData();
});

onActivated(() => {
  loadSeatManagementData();
});
</script>
