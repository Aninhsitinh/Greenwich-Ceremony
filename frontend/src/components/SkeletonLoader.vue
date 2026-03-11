<template>
  <div 
    :class="[
      'skeleton-glass overflow-hidden relative',
      variant === 'circle' ? 'rounded-full' : 'rounded-2xl',
      customClass
    ]"
    :style="{ width: width, height: height }"
  >
    <!-- Optional: Subtle inner glow for more "premium" feel -->
    <div class="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'rect' // 'rect' | 'circle'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '20px'
  },
  customClass: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
/* Shimmer logic is already in main.css via .skeleton-glass */
</style>
