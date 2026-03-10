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
                  <div class="w-8 text-center text-[10px] font-bold text-gray-400">{{ row.row }}</div>

                  <!-- Seats -->
                  <div class="flex gap-1">
                    <div v-for="(seat, sIndex) in row.seats" :key="seat.id" class="flex items-center">
                      <!-- Add gap between pairs -->
                      <div v-if="sIndex > 0 && sIndex % 2 === 0" class="w-2"></div>
                      
                      <button
                        @click="toggleSeat(seat)"
                        :disabled="seat.status === 'occupied' || seat.status === 'reserved'"
                        :class="[
                          'w-10 h-10 rounded text-[8px] leading-tight font-bold transition-all duration-200 flex flex-col items-center justify-center border p-0.5',
                          seat.status === 'occupied' 
                            ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-help dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400' 
                            : isSelected(seat)
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105 z-10'
                                : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400 hover:shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500'
                        ]"
                        :title="seat.occupant || seat.id"
                      >
                        <template v-if="seat.status === 'occupied'">
                           <div class="truncate w-full text-center px-0.5">{{ seat.occupant }}</div>
                           <div class="text-[6px] opacity-60 uppercase">{{ seat.type === 1 ? 'SV' : 'PH' }}</div>
                        </template>
                        <template v-else-if="isSelected(seat)">
                          <span class="material-symbols-outlined text-xs">check</span>
                          <span class="text-[6px]">{{ seat.id }}</span>
                        </template>
                        <template v-else>
                          <span class="opacity-40">{{ seat.id }}</span>
                          <span class="text-[6px] opacity-60">{{ seat.type === 1 ? 'SV' : 'PH' }}</span>
                        </template>
                      </button>
                    </div>
                  </div>

                  <!-- Row Label -->
                  <div class="w-8 text-center text-[10px] font-bold text-gray-400">{{ row.row }}</div>
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
  const rowLetters = 'abcdefghijklmno'.split('');
  
  const generateRows = () => {
    const rows = [];
    for (let i = 0; i < rowLetters.length; i++) {
        const rowLabel = rowLetters[i];
        const rowSeats = [];
        
        // 20 pairs = 40 seats
        for (let group = 1; group <= 20; group++) {
            // Seat 1 (Student)
            const seat1Id = `${rowLabel}.${group}.1`;
            const booking1 = bookedSeats.value.find(b => b.seatNumber === seat1Id);
            rowSeats.push({
                id: seat1Id,
                row: rowLabel,
                group: group,
                type: 1, // Student
                status: booking1 ? 'occupied' : 'available',
                isVip: false // All seats are standardized
            });

            // Seat 2 (Guest)
            const seat2Id = `${rowLabel}.${group}.2`;
            const booking2 = bookedSeats.value.find(b => b.seatNumber === seat2Id);
            rowSeats.push({
                id: seat2Id,
                row: rowLabel,
                group: group,
                type: 2, // Guest
                status: booking2 ? 'occupied' : 'available',
                occupant: booking2 ? booking2.occupant : (booking1 ? `${booking1.occupant}'s Guest` : null),
                isVip: false
            });
        }
        
        rows.push({
            row: rowLabel.toUpperCase(),
            seats: rowSeats
        });
    }
    return rows;
  };
  
  const allRows = generateRows();
  return [
    { name: 'Ceremony Hall', rows: allRows }
  ];
});

const isSelected = (seat) => {
  return selectedSeats.value.some(s => s.id === seat.id);
};

const toggleSeat = (seat) => {
  if (seat.status === 'occupied' || seat.status === 'reserved') return;

  const index = selectedSeats.value.findIndex(s => s.id === seat.id);
  
  if (index > -1) {
    selectedSeats.value.splice(index, 1);
    delete guestInfo.value[seat.id];
  } else {
    // Logic for new selection
    if (seat.type === 1) { // Student seat
        if (hasStudentSeat.value || selectedSeats.value.some(s => s.type === 1)) {
            showError('You can only book one student seat.');
            return;
        }
    } else { // Guest seat
        // Must have a student seat in the same group or already booked
        const myStudentSeat = myBookings.value.find(b => b.seatType === 'student') || selectedSeats.value.find(s => s.type === 1);
        
        if (!myStudentSeat) {
            showError('Please select your student seat (X.Y.1) first.');
            return;
        }

        const [row, group] = myStudentSeat.id ? myStudentSeat.id.split('.') : myStudentSeat.seatNumber.split('.');
        if (seat.row !== row || seat.group !== parseInt(group)) {
            showError(`Please select the guest seat matching your student seat: ${row}.${group}.2`);
            return;
        }

        if (maxGuests.value < 1) {
             showError('Your registration does not include guest seats.');
             return;
        }
        
        if (selectedSeats.value.some(s => s.type === 2)) {
            showError('You can only book one guest seat.');
            return;
        }
    }
    
    selectedSeats.value.push(seat);
    if (seat.type === 2) {
        guestInfo.value[seat.id] = { name: '', relation: '' };
    }
  }
};

const isStudentSeat = (index) => {
    return selectedSeats.value[index].type === 1;
};

const getGuestIndex = (index) => {
    return 1; // Only 1 guest allowed in this logic
};

const clearSelection = () => {
  selectedSeats.value = [];
  guestInfo.value = {};
};

const canSubmit = computed(() => {
    return selectedSeats.value.every((seat) => {
        if (seat.type === 1) return true;
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
    for (const seat of selectedSeats.value) {
        const payload = {
            seatNumber: seat.id,
            seatType: seat.type === 1 ? 'student' : 'guest',
        };
        
        if (seat.type === 2) {
            payload.guestName = guestInfo.value[seat.id].name;
            payload.guestRelation = guestInfo.value[seat.id].relation;
        }

        await api.post('/seats/book', payload);
    }

    showSuccess('Seats booked successfully!');
    await fetchAvailability();
    await fetchMyBookings();
    clearSelection();
  } catch (error) {
    console.error('Booking error:', error);
    showError(error.response?.data?.message || 'Failed to book seats.');
  } finally {
    isSubmitting.value = false;
  }
};

const fetchAvailability = async () => {
  try {
    const response = await api.get('/seats');
    if (response.data.success) {
      bookedSeats.value = response.data.data.bookedSeats || [];
      totalCapacity.value = response.data.data.totalCapacity || 600;
      availableSeats.value = response.data.data.availableSeats || 600;
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
