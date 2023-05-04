import { isSM2Encrypt } from '@/config'

const sm2 = require('sm-crypto').sm2 // 获取sm2对象
const cipherMode = 0 // 选择加密策略，0 - C1C2C3，1 - C1C3C2，默认为0
const sysPublicKey = '04A1AEEB6A3A2DD87A9439AAC2E90CF5EC41CE85C6BA98349BE52344951DAE44BCE78FD2A914030F95A7A418D094B9F659BF120488B12DEAFEE58A27D9A4B38DE1' // 系统后台公钥
const uiPrivateKey = '00E51DC7364DE2AB9061677FDFA181CC3438761DEA9E67FC7A19890EC23251DF64' // 前端UI私钥

// 是否开启全局加密
const enableGlobal = isSM2Encrypt

// 必须加密请求体的请求
const mustEncryptRequestBodyUrls = []

// 不加密请求体的请求
const forbiddenEncryptRequestBodyUrls = []

/**
 * 是否为必须加密请求体的请求
 * @param {*} url
 * @returns
 */
function isMustEncryptRequestBodyUrls (url) {
  return mustEncryptRequestBodyUrls.filter(element => element === url).length > 0
}

/**
 * 是否为不加密请求体的请求
 * @param {*} url
 * @returns
 */
function isForbiddenEncryptRequestBodyUrls (url) {
  return forbiddenEncryptRequestBodyUrls.filter(element => element === url).length > 0
}

/**
 * SM2加密string数据
 * @param {string} data 原始数据
 * @returns {string} 加密后数据
 */
function getSm2DataHexByString (data) {
  if (data && (typeof data === 'string') && data.constructor === String) {
    return '04' + sm2.doEncrypt(data, sysPublicKey, cipherMode)
  }
  return ''
}

/**
 * SM2加密object数据
 * @param {Object} data 原始数据
 * @returns {string} 加密后数据
 */
function getSm2DataHexByObject (data) {
  if (data) {
    return '04' + sm2.doEncrypt(JSON.stringify(data), sysPublicKey, cipherMode)
  }
  return ''
}

/**
 * SM2解密数据
 * @param {string} dataHex 原始加密数据
 * @returns {string} 解密后数据
 */
function getSm2DataByString (dataHex) {
  if (dataHex && (typeof dataHex === 'string') && dataHex.constructor === String) {
    dataHex = dataHex.substring(2).toLocaleLowerCase()
    return sm2.doDecrypt(dataHex, uiPrivateKey, cipherMode)
  }
  return ''
}

/**
 * SM2签名
 * @param {string} msg
 * @returns
 */
function doSignature (msg) {
  return sm2.doSignature(msg, uiPrivateKey, { hash: true, der: true })
}

export default {
  enableGlobal,
  mustEncryptRequestBodyUrls,
  forbiddenEncryptRequestBodyUrls,
  isMustEncryptRequestBodyUrls,
  isForbiddenEncryptRequestBodyUrls,
  getSm2DataHexByString,
  getSm2DataHexByObject,
  getSm2DataByString,
  doSignature
}
