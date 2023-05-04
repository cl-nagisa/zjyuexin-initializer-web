<template>
  <eDrawer
    ref="eDrawer"
    v-model="drawerShow"
    title="选择流程环节"
    direction="ltr"
    :modal="false"
    size="50%"
    @submit="submit"
  >
    <template>
      <div class="activeSelectUser-wrapper">
        <!-- 当前已勾选结果项 start -->
        <div class="nextStep-tag-wrapper">
          <template v-for="(item, index) in selectedResFmt">
            <el-tag v-show="item.step === activeName" :key="item.step + item.userId" class="tag" closable @close="removeTag(item)">{{ item.userName }}</el-tag>
          </template>
        </div>
        <!-- 当前已勾选结果项 end -->
        <!-- tab导航条 start -->
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane v-for="(item, index) in list" :key="index" :label="item.step" :name="item.step"></el-tab-pane>
          <!-- 表格 start -->
          <el-table
            v-if="selected_left.step"
            ref="table"
            :data="selected_left.users"
            row-key="userId"
            border
            stripe
            @select="handleChange_tableSelect"
            @select-all="handleChange_tableSelectAll"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="userName" label="审核人" />
            <el-table-column prop="orgName" label="所属部门" />
          </el-table>
          <!-- 表格 start -->
        </el-tabs>
        <!-- tab导航条 end -->
      </div>
    </template>
  </eDrawer>
</template>

<script>
import deepcopy from 'deepcopy'
import eDrawer from '@/components/eDrawer'

export default {
  components: { eDrawer },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      drawerShow: false,
      activeName: null,
      selected_left: {
        step: null,
        users: []
      },
      selectedRes: []
    }
  },
  computed: {
    // 所选结果用tag标签展示用到的数据格式
    selectedResFmt () {
      const res = []
      for (const item of this.selectedRes) {
        for (const user of item.users) {
          res.push({
            step: item.step,
            userName: user.userName,
            userId: user.userId
          })
        }
      }
      return res
    },
    // 所选结果派发给外部表单input输入框显示用的数据格式
    selectedResInput () {
      const res = []
      for (const item of this.selectedResFmt) {
        res.push(item.userName)
      }
      return res.join('，')
    },
    // 所选结果派发给外部表单提交用的数据格式
    selectedResSubmitFmt () {
      const res = deepcopy(this.selectedRes)
      for (const item of res) {
        const users = []
        for (const usersItem of item.users) {
          users.push(usersItem.userId)
        }
        item.users = users
      }
      return res
    }
  },
  watch: {
    // tab切换
    activeName () {
      this.initTableData()
    }
  },
  methods: {
    initData () {
      this.activeName = deepcopy(this.list[0].step)
      this.selected_left = deepcopy(this.list[0])
      this.selectedRes = []
      this.drawerShow = true
    },
    // tag移除
    removeTag (data) {
      for (let i = 0; i < this.selectedRes.length; i++) {
        if (this.selectedRes[i].step === data.step) {
          for (let j = 0; j < this.selectedRes[i].users.length; j++) {
            if (this.selectedRes[i].users[j].userId === data.userId) {
              if (data.step === this.activeName) {
                this.removeTableSelect(this.selectedRes[i].users[j])
                this.$delete(this.selectedRes[i].users, j)
              } else {
                this.$delete(this.selectedRes[i].users, j)
              }
              break
            }
          }
          break
        }
      }
    },
    // 取消勾选表格中的某一行的选中状态
    removeTableSelect (row) {
      this.$refs.table.toggleRowSelection(row, false)
    },
    // 根据已选数据，初始化表格的选中状态
    setDefaultSelect () {
      if (this.selected_left.step) {
        for (const item of this.selectedRes) {
          if (item.step === this.selected_left.step) {
            for (const users of item.users) {
              this.$nextTick(() => {
                this.$refs.table.toggleRowSelection(users, true)
              })
            }
            break
          }
        }
      }
    },
    // 表格数据随tab切换而变化
    initTableData () {
      for (const item of this.list) {
        if (item.step === this.activeName) {
          this.$set(this.selected_left, 'users', [])
          this.$set(this.selected_left, 'step', item.step)
          this.$set(this.selected_left, 'users', item.users)
          this.$nextTick(() => {
            this.setDefaultSelect()
          })
          break
        }
      }
    },
    // 表格的选中发生变化事件
    handleChange_tableSelection (val) {
      const step = deepcopy(this.activeName)
      if (val.length === 0) {
        for (let i = 0; i < this.selectedRes.length; i++) {
          if (this.selectedRes[i].step === step) {
            this.selectedRes.splice(i, 1)
            break
          }
        }
        return false
      }
      let flag = true
      for (const item of this.selectedRes) {
        if (item.step === step) {
          flag = false
          break
        }
      }
      if (flag) {
        this.selectedRes.push({
          step: step,
          users: []
        })
      }
      for (const item of this.selectedRes) {
        if (item.step === step) {
          item.users = val
          break
        }
      }
    },
    // 表格勾选事件
    handleChange_tableSelect (selection) {
      this.handleChange_tableSelection(selection)
    },
    // 表格全选事件
    handleChange_tableSelectAll (selection) {
      this.handleChange_tableSelection(selection)
    },
    // 确认
    submit () {
      this.$emit('selectSuccess', this.selectedResInput, this.selectedResSubmitFmt)
      this.drawerShow = false
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
