import axios from "axios"

/* 上传文件 */
export const uploadApi = (file) => {
  return axios({
    method:'post',
    url:'http://192.168.1.220:3732/bear-spark/file/upload',
    data:file,
    headers:{
      'Content-Type':'multipart/form-data'
    }
  })
}