import {createRouter,createWebHashHistory} from 'vue-router'

const routes = [
  {
    path:'/',
    redirect:'/index'
  },
  {
    path:'/index',
    name:'index',
    component:()=>import('@/views/index.vue')
  },
  {
    path:'/mainInterface',
    name:'mainInterface',
    component:()=>import('@/views/mainInterface.vue')
  },
  {
    path:'/news',
    name:'news',
    component:()=>import('@/views/news/news.vue')
  }
]

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

export default router