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
</script>

<template>
  <Setup />
  <Menu />
  <PreprocessControls
    v-if="store.state.controlMode === 'preprocess' && store.state.showControls"
  />
  <EditorControls
    v-if="store.state.controlMode === 'editor' && store.state.showControls"
  />
  <router-view :setShowControls="setShowControls"></router-view>
</template>

<style lang="stylus" scoped></style>
