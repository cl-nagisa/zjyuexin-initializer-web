<template>
  <div class="yx-page-wrapper">

    <yx-crud-search :searchConfigJson="searchConfigJson" :dict="dict.dict" :labelWidth="labelWidth" :firstLoad="false" @search="search">
      <!-- 自定义搜索框 start -->
      <div class="item">
        <label :style="{ 'width': labelWidth + 'px' }">自定义框：</label>
        <el-input
          v-model="staticQueryJson.yourSearchQuery"
          placeholder="我是手动敲出来的，不是配出来的"
          size="small"
          clearable
          style="width: 250px"
        ></el-input>
        <!-- 自定义搜索框 end -->
      </div>
    </yx-crud-search>

    <div class="setting-wrapper">
      <div class="opt">
        <div>
          <label>标签の宽度：</label>
          <el-input-number v-model.number="labelWidth" placeholder="标签宽度" size="small" :min="0" controls-position="right" />
        </div>
        <div>
          <el-button size="mini" type="primary" @click="getCode">渲染</el-button>
          <el-button size="mini" @click="setCode">还原</el-button>
        </div>
      </div>
      <div class="edit">
        <codeEdit ref="codeEdit"></codeEdit>
      </div>
    </div>

  </div>
</template>

<script>
import deepcopy from 'deepcopy'
import codeEdit from '@/components/codeEdit'

const searchConfigJson = [
  { name: 'input', label: '普通文本框', type: 'input', width: 250 },
  { name: 'dictSelect', label: '字典下拉框', type: 'select', dict: 'status', width: 250 },
  {
    name: 'multipleSelect',
    label: '多选下拉框',
    type: 'select',
    option: [
      { label: '选项一', value: 'opt1' },
      { label: '选项二', value: 'opt2' }
    ],
    multiple: true,
    width: 250
  },
  {
    name: 'cascader',
    label: '级联选择框',
    type: 'cascader',
    option: [
      {
        label: '选项1',
        value: 'opt1',
        children: [
          { label: '选项1-1', value: 'opt1-1' },
          { label: '选项1-2', value: 'opt1-2' }
        ]
      },
      {
        label: '选项2',
        value: 'opt2'
      }
    ],
    width: 250
  },
  { name: 'createTime', label: '日期选择框', type: 'dateTime', timeType: 'daterange', width: 250 },
  { name: 'dateTime', label: '时间选择框', type: 'dateTime', timeType: 'datetimerange', width: 250 }
]

export default {
  components: { codeEdit },
  dicts: ['status'],
  data () {
    return {
      labelWidth: 90,
      staticQueryJson: {
        yourSearchQuery: ''
      },
      searchConfigJson: []
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      this.searchConfigJson = deepcopy(searchConfigJson)
      this.$refs.codeEdit.initEdit(searchConfigJson)
    },
    getCode () {
      this.searchConfigJson = deepcopy(this.$refs.codeEdit.getValue())
    },
    setCode () {
      this.$refs.codeEdit.setValue(searchConfigJson)
    },
    search (query) {
      console.table(query)
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
