import { createI18n } from 'vue-i18n'

/* Please follow this format for adding translations

const [language] = {
  [pageName]: {
    //translations
  }
}

pageName refers to components in the frontend/src/pages directory. For example, if you want to add translations for the Download page, the pageName would be "Download" (with capital D). If you want to add translations for the Editor page, the pageName would be "Editor" (with capital E).

For frontend/src/component/tabs directory, the pageName would be the name of the tab component, not the page component. For example, if you want to add translations for the MarkingTab component, the pageName would be MarkingTab (with capital M).

*/

// Import translations from languages folder
import en from './languages/en' // English
import mr from './languages/mr' // Marathi

// Add the language name and local to the list
export const languages = [
  { name: 'English', locale: 'en' },
  { name: 'Marathi', locale: 'mr' }
]

// Creating the i18n instance
export const i18n = createI18n({
  locale: 'en',
  fallback: 'en',
  messages: {
    en,
    mr
  }
})

// Function to change the locale
export const changeLanguage = lang => {
  i18n.global.locale = lang
}
