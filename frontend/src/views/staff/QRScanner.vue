<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark pb-24">
    <!-- Header -->
    <div class="sticky top-0 z-50 flex items-center bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 p-4 justify-between">
      <button @click="$router.back()" class="flex size-10 items-center justify-center rounded-lg text-gray-600 dark:text-gray-300">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h2 class="text-primary dark:text-blue-400 text-lg font-bold">QR Code Scanner</h2>
      <div class="w-10"></div>
    </div>

    <div class="p-4 max-w-2xl mx-auto">
      <!-- Scanner Stats -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ scannedToday }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Scanned Today</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ totalValid }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Valid Tickets</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ totalInvalid }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Invalid</p>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="scanResult && scanResult.success" class="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-pulse">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
          <div>
            <p class="text-green-600 dark:text-green-400 font-bold">✓ Ticket Valid!</p>
            <p class="text-sm text-green-700 dark:text-green-300">{{ scanResult.message }}</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="scanResult && !scanResult.success" class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-red-600 text-3xl">cancel</span>
          <div>
            <p class="text-red-600 dark:text-red-400 font-bold">✗ Invalid Ticket</p>
            <p class="text-sm text-red-700 dark:text-red-300">{{ scanResult.message }}</p>
          </div>
        </div>
      </div>

      <!-- Scanner Input -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Scan Ticket</h3>
        
        <!-- QR Scanner Camera -->
        <div v-show="useCamera" class="mb-6">
          <div v-if="cameraError" class="p-4 bg-red-50 text-red-600 rounded-lg text-center mb-4">
            {{ cameraError }}
          </div>
          <div id="qr-reader" class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-black w-full min-h-[250px] relative"></div>
          
          <div class="flex justify-center gap-3 mt-4">
            <button 
              v-if="!isScanningCamera"
              @click="startCamera" 
              class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-sm">videocam</span> Start Camera
            </button>
            <button 
              v-if="isScanningCamera"
              @click="stopCamera" 
              class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-sm">videocam_off</span> Stop Camera
            </button>
          </div>
        </div>

        <!-- Toggle Switch -->
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ useCamera ? 'Switch to Manual Input' : 'Switch to Camera Scanner' }}
          </span>
          <button 
            @click="toggleInputMethod"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            :class="useCamera ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'"
          >
            <span 
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="useCamera ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <!-- Manual Input -->
        <form v-show="!useCamera" @submit.prevent="handleScan" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ticket Number
            </label>
            <input
              v-model="ticketNumber"
              ref="ticketInput"
              :required="!useCamera"
              type="text"
              placeholder="GRAD-2026-XXXXXXXXXX-XXX"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white font-mono text-sm"
              @input="ticketNumber = ticketNumber.toUpperCase()"
            />
            <p class="text-xs text-gray-500 mt-1">Paste or type the ticket number</p>
          </div>

          <button
            type="submit"
            :disabled="scanning || !ticketNumber"
            class="w-full px-6 py-4 bg-primary text-white rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            <span v-if="!scanning" class="flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">qr_code_scanner</span>
              Scan Ticket
            </span>
            <div v-else class="spinner mx-auto"></div>
          </button>
        </form>
      </div>

      <!-- Scanned Ticket Details -->
      <div v-if="lastScannedTicket" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Last Scanned Ticket</h3>
        
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Student Name</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ lastScannedTicket.userId?.fullName }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Student ID</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ lastScannedTicket.userId?.studentId }}</span>
          </div>
          <div class="flex justify-between items-center" v-if="lastScannedTicket.userId?.major">
            <span class="text-sm text-gray-500 dark:text-gray-400">Major</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ lastScannedTicket.userId?.major }} <span v-if="lastScannedTicket.userId?.classOf">({{ lastScannedTicket.userId?.classOf }})</span></span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Ticket Type</span>
            <span class="font-semibold capitalize text-gray-900 dark:text-white">{{ lastScannedTicket.ticketType || 'Student' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Ticket Number</span>
            <span class="font-mono text-xs text-gray-900 dark:text-white">{{ lastScannedTicket.ticketNumber }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Seat Number(s)</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ lastScannedTicket.seatList || lastScannedTicket.seatNumber || 'N/A' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Scanned At</span>
            <span class="text-sm text-gray-900 dark:text-white">{{ formatTime(lastScannedTicket.scannedAt) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Scanned By</span>
            <span class="text-sm text-gray-900 dark:text-white">{{ user?.fullName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import { Html5Qrcode } from 'html5-qrcode';
import { io } from 'socket.io-client';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const ticketNumber = ref('');
const ticketInput = ref(null);
const scanning = ref(false);
const scanResult = ref(null);
const lastScannedTicket = ref(null);

const scannedToday = ref(0);
const totalValid = ref(0);
const totalInvalid = ref(0);

// Camera Scanner State
const useCamera = ref(false);
const isScanningCamera = ref(false);
const cameraError = ref('');
let html5QrCode = null;

// Ceremony sync socket
let ceremonySocket = null;

const toggleInputMethod = () => {
  useCamera.value = !useCamera.value;
  if (useCamera.value) {
    // Start camera when switching to camera mode
    startCamera();
  } else {
    // Stop camera and focus input when switching to manual mode
    stopCamera();
    setTimeout(() => {
        ticketInput.value?.focus();
    }, 100);
  }
};

const onScanSuccess = (decodedText) => {
    // Prevent double scanning rapidly
    if (scanning.value) return;
    
    // Play a distinct beep for detection
    playSound('beep');
    
    // Temporary visual feedback
    cameraError.value = 'Detected: Processing...';
    
    // Stop scanning briefly, then verify
    html5QrCode.pause();
    
    let scannedTicketNumber = decodedText;
    
    // The backend ticketController.generateTicket encodes a JSON object into the QR code
    // Try to parse it and extract the ticketNumber
    try {
        const parsed = JSON.parse(decodedText);
        if (parsed && parsed.ticketNumber) {
            scannedTicketNumber = parsed.ticketNumber;
        }
    } catch (e) {
        // It's not JSON, so it might just be the raw ticket number string. Valid fallback.
        console.log('Scanned QR is not JSON, treating as raw string:', decodedText);
    }
    
    ticketNumber.value = scannedTicketNumber;
    
    handleScan().then(() => {
        cameraError.value = '';
        setTimeout(() => {
            if (isScanningCamera.value && html5QrCode) {
                html5QrCode.resume();
            }
        }, 1500); // Wait 1.5 seconds before accepting next scan
    });
};

const onScanFailure = (error) => {
    // Ignore frequent scan failures (happens every frame it doesn't find a code)
};

const startCamera = async () => {
    cameraError.value = '';
    isScanningCamera.value = true;
    
    try {
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode('qr-reader');
        }
        
        const config = { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };
        
        await html5QrCode.start(
            { facingMode: 'environment' }, // Prefer back camera
            config,
            onScanSuccess,
            onScanFailure
        );
    } catch (err) {
        console.error('Failed to start camera:', err);
        cameraError.value = 'Camera access denied or not available. Please allow camera permissions or use manual input.';
        isScanningCamera.value = false;
    }
};

const stopCamera = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
        try {
            await html5QrCode.stop();
            isScanningCamera.value = false;
        } catch (err) {
            console.error('Failed to stop camera:', err);
        }
    }
};

const handleScan = async () => {
  scanning.value = true;
  scanResult.value = null;

  try {
    const response = await api.post('/tickets/scan', {
      ticketNumber: ticketNumber.value.trim()
    });

    if (response.data.success) {
      const ticket = response.data.data.ticket;
      scanResult.value = {
        success: true,
        message: `Ticket scanned successfully for ${ticket.userId?.fullName}`
      };
      lastScannedTicket.value = ticket;
      totalValid.value++;
      scannedToday.value++;

      // Fallback: Manually emit from client in case backend broadcast is blocked by proxy
      const socket = window._ceremonySocket || window.ceremonySocket;
      if (socket?.connected) {
        socket.emit('ceremony:ticket_scanned', {
          id: ticket.id,
          studentName: ticket.userId?.fullName,
          studentId: ticket.userId?.studentId,
          major: ticket.userId?.major,
          seatNumber: ticket.seatList || ticket.seatNumber || null,
          ticketNumber: ticket.ticketNumber,
          scannedBy: user.value?.fullName,
          timestamp: new Date()
        });
      }

      // Play success sound (if available)
      playSound('success');

      // Clear after 3 seconds
      setTimeout(() => {
        scanResult.value = null;
        ticketNumber.value = '';
        ticketInput.value?.focus();
      }, 3000);
    }
  } catch (error) {
    const errorData = error.response?.data;
    
    scanResult.value = {
      success: false,
      message: errorData?.message || 'Invalid or already scanned ticket'
    };
    totalInvalid.value++;

    // If API returns ticket data (e.g., for "Already Scanned"), show it
    if (errorData?.data?.ticket) {
        lastScannedTicket.value = errorData.data.ticket;
    }

    // Play error sound (if available)
    playSound('error');

    // Clear after 3 seconds
    setTimeout(() => {
      scanResult.value = null;
      ticketNumber.value = '';
      ticketInput.value?.focus();
    }, 3000);
  } finally {
    scanning.value = false;
  }
};

const playSound = (type) => {
  // Optional: Implement sound feedback
  try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'success') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // High pitch
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } else if (type === 'error') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime); // Low pitch
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      } else if (type === 'beep') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
      }
  } catch (err) {
      console.log('Audio feedback not supported');
  }
};

const formatTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  // Focus input on mount
  if (!useCamera.value) {
      ticketInput.value?.focus();
  }

  // Connect to ceremony room for real-time sync with MC
  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  ceremonySocket = io(backendUrl, { transports: ['websocket', 'polling'] });
  ceremonySocket.on('connect', () => {
    ceremonySocket.emit('join', { userId: user.value?.id, role: 'staff' });
    ceremonySocket.emit('ceremony:join', { role: 'staff', name: user.value?.fullName });
  });

  // Fetch today's stats
  // TODO: Implement stats API
});

onUnmounted(() => {
    stopCamera();
    if (html5QrCode) {
        html5QrCode.clear();
    }
    if (ceremonySocket) {
        ceremonySocket.disconnect();
    }
});
</script>
