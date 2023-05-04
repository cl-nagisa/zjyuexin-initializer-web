<template>
  <div>
    <!-- 搜索栏区域 -->
    <yx-crud-search
      v-if="tableConfig.search"
      ref="yxCrudSearch"
      :searchConfigJson="searchConfigJson"
      :dict="dict"
      :firstLoad="firstLoad"
      :labelWidth="labelWidth"
      @search="getTableDataBySearch"
    ></yx-crud-search>

    <div class="yx-crud-table-wrapper">

      <!-- 功能按钮区域 start -->
      <div v-if="tableConfig.optRow" class="opt">
        <ul class="btn-common">
          <li
            v-if="tableConfig.btnRefresh"
            title="刷新"
            @click="refresh"
          >
            <i class="el-icon-refresh"></i>
          </li>
          <li
            v-if="tableConfig.btnUpload"
            title="导入"
            v-hasPermi="permissionByPermi.btnUpload"
            v-hasRole="permissionByRole.btnUpload"
            @click="btn_upload"
          >
            <i class="el-icon-upload2"></i>
          </li>
          <li
            v-if="tableConfig.btnDownloadById"
            title="根据勾选结果导出"
            v-hasPermi="permissionByPermi.btnDownloadById"
            v-hasRole="permissionByRole.btnDownloadById"
            @click="btn_download(1)"
          >
            <i class="el-icon-download"></i>
          </li>
          <li
            v-if="tableConfig.btnDownloadBySearch"
            title="根据查询条件导出"
            v-hasPermi="permissionByPermi.btnDownloadBySearch"
            v-hasRole="permissionByRole.btnDownloadBySearch"
            @click="btn_download(2)"
          >
            <i class="el-icon-download"></i>
          </li>
          <li
            v-if="tableConfig.btnDownloadWord"
            title="导出为Word"
            v-hasPermi="permissionByPermi.btnDownloadWord"
            v-hasRole="permissionByRole.btnDownloadWord"
            @click="btn_download(3)"
          >
            <i class="el-icon-download"></i>
          </li>
        </ul>
        <div>
          <el-button
            v-if="tableConfig.btnAdd"
            type="primary"
            size="small"
            v-hasPermi="permissionByPermi.btnAdd"
            v-hasRole="permissionByRole.btnAdd"
            @click="btn_add"
          >新增</el-button>
          <el-button
            v-if="tableConfig.btnDel"
            type="danger"
            size="small"
            :disabled="tableSelected.length === 0"
            v-hasPermi="permissionByPermi.btnDel"
            v-hasRole="permissionByRole.btnDel"
            @click="btn_dels"
          >删除</el-button>
          <slot name="optRow"><!-- 自定义按钮 --></slot>
        </div>
      </div>
      <!-- 功能按钮区域 end -->

      <!-- 表格区域 start -->
      <el-table
        v-loading="tableLoading"
        ref="table"
        :data="tableData"
        :height="tableH || tableHDIY"
        :highlight-current-row="highlight"
        :row-key="rowKey"
        :border="border"
        @selection-change="handleChange_tableSelect"
        @sort-change="handleChange_tableSort"
        @current-change="handleChange_tableCurrent"
      >
        <el-table-column
          v-if="tableConfig.btnDel || tableConfig.btnDownloadById || tableConfig.btnDownloadWord"
          type="selection"
          reserve-selection
          width="55"
          fixed="left"
        ></el-table-column>
        <el-table-column
          v-if="tableConfig.orderCell"
          type="index"
          label="序号"
          :index="indexMethod"
          width="80"
        ></el-table-column>
        <slot><!-- 自定义表格列 --></slot>
        <el-table-column v-if="tableConfig.optCell" label="操作" :width="tableConfig.optCellWidth" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="tableConfig.btnEdit"
              type="text"
              size="small"
              v-hasPermi="permissionByPermi.btnEdit"
              v-hasRole="permissionByRole.btnEdit"
              @click.stop="btn_edit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="tableConfig.btnDel"
              type="text"
              size="small"
              v-hasPermi="permissionByPermi.btnDel"
              v-hasRole="permissionByRole.btnDel"
              @click.stop="btn_del(scope.row)"
            >删除</el-button>
            <el-button
              v-if="tableConfig.btnLook"
              type="text"
              size="small"
              v-hasPermi="permissionByPermi.btnLook"
              v-hasRole="permissionByRole.btnLook"
              @click.stop="btn_look(scope.row)"
            >查看</el-button>
            <slot name="optCell" v-bind:row="scope.row"><!-- 自定义表格末尾列操作按钮 --></slot>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格区域 end -->
    </div>

    <!-- 翻页区域 start -->
    <yx-crud-page v-if="tableConfig.page" v-model="pageQuery" :layout="layout" @pageChange="pageChange" @sizeChange="sizeChange"></yx-crud-page>
    <!-- 翻页区域 end -->

    <!-- 导入按钮弹窗 start -->
    <yx-upload
      v-model="uploadShow"
      :uploadUrl="tableConfigJson.requestApi.upload"
      :templateUrl="tableConfigJson.requestApi.downloadTemplate"
      @uploadSuccess="refresh"
    ></yx-upload>
    <!-- 导入按钮弹窗 end -->

  </div>
