<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

onMounted(() => {
  if (store.state.images.length === 0) {
    router.push('/')
    return
  }
  console.log('mounted')
  store.commit('setControls', { show: true, mode: 'editor' })
})
</script>

<template></template>

<style lang="stylus" scoped></style>
