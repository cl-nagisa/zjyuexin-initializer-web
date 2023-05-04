import { assign } from 'min-dash'

export default class CustomContextPad {
  constructor (config, contextPad, create, elementFactory, injector, translate, modeling, connect) {
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate
    this.modeling = modeling
    this.connect = connect
    // 自动摆放位置
    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false)
    }
    // 注册工具
    contextPad.registerProvider(this)
  }

  getContextPadEntries (element) {
    const { autoPlace, create, elementFactory, translate, modeling, connect } = this

    function appendAction (type, className, title, options) {
      if (typeof title !== 'string') {
        options = title
        title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') })
      }

      function appendStart (event, element) {
        const shape = elementFactory.createShape(assign({ type: type }, options))
        create.start(event, shape, {
          source: element
        })
      }

      const append = autoPlace
        ? function (event, element) {
          const shape = elementFactory.createShape(assign({ type: type }, options))
          autoPlace.append(element, shape)
        }
        : appendStart

      return {
        group: 'model',
        className: className,
        title: title,
        action: {
          dragstart: appendStart,
          click: append
        }
      }
    }

    function startConnect (event, element) {
      connect.start(event, element)
    }

    function appendUserTask (event, element) {
      if (autoPlace) {
        const shape = elementFactory.createShape({ type: 'bpmn:UserTask' })
        autoPlace.append(element, shape)
      } else {
        appendUserTaskStart(event, element)
      }
    }

    function appendUserTaskStart (event) {
      const shape = elementFactory.createShape({ type: 'bpmn:UserTask' })
      create.start(event, shape, element)
    }

    function removeElement (e) {
      // 点击的时候实现删除功能
      modeling.removeElements([element])
    }
    let actions = {}

    if (element.type === 'label') {
      return actions
    }

    // 有右击菜单的元素类型，右键菜单里的选项放在action
    if (
      element.type === 'bpmn:UserTask' ||
      element.type === 'bpmn:SequenceFlow' ||
      element.type === 'bpmn:StartEvent' ||
      element.type === 'bpmn:ExclusiveGateway' ||
      element.type === 'bpmn:ParallelGateway'
    ) {
      actions = {
        'append.end-event': appendAction('bpmn:EndEvent', 'bpmn-icon-end-event-none', translate('Append EndEvent')),
        'append.gateway': appendAction(
          'bpmn:ExclusiveGateway',
          'bpmn-icon-gateway-xor',
          translate('Append ExclusiveGateway')
        ),
        'append.parallel-gateway': appendAction(
          'bpmn:ParallelGateway',
          'bpmn-icon-gateway-parallel',
          translate('Append ParallelGateway')
        ),
        'append.user-task': {
          group: 'model',
          className: 'bpmn-icon-user-task',
          title: translate('Append') + ' ' + translate('UserTask'),
          action: {
            click: appendUserTask,
            dragstart: appendUserTaskStart
          }
        },
        connect: {
          group: 'connect',
          className: 'bpmn-icon-connection-multi',
          title: translate('Connect using DataInputAssociation'),
          action: {
            click: startConnect,
            dragstart: startConnect
          }
        }
      }
    } else {
      actions = {}
    }
    // 所有节点都有删除
    assign(actions, {
      delete: {
        group: 'edit',
        className: 'bpmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement
        }
      }
    })
    return actions
  }
}

CustomContextPad.$inject = [
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate',
  'modeling',
  'connect'
]
