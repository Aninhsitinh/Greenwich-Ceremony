<template>
  <div
    v-if="show"
    :class="['p-4 rounded-lg border-l-4 mb-4', typeClasses]"
    role="alert"
  >
    <div class="flex items-start gap-3">
      <span class="material-symbols-outlined flex-shrink-0">{{ icon }}</span>
      <div class="flex-1">
        <p v-if="title" class="font-semibold mb-1">{{ title }}</p>
        <p class="text-sm">{{ message }}</p>
      </div>
      <button
        v-if="dismissible"
        @click="$emit('close')"
        class="text-current opacity-70 hover:opacity-100 transition-opacity"
      >
        <span class="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'info', // info, success, warning, error
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  title: String,
  message: {
    type: String,
    required: true
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  show: {
    type: Boolean,
    default: true
  }
});

defineEmits(['close']);

const typeClasses = computed(() => {
  const classes = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200'
  };
  return classes[props.type];
});

const icon = computed(() => {
  const icons = {
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    error: 'error'
  };
  return icons[props.type];
});
</script>
