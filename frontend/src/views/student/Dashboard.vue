<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    page-title="Dashboard"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Modern Hero Section -->
      <div class="relative overflow-hidden rounded-3xl" style="background: linear-gradient(135deg, #003B5C 0%, #00A3E0 50%, #003B5C 100%); min-height: 320px;">
        <!-- Subtle Pattern Overlay -->
        <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
        
        <!-- Content -->
        <div class="relative z-10 p-8 lg:p-10">
          <div class="flex items-start justify-between flex-wrap gap-6">
            <div class="flex-1">
              <!-- Logo & Status Badge -->
              <div class="flex items-center gap-4 mb-5">
                <div class="w-16 h-16 bg-white rounded-2xl p-2 shadow-xl">
                  <img 
                    src="@/assets/images/inprep-partner-logos-06-300x200.png" 
                    alt="Greenwich" 
                    class="w-full h-full object-contain"
                  />
                </div>
                <div class="h-10 w-px bg-white/20"></div>
                <div class="px-4 py-2 rounded-full flex items-center gap-2" style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px);">
                  <span class="w-2 h-2 rounded-full" style="background: #00A651; box-shadow: 0 0 8px #00A651; animation: pulse 2s infinite;"></span>
                  <span class="text-xs font-semibold text-white uppercase tracking-wide">Active Registration</span>
                </div>
              </div>
              
              <!-- Welcome Message -->
              <h1 class="text-3xl lg:text-4xl font-bold text-white mb-3" style="font-family: 'Montserrat', sans-serif; line-height: 1.2;">
                Welcome, {{ user?.fullName || 'Student' }}! 🎓
              </h1>
              <p class="text-blue-100 text-lg mb-6">Graduation Ceremony 2024 • Your Journey Awaits</p>
              
              <!-- Elegant Progress Bar -->
              <div class="max-w-md">
                <div class="flex justify-between items-center mb-3">
                  <span class="text-sm font-semibold text-white">Journey Progress</span>
                  <span class="text-sm font-bold text-white">{{ completedTasks }}/{{ checklist.length }} Completed</span>
                </div>
                <div class="h-2.5 rounded-full overflow-hidden" style="background: rgba(255, 255, 255, 0.2);">
                  <div 
                    class="h-full rounded-full transition-all duration-700 ease-out"
                    style="background: linear-gradient(90deg, #FFB81C 0%, #00A651 100%); box-shadow: 0 0 10px rgba(255, 184, 28, 0.5);"
                    :style="{ width: progressPercentage + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-blue-200 mt-2">{{ progressPercentage }}% Complete</p>
              </div>
            </div>
            
            <!-- Countdown Card - Refined -->
            <div class="rounded-2xl p-6 min-w-[220px]" style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2);">
              <p class="text-xs uppercase tracking-wider mb-3 font-semibold" style="color: #FFB81C;">Ceremony In</p>
              <div class="grid grid-cols-3 gap-3 mb-4">
                <div class="text-center">
                  <div class="text-4xl font-black text-white mb-1">{{ countdown.days }}</div>
                  <p class="text-[10px] uppercase tracking-wider text-blue-200">Days</p>
                </div>
                <div class="text-center">
                  <div class="text-4xl font-black text-white mb-1">{{ countdown.hours }}</div>
                  <p class="text-[10px] uppercase tracking-wider text-blue-200">Hrs</p>
                </div>
                <div class="text-center">
                  <div class="text-4xl font-black text-white mb-1 animate-pulse">{{ countdown.mins }}</div>
                  <p class="text-[10px] uppercase tracking-wider text-blue-200">Min</p>
                </div>
              </div>
              <div class="pt-3 border-t" style="border-color: rgba(255, 255, 255, 0.2);">
                <p class="text-sm font-semibold text-white flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-lg" style="color: #FFB81C;">event</span>
                  June 15, 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards - Modern Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="stat-card group cursor-pointer"
          :style="{ animationDelay: index * 100 + 'ms' }"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="stat-icon" :style="{ background: stat.bgGradient }">
              <span class="material-symbols-outlined text-2xl text-white">{{ stat.icon }}</span>
            </div>
            <span v-if="stat.badge" class="stat-badge" :style="stat.badgeStyle">{{ stat.badge }}</span>
          </div>
          <p class="text-4xl font-black mb-1" style="color: #111827; font-family: 'Montserrat', sans-serif;">{{ stat.value }}</p>
          <p class="text-sm font-medium" style="color: #6b7280;">{{ stat.label }}</p>
          <div class="stat-shine"></div>
        </div>
      </div>

      <!-- Journey & Actions Grid -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Journey Checklist - 2/3 width -->
        <div class="lg:col-span-2 modern-card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold flex items-center gap-3" style="color: #111827; font-family: 'Montserrat', sans-serif;">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #003B5C, #00A3E0);">
                <span class="material-symbols-outlined text-white">checklist</span>
              </div>
              Your Journey
            </h2>
            <div class="px-4 py-2 rounded-full" style="background: rgba(0, 59, 92, 0.08);">
              <span class="text-sm font-bold" style="color: #003B5C;">{{ completedTasks }}/{{ checklist.length }}</span>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="(item, index) in checklist"
              :key="item.label"
              @click="!item.locked && $router.push(item.path)"
              class="journey-item group"
              :class="{
                'journey-locked': item.locked,
                'journey-completed': item.completed,
                'journey-active': !item.locked && !item.completed
              }"
              :style="{ animationDelay: index * 50 + 'ms' }"
            >
              <!-- Step Number & Icon -->
              <div class="flex items-center gap-4">
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-icon" :class="{
                  'step-icon-locked': item.locked,
                  'step-icon-completed': item.completed,
                  'step-icon-active': !item.locked && !item.completed
                }">
                  <span v-if="item.locked" class="material-symbols-outlined text-gray-400">lock</span>
                  <span v-else-if="item.completed" class="material-symbols-outlined text-white">check_circle</span>
                  <span v-else class="material-symbols-outlined text-white">{{ item.icon }}</span>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-base" :class="{
                    'text-gray-400': item.locked,
                    'text-green-600': item.completed,
                    'text-gray-900': !item.locked && !item.completed
                  }">
                    {{ item.label }}
                  </p>
                  <p class="text-sm text-gray-500 truncate mt-0.5">{{ item.description }}</p>
                </div>

                <!-- Action/Badge -->
                <button
                  v-if="!item.completed && !item.locked"
                  class="action-button"
                  @click.stop="$router.push(item.path)"
                >
                  {{ item.action }}
                </button>
                <span v-else-if="item.completed" class="status-badge status-completed">Completed</span>
                <span v-else-if="item.locked" class="status-badge status-locked">Locked</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions - 1/3 width -->
        <div class="modern-card">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-3" style="color: #111827; font-family: 'Montserrat', sans-serif;">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #FFB81C, #f59e0b);">
              <span class="material-symbols-outlined text-white text-xl">bolt</span>
            </div>
            Quick Actions
          </h2>

          <div class="space-y-3">
            <router-link
              v-for="(action, index) in quickActions"
              :key="action.label"
              :to="action.path"
              class="quick-action-item group"
              :style="{ animationDelay: index * 50 + 'ms' }"
            >
              <div class="action-icon" :style="{ background: action.bgGradient }">
                <span class="material-symbols-outlined text-white text-xl">{{ action.icon }}</span>
              </div>
              <span class="font-semibold text-gray-900 group-hover:text-blue-600">{{ action.label }}</span>
              <span class="material-symbols-outlined text-gray-400 group-hover:text-blue-600 ml-auto">arrow_forward</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="modern-card">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-3" style="color: #111827; font-family: 'Montserrat', sans-serif;">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #8b5cf6, #ec4899);">
            <span class="material-symbols-outlined text-white">timeline</span>
          </div>
          Important Dates
        </h2>

        <div class="relative">
          <!-- Timeline Line -->
          <div class="absolute left-6 top-0 bottom-0 w-0.5" style="background: linear-gradient(to bottom, #003B5C, #00A3E0, #FFB81C);"></div>
          
          <div class="space-y-6">
            <div
              v-for="(event, index) in timeline"
              :key="event.title"
              class="relative pl-16 timeline-item"
              :style="{ animationDelay: index * 100 + 'ms' }"
            >
              <!-- Dot -->
              <div class="timeline-dot" :class="{
                'timeline-completed': event.status === 'completed',
                'timeline-active': event.status === 'active',
                'timeline-upcoming': event.status === 'upcoming'
              }">
                <span class="material-symbols-outlined text-white text-xl">{{ event.icon }}</span>
              </div>

              <!-- Content -->
              <div class="timeline-content">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="font-bold text-gray-900">{{ event.title }}</h3>
                  <span class="timeline-badge" :style="event.badgeStyle">{{ event.badge }}</span>
                </div>
                <p class="text-sm text-gray-600 mb-3">{{ event.description }}</p>
                <div class="flex items-center gap-4 text-xs text-gray-500">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm">calendar_month</span>
                    <span>{{ event.date }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm">schedule</span>
                    <span>{{ event.time }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm">location_on</span>
                    <span>{{ event.location }}</span>
                  </div>
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
import { ref, computed, onMounted, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

// Journey tracking data
const registrationData = ref(null);
const ticketData = ref(null);
const seatData = ref(null);
const loading = ref(true);

// Countdown
const countdown = ref({ days: 0, hours: 0, mins: 0 });

const updateCountdown = () => {
  const ceremony = new Date('2024-06-15T09:00:00');
  const now = new Date();
  const diff = ceremony - now;

  if (diff > 0) {
    countdown.value = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    };
  }
};

// Load journey progress
const loadJourneyProgress = async () => {
  loading.value = true;
  try {
    // Load registration
    try {
      const regRes = await api.get('/registrations/me');
      if (regRes.data.success) {
        registrationData.value = regRes.data.data.registration;
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Error loading registration:', err);
      }
    }

    // Load ticket
    try {
      const ticketRes = await api.get('/tickets/me');
      if (ticketRes.data.success && ticketRes.data.data.tickets.length > 0) {
        ticketData.value = ticketRes.data.data.tickets[0];
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Error loading ticket:', err);
      }
    }

    // Load seats
    try {
      const seatsRes = await api.get('/seats/my-bookings');
      if (seatsRes.data.success) {
        seatData.value = seatsRes.data.data;
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Error loading seats:', err);
      }
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  updateCountdown();
  setInterval(updateCountdown, 60000);
  loadJourneyProgress();
});

// Reload data when navigating back to Dashboard
onActivated(() => {
  loadJourneyProgress();
});

// Navigation - Simplified and organized by flow
const navigation = [
  { path: '/student/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/student/profile', icon: 'person', label: 'My Profile' },
  { path: '/student/ticket', icon: 'qr_code_2', label: 'My Ticket' },
  { path: '/student/seat-booking', icon: 'event_seat', label: 'Guest Seats' },
  { path: '/student/gown-collection', icon: 'checkroom', label: 'Gown Collection' },
  { path: '/student/booking-confirmation', icon: 'payments', label: 'Payments' }
];

const bottomNavigation = [
  { path: '/student/dashboard', icon: 'dashboard', label: 'Home' },
  { path: '/student/ticket', icon: 'qr_code_2', label: 'Ticket' },
  { path: '/student/seat-booking', icon: 'event_seat', label: 'Seats' },
  { path: '/student/profile', icon: 'person', label: 'Profile' }
];

// Journey
const checklist = computed(() => {
  return [
    {
      label: 'Complete Registration',
      description: 'Fill in your graduation details and preferences',
      completed: !!registrationData.value,
      path: '/student/registration',
      action: 'Start',
      icon: 'edit_document',
      locked: false
    },
    {
      label: 'Generate E-Ticket',
      description: 'Get your digital entry pass with QR code',
      completed: !!ticketData.value,
      path: '/student/ticket',
      action: 'Generate',
      icon: 'qr_code_2',
      locked: !registrationData.value
    },
    {
      label: 'Book Guest Seats',
      description: 'Reserve up to 3 seats for family members',
      completed: !!seatData.value && seatData.value.length > 0,
      path: '/student/seat-booking',
      action: 'Book Now',
      icon: 'event_seat',
      locked: !ticketData.value
    },
    {
      label: 'Collect Graduation Gown',
      description: 'Request and schedule gown collection',
      completed: registrationData.value?.gownCollected || false,
      path: '/student/gown-collection',
      action: 'Request',
      icon: 'checkroom',
      locked: !seatData.value || seatData.value.length === 0
    },
    {
      label: 'Complete Payment',
      description: 'Pay for packages and services',
      completed: false, // Will be updated when payment module is ready
      path: '/student/booking-confirmation',
      action: 'Pay Now',
      icon: 'payments',
      locked: !registrationData.value?.gownCollected
    }
  ];
});

const completedTasks = computed(() => checklist.value.filter(item => item.completed).length);
const progressPercentage = computed(() => Math.round((completedTasks.value / checklist.value.length) * 100));

// Stats
const stats = [
  {
    icon: 'how_to_reg',
    value: 'Done',
    label: 'Registration',
    badge: '✓',
    badgeStyle: 'background: #00A651; color: white; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;',
    bgGradient: 'linear-gradient(135deg, #00A651 0%, #16a34a 100%)'
  },
  {
    icon: 'confirmation_number',
    value: '1',
    label: 'Tickets',
    bgGradient: 'linear-gradient(135deg, #00A3E0 0%, #0891b2 100%)'
  },
  {
    icon: 'event_seat',
    value: '3',
    label: 'Seats Booked',
    bgGradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
  },
  {
    icon: 'checkroom',
    value: 'Pending',
    label: 'Gown Status',
    bgGradient: 'linear-gradient(135deg, #FFB81C 0%, #f59e0b 100%)'
  },
  {
    icon: 'schedule',
    value: countdown.days,
    label: 'Days Left',
    badge: 'SOON',
    badgeStyle: 'background: #f97316; color: white; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;',
    bgGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
  }
];

// Quick Actions
const quickActions = [
  {
    icon: 'qr_code_2',
    label: 'View QR Code',
    path: '/student/ticket',
    bgGradient: 'linear-gradient(135deg, #00A3E0, #0891b2)'
  },
  {
    icon: 'shopping_bag',
    label: 'Book Packages',
    path: '/student/booking-confirmation',
    bgGradient: 'linear-gradient(135deg, #003B5C, #00A3E0)'
  },
  {
    icon: 'payments',
    label: 'My Payments',
    path: '/student/payment',
    bgGradient: 'linear-gradient(135deg, #00A651, #16a34a)'
  },
  {
    icon: 'person',
    label: 'Edit Profile',
    path: '/student/profile',
    bgGradient: 'linear-gradient(135deg, #FFB81C, #f59e0b)'
  }
];

// Timeline
const timeline = [
  {
    title: 'Registration Opens',
    description: 'Online registration portal available',
    date: 'May 1, 2024',
    time: '9:00 AM',
    location: 'Online',
    icon: 'app_registration',
    status: 'completed',
    badge: 'COMPLETED',
    badgeStyle: 'background: #00A651; color: white; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700;'
  },
  {
    title: 'Gown Collection Period',
    description: 'Collect your graduation gown from main office',
    date: 'May 20 - Jun 10',
    time: '9 AM - 5 PM',
    location: 'Building A, Room 101',
    icon: 'checkroom',
    status: 'active',
    badge: 'ACTIVE',
    badgeStyle: 'background: #FFB81C; color: white; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700;'
  },
  {
    title: 'Rehearsal Day',
    description: 'Mandatory rehearsal for all graduates',
    date: 'June 14, 2024',
    time: '2:00 PM',
    location: 'Main Hall',
    icon: 'groups',
    status: 'upcoming',
    badge: 'UPCOMING',
    badgeStyle: 'background: #00A3E0; color: white; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700;'
  },
  {
    title: 'Graduation Ceremony',
    description: 'The big day! Arrive 30 minutes early',
    date: 'June 15, 2024',
    time: '9:00 AM',
    location: 'University Arena',
    icon: 'school',
    status: 'upcoming',
    badge: 'UPCOMING',
    badgeStyle: 'background: #003B5C; color: white; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700;'
  }
];
</script>

<style scoped>
/* Modern Card */
.modern-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
}

.modern-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
}

/* Stat Cards */
.stat-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #f3f4f6;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}

.stat-badge {
  display: inline-block;
  animation: badge-pulse 2s ease-in-out infinite;
}

.stat-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.stat-card:hover .stat-shine {
  left: 100%;
}

/* Journey Items */
.journey-item {
  padding: 20px;
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.journey-active {
  background: white;
  border-color: #e5e7eb;
}

.journey-active:hover {
  border-color: #00A3E0;
  box-shadow: 0 4px 12px rgba(0, 163, 224, 0.1);
  transform: translateX(4px);
}

.journey-completed {
  background: linear-gradient(135deg, rgba(0, 166, 81, 0.05), rgba(22, 163, 74, 0.05));
  border-color: #00A651;
}

.journey-locked {
  background: #f9fafb;
  border-color: #e5e7eb;
  cursor: not-allowed;
  opacity: 0.6;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: #6b7280;
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.step-icon-completed {
  background: linear-gradient(135deg, #00A651, #16a34a);
  box-shadow: 0 4px 12px rgba(0, 166, 81, 0.3);
}

.step-icon-active {
  background: linear-gradient(135deg, #00A3E0, #0891b2);
  box-shadow: 0 4px 12px rgba(0, 163, 224, 0.3);
}

.step-icon-locked {
  background: #e5e7eb;
}

.action-button {
  padding: 8px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #003B5C, #00A3E0);
  color: white;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 59, 92, 0.4);
}

.status-badge {
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-completed {
  background: rgba(0, 166, 81, 0.15);
  color: #00A651;
}

.status-locked {
  background: #f3f4f6;
  color: #9ca3af;
}

/* Quick Actions */
.quick-action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  text-decoration: none;
}

.quick-action-item:hover {
  background: white;
  border-color: #00A3E0;
  box-shadow: 0 4px 12px rgba(0, 163, 224, 0.1);
  transform: translateX(4px);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.quick-action-item:hover .action-icon {
  transform: scale(1.1);
}

/* Timeline */
.timeline-item {
  opacity: 0;
  animation: slide-in 0.5s ease forwards;
}

.timeline-dot {
  position: absolute;
  left: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.timeline-completed {
  background: linear-gradient(135deg, #00A651, #16a34a);
}

.timeline-active {
  background: linear-gradient(135deg, #FFB81C, #f59e0b);
  animation: pulse-glow 2s ease-in-out infinite;
}

.timeline-upcoming {
  background: #e5e7eb;
}

.timeline-content {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.timeline-item:hover .timeline-content {
  background: white;
  border-color: #00A3E0;
  box-shadow: 0 4px 12px rgba(0, 163, 224, 0.1);
}

.timeline-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 184, 28, 0.7); }
  50% { box-shadow: 0 0 0 10px rgba(255, 184, 28, 0); }
}

@keyframes badge-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
