<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { pdfToBinaryString, pdfBinaryToImages } from '@/logic/pdfFunctions'
const store = useStore()
const router = useRouter()

const fileInput = ref(null)

const openFileInput = () => {
  fileInput?.value.click()
}

const processFile = async e => {
  if (e.target.files.length === 0) return
  let pdfBinary = await pdfToBinaryString(e.target.files[0])
  let imgArr = await pdfBinaryToImages(pdfBinary)
  store.commit('setImageSources', imgArr)
  router.push('/preprocess')
}
</script>

<template>
  <div class="home">
    <div class="logo">Mulyankan</div>
    <div class="title">Your Projects</div>

    <button class="file-upload-btn" @click="openFileInput">Upload</button>
    <input
      ref="fileInput"
      type="file"
      accept="appliation/pdf"
      class="file-input"
      @input="processFile"
    />
  </div>
</template>

<style lang="stylus" scoped>
.home
  background neutral
  container()

.logo
  font-family megrim
  font-size 2.5rem
  font-weight bold
  color primary
.title
  font-size 4rem
  font-weight 700

.file-upload-btn
  background primary
  color #fff
  padding 1rem 2rem
  border-radius 0.5rem
  font-size 1.5rem
  cursor pointer

.file-input
  display none
</style>
