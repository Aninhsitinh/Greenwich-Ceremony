<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-if="icon && !loading" class="material-symbols-outlined" :class="{ 'mr-2': $slots.default }">{{ icon }}</span>
    <span v-if="!loading"><slot></slot></span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary', // primary, secondary, danger, success, outline
    validator: (value) => ['primary', 'secondary', 'danger', 'success', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: Boolean,
  loading: Boolean,
  icon: String,
  fullWidth: Boolean
});

defineEmits(['click']);

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
    success: 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm h-9',
    md: 'px-4 py-3 text-base h-11',
    lg: 'px-6 py-4 text-lg h-14'
  };
  
  const width = props.fullWidth ? 'w-full' : '';
  
  return [base, variants[props.variant], sizes[props.size], width].join(' ');
});
</script>
