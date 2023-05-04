import request from '@/utils/request'
import { oauthServerURL } from '@/config'

export function get (dictType) {
  const params = {
    dictType,
    pageNum: 1,
    pageSize: 9999
  }
  return request({
    url: oauthServerURL + '/system/sysDictData/page',
    method: 'post',
    data: params
  })
}
