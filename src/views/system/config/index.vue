<template>
  <div class="yx-page-wrapper">

    <yx-crud-table
      ref="yxCrudTable"
      :searchConfigJson="searchConfigJson"
      :tableConfigJson="tableConfigJson"
      :dict="dict.dict"
      @btnAdd="btnAdd"
      @btnEdit="btnEdit"
    >
      <template v-slot:optRow>
        <el-button size="small" @click="updateRedis">更新Redis</el-button>
      </template>
      <el-table-column prop="configName" label="参数名称" />
      <el-table-column prop="configKey" label="参数键名" />
      <el-table-column prop="configValue" label="参数键值" />
      <el-table-column prop="configType" label="系统内置">
        <template slot-scope="scope">
          <yx-status :dict="dict.label.boolean" :value="scope.row.configType"></yx-status>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建日期" width="170"></el-table-column>
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
        <el-form-item label="参数名称" prop="configName">
          <el-input v-model="formData.configName" />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="formData.configKey" />
        </el-form-item>
        <el-form-item label="参数键值" prop="configValue">
          <el-input v-model="formData.configValue" />
        </el-form-item>
        <el-form-item label="系统内置" prop="configType">
          <el-radio-group v-model="formData.configType">
            <el-radio-button v-for="item in dict.boolean" :key="item.dictValue" :label="item.dictValue">{{ item.dictLabel }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" rows="3" />
        </el-form-item>
      </template>
    </eFDrawer>

  </div>
</template>

<script>
import deepcopy from 'deepcopy'
import eFDrawer from '@/components/eFDrawer'
import { list, add, edit, del, details, downloadByIds } from './api'
import { clearCache } from '@/views/system/dict/api'

const searchConfigJson = [
  { name: 'configName', label: '参数名称', type: 'input', width: 250 },
  { name: 'configKey', label: '参数键名', type: 'input', width: 250 },
  { name: 'configType', label: '系统内置', type: 'select', dict: 'boolean', width: 250 },
  { name: 'time', label: '创建日期', type: 'dateTime', timeType: 'daterange', original: false, width: 250 }
]

const tableConfigJson = {
  btnDownloadById: true,
  optCellWidth: 90,
  requestApi: { list, downloadByIds, del }
}

const defaultFormData = {
  id: null,
  configName: null,
  configKey: null,
  configValue: null,
  configType: '0',
  remark: null
}

export default {
  components: { eFDrawer },
  dicts: ['boolean'],
  data () {
    return {
      drawerShow: false,
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      drawerMode: '',
      formData: {},
      formRules: {
        configName: [{ required: true, message: '必填', trigger: 'blur' }],
        configKey: [{ required: true, message: '必填', trigger: 'blur' }],
        configValue: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 更新Redis
    updateRedis () {
      clearCache().then(() => {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
      })
    },
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
