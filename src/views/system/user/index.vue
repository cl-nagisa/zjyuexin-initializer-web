<template>
  <div class="yx-page-wrapper user-wrapper">

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
                label: 'deptName'
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
        <div class="list">
          <yx-crud-table
            ref="yxCrudTable"
            :searchConfigJson="searchConfigJson"
            :dict="dict.dict"
            :tableConfigJson="tableConfigJson"
            :staticQueryJson="{
              deptId: deptId
            }"
            :tableHDIYByNavMenuPositionTop="tableHDIYByNavMenuPositionTop"
            @btnAdd="btnAdd"
            @btnEdit="btnEdit"
          >
            <el-table-column prop="userId" label="用户账号" />
            <el-table-column prop="workNum" label="员工工号" />
            <el-table-column prop="userName" label="用户姓名" />
            <el-table-column prop="orgName" label="所属单位" show-overflow-tooltip />
            <el-table-column prop="deptName" label="所属部门" show-overflow-tooltip />
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <yx-status :dict="dict.label.status" :value="scope.row.status"></yx-status>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170" />
            <template v-slot:optCell="scope">
              <el-button type="text" size="small" @click="btnDel(scope.row)">删除</el-button>
              <el-button v-if="scope.row.isLock === true" type="text" size="small" @click="btnUnlock(scope.row)">解锁</el-button>
              <el-button v-if="scope.row.isLock === false" type="text" size="small" @click="btnLock(scope.row)">锁定</el-button>
              <el-button type="text" size="small" @click="btnResetPwd(scope.row)">重置密码</el-button>
            </template>
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
        <el-form-item label="用户账号" prop="userId">
          <el-input v-model="formData.userId" :disabled="drawerMode === 'edit'" />
        </el-form-item>
        <el-form-item label="员工工号" prop="workNum">
          <el-input v-model="formData.workNum" />
        </el-form-item>
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="formData.userName" />
        </el-form-item>
        <el-form-item label="所属单位" prop="orgId">
          <el-cascader
            v-model="formData.orgId"
            :options="unitOptions"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              emitPath: false,
              value: 'id',
              label: 'orgName'
            }"
            :show-all-levels="false"
            filterable
            clearable
          >
            <template slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-select v-model="formData.deptId" filterable clearable>
            <el-option v-for="item in deptOptions" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
          </el-select>
          <div class="yx-form-tips">需要优先选择所属单位</div>
        </el-form-item>
        <el-form-item label="所属角色" prop="rolesIds">
          <el-select v-model="formData.rolesIds" filterable multiple clearable>
            <el-option v-for="item in rolesOptions" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
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
import { tree, list, del, details, add, edit, lock, unlock, resetPwd, downloadByIds, upload, downloadTemplate } from './api'
import { list as unitList } from '../unit/api'
import { list as deptList } from '../dept/api'
import { list as rolesList } from '../role/api'

const searchConfigJson = [
  { name: 'userName', label: '用户姓名', type: 'input', width: 150 },
  { name: 'status', label: '状态', type: 'select', dict: 'status', width: 150 }
]

const tableConfigJson = {
  btnUpload: true,
  btnDownloadById: true,
  btnDel: false,
  optCellWidth: 180,
  requestApi: { list, downloadByIds, upload, downloadTemplate }
}

const defaultFormData = {
  id: null,
  userId: '',
  workNum: '',
  userName: '',
  orgId: '',
  deptId: '',
  rolesIds: [],
  orderNum: undefined,
  status: '0'
}

export default {
  components: { eFDrawer },
  dicts: ['status'],
  props: {
    // 当从角色管理页面引入此页面时，需要将此参数设置成false
    tableHDIYByNavMenuPositionTop: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      searchKey: '',
      treeList: [],
      treeExpanded: [],
      deptId: null,
      orgId: null,
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      drawerMode: '',
      formData: {},
      formRules: {
        userId: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        rolesIds: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      unitOptions: [],
      deptOptions: [],
      rolesOptions: []
    }
  },
  watch: {
    searchKey (val) {
      if (val === '') {
        this.$refs.tree.filter('')
      }
    },
    'formData.orgId' (val) {
      this.handleChange_orgId(val)
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      tree().then(res => {
        this.treeList = res.result
      })
      unitList().then(res => {
        this.unitOptions = res.result
      })
      rolesList({ pageNum: 1, pageSize: 9999 }).then(res => {
        this.rolesOptions = res.result.records
      })
    },
    // 查询
    search () {
      this.$refs.tree.filter(this.searchKey)
    },
    // 树检索
    treeFilterNode (value, data) {
      if (!value) return true
      return data.deptName.indexOf(value) !== -1
    },
    // 切换部门获取用户列表
    getDeptList (data) {
      if (data.orgId) {
        this.deptId = data.orgId
        this.orgId = data.id
      } else {
        this.deptId = data.id
        this.orgId = ''
      }
      this.$nextTick(() => {
        this.$refs.yxCrudTable.getTableDataBySearch({})
      })
    },
    btnAdd () {
      this.formData = deepcopy(defaultFormData)
      this.formData.orgId = deepcopy(this.deptId)
      this.formData.deptId = deepcopy(this.orgId)
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
    btnDel (data) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ ids: data.userId }).then(() => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          })
          this.$refs.yxCrudTable.refresh()
        })
      })
    },
    // 解锁
    btnUnlock (data) {
      this.$confirm(`是否对${data.userName}的账户进行解锁`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unlock(data.userId).then(() => {
          this.$notify({
            title: '提示',
            message: '解锁成功',
            type: 'success'
          })
          this.$refs.yxCrudTable.refresh()
        })
      })
    },
    // 锁定
    btnLock (data) {
      this.$confirm(`是否对${data.userName}的账户进行锁定`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        lock(data.userId).then(() => {
          this.$notify({
            title: '提示',
            message: '锁定成功',
            type: 'success'
          })
          this.$refs.yxCrudTable.refresh()
        })
      })
    },
    // 重置密码
    btnResetPwd (data) {
      this.$confirm(`是否对${data.userName}的账户进行重置密码`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPwd({ userId: data.userId }).then((res) => {
          this.$notify({
            title: '提示',
            message: '重置成功',
            type: 'success'
          })
          this.$refs.yxCrudTable.refresh()
        })
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
    },
    // 所属单位改变时，获取所属部门备选项数据
    handleChange_orgId (val) {
      if (val) {
        this.formData.deptId = ''
        deptList({
          orgId: val,
          pageNum: 1,
          pageSize: 9999
        }).then(res => {
          this.deptOptions = res.result
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
