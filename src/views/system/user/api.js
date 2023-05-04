import request from '@/utils/request'
import { oauthServerURL } from '@/config'

export function tree () {
  return request({
    url: oauthServerURL + '/system/dept/orgDeptTree',
    method: 'post'
  })
}

export function list (data) {
  return request({
    url: oauthServerURL + '/system/sysUser/page',
    method: 'post',
    data
  })
}

export function details (data) {
  return request({
    url: oauthServerURL + '/system/sysUser/get',
    method: 'post',
    data
  })
}

export function add (data) {
  return request({
    url: oauthServerURL + '/system/sysUser/add',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: oauthServerURL + '/system/sysUser/update',
    method: 'post',
    data
  })
}

export function del (data) {
  return request({
    url: oauthServerURL + '/system/sysUser/delete',
    method: 'post',
    data
  })
}

// 锁定
export function lock (userId) {
  return request({
    url: oauthServerURL + '/system/sysUser/lockUser',
    method: 'post',
    data: { id: userId }
  })
}

// 解锁
export function unlock (userId) {
  return request({
    url: oauthServerURL + '/system/sysUser/relieveLocking',
    method: 'post',
    data: { id: userId }
  })
}

// 重置密码
export function resetPwd (data) {
  return request({
    url: oauthServerURL + '/system/sysUser/resetPwd',
    method: 'post',
    data
  })
}

export const downloadByIds = oauthServerURL + '/sysUser/exportExcel'
export const upload = oauthServerURL + '/sysUser/importData'
export const downloadTemplate = oauthServerURL + '/exampleTable/download'
