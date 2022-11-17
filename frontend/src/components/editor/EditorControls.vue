<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { savePDF } from '@/logic/pdfFunctions'

import MarkingTab from '@/components/editor/tabs/MarkingTab.vue'
import MathTab from '@/components/editor/tabs/MathTab.vue'
import ClipboardTab from '@/components/editor/tabs/ClipboardTab.vue'

const store = useStore()
const router = useRouter()
const currentTab = ref('marking')
const activeTab = ref(null)

watch([currentTab, activeTab], () => {
  if (!currentTab.value || !activeTab.value) return
  let currentTabEl = document.querySelector(`.tab-${currentTab.value}`)
  let activeTabEl = document.querySelector('.active-tab')
  if (!currentTabEl || !activeTabEl) return
  activeTabEl.style.width = `${currentTabEl.offsetWidth + 20}px`
  activeTabEl.style.left = `${currentTabEl.offsetLeft - 10}px`
  activeTabEl.style.height = `${currentTabEl.offsetHeight + 16}px`
})

const controlButtons = [
  {
    text: 'Reset Zoom',
    icon: 'icon-reset-zoom',
    action: () => store.commit('resetZoom')
  },
  {
    text: 'Zoom In',
    icon: 'icon-zoom-in',
    action: () => store.commit('zoomIn')
  },
  {
    text: 'Zoom Out',
    icon: 'icon-zoom-out',
    action: () => store.commit('zoomOut')
  },
  {
    text: 'Save To Drive',
    icon: 'icon-save',
    action: () => {
      // savePDF(store.state.images)
    },
    primary: true
  },
  {
    text: 'Download',
    icon: 'icon-download',
    action: () => {
      router.push('/download')
    },
    primary: true
  }
]

const tabs = [
  {
    name: 'Marking',
    component: MarkingTab,
    id: 'marking'
  },
  {
    name: 'Clipboard',
    component: ClipboardTab,
    id: 'clipboard'
  },
  {
    name: 'Math',
    component: MathTab,
    id: 'math'
  }
]
</script>

<template>
  <div class="controls__wrapper">
    <div class="controls">
      <div class="controls__top">
        <div class="controls__top-left">
          <div class="title">
            <icon-arrow-left class="back-icon" @click="router.push('/')" />
            <span class="title__logo">Mulyankan</span
            ><span class="title__text">- {{ store.state.controlMode }}</span>
          </div>
          <div class="separator"></div>
          <div class="tabs">
            <div class="active-tab" ref="activeTab"></div>
            <div
              v-for="tab in tabs"
              :class="`tab ${tab.id === currentTab ? 'tab-current' : ''} tab-${
                tab.id
              }`"
              @click="currentTab = tab.id"
            >
              <span>{{ tab.name }}</span>
              <div class="underline"></div>
            </div>
          </div>
        </div>
        <div class="control-btns">
          <button
            v-for="btn in controlButtons"
            @click="btn.action"
            :class="`control-btn ${btn.primary ? 'control-btn-primary' : ''}`"
          >
            <span class="control-btn-text">{{ btn.text }}</span>
            <component :is="btn.icon" class="control-btn-icon" />
          </button>
        </div>
      </div>
      <div class="controls-content">
        <MarkingTab v-if="currentTab === 'marking'" />
        <MathTab v-if="currentTab === 'math'" />
        <ClipboardTab v-if="currentTab === 'clipboard'" />
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.controls__wrapper
  position sticky
  top 0
  z-index 15
  +atTablet()
    padding 0.5rem
    padding-top 0
    padding-bottom 0
  +atDesktop()
    padding 0.5rem 2rem
    padding-top 0
    padding-bottom 0
  background neutral

.back-icon
  font-size 1.5rem
  margin-right 1rem
  cursor pointer
  transition all .2s ease-out
  &:hover
    color primary
.controls
  width 100%
  border-radius 0.5rem
  padding 0.5rem 0
  background neutral

  &__top
    display flex
    align-items center
    justify-content space-between
    padding 0.5rem 1rem
    &-left
      display flex

  .tabs
    display flex
    position relative
    width 20rem
    align-items center
    .active-tab
      position absolute
      top -0.5rem
      background #fff
      border solid 0.2rem rgba(#ccc, 0.5)
      border-bottom solid 0.2rem #fff
      border-top-left-radius 0.5rem
      border-top-right-radius 0.5rem
      z-index 10
      transition all .2s ease-in-out

    .tab
      font-size 1.5rem
      margin 0 1rem
      cursor pointer
      z-index 11

      &-current
        background #fff

  .title
    display flex
    align-items center
    &__logo
      font-size 2rem
      font-family megrim
      font-weight bold
      color primary
      margin-right 0.5rem
    &__text
      font-size 1.5rem
      text-transform capitalize

  .control-btns
    display flex
  .control-btn
    padding 0.5rem 1rem
    background #fff
    border-radius 0.5rem
    font-size 1.5rem
    margin 0 1rem
    cursor pointer
    display flex
    align-items center
    justify-content center
    transition all .2s ease-out
    border solid 0.2rem neutral
    &-text
      +mobile()
        display none
      +atMobile()
        display none
      +atDesktop()
        display inline


    &:hover
        border solid 0.2rem rgba(#ccc, 0.5)

    &:last-child
      margin-right 0
    &-icon
      margin-left 0.5rem
    &-primary
      .control-btn-text
        display inline
      &:hover
        background primary
        color #fff
        border solid 0.2rem primary


.separator
  height 2rem
  width 0.1rem
  background #ccc
  margin 0 1rem

.controls-content
  padding 0.5rem 1rem
  background #fff
  border-radius 0.5rem
  border solid 0.2rem rgba(#ccc, 0.5)
  display flex
  justify-content center
</style>
