<template>
  <el-drawer :visible.sync="show" :size="size" :wrapperClosable="false" :withHeader="false" append-to-body destroy-on-close>
    <div class="eFDrawer-header">
      <label>{{ titleStr }}</label>
      <el-button v-if="!isLook" size="mini" type="primary" :loading="btnLoading" @click="submit">提交</el-button>
      <el-button size="mini" @click="show = false">关闭</el-button>
    </div>
    <div class="eFDrawer-wrapper">
      <div v-if="Object.keys(this.formData).length > 0" class="form-wrapper">
        <el-form
          ref="form"
          :model="formData"
          :rules="formRules"
          size="small"
          label-position="top"
        >
          <slot name="form"></slot>
        </el-form>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    /*
      * 模式
      * add 新增；edit 编辑；look 查看；diy 自定义
    */
    value: {
      type: String,
      default: ''
    },
    // 标题，当value为diy时此值有效
    title: {
      type: String,
      default: ''
    },
    // 窗体大小
    size: {},
    // 表单字段
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单校验规则
    formRules: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 提交前的函数，需返回一个布尔值，true 继续提交，false 终止提交
    beforeSubmit: {
      type: Function,
      default: () => {
        return true
      }
    },
    // 提交接口方法
    add: {
      type: Function,
      default: () => {
        return true
      }
    },
    // 编辑接口方法
    edit: {
      type: Function,
      default: () => {
        return true
      }
    },
    // 自定义接口方法
    diySubmit: {
      type: Function,
      default: () => {
        return true
      }
    }
  },
  data () {
    return {
      show: false,
      btnLoading: false
    }
  },
  computed: {
    titleStr () {
      if (this.value === 'add') {
        return '新增'
      } else if (this.value === 'edit') {
        return '编辑'
      } else if (this.value === 'look') {
        return '查看'
      } else if (this.value === 'diy') {
        return this.title
      } else {
        return ''
      }
    },
    isLook () {
      if (this.value === 'look') {
        return true
      }
      return false
    }
  },
  watch: {
    value (val) {
      this.show = !!val
    },
    show (val) {
      if (val === false) {
        this.$emit('input', '')
      } else {
        this.initForm()
      }
    }
  },
  methods: {
    initForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    submit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.btnLoading = true
          const res = await this.beforeSubmit()
          if (res === false) {
            this.btnLoading = false
            return false
          }
          this.doSubmit()
        }
      })
    },
    // 表单校验通过后做真正的提交操作
    doSubmit () {
      if (this.value === 'add') {
        this.add(this.formData).then(res => {
          this.btnLoading = false
          this.$notify({
            title: '提示',
            message: '新增成功',
            type: 'success'
          })
          this.$emit('afterSubmit', res)
          this.show = false
        }).catch(() => {
          this.btnLoading = false
          this.$emit('submitCatch')
        })
      } else if (this.value === 'edit') {
        this.edit(this.formData).then(res => {
          this.btnLoading = false
          this.$notify({
            title: '提示',
            message: '编辑成功',
            type: 'success'
          })
          this.$emit('afterSubmit', res)
          this.show = false
        }).catch(() => {
          this.btnLoading = false
          this.$emit('submitCatch')
        })
      } else if (this.value === 'diy') {
        this.diySubmit(this.formData).then(res => {
          this.btnLoading = false
          this.$notify({
            title: '提示',
            message: '提交成功',
            type: 'success'
          })
          this.$emit('afterSubmit', res)
          this.show = false
        }).catch(() => {
          this.btnLoading = false
          this.$emit('submitCatch')
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
