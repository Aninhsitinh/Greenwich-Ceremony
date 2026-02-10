<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark pb-24">
    <!-- Premium Header -->
    <div class="sticky top-0 z-50 glass border-b border-white/10">
      <div class="flex items-center justify-between p-4 max-w-4xl mx-auto">
        <button @click="$router.back()" class="icon-container bg-primary/10 hover:bg-primary hover:text-white transition-all">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div class="text-center">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Seat Booking</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">FPT Greenwich Graduation 2024</p>
        </div>
        <div class="badge badge-info">
          {{ selectedSeats.length }}/{{ maxGuests }}
        </div>
      </div>
    </div>

    <div class="p-4 max-w-4xl mx-auto">
      <!-- Premium Info Banner -->
      <div class="relative overflow-hidden glass-card p-5 mb-6">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
        <div class="relative z-10 flex items-center gap-4">
          <div class="icon-container icon-container-lg bg-gradient-to-br from-primary to-purple-500 text-white flex-shrink-0">
            <span class="material-symbols-outlined text-2xl">info</span>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white mb-1">Guest Seating</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Select up to <span class="font-semibold text-primary">{{ maxGuests }} seats</span> for your family and friends
            </p>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <Transition name="slide-up">
        <div v-if="successMessage" class="mb-4 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3">
          <span class="material-symbols-outlined text-green-600">check_circle</span>
          <p class="text-green-700 dark:text-green-400">{{ successMessage }}</p>
        </div>
      </Transition>

      <Transition name="slide-up">
        <div v-if="errorMessage" class="mb-4 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
          <span class="material-symbols-outlined text-red-600">error</span>
          <p class="text-red-700 dark:text-red-400">{{ errorMessage }}</p>
        </div>
      </Transition>

      <!-- Stats Cards -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="glass-card p-5 text-center hover-lift">
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalCapacity }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Seats</p>
        </div>
        <div class="glass-card p-5 text-center hover-lift">
          <p class="text-3xl font-bold text-green-600">{{ availableSeats }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Available</p>
        </div>
        <div class="glass-card p-5 text-center hover-lift">
          <p class="text-3xl font-bold text-primary">{{ selectedSeats.length }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Selected</p>
        </div>
      </div>

      <!-- Stage Visualization -->
      <div class="relative mb-8">
        <div class="bg-gradient-to-b from-primary/20 to-transparent rounded-t-3xl p-6">
          <div class="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white text-center py-4 px-8 rounded-2xl shadow-lg shadow-primary/30 max-w-md mx-auto">
            <span class="material-symbols-outlined text-3xl mb-1">school</span>
            <p class="text-sm font-bold uppercase tracking-wider">Stage</p>
          </div>
        </div>
      </div>

      <!-- Interactive Seat Map -->
      <div class="glass-card p-6 mb-6 overflow-x-auto">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">grid_view</span>
          Select Your Seats
        </h3>

        <!-- Seat Grid -->
        <div class="min-w-[400px]">
          <div v-for="row in seatMap" :key="row.row" class="flex items-center gap-2 mb-3">
            <!-- Row Label -->
            <div class="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-400">
              {{ row.row }}
            </div>
            
            <!-- Seats -->
            <div class="flex-1 flex justify-center gap-2">
              <button
                v-for="seat in row.seats"
                :key="seat.id"
                @click="toggleSeat(seat)"
                :disabled="seat.status === 'occupied' || seat.status === 'reserved'"
                :class="getSeatClass(seat)"
              >
                <span v-if="seat.status === 'occupied'" class="material-symbols-outlined text-xs">close</span>
                <span v-else-if="isSelected(seat)" class="material-symbols-outlined text-xs">check</span>
                <span v-else class="text-[10px]">{{ seat.number }}</span>
              </button>
              
              <!-- Aisle Gap -->
              <div v-if="row.hasAisle" class="w-6"></div>
            </div>
            
            <!-- Row Label (right) -->
            <div class="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-400">
              {{ row.row }}
            </div>
          </div>
        </div>

        <!-- Seat Legend -->
        <div class="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <div class="seat seat-available w-6 h-6"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400">Available</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="seat seat-selected w-6 h-6">
              <span class="material-symbols-outlined text-xs">check</span>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400">Selected</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="seat seat-occupied w-6 h-6">
              <span class="material-symbols-outlined text-xs">close</span>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400">Occupied</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="seat seat-vip w-6 h-6"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400">VIP</span>
          </div>
        </div>
      </div>

      <!-- My Bookings -->
      <div class="glass-card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">bookmark</span>
            My Bookings
          </h3>
          <span class="badge badge-info">{{ myBookings.length }}</span>
        </div>
        
        <div v-if="myBookings.length === 0" class="text-center py-10">
          <div class="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-4xl text-gray-400">event_seat</span>
          </div>
          <p class="text-gray-500 dark:text-gray-400">No bookings yet</p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Select seats from the map above</p>
        </div>

        <div v-else class="space-y-3">
          <div 
            v-for="booking in myBookings" 
            :key="booking._id" 
            class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover-lift"
          >
            <div class="flex items-center gap-4">
              <div :class="[
                'icon-container',
                booking.seatType === 'student' 
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500',
                'text-white'
              ]">
                <span class="material-symbols-outlined">{{ booking.seatType === 'student' ? 'school' : 'person' }}</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white">Seat {{ booking.seatNumber }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {{ booking.seatType }}
                  <span v-if="booking.guestName"> • {{ booking.guestName }}</span>
                </p>
              </div>
            </div>
            <button 
              @click="cancelBooking(booking._id)" 
              class="icon-container bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-500 hover:text-white transition-all"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Guest Information Form -->
      <Transition name="scale-fade">
        <div v-if="selectedSeats.length > 0" class="glass-card p-6 mb-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">person_add</span>
            Guest Information
          </h3>

          <div v-for="(seat, index) in selectedSeats" :key="seat.id" class="mb-6 last:mb-0">
            <div class="flex items-center gap-3 mb-4">
              <div class="badge badge-info">{{ seat.row }}{{ seat.number }}</div>
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Guest {{ index + 1 }}</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                <input
                  v-model="guestForms[seat.id].name"
                  type="text"
                  required
                  placeholder="Enter guest name"
                  class="input"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Relationship</label>
                <select v-model="guestForms[seat.id].relation" class="input">
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone (Optional)</label>
                <input
                  v-model="guestForms[seat.id].phone"
                  type="tel"
                  placeholder="0901234567"
                  class="input"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Fixed Bottom Action Bar -->
    <Transition name="slide-up">
      <div v-if="selectedSeats.length > 0" class="fixed bottom-0 left-0 right-0 z-50">
        <div class="glass border-t border-white/10 p-4">
          <div class="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Selected Seats</p>
              <p class="font-bold text-gray-900 dark:text-white">
                {{ selectedSeats.map(s => `${s.row}${s.number}`).join(', ') }}
              </p>
            </div>
            <button
              @click="handleBookSeats"
              :disabled="loading || !isFormValid"
              class="btn btn-primary px-8"
            >
              <span v-if="!loading" class="flex items-center gap-2">
                Confirm Booking
                <span class="material-symbols-outlined">arrow_forward</span>
              </span>
              <div v-else class="spinner"></div>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const myBookings = ref([]);
const totalCapacity = ref(500);
const availableSeats = ref(450);
const maxGuests = ref(3);
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const selectedSeats = ref([]);
const guestForms = reactive({});

// Generate seat map
const seatMap = computed(() => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return rows.map(row => ({
    row,
    hasAisle: true,
    seats: Array.from({ length: 10 }, (_, i) => ({
      id: `${row}${i + 1}`,
      row,
      number: i + 1,
      status: Math.random() > 0.7 ? 'occupied' : 'available',
      isVip: row === 'A'
    }))
  }));
});

