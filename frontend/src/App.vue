<template>
  <div id="app">
    <RouterView />
    <FloatingChat />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { RouterView } from 'vue-router';
import FloatingChat from '@/components/FloatingChat.vue';

const authStore = useAuthStore();

// Check authentication status on app load
onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await authStore.fetchCurrentUser();
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }
});
</script>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
