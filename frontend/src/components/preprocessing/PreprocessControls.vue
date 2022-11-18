<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { rotateCanvas } from '@/logic/canvasTransforms'
const store = useStore()
const router = useRouter()

const controlButtons = [
  {
    text: 'Rotate All Left',
    icon: 'icon-rotate-all-left',
    action: async () => {
      let newSources = await rotateCanvas(
        store.state.imageSources.map(s => s.src),
        'left',
        instruction => store.dispatch('addPreprocessInstruction', instruction),
        { id: undefined, index: undefined }
      )
      let imgSources = newSources.map((src, i) => {
        return {
          src,
          id: store.state.imageSources[i].id
        }
      })
      store.commit('setImageSources', imgSources)
    }
  },
  {
    text: 'Rotate All Right',
    icon: 'icon-rotate-all-right',
    action: async () => {
      let newSources = await rotateCanvas(
        store.state.imageSources.map(s => s.src),
        'right',
        instruction => store.dispatch('addPreprocessInstruction', instruction),
        { id: undefined, index: undefined }
      )
      let imgSources = newSources.map((src, i) => {
        return {
          src,
          id: store.state.imageSources[i].id
        }
      })
      store.commit('setImageSources', imgSources)
    }
  },
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
    text: 'Editor',
    icon: 'icon-arrow-right',
    action: () => {
      if (store.state.images.length !== store.state.imageSources.length) return

      router.push('/editor')
    },
    primary: true
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
        </div>
        <div class="control-btns">
          <button
            v-for="btn in controlButtons"
            @click="btn.action"
            :class="`control-btn ${btn.primary ? 'control-btn-primary' : ''} ${
              store.state.images.length !== store.state.imageSources.length
                ? 'control-btn-inactive'
                : ''
            }`"
          >
            <span class="control-btn-text">{{ btn.text }}</span>
            <component :is="btn.icon" class="control-btn-icon" />
          </button>
        </div>
      </div>
      <div class="controls__content">
        <div class="tab-content"></div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.controls__wrapper
  position sticky
  top 0
  z-index 15
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
    &-inactive
      cursor not-allowed
      opacity 0.5
    &-primary
      .control-btn-text
        display inline
      &:hover
        background primary
        color #fff
</style>
