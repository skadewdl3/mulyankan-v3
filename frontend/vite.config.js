import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import StringReplace from 'vite-plugin-string-replace'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    StringReplace.default([
      {
        search: '%BASE_URL%',
        replace:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:8080'
            : '/api'
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
