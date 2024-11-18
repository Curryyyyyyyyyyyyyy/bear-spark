import request from '@/util/request.js'

/* 发布动态 */
export const publishNews = (params) => {
  return request.post('/happening/publish',params)
}
/* 获取动态页准备信息 */
export const getNewsPrepare = () => {
  return request.get('/happening/prepare')
}
/* 获取动态列表 */
export const getNewsList = (pageNum, pageSize) => {
  return request.get('/happening', {
    params:{
      pageNum,
      pageSize
    }
  })
}