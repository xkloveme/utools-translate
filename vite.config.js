import { defineConfig } from 'vite'
import { resolve } from "path"; // 主要用于alias文件路径别名
import vue from '@vitejs/plugin-vue'
// import styleImport from 'vite-plugin-style-import'
function pathResolve(dir) {
  return resolve(__dirname, ".", dir);
}
export default defineConfig({
  base: './', // 生产环境下的公共路径
  build: {
    base: './', // 生产环境下的公共路径
    outDir: './data/dist',
    minify: 'terser'// 混淆器，terser构建后文件体积更小
  },
    // 这里是将src目录配置别名为 /@ 方便在项目中导入src目录下的文件
    resolve: {
      alias: {
        "@": pathResolve("src"),
      }
  },
  server: {
    cors: true, // 默认启用并允许任何源
    open: false, // 在服务器启动时自动在浏览器中打开应用程序
    //反向代理配置，注意rewrite写法，开始没看文档在这里踩了坑
    proxy: {
      '/api': {
          target: 'http://translate.google.cn',
          // target: 'https://free-api.heweather.net/',
          secure: false,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
      }
    },
},
  plugins: [
    vue()
  ]
})