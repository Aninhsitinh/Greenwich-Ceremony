<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('student.dashboard')"
  >
    <!-- Celebration Trigger -->
    <Celebration :trigger="progressPercentage === 100" />

    <div class="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Hero Section -->
      <div class="glass-card mesh-gradient animate-mesh p-8 border-none overflow-hidden relative group">
        <!-- Subtle noise overlay for texture -->
        <div class="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div class="flex items-start justify-between flex-wrap gap-6">
          <div class="flex-1">
            <!-- Logo & Status Badge -->
            <div class="flex items-center gap-4 mb-5">
              <div class="w-16 h-16 p-2">
                <img 
                  src="@/assets/images/university-of-greenwich.jpg" 
                  alt="Greenwich" 
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="h-10 w-px bg-gray-200 dark:bg-gray-700"></div>
              <div class="px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2 neon-glow-success">
                <span class="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                <span class="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">{{ $t('student.active_registration') }}</span>
              </div>
            </div>
            
            <!-- Welcome Message -->
            <h1 class="text-4xl font-extrabold text-white mb-2 drop-shadow-md">
              {{ $t('student.welcome') }}, {{ user?.fullName || 'Student' }}!
            </h1>
            <p class="text-white/80 text-lg mb-6 drop-shadow-sm font-medium">{{ $t('student.graduation_ceremony') }}</p>
            
            <!-- Progress Bar -->
            <div class="max-w-md bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-bold text-white">{{ $t('student.journey_progress') }}</span>
                <span class="text-sm font-medium text-white/90">{{ completedTasks }}/{{ checklist.length }} {{ $t('student.steps') }}</span>
              </div>
              <div class="h-2.5 rounded-full bg-white/20 overflow-hidden relative">
                <div 
                  class="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-1000 ease-out neon-glow-info"
                  :style="{ width: progressPercentage + '%' }"
                ></div>
              </div>
              <p class="text-xs text-white/70 mt-2 font-bold tracking-tight">{{ progressPercentage }}% {{ $t('student.complete') }}</p>
            </div>
          </div>
          
          <!-- Countdown Card -->
          <div class="glass-card p-6 min-w-[220px] border-white/20 text-center relative z-10">
            <p class="text-xs uppercase tracking-[0.2em] mb-4 font-black text-white/60 drop-shadow-sm">{{ $t('student.ceremony_in') }}</p>
            <div class="grid grid-cols-3 gap-3 mb-4">
              <div class="text-center group-hover:scale-110 transition-transform duration-500">
                <div class="text-4xl font-black text-white mb-1 drop-shadow-lg">{{ countdown.days }}</div>
                <p class="text-[10px] uppercase tracking-widest text-white/60 font-bold">{{ $t('student.days') }}</p>
              </div>
              <div class="text-center group-hover:scale-110 transition-transform duration-500 delay-75">
                <div class="text-4xl font-black text-white mb-1 drop-shadow-lg">{{ countdown.hours }}</div>
                <p class="text-[10px] uppercase tracking-widest text-white/60 font-bold">{{ $t('student.hours') }}</p>
              </div>
              <div class="text-center group-hover:scale-110 transition-transform duration-500 delay-150">
                <div class="text-4xl font-black text-white mb-1 drop-shadow-lg">{{ countdown.mins }}</div>
                <p class="text-[10px] uppercase tracking-widest text-white/60 font-bold">{{ $t('student.mins') }}</p>
              </div>
            </div>
            <div class="pt-4 border-t border-white/20">
              <p class="text-sm font-black text-white flex items-center justify-center gap-2 drop-shadow-sm">
                <span class="material-symbols-outlined text-white text-lg">event</span>
                {{ ceremonyDate ? new Date(ceremonyDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Loading...' }}
              </p>
            </div>
          </div>
        </div>
      </div>



      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <template v-if="loading">
          <div v-for="i in 5" :key="i" class="glass-card p-5 h-28 flex flex-col justify-between border-transparent">
            <SkeletonLoader width="32px" height="32px" />
            <SkeletonLoader width="100%" height="20px" />
          </div>
        </template>
        <template v-else>
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="glass-card p-5 hover-lift group border-transparent"
          >
            <div class="flex items-start justify-between mb-3">
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                :class="stat.iconBgClass"
              >
                <span class="material-symbols-outlined text-xl">{{ stat.icon }}</span>
              </div>
              <span v-if="stat.badge" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" :class="stat.badgeClass">{{ stat.badge }}</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ stat.value }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ stat.label }}</p>
          </div>
        </template>
      </div>



      <!-- Journey Checklist -->
      <div class="flex flex-col gap-6">
        <div class="glass-card p-6 border-transparent">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span class="material-symbols-outlined text-gray-900 dark:text-white">checklist</span>
              Your Journey
            </h2>
            <div class="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700">
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ completedTasks }}/{{ checklist.length }}</span>
            </div>
          </div>

          <div class="space-y-3">
            <template v-if="loading">
               <div v-for="i in 5" :key="i" class="p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 flex items-center gap-4">
                  <SkeletonLoader width="32px" height="32px" variant="circle" />
                  <SkeletonLoader width="40px" height="40px" />
                  <div class="flex-1 space-y-2">
                    <SkeletonLoader width="60%" height="16px" />
                    <SkeletonLoader width="40%" height="12px" />
                  </div>
               </div>
            </template>
            <template v-else>
              <div
                v-for="item in checklist"
                :key="item.label"
                @click="!item.locked && $router.push(item.path)"
                class="group p-4 rounded-2xl border-2 transition-all relative overflow-hidden"
                :class="[
                  item.locked 
                    ? 'bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-60 cursor-not-allowed' 
                    : item.completed
                      ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-800/50 hover:border-green-200 cursor-pointer'
                      : 'bg-white/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                ]"
              >
                <!-- Background progress line for the whole list (visual only) -->
                <div v-if="checklist.indexOf(item) !== checklist.length - 1" class="absolute left-[2.25rem] top-12 bottom-0 w-1 bg-gray-100 dark:bg-gray-800 z-0 hidden md:block"></div>
                <div class="flex items-center gap-4">
                  <div class="w-8 h-8 rounded flex items-center justify-center font-bold text-sm" 
                    :class="item.completed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'">
                    {{ checklist.indexOf(item) + 1 }}
                  </div>
                  
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 shadow-lg" :class="{
                    'bg-primary text-white': !item.locked && !item.completed,
                    'bg-green-500 text-white shadow-green-500/20': item.completed,
                    'bg-gray-200 text-gray-400 dark:bg-gray-700': item.locked
                  }">
                    <span v-if="item.locked" class="material-symbols-outlined text-xl">lock</span>
                    <span v-else-if="item.completed" class="material-symbols-outlined text-xl">check</span>
                    <span v-else class="material-symbols-outlined text-xl">{{ item.icon }}</span>
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-base" :class="{
                      'text-gray-900 dark:text-white': !item.locked,
                      'text-gray-500 dark:text-gray-500': item.locked,
                      'text-green-600 dark:text-green-400': item.completed
                    }">
                      {{ item.label }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">{{ item.description }}</p>
                  </div>

                  <button
                    v-if="!item.completed && !item.locked"
                    class="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold transition-colors"
                    @click.stop="$router.push(item.path)"
                  >
                    {{ item.action }}
                  </button>
                  <div v-else-if="item.completed" class="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                    <span>Completed</span>
                    <span class="material-symbols-outlined text-sm">check_circle</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="registrationData" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
            <span class="material-symbols-outlined text-gray-900 dark:text-white">inventory_2</span>
            Item Collection Status
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              @click="toggleCollection('invitation')"
              :disabled="updatingCollection"
              class="group/item p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left w-full"
              :class="registrationData.invitationCollected 
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50 hover:border-emerald-200' 
                : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-emerald-200'">
              <div class="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover/item:scale-110"
                :class="registrationData.invitationCollected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'">
                <span class="material-symbols-outlined text-2xl">{{ registrationData.invitationCollected ? 'check_circle' : 'mail' }}</span>
              </div>
              <div class="flex-1">
                <p class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Invitation Card</p>
                <p class="font-black text-lg" :class="registrationData.invitationCollected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'">
                  {{ registrationData.invitationCollected ? 'YES' : 'NO' }}
                </p>
              </div>
              <div class="flex flex-col items-center gap-1">
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                  :class="registrationData.invitationCollected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 dark:border-gray-600'">
                  <span class="material-symbols-outlined text-[14px]" v-if="registrationData.invitationCollected">check</span>
                </div>
                <span class="text-[8px] font-bold uppercase tracking-tighter" :class="registrationData.invitationCollected ? 'text-emerald-500' : 'text-gray-400'">
                  {{ registrationData.invitationCollected ? 'Collected' : 'Pending' }}
                </span>
              </div>
            </button>

            <!-- Wristband -->
            <button 
              @click="toggleCollection('wristband')"
              :disabled="updatingCollection"
              class="group/item p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left w-full"
              :class="registrationData.wristbandCollected 
                ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50 hover:border-blue-200' 
                : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-blue-200'">
              <div class="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover/item:scale-110"
                :class="registrationData.wristbandCollected ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'">
                <span class="material-symbols-outlined text-2xl">{{ registrationData.wristbandCollected ? 'check_circle' : 'watch' }}</span>
              </div>
              <div class="flex-1">
                <p class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Wristband</p>
                <p class="font-black text-lg" :class="registrationData.wristbandCollected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'">
                  {{ registrationData.wristbandCollected ? 'YES' : 'NO' }}
                </p>
              </div>
              <div class="flex flex-col items-center gap-1">
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                  :class="registrationData.wristbandCollected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 dark:border-gray-600'">
                  <span class="material-symbols-outlined text-[14px]" v-if="registrationData.wristbandCollected">check</span>
                </div>
                <span class="text-[8px] font-bold uppercase tracking-tighter" :class="registrationData.wristbandCollected ? 'text-blue-500' : 'text-gray-400'">
                  {{ registrationData.wristbandCollected ? 'Collected' : 'Pending' }}
                </span>
              </div>
            </button>
          </div>

          <div v-if="registrationData.collectionConfirmedAt" class="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <span class="material-symbols-outlined text-gray-400 text-sm">info</span>
            <p class="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
              Confirmed on {{ formatDate(registrationData.collectionConfirmedAt) }} by {{ registrationData.collectionConfirmedBy?.fullName || 'Self Confirmed' }}
            </p>
          </div>
        </div>

        <!-- Refund Status (Back Phí) -->
        <div v-if="registrationData && registrationData.isDepositRefunded" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
            <span class="material-symbols-outlined text-emerald-600">payments</span>
            Deposit Refund Status (Back Phí)
          </h2>
          
          <div class="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-800/50 flex flex-col md:flex-row items-center gap-6">
            <div class="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span class="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <div class="flex-1 text-center md:text-left">
              <p class="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">Refund Completed</p>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white">
                {{ formatCurrency(registrationData.refundAmount) }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                Successfully processed on {{ formatDate(registrationData.refundDate) }}
              </p>
            </div>
            <div class="px-6 py-3 bg-white dark:bg-gray-800 rounded-xl border border-emerald-200 dark:border-emerald-800 font-bold text-emerald-700 dark:text-emerald-400">
              SUCCESS
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
          <span class="material-symbols-outlined text-gray-900 dark:text-white">calendar_month</span>
          Important Dates
        </h2>

        <div class="grid md:grid-cols-4 gap-6">
          <div
            v-for="(event, index) in timeline"
            :key="event.title"
            class="relative p-4 rounded-lg border transition-all"
            :class="[
              event.status === 'completed' ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800' : 
              event.status === 'active' ? 'bg-white dark:bg-gray-800 border-gray-900 dark:border-white ring-1 ring-gray-900 dark:ring-white' :
              'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            ]"
          >
            <!-- Badge -->
            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-3" :class="event.badgeClass">
              {{ event.badge }}
            </span>
            
            <h3 class="font-bold text-gray-900 dark:text-white mb-1">{{ event.title }}</h3>
            <p class="text-xs text-gray-500 mb-3">{{ event.description }}</p>
            
            <div class="flex flex-col gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">calendar_today</span>
                <span>{{ event.date }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">schedule</span>
                <span>{{ event.time }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">location_on</span>
                <span>{{ event.location }}</span>
              </div>
              <a 
                v-if="event.mapLink" 
                :href="event.mapLink" 
                target="_blank" 
                class="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline mt-1"
              >
                <span class="material-symbols-outlined text-sm">map</span>
                View Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>


  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import api from '@/services/api';
import socketService from '@/services/socketService';
import Celebration from '@/components/Celebration.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import html2canvas from 'html2canvas';

const shareTemplate = ref(null);
const isGeneratingCard = ref(false);
const currentPulseKey = ref('registered'); // registered, in_queue, ready, on_stage, completed
const estWaitTime = ref(15);

const pulseSteps = [
  { key: 'registered', label: 'Registered', icon: 'app_registration' },
  { key: 'in_queue', label: 'In Queue', icon: 'hourglass_empty' },
  { key: 'ready', label: 'Get Ready', icon: 'notifications_active' },
  { key: 'on_stage', label: 'On Stage', icon: 'mic' },
  { key: 'completed', label: 'Completed', icon: 'auto_awesome' }
];

const currentPulseLabel = computed(() => {
  return pulseSteps.find(s => s.key === currentPulseKey.value)?.label || 'Awaiting Status';
});

const isPulseStepCompleted = (key) => {
  const stepsKeys = pulseSteps.map(s => s.key);
  const currentIdx = stepsKeys.indexOf(currentPulseKey.value);
  const targetIdx = stepsKeys.indexOf(key);
  return targetIdx < currentIdx;
};

const formatDateShort = (date) => {
    if (!date) return '2026';
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

const generateShareCard = async () => {
    isGeneratingCard.value = true;
    try {
        await new Promise(r => setTimeout(r, 500)); // Brief delay for styles
        const canvas = await html2canvas(shareTemplate.value, {
            useCORS: true,
            scale: 2,
            backgroundColor: '#0a0f1d'
        });
        
        const link = document.createElement('a');
        link.download = `Greenwich_Journey_${user.value?.fullName?.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error('Failed to generate share card:', err);
    } finally {
        isGeneratingCard.value = false;
    }
};

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();
const user = computed(() => authStore.user);

// Journey tracking data
const registrationData = ref(null);
const ticketData = ref(null);
const seatData = ref(null);
const gownCollectionData = ref(null); // Track gown collection request
const paymentData = ref(null);
const loading = ref(true);
const updatingCollection = ref(false);

// Countdown
const countdown = ref({ days: 0, hours: 0, mins: 0 });
const ceremonyDate = ref(null);
const ceremonyLocation = ref(null);
const ceremonyMapLink = ref(null);
const registrationDeadline = ref(null);
const gownCollectionStartDate = ref(null);
const gownCollectionEndDate = ref(null);
const gownCollectionLocation = ref(null);
const gownCollectionMapLink = ref(null);
const rehearsalDate = ref(null);
const rehearsalLocation = ref(null);
const rehearsalMapLink = ref(null);

const updateCountdown = () => {
  const targetDate = ceremonyDate.value ? new Date(ceremonyDate.value) : new Date('2026-03-13T09:00:00');
  const now = new Date();
  const diff = targetDate - now;

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
    // Load system settings first
    try {
      const settingsRes = await api.get('/settings');
      if (settingsRes.data.success) {
        ceremonyDate.value = settingsRes.data.data.ceremonyDate;
        ceremonyLocation.value = settingsRes.data.data.ceremonyLocation;
        ceremonyMapLink.value = settingsRes.data.data.ceremonyMapLink;
        registrationDeadline.value = settingsRes.data.data.registrationDeadline;
        gownCollectionStartDate.value = settingsRes.data.data.gownCollectionStartDate;
        gownCollectionEndDate.value = settingsRes.data.data.gownCollectionEndDate;
        gownCollectionLocation.value = settingsRes.data.data.gownCollectionLocation;
        gownCollectionMapLink.value = settingsRes.data.data.gownCollectionMapLink;
        rehearsalDate.value = settingsRes.data.data.rehearsalDate;
        rehearsalLocation.value = settingsRes.data.data.rehearsalLocation;
        rehearsalMapLink.value = settingsRes.data.data.rehearsalMapLink;
        updateCountdown();
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
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
        seatData.value = seatsRes.data.data.bookings || [];
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Error loading seats:', err);
      }
    }

    // Load gown collection request
    try {
      const gownRes = await api.get('/gown-collection/my-collection');
      if (gownRes.data.success && gownRes.data.data.gownCollection) {
        gownCollectionData.value = gownRes.data.data.gownCollection;
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Error loading gown collection:', err);
      }
    }

    // Load payments
    try {
      const paymentRes = await api.get('/payments/my-payments');
      if (paymentRes.data.success) {
        paymentData.value = paymentRes.data.data.payments;
      }
    } catch (error) {
       console.error('Error loading payments:', error);
    }
  } finally {
    loading.value = false;
  }
};

const toggleCollection = async (item) => {
    if (!registrationData.value) return;

    updatingCollection.value = true;
    try {
        const payload = {};
        if (item === 'invitation') {
            payload.invitationCollected = !registrationData.value.invitationCollected;
        } else {
            payload.wristbandCollected = !registrationData.value.wristbandCollected;
        }

        const response = await api.put('/registrations/me/logistics', payload);
        if (response.data.success) {
            registrationData.value = { 
                ...registrationData.value, 
                ...response.data.data.registration 
            };
        }
    } catch (err) {
        console.error('Error updating collection:', err);
    } finally {
        updatingCollection.value = false;
    }
};

onMounted(() => {
  updateCountdown();
  setInterval(updateCountdown, 60000);
  loadJourneyProgress();

  // Socket connection for real-time updates
  if (authStore.user) {
    socketService.emit('ceremony:join', { 
        role: authStore.user.role, 
        name: authStore.user.fullName 
    });
  }

  socketService.on('student:logistics_updated', (updatedRegistration) => {
    if (registrationData.value && registrationData.value.id === updatedRegistration.id) {
        registrationData.value = { ...registrationData.value, ...updatedRegistration };
    }
  });

  socketService.on('logistics:updated', (data) => {
    // If it's about me, update my data
    if (registrationData.value && registrationData.value.id === data.registrationId) {
        registrationData.value = {
            ...registrationData.value,
            invitationCollected: data.invitationCollected,
            wristbandCollected: data.wristbandCollected,
            collectionConfirmedAt: data.collectionConfirmedAt,
            collectionConfirmedBy: { fullName: data.confirmedBy }
        };
    }
  });


});

// Reload data when navigating back to Dashboard
onActivated(() => {
  loadJourneyProgress();
});

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Navigation - Simplified and organized by flow
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
      completed: !!gownCollectionData.value,
      path: '/student/gown-collection',
      action: 'Request',
      icon: 'checkroom',
      locked: !seatData.value || seatData.value.length === 0
    },
    {
      label: 'Complete Payment',
      description: 'Pay for packages and services',
      completed: !!paymentData.value && paymentData.value.some(p => p.status === 'completed'), // Update logic
      path: '/student/booking-confirmation',
      action: 'Pay Now',
      icon: 'payments',
      locked: !gownCollectionData.value
    }
  ];
});

const completedTasks = computed(() => checklist.value.filter(item => item.completed).length);
const progressPercentage = computed(() => Math.round((completedTasks.value / checklist.value.length) * 100));

// Stats
const stats = computed(() => {
  const isRegistered = registrationData.value && registrationData.value.registrationStatus !== 'cancelled';
  const gownStatus = gownCollectionData.value?.status ? 
    gownCollectionData.value.status.charAt(0).toUpperCase() + gownCollectionData.value.status.slice(1) : 
    'Pending';

  return [
  {
    icon: 'how_to_reg',
    value: isRegistered ? 'Done' : 'Pending',
    label: 'Registration',
    badge: isRegistered ? '✓' : '',
    badgeClass: isRegistered 
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    iconBgClass: isRegistered ? 'bg-green-600' : 'bg-amber-500'
  },
  {
    icon: 'confirmation_number',
    value: ticketData.value ? '1' : '0',
    label: 'Tickets',
    iconBgClass: ticketData.value ? 'bg-blue-600' : 'bg-gray-400'
  },
  {
    icon: 'event_seat',
    value: seatData.value ? seatData.value.length.toString() : '0',
    label: 'Seats Booked',
    iconBgClass: seatData.value && seatData.value.length > 0 ? 'bg-purple-600' : 'bg-gray-400'
  },
  {
    icon: 'checkroom',
    value: gownStatus,
    label: 'Gown Status',
    iconBgClass: gownCollectionData.value ? 'bg-indigo-600' : 'bg-amber-500'
  },
  {
    icon: 'schedule',
    value: countdown.value?.days || 0,
    label: 'Days Left',
    badge: 'SOON',
    badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    iconBgClass: 'bg-orange-600'
  }
]});



// Timeline
const timeline = computed(() => [
  {
    title: 'Registration Deadline',
    description: 'Online registration portal closes',
    date: registrationDeadline.value ? new Date(registrationDeadline.value).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '01/05/2026',
    time: registrationDeadline.value ? new Date(registrationDeadline.value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '5:00 PM',
    location: 'Online',
    icon: 'app_registration',
    status: 'completed',
    badge: 'IMPORTANT',
    badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  },
  {
    title: 'Gown Collection Period',
    description: 'Collect your graduation gown',
    date: gownCollectionStartDate.value ? 
      `${new Date(gownCollectionStartDate.value).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${new Date(gownCollectionEndDate.value).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}` : 
      '20/05/2026 - 10/06/2026',
    time: gownCollectionStartDate.value ? 
      `${new Date(gownCollectionStartDate.value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${new Date(gownCollectionEndDate.value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` :
      '9 AM - 5 PM',
    location: gownCollectionLocation.value || 'Building A, Room 101',
    mapLink: gownCollectionMapLink.value,
    icon: 'checkroom',
    status: 'active',
    badge: 'ACTIVE',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  },
  {
    title: 'Rehearsal Day',
    description: 'Mandatory rehearsal for all graduates',
    date: rehearsalDate.value ? new Date(rehearsalDate.value).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 
          (ceremonyDate.value ? new Date(new Date(ceremonyDate.value).getTime() - 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'TBA'),
    time: rehearsalDate.value ? new Date(rehearsalDate.value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '2:00 PM',
    location: rehearsalLocation.value || 'Main Hall',
    mapLink: rehearsalMapLink.value,
    icon: 'groups',
    status: 'upcoming',
    badge: 'UPCOMING',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  },
  {
    title: 'Graduation Ceremony',
    description: 'The big day! Arrive 30 minutes early',
    date: ceremonyDate.value ? new Date(ceremonyDate.value).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '13/03/2026',
    time: ceremonyDate.value ? new Date(ceremonyDate.value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '9:00 AM',
    location: ceremonyLocation.value || 'University Arena',
    mapLink: ceremonyMapLink.value,
    icon: 'school',
    status: 'upcoming',
    badge: 'UPCOMING',
    badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
  }
]);
</script>
