// 请求响应体
const responseBody = {
  message: '',
  timestamp: 0,
  result: null,
  code: 0
}

/**
 * 构造请求响应体
 * @param {Object} data 响应数据
 * @param {String} message 响应信息
 * @param {Number} code 响应状态码
 * @param {Object} headers 响应头
 * @returns { Object } responseBody JSON对象
 */
export const builder = (data, message, code = 0, headers = {}) => {
  responseBody.result = data
  if (message !== undefined && message !== null) {
    responseBody.message = message
  }
  if (code !== undefined && code !== 0) {
    responseBody.code = code
    responseBody._status = code
  }
  if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
    responseBody._headers = headers
  }
  responseBody.timestamp = new Date().getTime()
  return responseBody
}

/**
 * 获取 get 请求参数
 * @param {Object} options 请求参数
 * @returns { Object } JSON对象
 */
export const getQueryParameters = (options) => {
  const url = options.url
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') + '"}')
}

/**
 * 获取 post 请求参数
 * @param { Object } options 请求参数
 * @returns { Object } JSON对象
 */
export const getBody = (options) => {
  return options.body && JSON.parse(options.body)
}
