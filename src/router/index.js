import {createRouter,createWebHistory} from 'vue-router'

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
    path:'/mainInterface/:userId',
    name:'mainInterface',
    component:()=>import('@/views/mainInterface.vue')
  }
]

const router = createRouter({
  history:createWebHistory(),
  routes
})

export default router