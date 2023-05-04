<template>
  <div class="yx-page-wrapper menu-wrapper">

    <!-- 树形菜单列表 start -->
    <div class="menu-tree">
      <div class="title-wrapper">
        菜单结构
        <el-button type="primary" size="mini" @click="initForm_add('')">新增一级目录</el-button>
      </div>
      <div class="search-wrapper">
        <el-input v-model="searchKey" size="mini" placeholder="菜单名称或按钮权限" clearable @keyup.enter.native="search">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
      </div>
      <div class="tree">
        <el-tree
          ref="tree"
          :data="treeList"
          node-key="id"
          :props="{
            label: 'menuName'
          }"
          :expand-on-click-node="false"
          :default-expanded-keys="treeExpanded"
          :filter-node-method="treeFilterNode"
          highlight-current
          draggable
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          @node-expand="handleChange_treeExpand"
          @node-collapse="handleChange_treeCollapse"
          @node-drop="handleChange_treeDrop"
        >
          <div class="node" slot-scope="{ node, data }" @click="initForm_edit(data)">
            <span class="name">{{ node.label }}</span>
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
    <!-- 树形菜单列表 end -->

    <!-- 菜单详情表单 start -->
    <div v-show="formName" class="menu-detail">
      <div class="title-wrapper">
        {{ formName }}
        <el-button type="primary" size="mini" :loading="btnLoading" @click="submit">提交</el-button>
      </div>
      <div class="form">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px" label-position="top">
          <el-form-item label="名称" prop="menuName">
            <el-input v-model="form.menuName" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="menuType">
            <el-radio-group v-model="form.menuType" :disabled="formName === '编辑'">
              <el-radio-button label="M">目录</el-radio-button>
              <el-radio-button label="C">菜单</el-radio-button>
              <el-radio-button label="F">按钮</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="['M', 'C'].includes(form.menuType)" label="icon图标" prop="icon">
            <el-popover placement="bottom-start" width="450" trigger="click" @show="$refs['iconSelect'].reset()">
              <icon-select ref="iconSelect" @selected="iconSelected"></icon-select>
              <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" clearable>
                <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px; width: 16px" />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item v-if="['M', 'C'].includes(form.menuType)" label="是否隐藏" prop="visible">
            <el-radio-group v-model="form.visible">
              <el-radio-button v-for="item in dict.status" :key="item.dictValue" :label="item.dictValue">{{ item.dictLabel }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序" prop="orderNum">
            <el-input-number v-model.number="form.orderNum" controls-position="right" step-strictly></el-input-number>
          </el-form-item>
          <el-form-item v-if="['F'].includes(form.menuType)" label="权限名称" prop="perms">
            <el-input v-model="form.perms" maxlength="50"></el-input>
            <div class="yx-form-tips">为当前按钮命名一个唯一的权限名，支持任意字符，方便后续给不同角色配置按钮权限</div>
          </el-form-item>
          <el-form-item v-if="['M', 'C'].includes(form.menuType)" label="路由地址" prop="routePath">
            <el-input v-model="form.routePath"></el-input>
            <div class="yx-form-tips">首个字符需要写斜杠，例如填写：/system/user，一般常与组件地址相同</div>
          </el-form-item>
          <el-form-item v-if="['C'].includes(form.menuType)" label="组件地址" prop="componentPath">
            <el-input v-model="form.componentPath"></el-input>
            <div class="yx-form-tips">对应组件文件所在源码目录中的位置，即"/src/views/"下的某个目录或文件，首个字符不需要写斜杠，例如填写：system/user，一般常与路由地址相同</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 菜单详情表单 end -->

  </div>
</template>

<script>
import deepcopy from 'deepcopy'
import { list, del, details, add, edit } from './api'
import IconSelect from '@/components/IconSelect'

const defaultFormData = {
  id: null,
  parentId: null,
  menuName: null,
  menuType: null,
  icon: null,
  visible: '0',
  orderNum: null,
  perms: null,
  routePath: null,
  componentPath: null,
  isFrame: '1',
  status: '0'
}

export default {
  components: { IconSelect },
  dicts: ['status'],
  data () {
    return {
      btnLoading: false,
      searchKey: '',
      formName: null,
      form: {},
      rules: {
        menuName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        menuType: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        perms: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        routePath: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        componentPath: [
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
    this.getMenu()
  },
  methods: {
    // 获取菜单列表
    getMenu () {
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
      return data.menuName.includes(value) || (data.perms && data.perms.includes(value))
    },
    // 删除
    menu_del (id) {
      this.$confirm('确定删除吗？', '提示', {
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
          this.getMenu()
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
    allowDrag (draggingNode) {
      if (draggingNode.data.menuType === 'F') {
        // 按钮不允许被拖拽
        return false
      }
      return true
    },
    // 判断节点是否可以拖拽到指定位置
    allowDrop (draggingNode, dropNode, type) {
      // 目录节点只能拖动到其他目录节点上方或下方，也可以拖动到其他菜单节点的上方或下方
      if (draggingNode.data.menuType === 'M') {
        if (dropNode.data.menuType === 'M' && type !== 'inner') {
          return true
        } else if (dropNode.data.menuType === 'C' && type !== 'inner') {
          return true
        }
        return false
      }
      // 菜单节点只能拖动到其他菜单节点的上方或下方
      if (draggingNode.data.menuType === 'C' && dropNode.data.menuType === 'C' && type !== 'inner') {
        return true
      }
      return false
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
        this.getMenu()
      })
    },
    // 初始化表单 - 新增
    initForm_add (data) {
      this.formName = '新增'
      this.$refs['form'].resetFields()
      this.form = deepcopy(defaultFormData)
      if (data === '') {
        // 新增一级目录
        this.form.parentId = '0'
        this.form.menuType = 'M'
        this.form.orderNum = this.treeList[this.treeList.length - 1].orderNum + 1
      } else if (data.menuType === 'M') {
        // 在一级目录下新增，可以新增二级目录或菜单
        this.form.parentId = data.id
        this.form.menuType = 'C'
        if (data.children && data.children.length > 0) {
          this.form.orderNum = data.children[data.children.length - 1].orderNum + 1
        } else {
          this.form.orderNum = 1
        }
      } else if (data.menuType === 'C') {
        // 在菜单下新增按钮
        this.form.parentId = data.id
        this.form.menuType = 'F'
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
    reset () {
      this.$refs['form'].resetFields()
    },
    // icon图标
    iconSelected (name) {
      this.form.icon = deepcopy(name)
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
        this.getMenu()
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
        this.getMenu()
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
