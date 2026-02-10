<template>
  <div class="inline-flex items-center justify-center">
    <div class="spinner" :class="sizeClass"></div>
    <span v-if="message" class="ml-3 text-gray-600 dark:text-gray-400">{{ message }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  message: String
});

const sizeClass = computed(() => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };
  return sizes[props.size];
});
</script>
