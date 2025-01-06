import request from '@/util/request.js'

//#region 专栏
/* 发布专栏 */
export const publishArticleApi = (params) => {
  return request.post(('/article'),params)
}
/* 获取专栏信息 */
export const getArticleInfoApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "title": "哈哈哈",
      "summary": "1234566789",
      "content": "<p>1234566789</p>",
      "coverUrl": "/imgs/logo.png",
      "tagId": 66,
      "tag": "情感",
      "categoryInfoList": [
        {
          "categoryId": 0,
          "categoryName": "数据结构"
        },
        {
          "categoryId": 1,
          "categoryName": "JavaScript"
        },
        {
          "categoryId": 2,
          "categoryName": "CSS"
        },
      ],
      "visibility": 1,
      "commentAble": 0,
      "declaration": 0,
      "reprintArticleUrl": "http://123.com"
    }
  }
  return request.get(`/article/${params.articleId}`)
}
/* 修改专栏 */
export const modifyArticleApi = (params) => {
  return request.put('/article',params)
}
/* 删除专栏 */
export const deleteArticleApi = (params) => {
  return request.delete(`/article/${params.articleId}`)
}
/* 获取专栏详情 */
export const getArticleDetailApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "title": "哈哈哈",
      "summary": "123456789",
      "content": "<p>哈哈哈哈</p><img src='/imgs/indexBg.png'>",
      "coverUrl": "/imgs/logo.png",
      "tagId": 55,
      "tag": "游戏",
      "categoryInfoList": [
        {
          "categoryId": 0,
          "categoryName": "数据结构"
        },
        {
          "categoryId": 1,
          "categoryName": "java"
        },
        {
          "categoryId": 2,
          "categoryName": "css"
        },
      ],
      "visibility": 1,
      "commentAble": 0,
      "declaration": 0,
      "reprintArticleUrl": "http://123.com",
      "likeNumInfo": "12",
      "meritNumInfo":"33",
      "collectNumInfo": "2",
      "forwardNumInfo": "1",
      "commentNumInfo": "3",
      "liked":0,
      "merited":1,
      "collected":0,
      "pubTimeInfo": "2024-12-12 12:45",
      "publisherInfo": {
        "userId": 0,
        "username": "curry",
        "avatarUrl": "/imgs/default-avatar.png"
      }
    }
  }
  request.get(`/article/detail/${params.articleId}`)
}
/* 分页获取指定分类专栏 */
export const getArticleListApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "total":10,
      "records":[
        {
          "articleId": 1,
          "title": "111",
          "coverUrl": "/imgs/slide-bar.jpg",
          "summary":'哈哈哈哈哈哈哈哈哈哈摘要1111111111111111111111111111111111111111111111随哈吃撒的活动v哦i我从未佛i无法弄完',
          "declaration": 0,
          "likeNumInfo": "13",
          "viewNumInfo": "14",
          "commentNumInfo": "1",
          "collectNumInfo": "4",
          "pubTimeInfo": "2024-1-1 13:10:00"
        },
        {
          "articleId": 2,
          "title": "111",
          "coverUrl": "/imgs/slide-bar.jpg",
          "summary":'哈哈哈哈哈哈哈哈哈哈摘要1111111111111111111111111111111111111111111111随哈吃撒的活动v哦i我从未佛i无法弄完',
          "declaration": 0,
          "likeNumInfo": "13",
          "viewNumInfo": "14",
          "commentNumInfo": "1",
          "collectNumInfo": "4",
          "pubTimeInfo": "2024-1-1 13:10:00"
        },
        {
          "articleId": 3,
          "title": "111",
          "coverUrl": "/imgs/slide-bar.jpg",
          "summary":'哈哈哈哈哈哈哈哈哈哈摘要1111111111111111111111111111111111111111111111随哈吃撒的活动v哦i我从未佛i无法弄完',
          "declaration": 0,
          "likeNumInfo": "13",
          "viewNumInfo": "14",
          "commentNumInfo": "1",
          "collectNumInfo": "4",
          "pubTimeInfo": "2024-1-1 13:10:00"
        },
      ]
    }
  }
  return request.get(`/article/${params.pageNum}/${params.pageSize}`, {
    params
  })
}
/* 收藏专栏 */
export const collectArticleApi = (params) => {
  return request.post(`/collect/article/${params.articleId}`)
}
/* 投功德 */
export const giveMeritApi = (params) => {
  return request.post(`/merit/article/${params.articleId}`)
}
//#endregion
//#region 专栏分类
/* 获取专栏分类列表 */
export const getCategoryListApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return [
      {
        "categoryId": 10,
        "categoryName": "数据结构哈哈哈",
        "articleNum":10
      },
      {
        "categoryId": 1,
        "categoryName": "c语言",
        "articleNum":11
      },
      {
        "categoryId": 2,
        "categoryName": "Java",
        "articleNum":1111
      },
      {
        "categoryId": 3,
        "categoryName": "Vue",
        "articleNum":10
      },
      {
        "categoryId": 4,
        "categoryName": "React",
        "articleNum":10
      },
    ]
  }
  return request.get('/category/list', {
    params
  })
}
/* 获取专栏分类信息 */
export const getCategoryInfoApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "categoryId": 0,
      "categoryName": "数据结构",
      "categoryPhotoUrl": "/imgs/slide-bar.jpg"
    }
  }
  return request.get(`/category/${params.categoryId}`)
}
/* 添加专栏分类 */
export const addCategoryApi = (params) => {
  request.post('/category', params)
}
/* 修改专栏分类 */
export const modifyCategoryApi = (params) => {
  request.put('/category', params)
}
/* 删除专栏分类 */
export const deleteCategoryApi = (params) => {
  request.delete(`/category/${params.categoryId}`)
}
//#endregion
//#region 专栏草稿
/* 保存草稿 */
export const saveDraftApi = (params) => {
  return request.post('/draft',params)
}
/* 获取草稿 */
export const getDraftInfoApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return {
      "draftId": 1,
      "title": "哈哈哈",
      "content": "<p>123456789</p>"
    }
  }
  return request.get(`/draft/${params.draftId}`)
}
/* 删除草稿 */
export const deleteDraftApi = (params) => {
  return request.delete(`/draft/${params.draftId}`)
}
/* 分页获取草稿列表 */
export const getDraftListApi = (params) => {
  if(import.meta.env.VITE_MOCK) {
    return {
      total:3,
      records:[
        {
          "draftId": 0,
          "title": "11dcscavvavav1",
          "lastSaveTimeInfo": "2024-10-12 23:12"
        },
        {
          "draftId": 1,
          "title": "222sdavsvs",
          "lastSaveTimeInfo": "2024-10-13 23:12"
        },
        {
          "draftId": 1,
          "title": "222sdavsvs",
          "lastSaveTimeInfo": "2024-10-13 23:12"
        },
        {
          "draftId": 1,
          "title": "222sdavsvs",
          "lastSaveTimeInfo": "2024-10-13 23:12"
        },
        {
          "draftId": 2,
          "title": "33svdcsdddddddddddddddsssssssssvs3",
          "lastSaveTimeInfo": "2024-10-14 23:12"
        },
      ]
    }
  }
  return request.get(`/draft/${params.pageNum}/${params.pageSize}`)
}
//#endregion