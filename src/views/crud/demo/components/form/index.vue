<template>
  <eFDrawer
    ref="eFDrawer"
    v-model="drawerMode"
    :formData="formData"
    :formRules="formRules"
    :add="add"
    :edit="edit"
    :beforeSubmit="beforeSubmit"
    @afterSubmit="afterSubmit"
  >
    <template slot="form">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" />
      </el-form-item>
      <el-form-item label="说明" prop="content">
        <el-input v-model="formData.content" type="textarea" rows="3" />
      </el-form-item>
      <el-form-item label="附件" prop="File">
        <upload
          v-if="fileUploadType === 1"
          ref="upload_file"
          v-model="formData.File"
          filedName="File"
          :max="3"
          :uploadFile="uploadFile"
          @del="handleChange_uploadDel"
        ></upload>
        <uploader
          v-if="fileUploadType === 2"
          ref="upload_file"
          v-model="formData.File"
          filedName="File"
          :max="3"
          :mergeFile="mergeFile"
          @del="handleChange_uploadDel"
          @uploadStart="uploadStart"
          @uploadError="uploadError"
          @uploadSuccess="uploadSuccess"
        ></uploader>
      </el-form-item>
    </template>
  </eFDrawer>
</template>

<script>
import deepcopy from 'deepcopy'
import eFDrawer from '@/components/eFDrawer'
import upload from '@/components/upload' // 普通上传组件
import uploader from '@/components/uploader' // 断点续传上传组件
import { resourcesUrl } from '@/config'
import { add, edit, details, uploadFile, uploadList, mergeFile } from '../../api'

const defaultFormData = {
  id: null,
  title: null,
  content: null,
  File: [],
  saveFileUrls: [],
  deleteFileIds: []
}

const fileUploadType = 1 // 演示用，1 普通上传组件，2 断点续传上传组件

export default {
  components: { eFDrawer, upload, uploader },
  data () {
    return {
      fileUploadType: fileUploadType,
      drawerMode: '',
      formData: {},
      formRules: {
        title: [{ required: true, message: '必填', trigger: 'blur' }],
        content: [{ required: true, message: '必填', trigger: 'blur' }],
        File: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  methods: {
    btnAdd () {
      this.formData = deepcopy(defaultFormData)
      this.drawerMode = 'add'
    },
    btnEdit (data) {
      this.formData = deepcopy(defaultFormData)
      details({ id: data.id }).then(async (res) => {
        for (const item in defaultFormData) {
          if (res.result[item] !== undefined) {
            this.$set(this.formData, item, res.result[item])
          }
        }
        // 如果有附件类型的业务字段，需要额外查询附件列表，如果有多个上传附件类型的字段，请手动复制下面的uploadList方法重复调用获取
        const resFiles = await uploadList({ businessId: data.id })
        for (const item of resFiles.result) {
          this.formData['File'].push({
            id: item.id,
            createUserId: item.createUserId,
            name: item.fileName,
            url: resourcesUrl + item.fileUrl
          })
        }
        this.drawerMode = 'edit'
      })
    },
    add,
    edit,
    uploadFile,
    mergeFile,
    // 提交之前做的事情
    async beforeSubmit () {
      if (this.fileUploadType === 1) {
        // 如果你的表单中含有附件上传的需求，需要添加如下代码
        // 必需先拿到文件上传的结果
        const res = await this.$refs.upload_file.handleUpload_submit()
        if (res) {
          this.$set(this.formData, res.name, deepcopy(res.list))
        }
        return true
      } else if (this.fileUploadType === 2) {
        // 如果你的表单中含有断点续传的需求，需要添加如下代码
        // 必需先执行断点续传组件中的startUpload方法，并同时返回false，暂停表单提交
        this.$refs.upload_file.startUpload()
        return false
      }
    },
    afterSubmit () {
      this.$emit('afterSubmit')
    },
    handleChange_uploadDel (list, name) {
      this.$set(this.formData, name, deepcopy(list))
    },
    // 断点续传组件中，开始上传了
    uploadStart () {
      // 手动将表单的btnLoading属性置为true
      this.$refs.eFDrawer.btnLoading = true
    },
    // 断点续传组件中，上传失败了
    uploadError () {
      // 手动将表单的btnLoading属性置为true
      this.$refs.eFDrawer.btnLoading = false
    },
    // 断点续传组件中，所有待上传的文件均已上传成功
    uploadSuccess (res) {
      this.$set(this.formData, res.name, deepcopy(res.list))
      // 手动触发表单提交
      this.$refs.eFDrawer.doSubmit()
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
