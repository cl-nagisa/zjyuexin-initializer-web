<template>
  <el-input
    v-model="inputValue"
    :placeholder="'请输入' + config.label"
    size="small"
    clearable
    :style="{ 'width': config.width ? config.width + 'px' : '250px' }"
  ></el-input>
</template>

<script>
export default {
  name: 'YxInput',
  props: {
    config: {
      type: Object
    },
    value: {
      type: String,
      default: ''
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
