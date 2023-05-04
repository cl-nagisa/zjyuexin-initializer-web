<template>
  <eDrawer
    ref="eDrawer"
    v-model="drawerShow"
    :title="drawerTitle"
    size="40%"
    :submitBtn="false"
  >
    <!-- 自定义顶部按钮 start -->
    <template slot="header">
      <el-button v-show="step === 1" size="mini" type="primary" :loading="btnLoading" @click="save">保存</el-button>
      <el-button v-show="step !== 1" size="mini" type="primary" :loading="btnLoading" @click="step = 1">上一步</el-button>
      <el-button size="mini" type="primary" :loading="btnLoading" @click="next">下一步</el-button>
    </template>
    <!-- 自定义顶部按钮 end -->
    <!-- 自定义表单内容 start -->
    <template>
      <!-- 如果是表单，请在外面包一层div，且class名定义为form-wrapper -->
      <div class="form-wrapper">
        <el-form
          v-show="step === 1"
          ref="form"
          :model="formData"
          :rules="formRules"
          size="small"
          label-position="top"
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
              :uploadFile="uploadFile"
              @del="handleChange_uploadDel"
            ></upload>
          </el-form-item>
        </el-form>
        <el-form
          v-show="step === 2"
          ref="form2"
          :model="formData2"
          :rules="formRules2"
          size="small"
          label-position="top"
        >
          <el-form-item label="流程环节" prop="nextStepAssignees">
            <el-input v-model="formData2.selectedResInput" :title="formData2.selectedResInput" readonly>
              <el-button slot="append" @click="selectNextStep">选择</el-button>
            </el-input>
          </el-form-item>
          <!-- 根据实际业务需要，选择是否展现"审批批注"字段 -->
          <el-form-item label="审批批注" prop="comment">
            <el-input v-model="formData2.comment" type="textarea" :rows="4"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <!-- 自定义表单内容 end -->
    <!-- 选择下一步流程环节 start -->
    <active-select-user ref="activeSelectUser" :list="activeNextStepOption" @selectSuccess="activeNextStepSelect"></active-select-user>
    <!-- 选择下一步流程环节 end -->
  </eDrawer>
</template>

<script>
import deepcopy from 'deepcopy'
import eDrawer from '@/components/eDrawer'
import upload from '@/components/upload'
import activeSelectUser from '@/components/activeSelectUser'
import { resourcesUrl } from '@/config'
import { edit, details, uploadFile, uploadList, getNextStep, complete, updateFlow } from '../../../api'

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

const defaultFormData2 = {
  selectedResInput: null,
  nextStepAssignees: [],
  comment: null
}

export default {
  components: { eDrawer, upload, activeSelectUser },
  data () {
    return {
      drawerShow: false,
      btnLoading: false,
      drawerMode: 'add',
      step: 1, // 第几步
      formData: {},
      formRules: {
        title: [{ required: true, message: '必填', trigger: 'blur' }],
        content: [{ required: true, message: '必填', trigger: 'blur' }],
        File: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      formData2: {},
      formRules2: {
        nextStepAssignees: [{ required: false, message: '必填', trigger: 'change' }],
        comment: [{ required: false, message: '必填', trigger: 'blur' }]
      },
      activeNextStepOption: [] // 获取流程下一步环节
    }
  },
  computed: {
    drawerTitle () {
      const res = {
        add: '新增',
        edit: '编辑'
      }
      return res[this.drawerMode]
    }
  },
  methods: {
    btnEdit (data) {
      this.step = 1
      this.formData = deepcopy(defaultFormData)
      this.formData2 = deepcopy(defaultFormData2)
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
        this.drawerMode = 'edit'
        this.drawerShow = true
      })
    },
    uploadFile,
    // 提交之前做的事情
    async beforeSubmit () {
      // 如果你的表单中含有附件上传的需求，需要添加如下代码
      // 必需先拿到文件上传的结果
      const res = await this.$refs.upload_file.handleUpload_submit()
      if (res) {
        this.$set(this.formData, res.name, deepcopy(res.list))
      }
      return true
    },
    handleChange_uploadDel (list, name) {
      this.$set(this.formData, name, deepcopy(list))
    },
    // 保存
    save () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.btnLoading = true
          const res = await this.beforeSubmit()
          if (res === false) {
            this.btnLoading = false
            return false
          }
          this.doSave()
        }
      })
    },
    // 保存按钮提交
    doSave () {
      edit(this.formData).then(res => {
        this.btnLoading = false
        this.$notify({
          title: '提示',
          message: '保存成功',
          type: 'success'
        })
        this.$emit('afterSubmit', res)
        this.drawerShow = false
      }).catch(() => {
        this.btnLoading = false
      })
    },
    // 下一步
    next () {
      if (this.step === 1) {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.btnLoading = true
            const res = await this.beforeSubmit()
            if (res === false) {
              this.btnLoading = false
              return false
            }
            this.doStep1()
          }
        })
      } else if (this.step === 2) {
        this.$refs.form2.validate(valid => {
          if (valid) {
            this.btnLoading = true
            this.doStep2()
          }
        })
      }
    },
    // 第一步的提交
    async doStep1 () {
      // 先调用updateFlow接口保存修改后的流程表单数据
      await updateFlow(this.formData)
      this.btnLoading = false
      this.step = 2
      // 上面接口调用成功后，再调用getNextStep接口，获取"获取流程下一步环节"备选项数据
      this.getTaskNextStepOption()
    },
    // 第二步的提交
    doStep2 () {
      const formData = {
        id: this.formData.id,
        taskId: this.formData.taskId,
        processInstanceId: this.formData.processInstanceId,
        ...this.formData2
      }
      // 通过complete接口提交流程到下一个节点
      complete(formData).then(() => {
        this.$notify({
          title: '提示',
          message: '提交成功',
          type: 'success'
        })
        this.btnLoading = false
        this.drawerShow = false
        this.$emit('afterSubmit')
      }).catch(() => {
        this.btnLoading = false
      })
    },
    // 获取流程下一步环节
    getTaskNextStepOption () {
      getNextStep({ taskId: this.formData.taskId, processInstanceId: this.formData.processInstanceId }).then(result => {
        this.activeNextStepOption = result.result
      })
    },
    // 打开选择下一步流程环节弹窗
    selectNextStep () {
      this.$refs.activeSelectUser.initData()
    },
    // 下一步流程环节弹窗选择完点击确认
    activeNextStepSelect (selectedResInput, selectedResSubmitFmt) {
      this.formData2.selectedResInput = deepcopy(selectedResInput)
      this.formData2.nextStepAssignees = deepcopy(selectedResSubmitFmt)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
