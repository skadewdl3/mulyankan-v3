<script setup>
import { useStore } from 'vuex'
import PreprocessControls from '@/components/preprocessing/PreprocessControls.vue'
import EditorControls from '@/components/editor/EditorControls.vue'
const store = useStore()
</script>

<template>
  <PreprocessControls v-if="store.state.controlMode === 'preprocess'" />
  <EditorControls v-if="store.state.controlMode === 'editor'" />
</template>

<style lang="stylus" scoped></style>
