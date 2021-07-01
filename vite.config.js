import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import styleImport from 'vite-plugin-style-import'

export default defineConfig({
  base: './', // 生产环境下的公共路径
  build: {
    base: './', // 生产环境下的公共路径
    outDir: './data/dist'
  },
  proxy: {
    '/translate_a': 'https://translate.google.cn/translate_a',
    // '/api': {
    //     target: 'https://translate.google.cn',
    //     changeOrigin: true,
    //     rewrite: path => path.replace(/^\/api/, '')
    // }
  },
  plugins: [
    vue()
  ]
})