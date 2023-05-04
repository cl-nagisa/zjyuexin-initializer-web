<template>
  <div class="codeEdit-wrapper">
    <div ref="aceEditor" class="edit"></div>
  </div>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/snippets/javascript'
import 'ace-builds/src-noconflict/snippets/json'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-javascript'
import { inputJson, outputJson } from './format'

export default {
  props: {
    // 语言模式
    mode: {
      type: String,
      default: 'json'
    },
    // 是否只读
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      aceEditor: null
    }
  },
  methods: {
    initEdit (value = '') {
      this.aceEditor = ace.edit(this.$refs.aceEditor, {
        fontSize: 14, // 编辑器内字体大小
        theme: 'ace/theme/twilight', // 默认设置的主题
        mode: 'ace/mode/' + this.mode, // 默认设置的语言模式
        tabSize: 2, // 制表符设置为2个空格大小
        value: this.setCodeFormat(value),
        wrap: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        readOnly: this.readOnly
      })
      this.aceEditor.getSession().setMode('ace/mode/json')
    },
    // 设置编辑内容
    setValue (value = '') {
      this.aceEditor.setValue(this.setCodeFormat(value))
    },
    // 获取编辑内容
    getValue () {
      return this.getCodeFormat(this.aceEditor.getValue())
    },
    // 外部输入代码时进行格式化处理
    setCodeFormat (value) {
      if (this.mode === 'json') {
        return inputJson(value)
      } else {
        return value
      }
    },
    // 内部输出代码时进行格式化处理
    getCodeFormat (value) {
      if (this.mode === 'json') {
        return outputJson(value)
      } else {
        return value
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
