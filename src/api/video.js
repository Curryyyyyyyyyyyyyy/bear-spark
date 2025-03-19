import request from '@/util/request.js'

/* 发布视频 */
export const publishVideoApi = (params) => {
  return request.post('/video', params)
}
/* 获取视频列表 */
export const getVideoListApi = (params) => {
  return request.get(`/video/list/${params.pageNum}/${params.pageSize}`)
}
/* 根据id获取视频信息 */
export const getVideoInfoApi = (params) => {
  return request.get(`/video/play/${params.videoId}`)
}
/* 发送弹幕 */
export const sendDanmuApi = (params) => {
  return request.post('/danmu/send', params)
}
/* 获取弹幕列表 */
export const getDanmuListApi = (params) => {
  return request.get(`/danmu/list/${params.videoId}`)
}