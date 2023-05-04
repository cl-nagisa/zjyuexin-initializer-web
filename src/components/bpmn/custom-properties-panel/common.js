import deepcopy from 'deepcopy'

export default {
  props: {
    // 流程ID
    deploymentId: {
      type: String,
      default: ''
    },
    // 模式，add 新增，edit 编辑
    mode: {
      type: String,
      default: ''
    },
    // 当前元素信息
    element: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 角色
    roleOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    // DIY配置集合
    diySetting: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      initFlag: true, // 初始化数据时的flag
      activeName: 'basic',
      currentListenerItem_execution: null, // 当前高亮的执行监听任务
      currentListenerItem_task: null, // 当前高亮的任务监听任务
      debounceTimer: null, // 防抖定时器
      eventTypeOption_execution: [
        { value: 'start', label: 'start' },
        { value: 'end', label: 'end' }
      ],
      eventTypeOption_task: [
        { value: 'all', label: 'all' },
        { value: 'create', label: 'create' },
        { value: 'assignment', label: 'assignment' },
        { value: 'complete', label: 'complete' },
        { value: 'delete', label: 'delete' }
      ],
      listenerTypeOption: [
        { value: 'expression', label: '表达式' },
        { value: 'class', label: 'Java类' },
        { value: 'delegateExpression', label: '代理表达式' }
      ],
      conditionTypeOption: [
        { value: 'expression', label: '表达式' }
      ]
    }
  },
  watch: {
    'formData.name': {
      handler: function (newVal) {
        this.$emit('updateDiySettingByKey', newVal, 'flowStepName', this.formData.id)
      }
    },
    'formData.executionListener': {
      deep: true,
      handler: function (val) {
        if (this.initFlag) {
          return false
        }
        clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {
          this.$emit('updateListener', this.element, val, 'ExecutionListener')
        }, 500)
      }
    },
    'formData.taskListener': {
      deep: true,
      handler: function (val) {
        if (this.initFlag) {
          return false
        }
        clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {
          this.$emit('updateListener', this.element, val, 'TaskListener')
        }, 500)
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      // 基础属性
      for (const item in this.formData) {
        if (this.element.businessObject[item]) {
          this.$set(this.formData, item, this.element.businessObject[item])
        } else {
          this.$set(this.formData, item, null)
        }
      }
      // 业务属性
      for (const item in this.formData_activiti) {
        if (this.element.businessObject[item]) {
          if (item === 'candidateGroups') {
            this.$set(this.formData_activiti, item, this.element.businessObject[item].split(','))
          } else {
            this.$set(this.formData_activiti, item, this.element.businessObject[item])
          }
        } else {
          this.$set(this.formData_activiti, item, null)
        }
      }
      // 监听器
      this.formData.executionListener = []
      this.formData.taskListener = []
      const extensionElements = this.element.businessObject.get('extensionElements')
      if (extensionElements) {
        const exList = extensionElements.get('values')
        for (const values of exList) {
          let eventType = values.$type.replace('activiti:', '')
          eventType = eventType.substr(0, 1).toLowerCase() + eventType.substr(1)
          const obj = {}
          obj.eventType = values.event
          if (Object.keys(values).includes('class')) {
            obj.listenerType = 'class'
            obj.listenerValue = values.class
          } else if (Object.keys(values).includes('expression')) {
            obj.listenerType = 'expression'
            obj.listenerValue = values.expression
          } else if (Object.keys(values).includes('delegateExpression')) {
            obj.listenerType = 'delegateExpression'
            obj.listenerValue = values.delegateExpression
          } else if (Object.keys(values).includes('create')) {
            obj.listenerType = 'create'
            obj.listenerValue = values.create
          } else if (Object.keys(values).includes('assignment')) {
            obj.listenerType = 'assignment'
            obj.listenerValue = values.assignment
          } else if (Object.keys(values).includes('complete')) {
            obj.listenerType = 'complete'
            obj.listenerValue = values.complete
          } else if (Object.keys(values).includes('delete')) {
            obj.listenerType = 'delete'
            obj.listenerValue = values.delete
          } else if (Object.keys(values).includes('take')) {
            obj.listenerType = 'take'
            obj.listenerValue = values.take
          }
          this.formData[eventType].push(obj)
        }
      }
      // 条件表达式
      this.formData.conditionExpression = null
      const conditionExpression = this.element.businessObject.get('conditionExpression')
      if (conditionExpression) {
        this.formData.conditionExpression = conditionExpression.body
      }
      // 如果当前节点配置组件中有DIY配置选项卡的话
      if (this.$refs.diyForm) {
        let currentItem = {
          procdefId: this.deploymentId,
          flowStepId: this.element.id,
          flowStepName: this.element.businessObject.name || null
        }
        for (const item of this.diySetting) {
          if (item.flowStepId === this.element.id) {
            currentItem = item
            break
          }
        }
        this.$refs.diyForm.initData(currentItem)
      }
      this.initFlag = false
    },
    // 表单中的某一项值变化，及时同步到bpmn中
    handleChange_form (val, key) {
      const data = {}
      if (key === 'activiti:candidateGroups') {
        val = val.join(',')
      }
      data[key] = val
      this.$emit('updateElement', this.element, data)
    },
    // 执行监听 - 新增
    handleClick_listenerAdd_execution () {
      this.currentListenerItem_execution = null
      this.formData.executionListener.push({
        eventType: this.eventTypeOption_execution[0].value,
        listenerType: 'class',
        listenerValue: null
      })
    },
    // 任务监听 - 新增
    handleClick_listenerAdd_task () {
      this.currentListenerItem_task = null
      this.formData.taskListener.push({
        eventType: this.eventTypeOption_task[0].value,
        listenerType: 'class',
        listenerValue: null
      })
    },
    // 执行监听 - 删除
    handleClick_listenerDel_execution () {
      if (this.currentListenerItem_execution !== null) {
        this.formData.executionListener.splice(this.currentListenerItem_execution, 1)
        this.currentListenerItem_execution = null
      }
    },
    // 任务监听 - 删除
    handleClick_listenerDel_task () {
      if (this.currentListenerItem_task !== null) {
        this.formData.taskListener.splice(this.currentListenerItem_task, 1)
        this.currentListenerItem_task = null
      }
    },
    // 执行监听 - 编辑
    handleClick_listenerEdit_execution (row, index) {
      this.formData_listener_execution = row
      this.currentListenerItem_execution = index
    },
    // 任务监听 - 编辑
    handleClick_listenerEdit_task (row, index) {
      this.formData_listener_task = row
      this.currentListenerItem_task = index
    },
    dictFmt (val, dict) {
      let res = ''
      for (const item of dict) {
        if (item.value === val) {
          res = item.label
          break
        }
      }
      return res
    },
    // DIY配置表单发生变化，实时派发更新
    handleChange_diySetting (data) {
      const params = deepcopy(data)
      params.flowStepId = this.element.businessObject.id
      params.flowStepName = this.element.businessObject.name || null
      this.$emit('updateDiySetting', params)
    }
  }
}
