import axios from "axios";

const instanse = axios.create({
  baseURL:'',
  timeout:5000
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么

  // 只要有token，就在请求时携带，便于请求需要授权的接口
  // const token = store.getters.token
  // if(token) {
  //   config.headers['Access-Token'] = token
  //   config.headers.platform = 'H5' 
  // }

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

// 导出实例
export default instance