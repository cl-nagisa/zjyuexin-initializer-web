<template>
  <el-cascader
    v-model="inputValue"
    :placeholder="'请输入' + config.label"
    size="small"
    clearable
    :options="config.option"
    :show-all-levels="false"
    :props="{
      checkStrictly: true,
      emitPath: false,
      label: config.propsLabel ? config.propsLabel : 'label',
      value: config.propsValue ? config.propsValue : 'value',
      children: config.propsChildren ? config.propsChildren : 'children',
      disabled: config.propsDisabled ? config.propsDisabled : 'disabled'
    }"
    filterable
    :style="{ 'width': config.width ? config.width + 'px' : '250px' }"
  ></el-cascader>
</template>

<script>
export default {
  name: 'YxCascader',
  props: {
    /*
      * 配置属性
      * option，数组，下拉选择框的备选项
      * propsLabel，option中label字段的数据映射，作为下拉选择框中选项的文字字段，默认为label
      * propsValue，option中value字段的数据映射，作为下拉选择框中选项的值字段，默认为value
      * propsChildren，option中children字段的数据映射，作为下拉选择框中判断是否有子选项，默认为children
      * propsDisabled, option中disabled字段的数据映射，作为下拉选择框中判断是否可被选择，默认为disabled
    */
    config: {
      type: Object
    },
    value: {
      type: [String, Array],
      default: () => {
        return null
      }
    }
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
