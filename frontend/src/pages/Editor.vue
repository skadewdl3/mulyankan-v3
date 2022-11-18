<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import EditorCanvas from '@/components/editor/EditorCanvas.vue'
import { updateSavedPDF } from '../logic/pdfFunctions'

const store = useStore()
const router = useRouter()

onMounted(() => {
  if (store.state.images.length === 0) {
    router.push('/')
    return
  }
  ;('mounted')
  store.commit('setControls', { show: true, mode: 'editor' })
})

onUnmounted(() => {
  store.commit('setControls', { show: false, mode: 'editor' })
})

const callback = () => {
  console.log('ok')
  updateSavedPDF(store)
}
</script>

<template>
  <div class="editor">
    <div class="canvases" ref="canvasContainer">
      <EditorCanvas
        v-for="(fcanvas, index) in store.state.images"
        :index="index"
        :fcanvas="fcanvas"
        :key="`${index}`"
        :callback="callback"
        :isLast="index === store.state.images.length - 1"
      />
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.editor
  container()
  background neutral
  overflow auto

.canvases
  display flex
  flex-direction column
  align-items center
</style>

<style lang="stylus">
.canvas-container
  margin-bottom 1rem
</style>
