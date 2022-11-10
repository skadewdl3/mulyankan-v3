<script setup>
import { useStore } from 'vuex'
const store = useStore()
</script>

<template>
  <div class="controls__wrapper">
    <div class="controls">
      <div class="controls__top">
        <div class="tabs">
          <div class="title">
            <span class="title__logo">Mulyankan</span
            ><span class="title__text">- {{ store.state.controlMode }}</span>
          </div>
        </div>
        <div class="control-btns">
          <button @click="store.commit('zoomIn')">Zoom In</button>
          <button @click="store.commit('zoomOut')">Zoom Out</button>
          <button>Editor</button>
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
  z-index 100
  padding 0.5rem 2rem
  padding-bottom 0
  background neutral
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

  button
    padding 0.5rem 1rem
    background neutral
    border-radius 0.5rem
    font-size 1.5rem
    margin 0 1rem
    cursor pointer
    transition all .2s ease-out
    &:hover
      background #eee
    &:last-child
      margin-right 0
</style>
