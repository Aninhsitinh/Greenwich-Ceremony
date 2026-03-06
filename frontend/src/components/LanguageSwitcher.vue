<template>
  <div class="language-switcher relative inline-block text-left">
    <button
      @click="toggleDropdown"
      class="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 shadow-sm px-2.5 py-1 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
      id="options-menu"
      aria-haspopup="true"
      aria-expanded="true"
    >
      {{ currentLanguageLabel }}
      <span class="material-symbols-outlined text-[14px] ml-1">expand_more</span>
    </button>

    <div
      v-if="isOpen"
      class="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
    >
      <div class="py-1" role="none">
        <a
          href="#"
          @click.prevent="changeLanguage('en')"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          role="menuitem"
        >
          English
        </a>
        <a
          href="#"
          @click.prevent="changeLanguage('vi')"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          role="menuitem"
        >
          Tiếng Việt
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
  isOpen.value = false
}

const currentLanguageLabel = computed(() => {
  return locale.value === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'
})
</script>

<style scoped>
/* You can add custom styles here if needed, but Tailwind handles most of it */
</style>
