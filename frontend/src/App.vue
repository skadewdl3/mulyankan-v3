<script setup>
import { ref, defineAsyncComponent, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const showControls = ref(false)

const setShowControls = val => {
  showControls.value = val
}

const Setup = defineAsyncComponent(() => import('@/pages/Setup.vue'))
const PreprocessControls = defineAsyncComponent(() =>
  import('@/components/preprocessing/PreprocessControls.vue')
)
const EditorControls = defineAsyncComponent(() =>
  import('@/components/editor/EditorControls.vue')
)
const Menu = defineAsyncComponent(() => import('@/components/Menu.vue'))

watch(
  () => store.state.preprocessInstructions,
  () => {
    console.log(store.state.preprocessInstructions)
  }
)
</script>

<template>
  <Setup />
  <Menu />
  <Suspense>
    <PreprocessControls
      v-if="
        store.state.controlMode === 'preprocess' && store.state.showControls
      "
    />
  </Suspense>
  <Suspense>
    <EditorControls
      v-if="store.state.controlMode === 'editor' && store.state.showControls"
    />
  </Suspense>
  <Suspense>
    <router-view :setShowControls="setShowControls"></router-view>
  </Suspense>
</template>

<style lang="stylus" scoped></style>
