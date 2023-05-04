<template>
  <div class="yx-page-wrapper">

    <yx-crud-table
      ref="yxCrudTable"
      :searchConfigJson="searchConfigJson"
      :tableConfigJson="tableConfigJson"
      @btnAdd="btnAdd"
      @btnEdit="btnEdit"
    >
      <el-table-column prop="template" label="消息模板" show-overflow-tooltip />
      <el-table-column prop="identifier" label="标识符" />
      <el-table-column prop="type" label="通知类型" />
      <el-table-column prop="routing" label="跳转地址" show-overflow-tooltip />
      <el-table-column prop="createUserName" label="操作人" />
      <el-table-column prop="createTime" label="创建时间" width="170" />
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
        <el-form-item label="消息模板" prop="template">
          <el-input v-model="formData.template" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="标识符" prop="identifier">
          <el-input v-model="formData.identifier"></el-input>
        </el-form-item>
        <el-form-item label="通知类型" prop="type">
          <el-input v-model="formData.type"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="routing">
          <el-input v-model="formData.routing"></el-input>
        </el-form-item>
      </template>
    </eFDrawer>

  </div>
</template>

<script>
import deepcopy from 'deepcopy'
import eFDrawer from '@/components/eFDrawer'
import { list, add, edit, del, details } from './api'

const searchConfigJson = [
  { name: 'template', label: '消息模板', type: 'input', width: 200 },
  { name: 'identifier', label: '标识符', type: 'input', width: 200 }
]

const tableConfigJson = {
  optCellWidth: 90,
  requestApi: { list, del }
}

const defaultFormData = {
  id: null,
  template: null,
  identifier: null,
  type: null,
  routing: null
}

export default {
  components: { eFDrawer },
  data () {
    return {
      drawerShow: false,
      btnLoading: false,
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      drawerMode: '',
      formData: {},
      formRules: {
        template: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        identifier: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        type: [
          { required: false, message: '必填', trigger: 'blur' }
        ],
        routing: [
          { required: false, message: '必填', trigger: 'blur' }
        ]
      }
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
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
