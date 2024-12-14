import request from '@/util/request.js'

const mock = true

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
  if(mock) {
    return {
      "happeningInfo":{
        "happeningId":1,
        "title": "现无称点进其原",
        "content": "11",
        "tag": "pariatur eiusmod aliqua labore reprehenderit",
        "viewNumInfo": 41,
        "likeNumInfo": '50',
        "commentNumInfo": 9,
        "forwardNumInfo":0,
        "commentAble": 0,
        "advanceRelease": 0,
        "voteSimpleInfo": {
            "voteId": 8,
            "title": "需观反干分取必",
            "voteNumInfo": "43"
        },
        "quotedHappening":{
          "happeningInfo":{
          "happeningId":1,
          "username": "万超",
          "avatarUrl": "http://dummyimage.com/100x100",
          "title": "现无称点进其原",
          "content": "",
          "tag": "pariatur eiusmod aliqua labore reprehenderit",
          "viewNumInfo": 41,
          "likeNumInfo": '50',
          "commentNumInfo": 9,
          "forwardNumInfo":0,
          "commentAble": 0,
          "advanceRelease": 0,
          "voteSimpleInfo": {
            "voteId": 8,
            "title": "需观反干分取必",
            "voteNumInfo": "43"
          },
          "imgUrlList": [
              "http://dummyimage.com/400x400"
          ],
          "pubTimeInfo": "1975-04-15 04:31:03"
          },
        },
        "imgUrlList": [
            "http://dummyimage.com/400x400"
        ],
        "pubTimeInfo": "1975-04-15 04:31:03"
      },
      "publisherInfo":{
        "userId":1001,
        "username": "万超",
        "avatarUrl": "/imgs/default-avatar.png",
      },
    }
  } else {
    return request.get('/happening/detail', {
      params
    })
  }
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
/* 分页查询点赞用户列表 */
export const getLikeListApi = (params) => {
  return request.get('/happening/list/liked', {
    params
  })
}
/* 分页查询转发用户列表 */
export const getForwardListApi = (params) => {
  return request.get('/happening/list/forwarded', {
    params
  })
}