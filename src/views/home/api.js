import request from '@/utils/request'
import { oauthServerURL } from '@/config'

// 查询表格数据
export function list (data) {
  return request({
    url: oauthServerURL + '/common/workflow/myTaskPage',
    method: 'post',
    data
  })
}

// 流程日志
export function flowLog (data) {
  return request({
    url: oauthServerURL + '/common/workflow/getActOperLog',
    method: 'post',
    data
  })
}
