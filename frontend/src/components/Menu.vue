<script setup>
import { watch, ref } from 'vue'
import { useStore } from 'vuex'
import {
  deleteSelectedObject,
  copySelectedObject,
  pasteFromClipboard
} from '../logic/canvasFunctions'

const store = useStore()

const isVisible = ref(store.state.menu.show)

const items = [
  {
    name: 'Copy',
    icon: 'icon-copy',
    action: () =>
      copySelectedObject(store.getters.getActiveCanvas, selectedObj =>
        store.dispatch('addToClipboard', selectedObj)
      )
  },
  {
    name: 'Paste',
    icon: 'icon-paste',
    action: () =>
      pasteFromClipboard(
        store.getters.getActiveCanvas,
        store.state.clipboard,
        store.state.menu.pasteCoords,
        store.state.zoom
      )
  },
  {
    name: 'Delete',
    icon: 'icon-delete',
    action: () => deleteSelectedObject(store.getters.getActiveCanvas)
  }
]

watch(
  () => store.state.menu.show,
  () => {
    setTimeout(() => {
      isVisible.value = store.state.menu.show
    }, 150)
  }
)
</script>

<template>
  <div
    :class="`menu ${isVisible ? 'menu-visible' : ''}`"
    :style="{
      top: `${store.state.menu.coords.y}px`,
      left: `${store.state.menu.coords.x}px`
    }"
  >
    <div v-for="item in items" class="menu-item" @click="item.action">
      <component :is="item.icon" class="menu-item-icon" />
      <span class="menu-item-name">{{ item.name }}</span>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.menu
  position absolute
  top 0
  left 0
  background #fff
  border-radius 0.5rem
  min-width 10rem
  z-index 10
  transition all .1s ease-in-out
  border solid 0.2rem rgba(#ccc, 0.5)
  transform scale(0)
  transform-origin 0 0
  &-visible
    transform scale(1)
.menu-item
  font-size 1.5rem
  display flex
  align-items center
  padding 0.5rem 1rem
  background #fff
  &:hover
    background neutral
    cursor pointer
.menu-item-icon
  margin-right 1rem
</style>
