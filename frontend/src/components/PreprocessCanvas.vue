<script setup>
import { defineProps, watch, ref } from 'vue'
import { createCanvas } from '@/logic/canvasFunctions'
import { useStore } from 'vuex'
const store = useStore()

const canvas = ref(null)

const props = defineProps(['index', 'src', 'pageWidth'])

// Link the canvas element to fabric js when it is mounted
watch(canvas, () => {
  if (!canvas) return

  // Get the width of the users screen and set the canvas width accordingly
  const pageWidth = document.querySelector('.canvases').offsetWidth

  let fcanvas = createCanvas(`canvas-${props.index}`, props.src, pageWidth)

  // Store all fabric canvases in the store to easily manipulate them later
  store.commit('setImages', [...store.state.images, fcanvas])
})

// This function watches for changes in the width of the page and resizes the canvas accordingly
watch([() => props.pageWidth, () => store.state.zoom], () => {
  if (!canvas) return

  const pageWidth = document.querySelector('.canvases').offsetWidth

  store.state.images.map(fcanvas => {
    let zoom = store.state.zoom
    let backgroundImage = fcanvas._objects[0]
    let scaleFactor = (pageWidth / fcanvas.width) * zoom
    let bgScaleFactor = (pageWidth / backgroundImage.width) * zoom

    backgroundImage.set({
      scaleX: bgScaleFactor,
      scaleY: bgScaleFactor
    })

    fcanvas.setDimensions({
      width: pageWidth * zoom,
      height: fcanvas.height * scaleFactor
    })

    fcanvas.renderAll()
  })
})
</script>

<template>
  <canvas ref="canvas" class="canvas" :id="`canvas-${index}`"></canvas>
</template>

<style lang="stylus">
.canvas-container
  margin-bottom 1rem
</style>
