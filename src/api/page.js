import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取单页列表
 * @param {*} query 查询条件
 */
export function list(query) {
  return request({
    url: '/api/page',
    method: 'get',
    params: query
  })
}

/**
 * 新增单页
 * @param {*} data 数据
 */
export function create(data) {
  return request({
    url: '/api/page',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 更新单页
 * @param {*} data 数据
 */
export function update(data) {
  return request({
    url: '/api/page',
    method: 'put',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 删除单页
 * @param {*} ids 要删除的行
 */
export function destroy(ids) {
  return request({
    url: '/api/page',
    method: 'delete',
    params: { ids: ids }
  })
}

