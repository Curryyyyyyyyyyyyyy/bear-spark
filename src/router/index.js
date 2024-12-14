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
    path:'/mainInterface/:id',
    name:'mainInterface',
    component:()=>import('@/views/mainInterface.vue')
  },
  {
    path:'/news_index',
    name:'news_index',
    component:()=>import('@/views/news/news.vue')
  },
  {
    path:'/news_detail/:id',
    name:'news_detail',
    component:()=>import('@/views/news-detail/NewsDetail.vue')
  }
]

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

router.afterEach((to) => {
  switch(to.name) {
    case 'index':
      document.title = '首页_bear-spark'
      break
    case 'news_index':
      document.title = '动态首页_bear-spark'
      break
    case 'news_detail':
      document.title = '动态详情_bear-spark'
      break
  }
})

export default router