</template>

<script>
import deepcopy from 'deepcopy'

import yxCrudSearch from '../search/index.vue' // 搜索栏组件
import yxCrudPage from '../page/index.vue' // 翻页组件
import yxUpload from './upload' // 导入按钮弹窗组件

import { navMenuPosition } from '@/settings'
import { downloadFile } from '@/utils/tools'
import { serverURL } from '@/config'

const defaultTableConfig = {
  search: true, // 是否显示搜索区域
  optRow: true, // 是否显示操作行区域
  btnRefresh: true, // 是否显示刷新按钮
  btnDownloadById: false, // 是否显示根据勾选结果导出按钮
  btnDownloadBySearch: false, // 是否显示根据根据查询条件导出按钮
  btnDownloadWord: false, // 是否显示导出为Word按钮
  btnUpload: false, // 是否显示导入按钮
  orderCell: false, // 是否显示序号列
  optCell: true, // 是否显示操作列
  optCellWidth: null, // 操作列宽，默认为null表示自适应
  btnAdd: true, // 是否显示新增按钮
  btnDel: true, // 是否显示删除按钮
  btnEdit: true, // 是否显示编辑按钮
  btnLook: false, // 是否显示查看按钮
  page: true, // 是否显示翻页
  requestApi: { // 接口api
    list: (data) => {}, // 列表接口
    downloadByIds: null, // 导出excel，根据id数组
    downloadByQuery: null, // 导出excel，根据条件查询
    downloadWord: null, // // 导出Word
    upload: null, // 导入接口
    downloadTemplate: null, // 下载导入模板接口
    del: (ids) => {} // 删除接口
  }
}

// 按钮权限配置
const defaultPermissionByPermi = {
  btnDownloadById: [], // 导出excel按钮，根据id数组
  btnDownloadBySearch: [], // 导出excel按钮，根据条件查询
  btnDownloadWord: [], // 导出Word按钮
  btnUpload: [], // 导入按钮
  btnAdd: [], // 新增按钮
  btnDel: [], // 删除按钮
  btnEdit: [], // 编辑按钮
  btnLook: [] // 查看按钮
}

