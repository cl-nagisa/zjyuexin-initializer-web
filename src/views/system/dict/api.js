import request from '@/utils/request'
import { oauthServerURL } from '@/config'

export function list (data) {
  return request({
    url: oauthServerURL + '/system/sysDictType/page',
    method: 'post',
    params: data
  })
}

export function add (data) {
  return request({
    url: oauthServerURL + '/system/sysDictType/add',
    method: 'post',
    data
  })
}

export function details (data) {
  return request({
    url: oauthServerURL + '/system/sysDictType/get',
    method: 'post',
    data: { id: data.id }
  })
}

export function edit (data) {
  return request({
    url: oauthServerURL + '/system/sysDictType/update',
    method: 'post',
    data
  })
}

export function del (data) {
  return request({
    url: oauthServerURL + '/system/sysDictType/delete',
    method: 'post',
    data
  })
}

// 更新Redis
export function clearCache () {
  return request({
    url: oauthServerURL + '/system/sysDictType/clearCache',
    method: 'post'
  })
}
