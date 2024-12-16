import request from '@/util/request'

/* 分页查询动态的楼评论 */
export const getBldgCommentApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "total": 20,
      "bldgTotal": 6,
      "bldgCommentList": [
        {
          "commentId": 1,
          "content": "哈哈哈哈哈哈哈哈<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2020-11-11 18:00:00",
          "likeNumInfo": "3",
          "liked": 0,
          "replyNumInfo": 10,
          "replyNum":20,
          "userInfo": {
            "userId": 0,
            "username": "curryyyyy",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 2,
          "content": "哈哈哈哈哈哈哈哈<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2020-11-11 18:00:00",
          "likeNumInfo": "3",
          "liked": 0,
          "replyNumInfo": 10,
          "replyNum":20,
          "userInfo": {
            "userId": 0,
            "username": "curryyyyy",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 3,
          "content": "哈哈哈哈哈哈哈哈<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2020-11-11 18:00:00",
          "likeNumInfo": "3",
          "liked": 0,
          "replyNumInfo": 10,
          "replyNum":20,
          "userInfo": {
            "userId": 0,
            "username": "curryyyyy",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 4,
          "content": "哈哈哈哈哈哈哈哈<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2020-11-11 18:00:00",
          "likeNumInfo": "3",
          "liked": 0,
          "replyNumInfo": 10,
          "replyNum":20,
          "userInfo": {
            "userId": 0,
            "username": "curryyyyy",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 5,
          "content": "哈哈哈哈哈哈哈哈<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2020-11-11 18:00:00",
          "likeNumInfo": "3",
          "liked": 0,
          "replyNumInfo": 10,
          "replyNum":20,
          "userInfo": {
            "userId": 0,
            "username": "curryyyyy",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 6,
          "content": "哈哈哈哈哈哈哈哈<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2020-11-11 18:00:00",
          "likeNumInfo": "3",
          "liked": 0,
          "replyNumInfo": 10,
          "replyNum":20,
          "userInfo": {
            "userId": 0,
            "username": "curryyyyy",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
      ]
    }
  } else {
    return request.get('/comment/happening', {
      params
    })
  }
}
/* 分页查询层评论 */
export const getLayerCommentApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "layerCommentList": [
        {
          "commentId": 90,
          "content": "喜喜喜喜喜喜<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2033-3-3 12:12:56",
          "likeNumInfo": "12",
          "liked": 0,
          "repliedUserId": 0,
          "repliedUserName": "james",
          "userInfo": {
            "userId": 0,
            "username": "james",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 91,
          "content": "喜喜喜喜喜喜<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2033-3-3 12:12:56",
          "likeNumInfo": "12",
          "liked": 0,
          "repliedUserId": 0,
          "repliedUserName": "james",
          "userInfo": {
            "userId": 0,
            "username": "james",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 92,
          "content": "喜喜喜喜喜喜<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2033-3-3 12:12:56",
          "likeNumInfo": "12",
          "liked": 0,
          "repliedUserId": 0,
          "repliedUserName": "james",
          "userInfo": {
            "userId": 0,
            "username": "james",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 93,
          "content": "喜喜喜喜喜喜<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2033-3-3 12:12:56",
          "likeNumInfo": "12",
          "liked": 0,
          "repliedUserId": 0,
          "repliedUserName": "james",
          "userInfo": {
            "userId": 0,
            "username": "james",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 94,
          "content": "喜喜喜喜喜喜<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2033-3-3 12:12:56",
          "likeNumInfo": "12",
          "liked": 0,
          "repliedUserId": 0,
          "repliedUserName": "james",
          "userInfo": {
            "userId": 0,
            "username": "james",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 95,
          "content": "喜喜喜喜喜喜<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2033-3-3 12:12:56",
          "likeNumInfo": "12",
          "liked": 0,
          "repliedUserId": 0,
          "repliedUserName": "james",
          "userInfo": {
            "userId": 0,
            "username": "james",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 96,
          "content": "喜喜喜喜喜喜<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2033-3-3 12:12:56",
          "likeNumInfo": "12",
          "liked": 0,
          "repliedUserId": 0,
          "repliedUserName": "james",
          "userInfo": {
            "userId": 0,
            "username": "james",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 97,
          "content": "喜喜喜喜喜喜<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2033-3-3 12:12:56",
          "likeNumInfo": "12",
          "liked": 0,
          "repliedUserId": 0,
          "repliedUserName": "james",
          "userInfo": {
            "userId": 0,
            "username": "james",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 98,
          "content": "喜喜喜喜喜喜<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2033-3-3 12:12:56",
          "likeNumInfo": "12",
          "liked": 0,
          "repliedUserId": 0,
          "repliedUserName": "james",
          "userInfo": {
            "userId": 0,
            "username": "james",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
        {
          "commentId": 99,
          "content": "喜喜喜喜喜喜<s>",
          "atUserInfoList":[
            {
              "username":"周权",
              "userId":1
            }
          ],
          "pubTimeInfo": "2033-3-3 12:12:56",
          "likeNumInfo": "12",
          "liked": 0,
          "repliedUserId": 0,
          "repliedUserName": "james",
          "userInfo": {
            "userId": 0,
            "username": "james",
            "avatarUrl": "/imgs/default-avatar.png"
          }
        },
      ]
    }
  } else {
    return request.get('/comment/layer', {
      params
    })
  }
}
/* 动态评论 */
export const commentHappeningApi = (params) => {
  return request.post('/comment/happening', params)
}
/* 回复评论 */
export const replyCommentApi = (params) => {
  return request.post('/comment/reply', params)
}
/* 删除评论 */
export const deleteCommentApi = (params) => {
  return request.delete('/comment', {
    params
  })
}
/* 点赞/取消点赞评论 */
export const likeCommentApi = (params) => {
  return request.post('/like/comment', params)
}
