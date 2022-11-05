import { resolve } from 'path'

export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        stylus: {
          additionalData: [
            `@import "${resolve(
              __dirname,
              './',
              'assets',
              'stylus',
              'variables.styl'
            )}"; @import "${resolve(
              __dirname,
              './',
              'assets',
              'stylus',
              'variables.styl'
            )}";`,
          ],
        },
      },
    },
  },
})
