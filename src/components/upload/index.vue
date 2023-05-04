<template>
  <el-upload
    class="yx-upload"
    :class="{ 'disabled': disabled }"
    ref="upload"
    :name="fileName"
    :list-type="listType"
    :limit="max"
    multiple
    :accept="accept"
    :auto-upload="false"
    action=""
    :file-list="fileList"
    :disabled="disabled"
    :before-upload="handleUpload_beforeUpload"
    :before-remove="handleUpload_beforeRemove"
    :on-exceed="handleUpload_exceed"
    :on-remove="handleUpload_remove"
    :on-error="handleUpload_error"
    :on-change="handleUpload_change"
    :on-preview="handleUpload_preview"
  >
    <el-button v-if="!disabled" size="small" type="primary">点击上传</el-button>
    <div v-if="!disabled" slot="tip" class="el-upload__tip">
      最多上传{{ max }}份文件，每份文件大小不超过{{ limitSize }}M。
      <template v-if="accept">
        仅支持上传{{ accept }}文件。
      </template>
    </div>
  </el-upload>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 调用uploadFile接口时入参字段的名字，默认files
    fileName: {
      type: String,
      default: 'files'
    },
    // 表单中的字段名，首字母需大写，必传
    filedName: {
      type: String,
      required: true,
      default: ''
    },
    // 文件上传组件的样式类型，text 附件，picture-card 图片，默认text
    listType: {
      type: String,
      default: 'text'
    },
    // 支持哪些类型的文件可以上传，默认不限制，格式：.jpg,.png,.gif
    accept: {
      type: String,
      default: ''
    },
    // 最多支持上传文件的数量，默认1个
    max: {
      type: Number,
      default: 1
    },
    // 单个文件上传最大支持的文件大小，单位M，默认8M
    limitSize: {
      type: Number,
      default: 8
    },
    // 已有文件列表集合，必传
    value: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    // 文件上传接口方法
    uploadFile: {
      type: Function,
      default: () => {
        return true
      }
    }
  },
  data () {
    return {
      fileList: [], // 用于存放当前已经本地上传了的文件
      saveUrls: [], // 用于存放新上传的文件
      deleteIds: [] // 用于存放删除了的文件
    }
  },
  computed: {
    ...mapGetters(['user']),
    // 用于存放新上传的文件的字段名
    saveUrlsName () {
      return `save${this.filedName}Urls`
    },
    // 用于存放删除了的文件的字段名
    deleteIdsName () {
      return `delete${this.filedName}Ids`
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.fileList = val
      }
    },
    fileList (val) {
      this.$emit('input', val)
    },
    // 文件删除有变化时，及时派发出去
    deleteIds: {
      deep: true,
      handler: function (val) {
        this.$emit('del', val, this.deleteIdsName)
      }
    }
  },
  methods: {
    // 文件上传之前的判断，按业务需要，如不做限制，可以去掉此方法
    handleUpload_beforeUpload (file) {
      const isLt1M = (file.size / 1024 / 1024) > this.limitSize
      if (isLt1M) {
        this.$notify({
          title: '提示',
          message: `文件最大支持${this.limitSize}M`,
          type: 'warning'
        })
      }
      return !isLt1M
    },
    // 删除附件之前要做的判断
    handleUpload_beforeRemove (file) {
      // 记得添加用户判断，当前用户只能删除自己上传的附件
      if (file.createUserId && file.createUserId !== this.user.userId) {
        this.$notify({
          title: '提示',
          message: '只能删除你自己上传的附件',
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 上传个数超过最大个数
    handleUpload_exceed () {
      this.$notify({
        title: '提示',
        message: `最多上传${this.max}个文件`,
        type: 'warning'
      })
    },
    // 移除已上传的文件
    handleUpload_remove (file) {
      if (file.url) {
        for (let i = 0; i < this.fileList.length; i++) {
          if (file.url === this.fileList[i].url) {
            this.deleteIds.push(this.fileList[i].id)
            this.$delete(this.fileList, i)
            break
          }
        }
      } else {
        for (let i = 0; i < this.fileList.length; i++) {
          if (file.uuid === this.fileList[i].uuid) {
            this.$delete(this.fileList, i)
            break
          }
        }
      }
    },
    // 已上传的文件列表发生变化
    handleUpload_change (file, fileList) {
      this.fileList = fileList
    },
    // 文件上传失败
    handleUpload_error (response) {
      this.$notify({
        title: '提示',
        message: response.msg,
        type: 'warning'
      })
    },
    // 下载查看已上传的文件
    handleUpload_preview (file) {
      if (file.url) {
        window.open(file.url)
      }
    },
    // 文件手动上传
    async handleUpload_submit () {
      const formData = new FormData()
      let flag = false
      this.fileList.forEach(file => {
        if (!file.id) {
          formData.append('files', file.raw)
          flag = true
        }
      })
      if (flag) {
        const res = await this.uploadFile(formData)
        res.result.forEach(item => {
          this.saveUrls.push(item)
        })
        return {
          list: this.saveUrls,
          name: this.saveUrlsName
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
