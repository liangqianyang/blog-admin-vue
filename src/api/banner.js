import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取轮播列表
 * @param {*} query 查询条件
 */
export function list(query) {
  return request({
    url: '/api/banner',
    method: 'get',
    params: query
  })
}

/**
 * 新增轮播
 * @param {*} data 数据
 */
export function create(data) {
  return request({
    url: '/api/banner',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 更新轮播
 * @param {*} data 数据
 */
export function update(data) {
  return request({
    url: '/api/banner',
    method: 'put',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 删除轮播
 * @param {*} ids 要删除的行
 */
export function destroy(ids) {
  return request({
    url: '/api/banner',
    method: 'delete',
    params: { ids: ids }
  })
}

