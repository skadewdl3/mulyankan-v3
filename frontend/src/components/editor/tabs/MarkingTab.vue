<script setup>
import ArrowSymbol from '@/assets/images/arrow.svg'
import CheckSymbol from '@/assets/images/check.svg'
import CircleSymbol from '@/assets/images/circle.svg'
import CrossSymbol from '@/assets/images/cross.svg'
import UnderlineSymbol from '@/assets/images/underline.svg'
import DoubleUnderlineSymbol from '@/assets/images/double-underline.svg'
import TextboxIcon from '@/assets/images/textbox.svg'
import MarkboxIcon from '@/assets/images/markbox.svg'

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

const addSymbol = (e, symbolIndex) => {
  e.dataTransfer.setData('img', `symbol-${symbols[symbolIndex].name}`)
}
const addText = (e, textType) => {
  e.dataTransfer.setData('text', `${textType}`)
}
</script>

<template>
  <div class="marking-tab">
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
      <div class="section-content">
        <div class="font-dropdown">
          <div class="font-dropdown-trigger"></div>
          <ul class="font-list">
            <li>Modern</li>
            <li>Professional</li>
            <li>Handwritten</li>
            <li>Cursive</li>
          </ul>
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
            :src="symbol.src"
            :alt="symbol.name"
            draggable="true"
            @dragstart="e => selectSymbol(e, i)"
            :id="`symbol-${symbol.name}`"
          />
        </div>
      </div>
      <div class="section-name">Symbols</div>
    </div>
    <div class="separator"></div>
  </div>
</template>

<style lang="stylus" scoped>
.marking-tab
  display flex
.section
  &-content
    margin 0.5rem 0
  &-name
    font-size 1.2rem
    color #000
    text-align center
.symbols
  display flex
.symbol
  cursor pointer
  width 2.5rem
  margin 0 1rem
  img
    width 100%
.separator
  height 3.5rem
  width 0.1rem
  background #ccc
  margin auto 1rem

.text
  display flex
  justify-content space-between
.textbox
  display flex
  align-items center
  margin 0 1rem
  cursor pointer
  &:first-child
    margin-left 0

  span
    font-size 1.5rem

  &-img
    margin-right 1rem
    width 2.5rem
</style>
