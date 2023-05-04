import request from '@/utils/request'
import { oauthServerURL } from '@/config'

export function list (data) {
  return request({
    url: oauthServerURL + '/workflow/processDefinition/page',
    method: 'post',
    data
  })
}

export function del (data) {
  return request({
    url: oauthServerURL + '/workflow/processDefinition/delete',
    method: 'post',
    data
  })
}

// 激活、挂起
export function active (data) {
  return request({
    url: oauthServerURL + '/workflow/processDefinition/suspendOrActiveApply',
    method: 'post',
    data
  })
}
