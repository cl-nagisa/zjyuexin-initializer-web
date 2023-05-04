<template>
  <div class="layout-wrapper">

    <!-- 功能栏 start -->
    <setting></setting>
    <!-- 功能栏 end -->

    <!-- 左侧菜单栏 start -->
    <navMenu v-if="navMenuPosition === 'left'" ref="navMenu"></navMenu>
    <!-- 左侧菜单栏 end -->

    <div class="window-wrapper">
      <!-- 左侧菜单栏 start -->
      <navMenu v-if="navMenuPosition === 'top'" ref="navMenu"></navMenu>
      <!-- 左侧菜单栏 end -->

      <!-- 顶部导航栏 start -->
      <tag-menu @menuCollapseChange="menuCollapseChange"></tag-menu>
      <!-- 顶部导航栏 end -->

      <!-- 主窗口 start -->
      <app-main></app-main>
      <!-- 主窗口 end -->
    </div>

  </div>
</template>

<script>
import { navMenuPosition } from '@/settings'
import setting from './setting' // 功能栏
import navMenu from './navMenu' // 左侧菜单栏
import tagMenu from './tagMenu' // 顶部导航栏
import appMain from './appMain' // 主窗口

export default {
  name: 'Layout',
  components: { setting, navMenu, tagMenu, appMain },
  data () {
    return {
      navMenuPosition
    }
  },
  mounted () {
  },
  methods: {
    // 隐藏、展开菜单栏
    menuCollapseChange (val) {
      this.$refs.navMenu.menuCollapse = val
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
