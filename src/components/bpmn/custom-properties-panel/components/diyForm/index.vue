<template>
  <el-form :model="formData_diy" size="mini" label-position="top" label-suffix="：">
    <el-form-item label="前端组件地址">
      <el-input v-model="formData_diy.componentUrl"></el-input>
    </el-form-item>
    <el-form-item label="是否为第一步环节">
      <el-radio-group v-model="formData_diy.firstStep">
        <el-radio-button :label="0">否</el-radio-button>
        <el-radio-button :label="1">是</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否为可回退环节">
      <el-radio-group v-model="formData_diy.canRollback">
        <el-radio-button :label="0">否</el-radio-button>
        <el-radio-button :label="1">是</el-radio-button>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
import deepcopy from 'deepcopy'

const defaultFormData = {
  id: null,
  procdefId: null,
  flowStepId: null,
  flowStepName: null,
  componentUrl: null,
  firstStep: 0,
  canRollback: 0
}

export default {
  data () {
    return {
      initFlag: true,
      formData_diy: {
        id: null,
        procdefId: null,
        flowStepId: null,
        flowStepName: null,
        componentUrl: null,
        firstStep: 0,
        canRollback: 0
      }
    }
  },
  watch: {
    formData_diy: {
      deep: true,
      handler: function (val) {
        if (this.initFlag === false) {
          this.$emit('handleChange_diySetting', val)
        }
      }
    }
  },
  methods: {
    initData (data) {
      this.initFlag = true
      this.formData_diy = deepcopy(defaultFormData)
      for (const item of Object.keys(data)) {
        this.$set(this.formData_diy, item, data[item])
      }
      this.$emit('handleChange_diySetting', this.formData_diy)
      this.$nextTick(() => {
        this.initFlag = false
      })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
