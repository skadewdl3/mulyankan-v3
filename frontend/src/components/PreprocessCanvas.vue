<script setup>
import { defineProps, watch, ref } from 'vue'
import { createCanvas } from '@/logic/canvasFunctions'
import { useStore } from 'vuex'
const store = useStore()

const canvas = ref(null)

const props = defineProps(['index', 'src'])

watch(canvas, () => {
  if (!canvas) return
  let fcanvas = createCanvas(`canvas-${props.index}`, props.src)
  store.commit('setImages', [...store.state.images, fcanvas])
  console.log(store.state.images)
})
</script>

<template>
  <canvas ref="canvas" class="canvas" :id="`canvas-${index}`"></canvas>
</template>

<style></style>
