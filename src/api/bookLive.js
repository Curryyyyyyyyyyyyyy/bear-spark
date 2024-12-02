import request from '@/util/request'

/* 撤销直播预约 */
export const revokeBookLiveApi = (params) => {
  return request.post('/bookLive/cancel', params)
}
/* 修改直播预约状态 */
export const modBookLiveStateApi = (params) => {
  return request.post('/bookLive/state', params)
}