<template>
  <div class="yx-page-wrapper message-wrapper">

    <!-- 搜索栏区域 start -->
    <yx-crud-search
      ref="yxCrudSearch"
      :searchConfigJson="searchConfigJson"
      @search="search"
    ></yx-crud-search>
    <!-- 搜索栏区域 end -->

    <!-- 标签栏区域 start -->
    <div class="tabs-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="未读" name="notRead"></el-tab-pane>
        <el-tab-pane label="已读" name="read"></el-tab-pane>
        <el-tab-pane label="全部" name="all"></el-tab-pane>
      </el-tabs>
    </div>
    <!-- 标签栏区域 end -->

    <yx-crud-table
      ref="yxCrudTable"
      :firstLoad="false"
      :searchConfigJson="searchConfigJson"
      :tableConfigJson="tableConfigJson"
      :tableHDIY="tableH"
      :staticQueryJson="{
        status: status
      }"
    >
      <template v-slot:optRow>
        <el-button v-show="activeName !== 'read'" size="small" @click="btnAllRead">全部已读</el-button>
      </template>
      <el-table-column prop="content" label="消息内容" />
      <el-table-column prop="createTime" label="发送时间" width="170" />
      <template v-slot:optCell="scope">
        <el-button v-if="scope.row.status === 0" type="text" size="small" @click="btnRead(scope.row)">设为已读</el-button>
      </template>
    </yx-crud-table>

  </div>
</template>

<script>
import { list, readAll, updateStatus } from './api'

const searchConfigJson = [
  { name: 'content', label: '消息内容', type: 'input', width: 200 }
]

const tableConfigJson = {
  search: false,
  btnDel: false,
  btnAdd: false,
  btnEdit: false,
  optCellWidth: 70,
  requestApi: { list }
}

export default {
  data () {
    return {
      activeName: 'notRead',
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson
    }
  },
  computed: {
    // 表格区域高度，因为有了标签栏区域，需要重新计算高度来覆盖crud中自动计算的高度值
    tableH () {
      const bodyH = document.body.offsetHeight // 窗体整体的高
      const tagBarH = 45 // 顶部导航栏的高，1为边框
      const tabsH = 40 // tab标签栏高度
      const searchH = 60 + 15 // crud中搜索栏的高
      const optH = 60 // crud中操作栏的高
      const pageH = 60 // 底部翻页区域的高
      return bodyH - searchH - tagBarH - optH - pageH - 30 - tabsH // 最后返回表格应该有的高度
    },
    // 表格查询时额外的入参
    status () {
      if (this.activeName === 'notRead') {
        return 0
      } else if (this.activeName === 'read') {
        return 1
      } else if (this.activeName === 'all') {
        return ''
      }
      return ''
    }
  },
  watch: {
    // 标签栏区域切换时，带动status值变化，触发搜索栏中搜索按钮
    status () {
      this.$nextTick(() => {
        this.$refs.yxCrudSearch.search()
      })
    }
  },
  methods: {
    // 搜索栏中的搜索按钮
    search (query) {
      this.$refs.yxCrudTable.getTableDataBySearch(query)
    },
    // 全部已读
    btnAllRead () {
      readAll().then(() => {
        this.$refs.yxCrudTable.refresh()
        this.$emit('notReadNumReduce', -1)
      })
    },
    // 已读
    btnRead (data) {
      updateStatus({ ids: [data.id], status: 1 }).then(() => {
        this.$refs.yxCrudTable.refresh()
        this.$emit('notReadNumReduce', 1)
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
