<template>
  <div class="inline-block">
    <span :class="['px-3 py-1 rounded-full text-xs font-bold uppercase', colorClasses]">
      <slot>{{ label }}</slot>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: String,
  variant: {
    type: String,
    default: 'default', // default, primary, success, warning, danger, info
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(value)
  },
  status: String // Auto-determine variant from status
});

const colorClasses = computed(() => {
  // Auto-detect variant from status if provided
  let variant = props.variant;
  
  if (props.status) {
    const statusMap = {
      'pending': 'warning',
      'confirmed': 'success',
      'cancelled': 'danger',
      'active': 'success',
      'inactive': 'default',
      'suspended': 'danger',
      'valid': 'success',
      'invalid': 'danger',
      'scanned': 'info'
    };
    variant = statusMap[props.status.toLowerCase()] || 'default';
  }
  
  const classes = {
    default: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-primary/10 text-primary dark:bg-primary/20',
    success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  };
  
  return classes[variant];
});
</script>
