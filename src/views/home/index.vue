<template>
  <div class="yx-page-wrapper">

    <yx-crud-table
      ref="yxCrudTable"
      :searchConfigJson="searchConfigJson"
      :tableConfigJson="tableConfigJson"
    >
      <!-- 根据实际业务编写表格列 start -->
      <el-table-column prop="flowName" label="流程名称" show-overflow-tooltip />
      <el-table-column prop="flowStepName" label="流程环节" />
      <el-table-column prop="flowCreateTime" label="创建时间" />
      <template v-slot:optCell="scope">
        <el-button type="text" size="small" @click="btnEdit(scope.row)">编辑</el-button>
        <el-button type="text" size="small" @click="btnBpmn(scope.row)">流程图</el-button>
      </template>
      <!-- 根据实际业务编写表格列 end -->
    </yx-crud-table>

    <!-- 编辑-动态组件 start -->
    <component
      ref="dialogForm"
      :is="componentName"
      @submitSuccess="afterSubmit"
    ></component>
    <!-- 编辑-动态组件 end -->

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
import Vue from 'vue'
import deepcopy from 'deepcopy'

import { list } from './api'
import log from './components/log'
import eDrawer from '@/components/eDrawer'
import bpmn from '@/components/bpmn'

const searchConfigJson = [
  { name: 'flowName', label: '流程名称', type: 'input', width: 250 },
  { name: 'flowCreateDate', label: '创建时间', type: 'dateTime', timeType: 'daterange', original: false, width: 250 }
]

const tableConfigJson = {
  btnAdd: false,
  btnEdit: false,
  btnDel: false,
  optCellWidth: 120,
  requestApi: { list }
}

export default {
  components: { log, eDrawer, bpmn },
  data () {
    return {
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      componentName: null,
      drawerShow: false,
      drawerMode: ''
    }
  },
  methods: {
    // 编辑
    btnEdit (data) {
      const componentName = data.componentUrl.replaceAll('/', '')
      try {
        const component = require('../../views' + data.componentUrl)
        if (component) {
          Vue.component(componentName, () => import('../../views' + data.componentUrl))
          this.componentName = deepcopy(componentName)
          this.$refs.yxCrudTable.tableLoading = true
          setTimeout(() => {
            this.$refs.dialogForm.btnEdit(data)
            this.$refs.yxCrudTable.tableLoading = false
          }, 500)
        }
      } catch (e) {
        console.log(`${data.componentUrl}组件注册失败`)
      }
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