const getSeatClass = (seat) => {
  let classes = ['seat', 'transition-all'];
  
  if (seat.status === 'occupied') {
    classes.push('seat-occupied');
  } else if (isSelected(seat)) {
    classes.push('seat-selected');
  } else if (seat.isVip) {
    classes.push('seat-vip', 'hover:scale-110');
  } else {
    classes.push('seat-available', 'hover:scale-110');
  }
  
  return classes.join(' ');
};

const isSelected = (seat) => {
  return selectedSeats.value.some(s => s.id === seat.id);
};

const toggleSeat = (seat) => {
  if (seat.status === 'occupied') return;
  
  const index = selectedSeats.value.findIndex(s => s.id === seat.id);
  
  if (index > -1) {
    selectedSeats.value.splice(index, 1);
    delete guestForms[seat.id];
  } else if (selectedSeats.value.length < maxGuests.value) {
    selectedSeats.value.push(seat);
    guestForms[seat.id] = { name: '', relation: 'parent', phone: '' };
  } else {
    errorMessage.value = `Maximum ${maxGuests.value} seats allowed`;
    setTimeout(() => { errorMessage.value = ''; }, 3000);
  }
};

const isFormValid = computed(() => {
  return selectedSeats.value.every(seat => guestForms[seat.id]?.name?.trim());
});

