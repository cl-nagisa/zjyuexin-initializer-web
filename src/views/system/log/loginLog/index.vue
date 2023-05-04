<template>
  <div class="yx-page-wrapper">

    <yx-crud-table
      ref="yxCrudTable"
      :searchConfigJson="searchConfigJson"
      :tableConfigJson="tableConfigJson"
    >
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="ipaddr" label="登录IP" />
      <el-table-column prop="browser" label="浏览器" />
      <el-table-column prop="os" label="操作系统" />
      <el-table-column prop="status" label="登录状态" />
      <el-table-column prop="loginTime" label="登录日期" width="170" />
    </yx-crud-table>

  </div>
</template>

<script>
import { list } from './api'

const searchConfigJson = [
  { name: 'userName', label: '用户名称', type: 'input', width: 200 },
  { name: 'ipaddr', label: '登录IP', type: 'input', width: 200 }
]

const tableConfigJson = {
  btnDel: false,
  btnAdd: false,
  btnEdit: false,
  optCell: false,
  requestApi: { list }
}

export default {
  data () {
    return {
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
