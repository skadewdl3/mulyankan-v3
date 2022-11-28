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

watch([() => store.state.imageSources, () => store.state.numPages], () => {
  if (store.state.imageSources.length === store.state.numPages) {
    store.commit('forceRefresh')
  }
})

onMounted(async () => {
  if (store.state.imageSources.length === 0) {
    router.push('/')
    return
  }
  store.commit('setControls', { show: true, mode: 'preprocess' })

  let interval = setInterval(() => {
    console.log(store.state.imageSources.length, store.state.numPages)

    if (store.state.imageSources.length === store.state.numPages) {
      store.commit('forceRefresh')
      clearInterval(interval)
    }
  }, 500)
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
