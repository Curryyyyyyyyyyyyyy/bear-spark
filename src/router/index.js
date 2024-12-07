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
    path:'/news_index',
    name:'news_index',
    component:()=>import('@/views/news/index.vue')
  },{
    path:'/news_detail/:id',
    name:'news_detail',
    component:()=>import('@/views/news/NewsDetail.vue')
  }
]

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

export default router