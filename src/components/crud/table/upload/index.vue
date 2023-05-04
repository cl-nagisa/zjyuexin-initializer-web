<template>
  <el-dialog
    :visible.sync="show"
    title="导入"
    width="400px"
    append-to-body
    :before-close="cancel"
  >
    <el-upload
      ref="upload"
      :limit="1"
      accept=".xlsx, .xls"
      drag
      :auto-upload="false"
      :headers="headers"
      :on-change="handleChange_uploadFile"
      :disabled="loading"
      :on-progress="handleProgress_uploadFile"
      :action="url"
      :on-success="handleSuccess_uploadFile"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        <el-link type="info" style="font-size: 12px;" @click="downloadTemplate">下载模板</el-link>
      </div>
      <div class="el-upload__tip" slot="tip" style="color: red;">
        提示：仅允许导入“xls”或“xlsx”格式文件！
      </div>
    </el-upload>
    <div slot="footer">
      <el-button type="primary" size="small" @click="submit">确 定</el-button>
      <el-button size="small" @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { serverURL } from '@/config'
import { getStorage } from '@/utils/auth'
import { downloadFile } from '@/utils/tools'

export default {
  name: 'YxUpload',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    uploadUrl: {
      type: String,
      default: ''
    },
    templateUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      show: false,
      loading: false,
      files: null,
      url: serverURL + this.uploadUrl,
      headers: { Token: getStorage('token') }
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
    // 确认按钮
    submit () {
      if (this.files) {
        this.loading = true
        this.$refs.upload.submit()
      } else {
        this.$notify({
          title: '提示',
          message: '请上传文件',
          type: 'error'
        })
      }
    },
    // 取消按钮
    cancel () {
      this.$refs.upload.clearFiles()
      this.show = false
    },
    // 导出文件变化
    handleChange_uploadFile (file) {
      this.files = file.raw
    },
    // 文件上传中处理
    handleProgress_uploadFile () {
      this.loading = true
    },
    // 文件上传成功
    handleSuccess_uploadFile (response) {
      this.loading = false
      if (response.statusCode === '200') {
        this.$emit('uploadSuccess')
        this.show = false
      } else {
        this.$notify({
          title: '提示',
          message: response.message,
          type: 'error'
        })
      }
    },
    // 下载模板，id先随便写了一个
    downloadTemplate () {
      downloadFile({ id: 1 }, serverURL + this.templateUrl)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
