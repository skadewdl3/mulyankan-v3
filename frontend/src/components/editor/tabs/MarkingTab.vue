<script setup>
import ArrowSymbol from '@/assets/images/arrow.svg'
import CheckSymbol from '@/assets/images/check.svg'
import CircleSymbol from '@/assets/images/circle.svg'
import CrossSymbol from '@/assets/images/cross.svg'

const symbols = [
  {
    name: 'Arrow',
    src: ArrowSymbol
  },
  {
    name: 'Check',
    src: CheckSymbol
  },
  {
    name: 'Circle',
    src: CircleSymbol
  },
  {
    name: 'Cross',
    src: CrossSymbol
  }
]
</script>

<template>
  <div class="marking-tab">
    <div class="section">
      <div class="section-content symbols">
        <div class="symbol" v-for="symbol in symbols">
          <img :src="symbol.src" :alt="symbol.name" />
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
    margin 1rem 0
  &-name
    font-size 1rem
    color #000
    text-align center
.symbols
  display flex
.symbol
  width 2.5rem
  margin 0 1rem
  img
    width 100%
.separator
  height 3rem
  width 0.1rem
  background #ccc
  margin auto 1rem
</style>
