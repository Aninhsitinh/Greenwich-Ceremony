<template>
  <div class="h-screen w-screen bg-white dark:bg-gray-950 overflow-hidden relative flex flex-col items-center justify-center font-sans">
    
    <!-- Minimalist Background -->
    <div class="absolute inset-0 z-0 bg-gray-50 dark:bg-gray-900 transition-colors duration-1000">
      <!-- Subtle gradient orb -->
      <div 
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[120px] opacity-50 transition-all duration-[3000ms] ease-in-out"
        :class="{ 'opacity-100 scale-110': currentStudent, 'opacity-30 scale-90': !currentStudent }"
      ></div>
    </div>

    <!-- Header Logo -->
    <div class="absolute top-12 left-0 right-0 flex justify-center z-20 transition-opacity duration-1000" :class="{ 'opacity-0': currentStudent, 'opacity-100': !currentStudent }">
      <div class="flex flex-col items-center">
        <h1 class="text-2xl font-light tracking-[0.3em] text-gray-400 dark:text-gray-500 uppercase">Graduation Ceremony</h1>
      </div>
    </div>

    <!-- Content Area -->
    <div class="z-10 w-full max-w-5xl px-8 flex items-center justify-center min-h-[500px]">
      
      <Transition name="fade-slide" mode="out-in">
        <!-- Student Info Card -->
        <div v-if="currentStudent" :key="currentStudent.queueId" class="w-full flex flex-col items-center text-center">
          
          <!-- Profile Photo -->
          <div class="mb-10 relative">
            <div class="w-56 h-56 md:w-72 md:h-72 rounded-full p-2 bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700">
              <img 
                :src="getProfilePicture(currentStudent.profilePhoto, currentStudent.studentName || currentStudent.fullName)" 
                @error="handleImageError"
                class="w-full h-full object-cover rounded-full"
                alt="Graduate Profile"
              />
            </div>
          </div>

          <!-- Student Details -->
          <h2 class="text-5xl md:text-7xl font-semibold text-gray-900 dark:text-white mb-6 tracking-tight">
            {{ currentStudent.studentName || currentStudent.fullName }}
          </h2>
          
          <div class="flex flex-col md:flex-row items-center justify-center gap-4 text-xl md:text-2xl font-light">
            <span class="text-gray-500 dark:text-gray-400 tracking-wider">
              {{ currentStudent.studentId }}
            </span>
            <span class="hidden md:inline text-gray-300 dark:text-gray-600">•</span>
            <span class="text-blue-600 dark:text-blue-400 font-medium tracking-wide">
              {{ currentStudent.major }}
            </span>
          </div>

        </div>
        
        <!-- Idle State -->
        <div v-else key="idle" class="flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-600 font-light">
          <div class="material-symbols-outlined text-5xl mb-6 opacity-50">school</div>
          <p class="text-2xl tracking-[0.2em] uppercase">Please stand by</p>
        </div>
      </Transition>

    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

const currentStudent = ref(null);
let socket = null;

const createAvatarUrl = (name) => {
  const n = name || 'Student';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=f3f4f6&color=374151&size=512&font-size=0.33`;
};

const getProfilePicture = (photo, name) => {
  if (!photo) return createAvatarUrl(name);
  if (photo.startsWith('http') || photo.startsWith('data:')) return photo;
  // Fallback for file paths
  return photo.startsWith('/') ? photo : `/${photo}`;
};

const handleImageError = (e) => {
  e.target.src = createAvatarUrl(currentStudent.value?.studentName || currentStudent.value?.fullName);
};

onMounted(() => {
  let backendUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
  if (backendUrl === '/api') backendUrl = 'http://127.0.0.1:5000';
  else backendUrl = backendUrl.replace('/api', '');

  socket = io(backendUrl, { transports: ['websocket', 'polling'] });

  socket.on('connect', () => {
    console.log('[LiveScreen] Connected to ceremony server');
    socket.emit('ceremony:join', { role: 'display', name: 'Public Screen' });
  });

  socket.on('ceremony:student_updated', (data) => {
    console.log('[LiveScreen] Student updated:', data);
    if (data.status === 'on_stage') {
      currentStudent.value = data;
    } else if (data.status === 'completed' || data.status === 'waiting' || data.status === 'ready') {
      if (currentStudent.value && currentStudent.value.queueId === data.queueId) {
        currentStudent.value = null;
      } else if (!currentStudent.value && data.status === 'completed') {
        currentStudent.value = null;
      }
    }
  });
});

onUnmounted(() => {
  if (socket) {
    socket.disconnect();
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

.font-sans {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Minimalist Fade & Slide Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
