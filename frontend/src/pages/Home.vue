<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {
  pdfToBinaryString,
  pdfBinaryToImages,
  bufferToArrayBuffer,
  binaryStringToJSON
} from '@/logic/pdfFunctions'
import { savePDF } from '../logic/pdfFunctions'
import axios from 'axios'
import { resumeCanvases } from '../logic/canvasFunctions'
const store = useStore()
const router = useRouter()

const projects = ref([])
const progress = ref(0)

const chunk = (arr, chunkSize) => {
  return arr.reduce((all, one, i) => {
    const ch = Math.floor(i / chunkSize)
    all[ch] = [].concat(all[ch] || [], one)
    return all
  }, [])
}

// Hide the controls bar by default
onMounted(async () => {
  store.commit('setControls', { show: false })
  let { data } = await axios.get('%BASE_URL%/projects')
  projects.value = chunk(data.items, 5)
})

const fileInput = ref(null)

const openFileInput = () => {
  fileInput?.value.click()
}

const processFile = async e => {
  if (e.target.files.length === 0) return
  let pdfBinary = await pdfToBinaryString(e.target.files[0])
  let projectID = await savePDF(e.target.files[0])
  let imgArr = await pdfBinaryToImages(pdfBinary, 5, store)
  let imgSources = imgArr.map((src, i) => {
    return {
      src,
      id: `${projectID}-${i}`
    }
  })
  store.commit('setImageSources', imgSources)
  store.commit('setProjectID', projectID)
  router.push('/preprocess')
}

const loadFile = async pdfBinary => {
  let imgArr = await pdfBinaryToImages(pdfBinary, 5, store)
  let imgSources = imgArr.map((src, i) => {
    return {
      src,
      id: `${store.state.projectID}-${i}`
    }
  })
  store.commit('setImageSources', imgSources)
  router.push('/preprocess')
}

const getProject = async id => {
  let { data: result } = await axios.get(`%BASE_URL%/getproject/${id}`)
  store.commit('setProjectID', id)
  if (result.type === 'pdf') {
    let pdfBinary = bufferToArrayBuffer(result.buffer.data)
    await loadFile(pdfBinary)
  } else {
    let jsonBinary = bufferToArrayBuffer(result.buffer.data)
    let { pages, preprocess, style, marks, clipboard } =
      await binaryStringToJSON(jsonBinary, val => (progress.value = val))
    let images = await resumeCanvases(pages)
    store.commit('setImages', images)
    store.commit('setPreprocessInstructions', preprocess)
    store.commit('setFont', style.font)
    store.commit('setFontSize', style.fontSize)
    store.commit('setColor', style.color)
    store.commit('setCalculatedMarks', marks.calculated)
    store.commit('setClipboard', clipboard)
    store.commit('setTotalMarks', marks.total)
    router.push('/editor')
    // console.log(binaryStringToJSON(jsonBinary))
  }
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
    <div class="projects" v-if="projects.length > 0">
      <div class="project-list" v-for="chunk in projects">
        <div
          class="project"
          v-for="project in chunk"
          @click="getProject(project.key)"
        >
          <div class="project-icon">
            <icon-project />
          </div>
          <div class="project-name">
            {{ project.name }}
          </div>
        </div>
      </div>
    </div>
    <span>{{ progress }}</span>
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

.projects
  display flex

.project-list
  display flex
  padding 2rem 0
  div
    margin-left 1rem
    &:first-child
      margin-left 0
.project
  background #fff
  padding 2rem
  border-radius 0.5rem
  display flex
  flex-direction column
  align-items center
  border solid 0.2rem rgba(#ccc, 0.5)
  cursor pointer
  transition all .2s ease-in-out
  &:hover

    background #eee
  &-icon
    font-size 5rem
    color primary
  &-name
    font-size 1.5rem
</style>
