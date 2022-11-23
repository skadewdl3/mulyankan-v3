<script setup>
import axios from 'axios'
import { useStore } from 'vuex'
import { onMounted, ref, watch, computed } from 'vue'
import { changeLanguage } from '@/logic/translator'
import { useRouter } from 'vue-router'

const store = useStore()
const languageList = ref([])
const langDropdown = ref(false)
const router = useRouter()
const defaultSettings = computed(() => store.state.defaultSettings)

onMounted(async () => {
  let { data: languages } = await axios.get('%BASE_URL%/languages')
  languageList.value = languages

  let { data: settings } = await axios.get('%BASE_URL%/settings')
  store.commit('setDefaultSettings', settings)
  console.log(store.state.defaultSettings)
  changeLanguage(store.state.defaultSettings.locale)
})

const updateSettings = async () => {
  let res = await axios
    .post('%BASE_URL%/updatesettings', {
      data: {
        settings: store.state.defaultSettings
      }
    })
    .catch(err => console.log(err))
  return res.data
}

const setLangDropdown = val => {
  if (val === 'open') {
    langDropdown.value = true
  } else {
    langDropdown.value = false
  }
}

watch(langDropdown, () => {
  const closeDropdown = () => {
    langDropdown.value = false
    document.removeEventListener('click', closeDropdown)
  }
  if (langDropdown.value) {
    setTimeout(() => {
      document.addEventListener('click', closeDropdown)
    }, 0)
  }
})

const changeLang = async locale => {
  let newSettings = {
    ...defaultSettings.value,
    locale
  }
  store.commit('setDefaultSettings', newSettings)
  let res = await updateSettings()
  console.log(res)
  changeLanguage(locale)
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="settings">
    <div class="logo">
      <span @click="goBack" class="back"><icon-arrow-left /></span>
      <span>Mulyankan</span>
    </div>
    <div class="title">{{ $t('Settings.title') }}</div>

    <div class="settings-section">
      <div class="settings-section-name">
        {{ $t('Settings.changeLanguage') }}
      </div>
      <div class="settings-section-content" v-if="languageList.length !== 0">
        <div class="lang-dropdown-wrapper">
          <button
            class="lang-dropdown-trigger"
            @click="setLangDropdown('open')"
          >
            {{
              languageList.reduce((name, lang) => {
                if (lang.locale === store.state.defaultSettings.locale) {
                  name = lang.name
                }
                return name
              }, 'Language')
            }}
            <icon-down class="lang-dropdown-trigger-icon" />
          </button>
          <ul
            :class="`lang-dropdown ${
              langDropdown ? 'lang-dropdown-visible' : ''
            }`"
          >
            <li
              v-for="language in languageList"
              class="lang-dropdown-item"
              @click="changeLang(language.locale)"
            >
              {{ language.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="settings-section-content" v-else>
        Oops! There was a problem with retrieving the language list. Please
        contact us and we'll resolve this ASAP
      </div>
    </div>

    <!-- <button class="lang-change-btn">Download</button> -->
  </div>
</template>

<style scoped lang="stylus">
.settings
  container()
.settings-section
  margin-top 2rem
  padding 1rem 2rem
  background neutral
  border-radius 0.5rem
  &-name
    font-size 2rem
    font-weight 300
  &-content
    font-size 1.5rem

.lang-dropdown
  list-style none

  transform scale(0)
  transform-origin 0 0
  transition transform 0.2s ease-in-out
  background #fff
  min-width 10rem
  border-radius 0.5rem
  border solid 0.2rem rgba(#ccc,0.5)
  &-item
    padding 0.5rem 1rem
    cursor pointer
    transition all .2s ease-in-out
    &:hover
      background #eee
  &-wrapper
    position relative
  &-visible
    transform scale(1)
  &-trigger
    padding 0.5rem 1rem
    background #fff
    border solid 0.2rem rgba(#ccc, 0.5)
    border-radius 0.5rem
    cursor pointer
    position absolute
    top 0
    left 0
    &-icon
      font-size 1rem
      margin-left 1rem

.back
  font-size 1.5rem
  color #000
  margin-right 1rem
  cursor pointer
  transition all .2s ease-in-out
  &:hover
    color primary

.lang-change-btn
  background primary
  color #fff
  padding 1rem 2rem
  border-radius 0.5rem
  font-size 1.5rem
  cursor pointer
</style>
