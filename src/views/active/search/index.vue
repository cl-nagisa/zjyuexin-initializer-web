<template>
  <div class="yx-page-wrapper">

    <yx-crud-table
      ref="yxCrudTable"
      :searchConfigJson="searchConfigJson"
      :tableConfigJson="tableConfigJson"
      :staticQueryJson="staticQueryJson"
      @btnLook="btnLook"
    >
      <!-- 根据实际业务编写表格列 start -->
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="createUserName" label="创建者姓名" />
      <el-table-column prop="flowName" label="流程名称" />
      <el-table-column prop="flowStepName" label="流程环节" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <template v-slot:optCell="scope">
        <el-button type="text" size="small" @click="btnBpmn(scope.row)">流程图</el-button>
      </template>
      <!-- 根据实际业务编写表格列 end -->
    </yx-crud-table>

    <!-- 新增、编辑表单区域 start -->
    <crud-form ref="crudForm" @afterSubmit="afterSubmit"></crud-form>
    <!-- 新增、编辑表单区域 end -->

    <!-- 流程图 start -->
    <eDrawer
      v-model="drawerShow"
      direction="ttb"
      size="100%"
      :submitBtn="false"
      :withHeader="false"
    >
      <bpmn ref="bpmn" :mode="drawerMode" @close="drawerShow = false"></bpmn>
      <log class="log" ref="log"></log>
    </eDrawer>
    <!-- 流程图 end -->
  </div>
</template>

<script>
import { searchList, downloadByIds } from '../api'
import crudForm from './components/form'
import log from './components/log'
import eDrawer from '@/components/eDrawer'
import bpmn from '@/components/bpmn'

const searchConfigJson = [
  { name: 'title', label: '标题', type: 'input', width: 250 },
  { name: 'content', label: '内容', type: 'input', width: 250 },
  { name: 'createTime', label: '创建时间', type: 'dateTime', timeType: 'daterange', width: 250 }
]

const tableConfigJson = {
  btnDownloadById: true,
  btnAdd: false,
  btnEdit: false,
  btnDel: false,
  btnLook: true,
  optCellWidth: 120,
  requestApi: { list: searchList, downloadByIds }
}

export default {
  components: { crudForm, log, eDrawer, bpmn },
  data () {
    return {
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      staticQueryJson: {
        flowStepName: ''
      },
      drawerShow: false,
      drawerMode: ''
    }
  },
  methods: {
    // 查看
    btnLook (data) {
      this.$refs.crudForm.btnLook(data)
    },
    // 流程图
    btnBpmn (data) {
      this.drawerShow = true
      this.drawerMode = 'look'
      this.$nextTick(() => {
        this.$refs.bpmn.initData(data)
        this.$refs.log.initData(data)
      })
    },
    afterSubmit () {
      this.$refs.yxCrudTable.refresh()
    }
  }
}
</script>

<style lang="sass" scoped>
  .log
    position: absolute
    bottom: 15px
    left: 0
    width: 100%
    padding: 0 15px
</style>
