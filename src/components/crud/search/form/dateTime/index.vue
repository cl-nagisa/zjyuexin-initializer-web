<template>
  <el-date-picker
    v-model="inputValue"
    :placeholder="'请输入' + config.label"
    size="small"
    :type="config.timeType"
    start-placeholder="开始时间"
    end-placeholder="结束结束"
    :default-time="['00:00:00','23:59:59']"
    value-format="yyyy-MM-dd HH:mm:ss"
    :format="config.timeType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
    clearable
    :style="{
      'width': config.width ? config.width + 'px' :
       config.timeType === 'daterange' ? '250px' : '250px'
    }"
  ></el-date-picker>
</template>

<script>
export default {
  name: 'YxDateTime',
  props: {
    /*
      * 配置属性
      * timeType，字符串，时间选择器的类型，目前支持“datetimerange 年月日时分秒”、“daterange 年月日”两种类型
      * original, 布尔型，默认true，是否自动生成$符号
    */
    config: {
      type: Object
    },
    value: {}
  },
  data () {
    return {
      inputValue: ''
    }
  },
  watch: {
    value (val) {
      this.inputValue = val
    },
    inputValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
