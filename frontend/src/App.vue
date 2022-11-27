<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

import Setup from '@/pages/Setup.vue'
import PreprocessControls from '@/components/preprocessing/PreprocessControls.vue'
import EditorControls from '@/components/editor/EditorControls.vue'
import Menu from '@/components/Menu.vue'
const store = useStore()

const showControls = ref(false)

const setShowControls = val => {
  showControls.value = val
}
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
