export default class CustomPalette {
  constructor (create, elementFactory, palette, translate) {
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate
    palette.registerProvider(this)
  }

  getPaletteEntries () {
    const { create, elementFactory, translate } = this

    function createUserTask (event) {
      const shape = elementFactory.createShape({ type: 'bpmn:UserTask' })
      create.start(event, shape)
    }

    return {
      'create.user-task': {
        group: 'activity',
        className: 'bpmn-icon-user-task',
        title: translate('Create UserTask'),
        action: {
          dragstart: createUserTask,
          click: createUserTask
        }
      }
    }
  }
}

CustomPalette.$inject = ['create', 'elementFactory', 'palette', 'translate']
