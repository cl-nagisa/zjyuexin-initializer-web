<template>
  <eDrawer
    ref="eDrawer"
    v-model="drawerShow"
    title="查看"
    size="40%"
    :submitBtn="false"
  >
    <!-- 自定义表单内容 start -->
    <template>
      <!-- 如果是表单，请在外面包一层div，且class名定义为form-wrapper -->
      <div class="form-wrapper">
        <el-form
          ref="form"
          :model="formData"
          :rules="formRules"
          size="small"
          label-position="top"
          disabled
        >
          <el-form-item label="标题" prop="title">
            <el-input v-model="formData.title" />
          </el-form-item>
          <el-form-item label="说明" prop="content">
            <el-input v-model="formData.content" type="textarea" rows="3" />
          </el-form-item>
          <el-form-item label="附件" prop="File">
            <upload
              ref="upload_file"
              v-model="formData.File"
              filedName="File"
              :max="3"
              disabled
            ></upload>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <!-- 自定义表单内容 end -->
  </eDrawer>
</template>

<script>
import deepcopy from 'deepcopy'
import eDrawer from '@/components/eDrawer'
import upload from '@/components/upload'
import { resourcesUrl } from '@/config'
import { details, uploadList } from '../../../api'

const defaultFormData = {
  id: null,
  taskId: null,
  processInstanceId: null,
  title: null,
  content: null,
  File: [],
  saveFileUrls: [],
  deleteFileIds: []
}

export default {
  components: { eDrawer, upload },
  data () {
    return {
      drawerShow: false,
      btnLoading: false,
      drawerMode: 'look',
      formData: {},
      formRules: {
        title: [{ required: true, message: '必填', trigger: 'blur' }],
        content: [{ required: true, message: '必填', trigger: 'blur' }],
        File: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  methods: {
    btnLook (data) {
      this.formData = deepcopy(defaultFormData)
      this.formData.taskId = data.taskId
      this.formData.processInstanceId = data.processInstanceId
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
        this.drawerMode = 'look'
        this.drawerShow = true
      })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