const fetchAvailability = async () => {
  try {
    const response = await api.get('/seats');
    if (response.data.success) {
      totalCapacity.value = response.data.data.totalCapacity;
      availableSeats.value = response.data.data.availableSeats;
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
  }
};

const fetchMyBookings = async () => {
  try {
    const response = await api.get('/seats/my-bookings');
    if (response.data.success) {
      myBookings.value = response.data.data.bookings;
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
};

const handleBookSeats = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    let bookedCount = 0;
    
    for (const seat of selectedSeats.value) {
      try {
        await api.post('/seats/book', {
          seatType: 'guest',
          seatNumber: `${seat.row}${seat.number}`,
          guestName: guestForms[seat.id].name,
          guestRelation: guestForms[seat.id].relation,
          guestPhone: guestForms[seat.id].phone
        });
        bookedCount++;
      } catch (err) {
        // Skip seats that are already booked
        if (err.response?.status === 400 && err.response?.data?.message?.includes('already booked')) {
          console.log(`Seat ${seat.row}${seat.number} already booked, skipping...`);
        } else {
          throw err; // Re-throw other errors
        }
      }
    }
    
    if (bookedCount > 0) {
      successMessage.value = `Successfully booked ${bookedCount} seat${bookedCount > 1 ? 's' : ''}! Redirecting to Dashboard...`;
      
      // Redirect to Dashboard after 2 seconds
      setTimeout(() => {
        router.push('/student/dashboard');
      }, 2000);
    } else {
      errorMessage.value = 'All selected seats are already booked. Please select different seats.';
    }
    
    selectedSeats.value = [];
    Object.keys(guestForms).forEach(key => delete guestForms[key]);
    
    await fetchMyBookings();
    await fetchAvailability();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to book seats. Please try again.';
  } finally {
    loading.value = false;
  }
};

const cancelBooking = async (bookingId) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return;

  try {
    await api.delete(`/seats/${bookingId}`);
    successMessage.value = 'Booking cancelled successfully.';
    await fetchMyBookings();
    await fetchAvailability();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to cancel booking.';
  }
};

onMounted(() => {
  fetchAvailability();
  fetchMyBookings();
});
</script>

<style scoped>
/* Enhanced seat styles */
.seat {
  @apply w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-semibold cursor-pointer border-2 border-transparent;
}

.seat-available {
  @apply bg-primary/10 text-primary hover:bg-primary/30 hover:border-primary;
}

.seat-selected {
  @apply bg-gradient-to-br from-primary to-purple-600 text-white border-primary shadow-lg shadow-primary/30 scale-105;
}

.seat-occupied {
  @apply bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed;
}

.seat-vip {
  @apply bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-300;
}
</style>
