<script setup>
import { useStore } from 'vuex'
import PreprocessControlsVue from '@/components/preprocessing/PreprocessControls.vue'
const store = useStore()
</script>

<template>
  <PreprocessControlsVue v-if="store.state.controlMode === 'preprocess'" />
</template>

<style lang="stylus" scoped></style>
