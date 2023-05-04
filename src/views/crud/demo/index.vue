<template>
  <div class="yx-page-wrapper">

    <yx-crud-table
      ref="yxCrudTable"
      :searchConfigJson="searchConfigJson"
      :tableConfigJson="tableConfigJson"
      :permissionJsonByPermi="permissionJsonByPermi"
      :permissionJsonByRole="permissionJsonByRole"
      @btnAdd="btnAdd"
      @btnEdit="btnEdit"
    >
      <!-- 功能按钮区域，可以添加自定义按钮 start -->
      <template v-slot:optRow>
        <el-button v-hasPermi="['crud:btnYours']" size="small" @click="btnYours_optRow">自定义按钮</el-button>
      </template>
      <!-- 功能按钮区域 end -->

      <!-- 根据实际业务编写表格列 start -->
      <el-table-column prop="id" label="ID" sortable show-overflow-tooltip />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="createUserName" label="操作人" />
      <el-table-column prop="createTime" label="创建时间" width="170" />
      <!-- 根据实际业务编写表格列 end -->

      <!-- 表格末尾操作列区域，可以添加自定义按钮 start -->
      <template v-slot:optCell="scope">
        <el-button type="text" size="small" @click="btnYours_optCell(scope.row)">自定义按钮</el-button>
      </template>
      <!-- 表格末尾操作列区域 end -->

    </yx-crud-table>

    <!-- 新增、编辑表单区域 start -->
    <crud-form ref="crudForm" @afterSubmit="afterSubmit"></crud-form>
    <!-- 新增、编辑表单区域 end -->
  </div>
</template>

<script>
import { list, del, upload, downloadTemplate, downloadByIds, downloadByQuery, downloadWord } from './api'
import crudForm from './components/form'

const searchConfigJson = [
  { name: 'title', label: '标题', type: 'input', width: 250 },
  { name: 'createTime', label: '创建日期', type: 'dateTime', timeType: 'daterange', width: 250 }
]

const tableConfigJson = {
  btnDownloadById: true,
  btnDownloadBySearch: true,
  btnDownloadWord: true,
  btnUpload: true,
  optCellWidth: 160,
  requestApi: { list, del, upload, downloadTemplate, downloadByIds, downloadByQuery, downloadWord }
}

// 按钮权限配置 - 通过Permi类型
const permissionJsonByPermi = {
  btnDownloadById: [],
  btnDownloadBySearch: [],
  btnDownloadWord: [],
  btnUpload: [],
  btnAdd: [],
  btnDel: ['crud:btnDel'],
  btnEdit: [],
  btnLook: []
}

// 按钮权限配置 - 通过Role类型
const permissionJsonByRole = {
  btnDownloadById: [],
  btnDownloadBySearch: [],
  btnDownloadWord: [],
  btnUpload: [],
  btnAdd: [],
  btnDel: [],
  btnEdit: [],
  btnLook: []
}

export default {
  components: { crudForm },
  data () {
    return {
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      permissionJsonByPermi: permissionJsonByPermi,
      permissionJsonByRole: permissionJsonByRole
    }
  },
  methods: {
    // 新增
    btnAdd () {
      this.$refs.crudForm.btnAdd()
    },
    // 编辑
    btnEdit (data) {
      this.$refs.crudForm.btnEdit(data)
    },
    // 自定义按钮
    btnYours_optRow () {
      // 写你自己想做的事情
    },
    // 自定义按钮
    btnYours_optCell (data) {
      // 写你自己想做的事情
    },
    afterSubmit () {
      this.$refs.yxCrudTable.refresh()
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
