<script setup>
import { onMounted, computed, ref } from 'vue'
import axios from 'axios'
import { marked } from 'marked'

let docs = ref({})
let docMarkdown = ref('')
let doc = computed(() => marked.parse(docMarkdown.value))

onMounted(async () => {
  let { data } = await axios.get('%BASE_URL%/docs')
  docs.value = data
  console.log(data)
})

const fetchDoc = async (itemName, subItemName = null) => {
  let category = itemName
  let subcategory = subItemName
    ? subItemName
    : Object.keys(docs.value[itemName])[0]
  console.log(category, subcategory)
  let { data } = await axios.post(`%BASE_URL%/getdoc`, {
    data: {
      category,
      subcategory
    }
  })
  docMarkdown.value = data.doc
  console.log(data)
}
</script>

<template>
  <div class="docs">
    <div class="sidebar">
      <div class="sidebar-item" v-for="(subItems, itemName) in docs">
        <div class="sidebar-item-name" @click="fetchDoc(itemName)">
          {{ itemName }}
        </div>
        <div class="sidebar-subitems">
          <div
            class="sidebar-subitem"
            v-for="(_, subItemName) in subItems"
            @click="fetchDoc(itemName, subItemName)"
          >
            <div class="sidebar-subitem-name">{{ subItemName }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="doc" v-html="doc"></div>
  </div>
</template>

<style lang="stylus" scoped>
.docs
  container()
  display flex
  align-items flex-start

.sidebar
  &-item
    margin-bottom 1.5rem
    max-width 20rem
  &-item-name
    font-size 2rem
    cursor pointer
  &-subitem-name
    font-size 1.4rem
    margin-left 1.5rem
    cursor pointer

.doc
  margin-left 5rem
  font-size 1rem
</style>
