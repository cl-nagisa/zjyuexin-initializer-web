<template>
  <div class="custom-properties-panel-wrapper">
    <el-tabs v-model="activeName" type="border-card" size="mini">
      <el-tab-pane label="常规" name="basic">
        <!-- 常规start -->
        <el-form :model="formData" size="mini" label-position="top" label-suffix="：">
          <el-form-item label="编号">
            <el-input v-model="formData.id" readonly @change="handleChange_form($event, 'id')"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="formData.name" @change="handleChange_form($event, 'name')"></el-input>
          </el-form-item>
          <el-form-item label="代理人">
            <el-input v-model="formData_activiti.assignee" @change="handleChange_form($event, 'activiti:assignee')"></el-input>
          </el-form-item>
          <el-form-item label="候选用户">
            <el-input v-model="formData_activiti.candidateUsers" @change="handleChange_form($event, 'activiti:candidateUsers')"></el-input>
          </el-form-item>
          <el-form-item label="候选组">
            <el-select v-model="formData_activiti.candidateGroups" multiple style="width: 100%;" @change="handleChange_form($event, 'activiti:candidateGroups')">
              <el-option
                v-for="item in roleOptions"
                :key="item.id"
                :label="item.roleName"
                :value="item.roleKey"
              ></el-option></el-select>
          </el-form-item>
          <el-form-item label="到期时间">
            <el-input v-model="formData_activiti.dueDate" @change="handleChange_form($event, 'activiti:dueDate')"></el-input>
          </el-form-item>
        </el-form>
        <!-- 常规end -->
      </el-tab-pane>
      <el-tab-pane label="监听器" name="listener">
        <!-- 执行监听器start -->
        <el-form :model="formData" size="mini" label-position="top" label-suffix="：">
          <el-form-item label="执行监听">
            <div class="btn-wrapper">
              <el-button plain size="mini" icon="el-icon-minus" @click="handleClick_listenerDel_execution"></el-button>
              <el-button plain size="mini" icon="el-icon-plus" @click="handleClick_listenerAdd_execution"></el-button>
            </div>
            <ul class="listener-list">
              <li
                v-for="(item, index) in formData.executionListener"
                :key="index"
                :class="{ 'current': currentListenerItem_execution === index }"
                @click="handleClick_listenerEdit_execution(item, index)"
              >{{ item.eventType }}：{{ dictFmt(item.listenerType, listenerTypeOption) }}</li>
            </ul>
          </el-form-item>
        </el-form>
        <el-form v-if="currentListenerItem_execution !== null" :model="formData_listener_execution" size="mini" label-position="top" label-suffix="：">
          <el-form-item label="事件类型">
            <el-select v-model="formData_listener_execution.eventType" style="width: 100%;">
              <el-option v-for="item in eventTypeOption_execution" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监听器类型">
            <el-select v-model="formData_listener_execution.listenerType" style="width: 100%;">
              <el-option v-for="item in listenerTypeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="formData_listener_execution.listenerValue"></el-input>
          </el-form-item>
        </el-form>
        <!-- 执行监听器end -->
        <!-- 任务监听器start -->
        <el-form :model="formData" size="mini" label-position="top" label-suffix="：">
          <el-form-item label="任务监听">
            <div class="btn-wrapper">
              <el-button plain size="mini" icon="el-icon-minus" @click="handleClick_listenerDel_task"></el-button>
              <el-button plain size="mini" icon="el-icon-plus" @click="handleClick_listenerAdd_task"></el-button>
            </div>
            <ul class="listener-list">
              <li
                v-for="(item, index) in formData.taskListener"
                :key="index"
                :class="{ 'current': currentListenerItem_task === index }"
                @click="handleClick_listenerEdit_task(item, index)"
              >{{ item.eventType }}：{{ dictFmt(item.listenerType, listenerTypeOption) }}</li>
            </ul>
          </el-form-item>
        </el-form>
        <el-form v-if="currentListenerItem_task !== null" :model="formData_listener_task" size="mini" label-position="top" label-suffix="：">
          <el-form-item label="事件类型">
            <el-select v-model="formData_listener_task.eventType" style="width: 100%;">
              <el-option v-for="item in eventTypeOption_task" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监听器类型">
            <el-select v-model="formData_listener_task.listenerType" style="width: 100%;">
              <el-option v-for="item in listenerTypeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="formData_listener_task.listenerValue"></el-input>
          </el-form-item>
        </el-form>
        <!-- 任务监听器end -->
      </el-tab-pane>
      <el-tab-pane label="配置" name="diy">
        <!-- DIY配置start -->
        <diy-form ref="diyForm" @handleChange_diySetting="handleChange_diySetting"></diy-form>
        <!-- DIY配置end -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import commonJS from '../common'
import diyForm from '../components/diyForm'

export default {
  components: { diyForm },
  mixins: [commonJS],
  data () {
    return {
      formData: {
        id: null,
        name: null,
        executionListener: [],
        taskListener: []
      },
      formData_activiti: {
        assignee: null,
        candidateUsers: null,
        candidateGroups: null,
        dueDate: null
      },
      formData_listener_execution: {
        eventType: null,
        listenerType: null,
        listenerValue: null
      },
      formData_listener_task: {
        eventType: null,
        listenerType: null,
        listenerValue: null
      }
    }
  }
}
</script>

<style lang="sass" scoped>
 @import "../common"
</style>
