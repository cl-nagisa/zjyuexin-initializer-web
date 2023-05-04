<template>
  <div class="navMenu-wrapper" :class="{ 'collapse': menuCollapse, 'navMenuPosition-top': navMenuPosition === 'top' }">
    <el-menu
      class="menu"
      :class="{
        'yx-el-menu-navMenuPosition-left': navMenuPosition === 'left',
        'yx-el-menu-navMenuPosition-top': navMenuPosition === 'top'
      }"
      ref="menu"
      :mode="mode"
      :unique-opened="true"
      :collapse="menuCollapse"
      :default-active="defaultActive"
      router
    >
      <menu-item v-for="(item, index) in menus" :key="item.path + index" :item="item"></menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { navMenuPosition } from '@/settings'
import menuItem from './menuItem'

export default {
  name: 'NavMenu',
  components: { menuItem },
  data () {
    return {
      navMenuPosition,
      menuCollapse: false
    }
  },
  computed: {
    ...mapGetters(['menus']),
    mode () {
      if (this.navMenuPosition === 'left') {
        return 'vertical'
      } else if (this.navMenuPosition === 'top') {
        return 'horizontal'
      } else {
        return 'vertical'
      }
    },
    // 当前激活菜单的index
    defaultActive () {
      return this.$route.path
    }
  },
  mounted () {
    this.initDefaultPage()
  },
  methods: {
    // 初始化时，默认加载第一个菜单类型的页面
    initDefaultPage () {
      if (this.defaultActive === '/') {
        const menu = this.deepLoop(this.menus)
        this.$store.dispatch('AddTags', {
          meta: menu[0].meta,
          path: menu[0].path
        })
        this.$router.push(menu[0].path)
      }
    },
    // 深度遍历，找出所有菜单
    deepLoop (data) {
      const result = []
      data.forEach(item => {
        const map = data => {
          if (data.children && data.children.length > 0) {
            data.children && data.children.forEach(child => map(child))
          } else {
            result.push(data)
          }
        }
        map(item)
      })
      return result
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
