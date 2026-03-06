import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import vi from './locales/vi.json'

// Retrieve language from local storage or default to English
const savedLanguage = localStorage.getItem('language') || 'en'

const i18n = createI18n({
    locale: savedLanguage, // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: {
        en,
        vi
    },
    legacy: false // use Vue 3 Composition API
})

export default i18n
