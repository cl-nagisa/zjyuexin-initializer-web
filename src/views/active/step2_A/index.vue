<template>
  <div class="yx-page-wrapper">

    <yx-crud-table
      ref="yxCrudTable"
      :searchConfigJson="searchConfigJson"
      :tableConfigJson="tableConfigJson"
      :staticQueryJson="staticQueryJson"
      @btnEdit="btnEdit"
    >
      <!-- 根据实际业务编写表格列 start -->
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="createUserName" label="创建者姓名" />
      <el-table-column prop="flowName" label="流程名称" />
      <el-table-column prop="flowStepName" label="流程环节" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <template v-slot:optCell="scope">
        <el-button v-if="!scope.row.flowStepName" type="text" size="small" @click="btnDel(scope.row)">删除</el-button>
        <el-button type="text" size="small" @click="btnLog(scope.row)">流程日志</el-button>
      </template>
      <!-- 根据实际业务编写表格列 end -->
    </yx-crud-table>

    <!-- 新增、编辑表单区域 start -->
    <crud-form ref="crudForm" @afterSubmit="afterSubmit"></crud-form>
    <!-- 新增、编辑表单区域 end -->

    <!-- 流程日志区域 start -->
    <log ref="log"></log>
    <!-- 流程日志区域 end -->
  </div>
</template>

<script>
import { list, del, downloadByIds } from '../api'
import crudForm from './components/form'
import log from '../log'

const searchConfigJson = [
  { name: 'title', label: '标题', type: 'input', width: 250 },
  { name: 'content', label: '内容', type: 'input', width: 250 },
  { name: 'createTime', label: '创建时间', type: 'dateTime', timeType: 'daterange', width: 250 }
]

const tableConfigJson = {
  btnDownloadById: true,
  btnAdd: false,
  btnDel: false,
  optCellWidth: 120,
  requestApi: { list, downloadByIds }
}

export default {
  components: { crudForm, log },
  data () {
    return {
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      staticQueryJson: {
        flowStepName: '项目经理审核'
      }
    }
  },
  methods: {
    // 编辑
    btnEdit (data) {
      this.$refs.crudForm.btnEdit(data)
    },
    // 删除
    btnDel (row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ ids: [row.id] }).then(() => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          })
          this.$refs.yxCrudTable.refresh()
        })
      })
    },
    // 流程日志
    btnLog (data) {
      this.$refs.log.initData(data)
    },
    afterSubmit () {
      this.$refs.yxCrudTable.refresh()
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
