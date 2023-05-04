<template>
  <yx-crud-table
    ref="yxCrudTable"
    :tableConfigJson="tableConfigJson"
    :staticQueryJson="staticQueryJson"
    :firstLoad="false"
    :tableHDIY="300"
    border
  >
    <!-- 根据实际业务编写表格列 start -->
    <el-table-column prop="flowState" label="流程状态" />
    <el-table-column prop="opinion" label="操作类型" />
    <el-table-column prop="comment" label="备注" show-overflow-tooltip />
    <el-table-column prop="createUserName" label="发起者" />
    <el-table-column prop="createTime" label="创建时间" width="180" />
    <!-- 根据实际业务编写表格列 end -->
  </yx-crud-table>
</template>

<script>
import { flowLog } from '../../api'

const tableConfigJson = {
  search: false,
  optRow: false,
  btnAdd: false,
  btnEdit: false,
  btnDel: false,
  optCell: false,
  page: false,
  requestApi: { list: flowLog }
}

export default {
  data () {
    return {
      tableConfigJson: tableConfigJson,
      staticQueryJson: {
        id: ''
      }
    }
  },
  methods: {
    initData (data) {
      this.drawerShow = true
      this.staticQueryJson.id = data.id
      this.$nextTick(() => {
        this.$refs.yxCrudTable.getTableDataBySearch()
      })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
