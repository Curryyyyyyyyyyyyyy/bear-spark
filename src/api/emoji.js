import request from '@/util/request.js'

/* 获取表情包列表 */
export const getEmojiListApi = () => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "emojiUrlList":[
        '/imgs/default-avatar.png',
        '/imgs/default-avatar.png',
        '/imgs/default-avatar.png',
        '/imgs/default-avatar.png',
        '/imgs/default-avatar.png',
        '/imgs/default-avatar.png',
      ]
    }
  }
  return request.get('/happening/emojiList')
}