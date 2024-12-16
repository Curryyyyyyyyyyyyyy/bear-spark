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
  if(import.meta.env.VITE_MOCK) {
    return {
      "userId": 1,
      "username": "curryyyy",
      "avatarUrl": "/imgs/default-avatar.png",
      "followerNumInfo": "66",
      "fanNumInfo": "77",
      "happeningNumInfo": "88",
      "currencyInfo": {
        "meritNumInfo": "99",
        "coinNumInfo": "111"
      }
    }
  }
  return request.get('/info/user')
}
/* 获取用户关注列表 */
export const getFollowerListApi = () => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "followerList":[
        {
          username:'周权',
          avatarUrl:'/imgs/default-avatar.png',
          fansNumInfo:200
        },
        {
          username:'周权',
          avatarUrl:'/imgs/default-avatar.png',
          fansNumInfo:200
        },
        {
          username:'周权',
          avatarUrl:'/imgs/default-avatar.png',
          fansNumInfo:200
        },
        {
          username:'周权',
          avatarUrl:'/imgs/default-avatar.png',
          fansNumInfo:200
        },
        {
          username:'周权',
          avatarUrl:'/imgs/default-avatar.png',
          fansNumInfo:200
        },
        {
          username:'周权',
          avatarUrl:'/imgs/default-avatar.png',
          fansNumInfo:200
        },
        {
          username:'卢家秦',
          avatarUrl:'/imgs/default-avatar.png',
          fansNumInfo:200
        },
        {
          username:'谢佳辉',
          avatarUrl:'/imgs/default-avatar.png',
          fansNumInfo:200
        },
      ]
    }
  }
  return request.get('/happening/followerList')
}