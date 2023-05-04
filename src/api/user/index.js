import request from '@/utils/request'
import { oauthServerURL, isSSOEnable } from '@/config'

// 登录
export function login (data) {
  return request({
    url: oauthServerURL + '/login',
    method: 'post',
    data
  })
}

// 获取当前登录用户信息
export function getInfo () {
  return request({
    url: oauthServerURL + '/system/getInfo',
    method: 'post'
  })
}

// 获取登录图形验证码
export function getCodeImg () {
  return request({
    url: oauthServerURL + '/captchaImage',
    method: 'get'
  })
}

// 退出
export function logout () {
  if (isSSOEnable) {
    // 如果开启sso单点登录，则使用sso来退出
    window.location.href = process.env.VUE_APP_SSO_LOGOUT_URL + '?redirect_url=' + window.location.origin
  }
  return request({
    url: oauthServerURL + '/logout',
    method: 'post'
  })
}

// 获取当前登录用户拥有的菜单
export function buildMenus () {
  return request({
    url: oauthServerURL + '/system/sysMenu/getRouters',
    method: 'post'
  })
}

// 修改密码
export function editPwd (data) {
  return request({
    url: oauthServerURL + '/system/sysUser/editPwd',
    method: 'post',
    data
  })
}

// 修改用户信息
export function editUser (data) {
  return request({
    url: oauthServerURL + '/system/sysUser/updateSelf',
    method: 'post',
    data
  })
}

// 获取用户未读消息数
export function messageUnread () {
  return request({
    url: oauthServerURL + '/system/message/getUnreadCount',
    method: 'post'
  })
}
