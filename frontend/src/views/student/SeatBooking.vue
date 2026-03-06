<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('student.ceremony_title')"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      <!-- Header Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button @click="$router.push('/student/dashboard')" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors w-full sm:w-auto">
          <span class="material-symbols-outlined">arrow_back</span>
          <span class="text-sm font-semibold">Back to Dashboard</span>
        </button>
        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div class="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 w-full sm:w-auto text-center">
            <span class="text-sm font-bold">{{ selectedSeats.length }}/{{ maxTotalSeats }} Selected</span>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3 animate-fade-in">
        <span class="material-symbols-outlined text-green-600">check_circle</span>
        <p class="text-green-700 font-medium">{{ successMessage }}</p>
      </div>

      <div v-if="errorMessage" class="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3 animate-fade-in">
        <span class="material-symbols-outlined text-red-600">error</span>
        <p class="text-red-700 font-medium">{{ errorMessage }}</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Total Seats</span>
            <span class="material-symbols-outlined text-gray-400">event_seat</span>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalCapacity }}</p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Available</span>
            <span class="material-symbols-outlined text-green-500">check_circle</span>
          </div>
          <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ availableSeats }}</p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Selected</span>
            <span class="material-symbols-outlined text-blue-500">bookmark</span>
          </div>
          <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ selectedSeats.length }}</p>
        </div>
      </div>

      <!-- Seat Selection Area -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <!-- Legend -->
        <div class="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600"></div>
            <span class="text-gray-600 dark:text-gray-300">Available</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-blue-600 border border-blue-600 flex items-center justify-center text-white">
              <span class="material-symbols-outlined text-[16px]">check</span>
            </div>
            <span class="text-gray-600 dark:text-gray-300">Selected</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 dark:bg-gray-800 dark:border-gray-600">
              <span class="material-symbols-outlined text-[16px]">close</span>
            </div>
            <span class="text-gray-600 dark:text-gray-300">Occupied</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-amber-100 border border-amber-300 dark:bg-amber-900/30 dark:border-amber-700"></div>
            <span class="text-gray-600 dark:text-gray-300">VIP</span>
          </div>
        </div>

        <!-- Stage -->
        <div class="mb-12 flex justify-center">
          <div class="w-2/3 max-w-lg h-16 bg-gray-100 dark:bg-gray-700 rounded-t-[50%] border-t border-x border-gray-200 dark:border-gray-600 flex items-end justify-center pb-4 shadow-sm">
            <span class="text-gray-400 dark:text-gray-500 font-bold tracking-[0.5em] uppercase text-sm">Stage</span>
          </div>
        </div>

        <!-- Seat Map -->
        <!-- Seat Map -->
        <div class="overflow-x-auto pb-8 custom-scrollbar">
          <div class="flex flex-col lg:flex-row gap-12 justify-center min-w-[1000px] px-4">
            <div v-for="stage in seatMap" :key="stage.name" class="flex flex-col items-center">
              <h3 class="mb-6 font-bold text-gray-400 uppercase tracking-[0.2em] text-xs border-b border-gray-200 dark:border-gray-700 pb-2 w-full text-center">{{ stage.name }}</h3>
              
              <div class="flex flex-col gap-1">
                <div 
                  v-for="(row, rIndex) in stage.rows" 
                  :key="row.row" 
                  class="flex items-center gap-3"
                  :class="{ 'mb-6': (rIndex + 1) % 5 === 0 && rIndex !== stage.rows.length - 1 }"
                >
                  <!-- Row Label -->
                  <div class="w-6 text-center text-[10px] font-bold text-gray-400">{{ row.row }}</div>

                  <!-- Seats -->
                  <div class="flex gap-1.5">
                    <button
                      v-for="seat in row.seats"
                      :key="seat.id"
                      @click="toggleSeat(seat)"
                      :disabled="seat.status === 'occupied' || seat.status === 'reserved'"
                      :class="[
                        'w-8 h-8 rounded text-[9px] font-bold transition-all duration-200 flex items-center justify-center',
                        seat.status === 'occupied' 
                          ? 'bg-gray-50 border border-gray-200 text-gray-300 cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-600' 
                          : isSelected(seat)
                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                            : seat.isVip
                              ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 dark:bg-amber-900/10 dark:border-amber-800 dark:text-amber-500'
                              : 'bg-white border border-gray-300 text-gray-600 hover:border-gray-400 hover:shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500'
                      ]"
                    >
                      <span v-if="seat.status === 'occupied'" class="material-symbols-outlined text-xs">close</span>
                      <span v-else-if="isSelected(seat)" class="material-symbols-outlined text-xs">check</span>
                      <span v-else>{{ seat.number }}</span>
                    </button>
                  </div>

                  <!-- Row Label -->
                  <div class="w-6 text-center text-[10px] font-bold text-gray-400">{{ row.row }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Form & My Bookings Grid -->
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Guest Information Form -->
        <div v-if="selectedSeats.length > 0" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <span class="material-symbols-outlined text-gray-900 dark:text-white">people</span>
            </div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Booking Details</h2>
          </div>

          <div class="space-y-6">
            <div
              v-for="(seat, index) in selectedSeats"
              :key="seat.id"
              class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <span class="font-bold text-gray-900 dark:text-white">
                  {{ isStudentSeat(index) ? 'My Seat' : `Guest ${getGuestIndex(index)}` }}
                </span>
                <span class="px-2 py-1 rounded text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 w-fit">
                  Seat {{ seat.id }}
                </span>
              </div>

              <div v-if="isStudentSeat(index)" class="space-y-3">
                 <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Student Name</label>
                  <div class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white">
                    {{ authStore.user?.fullName }}
                  </div>
                 </div>
              </div>

              <div v-else class="space-y-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Guest Name</label>
                  <input
                    v-model="guestInfo[seat.id].name"
                    type="text"
                    placeholder="Enter guest name"
                    class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Relationship</label>
                  <select
                    v-model="guestInfo[seat.id].relation"
                    class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all dark:text-white"
                  >
                    <option value="" disabled selected>Select relationship</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button
              @click="clearSelection"
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmBooking"
              :disabled="!canSubmit || isSubmitting"
              class="flex-1 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <div v-if="isSubmitting" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>Confirm Booking</span>
            </button>
          </div>
        </div>

        <!-- My Bookings List -->
        <div v-if="myBookings.length > 0" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <span class="material-symbols-outlined text-gray-900 dark:text-white">bookmark</span>
            </div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Confirmed Bookings</h2>
          </div>

          <div class="space-y-3">
            <div
              v-for="booking in myBookings"
              :key="booking.id || booking._id"
              class="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center gap-4 w-full sm:w-auto">
                <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center font-bold text-lg text-gray-900 dark:text-white">
                  {{ booking.seatNumber }}
                </div>
                <div class="sm:hidden flex-1">
                  <p class="font-bold text-gray-900 dark:text-white truncate">
                      {{ booking.seatType === 'student' ? 'My Seat' : (booking.guestName || 'Guest') }}
                  </p>
                </div>
              </div>
              <div class="flex-1 w-full min-w-0">
                <p class="hidden sm:block font-bold text-gray-900 dark:text-white truncate">
                    {{ booking.seatType === 'student' ? 'My Seat' : (booking.guestName || 'Guest') }}
                </p>
                <p class="text-sm text-gray-500 truncate mt-1 sm:mt-0" :title="booking.seatType === 'student' ? user?.fullName : (booking.guestRelation || 'Guest')">
                    {{ booking.seatType === 'student' ? user?.fullName : (booking.guestRelation || 'Guest') }}
                </p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span v-if="booking.seatType === 'student'" class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wide">STUDENT</span>
                  <span v-else class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 uppercase tracking-wide">GUEST</span>
                  <span v-if="booking.seatNumber?.startsWith('A')" class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wide">VIP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();
const user = computed(() => authStore.user);

const selectedSeats = ref([]);
const myBookings = ref([]);
const bookedSeats = ref([]);
const guestInfo = ref({});
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const totalCapacity = ref(500);
const availableSeats = ref(500);
const maxGuests = ref(0);

const hasStudentSeat = computed(() => {
    return myBookings.value.some(b => b.seatType === 'student');
});

const totalAllowed = computed(() => maxGuests.value + 1);
const totalBooked = computed(() => myBookings.value.length + selectedSeats.value.length);

const fetchRegistration = async () => {
  try {
    const response = await api.get('/registrations/me');
    if (response.data.success && response.data.data && response.data.data.registration) {
      maxGuests.value = response.data.data.registration.guestCount || 0;
    } else {
      showError('Please complete your ceremony registration first.');
      maxGuests.value = 0;
    }
  } catch (error) {
    console.error('Error fetching registration:', error);
    if (error.response?.status === 404) {
      showError('Please complete your ceremony registration first.');
    }
  }
};

// ... Navigation constants
const navigation = computed(() => [
  { path: '/student/dashboard', icon: 'dashboard', label: t('student.nav_dashboard') },
  { path: '/student/profile', icon: 'person', label: t('student.nav_profile') },
  { path: '/student/ticket', icon: 'qr_code_2', label: t('student.nav_ticket') },
  { path: '/student/seat-booking', icon: 'event_seat', label: t('student.nav_seats') },
  { path: '/student/gown-collection', icon: 'checkroom', label: t('student.nav_gown') },
  { path: '/student/booking-confirmation', icon: 'payments', label: t('student.nav_payments') },
  { path: '/student/chat', icon: 'support_agent', label: t('student.nav_chat') }
]);

const bottomNavigation = computed(() => [
  { path: '/student/dashboard', icon: 'dashboard', label: t('student.nav_home') },
  { path: '/student/ticket', icon: 'qr_code_2', label: t('student.nav_ticket_short') },
  { path: '/student/seat-booking', icon: 'event_seat', label: t('student.nav_seats_short') },
  { path: '/student/profile', icon: 'person', label: t('student.nav_profile') }
]);

// Generate seat map
const seatMap = computed(() => {
  const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const getRowLabel = (i) => {
    if (i < 26) return rowLetters[i];
    const firstLetter = rowLetters[Math.floor((i - 26) / 26)];
    const secondLetter = rowLetters[(i - 26) % 26];
    return firstLetter + secondLetter;
  };

  const generateRows = (startRow, endRow) => {
    const rows = [];
    for (let i = startRow; i <= endRow; i++) {
      const rowLabel = getRowLabel(i);
      
      rows.push({
        row: rowLabel,
        seats: Array.from({ length: 10 }, (_, j) => {
          const seatNumber = `${rowLabel}${j + 1}`;
          const isBooked = bookedSeats.value.includes(seatNumber);
          
          return {
            id: seatNumber,
            row: rowLabel,
            number: j + 1,
            status: isBooked ? 'occupied' : 'available',
            // VIP Logic: First row of every cluster (5 rows) is VIP
            // Rows 0, 5, 10, 15, 20... are VIP
            isVip: i % 5 === 0
          };
        })
      });
    }
    return rows;
  };
  
  return [
    { name: 'Left Wing', rows: generateRows(0, 14) }, // 3 Clusters (15 rows)
    { name: 'Center Stage', rows: generateRows(15, 34) }, // 4 Clusters (20 rows)
    { name: 'Right Wing', rows: generateRows(35, 49) } // 3 Clusters (15 rows)
  ];
});

const isSelected = (seat) => {
  return selectedSeats.value.some(s => s.id === seat.id);
};

const toggleSeat = (seat) => {
  // Direct check against bookedSeats to prevent stale state issues
  if (seat.status === 'occupied' || seat.status === 'reserved' || bookedSeats.value.includes(seat.id)) {
    return;
  }

  const index = selectedSeats.value.findIndex(s => s.id === seat.id);
  
  if (index > -1) {
    selectedSeats.value.splice(index, 1);
    delete guestInfo.value[seat.id];
  } else {
    // Check total booked + selected against limit
    if (totalBooked.value >= totalAllowed.value) {
      showError(`You have reached the maximum booking limit (${totalAllowed.value} seats)`);
      return;
    }
    selectedSeats.value.push(seat);
    // Initialize guest info if it's a guest seat
    guestInfo.value[seat.id] = { name: '', relation: '' };
  }
};

// Helper to check if a specific index in selectedSeats is the student (my) seat
const isStudentSeat = (index) => {
    if (hasStudentSeat.value) return false; // Already booked my seat, so all selections are guests
    return index === 0; // The first selected seat is "My Seat"
};

// Helper to get guest number (offset by 1 if student seat is in mix)
const getGuestIndex = (index) => {
    if (hasStudentSeat.value) return index + 1;
    return index; // If index 0 is student, index 1 is Guest 1. So guest number is index.
};

const clearSelection = () => {
  selectedSeats.value = [];
  guestInfo.value = {};
};

const canSubmit = computed(() => {
    // Check if every selected seat has required info
    return selectedSeats.value.every((seat, index) => {
        if (isStudentSeat(index)) return true; // My seat doesn't need manual input here
        // Guest seat needs name
        return guestInfo.value[seat.id]?.name?.trim();
    });
});

const confirmBooking = async () => {
  if (!canSubmit.value) {
    showError('Please fill in names for all guest seats');
    return;
  }

  isSubmitting.value = true;
  clearMessages();

  try {
    const bookings = selectedSeats.value.map((seat, index) => {
        const isStudent = isStudentSeat(index);
        
        if (isStudent) {
            return {
                seatNumber: seat.id,
                seatType: 'student',
                status: 'confirmed'
            };
        } else {
            return {
                seatNumber: seat.id,
                seatType: 'guest',
                guestName: guestInfo.value[seat.id].name,
                guestRelation: guestInfo.value[seat.id].relation,
                status: 'confirmed'
            };
        }
    });

    for (const booking of bookings) {
      await api.post('/seats/book', booking);
    }

    showSuccess('Seats booked successfully! Your ticket has been updated.');
    await fetchAvailability();
    await fetchMyBookings();
    clearSelection();
  } catch (error) {
    console.error('Booking error:', error);
    showError(error.response?.data?.message || 'Failed to book seats. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

const fetchAvailability = async () => {
  try {
    const response = await api.get('/seats');
    if (response.data.success) {
      const booked = response.data.data.bookedSeats || [];
      bookedSeats.value = booked.map(seat => seat.seatNumber);
      
      totalCapacity.value = response.data.data.totalCapacity || 500;
      availableSeats.value = response.data.data.availableSeats || 500;
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
  }
};

const fetchMyBookings = async () => {
  try {
    const response = await api.get('/seats/my-bookings');
    if (response.data.success) {
      myBookings.value = response.data.data.bookings || [];
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
};

const showSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => { successMessage.value = ''; }, 5000);
};

const showError = (message) => {
  errorMessage.value = message;
  setTimeout(() => { errorMessage.value = ''; }, 5000);
};

const clearMessages = () => {
  successMessage.value = '';
  errorMessage.value = '';
};

onMounted(() => {
  fetchRegistration();
  fetchAvailability();
  fetchMyBookings();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-700 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
</style>
