<template>
  <div class="login-wrapper">
    <div class="webName">{{ title }}</div>
    <div class="form">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px">
        <h3 class="title">登录</h3>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-form-item v-if="enableCode" prop="code">
          <el-input v-model="loginForm.code" placeholder="验证码" style="width: 55%;" auto-complete="off"></el-input>
          <div class="code">
            <img :src="codeUrl" @click="getCode">
          </div>
        </el-form-item>
        <el-form-item style="width: 100%;">
          <el-button :loading="loading" type="primary" style="width: 100%;" @click.native.prevent="handleLogin">
            <span v-if="!loading">立即登录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 修改密码 -->
    <modify-pwd v-model="modifyShow"></modify-pwd>
  </div>
</template>

<script>
import { getCodeImg, login } from '@/api/user'
import defaultSettings from '@/settings'

import modifyPwd from './modifyPwd'

export default {
  name: 'Login',
  components: { modifyPwd },
  data () {
    return {
      enableCode: false, // 是否开启图形验证码校验
      modifyShow: false, // 修改密码弹窗
      title: defaultSettings.title,
      loginForm: {
        username: '',
        password: '',
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        code: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
      },
      loading: false,
      codeUrl: ''
    }
  },
  mounted () {
    this.getCode()
  },
  methods: {
    getCode () {
      if (this.enableCode === false) {
        return false
      }
      getCodeImg().then((res) => {
        this.codeUrl = `data:image/png;base64,${res.result.img}`
        this.loginForm.uuid = res.result.uuid
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          login(this.loginForm).then((res) => {
            this.loading = false
            if (res.statusCode === '200') {
              this.$router.replace('/').catch(() => {
                // 为了解决登录成功之后控制台迷之报错，特意加上catch
              })
            } else if (res.statusCode === '800') {
              this.modifyShow = true
            }
          }).catch(() => {
            this.loading = false
            this.getCode()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
