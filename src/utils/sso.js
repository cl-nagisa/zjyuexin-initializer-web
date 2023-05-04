import { isSSOEnable, protocol } from '@/config'
import { getUrlQuery } from '@/utils/tools'
import { getStorage, setStorage } from '@/utils/auth'

(() => {
  // 开启sso单点登录的话
  if (isSSOEnable) {
    // 重定向url
    const redirectUrl = protocol + window.location.host
    const token = getStorage('token')
    if (!token) {
      let ssoToken = getUrlQuery('token')
      if (!ssoToken) {
        window.location.href = process.env.VUE_APP_SSO_LOGIN_URL + '?redirect_url=' + redirectUrl
      } else {
        ssoToken = ssoToken.replace('+', ' ')
        setStorage('token', ssoToken)
        window.location.href = redirectUrl
      }
    }
  }
})()
