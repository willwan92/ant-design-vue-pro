/**
 * 基于 axios 的封装，便于统一处理 POST，GET 等请求参数，请求头，以及错误提示信息等。
 */
import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
// 可以统一设置 baseUrl 和超时时间等
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

/**
 * 请求错误处理函数
 * 这里封装的只有401、403和未登录的情况。
 * 如果后期需要完善，可以参考 ant-design-pro 的写法：
 * https://github.com/ant-design/ant-design-pro/blob/master/src/utils/request.ts
 */
const err = (error) => {
  if (error.response) {
    const data = error.response.data
		const token = Vue.ls.get(ACCESS_TOKEN)
		// 403
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
		}
		// 401 或者 未登录
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
			})
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// 请求拦截器
// service.interceptors.request.use(config => {
// 	// 发送请求之前做些什么
// }, error => {
// 	// 对请求错误做些什么
// })

// 请求拦截器：请求头添 Access-Token，统一错误处理
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// 响应拦截器
// service.interceptors.response.use(config => {
// 	// 对响应数据做点什么
// }, error => {
// 	// 对响应错误做点什么
// })

// 响应拦截器：返回服务端响应数据，统一错误处理
service.interceptors.response.use((response) => {
  return response.data
}, err)

// installer 插件：把 service（axios实例）传给 VueAxios 插件，再包装成插件
const installer = {
  vm: {},
  install (Vue) {
		Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
