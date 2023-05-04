import request from '@/utils/request'
import { oauthServerURL } from '@/config'

export function list (data) {
  return request({
    url: oauthServerURL + '/system/sysLoginInfo/page',
    method: 'post',
    data
  })
}
