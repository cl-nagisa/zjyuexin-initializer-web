import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import uploader from 'vue-simple-uploader' // 支持文件断点续存的上传组件

import permission from '@/directive/permission' // 权限指令方法
import '@/utils/sso.js' // sso单点登录功能
import dict from '@/utils/dict' // 数据字典

import 'element-ui/lib/theme-chalk/index.css' // element-ui原生样式
import 'normalize.css/normalize.css' // 解决各浏览器默认样式差异的插件
import '@/assets/styles/index.sass' // 全局样式
import '@/assets/fonts/fonts.css' // 本地字体
import '@/assets/icons' // 本地icon图标

import YxCrudSearch from '@/components/crud/search'
import YxCrudTable from '@/components/crud/table'
import YxCrudPage from '@/components/crud/page'
import YxStatus from '@/components/status'

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'medium' })
Vue.use(uploader)
Vue.use(permission)
Vue.use(dict)

Vue.component('YxCrudSearch', YxCrudSearch)
Vue.component('YxCrudTable', YxCrudTable)
Vue.component('YxCrudPage', YxCrudPage)
Vue.component('YxStatus', YxStatus)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
