<template>
  <div class="yx-page-wrapper">

    <yx-crud-table
      ref="yxCrudTable"
      :searchConfigJson="searchConfigJson"
      :tableConfigJson="tableConfigJson"
      @btnLook="btnLook"
    >
      <el-table-column prop="title" label="系统模块" />
      <el-table-column prop="businessType" label="操作类型" />
      <el-table-column prop="requestMethod" label="请求方式" />
      <el-table-column prop="operUserName" label="操作人员" />
      <el-table-column prop="operIp" label="主机" />
      <el-table-column prop="operResult" label="操作状态" />
      <el-table-column prop="operTime" label="创建日期" width="170"></el-table-column>
    </yx-crud-table>

    <eFDrawer
      v-model="drawerMode"
      :formData="formData"
    >
      <template slot="form">
        <el-form-item label="系统模块">
          <el-input :value="formData.title" />
        </el-form-item>
        <el-form-item label="登录信息">
          <el-input :value="`${formData.operName}/${formData.operIp}/${formData.operLocation}`" />
        </el-form-item>
        <el-form-item label="请求地址">
          <el-input :value="formData.requestUrl" />
        </el-form-item>
        <el-form-item label="请求方式">
          <el-input :value="formData.requestMethod" />
        </el-form-item>
        <el-form-item label="操作方法">
          <el-input :value="formData.method" />
        </el-form-item>
        <el-form-item label="请求参数">
          <el-input :value="formData.operParam" />
        </el-form-item>
        <el-form-item label="操作状态">
          <el-input :value="formData.operResult" />
        </el-form-item>
        <el-form-item label="操作时间">
          <el-input :value="formData.operTime" />
        </el-form-item>
        <el-form-item label="异常信息">
          <el-input :value="formData.errorMsg" />
        </el-form-item>
      </template>
    </eFDrawer>

  </div>
</template>

<script>
import deepcopy from 'deepcopy'
import eFDrawer from '@/components/eFDrawer'
import { list, details } from './api'

const searchConfigJson = [
  { name: 'title', label: '系统模块', type: 'input', width: 200 },
  { name: 'operUserName', label: '操作人员', type: 'input', width: 200 }
]

const tableConfigJson = {
  btnDel: false,
  btnAdd: false,
  btnEdit: false,
  btnLook: true,
  optCellWidth: 60,
  requestApi: { list }
}

const defaultFormData = {
  id: null,
  title: '',
  operName: '',
  operIp: '',
  operLocation: '',
  requestUrl: '',
  requestMethod: '',
  method: '',
  operParam: '',
  operResult: '',
  operTime: '',
  errorMsg: ''
}

export default {
  components: { eFDrawer },
  data () {
    return {
      drawerShow: false,
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      drawerMode: '',
      formData: {}
    }
  },
  methods: {
    btnLook (data) {
      this.formData = deepcopy(defaultFormData)
      details(data).then(res => {
        for (const item in defaultFormData) {
          if (res.result[item] !== undefined) {
            this.$set(this.formData, item, res.result[item])
          }
        }
        this.drawerMode = 'look'
      })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
