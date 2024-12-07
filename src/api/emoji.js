import request from '@/util/request.js'

/* 获取表情包列表 */
export const getEmojiListApi = () => {
  return request.get('/happening/emojiList')
}