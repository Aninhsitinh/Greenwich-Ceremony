<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
    <!-- Sticky Top Navigation -->
    <div 
      :class="[
        'sticky top-0 z-40 bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border-b border-white/20 px-4 md:px-6 py-3 flex items-center justify-between shadow-xl transition-all duration-500',
        isFocusMode ? '-translate-y-full opacity-0 pointer-events-none absolute' : 'translate-y-0 opacity-100'
      ]"
    >
      <div class="absolute inset-0 mesh-gradient opacity-10 -z-10"></div>
      <div class="flex items-center gap-4">
        <router-link to="/staff" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center">
           <span class="material-symbols-outlined">arrow_back</span>
        </router-link>
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-black text-gray-900 dark:text-white">Seat Assignments</h1>
          <div class="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 border border-red-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span class="text-[10px] font-black text-red-500 uppercase tracking-tighter">Live Monitor</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button 
          @click="isFocusMode = true" 
          class="btn glass-card border-white/10 text-xs py-1.5 px-4 flex items-center gap-2 hover:bg-white/20"
        >
          <span class="material-symbols-outlined text-sm text-primary">visibility_off</span>
          Focus Mode
        </button>
      </div>
    </div>

    <!-- Exit Focus Mode Button -->
    <div 
      v-if="isFocusMode"
      class="fixed bottom-6 right-6 z-50 animate-bounce-in"
    >
      <button 
        @click="isFocusMode = false"
        class="w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        title="Exit Focus Mode"
      >
        <span class="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">visibility</span>
      </button>
    </div>

    <!-- Main Content Flow (Full Width) -->
    <div class="w-full px-4 md:px-8 py-6 space-y-6">
      <!-- Ultra Modern Hero -->
      <div 
        :class="[
          'glass-card mesh-gradient animate-mesh p-8 lg:p-10 border-none relative overflow-hidden group transition-all duration-700',
          isFocusMode ? 'mt-0 scale-98 opacity-50 blur-sm pointer-events-none h-0 p-0 overflow-hidden mb-0' : 'mb-8'
        ]"
      >
        <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center border-2 border-white/30 shadow-2xl">
              <span class="material-symbols-outlined text-4xl text-white">event_seat</span>
            </div>
            <div>
              <p class="text-white/60 text-xs font-black uppercase tracking-[0.2em] mb-1">Venue Management</p>
              <h1 class="text-4xl font-black text-white drop-shadow-lg">Seat Assignments</h1>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <p class="text-white/80 text-lg font-medium drop-shadow-sm mb-2 text-right">Monitor guest seat bookings and venue capacity</p>
            <div class="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-black uppercase tracking-widest">
              Real-time synchronization active
            </div>
          </div>
        </div>
      </div>

      <!-- Animated Stats -->
      <div 
        :class="[
          'grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 transition-all duration-700',
          isFocusMode ? 'h-0 overflow-hidden opacity-0 mb-0' : ''
        ]"
      >
        <template v-if="loading">
          <div v-for="i in 4" :key="i" class="glass-card p-6 h-32 flex flex-col justify-between">
            <SkeletonLoader width="40px" height="40px" variant="circle" />
            <SkeletonLoader width="100%" height="24px" />
          </div>
        </template>
        <template v-else>
          <div 
            v-for="(stat, index) in statCards"
            :key="index"
            class="glass-card p-6 border-transparent hover-lift group"
          >
            <div :class="`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.gradient}`"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-3 text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors">
                <span class="material-symbols-outlined text-4xl opacity-80 group-hover:scale-110 transition-transform duration-500">{{ stat.icon }}</span>
                <span class="text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20 px-2 py-1 rounded-full transition-colors">{{ stat.label.split(' ')[0] }}</span>
              </div>
              <p class="text-3xl font-black mb-1 text-gray-900 dark:text-white group-hover:text-white transition-colors">{{ stat.value }}</p>
              <p class="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-white/80 uppercase tracking-tighter transition-colors">{{ stat.label }}</p>
            </div>
          </div>
        </template>
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

        <div v-else 
          class="pb-20 overflow-x-auto w-full custom-scrollbar"
          ref="scrollContainer"
          @mousedown="startDrag"
          @mouseleave="stopDrag"
          @mouseup="stopDrag"
          @mousemove="doDrag"
          :class="{ 'cursor-grab': !isDragging, 'cursor-grabbing select-none': isDragging }"
        >
          
          <div class="min-w-full w-max flex flex-col items-center px-4 md:px-8">
            <!-- Stage -->
            <div class="mb-12 flex justify-center w-full">
            <div class="w-2/3 max-w-lg h-16 bg-gray-100 dark:bg-gray-700 rounded-t-[50%] border-t border-x border-gray-200 dark:border-gray-600 flex items-end justify-center pb-4 shadow-sm">
                <span class="text-gray-400 dark:text-gray-500 font-bold tracking-[0.5em] uppercase text-sm">Main Stage</span>
            </div>
          </div>

          <!-- Seat Map Grid -->
          <div v-for="branch in seatMap" :key="branch.name" class="flex flex-col items-center min-w-max">
            <div class="flex flex-col gap-1">
              <div 
                v-for="row in branch.rows" 
                :key="row.row" 
                class="flex items-center gap-3"
              >
                <!-- Row Label -->
                <div class="w-8 text-center text-[10px] font-black text-gray-400">{{ row.row }}</div>

                <!-- Seats -->
                <div class="flex gap-1">
                  <div v-for="(seat, sIndex) in row.seats" :key="seat.id" class="flex items-center">
                    <!-- Aisle gap between pairs -->
                    <div v-if="sIndex > 0 && sIndex % 2 === 0" class="w-2"></div>
                    
                      <button
                        @click="openSeatModal(seat)"
                        :class="[
                          'w-36 h-12 rounded-lg text-[10px] leading-tight font-bold transition-all duration-300 flex flex-col items-center justify-center border px-1 py-1 shadow-sm transform hover:-translate-y-1',
                        seat.status === 'occupied' 
                          ? (seat.type === 1 ? 'bg-blue-500 border-blue-600 text-white shadow-blue-500/20' : 'bg-purple-500 border-purple-600 text-white shadow-purple-500/20')
                            : 'bg-white border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500',
                        !seat.matchesFilter && (searchQuery || filterType) ? 'opacity-20 grayscale-50 scale-95 blur-[0.5px]' : '',
                        seat.id === lastUpdatedId ? 'animate-pulse-update ring-4 ring-primary ring-opacity-50' : ''
                      ]"
                      :title="seat.occupant || seat.id"
                    >
                        <template v-if="seat.status === 'occupied'">
                           <div class="truncate w-full text-center px-1 text-xs font-black mb-0.5">{{ seat.studentId || 'GUEST' }}</div>
                           <div class="truncate w-full text-center px-1 text-[10px] font-bold text-white/90">{{ seat.occupant }}</div>
                        </template>
                        <template v-else>
                          <span class="opacity-40 text-xs">{{ row.row }}{{ group }}</span>
                          <span class="text-[9px] opacity-40 uppercase">{{ seat.type === 1 ? 'STUDENT' : 'GUEST' }}</span>
                        </template>
                      </button>
                  </div>
                </div>

                <!-- Row Label -->
                <div class="w-8 text-center text-[10px] font-black text-gray-400">{{ row.row }}</div>
              </div>
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
        <div class="relative glass-card border-white/20 w-full max-w-md p-6 shadow-2xl transform transition-all overflow-hidden">
          <div class="absolute inset-0 mesh-gradient opacity-10 -z-10"></div>
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
            <div v-if="selectedSeat.status === 'occupied'" class="p-5 glass-card bg-white/50 dark:bg-gray-700/30 border-white/20">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 rounded-2xl bg-white dark:bg-gray-600 flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-700 overflow-hidden shrink-0">
                  <span v-if="!selectedSeat.booking?.user?.profilePhoto" class="text-3xl">🎓</span>
                  <img v-else :src="getProfilePicture(selectedSeat.booking?.user?.profilePhoto)" class="w-full h-full object-cover" />
                </div>
                <div class="overflow-hidden">
                  <p class="font-black text-gray-900 dark:text-white text-xl truncate leading-tight mb-1">{{ selectedSeat.occupant }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider">
                      {{ selectedSeat.studentId || 'N/A' }}
                    </span>
                    <span v-if="selectedSeat.isPaid" class="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                      Paid
                    </span>
                  </div>
                </div>
              </div>

              <div class="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div v-if="selectedSeat.booking?.user?.email" class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-gray-400 text-lg">mail</span>
                  <span class="text-sm text-gray-600 dark:text-gray-300 font-medium">{{ selectedSeat.booking.user.email }}</span>
                </div>
                
                <div v-if="selectedSeat.type === 2" class="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="material-symbols-outlined text-purple-600 text-lg">group</span>
                    <p class="text-[10px] font-black uppercase text-purple-600 tracking-wider">Guest Information</p>
                  </div>
                  <p class="font-bold text-gray-800 dark:text-gray-200">{{ selectedSeat.booking?.guestName || 'Anonymous Guest' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ selectedSeat.booking?.guestRelation || 'Relation N/A' }} • {{ selectedSeat.booking?.guestPhone || 'Phone N/A' }}</p>
                </div>
              </div>
            </div>
            <div v-else class="p-8 text-center italic text-gray-400">
              This seat is currently available.
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import api from '@/services/api';
import SkeletonLoader from '@/components/SkeletonLoader.vue';

const isFocusMode = ref(false);
// Drag to scroll logic
const scrollContainer = ref(null);
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

const startDrag = (e) => {
  // Only start drag if middle mouse button, or left click but NOT on a button (to avoid preventing seat clicks)
  if (e.target.closest('button')) return;
  
  isDragging.value = true;
  startX.value = e.pageX - scrollContainer.value.offsetLeft;
  scrollLeft.value = scrollContainer.value.scrollLeft;
};

const stopDrag = () => {
  isDragging.value = false;
};

const doDrag = (e) => {
  if (!isDragging.value) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.value.offsetLeft;
  const walk = (x - startX.value) * 1.5; // Scroll speed multiplier
  scrollContainer.value.scrollLeft = scrollLeft.value - walk;
};

// Real-time data from MongoDB
const loading = ref(true);
const bookedSeats = ref([]);
const statistics = ref(null);
const totalCapacity = ref(600);

const selectedSeat = ref(null);
const editSeatNumberValue = ref('');
const isSavingSeat = ref(false);
const lastUpdatedId = ref(null);

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


// Generate seat map
const seatMap = computed(() => {
  const rowLetters = 'abcdefghijklmno'.split('');
  
  const generateRows = () => {
    const rows = [];
    for (let i = 0; i < rowLetters.length; i++) {
        const rowLabel = rowLetters[i];
        const rowSeats = [];
        
        for (let group = 1; group <= 20; group++) {
            // Seat 1 (Student)
            const seat1Id = `${rowLabel}.${group}.1`;
            const booking1 = bookedSeats.value.find(b => b.seatNumber === seat1Id);
            
            // Check filters
            const matchesSearch1 = !searchQuery.value || (
               seat1Id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
               booking1?.occupant?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
               booking1?.studentId?.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
            const matchesType1 = !filterType.value || filterType.value === 'student';

            rowSeats.push({
                id: seat1Id,
                row: rowLabel,
                group: group,
                type: 1, // Student
                status: booking1 ? 'occupied' : 'available',
                occupant: booking1 ? booking1.occupant : null,
                studentId: booking1?.studentId,
                isPaid: booking1?.isPaid,
                isVip: false,
                matchesFilter: matchesSearch1 && matchesType1,
                booking: booking1,
                seatNumber: seat1Id,
                seatType: 'student'
            });

            // Seat 2 (Guest)
            const seat2Id = `${rowLabel}.${group}.2`;
            const booking2 = bookedSeats.value.find(b => b.seatNumber === seat2Id);
            
            const matchesSearch2 = !searchQuery.value || (
               seat2Id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
               booking2?.occupant?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
               booking2?.guestName?.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
            const matchesType2 = !filterType.value || filterType.value === 'guest';

            rowSeats.push({
                id: seat2Id,
                row: rowLabel,
                group: group,
                type: 2, // Guest
                status: booking2 ? 'occupied' : 'available',
                occupant: booking2 ? booking2.occupant : (booking1 ? `${booking1.occupant}'s Guest` : null),
                bookingId: booking2?.id,
                isVip: false,
                matchesFilter: matchesSearch2 && matchesType2,
                booking: booking2 || booking1, // Fallback to student booking if guest seat is linked but not yet "booked" as a separate record in some logic
                seatNumber: seat2Id,
                seatType: 'guest',
                studentId: booking1?.studentId
            });
        }
        
        rows.push({
            row: rowLabel.toUpperCase(),
            seats: rowSeats
        });
    }
    return rows;
  };
  
  return [
    { name: 'Ceremony Hall', rows: generateRows() }
  ];
});

const fetchAvailability = async () => {
  try {
    const response = await api.get('/seats');
    if (response.data.success) {
      bookedSeats.value = response.data.data.bookedSeats || [];
      totalCapacity.value = response.data.data.totalCapacity || 600;
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
  }
};

const getProfilePicture = (photo) => {
  if (!photo) return '';
  if (photo.typeof === 'object') return ''; // Avoid object photo
  if (photo.startsWith('http') || photo.startsWith('data:')) return photo;
  return photo.startsWith('/') ? photo : `/${photo}`;
};

// Load data
const loadSeatManagementData = async () => {
  loading.value = true;
  try {
    await fetchAvailability();
    // Statistics can be calculated from bookedSeats
    const booked = bookedSeats.value.length;
    const capacity = totalCapacity.value;
    statistics.value = {
        totalCapacity: capacity,
        totalBooked: booked,
        available: capacity - booked,
        occupancyRate: Math.round((booked / capacity) * 100),
        guestSeats: bookedSeats.value.filter(b => b.seatType === 'guest').length
    };
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
      const updatedId = selectedSeat.value.id;
      toast.success(res.data.message || 'Seat updated!');
      await loadSeatManagementData();
      closeSeatModal();
      
      // Trigger pulse
      lastUpdatedId.value = updatedId;
      setTimeout(() => {
        if (lastUpdatedId.value === updatedId) {
          lastUpdatedId.value = null;
        }
      }, 5000);
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

<style scoped>
/* Custom Scrollbar for Seat Map */
.custom-scrollbar::-webkit-scrollbar {
  height: 16px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 8px;
  border: 4px solid #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: #1e293b;
  border: 4px solid #1e293b;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
  border: 4px solid #1e293b;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #64748b;
}
</style>
