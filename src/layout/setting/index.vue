<template>
  <div class="setting-wrapper">
    <ul>
      <li><span class="userName" :title="user.userName" @click="toAccount">{{ user.userName.substr(0, 1) }}</span></li>
      <li><i class="el-icon-message" title="我的消息" @click="toMessage"></i><b v-show="messageNum">{{ messageNum > 99 ? '99' : messageNum }}</b></li>
    </ul>
    <ul>
      <li><i class="el-icon-switch-button logout" title="退出" @click="logout"></i></li>
    </ul>

    <!-- 个人中心 start -->
    <account ref="account"></account>
    <!-- 个人中心 end -->

    <!-- 我的消息 start -->
    <eDrawer
      v-model="drawerShow"
      title="我的消息"
      size="50%"
      :submitBtn="false"
    >
      <div class="my-message-wrapper">
        <mesaage @notReadNumReduce="notReadNumReduce"></mesaage>
      </div>
    </eDrawer>
    <!-- 我的消息 end -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createSocket } from '@/utils/websocket'
import { websocketURL } from '@/config'
import { messageUnread } from '@/api/user'
import eDrawer from '@/components/eDrawer'
import account from './account'
import mesaage from './message'

export default {
  name: 'Setting',
  components: { eDrawer, account, mesaage },
  data () {
    return {
      drawerShow: false,
      messageNum: 0
    }
  },
  computed: {
    ...mapGetters(['user', 'token'])
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      messageUnread().then(res => {
        this.messageNum = res.result
        createSocket(websocketURL + this.token)
        // 注册ws监听事件
        window.addEventListener('onmessageWS', this.handleOnmessageWS, false)
      })
    },
    // 点击头像，打开个人中心
    toAccount () {
      this.$refs.account.show = true
    },
    // 打开我的消息
    toMessage () {
      this.drawerShow = true
    },
    // 退出
    logout () {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          window.removeEventListener('onmessageWS', this.handleOnmessageWS, false)
          window.location.href = '/'
        })
      })
    },
    // WS接收消息
    handleOnmessageWS (e) {
      const data = e && e.detail.data
      console.log('收到服务器端WebSocket的消息：' + data)
      if (data === '~client~heartbeat~') {
        return false
      }
      if (JSON.parse(data).constructor === Object) {
        this.notReadNumAdd()
      }
    },
    // 调整未读消息数，减一或清空
    notReadNumReduce (val) {
      if (val === -1) {
        this.messageNum = 0
      } else {
        this.messageNum--
      }
    },
    // 调整未读消息数，加1
    notReadNumAdd () {
      this.messageNum++
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
