import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import StringReplace from 'vite-plugin-string-replace'

let env = process.env.NODE_ENV || 'development'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    StringReplace.default([
      {
        search: '%BASE_URL%',
        replace: env === 'development' ? 'http://localhost:8080' : '/api'
      },
      {
        search: '%IMG_URL%',
        replace: env === 'development' ? '' : '%WINDOW_URL%'
      }
    ])
  ],
  css: {
    preprocessorOptions: {
      stylus: {
        additionalData: [
          `@import "${resolve(
            __dirname,
            './',
            'src',
            'assets',
            'stylus',
            'variables.styl'
          )}"; @import "${resolve(
            __dirname,
            './',
            'src',
            'assets',
            'stylus',
            'mixins.styl'
          )}";`
        ]
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
