import request from '@/util/request.js'

/* 发布动态 */
export const publishNewsApi = (params) => {
  return request.post('/happening/publish',params)
}
/* 获取动态页准备信息 */
export const getNewsPrepareApi = () => {
  return request.get('/happening/prepare')
}
/* 获取动态列表 */
export const getNewsListApi = (pageNum, pageSize) => {
  return request.get('/happening', {
    params:{
      pageNum,
      pageSize
    }
  })
}
/* 分页获取标签 */
export const getTagListApi = (pageNum, pageSize) => {
  return request.get('/tag', {
    params:{
      pageNum,
      pageSize
    }
  })
}
/* 转发动态 */
export const fowardNewsApi = (params) => {
  return request.post('/happening/forward', params)
}
/* 获取投票详细信息 */
export const getVoteDetailApi = (params) => {
  return request.get('/vote/detail', {
    params
  })
}

/* 投票 */
export const voteApi = (params) => {
  return request.post('/vote/vote', params)
}