import request from '@/util/request.js'

/* 登录 */
export const loginApi = (params) => {
  return request.post('/user/login', params)
}
/* 发送验证码 */
export const sendVEcodeApi = (params) => {
  return request.post('/user/send', params)
}
/* 验证验证码 */
export const verifyVEcodeApi = (params) => {
  return request.post('/user/verify', params)
}
/* 注册 */
export const registerPwdApi = (params) => {
  return request.post('/user/password', params)
}
/* 修改密码 */
export const modifyPwdApi = (params) => {
  return request.put('/user/password', params)
}
/* 获取用户信息 */
export const getUserInfoApi = () => {
  return request.get('/info/user')
}
/* 获取用户关注列表 */
export const getFollowerListApi = () => {
  return request.get('/happening/followerList')
}