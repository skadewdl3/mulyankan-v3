const { readFileSync } = require('fs')
const { resolve } = require('path')

const getPath = locale => {
  return resolve(__dirname, '..', 'translations', `${locale}.json`)
}

// Just add your language to this list with proper name and locale.
// The locale should be the same as the file name in the languages folder.
// Please make sure that the name of the language is in the language itself.

const languages = [
  { name: 'English', locale: 'en' },
  { name: 'मराठी', locale: 'mr' }
]

// const translations = {
//   en: {
//     name: 'English',
//     translation: json.parse(readFileSync(getPath('en'), 'utf-8'))
//   },
//   mr: {}
// }

const getTranslations = () => {
  let translations = languages.reduce((acc, lang) => {
    acc[lang.locale] = {
      translation: JSON.parse(readFileSync(getPath(lang.locale), 'utf-8'))
    }
    return acc
  }, {})
  return translations
}

module.exports = {
  languages,
  getTranslations
}
