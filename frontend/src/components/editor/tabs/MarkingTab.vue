<script setup>
import { ref, watch, computed, toRaw } from 'vue'
import { useStore } from 'vuex'
import ArrowSymbol from './../../../assets/images/arrow.svg'
import CheckSymbol from './../../../assets/images/check.svg'
import CircleSymbol from './../../../assets/images/circle.svg'
import CrossSymbol from './../../../assets/images/cross.svg'
import UnderlineSymbol from './../../..//assets/images/underline.svg'
import DoubleUnderlineSymbol from './../../../assets/images/double-underline.svg'
import TextboxIcon from './../../../assets/images/textbox.svg'
import MarkboxIcon from './../../../assets/images/markbox.svg'

import { getFilter } from './../../../logic/colorCalculator'
import { isNumber } from './../../../store/actions'

const store = useStore()

const fontFamilyDropdownOpen = ref(false)
const fontSizeDropdownOpen = ref(false)
const marks = computed(() => store.state.marks.calculated)

watch([fontFamilyDropdownOpen, fontSizeDropdownOpen], () => {
  const closeDropdown = () => {
    fontFamilyDropdownOpen.value = false
    fontSizeDropdownOpen.value = false
    document.removeEventListener('click', closeDropdown)
  }
  if (fontFamilyDropdownOpen.value) {
    setTimeout(() => {
      document.addEventListener('click', closeDropdown)
    }, 0)
  }

  if (fontSizeDropdownOpen.value) {
    setTimeout(() => {
      document.addEventListener('click', closeDropdown)
    }, 0)
  }
})

const symbols = [
  {
    name: 'arrow',
    src: ArrowSymbol
  },
  {
    name: 'check',
    src: CheckSymbol
  },
  {
    name: 'circle',
    src: CircleSymbol
  },
  {
    name: 'cross',
    src: CrossSymbol
  },
  {
    name: 'underline',
    src: UnderlineSymbol
  },
  {
    name: 'double-underline',
    src: DoubleUnderlineSymbol
  }
]

const fonts = [
  {
    name: 'Modern',
    font: 'Poppins'
  },
  {
    name: 'Professional',
    font: 'Source Serif Pro'
  },
  {
    name: 'Cursive',
    font: 'Dancing Script'
  },
  {
    name: 'Handwriting',
    font: 'Caveat'
  }
]

const colors = [
  {
    name: 'red',
    hex: '#ff0000',
    rgb: {
      r: 255,
      g: 0,
      b: 0
    }
  },
  {
    name: 'green',
    hex: '#27ae60',
    rgb: {
      r: 39,
      g: 174,
      b: 96
    }
  },
  {
    name: 'blue',
    hex: '#3498db',
    rgb: {
      r: 52,
      g: 152,
      b: 219
    }
  },
  {
    name: 'orange',
    hex: '#f39c12',
    rgb: {
      r: 243,
      g: 156,
      b: 18
    }
  },
  {
    name: 'black',
    hex: '#2d3436',
    rgb: {
      r: 45,
      g: 52,
      b: 54
    }
  }
]

const fontSizes = [...Array(40)].map((_, i) => (i === 0 ? 1 : 2 * i))

const styleBtns = [
  {
    icon: 'icon-bold',
    action: () => ''
  },
  {
    icon: 'icon-italic',
    action: () => ''
  },
  {
    icon: 'icon-underline',
    action: () => ''
  }
]

const addSymbol = (e, symbolIndex) => {
  e.dataTransfer.setData('img', symbols[symbolIndex].name)
}

const addText = (e, textType) => {
  e.dataTransfer.setData('text', `${textType}`)
}

const quickMark = e => {
  e.dataTransfer.setData('quickmark', JSON.stringify(toRaw(store.state.marks)))
}

const changeFont = font => {
  fontFamilyDropdownOpen.value = false
  if (store.state.style.font === font) {
    store.commit('forceRefresh')
    return
  }
  store.commit('setFont', font)
}

const changeFontSize = fontSize => {
  fontSizeDropdownOpen.value = false
  if (store.state.style.fontSize === fontSize) {
    store.commit('forceRefresh')
    return
  }
  store.commit('setFontSize', fontSize)
}

