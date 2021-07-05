//封装网络模块

import axios from 'axios'
import { base_url } from '../configs/index'
//加载进度条
import NProgress from 'nprogress'
import "nprogress/nprogress.css";


//创建axios实例
const instance = axios.create({
  //请求根路劲
  baseURL: base_url,
  //超时时间
  timeout: 5000,
  // //请求头信息
  // headers: { 'token': sessionStorage.getItem('token') }
})
//设置更新请求头的方法
instance.defaults.headers.common['token'] = sessionStorage.getItem('token')
export let updateToken = () => {
  instance.defaults.headers.common['token'] = sessionStorage.getItem('token')

}
//请求拦截
instance.interceptors.request.use(config => {
  //请求前开启进度条
  NProgress.start();
  return config
}, err => {
  // console.log(err)
})
instance.interceptors.response.use(res => {
  //响应结束关闭进度条
  NProgress.done();
  return res.data
}, err => {
  console.log(err)
})

//封装get方法进行导出
export let get = function (url, params, headers) {
  // 配置请求头信息
  //instance.defaults.headers['token'] = headers
  return instance.get(url, { params })


}
//封装post方法进行导出
export let post = function (url, params) {
  return instance.post(url, params)

}
//创建一个将token信息保存到请求头的方法
export let setToken = function () {
  instance.defaults.headers.common['token'] = sessionStorage.getItem('token');
}