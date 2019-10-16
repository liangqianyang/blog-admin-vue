import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取标签列表
 * @param {*} query 查询条件
 */
export function list(query) {
  return request({
    url: '/api/label',
    method: 'get',
    params: query
  })
}

/**
 *获取所有的标签
 */
export function getEnableLabel() {
  return request({
    url: '/api/label/enable',
    method: 'get'
  })
}

/**
 * 新增标签
 * @param {*} data 数据
 */
export function create(data) {
  return request({
    url: '/api/label',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 更新标签
 * @param {*} data 数据
 */
export function update(data) {
  return request({
    url: '/api/label',
    method: 'put',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 删除标签
 * @param {*} ids 要删除的行
 */
export function destroy(ids) {
  return request({
    url: '/api/label',
    method: 'delete',
    params: { ids: ids }
  })
}