const changeColor = color => {
  if (store.state.style.color === color) {
    store.commit('forceRefresh')
    return
  }
  store.commit('setColor', color)
}
const updateTotalMarks = val => {
  if (isNumber(val)) {
    store.commit('setTotalMarks', val)
  }
}
</script>

<template>
  <div class="marking-tab">
    <div class="section">
      <div class="section-content quickmark-wrapper">
        <div class="quickmark" draggable="true" @dragstart="e => quickMark(e)">
          <div
            class="calculated-marks"
            draggable="true"
            @dragstart="e => quickMark(e)"
          >
            {{ marks ? marks : 0 }}
          </div>
          <div
            class="mark-separator"
            draggable="true"
            @dragstart="e => quickMark(e)"
          >
            out of
          </div>
          <div
            class="total-marks"
            draggable="true"
            @dragstart="e => quickMark(e)"
          >
            <input
              draggable="true"
              @dragstart="e => quickMark(e)"
              class="total-marks-input"
              type="text"
              @input="e => updateTotalMarks(e.target.value)"
            />
          </div>
        </div>
      </div>
      <div class="section-name">Quick Marking</div>
    </div>
    <div class="separator"></div>
    <div class="section">
      <div class="section-content text">
        <div
          class="textbox"
          draggable="true"
          @dragstart="e => addText(e, 'text')"
        >
          <img :src="TextboxIcon" draggable="true" alt="" class="textbox-img" />
          <span draggable="true">Textbox</span>
        </div>
        <div
          class="textbox"
          draggable="true"
          @dragstart="e => addText(e, 'mark')"
        >
          <img :src="MarkboxIcon" draggable="true" alt="" class="textbox-img" />
          <span draggable="true">Markbox</span>
        </div>
      </div>
      <div class="section-name">Text</div>
    </div>
    <div class="separator"></div>
    <div class="section">
      <div class="section-content font">
        <div class="font-family-dropdown">
          <div
            class="font-family-dropdown-trigger"
            @click="fontFamilyDropdownOpen = true"
          >
            <span>
              {{
                store.state.style.font
                  ? fonts.filter(f => f.font === store.state.style.font)[0].name
                  : 'Select Font'
              }}
            </span>
            <icon-down class="font-family-dropdown-trigger-icon" />
          </div>
          <ul
            class="font-list"
            :style="{
              transform: fontFamilyDropdownOpen ? 'scale(1)' : 'scale(0)'
            }"
          >
            <li
              v-for="font in fonts"
              @click="changeFont(font.font)"
              :style="{
                fontFamily: font.font
              }"
            >
              {{ font.name }}
            </li>
          </ul>
        </div>
        <div class="font-family-dropdown">
          <div
            class="font-family-dropdown-trigger"
            @click="fontSizeDropdownOpen = true"
          >
            <span>
              {{
                store.state.style.fontSize
                  ? store.state.style.fontSize
                  : 'Select Font Size'
              }}
            </span>
            <icon-down class="font-family-dropdown-trigger-icon" />
          </div>
          <ul
            class="font-list font-size-list"
            :style="{
              transform: fontSizeDropdownOpen ? 'scale(1)' : 'scale(0)'
            }"
          >
            <li v-for="size in fontSizes" @click="changeFontSize(size)">
              {{ size }}
            </li>
          </ul>
        </div>
        <div class="text-style-btns">
          <button
            v-for="btn in styleBtns"
            class="text-style-btn"
            @click="btn.action"
          >
            <component :is="btn.icon" />
          </button>
        </div>
      </div>
      <div class="section-name">Font</div>
    </div>
    <div class="separator"></div>
    <div class="section">
      <div class="section-content symbols">
        <div
          class="symbol"
          v-for="(symbol, i) in symbols"
          draggable="true"
          @dragstart="e => addSymbol(e, i)"
        >
          <img
            :style="{
              filter: getFilter(store.state.style.color, colors)
            }"
            :src="symbol.src"
            :alt="symbol.name"
            draggable="true"
            @dragstart="e => addSymbol(e, i)"
            :id="`symbol-${symbol.name}`"
          />
        </div>
      </div>
      <div class="section-name">Symbols</div>
    </div>
    <div class="separator"></div>
    <div class="section">
      <div class="section-content colors">
        <div
          @click="changeColor(color.hex)"
          class="color"
          v-for="color in colors"
          :style="{
            backgroundColor: color.hex
          }"
        >
          <div
            class="color-patch"
            :style="{
              transform:
                store.state.style.color === color.hex ? 'scale(1)' : 'scale(0)'
            }"
          ></div>
        </div>
      </div>
      <div class="section-name">Colors</div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.marking-tab
  display flex
