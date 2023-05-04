<template>
  <div class="yx-uploader-wrapper">
    <uploader
      class="yx-uploader"
      ref="uploader"
      :options="options"
      :autoStart="false"
      :fileStatusText="fileStatusText"
      @files-added="onFilesAdded"
      @file-removed="onFileRemoved"
      @upload-start="uploadStart"
      @file-success="onFileSuccess"
      @file-error="onFileError"
    >
      <uploader-btn v-show="!disabled" :attrs="attrs">点击上传</uploader-btn>
      <uploader-list>
        <template slot-scope="props">
          <ul class="fileList" :class="{ 'disabled': disabled, 'uploading': uploading }">
            <li v-for="file in props.fileList" :key="file.id">
              <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
            </li>
            <template v-for="file in fileList">
              <li class="uploaded" v-if="file.url" :key="file.id" @click="handleUpload_preview(file)">
                <label>{{ file.name }}</label>
                <i class="el-icon-close" @click.stop="handleUpload_remove(file)"></i>
              </li>
            </template>
          </ul>
        </template>
      </uploader-list>
    </uploader>
    <div v-if="!disabled" slot="tip" class="el-upload__tip">
      最多上传{{ max }}份文件。
      <template v-if="accept">
        仅支持上传{{ accept }}文件。
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SparkMD5 from 'spark-md5'
import { getStorage } from '@/utils/auth'
import { upload } from './api'

export default {
  props: {
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 调用upload接口时入参字段的名字，默认file
    fileName: {
      type: String,
      default: 'file'
    },
    // 表单中的字段名，首字母需大写，必传
    filedName: {
      type: String,
      required: true,
      default: ''
    },
    // 最多支持上传文件的数量，默认1个
    max: {
      type: Number,
      default: 1
    },
    // 支持哪些类型的文件可以上传，默认不限制，格式：.jpg,.png,.gif
    accept: {
      type: String,
      default: ''
    },
    // 合并文件的接口方法
    mergeFile: {
      type: Function,
      default: (data) => {}
    },
    // 已有文件列表集合，必传
    value: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      uploading: false,
      fileList: [], // 用于存放当前已经本地上传了的文件
      saveUrls: [], // 用于存放新上传的文件
      deleteIds: [], // 用于存放删除了的文件
      count: 0, // 用于存放当前有几个文件需要上传
      options: {
        target: upload,
        chunkSize: 5 * 1024 * 1000,
        fileParameterName: this.fileName,
        testChunks: true,
        checkChunkUploadedByResponse: function (chunk, message) {
          // 服务器分片校验函数，秒传及断点续传基础
          const objMessage = JSON.parse(message)
          if (objMessage.result.skipUpload) {
            return true
          }
          return (objMessage.result.uploaded || []).indexOf(chunk.offset + 1) >= 0
        },
        headers: {
          token: getStorage('token')
        }
      },
      attrs: {
        accept: this.accept.split(',')
      },
      fileStatusText: {
        success: '上传中',
        error: '上传失败',
        uploading: '上传中',
        paused: '待上传',
        waiting: '等待中'
      }
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
    value (val) {
      this.fileList = val
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
    // 手动开始上传
    startUpload () {
      this.count = 0
      for (const item of this.fileList) {
        if (!item.url) {
          this.count++
          this.computeMD5(item)
        }
      }
    },
    // 添加文件
    onFilesAdded (files) {
      // 检验文件数量是否超过规定数量
      if (this.fileList.length + files.length <= this.max) {
        this.fileList = this.fileList.concat(files)
      } else {
        for (const item of files) {
          item.cancel()
        }
        this.$notify({
          title: '提示',
          message: `最多上传${this.max}个文件`,
          type: 'warning'
        })
      }
    },
    // 上传异常
    onFileError (rootFile, file, response, chunk) {
      this.uploading = false
      this.$notify({
        title: '提示',
        message: '上传失败',
        type: 'warning'
      })
      this.$emit('uploadError')
    },
    // 开始上传了
    uploadStart () {
      this.uploading = true
      this.$emit('uploadStart')
    },
    // 上传文件区块成功后，发起合并请求，拿到文件地址
    onFileSuccess (rootFile, file, response, chunk) {
      const res = JSON.parse(response)
      if (res.result.needMerge) {
        const dom = this.$el.querySelector('.file_' + file.id)
          .querySelector('.uploader-file-status')
          .childNodes[0]
        const param = {
          filename: rootFile.name,
          identifier: rootFile.uniqueIdentifier,
          totalSize: rootFile.size
        }
        this.mergeFile(param).then(res => {
          dom.innerText = '上传成功'
          this.saveUrls.push(res.result)
          if (this.saveUrls.length === this.count) {
            // 当saveUrls等于count时，表示所有待上传的文件均已上传成功，派发事件给外部
            this.uploading = false
            this.$emit('uploadSuccess', {
              list: this.saveUrls,
              name: this.saveUrlsName
            })
          }
        }).catch(() => {
          this.uploading = false
          dom.innerText = '上传失败'
          this.$emit('uploadError')
        })
      }
    },
    // 移除未上传的文件
    onFileRemoved (file) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (file.id === this.fileList[i].id) {
          this.$delete(this.fileList, i)
          break
        }
      }
    },
    // 下载查看已上传的文件
    handleUpload_preview (file) {
      if (file.url) {
        window.open(file.url)
      }
    },
    // 移除已上传的文件
    handleUpload_remove (file) {
      // 记得添加用户判断，当前用户只能删除自己上传的附件
      if (file.createUserId && file.createUserId !== this.user.userId) {
        this.$notify({
          title: '提示',
          message: '只能删除你自己上传的附件',
          type: 'warning'
        })
        return false
      }
      if (file.url) {
        for (let i = 0; i < this.fileList.length; i++) {
          if (file.url === this.fileList[i].url) {
            this.deleteIds.push(this.fileList[i].id)
            this.$delete(this.fileList, i)
            break
          }
        }
      }
    },
    // 计算md5，实现断点续传及秒传
    computeMD5 (file) {
      const fileReader = new FileReader()
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()
      file.pause()
      loadNext()
      spark.append(this.strToArrayBuffer(file.name))
      fileReader.onload = e => {
        spark.append(e.target.result)
        if (currentChunk < chunks) {
          currentChunk++
          loadNext()
        } else {
          const md5 = spark.end()
          this.computeMD5Success(md5, file)
        }
      }
      fileReader.onerror = () => {
        this.$notify({
          title: '提示',
          message: `文件${file.name}读取出错，请检查该文件`,
          type: 'warning'
        })
        file.cancel()
        this.uploading = false
        this.$emit('uploadError')
      }
      function loadNext () {
        const start = currentChunk * chunkSize
        const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },
    // 字符串转ArrayBuffrt
    strToArrayBuffer (str) {
      const array = new Uint8Array(str.length)
      for (let i = 0; i < str.length; i++) {
        array[i] = str.charCodeAt(i)
      }
      return array.buffer
    },
    // 计算md5成功后，开始上传
    computeMD5Success (md5, file) {
      file.uniqueIdentifier = md5
      file.resume()
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
