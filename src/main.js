import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './store'
import 'element-plus/dist/index.css'
import VueLazyLoad from 'vue3-lazyload'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(VueLazyLoad, {
  loading:'/imgs/loading-svg/loading-cylon-red.svg'
})
app.mount('#app')
