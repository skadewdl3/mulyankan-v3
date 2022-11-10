<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import Controls from '@/components/Controls.vue'
const store = useStore()

const showControls = ref(false)

const setShowControls = val => {
  showControls.value = val
}
</script>

<template>
  <Controls v-if="store.state.showControls" />
  <router-view :setShowControls="setShowControls"></router-view>
</template>

<style lang="stylus" scoped></style>
