<template>
  <div class="yx-page-wrapper role-wrapper">

    <yx-crud-table
      ref="yxCrudTable"
      :searchConfigJson="searchConfigJson"
      :tableConfigJson="tableConfigJson"
      @btnAdd="btnAdd"
      @btnEdit="btnEdit"
    >
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleKey" label="角色权限" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <yx-status :dict="dict.label.status" :value="scope.row.status"></yx-status>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" />
      <el-table-column prop="createTime" label="创建日期" width="170"></el-table-column>
      <template v-slot:optCell="scope">
        <el-button type="text" size="small" @click="btnMenuSetting(scope.row)">分配权限</el-button>
        <el-button type="text" size="small" @click="btnSetUser(scope.row)">分配用户</el-button>
      </template>
    </yx-crud-table>

    <eFDrawer
      v-model="drawerMode"
      :formData="formData"
      :formRules="formRules"
      :add="add"
      :edit="edit"
      @afterSubmit="afterSubmit"
    >
      <template slot="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" />
        </el-form-item>
        <el-form-item label="角色权限" prop="roleKey">
          <el-input v-model="formData.roleKey" :disabled="drawerMode === 'edit'" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model.number="formData.orderNum" controls-position="right" step-strictly></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio-button v-for="item in dict.status" :key="item.dictValue" :label="item.dictValue">{{ item.dictLabel }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" rows="3" />
        </el-form-item>
      </template>
    </eFDrawer>

    <!-- 分配权限 start -->
    <eDrawer
      v-model="drawerShow"
      :title="'分配权限（' + currentRow.roleName + '）'"
      :btnLoading="btnLoading"
      @submit="submitMenu"
    >
      <div class="role-btn-opt">
        <el-checkbox v-model="treeExpandAll">展开/折叠</el-checkbox>
        <el-checkbox v-model="treeCheckAll">全选/全不选</el-checkbox>
        <el-checkbox v-model="treeCheckStrictly">父子联动</el-checkbox>
      </div>
      <el-tree
        ref="tree"
        :data="menus"
        size="medium"
        node-key="id"
        :check-strictly="!treeCheckStrictly"
        show-checkbox
        :default-checked-keys="menuIds"
      />
    </eDrawer>
    <!-- 分配权限 end -->

    <!-- 分配用户 start -->
    <eDrawer
      v-model="drawerShow_setUser"
      :title="'分配用户（' + currentRow.roleName + '）'"
      :btnLoading="btnLoading"
      size="80%"
      @submit="submitUser"
    >
      <div class="role-setUser-sel">
        <user ref="user" :tableHDIYByNavMenuPositionTop="false"></user>
      </div>
    </eDrawer>
    <!-- 分配用户 end -->

  </div>
</template>

<script>
import deepcopy from 'deepcopy'
import eFDrawer from '@/components/eFDrawer'
import eDrawer from '@/components/eDrawer'
import user from '../user'
import { list, add, edit, del, details, getUserRoles, setUser } from './api'

const searchConfigJson = [
  { name: 'roleName', label: '角色名称', type: 'input', width: 150 },
  { name: 'roleKey', label: '角色权限', type: 'input', width: 150 }
]

const tableConfigJson = {
  optCellWidth: 220,
  requestApi: { list, del }
}

const defaultFormData = {
  id: null,
  roleName: null,
  roleKey: null,
  orderNum: undefined,
  status: '0',
  remark: null
}

export default {
  components: { eFDrawer, eDrawer, user },
  dicts: ['status'],
  data () {
    return {
      drawerShow: false,
      drawerShow_setUser: false,
      btnLoading: false,
      treeExpandAll: false,
      treeCheckAll: false,
      treeCheckStrictly: false,
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      drawerMode: '',
      currentRow: {},
      formData: {},
      formRules: {
        roleName: [{ required: true, message: '必填', trigger: 'blur' }],
        roleKey: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      menus: [],
      menuIds: []
    }
  },
  watch: {
    // 分配权限 - 展开/收起
    treeExpandAll (val) {
      this.changeTreeExpand(this.$refs.tree.store.root, val)
    },
    // 分配权限 - 全选/全不选
    treeCheckAll (val) {
      this.changeTreeCheck(this.$refs.tree.store.root, val)
    }
  },
  methods: {
    btnAdd () {
      this.formData = deepcopy(defaultFormData)
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
    // 分配权限
    btnMenuSetting (row) {
      getUserRoles({ id: row.id }).then(res => {
        this.drawerShow = true
        this.currentRow = row
        this.menus = res.result.menus
        this.menuIds = []
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys([])
          res.result.checkedKeys.forEach(item => {
            this.menuIds.push(item)
          })
        })
      })
    },
    // 分配用户
    btnSetUser (row) {
      this.drawerShow_setUser = true
      this.currentRow = row
    },
    // 分配权限 - 提交
    submitMenu () {
      const params = { id: this.currentRow.id, menuIds: [] }
      // 得到半选的父节点数据，保存起来
      this.$refs.tree.getHalfCheckedNodes().forEach(data => {
        params.menuIds.push(data.id)
      })
      // 得到已选中的 key 值
      this.$refs.tree.getCheckedKeys().forEach(data => {
        params.menuIds.push(data)
      })
      this.btnLoading = true
      edit(params).then(() => {
        this.btnLoading = false
        this.drawerShow = false
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.$refs.yxCrudTable.refresh()
      }).catch(() => {
        this.btnLoading = false
      })
    },
    // 分配用户 - 提交
    submitUser () {
      const tableSelected = this.$refs.user.$refs.yxCrudTable.tableSelected
      if (tableSelected.length === 0) {
        this.$notify({
          title: '提示',
          message: '请先勾选用户',
          type: 'warning'
        })
        return false
      }
      const params = { roleId: this.currentRow.id, ids: [] }
      tableSelected.forEach(item => {
        params.ids.push(item.id)
      })
      this.btnLoading = true
      setUser(params).then(() => {
        this.btnLoading = false
        this.drawerShow_setUser = false
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.$refs.yxCrudTable.refresh()
      }).catch(() => {
        this.btnLoading = false
      })
    },
    // 分配权限 - 展开、收起所有节点
    changeTreeExpand (node, val) {
      node.expanded = val
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = val
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeExpand(node.childNodes[i], val)
        }
      }
    },
    // 分配权限 - 展开、收起所有节点
    changeTreeCheck (node, val) {
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身checked状态
        node.childNodes[i].checked = val
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeCheck(node.childNodes[i], val)
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
