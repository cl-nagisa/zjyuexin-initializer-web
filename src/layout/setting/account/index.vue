<template>
  <yx-dialog v-model="show" title="个人中心" width="700px" @open="dialogOpen" @close="dialogClose">
    <div class="account-wrapper">
      <div class="userInfo">
        <ul>
          <li><label>用户姓名</label><span>{{ user.userName }}</span></li>
          <li><label>所属部门</label><span>{{ user.orgName }}</span></li>
        </ul>
      </div>
      <div v-if="show" class="setting">
        <el-tabs v-model="currentTag" type="card">
          <el-tab-pane label="用户资料" name="info">
            <el-form ref="form_info" :model="formInfo" :rules="rulesInfo" size="small" label-width="90px">
              <el-form-item label="用户姓名" prop="userName">
                <el-input v-model="formInfo.userName" maxlength="20" style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-button :loading="btnLoading" size="mini" type="primary" @click="submit_info">提交</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="pwd">
            <el-form ref="form_pwd" :model="formPwd" :rules="rulesPwd" size="small" label-width="90px">
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="formPwd.oldPassword" type="password" maxlength="16" auto-complete="on" style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="formPwd.newPassword" type="password" maxlength="16" auto-complete="on" style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="formPwd.confirmPassword" type="password" maxlength="16" auto-complete="on" style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-button :loading="btnLoading" size="mini" type="primary" maxlength="16" @click="submit_pwd">提交</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div slot="footer"></div>
  </yx-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { editUser, editPwd } from '@/api/user'
import yxDialog from '@/components/dialog'

export default {
  name: 'Account',
  components: { yxDialog },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formPwd.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      show: false,
      currentTag: 'info',
      btnLoading: false,
      formInfo: {
        id: null,
        userName: null
      },
      rulesInfo: {
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      formPwd: {
        userId: null,
        oldPassword: null,
        newPassword: null,
        confirmPassword: null
      },
      rulesPwd: {
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
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    initData () {
      for (const item of Object.keys(this.formInfo)) {
        this.formInfo[item] = this.user[item]
      }
      this.formPwd.userId = this.user.userId
    },
    dialogOpen () {
      this.initData()
    },
    dialogClose () {
      this.$refs['form_info'].clearValidate()
      this.$refs['form_pwd'].clearValidate()
    },
    // 用户资料提交
    submit_info () {
      this.$refs['form_info'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          editUser(this.formInfo)
            .then(() => {
              this.$notify({
                title: '操作成功',
                message: '用户资料已提交',
                type: 'success'
              })
              this.$store.dispatch('GetInfo')
              this.btnLoading = false
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    // 修改密码提交
    submit_pwd () {
      this.$refs['form_pwd'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          editPwd(this.formPwd)
            .then(() => {
              this.$notify({
                title: '操作成功',
                message: '密码修改成功，请重新登录',
                type: 'success',
                duration: 2000,
                onClose: () => {
                  this.$store.dispatch('LogOut').then(() => {
                    window.location.reload()
                  })
                }
              })
              this.$refs['form_pwd'].resetForm()
              this.btnLoading = false
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
