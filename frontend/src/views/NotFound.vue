<template>
  <div class="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 overflow-hidden">
    <!-- Decorative Background -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl float"></div>
      <div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl float" style="animation-delay: -2s"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 w-full max-w-lg text-center">
      <!-- Animated 404 -->
      <div class="relative mb-8">
        <div class="text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-pink-500 leading-none select-none">
          404
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-24 h-24 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center bounce-in">
            <span class="material-symbols-outlined text-5xl text-primary">search_off</span>
          </div>
        </div>
      </div>

      <!-- Message -->
      <div class="glass-card p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h2>
        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved to another location.
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/" class="btn btn-primary">
          <span class="material-symbols-outlined">home</span>
          Go Home
        </router-link>
        <button @click="$router.back()" class="btn btn-glass">
          <span class="material-symbols-outlined">arrow_back</span>
          Go Back
        </button>
      </div>

      <!-- Quick Links -->
      <div class="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Or try these pages:</p>
        <div class="flex flex-wrap justify-center gap-3">
          <router-link 
            v-for="link in quickLinks" 
            :key="link.path" 
            :to="link.path"
            class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition-all"
          >
            {{ link.label }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const quickLinks = [
  { path: '/login', label: 'Login' },
  { path: '/student', label: 'Dashboard' },
  { path: '/student/ticket', label: 'My Ticket' },
  { path: '/admin', label: 'Admin Portal' }
];
</script>

<style scoped>
/* Large 404 text glow */
.text-\[180px\] {
  filter: drop-shadow(0 0 60px rgba(10, 71, 194, 0.3));
}
</style>
