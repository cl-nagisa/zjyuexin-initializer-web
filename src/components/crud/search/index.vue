<template>
  <div class="yx-crud-search-wrapper">
    <div
      class="form"
      :class="{ 'extend': extend }" :style="{ 'height': extend ? form_maxHeight + 'px' : form_height + 'px' }"
    >
      <div class="inner">
        <div class="item" v-for="item in searchConfigJson" :key="item.name">
          <label :style="{ 'width': labelWidth + 'px' }">{{ item.label }}：</label>
          <component v-model="formData[item.name]" :is="'xy-' + item.type" :config="item" :option="dict[item.dict]"></component>
        </div>
        <slot></slot>
      </div>
    </div>
    <div class="opt">
      <i
        v-show="moreShow"
        class="more"
        :class="{ 'el-icon-arrow-up': extend, 'el-icon-arrow-down': !extend }"
        title="更多搜索条件"
        @click="extend = !extend"
      ></i>
      <el-button size="small" type="primary" @click="search">搜索</el-button>
      <el-button size="small" @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>
import deepcopy from 'deepcopy'

import XyInput from './form/input'
import XySelect from './form/select'
import XyDateTime from './form/dateTime'
import XyCascader from './form/cascader'

export default {
  name: 'YxCrudSearch',
  components: {
    XyInput,
    XySelect,
    XyDateTime,
    XyCascader
  },
  props: {
    /*
      * 搜索栏配置json，是个数组，数组的每一项是的对象，包含具体配置，不同type类型的输入框组件拥有自己独特的属性，具体请看每个输入框组件，公共属性如下：
      * name，字符串，表单所绑定的值，即v-model所绑定的值
      * label，字符串，中文标签，用于提示此输入框所填内容的含义
      * type，字符串，输入框类型，目前支持的有“input 文本输入框”、“select 下拉选择框”、“dateTime 时间选择器”、“cascader 级联选择器”
      * width，字符串，输入框的宽度，单位“px“，如果不传此属性，则默认使用内置的宽度
    */
    searchConfigJson: {
      type: Array,
      default: () => {
        return []
      }
    },
    /*
      * 字典项集合，是个对象，用于存放需要用到的字典项，搭配“下拉选择框”使用
      * 请使用后台管理系统基座中自带的“Dict”来搭配使用
    */
    dict: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 页面加载时是否自动触发搜索功能，默认开启
    firstLoad: {
      type: Boolean,
      default: true
    },
    // 搜索栏输入框中文标签的宽度，默认70px
    labelWidth: {
      type: Number,
      default: 70
    }
  },
  data () {
    return {
      extend: false,
      form_width: 0,
      formItem_width_total: 0,
      form_height: 60,
      form_maxHeight: 0,
      formData: {}
    }
  },
  computed: {
    // 下拉显示更多按钮是否显示
    moreShow () {
      return this.formItem_width_total > this.form_width
    }
  },
  mounted () {
    this.initData()
    this.$nextTick(() => {
      this.calc_width()
    })
    window.addEventListener('resize', this.calc_width, false)
  },
  activated () {
    this.$nextTick(() => {
      this.calc_width()
    })
    window.addEventListener('resize', this.calc_width, false)
  },
  destroyed () {
    window.removeEventListener('resize', this.calc_width, false)
  },
  deactivated () {
    window.removeEventListener('resize', this.calc_width, false)
  },
  methods: {
    // 初始化表单数据
    initData () {
      for (const item of this.searchConfigJson) {
        this.$set(this.formData, item.name, item.default || null)
      }
      if (this.firstLoad) {
        this.search()
      }
    },
    // 计算搜索栏表单区域的宽度，判断是否需要做下拉展现更多的效果
    calc_width () {
      this.form_width = this.$el.querySelector('.form').clientWidth - 30
      this.formItem_width_total = 0
      for (const item of this.$el.querySelectorAll('.item')) {
        this.formItem_width_total += item.clientWidth
      }
      this.form_maxHeight = this.$el.querySelector('.inner').clientHeight
    },
    // 搜索
    search () {
      const formData = deepcopy(this.formData)
      // 对时间类型的字段特殊处理
      for (const item of this.searchConfigJson) {
        if (item.type === 'dateTime') {
          this.$delete(formData, item.name)
        }
        if (item.type === 'dateTime' && this.formData[item.name]) {
          if (item.original) {
            this.$set(formData, '$begin' + this.firstByteFmt(item.name), this.formData[item.name][0])
            this.$set(formData, '$end' + this.firstByteFmt(item.name), this.formData[item.name][1])
          } else {
            this.$set(formData, 'begin' + this.firstByteFmt(item.name), this.formData[item.name][0])
            this.$set(formData, 'end' + this.firstByteFmt(item.name), this.formData[item.name][1])
          }
        } else if (item.type === 'dateTime' && !this.formData[item.name]) {
          if (item.original) {
            this.$delete(formData, '$begin' + this.firstByteFmt(item.name))
            this.$delete(formData, '$end' + this.firstByteFmt(item.name))
          } else {
            this.$delete(formData, 'begin' + this.firstByteFmt(item.name))
            this.$delete(formData, 'end' + this.firstByteFmt(item.name))
          }
        }
      }
      this.extend = false
      this.$emit('search', formData)
    },
    // 重置
    reset () {
      for (const item of Object.keys(this.formData)) {
        this.$set(this.formData, item, null)
      }
      this.search()
    },
    // 首字母转大写
    firstByteFmt (val) {
      const first = (val.substr(0, 1)).toUpperCase()
      const str = val.substr(1)
      return first + str
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
