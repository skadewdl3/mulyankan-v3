<script setup>
import { onMounted, mounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()

onMounted(() => {
  if (store.state.imageSources.length === 0) {
    router.push('/')
  }
})
</script>

<template>
  <div class="preprocess">
    <div class="logo">Mulyankan</div>
    <div class="title">Preprocess</div>
  </div>
</template>

<style lang="stylus" scoped>
.preprocess
  container()

.logo
  font-family megrim
  font-size 2.5rem
  font-weight bold
  color primary
.title
  font-size 4rem
  font-weight 700
</style>
