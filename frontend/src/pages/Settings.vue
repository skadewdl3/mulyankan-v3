<template>
  <div class="settings">
    <div class="logo">
      <!-- <span @click="goBack" class="back"><icon-arrow-left /></span> -->
      <span>Mulyankan</span>
    </div>
    <div class="title">Settings</div>
    <!-- <button class="lang-change-btn">Download</button> -->
  </div>
</template>

<script></script>

<style scoped lang="stylus">
.settings
  container()
  background neutral

.logo
  font-family megrim
  font-size 2.5rem
  font-weight bold
  color primary
  display flex
  align-items center
.title
  font-size 4rem
  font-weight 700

.back
  font-size 1.5rem
  color #000
  margin-right 1rem
  cursor pointer
  transition all .2s ease-in-out
  &:hover
    color primary

.lang-change-btn
  background primary
  color #fff
  padding 1rem 2rem
  border-radius 0.5rem
  font-size 1.5rem
  cursor pointer
</style>
