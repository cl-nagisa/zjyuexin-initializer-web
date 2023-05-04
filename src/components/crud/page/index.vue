<template>
  <div class="yx-crud-page-wrapper">
    <el-pagination
      class="page-container"
      background
      :layout="layout"
      :current-page="page.pageNum"
      :page-size="page.pageSize"
      :total="page.total"
      @current-change="handleChange_page"
      @size-change="handleChange_size"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'YxCrudPage',
  props: {
    /*
      * 翻页组件需要用到的参数，是个对象
      * 对象包含：
      * page 当前页数；size 每页显示几条数据，默认20条；total 一共有多少条数据
      * 需使用v-model双向绑定
    */
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 翻页功能
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  data () {
    return {
      page: {
        pageNum: 1, // 当前页数
        pageSize: 20, // 每页显示几条数据，默认20条
        total: 0 // 一共有多少条数据
      }
    }
  },
  watch: {
    value: {
      deep: true,
      handler: function (val) {
        this.page = val
      }
    },
    page: {
      deep: true,
      handler: function (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    // 翻页 page 改变
    handleChange_page (page) {
      this.$emit('pageChange', page)
    },
    // 翻页 size 改变
    handleChange_size (size) {
      this.$emit('sizeChange', size)
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
