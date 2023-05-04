<template>
  <div id="yx-tagMenu" class="tagMenu-wrapper">
    <i
      v-if="navMenuPosition === 'left'"
      class="menu-collapse-switch"
      :class="menuCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
      :title="menuCollapseSwitchTitle"
      @click="menuCollapse =! menuCollapse"
    ></i>
    <ul ref="tags" class="tags">
      <li
        v-for="item in tags"
        :key="item.id"
        :class="{ 'active': item.path === currentPath }"
        @click="routerTo(item.path)"
        @contextmenu.prevent="handleRClick_tags(item, $event)"
      >
        <i class="left-border"></i>
        <i class="right-border"></i>
        {{ item.meta.title }}
        <i v-show="tags.length > 1" class="del el-icon-close" @click.prevent.stop="handleClick_tagDel(item)"></i>
      </li>
    </ul>
    <ul
      v-show="tagsRightClickMenu.show"
      class="tags-rightClick-menu"
      :style="{ 'left': tagsRightClickMenu.left + 'px', 'top': tagsRightClickMenu.top + 'px' }"
    >
      <li @click="handleClick_tagDelOther">关闭其他</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { navMenuPosition } from '@/settings'

export default {
  name: 'TagMenu',
  data () {
    return {
      navMenuPosition,
      menuCollapse: false,
      tagsRightClickMenu: {
        show: false,
        left: null,
        right: null,
        tag: {}
      }
    }
  },
  computed: {
    ...mapGetters(['tags']),
    menuCollapseSwitchTitle () {
      if (this.menuCollapse) {
        return '展开菜单栏'
      } else {
        return '隐藏菜单栏'
      }
    },
    currentPath () {
      return this.$route.path
    }
  },
  watch: {
    menuCollapse (val) {
      this.$emit('menuCollapseChange', val)
    },
    'tagsRightClickMenu.show' (val) {
      if (val) {
        document.body.addEventListener('click', this.tagsRightClickMenuClose)
      } else {
        document.body.removeEventListener('click', this.tagsRightClickMenuClose)
      }
    }
  },
  mounted () {
    this.$refs.tags.addEventListener('mousewheel', this.handleEvent_mousewheel_tags)
  },
  methods: {
    // 使用鼠标滚动控制水平滚动
    handleEvent_mousewheel_tags (event) {
      this.$refs.tags.scrollLeft += -event.wheelDelta
    },
    // 导航栏区域右键打开菜单
    handleRClick_tags (item, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left
      const offsetWidth = this.$el.offsetWidth
      const maxLeft = offsetWidth - menuMinWidth
      const left = e.clientX - offsetLeft + 15
      if (left > maxLeft) {
        this.tagsRightClickMenu.left = maxLeft
      } else {
        this.tagsRightClickMenu.left = left
      }
      if (this.navMenuPosition === 'left') {
        this.tagsRightClickMenu.top = e.clientY
      } else if (this.navMenuPosition === 'top') {
        this.tagsRightClickMenu.top = e.clientY - 56
      }
      this.tagsRightClickMenu.show = true
      this.tagsRightClickMenu.tag = item
    },
    // 删除当前点击的tag
    handleClick_tagDel (item) {
      let delIndex = null
      for (let i = 0; i < this.tags.length; i++) {
        if (this.tags[i].path === item.path) {
          delIndex = i
          break
        }
      }
      // 如果删除的是当前已经激活的导航项
      if (this.currentPath === item.path) {
        if (this.tags[delIndex + 1]) {
          // 如果有下一项，则将下一项作为当前激活项
          this.routerTo(this.tags[delIndex + 1].path)
        } else if (this.tags[delIndex - 1]) {
          // 如果有上一项，则将上一项作为当前激活项
          this.routerTo(this.tags[delIndex - 1].path)
        }
      }
      this.$store.dispatch('DelTags', item)
    },
    // 导航栏区域右键菜单关闭
    tagsRightClickMenuClose () {
      this.tagsRightClickMenu.show = false
    },
    // 关闭其他
    handleClick_tagDelOther () {
      this.$store.dispatch('DelOtherTags', this.tagsRightClickMenu.tag)
      this.routerTo(this.tagsRightClickMenu.tag.path)
    },
    // 页面跳转
    routerTo (path) {
      if (this.currentPath === path) {
        return false
      }
      this.$router.push(path)
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
