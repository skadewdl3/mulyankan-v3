<script setup>
import { ref, onMounted, watch, onBeforeMount } from 'vue'
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
const deletingProject = ref(null)
const fetchingProject = ref(null)
const dots = ref('')
const nav = ref(null)
const stickyNav = ref(false)

let dotsInterval = null

onBeforeMount(async () => {
  let { data: settings } = await axios.get('%BASE_URL%/settings')
  console.log(settings)
  store.commit('setDefaultSettings', settings)

  let { data } = await axios.post('%BASE_URL%/getlang', {
    data: {
      locale: store.state.defaultSettings.locale
    }
  })
  store.state.fallbackTranslation = data.translation
})

// Hide the controls bar by default
onMounted(async () => {
  store.commit('setControls', { show: false })
  gettingProjects.value = true
  let { data } = await axios.get('%BASE_URL%/projects')
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
  let imgArr = await pdfBinaryToImages(pdfBinary, 5, store, projectID)
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
  fetchingProject.value = id
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
  }
  fetchingProject.value = null
}

const deleteProject = async id => {
  deletingProject.value = id
  console.log(id)
  let res = await axios.get(`%BASE_URL%/deleteproject/${id}`)
  let { data } = await axios.get('%BASE_URL%/projects')
  projects.value = data.items
  deletingProject.value = null
}

const goToDocs = () => {
  router.push('/docs')
}

const goToSettings = () => {
  router.push('/settings')
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
    <div ref="nav" class="nav">
      <div class="nav-left">
        <div class="logo">Mulyankan</div>
        <div class="title">{{ $t('Home.projectsTitle') }}</div>
        <button class="file-upload-btn" @click="openFileInput">
          {{ $t('Home.upload') }}
        </button>
      </div>
      <div class="nav-right">
        <span class="text" @click="goToDocs"
          >{{ $t('Home.confused') }} 👉🏻
          <span class="cta">{{ $t('Home.docs') }}</span>
        </span>
        <span class="text" @click="goToSettings"
          >{{ $t('Home.customisation') }} 👉🏻
          <span class="cta">{{ $t('Home.settings') }}</span></span
        >
      </div>
    </div>
    <div
      :class="`nav-sticky ${
        stickyNav ? 'nav-sticky--visible' : 'nav-sticky--hidden'
      }`"
    >
      <div class="nav-left">
        <div class="logo">Mulyankan</div>
        <span> - </span>
        <div class="title">{{ $t('Home.projectsTitle') }}</div>
      </div>
      <div class="nav-right">
        <button class="file-upload-btn" @click="openFileInput">
          {{ $t('Home.upload') }}
        </button>
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
        {{ $t('Home.noProjects') }}
      </span>
      <span v-if="gettingProjects">
        {{ $t('Home.loadingProjects') }} {{ dots }}
      </span>
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
            :class="`delete-btn ${
              deletingProject === project.key ? 'delete-btn-inactive' : ''
            }`"
            @click="
              e => {
                e.stopImmediatePropagation()
                deleteProject(project.key)
              }
            "
          >
            <icon-delete
              v-if="
                deletingProject !== project.key &&
                fetchingProject !== project.key
              "
            />
            <icon-loading v-else />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.home
  container()

.nav
  display flex
  align-items center
  justify-content space-between

  .nav-right
    display flex
    align-items flex-end
    flex-direction column
    .text
      display flex
      align-items center
      justify-content center
      color #747d8c
      font-size 1.7rem
      font-weight 300

      .cta
        transition all .2s ease-out
        cursor pointer
        &:hover
          font-size 2.3rem
          font-weight bold
          color #000

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
.delete-btn
  background red
  padding 0.5rem
  border-radius 0.5rem
  background #fff
  transition all .2s ease-in-out
  cursor pointer
  &:hover
    background #eee
  &-inactive
    cursor not-allowed
    opacity 0.5
    &:hover
      background #fff
</style>
