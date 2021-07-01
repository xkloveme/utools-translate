import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import { routes } from './routes.js'
import store from './store/index.js'
import { createRouter, createWebHistory } from 'vue-router'

let app = createApp(App)
let router = createRouter({
  history: createWebHistory(),
  routes: import.meta.hot ? [] : routes,
})

if (import.meta.hot) {
  let removeRoutes = []

  for (let route of routes) {
    removeRoutes.push(router.addRoute(route))
  }

  import.meta.hot.accept('./routes.js', ({ routes }) => {
    for (let removeRoute of removeRoutes) removeRoute()
    removeRoutes = []
    for (let route of routes) {
      removeRoutes.push(router.addRoute(route))
    }
    router.replace('')
  })
}

app.use(router)
app.use(store)


if (window.utools) {
  window.utools.onPluginReady(() => {
    console.log("插件装配完成，已准备好");
    app.mount('#app')
  });
} else {
  window.utools =null
  app.mount('#app');
}