<template>
  <div class="yx-page-wrapper dept-wrapper">

    <el-row :gutter="15">
      <el-col class="col" :xs="24" :sm="24" :md="24" :lg="6" :xl="4">
        <div class="dept-tree">
          <div class="search-wrapper">
            <el-input v-model="searchKey" size="mini" placeholder="输入关键字查询" clearable @keyup.enter.native="search">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
            </el-input>
          </div>
          <div class="tree">
            <el-tree
              ref="tree"
              :data="treeList"
              node-key="id"
              :props="{
                label: 'orgName'
              }"
              default-expand-all
              :expand-on-click-node="false"
              :default-expanded-keys="treeExpanded"
              :filter-node-method="treeFilterNode"
              highlight-current
              @node-expand="handleChange_treeExpand"
              @node-collapse="handleChange_treeCollapse"
            >
              <div class="node" slot-scope="{ node, data }" @click="getDeptList(data)">
                <span class="cell">{{ node.label }}</span>
              </div>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col class="col" :xs="24" :sm="24" :md="24" :lg="18" :xl="20">
        <div v-if="orgId" class="list">
          <yx-crud-table
            ref="yxCrudTable"
            :searchConfigJson="searchConfigJson"
            :tableConfigJson="tableConfigJson"
            :dict="dict.dict"
            :firstLoad="false"
            :staticQueryJson="{
              orgId: orgId
            }"
            @btnAdd="btnAdd"
            @btnEdit="btnEdit"
          >
            <el-table-column prop="deptName" label="部门名称" />
            <el-table-column prop="deptCode" label="部门编号" />
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <yx-status :dict="dict.label.status" :value="scope.row.status"></yx-status>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170" />
          </yx-crud-table>
        </div>
      </el-col>
    </el-row>

    <eFDrawer
      v-model="drawerMode"
      :formData="formData"
      :formRules="formRules"
      :add="add"
      :edit="edit"
      @afterSubmit="afterSubmit"
    >
      <template slot="form">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="formData.deptName" />
        </el-form-item>
        <el-form-item label="部门编号" prop="deptCode">
          <el-input v-model="formData.deptCode" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model.number="formData.orderNum" controls-position="right" step-strictly></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio-button v-for="item in dict.status" :key="item.dictValue" :label="item.dictValue">{{ item.dictLabel }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </template>
    </eFDrawer>

  </div>
</template>

<script>
import deepcopy from 'deepcopy'
import eFDrawer from '@/components/eFDrawer'
import { list as unitList } from '../unit/api'
import { list, del, details, add, edit } from './api'

const searchConfigJson = [
  { name: 'deptName', label: '部门名称', type: 'input', width: 150 },
  { name: 'status', label: '状态', type: 'select', dict: 'status', width: 150 }
]

const tableConfigJson = {
  optCellWidth: 90,
  requestApi: { list, del }
}

const defaultFormData = {
  id: null,
  orgId: null,
  deptName: '',
  deptCode: '',
  orderNum: undefined,
  status: '0'
}

export default {
  components: { eFDrawer },
  dicts: ['status'],
  data () {
    return {
      searchKey: '',
      treeList: [],
      treeExpanded: [],
      orgId: null,
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      drawerMode: '',
      formData: {},
      formRules: {
        deptName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        deptCode: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    searchKey (val) {
      if (val === '') {
        this.$refs.tree.filter('')
      }
    }
  },
  mounted () {
    this.getUnitList()
  },
  methods: {
    // 获取单位列表
    getUnitList () {
      unitList().then(res => {
        this.treeList = res.result
      })
    },
    // 查询
    search () {
      this.$refs.tree.filter(this.searchKey)
    },
    // 树检索
    treeFilterNode (value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    // 切换部门获取用户列表
    getDeptList (data) {
      this.orgId = data.id
      this.$nextTick(() => {
        this.$refs.yxCrudTable.getTableDataBySearch({})
      })
    },
    btnAdd () {
      this.formData = deepcopy(defaultFormData)
      this.formData.orgId = deepcopy(this.orgId)
      this.drawerMode = 'add'
    },
    btnEdit (data) {
      this.formData = deepcopy(defaultFormData)
      details(data).then(res => {
        for (const item in defaultFormData) {
          if (res.result[item] !== undefined) {
            this.$set(this.formData, item, res.result[item])
          }
        }
        this.drawerMode = 'edit'
      })
    },
    add,
    edit,
    afterSubmit () {
      this.$refs.yxCrudTable.refresh()
    },
    // 记录当前展开的节点
    handleChange_treeExpand (data) {
      this.treeExpanded.push(data.id)
    },
    // 记录当前展开的节点
    handleChange_treeCollapse (data) {
      for (let i = 0; i < this.treeExpanded.length; i++) {
        if (data.id === this.treeExpanded[i]) {
          this.treeExpanded.splice(i, 1)
          if (data.children && data.children.length > 0) {
            for (const children of data.children) {
              this.handleChange_treeCollapse(children)
            }
          }
          break
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
