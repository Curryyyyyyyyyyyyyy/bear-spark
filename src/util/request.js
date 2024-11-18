import axios from "axios";
import { ElMessage } from "element-plus";
import useUser from '@/store/user.js'
const userStore = useUser()

const instance = axios.create({
  baseURL:import.meta.env.VITE_BASE_URL,
  timeout:5000
})


// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么

  // 只要有token，就在请求时携带，便于请求需要授权的接口
  const token = userStore.token
  if(token) {
    config.headers['Authorization'] = token
  }

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  const res = response.data
  if(res.code !== 200) {
    if(res.code === 400) {
      let errMsg
      if(!userStore.token) {
        errMsg = '请先登录'
        ElMessage.warning(errMsg)
      } else {
        errMsg = '登录失效，请重新登录'
        ElMessage.warning(errMsg)
      }
      location.href = '/#/index'
      return Promise.reject('请先登录')
    }
    if(res.code === 500) {
      ElMessage.error('服务器异常')
      return Promise.reject('服务器异常')
    }
    ElMessage.error(res.msg)
    return Promise.reject(res.msg)
  }
  return res.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

// 导出实例
export default instance