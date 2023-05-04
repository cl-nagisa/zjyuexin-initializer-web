import request from '@/utils/request'
import { oauthServerURL, serverURL } from '@/config'

// 角色列表
export function roleList () {
  return request({
    url: oauthServerURL + '/system/sysRole/listNormal',
    method: 'post'
  })
}

// 部署
export function add (data) {
  return request({
    url: oauthServerURL + '/workflow/processDefinition/deploy',
    method: 'post',
    data
  })
}

// 获取流程图的XML
export const details = serverURL + oauthServerURL + '/workflow/processDefinition/getXML'

// 获取任务配置
export function taskDetails (data) {
  return request({
    url: oauthServerURL + '/workflow/actProcdefConfig/getListByProcdef',
    method: 'post',
    data
  })
}

// 保存任务配置
export function saveTaskSetting (data) {
  return request({
    url: oauthServerURL + '/workflow/actProcdefConfig/saveOrUpdateBatch',
    method: 'post',
    data
  })
}

// 获取流程信息
export function info (data) {
  return request({
    url: oauthServerURL + '/common/workflow/getProcessInfo',
    method: 'post',
    data
  })
}

// 获取流程进度
export function highLine (data) {
  return request({
    url: oauthServerURL + '/workflow/activitiHistory/getHighLine',
    method: 'post',
    data
  })
}
