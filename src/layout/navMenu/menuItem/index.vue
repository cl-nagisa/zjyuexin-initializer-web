<template>
  <div v-if="!item.hidden" class="menuItem-wrapper">
    <!-- 一级目录作为菜单使用 -->
    <template v-if="item.name === '' && item.path === '/'">
      <el-menu-item :index="item.children[0].path" @click="handleClick_menuItem(item.children[0])">
        <icon v-if="item.meta.icon" :icon="item.meta.icon"></icon>
        <span slot="title" class="submenu-title">{{ item.meta.title }}</span>
      </el-menu-item>
    </template>
    <!-- 如果有子菜单，则视为el-submenu目录 -->
    <template v-else-if="item.children && item.children.length > 0">
      <el-submenu :index="item.path" popper-class="yx-el-menu-popup">
        <template slot="title">
          <icon v-if="item.meta.icon" :icon="item.meta.icon"></icon>
          <span slot="title" class="submenu-title">{{ item.meta.title }}</span>
        </template>
        <menu-item v-for="(item, index) in item.children" :key="item.path + index" :item="item"></menu-item>
      </el-submenu>
    </template>
    <!-- 如果没有有子菜单，则视为el-menu-item菜单 -->
    <template v-else>
      <el-menu-item :index="item.path" @click="handleClick_menuItem(item)">
        {{ item.meta.title }}
      </el-menu-item>
    </template>
  </div>
</template>

<script>
import icon from './icon'

export default {
  name: 'menuItem',
  components: { icon },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    // 某一菜单被点击
    handleClick_menuItem (data) {
      this.$store.dispatch('AddTags', {
        meta: data.meta,
        path: data.path
      })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
