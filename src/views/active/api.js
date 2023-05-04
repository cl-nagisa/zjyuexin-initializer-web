import request from '@/utils/request'
import { oauthServerURL } from '@/config'

// 查询表格数据
export function list (data) {
  return request({
    url: oauthServerURL + '/exampleTable/taskPage',
    method: 'post',
    data
  })
}

// 查询某一条记录的详情数据
export function details (data) {
  return request({
    url: oauthServerURL + '/exampleTable/get',
    method: 'post',
    data
  })
}

// 新增
export function add (data) {
  return request({
    url: oauthServerURL + '/exampleTable/save',
    method: 'post',
    data
  })
}

// 编辑
export function edit (data) {
  return request({
    url: oauthServerURL + '/exampleTable/update',
    method: 'post',
    data
  })
}

// 删除
export function del (data) {
  return request({
    url: oauthServerURL + '/exampleTable/delete',
    method: 'post',
    data
  })
}

// 上传附件
export function uploadFile (data) {
  return request({
    url: oauthServerURL + '/exampleTable/upload',
    method: 'post',
    ContentType: 'application/x-www-form-urlencoded',
    data: data
  })
}

// 查询已经上传的附件列表
export function uploadList (data) {
  return request({
    url: oauthServerURL + '/exampleTable/uploadList',
    method: 'post',
    data
  })
}

// 导出excel，根据勾选结果导出
export const downloadByIds = oauthServerURL + '/exampleTable/exportExcel'

// 启动流程
export function start (data) {
  return request({
    url: oauthServerURL + '/exampleTable/start',
    method: 'post',
    data
  })
}

// 获取流程下一步环节
export function getNextStep (data) {
  return request({
    url: oauthServerURL + '/exampleTable/getNextStep',
    method: 'post',
    data
  })
}

// 获取第一步流程环节信息
export function getFirstStepTask (data) {
  return request({
    url: oauthServerURL + '/exampleTable/getFirstStepTask',
    method: 'post',
    data
  })
}

// 提交流程
export function complete (data) {
  return request({
    url: oauthServerURL + '/exampleTable/complete',
    method: 'post',
    data
  })
}

// 更新流程数据
export function updateFlow (data) {
  return request({
    url: oauthServerURL + '/exampleTable/updateFlow',
    method: 'post',
    data
  })
}

// 流程日志
export function flowLog (data) {
  return request({
    url: oauthServerURL + '/exampleTable/flowLog',
    method: 'post',
    data
  })
}

// 获取流程回退环节
export function getRollbackSteps (data) {
  return request({
    url: oauthServerURL + '/exampleTable/getRollbackSteps',
    method: 'post',
    data
  })
}

// 回退流程
export function rollback (data) {
  return request({
    url: oauthServerURL + '/exampleTable/rollback',
    method: 'post',
    data
  })
}

// 流程查询列表数据
export function searchList (data) {
  return request({
    url: oauthServerURL + '/exampleTable/page',
    method: 'post',
    data
  })
}
