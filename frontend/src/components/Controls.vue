<script setup>
import { useStore } from 'vuex'
const store = useStore()
</script>

<template>
  This is the control bar in {{ store.state.controlMode }} mode
</template>

<style lang="stylus" scoped></style>
