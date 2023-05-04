import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'

import 'nprogress/nprogress.css'

import { getStorage } from '@/utils/auth'
import store from '@/store'
import { systemRoutes } from './system'
import { yourRoutes } from './your'

Vue.use(VueRouter)
NProgress.configure({ showSpinner: false })

const whiteList = ['/login']
const routes = [...systemRoutes, ...yourRoutes]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.query.token) {
    store.dispatch('Login', to.query.token)
  }
  NProgress.start()
  if (getStorage('token')) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      // 判断是否已有用户信息
      if (store.getters.user.userName) {
        next()
      } else {
        store.dispatch('GetInfo').then(() => {
          store.dispatch('GetMenus').then((res) => {
            res.forEach(item => {
              router.addRoute(item)
            })
            next({ ...to, replace: true })
          })
        })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
