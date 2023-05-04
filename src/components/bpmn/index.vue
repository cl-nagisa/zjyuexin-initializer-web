<template>
  <div class="bpmn-wrapper">

    <!-- 顶部标题栏 start -->
    <div class="header-wrapper">
      <label>{{ title }}{{ activeName ? '：' + activeName : '' }}</label>
      <template v-if="mode !== 'look'">
        <el-button type="primary" size="mini" title="保存流程图和任务配置，生成新的版本模型" :disabled="btnLoading" @click="btnSubmit">部署</el-button>
        <el-button v-if="mode === 'edit'" type="primary" size="mini" title="仅保存任务配置，不生成新的版本模型" :disabled="btnLoading" @click="btnSave">保存</el-button>
        <el-upload class="btnUpload" action :before-upload="btnUpload"><el-button plain size="mini">导入</el-button></el-upload>
        <el-button plain size="mini" @click="btnDownload">导出</el-button>
      </template>
      <el-button size="mini" @click="btnClose">关闭</el-button>
      <a ref="downloadLink" hidden></a>
    </div>
    <!-- 顶部标题栏 end -->

    <!-- 主区域 start -->
    <div class="main-wrapper">
      <!-- 流程图绘制区域 start -->
      <div class="canvas-wrapper">
        <div class="canvas" :class="{ 'look': mode === 'look' }" ref="canvas"></div>
      </div>
      <!-- 流程图绘制区域 end -->
      <!-- 流程图配置区域 start -->
      <div v-if="mode !== 'look'" class="setting-wrapper">
        <component
          ref="componentDIY"
          :is="componentName"
          :deploymentId="params.deploymentId"
          :mode="mode"
          :element="element"
          :roleOptions="roleOptions"
          :diySetting="diySetting"
          @updateElement="updateElement"
          @updateListener="updateListener"
          @updateCondition="updateCondition"
          @updateDiySetting="updateDiySetting"
          @updateDiySettingByKey="updateDiySettingByKey"
        ></component>
      </div>
      <!-- 流程图配置区域 end -->
      <!-- 自定义作用域插槽区域 start -->
      <slot></slot>
      <!-- 自定义作用域插槽区域 end -->
    </div>
    <!-- 主区域 end -->

  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import BpmnModeler from 'bpmn-js/lib/Modeler'

import { getStorage } from '@/utils/auth'
import { xmlStr } from './js/xmlStr'
import { details, taskDetails, roleList, add, saveTaskSetting, info, highLine } from './api'

import activitiModdleDescriptor from './js/authority.json'
import elementHelper from './js/elementHelper'
import customTranslate from './customTranslate/customTranslate' // 汉化包
import customControlsModule from './customControls' // 自定义工具库

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'

