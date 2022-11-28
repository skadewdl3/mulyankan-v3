<script setup>
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
const { changeLanguage } = await import('@/logic/translator')

const setupStage = ref(0)
const store = useStore()
const settings = ref(store.state.defaultSettings)
const numStages = ref(3)

const colors = [
  {
    name: 'red',
    hex: '#ff0000',
    rgb: {
      r: 255,
      g: 0,
      b: 0
    }
  },
  {
    name: 'green',
    hex: '#27ae60',
    rgb: {
      r: 39,
      g: 174,
      b: 96
    }
  },
  {
    name: 'blue',
    hex: '#3498db',
    rgb: {
      r: 52,
      g: 152,
      b: 219
    }
  },
  {
    name: 'orange',
    hex: '#f39c12',
    rgb: {
      r: 243,
      g: 156,
      b: 18
    }
  },
  {
    name: 'black',
    hex: '#2d3436',
    rgb: {
      r: 45,
      g: 52,
      b: 54
    }
  }
]

onMounted(async () => {
  const { data: setup } = await axios.get('%BASE_URL%/setup')
  updateStatus(setup.status)
})

const hide = ref(true)
const remove = ref(true)
const message = ref('')
const languages = ref([])
const saving = ref(false)

watch([hide, remove], async () => {
  if (hide.value || remove.value) return
  let { data: langs } = await axios.get('%BASE_URL%/languages')
  languages.value = langs
})

const getSetupStage = () => {
  let stage = ''
  switch (setupStage.value) {
    case 0:
      stage = ''
      break
    case 1:
      stage = 'Language'
      break
    case 2:
      stage = 'Color'
      break
    case 3:
      stage = 'Complete'
      break
    default:
      stage = ''
      break
  }
  return stage
}
const updateStatus = status => {
  if (status === 'incomplete') {
    hide.value = true
    remove.value = false
    message.value = `Hey there! It seems you're new to Mulyankan. Would you like to go through a short setup, so we can customise Mulyankan to your needs ?`
  } else if (status === 'later') {
    hide.value = true
    remove.value = false
    message.value = `If you're ready, would you like to setup Mulyankan so we can customise it to your needs ?`
  } else if (status === 'complete') {
    hide.value = true
    remove.value = true
  }
}
const updateSettings = updates => {
  if (updates.locale) {
    changeLanguage(updates.locale)
  }
  settings.value = {
    ...settings.value,
    ...updates
  }
}
const doLater = () => {
  axios.post('%BASE_URL%/setup', { status: 'later' })
  remove.value = true
}
const showSetup = () => {
  hide.value = false
  axios.post('%BASE_URL%/setup', { status: 'later' })
}
const completeSetup = async () => {
  saving.value = true
  store.commit('setDefaultSettings', settings.value)
  await axios.post('%BASE_URL%/updatesettings', {
    data: { settings: settings.value }
  })
  await axios.post('%BASE_URL%/setup', { status: 'complete' })
  remove.value = true
}
</script>

