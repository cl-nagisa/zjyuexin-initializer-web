<template>
  <yx-dialog v-model="show" title="您的密码已经过期，请及时重置密码" width="500px" top="30vh" :loading="loading" @submit="submit" @cancel="cancel">
    <el-form class="modify-wrapper" ref="form" :model="form" :rules="rules" size="small" label-width="140px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" maxlength="20" auto-complete="on" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" maxlength="20" auto-complete="on" style="width: 250px;"></el-input>
        <div class="yx-form-tips" style="width: 250px;">密码长度为8-20位，需包含大写字母、小写字母、数字、特殊字符中的两种或以上，不允许有空格</div>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" maxlength="16" auto-complete="on" style="width: 250px;"></el-input>
      </el-form-item>
    </el-form>
  </yx-dialog>
</template>

<script>
import { getInfo, editPwd } from '@/api/user'
import yxDialog from '@/components/dialog'

export default {
  name: 'ModifyPwd',
  components: { yxDialog },
  props: {
    // 显示弹窗，使用v-model双向绑定
    value: {
      type: Boolean
    }
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      show: false,
      loading: false,
      form: {
        userId: null,
        oldPassword: null,
        newPassword: null,
        confirmPassword: null
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,20}$/, message: '请输入正确格式的密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,20}$/, message: '请输入正确格式的密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      if (val) {
        this.initData()
        this.$emit('open')
      } else {
        this.$refs['form'].resetFields()
        this.$emit('close')
      }
      this.$emit('input', val)
    }
  },
  methods: {
    initData () {
      getInfo().then(res => {
        this.form.userId = res.result.user.userId
      })
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          editPwd(this.form).then(() => {
            this.$notify({
              title: '操作成功',
              type: 'success'
            })
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    cancel () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style lang="sass" scoped>
  .modify-wrapper
    margin-top: 20px
</style>
