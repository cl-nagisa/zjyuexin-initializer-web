<template>
  <div class="yx-page-wrapper">

    <yx-crud-table
      ref="yxCrudTable"
      :searchConfigJson="searchConfigJson"
      :tableConfigJson="tableConfigJson"
      @btnAdd="btnAdd"
      @btnEdit="btnEdit"
    >
      <el-table-column label="流程ID" prop="id" show-overflow-tooltip min-width="200" />
      <el-table-column label="流程KEY" prop="key" show-overflow-tooltip />
      <el-table-column label="流程名称" prop="name" show-overflow-tooltip width="120" />
      <el-table-column label="版本" prop="version" width="90" />
      <el-table-column label="部署ID" prop="deploymentId" show-overflow-tooltip min-width="200" />
      <el-table-column label="状态" prop="suspendState" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.suspendState !== 1 ? '挂起' : '激活' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部署时间" prop="deploymentTime" width="170" />
      <template v-slot:optCell="scope">
        <el-button type="text" size="small" @click="btnDel(scope.row)">删除</el-button>
        <el-button type="text" size="small" @click="btnActive(scope.row)">{{ scope.row.suspendState === 1 ? '挂起' : '激活' }}</el-button>
      </template>
    </yx-crud-table>

    <!-- 流程模型 start -->
    <eDrawer
      v-model="drawerShow"
      direction="ttb"
      size="100%"
      :submitBtn="false"
      :withHeader="false"
    >
      <bpmn ref="bpmn" :mode="drawerMode" @afterSubmit="afterSubmit" @close="drawerShow = false"></bpmn>
    </eDrawer>
    <!-- 流程模型 end -->

  </div>
</template>

<script>
import { list, del, active } from './api'
import eDrawer from '@/components/eDrawer'
import bpmn from '@/components/bpmn'

const searchConfigJson = [
  { name: 'key', label: '流程KEY', type: 'input' },
  { name: 'name', label: '名称', type: 'input' }
]

const tableConfigJson = {
  btnDel: false,
  optCellWidth: 140,
  requestApi: { list }
}

export default {
  components: { eDrawer, bpmn },
  data () {
    return {
      drawerShow: false,
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      drawerMode: ''
    }
  },
  methods: {
    btnAdd () {
      this.drawerShow = true
      this.drawerMode = 'add'
      this.$nextTick(() => {
        this.$refs.bpmn.initData()
      })
    },
    btnEdit (data) {
      this.drawerShow = true
      this.drawerMode = 'edit'
      this.$nextTick(() => {
        this.$refs.bpmn.initData(data)
      })
    },
    btnDel (data) {
      this.$confirm('是否确认删除编号为"' + data.key + '"的数据项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ id: data.deploymentId }).then(() => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          })
          this.$refs.yxCrudTable.refresh()
        })
      })
    },
    // 激活、挂起
    btnActive (data) {
      const suspendOrActive = data.suspendState === 2 ? '激活' : '挂起'
      this.$confirm('确认要' + suspendOrActive + '流程定义吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        active({ id: data.id, suspendState: data.suspendState === 1 ? 2 : 1 }).then(() => {
          this.$notify({
            title: '提示',
            message: '操作成功',
            type: 'success'
          })
          this.$refs.yxCrudTable.refresh()
        })
      })
    },
    afterSubmit () {
      this.drawerShow = false
      this.$refs.yxCrudTable.refresh()
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
