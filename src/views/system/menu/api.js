import request from '@/utils/request'
import { oauthServerURL } from '@/config'

export function list (data) {
  return request({
    url: oauthServerURL + '/system/sysMenu/selectMenuList',
    method: 'post',
    data
  })
}

export function details (data) {
  return request({
    url: oauthServerURL + '/system/sysMenu/get',
    method: 'post',
    data: { id: data.id }
  })
}

export function add (data) {
  return request({
    url: oauthServerURL + '/system/sysMenu/add',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: oauthServerURL + '/system/sysMenu/update',
    method: 'post',
    data
  })
}

export function del (ids) {
  return request({
    url: oauthServerURL + '/system/sysMenu/delete',
    method: 'post',
    data: { ids: [ids] }
  })
}
