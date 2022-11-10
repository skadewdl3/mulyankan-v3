<script setup>
import { defineProps, watch, ref } from 'vue'
import { createCanvas } from '@/logic/canvasFunctions'
import { useStore } from 'vuex'
const store = useStore()

const canvas = ref(null)

const props = defineProps(['index', 'src', 'pageWidth'])

watch(canvas, () => {
  if (!canvas) return

  // Get the width of the users screen and set the canvas width accordingly
  const pageWidth = document.querySelector('.canvases').offsetWidth

  let fcanvas = createCanvas(`canvas-${props.index}`, props.src, pageWidth)
  store.commit('setImages', [...store.state.images, fcanvas])
  console.log(store.state.images)
})

// This function watches for changes in the width of the page and resizes the canvas accordingly
watch(
  () => props.pageWidth,
  () => {
    if (!canvas) return

    const pageWidth = document.querySelector('.canvases').offsetWidth

    store.state.images.map(fcanvas => {
      let backgroundImage = fcanvas._objects[0]
      let scaleFactor = pageWidth / fcanvas.width
      let bgScaleFactor = pageWidth / backgroundImage.width

      backgroundImage.set({
        scaleX: bgScaleFactor,
        scaleY: bgScaleFactor
      })

      fcanvas.setDimensions({
        width: pageWidth,
        height: fcanvas.height * scaleFactor
      })

      fcanvas.renderAll()
    })
  }
)
</script>

<template>
  <canvas ref="canvas" class="canvas" :id="`canvas-${index}`"></canvas>
</template>

<style lang="stylus">
.canvas-container
  margin-bottom 1rem
</style>
