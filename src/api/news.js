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
export const getNewsListApi = (params) => {
  return request.get('/happening', {
    params
  })
}
/* 分页获取标签 */
export const getTagListApi = (params) => {
  return request.get('/tag', {
    params
  })
}
/* 获取动态详情 */
export const getNewsDetailApi = (params) => {
  return request.get('/happening/detail', {
    params
  })
}
/* 转发动态 */
export const fowardNewsApi = (params) => {
  return request.post('/forward/happening', params)
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
/* 点赞/取消点赞 */
export const likeNewsApi = (params) => {
  return request.post('/like/happening',params)
}
/* 删除动态 */
export const deleteNewsApi = (params) => {
  return request.delete('/happening',{
    params
  })
}
/* 修改动态 */
export const modifyNewsApi = (params) => {
  return request.put('/happening', params)
}