<template>
  <div v-show="dictTypeId">

    <yx-crud-table
      ref="yxCrudTable"
      :searchConfigJson="searchConfigJson"
      :tableConfigJson="tableConfigJson"
      :firstLoad="false"
      :staticQueryJson="{
        dictType: dictType
      }"
      layout="prev, pager, next"
      @btnAdd="btnAdd"
      @btnEdit="btnEdit"
    >
      <el-table-column label="所属字典">{{ dictType }}</el-table-column>
      <el-table-column prop="dictLabel" label="字典标签" />
      <el-table-column prop="dictValue" label="字典值" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <yx-status :dict="dict.label.status" :value="scope.row.status"></yx-status>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="描述" show-overflow-tooltip />
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
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="formData.dictLabel" />
        </el-form-item>
        <el-form-item label="字典值" prop="dictValue">
          <el-input v-model="formData.dictValue" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio-button v-for="item in dict.status" :key="item.dictValue" :label="item.dictValue">{{ item.dictLabel }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" />
        </el-form-item>
      </template>
    </eFDrawer>

  </div>
</template>

<script>
import deepcopy from 'deepcopy'
import eFDrawer from '@/components/eFDrawer'
import { list, details, add, edit, del } from './api'

const searchConfigJson = [
  { name: 'dictLabel', label: '字典标签', type: 'input', width: 180 }
]

const tableConfigJson = {
  optCellWidth: 100,
  requestApi: { list, del }
}

const defaultFormData = {
  id: null,
  dictTypeId: null,
  dictLabel: '',
  dictValue: '',
  status: '0',
  remark: null
}

export default {
  dicts: ['status'],
  components: { eFDrawer },
  data () {
    return {
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      drawerMode: '',
      formData: {},
      formRules: {
        dictLabel: [{ required: true, message: '必填', trigger: 'blur' }],
        dictValue: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      dictType: '',
      dictTypeId: ''
    }
  },
  methods: {
    initData (data) {
      this.dictType = data.dictType
      this.dictTypeId = data.id
      this.$nextTick(() => {
        this.$refs.yxCrudTable.$refs.yxCrudSearch.calc_width()
        this.$refs.yxCrudTable.getTableDataBySearch({})
      })
    },
    btnAdd () {
      this.formData = deepcopy(defaultFormData)
      this.formData.dictTypeId = deepcopy(this.dictTypeId)
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
