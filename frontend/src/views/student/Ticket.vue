<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
    <!-- Sticky Top Navigation -->
    <div class="sticky top-0 z-40 bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border-b border-white/20 px-4 md:px-6 py-3 flex items-center justify-between shadow-xl">
      <div class="absolute inset-0 mesh-gradient opacity-10 -z-10"></div>

      <div class="flex items-center gap-4">
        <button @click="$router.push('/student/dashboard')" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center">
           <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-xl font-black text-gray-900 dark:text-white">{{ $t('nav.ceremony') }}</h1>
      </div>
    </div>

    <div class="w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
      


      <!-- Loading State -->
      <div v-if="loading" class="glass-card p-12 text-center border-transparent">
        <div class="spinner spinner-primary mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400 font-medium font-lexend">Loading your ticket...</p>
      </div>

      <!-- No Ticket State -->
      <div v-else-if="!ticket" class="glass-card p-12 text-center border-transparent hover-lift">
        <div class="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
          <span class="material-symbols-outlined text-4xl text-primary">confirmation_number</span>
        </div>
        
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 font-lexend">No Ticket Found</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Generate your digital graduation ticket to access the ceremony.
        </p>
        
        <button 
          @click="generateTicket" 
          :disabled="generating" 
          class="btn btn-primary"
        >
          <div v-if="generating" class="spinner"></div>
          <template v-else>
            <span class="material-symbols-outlined">qr_code_2</span>
            <span>Generate Ticket Now</span>
          </template>
        </button>
      </div>

      <!-- Ticket Display -->
      <div v-else class="space-y-6">
        <div class="glass-card border-transparent overflow-hidden shadow-2xl scale-95 hover:scale-100 transition-transform duration-500">
          <!-- Ticket Header -->
          <div class="mesh-gradient animate-mesh p-8 text-white relative overflow-hidden">
             <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div class="relative z-10">
                <div class="flex items-start justify-between mb-6">
                <div>
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/20">
                    <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span class="text-[10px] font-bold uppercase tracking-wider">Valid Entry</span>
                    </div>
                    <h1 class="text-3xl font-bold mb-1 font-greenwich">Greenwich</h1>
                    <p class="text-white/70 text-sm">Graduation Ceremony {{ ceremonyYear }}</p>
                </div>
                <div class="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center">
                    <img src="@/assets/images/university-of-greenwich.jpg" alt="Logo" class="w-full h-full object-contain" />
                </div>
                </div>
                
                <div class="grid grid-cols-2 gap-8">
                <div>
                    <p class="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">Date</p>
                    <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-gray-400">calendar_today</span>
                    <span class="font-bold text-lg">{{ formattedDate }}</span>
                    </div>
                </div>
                <div>
                    <p class="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">Time</p>
                    <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-gray-400">schedule</span>
                    <span class="font-bold text-lg">{{ formattedTime }}</span>
                    </div>
                </div>
                </div>
             </div>
          </div>

          <!-- Perforated Line -->
          <div class="relative h-4 bg-white dark:bg-gray-800 -mt-2">
            <div class="absolute top-0 left-0 w-4 h-4 rounded-full bg-gray-50 dark:bg-gray-900 -translate-x-2 -translate-y-2"></div>
            <div class="absolute top-0 right-0 w-4 h-4 rounded-full bg-gray-50 dark:bg-gray-900 translate-x-2 -translate-y-2"></div>
            <div class="absolute top-0 left-4 right-4 border-t-2 border-dashed border-gray-200 dark:border-gray-600"></div>
          </div>

          <!-- Ticket Body -->
          <div class="relative z-10 p-8">
            <div class="flex flex-col md:flex-row items-center gap-8">
              <!-- QR Code Section -->
              <div class="flex-shrink-0 text-center flex flex-col items-center">
                <!-- QR Container -->
                <div 
                  class="p-4 border border-gray-200 rounded-xl mb-4 shadow-sm inline-block relative overflow-hidden"
                  :style="shapeStyle"
                >
                   <!-- Background Overlay for Opacity -->
                   <div 
                      v-if="customBgImage"
                      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity"
                      :style="{ 
                         backgroundImage: `url(${customBgImage})`,
                         backgroundSize: bgScale === 'stretch' ? '100% 100%' : bgScale,
                         opacity: bgOpacity 
                      }"
                   ></div>
                   
                   <!-- QR Code -->
                   <div ref="qrCodeContainer" class="w-[200px] h-[200px] relative z-10"></div>
                </div>
                <p class="font-mono text-sm text-gray-500 tracking-wider mb-4">{{ ticket.ticketNumber }}</p>
                
                <!-- QR Design Studio -->
                <div class="w-full max-w-[280px] space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                   <div class="text-xs font-bold text-gray-500 uppercase tracking-widest text-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
                      Design Your Ticket
                   </div>
                   
                   <!-- Step 1: Background Art -->
                   <div>
                       <div class="flex items-center justify-between mb-2">
                           <div class="flex items-center gap-2">
                              <span class="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold">1</span>
                              <span class="text-xs font-bold text-gray-700 dark:text-gray-200">Background Art</span>
                           </div>
                           <button 
                              v-if="customBgImage" 
                              @click="removeBgImage" 
                              class="text-[10px] text-red-500 hover:text-red-700 font-medium"
                           >
                              Remove
                           </button>
                       </div>
                       
                       <button 
                          @click="$refs.bgInput.click()" 
                          class="w-full text-xs py-2 px-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-center justify-center gap-2 group mb-2"
                       >
                          <span class="material-symbols-outlined text-sm text-blue-500 group-hover:scale-110 transition-transform">add_photo_alternate</span>
                          <span class="text-gray-600 dark:text-gray-300 font-medium">{{ customBgImage ? 'Change Image' : 'Upload Image' }}</span>
                       </button>
                       <input type="file" ref="bgInput" class="hidden" accept="image/*" @change="handleBgImageUpload" />

                       <!-- Bg Controls -->
                       <div v-if="customBgImage" class="p-2 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600/50 space-y-2">
                          <div>
                             <span class="text-[10px] font-bold text-gray-400 block mb-1">Scale Mode</span>
                             <div class="flex gap-1">
                                <button @click="bgScale = 'cover'" class="flex-1 text-[10px] py-1 rounded border transition-colors" :class="bgScale === 'cover' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-500'">Fill</button>
                                <button @click="bgScale = 'stretch'" class="flex-1 text-[10px] py-1 rounded border transition-colors" :class="bgScale === 'stretch' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-500'">Stretch</button>
                                <button @click="bgScale = 'contain'" class="flex-1 text-[10px] py-1 rounded border transition-colors" :class="bgScale === 'contain' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-500'">Fit</button>
                             </div>
                          </div>
                          <div>
                             <div class="flex justify-between text-[10px] text-gray-400 mb-1">
                                <span>Opacity</span>
                                <span>{{ Math.round(bgOpacity * 100) }}%</span>
                             </div>
                             <input type="range" v-model.number="bgOpacity" min="0.1" max="1" step="0.1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                          </div>
                       </div>
                   </div>

                   <!-- Step 2: QR Code Style -->
                   <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                       <div class="flex items-center gap-2 mb-2">
                          <span class="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold">2</span>
                          <span class="text-xs font-bold text-gray-700 dark:text-gray-200">QR Code Style</span>
                       </div>
                       
                       <div class="grid grid-cols-2 gap-2 mb-2">
                          <!-- Shape Selector -->
                          <div class="col-span-2">
                              <select v-model="qrShape" class="w-full text-[10px] p-1.5 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200">
                                 <option value="square">Square Shape</option>
                                 <option value="circle">Circle Shape</option>
                                 <option value="heart">Heart Shape</option>
                                 <option value="hexagon">Hexagon Shape</option>
                              </select>
                          </div>
                          <!-- Pattern Selector -->
                          <div class="col-span-2">
                              <select v-model="qrPattern" class="w-full text-[10px] p-1.5 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200">
                                 <option value="square">Classic Pattern</option>
                                 <option value="dots">Modern Dots</option>
                                 <option value="rounded">Rounded</option>
                                 <option value="classy">Classy</option>
                              </select>
                          </div>
                       </div>
                       
                       <!-- Colors -->
                       <div class="flex items-center justify-between gap-2">
                          <div class="flex items-center gap-2 flex-1 p-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                             <input type="color" v-model="qrColor" class="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent" />
                             <span class="text-[10px] font-medium text-gray-500">Dots</span>
                          </div>
                          <!-- Only show Bg Color if no image or opacity < 1 -->
                          <div class="flex items-center gap-2 flex-1 p-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                             <input type="color" v-model="qrBgColor" class="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent" />
                             <span class="text-[10px] font-medium text-gray-500">Base</span>
                          </div>
                       </div>
                   </div>

                   <!-- Step 3: Center Brand -->
                   <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                       <div class="flex items-center justify-between mb-2">
                           <div class="flex items-center gap-2">
                              <span class="flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold">3</span>
                              <span class="text-xs font-bold text-gray-700 dark:text-gray-200">Center Brand</span>
                           </div>
                           <button 
                              v-if="customQrImage" 
                              @click="removeQrImage" 
                              class="text-[10px] text-red-500 hover:text-red-700 font-medium"
                           >
                              Remove
                           </button>
                       </div>
                       
                       <button 
                          @click="$refs.qrInput.click()" 
                          class="w-full text-xs py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-pink-400 hover:bg-pink-50 transition-all flex items-center justify-center gap-2 text-gray-500"
                       >
                          <span class="material-symbols-outlined text-sm">stars</span>
                          <span>{{ customQrImage ? 'Change Logo' : 'Add Logo' }}</span>
                       </button>
                       <input type="file" ref="qrInput" class="hidden" accept="image/*" @change="handleQrImageUpload" />
                   </div>
                   
                   <!-- Reset -->
                   <button @click="resetQrStyle" class="text-[10px] text-gray-400 hover:text-gray-600 underline self-center w-full mt-2">
                      Reset to Default
                   </button>
                </div>
              </div>

              <!-- Details -->
              <div class="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Student Name</p>
                  <p class="font-bold text-gray-900 dark:text-white text-lg">{{ user?.fullName || 'N/A' }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Student ID</p>
                  <p class="font-bold text-gray-900 dark:text-white text-lg">{{ user?.studentId || 'N/A' }}</p>
                </div>
                
                <div class="sm:col-span-2">
                  <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Seat Number(s)</p>
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-gray-400">event_seat</span>
                    <p class="font-bold text-gray-900 dark:text-white text-lg">{{ seatList }}</p>
                  </div>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-bold" :class="ticket.isScanned ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
                    <span class="material-symbols-outlined text-lg">{{ ticket.isScanned ? 'check_circle' : 'verified' }}</span>
                    {{ ticket.isScanned ? 'Scanned' : 'Valid' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Scanned Footer -->
          <div v-if="ticket.isScanned" class="relative z-10 bg-green-50 dark:bg-green-900/90 backdrop-blur-sm border-t border-green-100 dark:border-green-800 p-4 flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
            <span class="material-symbols-outlined">check_circle</span>
            <span class="font-semibold text-sm">Checked in at {{ formatDate(ticket.scannedAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-4">
          <button 
            @click="deleteTicket"
            class="py-3 rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined">delete</span>
            Cancel Ticket
          </button>
          
          <button 
            @click="downloadTicket" 
            class="py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined">download</span>
            Download Card
          </button>
        </div>

        <!-- Notes -->
        <div class="flex gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
          <span class="material-symbols-outlined text-amber-600 dark:text-amber-400 flex-shrink-0">info</span>
          <div>
            <p class="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Important Information</p>
            <ul class="text-xs text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
              <li>Please present this QR code at the entrance for scanning.</li>
              <li>Arrive at least 30 minutes before the ceremony starts.</li>
              <li>Keep a screenshot of this ticket in case of poor internet connection.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';
import api from '@/services/api';
import QRCodeStyling from 'qr-code-styling';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

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

const ticket = ref(null);
const loading = ref(true);
const generating = ref(false);
const settings = ref(null);
const myBookings = ref([]);

// QR Customization State
const customQrImage = ref(localStorage.getItem('ticketCustomQrImage') || null);
const customBgImage = ref(localStorage.getItem('ticketCustomBgImage') || null);
const bgScale = ref(localStorage.getItem('ticketBgScale') || 'cover'); // 'cover' or 'contain'
const bgOpacity = ref(parseFloat(localStorage.getItem('ticketBgOpacity')) || 1.0);
const qrShape = ref(localStorage.getItem('ticketQrShape') || 'square'); // square, circle, heart, hexagon
const qrPattern = ref(localStorage.getItem('ticketQrPattern') || 'square');
const qrColor = ref(localStorage.getItem('ticketQrColor') || '#000000');
const qrBgColor = ref(localStorage.getItem('ticketQrBgColor') || 'rgba(255, 255, 255, 0)'); // Default transparent if bg image exists, else white
const qrCodeContainer = ref(null);
const qrInput = ref(null);
const bgInput = ref(null);
let qrCodeHelper = null;

const user = computed(() => authStore.user);

const ceremonyYear = computed(() => {
  return settings.value?.ceremonyDate ? new Date(settings.value.ceremonyDate).getFullYear() : '2026';
});

const formattedDate = computed(() => {
  if (!settings.value?.ceremonyDate) return '20/06/2026';
  return new Date(settings.value.ceremonyDate).toLocaleDateString('en-GB', {
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  });
});

const formattedTime = computed(() => {
  if (!settings.value?.ceremonyDate) return '9:30 AM';
  return new Date(settings.value.ceremonyDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
});

const shapeStyle = computed(() => {
  const style = {
    // Only set background color (transparent if image exists to let inner div handle it)
    backgroundColor: customBgImage.value ? 'transparent' : (qrBgColor.value || '#ffffff'),
  };

  // Add Clip Path for Shapes
  switch (qrShape.value) {
    case 'circle':
      style.clipPath = 'circle(50% at 50% 50%)';
      break;
    case 'heart':
      // Heart Shape using SVG Mask (Scalable & Smooth)
      const heartSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`;
      
      style.maskImage = heartSvg;
      style.maskSize = 'contain';
      style.maskPosition = 'center';
      style.maskRepeat = 'no-repeat';
      
      style.webkitMaskImage = heartSvg;
      style.webkitMaskSize = 'contain';
      style.webkitMaskPosition = 'center';
      style.webkitMaskRepeat = 'no-repeat';
      
      // Clear any conflicting clip-path
      delete style.clipPath;
      break;
    case 'hexagon':
      style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
      break;
    default:
      style.borderRadius = '12px'; // Default rounded square
  }
  return style;
});

const seatList = computed(() => {
    if (!myBookings.value.length) return ticket.value?.seatNumber || 'TBA';
    // Group and sort logic...
    const studentSeats = myBookings.value.filter(b => b.seatType === 'student').map(b => b.seatNumber).sort();
    const guestSeats = myBookings.value.filter(b => b.seatType === 'guest').map(b => b.seatNumber).sort();

    let display = [];
    if (studentSeats.length) display.push(`My Seat: ${studentSeats.join(', ')}`);
    if (guestSeats.length) display.push(`Guest Seats: ${guestSeats.join(', ')}`);
    
    if (display.length === 0) return 'TBA';
    return display.join(' | ');
});

const initQrCode = () => {
   if (!ticket.value || !qrCodeContainer.value) return;

   const qrData = JSON.stringify({
         ticketNumber: ticket.value.ticketNumber,
         userId: user.value.id,
         type: 'student'
   });

   qrCodeHelper = new QRCodeStyling({
        width: 200,
        height: 200,
        type: 'svg',
        data: qrData,
        image: customQrImage.value,
        dotsOptions: {
            color: qrColor.value,
            type: qrPattern.value
        },
        backgroundOptions: {
            color: customBgImage.value ? 'transparent' : qrBgColor.value,
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 5,
            imageSize: 0.4
        },
        cornersSquareOptions: {
            type: qrPattern.value === 'dots' ? 'dot' : (qrPattern.value === 'rounded' ? 'extra-rounded' : 'square'),
            color: qrColor.value
        },
        cornersDotOptions: {
            type: qrPattern.value === 'dots' ? 'dot' : 'square',
             color: qrColor.value
        }
   });

   qrCodeContainer.value.innerHTML = '';
   qrCodeHelper.append(qrCodeContainer.value);
};

const updateQrCode = () => {
    if (!qrCodeHelper) return;
    qrCodeHelper.update({
        image: customQrImage.value,
        dotsOptions: {
            color: qrColor.value,
            type: qrPattern.value
        },
        backgroundOptions: {
            color: customBgImage.value ? 'transparent' : qrBgColor.value,
        },
        cornersSquareOptions: {
             type: qrPattern.value === 'dots' ? 'dot' : (qrPattern.value === 'rounded' ? 'extra-rounded' : (qrPattern.value === 'classy' ? 'extra-rounded' : 'square')),
             color: qrColor.value
        },
        cornersDotOptions: {
             type: qrPattern.value === 'dots' ? 'dot' : 'square',
             color: qrColor.value
        }
    });
};

// Watchers
watch([customQrImage, customBgImage, qrPattern, qrColor, qrBgColor], () => {
    updateQrCode();
    
    if (customQrImage.value) localStorage.setItem('ticketCustomQrImage', customQrImage.value);
    else localStorage.removeItem('ticketCustomQrImage');

    if (customBgImage.value) localStorage.setItem('ticketCustomBgImage', customBgImage.value);
    else localStorage.removeItem('ticketCustomBgImage');
    
    localStorage.setItem('ticketQrPattern', qrPattern.value);
    localStorage.setItem('ticketQrColor', qrColor.value);
    localStorage.setItem('ticketQrBgColor', qrBgColor.value);
});

const handleQrImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      customQrImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleBgImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
     const reader = new FileReader();
     reader.onload = (e) => {
        customBgImage.value = e.target.result;
        // Auto-Magic: Set to "Image QR" mode
        bgScale.value = 'cover'; 
        qrBgColor.value = 'rgba(255, 255, 255, 0)'; 
        bgOpacity.value = 0.8; 
        
        localStorage.setItem('ticketCustomBgImage', e.target.result);
        localStorage.setItem('ticketBgScale', 'cover');
        localStorage.setItem('ticketBgOpacity', '0.8');
        localStorage.setItem('ticketQrBgColor', 'rgba(255, 255, 255, 0)');
     };
     reader.readAsDataURL(file);
  }
};

const removeQrImage = () => {
   customQrImage.value = null;
};

const removeBgImage = () => {
   customBgImage.value = null;
   qrBgColor.value = '#ffffff'; // Reset to white if bg removed
};

const resetQrStyle = () => {
    qrPattern.value = 'square';
    qrColor.value = '#000000';
    qrBgColor.value = '#ffffff';
    customQrImage.value = null;
    customBgImage.value = null;
};

const fetchSettings = async () => {
  try {
    const response = await api.get('/settings');
    if (response.data.success) {
      settings.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
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

const fetchTicket = async () => {
  loading.value = true;
  try {
    const response = await api.get('/tickets/me');
    if (response.data.success && response.data.data.tickets) {
      const tickets = response.data.data.tickets;
      ticket.value = tickets.find(t => t.ticketType === 'student') || tickets[0];
      // Init QR code after DOM update
      if (ticket.value) {
         setTimeout(() => initQrCode(), 100);
      }
    }
  } catch (error) {
    console.log('No ticket found');
  } finally {
    loading.value = false;
  }
};

const generateTicket = async () => {
  generating.value = true;
  try {
    const response = await api.post('/tickets/generate');
    if (response.data.success) {
      await fetchTicket();
      alert('Ticket generated successfully!');
    }
  } catch (error) {
    console.error('Error generating ticket:', error);
    alert(error.response?.data?.message || 'Failed to generate ticket');
  } finally {
    generating.value = false;
  }
};

const downloadTicket = async () => {
  if (!qrCodeHelper) return;

  // 1. Get raw QR code as SVG blob
  const qrBlob = await qrCodeHelper.getRawData('svg');
  const qrUrl = URL.createObjectURL(qrBlob);

  // 2. Create a temporary canvas for composition
  const canvas = document.createElement('canvas');
  canvas.width = 300; // Customizable size
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  
  // Save context for clipping
  ctx.save();
  
  // 3. Apply Shape Clipping
  ctx.beginPath();
  const w = canvas.width;
  const h = canvas.height;
  
  if (qrShape.value === 'circle') {
      ctx.arc(w/2, h/2, w/2, 0, Math.PI * 2);
  } else if (qrShape.value === 'hexagon') {
      ctx.moveTo(w * 0.5, 0);
      ctx.lineTo(w, h * 0.25);
      ctx.lineTo(w, h * 0.75);
      ctx.lineTo(w * 0.5, h);
      ctx.lineTo(0, h * 0.75);
      ctx.lineTo(0, h * 0.25);
      ctx.closePath();
  } else if (qrShape.value === 'heart') {
      // Standard Heart Path for Canvas
      const topCurveHeight = h * 0.3;
      ctx.moveTo(w / 2, h * 0.2);
      ctx.bezierCurveTo(w / 2, h * 0.15, w * 0.45, 0, w * 0.2, 0);
      ctx.bezierCurveTo(0, 0, 0, h * 0.25, 0, h * 0.25);
      ctx.bezierCurveTo(0, h * 0.45, w * 0.25, h * 0.65, w / 2, h * 0.95);
      ctx.bezierCurveTo(w * 0.75, h * 0.65, w, h * 0.45, w, h * 0.25);
      ctx.bezierCurveTo(w, h * 0.25, w, 0, w * 0.8, 0);
      ctx.bezierCurveTo(w * 0.55, 0, w / 2, h * 0.15, w / 2, h * 0.2);
  } else {
      // Square (Default)
      ctx.rect(0, 0, w, h);
  }
  ctx.clip();

  // 4. Draw Background (Color or Image)
  if (customBgImage.value) {
      const bgImg = new Image();
      bgImg.src = customBgImage.value;
      await new Promise(resolve => {
          bgImg.onload = () => {
              ctx.globalAlpha = bgOpacity.value; // Apply Opacity
              if (bgScale.value === 'stretch') {
                  // Stretch to fill
                  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
              } else if (bgScale.value === 'contain') {
                  // Contain fit
                  const ratio = Math.min(canvas.width / bgImg.width, canvas.height / bgImg.height);
                  const centerShift_x = (canvas.width - bgImg.width * ratio) / 2;
                  const centerShift_y = (canvas.height - bgImg.height * ratio) / 2;
                  ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, centerShift_x, centerShift_y, bgImg.width * ratio, bgImg.height * ratio);
              } else {
                  // Cover fit (default)
                  const ratio = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
                  const centerShift_x = (canvas.width - bgImg.width * ratio) / 2;
                  const centerShift_y = (canvas.height - bgImg.height * ratio) / 2;
                  ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, centerShift_x, centerShift_y, bgImg.width * ratio, bgImg.height * ratio);
              }
              ctx.globalAlpha = 1.0; // Reset Opacity
              resolve();
          };
          bgImg.onerror = resolve;
      });
  } else {
      ctx.fillStyle = qrBgColor.value || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 5. Draw QR Code on top
  const qrImg = new Image();
  qrImg.src = qrUrl;
  await new Promise(resolve => {
      qrImg.onload = () => {
          // Draw QR centered, slightly smaller than canvas
          const padding = 20;
          ctx.drawImage(qrImg, padding, padding, canvas.width - 2*padding, canvas.height - 2*padding);
          resolve();
      };
      qrImg.error = resolve;
  });
  
  // Restore context (remove clipping)
  ctx.restore();

  // 6. Download combined image
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `graduation-ticket-${ticket.value.ticketNumber}.png`;
  link.click();
  
  URL.revokeObjectURL(qrUrl);
};

const deleteTicket = async () => {
  if (!ticket.value || !confirm('Are you sure you want to cancel this ticket? This action cannot be undone.')) return;
  alert('Please contact support to cancel your ticket.');
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
};

onMounted(() => {
  fetchTicket();
  fetchSettings();
  fetchMyBookings();
});
</script>
