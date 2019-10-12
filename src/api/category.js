import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取分类列表
 * @param {*} query 查询条件
 */
export function list(query) {
  return request({
    url: '/api/category',
    method: 'get',
    params: query
  })
}

/**
 *获取所有可用的分类
 */
export function getEnableCategory() {
  return request({
    url: '/api/category/enable',
    method: 'get'
  })
}

/**
 * 新增分类
 * @param {*} data 数据
 */
export function create(data) {
  return request({
    url: '/api/category',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 更新分类
 * @param {*} data 数据
 */
export function update(data) {
  return request({
    url: '/api/category',
    method: 'put',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 删除分类
 * @param {*} ids 要删除的行
 */
export function destroy(ids) {
  return request({
    url: '/api/category',
    method: 'delete',
    params: { ids: ids }
  })
}

