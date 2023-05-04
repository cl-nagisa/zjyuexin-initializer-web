<template>
  <el-tag :type="typeFmt" effect="plain" :size="size">{{ dict[value] }}</el-tag>
</template>

<script>
export default {
  name: 'Status',
  props: {
    dict: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: [String, Number],
      default: ''
    },
    size: {
      type: String,
      default: ''
    }
  },
  computed: {
    typeFmt () {
      if (Number(this.value) === 0) {
        return ''
      } else if (Number(this.value) === 1) {
        return 'danger'
      }
      return ''
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
