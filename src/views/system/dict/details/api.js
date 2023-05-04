import request from '@/utils/request'
import { oauthServerURL } from '@/config'

export function list (data) {
  return request({
    url: oauthServerURL + '/system/sysDictData/page',
    method: 'post',
    data
  })
}

export function details (data) {
  return request({
    url: oauthServerURL + '/system/sysDictData/get',
    method: 'post',
    data: { id: data.id }
  })
}

export function add (data) {
  return request({
    url: oauthServerURL + '/system/sysDictData/add',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: oauthServerURL + '/system/sysDictData/update',
    method: 'post',
    data
  })
}

export function del (data) {
  return request({
    url: oauthServerURL + '/system/sysDictData/delete',
    method: 'post',
    data
  })
}
