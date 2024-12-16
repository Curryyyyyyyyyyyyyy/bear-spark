import request from '@/util/request'

/* 上传文件 */
export const uploadApi = (file) => {
  return request.post('/file/upload', {
    data:file,
    headers:{
      'Content-Type':'multipart/form-data'
    }
  })
}