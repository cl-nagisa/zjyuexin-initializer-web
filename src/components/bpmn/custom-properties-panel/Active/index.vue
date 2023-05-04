<template>
  <div class="custom-properties-panel-wrapper">
    <el-tabs v-model="activeName" type="border-card" size="mini">
      <el-tab-pane label="常规" name="basic">
        <!-- 常规start -->
        <el-form :model="formData" size="mini" label-position="top" label-suffix="：">
          <el-form-item label="编号">
            <el-input v-model="formData.id" :readonly="mode === 'edit'" @change="handleChange_form($event, 'id')"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="formData.name" @change="handleChange_form($event, 'name')"></el-input>
          </el-form-item>
        </el-form>
        <!-- 常规end -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import commonJS from '../common'

export default {
  mixins: [commonJS],
  data () {
    return {
      formData: {
        id: null,
        name: null
      }
    }
  }
}
</script>

<style lang="sass" scoped>
 @import "../common"
</style>
