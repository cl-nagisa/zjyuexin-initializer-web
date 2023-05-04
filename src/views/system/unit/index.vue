<template>
  <div class="yx-page-wrapper unit-wrapper">

    <!-- 树形单位列表 start -->
    <div class="menu-tree">
      <div class="title-wrapper">
        单位结构
        <el-button type="primary" size="mini" @click="initForm_add('')">新增一级单位</el-button>
      </div>
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
          :expand-on-click-node="false"
          :default-expanded-keys="treeExpanded"
          :filter-node-method="treeFilterNode"
          highlight-current
          default-expand-all
          draggable
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          @node-expand="handleChange_treeExpand"
          @node-collapse="handleChange_treeCollapse"
          @node-drop="handleChange_treeDrop"
        >
          <div class="node" slot-scope="{ node, data }" @click="initForm_edit(data)">
            <span class="name" :class="{ 'disabled': data.status === '1' }">{{ node.label }}</span>
            <span class="opt">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-plus"
                @click.stop="initForm_add(data)"
              ></el-button>
              <el-button type="text" size="mini" icon="el-icon-delete" @click.stop="menu_del(data.id)"></el-button>
            </span>
          </div>
        </el-tree>
      </div>
    </div>
    <!-- 树形单位列表 end -->

    <!-- 单位详情表单 start -->
    <div v-show="formName" class="menu-detail">
      <div class="title-wrapper">
        {{ formName }}
        <el-button type="primary" size="mini" :loading="btnLoading" @click="submit">提交</el-button>
      </div>
      <div class="form">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px" label-position="top">
          <el-form-item label="单位名称" prop="orgName">
            <el-input v-model="form.orgName"></el-input>
          </el-form-item>
          <el-form-item label="单位编号" prop="orgCode">
            <el-input v-model="form.orgCode"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="orderNum">
            <el-input-number v-model.number="form.orderNum" controls-position="right" step-strictly></el-input-number>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio-button v-for="item in dict.status" :key="item.dictValue" :label="item.dictValue">{{ item.dictLabel }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 单位详情表单 end -->

  </div>
</template>

<script>
import deepcopy from 'deepcopy'
import { list, del, details, add, edit } from './api'

const defaultFormData = {
  id: null,
  parentId: null,
  orgName: null,
  orgCode: null,
  orderNum: null,
  status: '0'
}

export default {
  dicts: ['status'],
  data () {
    return {
      btnLoading: false,
      searchKey: '',
      formName: null,
      form: {},
      rules: {
        orgName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      treeList: [],
      treeExpanded: []
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
    this.getTreeData()
  },
  methods: {
    // 获取菜单列表
    getTreeData () {
      list().then(res => {
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
    // 删除
    menu_del (id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.formName = ''
          this.getTreeData()
        })
      })
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
    // 判断节点是否可以被拖拽
    allowDrag () {
      return true
    },
    // 判断节点是否可以拖拽到指定位置
    allowDrop () {
      return true
    },
    // 拖动成功后，修改排序，提交接口
    handleChange_treeDrop (draggingNode, dropNode, dropType) {
      const formData = {
        id: draggingNode.data.id,
        orderNum: draggingNode.data.orderNum
      }
      // 拖动修改排序
      if (dropType === 'before') {
        formData.orderNum = dropNode.data.orderNum - 1
      } else if (dropType === 'after') {
        formData.orderNum = dropNode.data.orderNum + 1
      }
      // 如果两个节点的pid不同
      if (draggingNode.data.parentId !== dropNode.data.parentId) {
        formData.parentId = dropNode.data.parentId
      }
      edit(formData).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.formName = ''
        this.getTreeData()
      })
    },
    // 初始化表单 - 新增
    initForm_add (data) {
      this.formName = '新增'
      this.$refs['form'].resetFields()
      this.form = deepcopy(defaultFormData)
      if (data === '') {
        // 新增一级单位
        this.form.parentId = '0'
        this.form.orderNum = this.treeList[this.treeList.length - 1].orderNum + 1
      } else {
        // 新增子集单位
        this.form.parentId = data.id
        if (data.children && data.children.length > 0) {
          this.form.orderNum = data.children[data.children.length - 1].orderNum + 1
        } else {
          this.form.orderNum = 1
        }
      }
    },
    // 初始化表单 - 编辑
    initForm_edit (data) {
      this.form = deepcopy(defaultFormData)
      details(data).then(res => {
        this.formName = '编辑'
        this.$refs['form'].clearValidate()
        this.$nextTick(() => {
          for (const item of Object.keys(defaultFormData)) {
            this.$set(this.form, item, deepcopy(res.result[item]))
          }
        })
      })
    },
    // 提交
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.btnLoading = true
          if (this.form.id) {
            this.submit_edit()
          } else {
            this.submit_add()
          }
        } else {
          return false
        }
      })
    },
    // 新增
    submit_add () {
      add(this.form).then(() => {
        this.btnLoading = false
        this.$message({
          type: 'success',
          message: '新增成功'
        })
        this.getTreeData()
        this.$refs['form'].resetFields()
        this.formName = ''
      }).catch(() => {
        this.btnLoading = false
      })
    },
    // 编辑
    submit_edit () {
      edit(this.form).then(() => {
        this.btnLoading = false
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
        this.getTreeData()
      }).catch(() => {
        this.btnLoading = false
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
