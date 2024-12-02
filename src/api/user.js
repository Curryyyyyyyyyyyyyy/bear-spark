import request from '@/util/request.js'

/* 登录 */
export const loginApi = (phone, password) => {
  return request.get('/user/login', {
    params:{
      phone,
      password
    }
  })
}
/* 发送验证码 */
export const sendVEcodeApi = (phone) => {
  return request.post('/user/send', {
    phone
  })
}
/* 验证验证码 */
export const verifyVEcodeApi = (phone, code) => {
  return request.post('/user/verify', {
    phone,
    code
  })
}
/* 注册 */
export const registerPwdApi = (phone, password) => {
  return request.post('/user/password', {
    phone,
    password
  })
}
/* 修改密码 */
export const modifyPwdApi = (phone, password) => {
  return request.put('/user/password', {
    phone,
    password
  })
}
/* 获取用户信息 */
export const getUserInfoApi = () => {
  return request.get('/info/user')
}