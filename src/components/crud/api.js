// 前后端接口地址规范，禁止修改

import request from '@/utils/request'

// 标准crud
export const listApi = (path) => `/${path}/page` // 查询表格数据
export const delApi = (path) => `/${path}/delete` // 删除
export const downloadByIdsApi = (path) => `/${path}/exportExcelByIds` // 导出excel，根据id数组
export const downloadByQueryApi = (path) => `/${path}/exportExcelByQuery` // 导出excel，根据条件查询
export const downloadWordApi = (path) => `/${path}/exportWord` // 导出Word
export const downloadTemplateApi = (path) => `/${path}/download` // 下载导入模板
export const uploadApi = (path) => `/${path}/importExcel` // 导入
export const addApi = (path) => `/${path}/save` // 新增
export const editApi = (path) => `/${path}/update` // 编辑
export const detailApi = (path) => `/${path}/get` // 某一条记录的详情数据
export const uploadFileApi = (path) => `/${path}/upload` // 上传文件
export const uploadListApi = (path) => `/${path}/uploadList` // 文件上传列表查询

// 标准流程
export const taskListApi = (path) => `/${path}/taskPage` // 待办分页查询
export const taskAddApi = (path) => `/${path}/start` // 启动流程
export const getFirstStepTaskApi = (path) => `/${path}/getFirstStepTask` // 获取第一步流程环节信息
export const taskNextApi = (path) => `/${path}/getNextStep` // 获取流程下一步环节
export const taskCompleteApi = (path) => `/${path}/complete` // 提交流程
export const updateFlowApi = (path) => `/${path}/updateFlow` // 更新流程数据
export const taskUpdateVariableApi = (path) => `/${path}/updateVariable` // 更新流程变量
export const getRollbackStepsApi = (path) => `/${path}/getRollbackSteps` // 获取流程回退环节
export const rollbackApi = (path) => `/${path}/rollback` // 回退流程
export const terminateApi = (path) => `/${path}/terminate` // 终止流程
export const flowLogApi = (path) => `/${path}/flowLog` // 流程日志
