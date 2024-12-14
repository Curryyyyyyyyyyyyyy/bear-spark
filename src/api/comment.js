import request from '@/util/request'

const mock = true

/* 分页查询动态的楼评论 */
export const getBldgCommentApi = (params) => {
  if(mock) {
    return {
      "total": 20,
      "bldgTotal": 6,
      "bldgCommentList": [
        {
          "commentId": 0,
          "content": "哈哈哈哈哈哈哈哈",
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
          "commentId": 0,
          "content": "哈哈哈哈哈哈哈哈",
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
          "commentId": 0,
          "content": "哈哈哈哈哈哈哈哈",
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
          "commentId": 0,
          "content": "哈哈哈哈哈哈哈哈",
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
          "commentId": 0,
          "content": "哈哈哈哈哈哈哈哈",
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
          "commentId": 0,
          "content": "哈哈哈哈哈哈哈哈",
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
  if(mock) {
    return {
      "layerCommentList": [
        {
          "commentId": 90,
          "content": "喜喜喜喜喜喜",
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
          "content": "喜喜喜喜喜喜",
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
          "content": "喜喜喜喜喜喜",
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
          "content": "喜喜喜喜喜喜",
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
          "content": "喜喜喜喜喜喜",
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
          "content": "喜喜喜喜喜喜",
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
          "content": "喜喜喜喜喜喜",
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
          "content": "喜喜喜喜喜喜",
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
          "content": "喜喜喜喜喜喜",
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
          "content": "喜喜喜喜喜喜",
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
