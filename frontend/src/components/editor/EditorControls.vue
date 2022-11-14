<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { savePDF } from '@/logic/pdfFunctions'

import MarkingTab from '@/components/editor/tabs/MarkingTab.vue'
import MathTab from '@/components/editor/tabs/MathTab.vue'

const store = useStore()
const router = useRouter()
const currentTab = ref('marking')

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
      savePDF(store.state.images)
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
        <div class="tabs">
          <div class="title">
            <icon-arrow-left class="back-icon" @click="router.push('/')" />
            <span class="title__logo">Mulyankan</span
            ><span class="title__text">- {{ store.state.controlMode }}</span>
          </div>
          <div class="separator"></div>
          <div v-for="tab in tabs" class="tab" @click="currentTab = tab.id">
            <span>{{ tab.name }}</span>
            <div class="underline"></div>
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
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.controls__wrapper
  position sticky
  top 0
  z-index 100
  padding 0.5rem 2rem
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
  background #fff
  width 100%
  border-radius 0.5rem
  padding 0.5rem 0
  border solid 0.2rem rgba(#ccc, 0.5)

  &__top
    display flex
    align-items center
    justify-content space-between
    padding 0.5rem 1rem

  .tabs
    display flex
    align-items center

    .tab
      font-size 1.5rem
      margin 0 1rem
      cursor pointer
      .underline
        transition all .2s ease-in-out
        opacity 0
        width 100%
        height 0.1rem
        background #ccc
        transform scaleX(0)
        border-radius 10rem
      &:hover
        .underline
          transform scaleX(1)
          opacity 1

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
    background neutral
    border-radius 0.5rem
    font-size 1.5rem
    margin 0 1rem
    cursor pointer
    display flex
    align-items center
    justify-content center
    transition all .2s ease-out
    &-text
      +mobile()
        display none
      +atMobile()
        display none
      +atDesktop()
        display inline


    &:hover
      background #eee
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

.separator
  height 2rem
  width 0.1rem
  background #ccc
  margin 0 1rem

.controls-content
  padding 0.5rem 1rem
</style>
