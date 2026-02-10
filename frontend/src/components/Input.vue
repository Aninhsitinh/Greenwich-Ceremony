<template>
  <div class="flex flex-col w-full">
    <label v-if="label" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="computedType"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :class="inputClasses"
      />
      <div v-if="icon || type === 'password'" class="absolute right-3 top-1/2 -translate-y-1/2">
        <button
          v-if="type === 'password'"
          type="button"
          @click="togglePassword"
          class="text-gray-500 hover:text-primary transition-colors"
        >
          <span class="material-symbols-outlined text-xl">
            {{ showPassword ? 'visibility_off' : 'visibility' }}
          </span>
        </button>
        <span v-else-if="icon" class="material-symbols-outlined text-gray-500">{{ icon }}</span>
      </div>
    </div>
    <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
    <p v-else-if="hint" class="text-gray-500 dark:text-gray-400 text-xs mt-1">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  icon: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  hint: String,
  autocomplete: String
});

defineEmits(['update:modelValue']);

const showPassword = ref(false);

const computedType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

const inputClasses = computed(() => {
  const base = 'w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-800 dark:text-white';
  const error = props.error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary';
  const disabled = props.disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-60' : 'bg-white';
  const padding = (props.icon || props.type === 'password') ? 'pr-12' : '';
  
  return [base, error, disabled, padding].join(' ');
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>
