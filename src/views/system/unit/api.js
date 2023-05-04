import request from '@/utils/request'
import { oauthServerURL } from '@/config'

export function list (data) {
  return request({
    url: oauthServerURL + '/system/org/selectTreeOrg',
    method: 'post',
    data
  })
}

export function details (data) {
  return request({
    url: oauthServerURL + '/system/org/get',
    method: 'post',
    data: { id: data.id }
  })
}

export function add (data) {
  return request({
    url: oauthServerURL + '/system/org/add',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: oauthServerURL + '/system/org/update',
    method: 'post',
    data
  })
}

export function del (ids) {
  return request({
    url: oauthServerURL + '/system/org/delete',
    method: 'post',
    data: { ids: [ids] }
  })
}
