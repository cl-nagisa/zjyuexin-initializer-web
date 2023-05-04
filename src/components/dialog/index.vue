<template>
  <el-dialog
    class="xy-dialog"
    :title="title"
    :visible.sync="show"
    :top="top"
    :width="width"
    :modal="modal"
    :close-on-click-modal="closeOnClickModal"
    :destroy-on-close="destroyOnClose"
  >
    <slot></slot>
    <slot slot="footer" name="footer">
      <el-button type="primary" size="small" :loading="loading" @click="submit">确 定</el-button>
      <el-button size="small" @click="cancel">取 消</el-button>
    </slot>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 显示弹窗，使用v-model双向绑定
    value: {
      type: Boolean
    },
    // 弹窗标题
    title: {
      type: String
    },
    // 弹窗距离窗口顶部的距离，默认8vh，支持px或%为单位
    top: {
      type: String,
      default: '8vh'
    },
    // 弹窗宽度，默认50%框，支持px为单位
    width: {
      type: String,
      default: '50%'
    },
    // 是否需要遮罩层
    modal: {
      type: Boolean,
      default: true
    },
    // 是否可以通过点击 modal 关闭 Dialog
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    // 关闭时销毁 Dialog 中的元素
    destroyOnClose: {
      type: Boolean,
      default: true
    },
    // 提交按钮loading状态
    loading: {
      type: Boolean,
      default: false
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
      if (val) {
        this.$emit('open')
      } else {
        this.$emit('close')
      }
      this.$emit('input', val)
    }
  },
  methods: {
    submit () {
      this.$emit('submit')
    },
    cancel () {
      this.show = false
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
