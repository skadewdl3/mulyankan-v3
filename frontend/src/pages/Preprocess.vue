<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue'
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

// watch(
//   () => store.state.imageSources,
//   () => {
//     if (store.state.imageSources.length === store.state.images.length) {
//       store.commit('forceRefresh')
//     }
//   }
// )

watch(
  () => store.state.imageSources,
  () => {
    console.log(store.state.imageSources.length, store.state.numPages)
    if (store.state.imageSources.length === store.state.numPages) {
      store.commit('forceRefresh')
    }
  }
)

onMounted(async () => {
  if (store.state.imageSources.length === 0) {
    router.push('/')
    return
  }
  store.commit('setControls', { show: true, mode: 'preprocess' })
})

onUnmounted(() => {
  store.commit('setControls', { show: false, mode: 'preprocess' })
})
</script>

<template>
  <div class="preprocess">
    <div class="canvases" ref="canvasContainer">
      <PreprocessCanvas
        v-for="(data, index) in store.state.imageSources"
        :index="index"
        :src="data.src"
        :id="data.id"
        :pageWidth="pageWidth"
        :key="`${data.id}-${data.src}-${store.state.forceRefreshKey}`"
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
