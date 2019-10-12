import request from '@/utils/request'

/**
 * 获取系统日志列表
 * @param {*} query 查询条件
 */
export function list(query) {
  return request({
    url: '/api/log',
    method: 'get',
    params: query
  })
}
