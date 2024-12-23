import request from '@/util/request.js'

/* 发布动态 */
export const publishNewsApi = (params) => {
  return request.post('/happening/publish',params)
}
/* 获取动态页准备信息 */
export const getNewsPrepareApi = () => {
  if(import.meta.env.VITE_MOCK) {
    return {
      recentTagList: [
        {
          content:'111',
          viewNum:1,
          discussNum:1,
        },
        {
          content:'222',
          viewNum:2,
          discussNum:2,
        },
        {
          content:'333',
          viewNum:3,
          discussNum:3,
        },
        {
          content:'444',
          viewNum:4,
          discussNum:4,
        },
        {
          content:'555',
          viewNum:5,
          discussNum:5,
        },
        {
          content:'666',
          viewNum:6,
          discussNum:6,
        },
        {
          content:'777',
          viewNum:7,
          discussNum:7,
        },
        {
          content:'888',
          viewNum:8,
          discussNum:8,
        },
      ],
      followerList: [
        {avatarUrl:'/imgs/default-avatar.png',username:'周权',fansNumInfo:111},
        {avatarUrl:'/imgs/default-avatar.png',username:'谢家辉',fansNumInfo:222},
        {avatarUrl:'/imgs/default-avatar.png',username:'何昕',fansNumInfo:333},
        {avatarUrl:'/imgs/default-avatar.png',username:'叶凯乐',fansNumInfo:444},
        {avatarUrl:'/imgs/default-avatar.png',username:'王思杰',fansNumInfo:555},
        {avatarUrl:'/imgs/default-avatar.png',username:'卢家秦',fansNumInfo:666},
        {avatarUrl:'/imgs/default-avatar.png',username:'周权',fansNumInfo:777},
        {avatarUrl:'/imgs/default-avatar.png',username:'周权',fansNumInfo:888},
      ],
      sideBarUrl: '/imgs/slide-bar.jpg'
    }
  }
  return request.get('/happening/prepare')
}
/* 获取动态列表 */
export const getNewsListApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "total": 4,
      "records": [
        {
          "happeningInfo":{
            "happeningId":1,
            "title": "现无称点进其原",
            "content": "666<s>555",
            "atUserInfoList":[
              {
                "username":"周权",
                "userId":10086,
              }
            ],
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
                "title": "现无称点进其原",
                "content": "11<s>",
                "atUserInfoList":[
                  {
                    "atUsername":'周权',
                    "atUserId":1
                  }
                ],
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
              "publisherInfo":{
                "userId":1001,
                "username": "万超",
                "avatarUrl": "http://dummyimage.com/100x100",
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
            "avatarUrl": "http://dummyimage.com/100x100",
          },
        },
      ]
    }
  }
  return request.get('/happening', {
    params
  })
}
/* 分页获取标签 */
export const getTagListApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "total":10,
      "records":[
        {
          "tagId": 98,
          "viewNumInfo": "21",
          "discussNumInfo": "93",
          "content": "laboris <em>anim</em> pariatur"
        },
        {
          "tagId": 59,
          "viewNumInfo": "97",
          "discussNumInfo": "65",
          "content": "laboris irure ut dolor nulla"
        },
        {
          "tagId": 59,
          "viewNumInfo": "97",
          "discussNumInfo": "65",
          "content": "laboris irure ut dolor nulla"
        },
        {
          "tagId": 59,
          "viewNumInfo": "97",
          "discussNumInfo": "65",
          "content": "laboris irure ut dolor nulla"
        },
        {
          "tagId": 59,
          "viewNumInfo": "97",
          "discussNumInfo": "65",
          "content": "laboris irure ut dolor nulla"
        },
        {
          "tagId": 59,
          "viewNumInfo": "97",
          "discussNumInfo": "65",
          "content": "laboris irure ut dolor nulla"
        },
        {
          "tagId": 59,
          "viewNumInfo": "97",
          "discussNumInfo": "65",
          "content": "laboris irure ut dolor nulla"
        },
        {
          "tagId": 59,
          "viewNumInfo": "97",
          "discussNumInfo": "65",
          "content": "laboris irure ut dolor nulla"
        },
        {
          "tagId": 59,
          "viewNumInfo": "97",
          "discussNumInfo": "65",
          "content": "laboris irure ut dolor nulla"
        },
        {
          "tagId": 59,
          "viewNumInfo": "97",
          "discussNumInfo": "65",
          "content": "laboris irure ut dolor nulla"
        },
      ]
    }
  }
  return request.get('/tag', {
    params
  })
}
/* 获取动态详情 */
export const getNewsDetailApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "happeningInfo":{
        "happeningId":1,
        "title": "现无称点进其原",
        "content": "11<s>",
        "atUserInfoList":[
          {
            "username":'周权',
            "userId":1
          }
        ],
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
            "happeningId":2,
            "title": "现无称点进其原",
            "content": "11<s>",
            "atUserInfoList":[
              {
                "username":'周权',
                "userId":1
              }
            ],
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
          "publisherInfo":{
            "userId":1001,
            "username": "万超",
            "avatarUrl": "http://dummyimage.com/100x100",
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
  if(import.meta.env.VITE_MOCK) {
    return {
      "publisherInfo": {
        "userId": 0,
        "username": "curryyy",
        "avatarUrl": "/imgs/default-avatar.png"
      },
      "title": "标题",
      "desc": "好不好看",
      "voteNumInfo": "66",
      "voteType": 1,
      "optionList": [
        {
          "optionId": 0,
          "optionContent": "1",
          "optionPhotoUrl": "/imgs/default-avatar.png",
          "optionPercent": "100",
          "selected": 1
        },
        {
          "optionId": 0,
          "optionContent": "2",
          "optionPhotoUrl": "/imgs/default-avatar.png",
          "optionPercent": "0",
          "selected": 0
        }
      ],
      "voteLim": 1,
      "dead": 0,
      "voted": 0,
      "voterInfoList": [
        {
          "username": "周权",
          "avatarUrl": "/imgs/default-avatar.png",
          "optionsInfo": "1"
        }
      ]
    }
  }
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
  if(import.meta.env.VITE_MOCK) {
    return {
      "total": 6,
      "records": [
        {
          "userId": 1,
          "username": "curyyyy",
          "avatarUrl": "/imgs/default-avatar.png"
        },
        {
          "userId": 1,
          "username": "curyyyy",
          "avatarUrl": "/imgs/default-avatar.png"
        },
        {
          "userId": 1,
          "username": "curyyyy",
          "avatarUrl": "/imgs/default-avatar.png"
        },
        {
          "userId": 1,
          "username": "curyyyy",
          "avatarUrl": "/imgs/default-avatar.png"
        },
        {
          "userId": 1,
          "username": "curyyyy",
          "avatarUrl": "/imgs/default-avatar.png"
        },
        {
          "userId": 1,
          "username": "curyyyy",
          "avatarUrl": "/imgs/default-avatar.png"
        },
      ]
    }
  }
  return request.get('/happening/list/liked', {
    params
  })
}
/* 分页查询转发用户列表 */
export const getForwardListApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "total": 6,
      "records": [
        {
          "userId": 1,
          "username": "curyyyy",
          "avatarUrl": "/imgs/default-avatar.png"
        },
        {
          "userId": 1,
          "username": "curyyyy",
          "avatarUrl": "/imgs/default-avatar.png"
        },
        {
          "userId": 1,
          "username": "curyyyy",
          "avatarUrl": "/imgs/default-avatar.png"
        },
        {
          "userId": 1,
          "username": "curyyyy",
          "avatarUrl": "/imgs/default-avatar.png"
        },
        {
          "userId": 1,
          "username": "curyyyy",
          "avatarUrl": "/imgs/default-avatar.png"
        },
        {
          "userId": 1,
          "username": "curyyyy",
          "avatarUrl": "/imgs/default-avatar.png"
        },
      ]
    }
  }
  return request.get('/happening/list/forwarded', {
    params
  })
}