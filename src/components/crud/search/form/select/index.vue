<template>
  <el-select
    v-model="inputValue"
    :placeholder="'请选择' + config.label"
    size="small"
    :multiple="config.multiple"
    filterable
    clearable
    :style="{ 'width': config.width ? config.width + 'px' : '250px' }"
  >
    <template v-if="config.dict">
      <el-option
        v-for="item in option"
        :key="item.dictValue"
        :label="item.dictLabel"
        :value="item.dictValue"
      ></el-option>
    </template>
    <template v-else-if="config.option">
      <el-option
        v-for="item in config.option"
        :key="config.optionValue ? item[config.optionValue] :item.value"
        :label="config.optionLabel ? item[config.optionLabel] :item.label"
        :value="config.optionValue ? item[config.optionValue] :item.value"
      ></el-option>
    </template>
  </el-select>
</template>

<script>
export default {
  name: 'YxSelect',
  props: {
    /*
      * 配置属性
      * dict，字符串，字典名称
      * option，数组，下拉选择框的备选项，如果配置了“dict”属性，则此属性无效
      * multiple，是否开启多选，默认false
      * optionLabel，option中label字段的数据映射，作为下拉选择框中选项的文字字段，默认为label
      * optionValue，option中value字段的数据映射，作为下拉选择框中选项的值字段，默认为value
    */
    config: {
      type: Object
    },
    value: {
      type: [String, Array],
      default: () => {
        return null
      }
    },
    option: []
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
