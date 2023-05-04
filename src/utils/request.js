import axios from 'axios'
import { Notification, MessageBox } from 'element-ui'
import { getStorage, removeStorage } from '@/utils/auth'
import { serverURL } from '@/config'
import store from '@/store'
import sm2 from '@/utils/sm2'

// 创建axios实例
const service = axios.create({
  baseURL: serverURL,
  timeout: 1000 * 60 // 请求超时时间
})

const timeoutApiList = ['/merge']

// request拦截器
service.interceptors.request.use(
  config => {
    // 自动添加token
    if (getStorage('token')) {
      config.headers['token'] = getStorage('token') // 让每个请求携带自定义token
    }
    // 设置Content-Type
    config.headers['Content-Type'] = config.ContentType || 'application/json'
    // 请求头加入时间戳，做防重复及恶意刷请求验证
    const timestamp = new Date().getTime().toString()
    const sign = sm2.doSignature(timestamp)
    config.headers['timestamp'] = timestamp
    config.headers['sign'] = sign
    // post请求体中的data默认置一个空对象
    if (!config.data) {
      config.data = {}
    }
    // 请求超时不管的接口白名单
    for (const item of timeoutApiList) {
      if (config.url.indexOf(item) > -1) {
        config.timeout = 0
        break
      }
    }
    // 请求参数加密
    if (sm2.enableGlobal) {
      // 如果开启全局加密，判断请求是否为不加密请求
      if (!sm2.isForbiddenEncryptRequestBodyUrls(config.url)) {
        config.data = sm2.getSm2DataHexByObject(config.data)
      }
    } else {
      // 如果未开启全局加密，判断请求是否为加密请求
      if (sm2.isMustEncryptRequestBodyUrls(config.url)) {
        config.data = sm2.getSm2DataHexByObject(config.data)
      }
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // status非200视为请求失败
    if (response.data.statusCode !== '200') {
      Notification.error({ title: response.data.message })
      return Promise.reject(new Error('error'))
    }
    // 如果响应类型为string，需要解密
    if ((typeof response.data) === 'string') {
      response.data = sm2.getSm2DataByString(response.data)
      response.data = JSON.parse(response.data)
    }
    // 判断一下响应中是否有 token，如果有就直接使用此 token 替换掉本地的 token。你可以根据你的业务需求自己编写更新 token 的逻辑
    if (response.headers.token) {
      store.dispatch('Login', response.headers.token)
    }
    return response.data
  },
  error => {
    let status = 0
    try {
      status = error.response.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({ title: '网络请求超时' })
        return Promise.reject(error)
      }
    }
    if (status) {
      switch (status) {
        case 400:
          Notification.error({ title: '接口请求失败' })
          break
        case 401:
          MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            removeStorage('token')
            store.dispatch('LogOut').then(() => {
              window.location.href = '/' // 为了重新实例化vue-router对象 避免bug
            })
          })
          break
        case 403:
          Notification.error({ title: '拒绝访问' })
          break
        case 404:
          Notification.error({ title: '请求失败,未找到该资源' })
          break
        case 405:
          Notification.error({ title: '请求方法未允许' })
          break
        case 408:
          Notification.error({ title: '请求超时' })
          break
        case 500:
          Notification.error({ title: error.response.data.message })
          break
        case 501:
          Notification.error({ title: '网络未实现' })
          break
        case 502:
          Notification.error({ title: '网络错误' })
          break
        case 503:
          Notification.error({ title: '服务不可用' })
          break
        case 504:
          Notification.error({ title: '网络超时' })
          break
        case 505:
          Notification.error({ title: 'http版本不支持该请求' })
          break
        case 704:
          Notification.error({ title: '越权访问' })
          break
        default:
          Notification.error({ title: error.response.data.message })
      }
    }
    return Promise.reject(error)
  }
)

export default service
