// 常用公共类方法
import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'
import { getStorage } from '@/utils/auth'

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole (value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters.roles
    const permissionRoles = value
    const hasRole = roles.some(role => {
      return permissionRoles.includes(role)
    })
    if (!hasRole) {
      return false
    }
    return true
  } else {
    return false
  }
}

/**
 * 操作权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi (value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters.permissions
    const permissionDatas = value
    const allPermission = '*:*:*'
    const hasPermission = permissions.some(permission => {
      return allPermission === permission || permissionDatas.includes(permission)
    })
    if (!hasPermission) {
      return false
    }
    return true
  } else {
    return false
  }
}

/**
 * 获取url参数
 * @param {string} variable 参数名
 * @returns {string}
 */
export function getUrlQuery (variable) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return ''
}

/**
 * 时间戳转字符传
 * @param {number} time 时间戳
 * @param {string} fmt 格式
 * @returns {string || number}
 */
export function dateFormatFun (time, fmt = 'yyyy-MM-dd') {
  if (typeof (time) === 'number' && !isNaN(time)) {
    return fmtDate(new Date(time), fmt)
  } else {
    return time
  }
}

// 格式化时间
export function fmtDate (date, fmt) {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3) // 季度
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * 日期转时间戳
 * @param {string} date 日期
 * @returns {number}
 */
export function timeStampFormatFun (date) {
  return Date.parse(date)
}

/**
 * 数字转千分位格式或带小数点
 * @param {string || number || null} value 金额
 * @param {boolean} currency 是否转成千分位格式
 * @param {number} decimals 保留小数位数
 * @returns {string}
 */
export function currencyFormat (value, currency = false, decimals = 2) {
  if (value === '' || value === null || value === undefined) {
    return ''
  }
  let bit = ''
  if (currency) {
    bit = ','
  }
  const digitsRE = /(\d{3})(?=\d)/g
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return '0'
  decimals = decimals != null ? decimals : 2
  let stringIfIed = Math.abs(value)
  stringIfIed = parseFloat(stringIfIed).toFixed(decimals + 1)
  stringIfIed = stringIfIed.substring(0, stringIfIed.toString().length - 1)
  const _int = decimals || decimals === 0 ? stringIfIed.slice(0, -1 - decimals) : stringIfIed
  const i = _int.length % 3
  const head = i > 0 ? (_int.slice(0, i) + (_int.length > 3 ? bit : '')) : ''
  const _float = decimals ? stringIfIed.slice(-1 - decimals) : ''
  const sign = value < 0 ? '-' : ''
  if (decimals === 0) return sign + head + _int.slice(i).replace(digitsRE, '$1,')
  return sign + head + _int.slice(i).replace(digitsRE, '$1,') + _float
}

/**
 * 通用下载方法（增加拦截方法）
 * @param {*} data
 * @param {*} url
 */
export function downloadFile (data, url) {
  axios.post(url, data, {
    responseType: 'blob',
    headers: {
      Token: getStorage('token')
    }
  }).then(res => {
    const fileName = decodeURI(res.headers['file-name'])
    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    if (blob.size > 200) {
      if (navigator.msSaveBlob) {
        // ie使用的下载方式
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        // 获取请求返回的response对象中的blob 设置文件类型
        const url = window.URL.createObjectURL(blob)
        // 创建一个临时的url指向blob对象
        // 创建url之后可以模拟对此文件对象的操作
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        // 释放这个临时的对象url
        window.URL.revokeObjectURL(url)
      }
    } else {
      Notification.error({ title: '数据有误' })
    }
  }).catch(() => {
    Notification.error({ title: '接口异常' })
  })
}
