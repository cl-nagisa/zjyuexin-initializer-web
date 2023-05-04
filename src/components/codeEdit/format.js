// 输入 - json格式化
export function inputJson (value) {
  value = JSON.stringify(value, null, '\t')
  return value
}

// 输出 - json格式化
export function outputJson (value) {
  value = value ? JSON.parse(value) : []
  return value
}
