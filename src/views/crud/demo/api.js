import request from '@/utils/request'
import { oauthServerURL } from '@/config'

// 查询表格数据
export function list (data) {
  return request({
    url: oauthServerURL + '/exampleTable/page',
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

// 合并已上传的文件
export function mergeFile (data) {
  return request({
    url: oauthServerURL + '/exampleTable/merge',
    method: 'post',
    data: data
  })
}

// 导入
export const upload = oauthServerURL + '/exampleTable/importExcel'

// 下载导入模板
export const downloadTemplate = oauthServerURL + '/exampleTable/download'

// 导出excel，根据勾选结果导出
export const downloadByIds = oauthServerURL + '/exampleTable/exportExcel'

// 导出excel，根据查询条件导出
export const downloadByQuery = oauthServerURL + '/exampleTable/exportExcelByQuery'

// 导出excel，导出为Word
export const downloadWord = oauthServerURL + '/exampleTable/exportWord'
