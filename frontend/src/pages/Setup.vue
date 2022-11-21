<script setup>
import { ref } from 'vue'

const hide = ref(true)
const remove = ref(false)

const removePrompt = () => (remove.value = true)
</script>

<template>
  <Teleport to="#app" v-if="!remove">
    <div class="setup-notification" v-if="hide">
      <div class="setup-notification-text">
        Hey there! It seems you're new to Mulyankan. Would you like to go
        through a short setup, so we can customise Mulyankan to your needs ?
      </div>
      <div class="setup-notification-actions">
        <div class="setup-notification-action" @click="removePrompt">
          I'll do it later.
        </div>
        <div
          class="setup-notification-action setup-notification-action-cta"
          @click="hide = false"
        >
          Yes!
        </div>
      </div>
    </div>
    <div class="setup" v-if="!hide">
      <div class="logo">
        <span @click="goBack" class="back"><icon-arrow-left /></span>
        <span>Mulyankan</span>
      </div>
    </div>
  </Teleport>
</template>

<style lang="stylus" scoped>

.setup
  &-notification
    background neutral
    padding 1rem 2rem
    position absolute
    bottom 0.5rem
    left 0.5rem
    font-size 1.5rem
    max-width 40%
    border-radius 0.5rem
    border solid 0.2rem rgba(#ccc, 0.5)

    &-actions
      padding-top 1rem
      display flex
      align-items center
      justify-content space-between
    &-action
      color #636e72
      &-cta
        color primary
      text-decoration underline
      cursor pointer
</style>
