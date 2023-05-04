import request from '@/utils/request'
import { oauthServerURL } from '@/config'

export function list (data) {
  return request({
    url: oauthServerURL + '/system/message/page',
    method: 'post',
    data
  })
}

// 全部已读
export function readAll (data) {
  return request({
    url: oauthServerURL + '/system/message/readAll',
    method: 'post',
    data
  })
}

// 设为已读
export function updateStatus (data) {
  return request({
    url: oauthServerURL + '/system/message/updateStatus',
    method: 'post',
    data
  })
}
