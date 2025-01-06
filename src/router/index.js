import {createRouter,createWebHashHistory} from 'vue-router'

const routes = [
  /* 首页 */
  {
    path:'/',
    redirect:'/index'
  },
  {
    path:'/index',
    name:'index',
    component:()=>import('@/views/index.vue')
  },
  /* 投稿 */
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
  /* 主页 */
  {
    path:'/home/:userId',
    name:'home',
    component:()=>import('@/views/home/home.vue'),
    children:[
      {
        path:'',
        name:'home_index',
        component:()=>import('@/views/home/HomeIndex.vue')
      },
      {
        path:'news',
        name:'home_news',
        component:()=>import('@/views/home/HomeNews.vue')
      },
      {
        path:'article',
        name:'home_article',
        component:()=>import('@/views/home/HomeArticle.vue')
      },
      {
        path:'video',
        name:'home_video',
        component:()=>import('@/views/home/HomeVideo.vue')
      },
      {
        path:'collect',
        name:'home_collect',
        component:()=>import('@/views/home/HomeCollect.vue')
      },
      {
        path:'mine',
        name:'home_mine',
        component:()=>import('@/views/home/HomeMine.vue')
      },
    ]
  },
  /* 动态 */
  {
    path:'/news_index',
    name:'news_index',
    component:()=>import('@/views/news/news.vue')
  },
  /* 动态详情 */
  {
    path:'/news_detail',
    name:'news_detail',
    component:()=>import('@/views/news-detail/NewsDetail.vue')
  },
  {
    path:'/news_detail/quote',
    name:'news_detail_quote',
    component:()=>import('@/views/news-detail/NewsDetail.vue')
  },
  /* 搜索 */
  {
    path:'/search',
    name:'search',
    component:()=>import('@/views/search/search.vue')
  },
]

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

/* 路由跳转后页面滚动条始终在顶部 */
router.beforeEach((to, from, next) => {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
  next()
}) 
/* 修改页面title */
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