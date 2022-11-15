<script setup>
import { defineProps, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { loadCanvas } from '@/logic/canvasFunctions'
import { resizeCanvas, updateStyle } from '@/logic/canvasTransforms'

const store = useStore()
const canvas = ref(null)

const props = defineProps(['index', 'fcanvas'])

watch(canvas, async () => {
  const pageWidth = document.querySelector('.canvases').offsetWidth

  // Loads the fcanvas from the rotated/transformed images
  let fcanvas = await loadCanvas(
    props.fcanvas,
    `canvas-${props.index}`,
    pageWidth,
    store.state.zoom,
    store.getters.getStyle
  )

  // Replaces the previous fcanvas with the regenrated fcanvas
  let temp = store.state.images
  temp[props.index] = fcanvas
  store.commit('setImages', temp)
})

// This function watches for changes in the width of the page and resizes the canvas accordingly
watch([() => store.state.zoom], () => {
  if (!canvas) return
  const pageWidth = document.querySelector('.canvases').offsetWidth
  let fcanvas = store.state.images[props.index]
  let zoom = store.state.zoom
  let prevZoom = store.state.prevZoom
  resizeCanvas(fcanvas, zoom, prevZoom, pageWidth)
})

watch(
  [
    () => store.state.style.font,
    () => store.state.style.fontSize,
    () => store.state.style.color,
    () => store.state.forceRefreshKey
  ],
  () => {
    let fcanvas = store.state.images[props.index]
    if (!fcanvas.getActiveObject()) return
    updateStyle(fcanvas.getActiveObject(), store.state.style)
    fcanvas.renderAll()
  }
)
</script>

<template>
  <canvas :id="`canvas-${props.index}`" ref="canvas"></canvas>
</template>

<style lang="stylus"></style>
