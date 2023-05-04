module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'dot-notation': 'off',
    'template-curly-spacing': 'off',
    'vue/multi-word-component-names': 'off',
    'array-callback-return': 'off',
    'vue/no-unused-vars': 'off',
    'multiline-ternary': 'off',
    'vue/no-useless-template-attributes': 'off',
    'vue/no-async-in-computed-properties': 'off',
    'vue/no-mutating-props': 'off'
  }
}
