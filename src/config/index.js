// 是否开启sm2加密
export const isSM2Encrypt = Number(process.env.VUE_APP_isSM2Encrypt)

// 是否开启sso单点登录
export const isSSOEnable = Number(process.env.VUE_APP_isSSOEnable)

// 是否开启微服务环境
export const isMicroserviceEnv = Number(process.env.VUE_APP_isMicroserviceEnv)

// 是否开启https加密
export const ssl = Number(process.env.VUE_APP_ssl)

// oauth服务名称
export const oauthServerURL = isMicroserviceEnv ? '/oauth' : ''

// 根据是否开启https加密，配置前缀
export const protocol = ssl ? 'https://' : 'http://'
const websocketProtocol = ssl ? 'wss://' : 'ws://'

// 后端接口请求地址
export const serverURL = protocol + process.env.VUE_APP_SERVER_URL

// 静态资源前缀地址
export const resourcesUrl = protocol + process.env.VUE_APP_RESOURCES_URL

// webSocket请求地址
const websocketBaseURL = serverURL.replace(protocol, websocketProtocol) + '/websocket/'
export const websocketURL = isMicroserviceEnv ? websocketBaseURL + 'websocket/' : websocketBaseURL
