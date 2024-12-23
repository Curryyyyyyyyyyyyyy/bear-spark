import request from '@/util/request'

/* 上传文件 */
export const uploadApi = (file,moduleCode) => {
  return request(`/file/upload/${moduleCode}`, {
    method:'POST',
    data:file,
    headers:{
      'Content-Type':'multipart/form-data'
    }
  })
}