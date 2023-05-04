// 常用正则及表单校验

// 匹配开头
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 校验url地址
export function validURL (url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

// 是否是纯小写英文字符串
export function validLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

// 是否是纯小写英文字符串 - 表单校验用
export function validateLowerCase (rule, value, callback) {
  const reg = /^[a-z]+$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入小写英文字母'))
    } else {
      callback()
    }
  }
}

// 是否是纯大写英文字符串
export function validUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

// 是否是纯大写英文字符串 - 表单校验用
export function validateUpperCase (rule, value, callback) {
  const reg = /^[A-Z]+$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入大写英文字母'))
    } else {
      callback()
    }
  }
}

// 是否是英文字符串
export function validAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

// 是否是英文字符串 - 表单校验用
export function validateAlphabets (rule, value, callback) {
  const reg = /^[A-Za-z]+$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入英文字母'))
    } else {
      callback()
    }
  }
}

// 是否电子邮箱
export function validEmail (email) {
  const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

// 是否电子邮箱 - 表单校验用
export function validateEmail (rule, value, callback) {
  if (value === '' || value === undefined || value == null) {
    callback()
  }
  const reg = /^([a-zA-Z0-9]+[_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}/gi
  if (reg.test(value) === false) {
    callback(new Error('电子邮箱格式不正确'))
  }
  callback()
}

// 判断是否为空
export function isNull (str) {
  if (str === '' || str === null || str === undefined || str === 'null') {
    return true
  }
  return false
}

// 是否是字符串
export function isString (str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

// 是否是数组
export function isArray (arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

// 是否是IP地址 - 表单用
export function validateIP (rule, value, callback) {
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的IP地址'))
    } else {
      callback()
    }
  }
}

// 是否手机号码或者固话 - 表单用
export function validatePhoneTwo (rule, value, callback) {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的手机号码或者固话号码'))
    } else {
      callback()
    }
  }
}

// 是否固话 - 表单用
export function validateTelephone (rule, value, callback) {
  const reg = /0\d{2}-\d{7,8}/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的固话（格式：区号+号码,如010-1234567）'))
    } else {
      callback()
    }
  }
}

// 是否手机号码
export function validPhone (phone) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(phone)
}

// 是否手机号码 - 表单用
export function validatePhone (rule, value, callback) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的手机号码'))
    } else {
      callback()
    }
  }
}

// 是否身份证号码 - 表单用
export function validateIdNo (rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的身份证号码'))
    } else {
      callback()
    }
  }
}