.section
  display flex
  flex-direction column
  align-items center
  justify-content space-between
  &-content
    margin auto auto
  &-name
    font-size 1.2rem
    color #000
    text-align center
.symbols
  display flex
.symbol
  cursor pointer
  width 2.5rem
  +atTablet()
    margin 0 0.5rem
  +atDesktop()
    margin 0 1rem
  img
    width 100%
.separator
  height 3.5rem
  width 0.1rem
  background #ccc
  +atTablet()
    margin auto 1rem
  +atDesktop()
    margin auto 2rem


.text
  display flex
  justify-content space-between
  +atTablet()
    flex-direction column
  +atDesktop()
    flex-direction row
.textbox
  display flex
  align-items center
  cursor pointer
  +atTablet()
    margin 0.5rem auto
    &:first-child
      margin-top 0
    &:last-child
      margin-bottom 0
  +atDesktop()
    margin 0 1rem
    &:first-child
      margin-left 0
    &:last-child
      margin-right 0

  span
    +atTablet()
      font-size 1.2rem
    +atDesktop()
      font-size 1.5rem

  &-img
    margin-right 1rem
    +atTablet()
      width 2rem
    +atDesktop()
      width 2.5rem

.font
  display flex
  div
    margin 0 0.5rem
    &:first-child
      margin-left 0
    &:last-child
      margin-right 0

.font-size-list
  max-height 20rem
  overflow-y auto
  &::-webkit-scrollbar
    width 0.5rem
    &-thumb
      background #ccc
      border-radius 0.5rem
      &:hover
        background #aaa
.font-list
  position absolute
  list-style none
  padding 0
  margin 0
  top 0
  left 0
  background #fff
  transition all .2s ease-in-out
  border solid 0.2rem rgba(#ccc,0.5)
  &:hover
    border solid 0.2rem #ccc
  border-radius 0.5rem
  transform-origin 50% 0
  transition all .2s ease-in-out
  min-width 100%
  li
    font-size 1.5rem
    padding 0.5rem 1rem
    cursor pointer
    &:hover
      background #eee

.font-family-dropdown
  position relative
  &-trigger
    font-size 1.3rem
    transition all .2s ease-in-out
    border solid 0.2rem rgba(#ccc,0.5)
    &:hover
      border solid 0.2rem #ccc
    border-radius 0.5rem
    padding 0.5rem 1rem
    cursor pointer
    &-icon
      margin-left 1rem

.colors
  display flex
  .color
    +atTablet()
      width 2.5rem
      height 2.5rem
      margin 0 0.5rem
    +atDesktop()
      width 3rem
      height 3rem
      margin 0 1rem
    border-radius 0.5rem
    cursor pointer
    &:first-child
      margin-left 0
    &:last-child
      margin-right 0
    display flex
    align-items center
    justify-content center
    &-patch
      top 50%
      left 50%
      +atTablet()
        width 1.5rem
        height 1.5rem
      +atDesktop()
        width 2rem
        height 2rem
      border-radius 0.3rem
      background #fff
      transition all .2s ease-in-out
      transform-origin 50% 50%

.quickmark
  display flex
  align-items center
  justify-content center
  font-size 1.5rem
  border solid 0.2rem rgba(#ccc,0.5)
  border-radius 0.5rem
  padding 0.5rem 1rem
  cursor pointer
  div
    margin-right 2rem
    &:last-child
      margin-right 0

.total-marks-input
  border-bottom solid 0.2rem rgba(#ccc,0.5)
  font-size 1.5rem
  text-align center
  width 4rem
  padding 0.5rem

.text-style-btns
  display flex
  align-items center
  justify-content center
.text-style-btn
  border solid 0.2rem rgba(#ccc,0.5)
  background #fff
  font-size 1.5rem
  padding 0.5rem
  border-radius 0.5rem
  margin-left 0.5rem
  cursor pointer
  transition all .2s ease-in-out
  &:hover
    border solid 0.2rem #ccc
</style>
