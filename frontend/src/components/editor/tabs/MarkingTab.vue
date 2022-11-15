<script setup>
import ArrowSymbol from '@/assets/images/arrow.svg'
import CheckSymbol from '@/assets/images/check.svg'
import CircleSymbol from '@/assets/images/circle.svg'
import CrossSymbol from '@/assets/images/cross.svg'
import UnderlineSymbol from '@/assets/images/underline.svg'
import DoubleUnderlineSymbol from '@/assets/images/double-underline.svg'

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

const selectSymbol = (e, symbolIndex) => {
  e.dataTransfer.setData('id', `symbol-${symbols[symbolIndex].name}`)
}
</script>

<template>
  <div class="marking-tab">
    <div class="section">
      <div class="section-content symbols">
        <div
          class="symbol"
          v-for="(symbol, i) in symbols"
          draggable="true"
          @dragstart="e => selectSymbol(e, i)"
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
</style>
