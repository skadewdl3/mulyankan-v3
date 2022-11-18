<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {
  pdfToBinaryString,
  pdfBinaryToImages,
  bufferToArrayBuffer,
  binaryStringToJSON
} from '@/logic/pdfFunctions'
import { savePDF } from '@/logic/pdfFunctions'
import axios from 'axios'
import { resumeCanvases } from '@/logic/canvasFunctions'
const store = useStore()
const router = useRouter()

const projects = ref([])
const gettingProjects = ref(false)
const dots = ref('')
const nav = ref(null)
const stickyNav = ref(false)

let dotsInterval = null

// Hide the controls bar by default
onMounted(async () => {
  store.commit('setControls', { show: false })
  gettingProjects.value = true
  let { data } = await axios.get('%BASE_URL%/projects')
  console.log(data)
  if (data.items.length === 0) gettingProjects.value = false
  setTimeout(() => {
    projects.value = data.items
    gettingProjects.value = false
  }, 2000)
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
      await binaryStringToJSON(jsonBinary)
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

const deleteProject = async id => {
  console.log(id)
  let res = await axios.get(`%BASE_URL%/deleteproject/${id}`)
  let { data } = await axios.get('%BASE_URL%/projects')
  projects.value = data.items
}

watch(gettingProjects, () => {
  if (gettingProjects) {
    dotsInterval = setInterval(() => {
      dots.value += '.'
      if (dots.value.length > 3) dots.value = ''
    }, 500)
  } else {
    clearInterval(dotsInterval)
  }
})

watch(nav, () => {
  if (nav) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0]['intersectionRatio'] == 0) {
        stickyNav.value = true
      } else {
        stickyNav.value = false
      }
    })

    observer.observe(nav.value)
  }
})
</script>

<template>
  <div class="home">
    <div ref="nav">
      <div class="logo">Mulyankan</div>
      <div class="title">Your Projects</div>

      <button class="file-upload-btn" @click="openFileInput">Upload</button>
    </div>
    <div
      :class="`nav-sticky ${
        stickyNav ? 'nav-sticky--visible' : 'nav-sticky--hidden'
      }`"
    >
      <div class="nav-left">
        <div class="logo">Mulyankan</div>
        <span> - </span>
        <div class="title">Your Projects</div>
      </div>
      <div class="nav-right">
        <button class="file-upload-btn" @click="openFileInput">Upload</button>
      </div>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="appliation/pdf"
      class="file-input"
      @input="processFile"
    />
    <div class="projects-loading" v-if="projects.length === 0">
      <span v-if="!gettingProjects">
        No projects found. Upload a PDF to get started.
      </span>
      <span v-if="gettingProjects"> Loading Projects {{ dots }} </span>
    </div>
    <div class="projects" v-if="projects.length > 0">
      <div
        class="project"
        v-for="project in projects"
        @click="getProject(project.key)"
      >
        <div class="project-content project-left">
          <div class="project-icon">
            <icon-project />
          </div>
          <div class="project-name">
            {{ project.name }}
          </div>
        </div>
        <div class="project-content project-right">
          <button
            @click="
              e => {
                e.stopImmediatePropagation()
                deleteProject(project.key)
              }
            "
          >
            <icon-delete />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.home
  background neutral
  container()

.nav-sticky
  position sticky
  left 0
  display flex
  align-items center
  justify-content space-between
  background neutral
  padding 1rem 0
  transition all .2s ease-in-out
  &--hidden
    top 5%
    opacity 0

  &--visible
    top 0
    opacity 1

  .nav-left
    display flex
    align-items center
    div, span
      margin-right 1rem
    .title
      font-size 2rem
      font-weight 400

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
  flex-direction column
  padding 2rem 0

  &-loading
    font-size 2rem
    margin 2rem 0
.project
  background #fff
  width 100%
  padding 1rem 1rem
  margin-bottom 0.5rem
  border-radius 0.5rem
  display flex
  align-items center
  justify-content space-between
  border solid 0.2rem rgba(#ccc, 0.5)
  cursor pointer
  transition all .2s ease-in-out
  font-size 1.5rem
  &-icon
    margin-right 1rem

.project-content
  display flex
</style>
