import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
  // withCredentials: true // https用，带凭证true
})

// request interceptor 请求拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 当token存在时，为请求头设置token
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response.data
  //   // if the custom code is not 20000, it is judged as an error.
  //   if (res.code !== 1000) {
  //     Message({
  //       message: res.msg || 'Error',
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //
  //     // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
  //     if (res.code === 2000) {
  //       // to re-login
  //       MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or login again', 'Confirm logout', {
  //         confirmButtonText: 'Re-Login',
  //         cancelButtonText: 'Cancel',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('user/resetToken').then(() => {
  //           location.reload()
  //         })
  //       })
  //     }
  //     return Promise.reject(new Error(res.message || 'Error'))
  //   } else {
  //     return res
  //   }
  // },
  // error => {
  //   console.log('err' + error) // for debug
  //   Message({
  //     message: error.message,
  //     type: 'error',
  //     duration: 5 * 1000
  //   })
  //   return Promise.reject(error)
  }
)

export default service
