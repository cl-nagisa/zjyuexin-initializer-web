<template>
  <div class="yx-page-wrapper dict-wrapper">

    <!-- 表格 start -->
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" style="margin-bottom: 15px;">
        <!-- 一级字典 start -->
        <yx-crud-table
          ref="yxCrudTable"
          :searchConfigJson="searchConfigJson"
          :tableConfigJson="tableConfigJson"
          highlight
          layout="prev, pager, next"
          @tableCurrentChange="tableCurrentChange"
          @btnAdd="btnAdd"
          @btnEdit="btnEdit"
        >
          <template v-slot:optRow>
            <el-button size="small" @click="updateRedis">更新Redis</el-button>
          </template>
          <el-table-column prop="dictType" label="字典标识" />
          <el-table-column prop="dictName" label="字典名称" />
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <yx-status :dict="dict.label.status" :value="scope.row.status"></yx-status>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="描述" show-overflow-tooltip />
        </yx-crud-table>
        <!-- 一级字典 end -->
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14" style="margin-bottom: 15px;">
        <!-- 二级字典 start -->
        <dict-details ref="dictDetails"></dict-details>
        <!-- 二级字典 end -->
      </el-col>
    </el-row>
    <!-- 表格 end -->

    <!-- 表单 start -->
    <eFDrawer
      v-model="drawerMode"
      :formData="formData"
      :formRules="formRules"
      :add="add"
      :edit="edit"
      @afterSubmit="afterSubmit"
    >
      <template slot="form">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="formData.dictName" />
        </el-form-item>
        <el-form-item label="字典标识" prop="dictType">
          <el-input v-model="formData.dictType" />
          <div class="yx-form-tips">纯英文加下划线格式，如：menu_status</div>
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
    <!-- 表单 end -->
  </div>
</template>

<script>
import deepcopy from 'deepcopy'
import { list, del, details, add, edit, clearCache } from './api'
import eFDrawer from '@/components/eFDrawer'
import dictDetails from './details'

const searchConfigJson = [
  { name: 'dictName', label: '字典名称', type: 'input', width: 140 }
]

const tableConfigJson = {
  optCellWidth: 100,
  requestApi: { list, del }
}

const defaultFormData = {
  id: null,
  dictName: '',
  dictType: '',
  status: '0',
  remark: ''
}

export default {
  components: { eFDrawer, dictDetails },
  dicts: ['status'],
  data () {
    return {
      searchConfigJson: searchConfigJson,
      tableConfigJson: tableConfigJson,
      drawerMode: '',
      formData: {},
      formRules: {
        dictName: [{ required: true, message: '必填', trigger: 'blur' }],
        dictType: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  methods: {
    tableCurrentChange (data) {
      this.$refs.dictDetails.initData(data)
    },
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
  @import "index"
</style>
