import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取素材列表
 * @param {*} query 查询条件
 */
export function list(query) {
  return request({
    url: '/api/material',
    method: 'get',
    params: query
  })
}

export function getAll() {
  return request({
    url: '/api/material/enable',
    method: 'get'
  })
}

/**
 * 新增素材
 * @param {*} data 数据
 */
export function create(data) {
  return request({
    url: '/api/material',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 更新素材
 * @param {*} data 数据
 */
export function update(data) {
  return request({
    url: '/api/material',
    method: 'put',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 删除素材
 * @param {*} ids 要删除的行
 */
export function destroy(ids) {
  return request({
    url: '/api/material',
    method: 'delete',
    params: { ids: ids }
  })
}

