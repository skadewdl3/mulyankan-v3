<script>
export default {
  head() {
    return {
      bodyAttrs: {
        class: 'reset-body',
      },
    }
  },
}
</script>

<template>
  <NuxtPage />
</template>

<style>
/* Universal Reset to ensure uniform display across all browsers */
* {
  border: 0;
  padding: 0;
  margin: 0;
  outline: none;
  box-sizing: border-box;
}

html {
  font-size: 62.5%; /* Sets 1rem = 10px */
}
</style>
