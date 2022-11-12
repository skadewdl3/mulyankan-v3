<script setup>
import { defineProps, watch, ref } from 'vue'
import { createCanvas } from '@/logic/canvasFunctions'
import { useStore } from 'vuex'
import { resizeCanvas } from '@/logic/canvasTransforms'
const store = useStore()

const canvas = ref(null)

const props = defineProps(['index', 'src', 'pageWidth'])

// Link the canvas element to fabric js when it is mounted
watch(canvas, () => {
  if (!canvas) return

  // Get the width of the users screen and set the canvas width accordingly
  const pageWidth = document.querySelector('.canvases').offsetWidth

  // Create the canvas using fabric js
  let fcanvas = createCanvas(`canvas-${props.index}`, props.src, pageWidth)

  // Store all fabric canvases in the store to easily manipulate them later
  store.commit('setImages', [...store.state.images, fcanvas])
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
  <canvas ref="canvas" class="canvas" :id="`canvas-${index}`"></canvas>
</template>

<style lang="stylus">
.canvas-container
  margin-bottom 1rem
.canvases
  display flex
  flex-direction column
  align-items center
</style>