const defaultPermissionByRole = {
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
  name: 'YxCrudTable',
  components: { yxCrudSearch, yxCrudPage, yxUpload },
  props: {
    /*
      * 搜索栏配置json，是个数组，数组的每一项是的对象，包含具体配置，不同type类型的输入框组件拥有自己独特的属性，具体请看每个输入框组件，公共属性如下：
      * name，字符串，表单所绑定的值，即v-model所绑定的值
      * label，字符串，中文标签，用于提示此输入框所填内容的含义
      * type，字符串，输入框类型，目前支持的有“input 文本输入框”、“select 下拉选择框”、“dateTime 时间选择器”、“city 省市区选择器”
      * width，字符串，输入框的宽度，单位“px“，如果不传此属性，则默认使用内置的宽度
    */
    searchConfigJson: [],
    /*
      * 字典项集合，是个对象，用于存放需要用到的字典项，搭配“下拉选择框”使用
      * 请使用后台管理系统基座中自带的“Dict”来搭配使用
    */
    dict: {
      type: Object
    },
    // 页面加载时是否自动触发搜索功能，默认开启
    firstLoad: {
      type: Boolean,
      default: true
    },
    // 搜索栏输入框中文标签的宽度，默认70px
    labelWidth: {
      type: Number,
      default: 70
    },
    /*
      * 表格配置项，需传入一个对象
      * 如果不传此参数，则每一项配置会采用默认配置
    */
    tableConfigJson: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /*
      * 功能按钮的权限 - Permi型
      * 如果不传此参数，则每一项配置会采用默认配置
    */
    permissionJsonByPermi: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /*
      * 功能按钮的权限 - Role型
      * 如果不传此参数，则每一项配置会采用默认配置
    */
    permissionJsonByRole: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /*
      * 自定义表格高度
      * 如果不传此参数，则组件会自动计算，如果传此参数，则会覆盖组件计算出来的值
    */
    tableHDIY: {
      type: Number,
      default: 0
    },
    // 是否将顶部菜单栏的高度参与计算到表格高度中，需在/src/setting.js中将navMenuPosition设置成top是才生效
    tableHDIYByNavMenuPositionTop: {
      type: Boolean,
      default: true
    },
    // 是否开启表格高亮模式
    highlight: {
      type: Boolean,
      default: false
    },
    // 是否开启表格边框
    border: {
      type: Boolean,
      default: false
    },
    // 调用列表接口时需要传入的静态参数
    staticQueryJson: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 初始化时默认的排序规则
    defaultSort: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 精确查询字段集合（暂未开放）
    queryEqualsParamsJson: {
      type: Array
    },
    // 翻页功能
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    // 表格row-key属性的值
    rowKey: {
      type: String,
      default: 'id'
    }
  },
  data () {
    return {
      navMenuPosition,
      tableLoading: false,
      uploadShow: false, // 导入弹窗是否显示
      searchQuery: null,
      sortQuery: {},
      pageQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      tableData: [],
      tableSelected: [] // 表格所选集合
    }
  },
  computed: {
    tableConfig () {
      return deepcopy(Object.assign(deepcopy(defaultTableConfig), deepcopy(this.tableConfigJson)))
    },
    permissionByPermi () {
      return deepcopy(Object.assign(deepcopy(defaultPermissionByPermi), deepcopy(this.permissionJsonByPermi)))
    },
    permissionByRole () {
      return deepcopy(Object.assign(deepcopy(defaultPermissionByRole), deepcopy(this.permissionJsonByRole)))
    },
    staticQuery () {
      return this.staticQueryJson
    },
    queryEqualsParams () {
      return this.queryEqualsParamsJson
    },
    tableH () {
      if (this.tableHDIY) {
        return 0
      }
      const bodyH = document.body.offsetHeight // 窗体整体的高
      let navBarH = 0 // 菜单栏的高度
      const tagBarH = 44 + 1 // 顶部导航栏的高，1为边框
      const searchH = this.tableConfig.search ? 60 + 15 : 0 // crud中搜索栏的高
      const optH = this.tableConfig.optRow ? 60 : 0 // crud中操作栏的高
      const pageH = this.tableConfig.page ? 60 : 0 // 底部翻页区域的高
      if (this.navMenuPosition === 'top' && this.tableHDIYByNavMenuPositionTop) {
        // 菜单栏如果在顶部，则参与计算
        navBarH = 56
      }
      return bodyH - navBarH - searchH - tagBarH - optH - pageH - 30 // 最后返回表格应该有的高度
    }
  },
  methods: {
    // 获取表格数据 - 通过搜索栏
    getTableDataBySearch (query) {
      this.searchQuery = query
      this.pageQuery.pageNum = 1
      this.getTableData()
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      const params = {
        ...this.searchQuery,
        ...{ pageNum: this.pageQuery.pageNum, pageSize: this.pageQuery.pageSize },
        ...this.defaultSort,
        ...this.sortQuery,
        ...this.staticQuery,
        queryEqualsParams: this.queryEqualsParams
      }
      this.tableConfig.requestApi.list(params).then(res => {
        this.pageQuery.total = res.result.total
        this.tableLoading = false
        this.tableData = res.result.records ? res.result.records : res.result
      })
    },
    // 表格序号列自动生成
    indexMethod (index) {
      return ((this.pageQuery.pageNum - 1) * 10) + index + 1
    },
    // 翻页 page 改变
    pageChange (page) {
      this.pageQuery.pageNum = page
      this.getTableData()
    },
    // 翻页 size 改变
    sizeChange (size) {
      this.pageQuery.pageNum = 1
      this.pageQuery.pageSize = size
      this.getTableData()
    },
    // 表格 - 多选
    handleChange_tableSelect (val) {
      this.tableSelected = val
      this.$emit('tableSelectionChange', val)
    },
    // 表格 - 排序
    handleChange_tableSort (data) {
      if (data.order) {
        const order = data.order === 'ascending' ? 0 : 1
        this.$set(this.sortQuery, '$' + data.prop + 'Order', order)
      } else {
        this.$delete(this.sortQuery, '$' + data.prop + 'Order')
      }
      this.getTableData()
    },
    // 表格 - 点击行
    handleChange_tableCurrent (data) {
      if (data) {
        this.$emit('tableCurrentChange', data)
      }
    },
    // 按钮 - 刷新
    refresh () {
      this.getTableData()
    },
    // 按钮 - 导出
    async btn_download (type) {
      if (this.tableLoading) {
        return false
      }
      this.tableLoading = true
      const headers = []
      const fields = []
      // 统计当前表格所展现的列，告诉接口要导出哪些字段（暂未开放）
      for (const item of this.$refs.table.columns) {
        if (item.label && item.property) {
          headers.push(item.label)
          fields.push(item.property)
        }
      }
      const params = {
        ...this.defaultSort,
        ...this.sortQuery,
        headers,
        fields,
        ...this.searchQuery
      }
      if (type === 1) {
        if (this.tableSelected.length === 0) {
          this.$notify({
            title: '提示',
            message: '至少勾选一条数据',
            type: 'warning'
          })
          this.tableLoading = false
          return false
        }
        // 根据勾选结果导出
        const ids = []
        for (const item of this.tableSelected) {
          ids.push(item.id)
        }
        params.ids = ids
        await downloadFile(params, serverURL + this.tableConfig.requestApi.downloadByIds)
      }
      if (type === 2) {
        // 根据查询条件导出
        await downloadFile(params, serverURL + this.tableConfig.requestApi.downloadByQuery)
      }
      if (type === 3) {
        if (this.tableSelected.length === 0) {
          this.$notify({
            title: '提示',
            message: '请先勾选一条数据',
            type: 'warning'
          })
          this.tableLoading = false
          return false
        }
        // 导出为Word
        params.id = this.tableSelected[0].id
        await downloadFile(params, serverURL + this.tableConfig.requestApi.downloadWord)
      }
      this.tableLoading = false
    },
    // 按钮 - 导入
    btn_upload () {
      this.uploadShow = !this.uploadShow
    },
    // 按钮 - 新增
    btn_add () {
      this.$emit('btnAdd')
    },
    // 按钮 - 批量删除
    btn_dels () {
      if (this.tableSelected.length === 0) {
        return false
      }
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submit_del(this.tableSelected)
      })
    },
    // 按钮 - 单个删除
    btn_del (row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submit_del([row])
      })
    },
    // 删除提交操作
    submit_del (data) {
      if (this.tableLoading) {
        return false
      }
      const ids = []
      for (const item of data) {
        ids.push(item.id)
      }
      this.tableConfig.requestApi.del({ ids: ids }).then(() => {
        this.tableLoading = false
        this.$notify({
          title: '提示',
          message: '删除成功',
          type: 'success'
        })
        this.getTableData()
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 按钮 - 编辑
    btn_edit (row) {
      this.$emit('btnEdit', row)
    },
    // 按钮 - 查看
    btn_look (row) {
      this.$emit('btnLook', row)
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
