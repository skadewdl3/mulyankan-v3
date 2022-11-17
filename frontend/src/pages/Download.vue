<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { downloadPDF } from '@/logic/pdfFunctions '
const router = useRouter()
const store = useStore()

const progress = ref(0)

const goBack = () => {
  router.push('/editor')
}

const updateProgress = val => {
  progress.value = val
  if (val === 100) {
    setTimeout(() => {
      progress.value = 0
    }, 1000)
  }
}

const download = () => {
  store.commit('maxZoom')
  downloadPDF(store.state.images, updateProgress)
  store.commit('resetZoom')
}

onMounted(() => {
  if (store.state.images.length === 0) {
    router.push('/')
  }
})
</script>

<template>
  <div class="download">
    <div class="logo">
      <span @click="goBack" class="back"><icon-arrow-left /></span>
      <span>Mulyankan</span>
    </div>
    <div class="title">Download</div>
    <button class="file-download-btn" @click="download">Download</button>

    <div class="progress" v-if="progress > 0">Progress: {{ progress }}%</div>
  </div>
</template>

<style lang="stylus" scoped>
.download
  background neutral
  container()

.logo
  font-family megrim
  font-size 2.5rem
  font-weight bold
  color primary
  display flex
  align-items center
.title
  font-size 4rem
  font-weight 700

.back
  font-size 1.5rem
  color #000
  margin-right 1rem
  cursor pointer
  transition all .2s ease-in-out
  &:hover
    color primary

.file-download-btn
  background primary
  color #fff
  padding 1rem 2rem
  border-radius 0.5rem
  font-size 1.5rem
  cursor pointer

.progress
  font-size 1.7rem
  margin 2rem 0
</style>