export default {
  name: 'Bpmn',
  props: {
    mode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      btnLoading: false,
      activeName: null,
      bpmnModeler: null, // bpmn实例
      componentName: null, // 元素属性组件名
      element: null, // 当前选择的元素
      params: {},
      componentList: [], // 已注册的元素属性组件
      roleOptions: [], // 用户角色
      diySetting: [] // DIY配置
    }
  },
  computed: {
    title () {
      if (this.mode === 'add') {
        return '新增流程模型'
      } else if (this.mode === 'edit') {
        return '编辑流程模型'
      } else if (this.mode === 'look') {
        return '查看流程进度'
      }
      return ''
    }
  },
  watch: {
    // 监听元素属性组件名，动态注册组件
    componentName (val) {
      if (this.componentList.includes(val)) {
        // 已经注册过的不再重复注册
        return false
      } else {
        try {
          const component = require('./custom-properties-panel/' + val)
          if (component) {
            Vue.component(val, () => import('./custom-properties-panel/' + val))
            this.componentList.push(val)
          }
        } catch (e) {
          console.log(`${val}组件注册失败`)
        }
      }
    }
  },
  methods: {
    async initData (data) {
      if (data) {
        this.params = {
          id: data.id,
          deploymentId: data.deploymentId,
          resourceName: data.resourceName
        }
        this.activeName = data.name
      }
      if (this.model !== 'look') {
        // 获取角色列表
        roleList().then(res => {
          this.roleOptions = res.result
        })
      }
      // 汉化包模块
      const customTranslateModule = {
        translate: ['value', customTranslate]
      }
      this.bpmnModeler = new BpmnModeler({
        container: this.$refs.canvas,
        additionalModules: [
          // 右边的属性栏
          customControlsModule,
          customTranslateModule
        ],
        // 模块拓展，拓展activiti的描述
        moddleExtensions: {
          activiti: activitiModdleDescriptor
        }
      })
      if (this.mode === 'add') {
        await this.createNewDiagram(xmlStr)
      } else if (this.mode === 'edit') {
        axios.post(details, this.params, {
          responseType: 'text',
          headers: {
            Token: getStorage('token')
          }
        }).then(res => {
          this.createNewDiagram(res.data)
        })
        taskDetails({ id: this.params.id }).then(res => {
          this.diySetting = res.result
        })
      } else if (this.mode === 'look') {
        const res = await info(this.params)
        this.params.deploymentId = res.result.deploymentId
        this.params.resourceName = res.result.resourceName
        highLine({ id: res.result.processInstanceId }).then(res => {
          const colorJson = this.getByColor(res.result)
          axios.post(details, this.params, {
            responseType: 'text',
            headers: {
              Token: getStorage('token')
            }
          }).then(res => {
            this.createNewDiagram(res.data)
            setTimeout(() => {
              for (const i in colorJson) {
                this.setColor(colorJson[i], this.bpmnModeler)
              }
            }, 200)
          })
        })
      }
    },
    async createNewDiagram (xml) {
      try {
        await this.bpmnModeler.importXML(xml)
        if (this.mode !== 'look') {
          this.success()
        }
      } catch (e) {
        console.error(e)
      }
    },
    success () {
      const elementRegistry = this.bpmnModeler.get('elementRegistry')
      this.element = elementRegistry.get(this.bpmnModeler._definitions.rootElements[0].id)
      this.componentName = 'Active'
      // 监听元素切换
      this.bpmnModeler.on('selection.changed', e => {
        if (e.newSelection.length === 0) {
          // 没有选中元素，则显示画布配置
          const elementRegistry = this.bpmnModeler.get('elementRegistry')
          this.element = elementRegistry.get(this.bpmnModeler._definitions.rootElements[0].id)
          this.componentName = 'Active'
        } else {
          this.element = e.newSelection[0]
          this.componentName = e.newSelection[0].type.replace('bpmn:', '')
          // 同类型元素切换时手动触发initData
          if (e.oldSelection.length > 0) {
            if (e.newSelection[0].type === e.oldSelection[0].type) {
              this.$nextTick(() => {
                this.$refs.componentDIY.initData()
              })
            }
          }
        }
      })
      this.bpmnModeler.on('shape.removed', e => {
        const elementRegistry = this.bpmnModeler.get('elementRegistry')
        const shape = e.element ? elementRegistry.get(e.element.id) : e.shape
        this.removeDiySetting(shape)
      })
    },
    // 关闭
    btnClose () {
      this.$emit('close')
    },
    // 导入
    btnUpload (file) {
      const reader = new FileReader()
      // 读取File对象中的文本信息，编码格式为UTF-8
      reader.readAsText(file, 'utf-8')
      reader.onload = () => {
        // 读取完毕后将文本信息导入到Bpmn建模器
        this.createNewDiagram(reader.result)
      }
      return false
    },
    // 导出
    async btnDownload () {
      try {
        const res = await this.bpmnModeler.saveXML({ format: true })
        const xml = res.xml
        // 获取文件名
        const name = `${this.getFilename(xml)}.bpmn`
        // 这里就获取到了之前设置的隐藏链接
        const downloadLink = this.$refs.downloadLink
        // 把数据转换为URI，下载要用到的
        const encodedData = encodeURIComponent(xml)
        if (xml) {
          // 将数据给到链接
          downloadLink.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
          // 设置文件名
          downloadLink.download = name
          // 触发点击事件开始下载
          downloadLink.click()
        }
      } catch (e) {
        console.error(e)
      }
    },
    // 部署
    btnSubmit () {
      this.$confirm('确认是否部署该流程?', '部署流程', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await this.bpmnModeler.saveXML({ format: true })
          const xml = res.xml
          if (this.beforeSaveCheck()) {
            this.btnLoading = true
            add({ stringBPMN: xml }).then((res) => {
              this.save(true, res.result).then(() => {
                this.btnLoading = false
                this.$notify({
                  title: '提示',
                  message: '部署成功',
                  type: 'success'
                })
                this.$emit('afterSubmit')
              })
            }).catch(() => {
              this.btnLoading = false
            })
          }
        } catch (e) {
          console.error(e)
        }
      })
    },
    // 保存配置前的校验
    beforeSaveCheck () {
      let flag = 0
      let node = {}
      let firstStepCount = 0
      if (this.diySetting.length === 0) {
        this.$notify({
          title: '提示',
          message: '请对各个用户任务进行配置',
          type: 'warning'
        })
        return false
      }
      for (const item of this.diySetting) {
        if (!item.flowStepName) {
          flag = 1
          node = item
          break
        } else if (!item.componentUrl) {
          flag = 2
          node = item
        }
        if (item.firstStep) {
          firstStepCount++
        }
      }
      if (flag === 1) {
        this.$notify({
          title: '提示',
          message: `${node.flowStepId} 节点名称未填写`,
          type: 'warning'
        })
        return false
      }
      if (flag === 2) {
        this.$notify({
          title: '提示',
          message: `${node.flowStepId} 前端组件地址未填写`,
          type: 'warning'
        })
        return false
      }
      if (firstStepCount === 0) {
        this.$notify({
          title: '提示',
          message: '请配置第一步环节',
          type: 'warning'
        })
        return false
      }
      if (firstStepCount > 1) {
        this.$notify({
          title: '提示',
          message: '第一步环节只能开启一个',
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 保存
    btnSave () {
      if (this.beforeSaveCheck()) {
        this.btnLoading = true
        this.save(false).then(() => {
          this.btnLoading = false
          this.$notify({
            title: '提示',
            message: '保存成功',
            type: 'success'
          })
        }).catch(() => {
          this.btnLoading = false
        })
      }
    },
    // 保存所有DIY配置
    async save (flag, procdefId) {
      if (procdefId) {
        for (const item of this.diySetting) {
          item.procdefId = procdefId
        }
      }
      if (procdefId && this.mode === 'edit') {
        for (const item of this.diySetting) {
          item.id = null
        }
      }
      await saveTaskSetting(this.diySetting)
    },
    getFilename (xml) {
      const start = xml.indexOf('process')
      let filename = xml.substr(start, xml.indexOf('>'))
      filename = filename.substr(filename.indexOf('id') + 4)
      filename = filename.substr(0, filename.indexOf('"'))
      return filename
    },
    // 更新元素属性
    updateElement (element, data) {
      for (const item in data) {
        if (item !== 'id') {
          element[item] = data[item]
        }
      }
      this.bpmnModeler.get('modeling').updateProperties(element, data)
    },
    // 更新元素监听器
    updateListener (element, list, name) {
      const bpmnFactory = this.bpmnModeler.get('bpmnFactory')
      let extensionElements = element.businessObject.get('extensionElements')
      if (!extensionElements) {
        extensionElements = elementHelper.createElement('bpmn:ExtensionElements', null, element, bpmnFactory)
      }
      let exList = extensionElements.get('values')
      exList = exList.filter((item) => item.$type !== `activiti:${name}`)
      for (const item of list) {
        const executionListener = elementHelper.createElement(`activiti:${name}`, null, element, bpmnFactory)
        executionListener['event'] = item.eventType
        executionListener[item.listenerType] = item.listenerValue
        exList.push(executionListener)
      }
      extensionElements.values = exList
      this.bpmnModeler.get('modeling').updateProperties(element, {
        extensionElements: extensionElements
      })
    },
    // 条件表达式监听器，仅SequenceFlow组件使用
    updateCondition (element, val) {
      const bpmnFactory = this.bpmnModeler.get('bpmnFactory')
      let conditionExpression = element.businessObject.get('conditionExpression')
      if (!conditionExpression) {
        conditionExpression = elementHelper.createElement('bpmn:FormalExpression', null, element, bpmnFactory)
      }
      conditionExpression.body = val
      this.bpmnModeler.get('modeling').updateProperties(element, {
        conditionExpression: conditionExpression
      })
    },
    // 更新DIY配置到diySetting中
    updateDiySetting (data) {
      let flag = true
      for (let i = 0; i < this.diySetting.length; i++) {
        if (this.diySetting[i].flowStepId === data.flowStepId) {
          flag = false
          this.$set(this.diySetting, i, data)
          break
        }
      }
      if (flag) {
        this.diySetting.push(data)
      }
    },
    // 当更改常规中的编号和名称时，及时跟你下年diySetting中对应的数据
    updateDiySettingByKey (newVal, key, id) {
      for (let i = 0; i < this.diySetting.length; i++) {
        if (this.diySetting[i].flowStepId === id) {
          this.$set(this.diySetting[i], key, newVal)
          break
        }
      }
    },
    // 删除某一节点时，也删除对应diySetting中的值
    removeDiySetting (shape) {
      if (shape.type === 'bpmn:UserTask') {
        for (let i = 0; i < this.diySetting.length; i++) {
          if (this.diySetting[i].flowStepId === shape.id) {
            this.$delete(this.diySetting, i)
            break
          }
        }
      }
    },
    // 生成流程图进度需要的颜色格式
    getByColor (data) {
      const colorJson = []
      // for (const k in data['highLine']) {
      //   const par = {
      //     name: data['highLine'][k],
      //     stroke: 'green',
      //     fill: 'green'
      //   };
      //   colorJson.push(par)
      // }
      // for (const k in data['highPoint']) {
      //   const par = {
      //     name: data['highPoint'][k],
      //     stroke: 'gray',
      //     fill: '#eae9e9'
      //   }
      //   colorJson.push(par)
      // }
      // for (const k in data['iDo']) {
      //   const par = {
      //     name: data['iDo'][k],
      //     stroke: 'green',
      //     fill: '#a3d68e'
      //   }
      //   colorJson.push(par)
      // }
      for (const k in data['waitingToDo']) {
        const par = {
          name: data['waitingToDo'][k],
          stroke: '#fff',
          fill: '#ee2424'
        }
        colorJson.push(par)
      }
      return colorJson
    },
    // 根据流程图进度颜色JSON，修改流程图
    setColor (json, bpmnModeler) {
      const modeling = bpmnModeler.get('modeling')
      const elementRegistry = bpmnModeler.get('elementRegistry')
      const elementToColor = elementRegistry.get(json.name)
      if (elementToColor) {
        modeling.setColor([elementToColor], {
          stroke: json.stroke,
          fill: json.fill
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
