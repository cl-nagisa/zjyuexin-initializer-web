import request from '@/utils/request'
import { oauthServerURL } from '@/config'

export function list (data) {
  return request({
    url: oauthServerURL + '/system/sysRole/page',
    method: 'post',
    data
  })
}

export function details (data) {
  return request({
    url: oauthServerURL + '/system/sysRole/get',
    method: 'post',
    data: { id: data.id }
  })
}

export function add (data) {
  return request({
    url: oauthServerURL + '/system/sysRole/add',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: oauthServerURL + '/system/sysRole/update',
    method: 'post',
    data
  })
}

export function del (data) {
  return request({
    url: oauthServerURL + '/system/sysRole/delete',
    method: 'post',
    data
  })
}

// 获取角色已经获取的权限
export function getUserRoles (data) {
  return request({
    url: oauthServerURL + '/system/sysMenu/selectRoleMenuList',
    method: 'post',
    data
  })
}

// 分配用户
export function setUser (data) {
  return request({
    url: oauthServerURL + '/system/sysRole/batchInsert',
    method: 'post',
    data
  })
}
