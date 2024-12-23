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
    path:'/submit',
    name:'submit',
    component:()=>import('@/views/submit/submit.vue'),
    children:[
      {
        path:'article',
        name:'submit_article',
        component:()=>import('@/views/submit/SubmitArticle.vue')
      },
      {
        path:'video',
        name:'submit_video',
        component:()=>import('@/views/submit/SubmitVideo.vue')
      },
      {
        path:'draft',
        name:'draft_box',
        component:()=>import('@/views/submit/DraftBox.vue')
      },
    ]
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
  },
  {
    path:'/news_detail/quote/:id',
    name:'news_detail_quote',
    component:()=>import('@/views/news-detail/NewsDetail.vue')
  },
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
    case 'submit_article':
      document.title = '创作中心_bear-spark'
      break
    case 'submit_video':
      document.title = '创作中心_bear-spark'
      break
    case 'draft_box':
      document.title = '创作中心_bear-spark'
      break
  }
})

export default router