<script setup>
import { onMounted, watch, ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// import throttle from 'lodash.throttle'
import PreprocessCanvas from '@/components/preprocessing/PreprocessCanvas.vue'
const store = useStore()
const router = useRouter()

const canvasContainer = ref(null)

// Default values for the pageWidth is width of canvasContainer
const pageWidth = ref(canvasContainer.value?.offsetWidth)

// Updates the pageWidth when window is resized (throttled to run only once every 300ms)
// const updatePageWidth = throttle(
//   () => {
//     pageWidth.value = canvasContainer.value?.offsetWidth
//   },
//   300,
//   { leading: false }
// )

// window.addEventListener('resize', updatePageWidth)

onMounted(() => {
  if (store.state.imageSources.length === 0) {
    router.push('/')
    return
  }
  store.commit('setControls', { show: true, mode: 'preprocess' })
})
</script>

<template>
  <div class="preprocess">
    <div class="canvases" ref="canvasContainer">
      <PreprocessCanvas
        v-for="(image, index) in store.state.imageSources"
        :index="index"
        :src="image"
        :pageWidth="pageWidth"
        :key="`${index}-${image}`"
      />
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.preprocess
  container()
  background neutral
  overflow auto
</style>
