<script setup>
import { defineProps, watch, ref } from 'vue'
import { createCanvas } from '@/logic/canvasFunctions'
import { useStore } from 'vuex'
import { resizeCanvas, rotateCanvas } from '@/logic/canvasTransforms'
const store = useStore()

const canvas = ref(null)

const props = defineProps(['index', 'src', 'pageWidth'])

const canvasControls = [
  {
    icon: 'icon-up',
    action: () => {
      let newSources = [...store.state.imageSources]
      let temp = newSources[props.index - 1]
      newSources[props.index - 1] = newSources[props.index]
      newSources[props.index] = temp
      store.commit('setImageSources', newSources)
    },
    condition: props.index > 0
  },
  {
    icon: 'icon-down',
    action: () => {
      let newSources = [...store.state.imageSources]
      let temp = newSources[props.index + 1]
      newSources[props.index + 1] = newSources[props.index]
      newSources[props.index] = temp
      store.commit('setImageSources', newSources)
    },
    condition: props.index < store.state.imageSources.length - 1
  },
  {
    icon: 'icon-rotate-left',
    action: async () => {
      let newSources = await rotateCanvas(
        store.state.imageSources,
        'left',
        props.index
      )
      store.commit('setImageSources', newSources)
    }
  },
  {
    icon: 'icon-rotate-right',
    action: async () => {
      let newSources = await rotateCanvas(
        store.state.imageSources,
        'right',
        props.index
      )
      store.commit('setImageSources', newSources)
    }
  },

  {
    icon: 'icon-delete',
    action: () => {
      let newSources = store.state.imageSources.filter(
        (_, i) => i !== props.index
      )
      store.commit('setImageSources', newSources)
    }
  }
]

// Link the canvas element to fabric js when it is mounted
watch(canvas, () => {
  if (!canvas) return

  // Get the width of the users screen and set the canvas width accordingly
  const pageWidth = document.querySelector('.canvases').offsetWidth

  // Create the canvas using fabric js
  let fcanvas = createCanvas(
    `canvas-${props.index}`,
    props.src,
    pageWidth,
    store.state.zoom
  )

  // Store all fabric canvases in the store to easily manipulate them later
  if (store.state.images[props.index]) {
    let temp = store.state.images
    temp[props.index] = fcanvas
    store.commit('setImages', temp)
  } else {
    store.commit('setImages', [...store.state.images, fcanvas])
  }
})

// This function watches for changes in the width of the page and resizes the canvas accordingly
watch([() => props.pageWidth, () => store.state.zoom], () => {
  if (!canvas) return
  const pageWidth = document.querySelector('.canvases').offsetWidth
  let fcanvas = store.state.images[props.index]
  let zoom = store.state.zoom
  resizeCanvas(fcanvas, zoom, pageWidth)
})
</script>

<template>
  <div class="canvas-controls-wrapper">
    <div class="canvas-controls">
      <template v-for="btn in canvasControls">
        <button
          @click="btn.action"
          v-if="btn.condition === undefined || btn.condition"
          class="control-btn"
        >
          <component :is="btn.icon" class="control-btn-icon"></component>
        </button>
      </template>
    </div>
  </div>
  <canvas ref="canvas" class="canvas" :id="`canvas-${index}`"></canvas>
</template>

<style lang="stylus">
.canvas-container
  margin-bottom 1rem
.canvases
  display flex
  flex-direction column
  align-items center
.canvas-controls-wrapper
    display flex
    width 100%
    justify-content flex-end
  .canvas-controls
    background #fff
    padding 0.5rem 1rem
    border-radius 0.5rem
    margin-bottom 0.5rem
    display flex
    justify-content flex-end
    border solid 0.2rem rgba(#ccc, 0.5)
  .control-btn
    padding 0.5rem
    background neutral
    border-radius 0.5rem
    font-size 1.5rem
    margin 0 0.5rem
    cursor pointer
    display flex
    align-items center
    justify-content center
    transition all .2s ease-out
    &:hover
      background #eee
    &:first-child
      margin-left 0
    &:last-child
      margin-right 0
</style>