<template>
  <Teleport to="#app" v-if="!remove">
    <div class="setup-notification" v-if="hide">
      <div class="setup-notification-text">{{ message }}</div>
      <div class="setup-notification-actions">
        <div class="setup-notification-action" @click="doLater">
          I'll do it later.
        </div>
        <div
          class="setup-notification-action setup-notification-action-cta"
          @click="showSetup"
        >
          Yes!
        </div>
      </div>
    </div>
    <div class="setup" v-if="!hide">
      <div class="setup-content">
        <div class="setup-title">Setup {{ getSetupStage() }}</div>
        <div class="setup-item">
          <template v-if="setupStage === 0">
            <span class="setup-item-description">
              Hey there! We'll now do some setting up to make Mulyankan
              personalised to you. Click the button below to start.
            </span>
          </template>
          <template v-if="setupStage === 1">
            <span class="setup-item-description">
              Please select the language you're most comfortable with. We'll
              display all of Mulyankan in this language.
            </span>
            <div class="setup-item-content languages">
              <div
                :class="`language ${
                  lang.locale === settings.locale ? 'language-selected' : ''
                }`"
                v-for="lang in languages"
                @click="updateSettings({ locale: lang.locale })"
              >
                <span>{{ lang.name }}</span>
              </div>
            </div>
          </template>
          <template v-if="setupStage === 2">
            <span class="setup-item-description">
              Please choose the color you prefer for symbols and text. Don't
              worry, you'll be able to change this later if necessary.
            </span>
            <div class="setup-item-content colors">
              <div
                class="color"
                :style="{ backgroundColor: col.hex }"
                v-for="col in colors"
                @click="updateSettings({ color: col.hex })"
              >
                <div
                  class="patch"
                  :style="{
                    transform: `translate(-50%, -50%) ${
                      settings.color === col.hex ? 'scale(1)' : 'scale(0)'
                    }`
                  }"
                ></div>
              </div>
            </div>
          </template>
          <template v-if="setupStage === 3">
            <span class="setup-item-description">
              All done! Just hit the save button below and we'll save your
              preferences for you. You can chage these later any time from the
              Settings page.
            </span>
          </template>
          <div class="setup-item-cta">
            <button
              @click="setupStage--"
              v-if="setupStage > 0"
              class="setup-item-cta-back setup-item-cta-btn"
            >
              <icon-left class="setup-item-cta-icon setup-item-cta-back-icon" />
              <span>Back</span>
            </button>
            <button
              @click="
                () => {
                  if (setupStage === numStages) {
                    completeSetup()
                  } else {
                    setupStage++
                  }
                }
              "
              class="setup-item-cta-btn"
            >
              <span>{{
                setupStage === numStages
                  ? 'Save'
                  : setupStage === 0
                  ? 'Start'
                  : 'Next'
              }}</span>
              <icon-right
                class="setup-item-cta-icon"
                v-if="!saving && setupStage !== numStages"
              />
              <icon-save
                class="setup-item-cta-icon"
                v-if="!saving && setupStage === numStages"
              />
              <icon-loading class="setup-item-cta-icon" v-if="saving" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="stylus" scoped>

.setup
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 100%
  height 100vh
  background rgba(#000, 0.8)
  display flex
  align-items center
  justify-content center

  &-content
    width 50%
    background #fff
    border-radius 1rem
    padding 2rem
  &-title
    font-size 3rem
    font-weight bold

.setup-item
  margin-top 1rem
  &-name
    font-size 2rem
  &-description
    font-size 1.5rem
    font-weight 300
  &-content
    margin-top 1rem

  &-cta
    display flex
    align-items center
    justify-content space-between
    margin-top 2rem
    &-btn
      font-size 1.5rem
      color #fff
      background primary
      border-radius 0.5rem
      padding 0.5rem 1rem
      display flex
      cursor pointer
      align-items center
    &-icon
      font-size 1rem
      margin-left 1rem
    &-back
      &-icon
        margin-left 0
        margin-right 1rem
      color #000
      border solid 0.2rem rgba(#ccc, 0.5)
      background #fff


.setup-notification
  background neutral
  padding 1rem 2rem
  position absolute
  bottom 0.5rem
  left 0.5rem
  font-size 1.5rem
  max-width 40%
  border-radius 0.5rem
  border solid 0.2rem rgba(#ccc, 0.5)

  &-actions
    padding-top 1rem
    display flex
    align-items center
    justify-content space-between
  &-action
    color #636e72
    &-cta
      color primary
    text-decoration underline
    cursor pointer

.languages
  border solid 0.2rem rgba(#ccc, 0.5)
  padding 0.5rem 1rem
  font-size 1.5rem
  border-radius 0.5rem
  max-height 11rem
  overflow-y auto
  &::-webkit-scrollbar
    width 0.5rem
    &-thumb
      background #ccc
      border-radius 0.5rem
      &:hover
        background #aaa

  .language
    padding 0.5rem 1rem
    cursor pointer
    border-radius 0.5rem
    transition all .2s ease-in-out
    &:hover
      background #eee
    &-selected
      background #eee

.colors
  display flex
  align-items center
  justify-content space-between
  width 60%
  margin 2rem auto

  .color
    width 4rem
    height 4rem
    border-radius 0.5rem
    cursor pointer
    position relative
    .patch
      position absolute
      top 50%
      left 50%
      width 2.5rem
      height 2.5rem
      border-radius 0.3rem
      background #fff
      transition all .2s ease-in-out
</style>
