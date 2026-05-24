/**
 * @description 导出默认网路配置
 **/

// 检测是否在生产环境或已构建环境
// 使用相对路径（同源部署），只在本地开发时使用 localhost
const BACKEND_SERVER_URL = '' // 生产环境使用相对路径
const baseURL = BACKEND_SERVER_URL

const network = {
  // 默认的接口地址
  baseURL,
  // 配后端数据的接收方式application/json;charset=UTF-8或者application/x-www-form-urlencoded;charset=UTF-8
  contentType: 'application/json;charset=UTF-8',
  //消息框消失时间
  messageDuration: 3000,
  //最长请求时间
  requestTimeout: 30000,
  //操作正常code，支持String、Array、int多种类型
  successCode: [200, 0],
  //登录失效code
  invalidCode: 402,
  //无权限code
  noPermissionCode: 401,
  // 后端服务器地址（用于特定部署模式）
  backendServerUrl: BACKEND_SERVER_URL,
}
module.exports = network
