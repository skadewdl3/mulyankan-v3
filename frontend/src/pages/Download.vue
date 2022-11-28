<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const { retrieveDocument } = await import('@/logic/download/retrieveDocument')
const { executeEditing } = await import('@/logic/download/edit')
const { executePreprocessing } = await import('@/logic/download/preprocess')
const { downloadPDF } = await import('@/logic/download/oldDownload')
const router = useRouter()
const store = useStore()

const progress = ref(0)

const goBack = () => {
  router.back()
}

const updateProgress = val => {
  progress.value = val
  if (val === 100) {
    setTimeout(() => {
      progress.value = 0
    }, 1000)
  }
}

const getProgress = () => {
  return progress.value
}

const deliver = async () => {
  let doc = await retrieveDocument(updateProgress)
  let preprocessedDoc = await executePreprocessing(
    doc,
    updateProgress,
    getProgress
  )
  let editedDoc = await executeEditing(preprocessedDoc, updateProgress)
}

const download = async () => {
  downloadPDF(store.state.images, updateProgress)
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
    <div class="title">{{ $t('Download.title') }}</div>
    <div class="download-options">
      <button class="file-download-btn" @click="download">
        {{ $t('Download.download') }}
      </button>

      <button class="file-download-btn" @click="deliver">
        Deliver - Beta (there may be bugs)
      </button>
    </div>

    <div class="progress" v-if="progress > 0">Progress: {{ progress }}%</div>
  </div>
</template>

<style lang="stylus" scoped>
.download
  background neutral
  container()

.download-options
  display flex
  flex-direction column
  align-items flex-start
  button
    margin-bottom 2rem

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
