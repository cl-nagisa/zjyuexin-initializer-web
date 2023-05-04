<template>
  <el-drawer
    :visible.sync="show"
    :direction="direction"
    :size="size"
    :wrapperClosable="false"
    :withHeader="false"
    :modal="modal"
    append-to-body
    destroy-on-close
  >
    <div v-if="withHeader" class="drawer-header">
      <label>{{ title }}</label>
      <slot name="header"></slot>
      <el-button v-if="submitBtn" size="mini" type="primary" :loading="btnLoading" @click="submit">提交</el-button>
      <el-button size="mini" @click="show = false">关闭</el-button>
    </div>
    <div class="drawer-wrapper" :class="{ 'withNoHeader': !withHeader }">
      <slot></slot>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    // 开启/关闭
    value: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 打开方向
    direction: {
      type: String,
      default: 'rtl'
    },
    // 窗体大小
    size: {},
    // 是否显示提交按钮
    submitBtn: {
      type: Boolean,
      default: true
    },
    // 提交按钮loading状态
    btnLoading: {
      type: Boolean,
      default: false
    },
    // 是否显示顶部标题栏
    withHeader: {
      type: Boolean,
      default: true
    },
    // 是否显示遮罩层
    modal: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      show: false
    }
  },
  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    submit () {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
