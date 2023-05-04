import request from '@/utils/request'
import { oauthServerURL } from '@/config'

export function list (data) {
  return request({
    url: oauthServerURL + '/system/messageTemplate/page',
    method: 'post',
    data
  })
}

export function details (data) {
  return request({
    url: oauthServerURL + '/system/messageTemplate/get',
    method: 'post',
    data
  })
}

export function add (data) {
  return request({
    url: oauthServerURL + '/system/messageTemplate/save',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: oauthServerURL + '/system/messageTemplate/update',
    method: 'post',
    data
  })
}

export function del (data) {
  return request({
    url: oauthServerURL + '/system/messageTemplate/delete',
    method: 'post',
    data
  })
}
