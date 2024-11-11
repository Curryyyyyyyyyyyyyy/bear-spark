import request from '@/util/request.js'

export const loginApi = (account, password) => {
  return request.get('/user/login', {
    params:{
      account,
      password
    }
  })
}
export const sendVEcodeApi = (phone) => {
  return request.post('/user/send', {
    phone
  })
}
export const verifyVEcodeApi = (phone, code) => {
  return request.post('/user/verify', {
    phone,
    code
  })
}
export const registerPwdApi = (phone, password) => {
  return request.post('/user/password', {
    phone,
    password
  })
}
export const modifyPwdApi = (phone, password) => {
  return request.put('/user/password', {
    phone,
    password
  })
}