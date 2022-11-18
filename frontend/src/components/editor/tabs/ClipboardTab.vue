<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { getFilter } from '@/logic/colorCalculator'
const store = useStore()

const generateDisplayConfig = arr => {
  let clipboardNew = arr.map(obj => {
    let config = {}
    let type = obj.type
    if (type === 'image') {
      config = {
        type: 'image',
        filter: getFilter(obj.imgColor),
        id: obj.id
      }
      // get image display config
    } else if (type === 'textbox') {
      // get text display config
      config = {
        type: 'text',
        color: obj.fill,
        text: obj.text,
        textType: obj.textType
      }
    }
    return config
  })
  return clipboardNew
}

const clipboard = ref(generateDisplayConfig(store.state.clipboard))

const deleteItem = index => {
  store.dispatch('deleteFromClipboard', index)
}

const addCopiedObject = (e, index) => {
  e.dataTransfer.setData('copy', JSON.stringify(store.state.clipboard[index]))
}

watch(
  () => store.state.clipboard,
  () => {
    clipboard.value = generateDisplayConfig(store.state.clipboard)
  }
)
</script>

<template>
  <div class="clipboard">
    <div class="clipboard-empty" v-if="clipboard.length === 0">
      Clipboard is empty. When you copy some items, they will appear here.
    </div>
    <div class="clipboard-item" v-for="(item, index) in clipboard">
      <button class="delete-item-btn" @click="deleteItem(index)">
        <icon-close />
      </button>
      <div
        class="clipboard-item-image"
        v-if="item.type === 'image'"
        draggable="true"
        @dragstart="e => addCopiedObject(e, index)"
      >
        <img
          :src="`%IMG_URL%/images/${item.id}.svg`"
          :alt="item.id"
          :style="{ filter: item.filter }"
        />
      </div>
      <div
        class="clipboard-item-text"
        v-if="item.type === 'text'"
        draggable="true"
        @dragstart="e => addCopiedObject(e, index)"
      >
        <span
          class="clipboard-item-text-content"
          :style="{ border: `solid 0.2rem ${item.color}` }"
          >{{ item.text }}</span
        >
        <span
          class="clipboard-item-text-type"
          :style="{ backgroundColor: item.color, color: '#fff' }"
          >{{ item.textType }}</span
        >
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.clipboard
  display flex
  width 100%
  &-empty
    +atTablet()
      font-size 1.2rem
    +atDesktop()
      font-size 1.5rem
    text-align center
    padding 1rem 2rem

.delete-item-btn
  position absolute
  top 0
  left 100%
  transform translateX(-50%)
  background #ccc
  border-radius 100rem
  display flex
  align-items center
  justify-content center
  padding 0.2rem
  font-size 1rem
  cursor pointer

.clipboard-item
  cursor pointer
  margin auto 1rem
  position relative
  &:first-child
    margin-left 0
  &:last-child
    margin-right 0
  &-text
    border-radius 0.5rem
    display flex
    flex-direction column
    &-content
      font-size 1.5rem
      padding 0.5rem 1rem
      border solid 0.2rem rgba(#ccc, 0.5)
      border-top-right-radius 0.5rem
      border-top-left-radius 0.5rem
      border-bottom 0
      text-align center

    &-type
      font-size 1.2rem
      text-align center
      padding 0.5rem 1rem
      width 100%
      border-bottom-left-radius 0.5rem
      border-bottom-right-radius 0.5rem
      background #ccc
      text-transform capitalize
  &-image
    width 6rem
    border solid 0.2rem rgba(#ccc, 0.5)
    border-radius 0.5rem
    padding 1rem
    img
      width 100%
</style>
