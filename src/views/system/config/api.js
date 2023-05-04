import request from '@/utils/request'
import { oauthServerURL } from '@/config'

export function list (data) {
  return request({
    url: oauthServerURL + '/system/sysConfig/page',
    method: 'post',
    data
  })
}

export function details (data) {
  return request({
    url: oauthServerURL + '/system/sysConfig/get',
    method: 'post',
    data: { id: data.id }
  })
}

export function add (data) {
  return request({
    url: oauthServerURL + '/system/sysConfig/add',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: oauthServerURL + '/system/sysConfig/update',
    method: 'post',
    data
  })
}

export function del (data) {
  return request({
    url: oauthServerURL + '/system/sysConfig/delete',
    method: 'post',
    data
  })
}

export const downloadByIds = oauthServerURL + '/system/sysConfig/exportExcel'

// 更新Redis
export function clearCache () {
  return request({
    url: oauthServerURL + '/system/sysConfig/clearCache',
    method: 'post'
  })
}
