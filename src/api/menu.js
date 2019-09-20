import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取菜单列表
 * @param {*} query 查询条件
 */
export function list(query) {
  return request({
    url: '/api/menu',
    method: 'get',
    params: query
  })
}

/**
 *获取所有可用的菜单
 */
export function menus() {
  return request({
    url: '/api/menu/enable',
    method: 'get'
  })
}

/**
 * 新增菜单
 * @param {*} data 数据
 */
export function create(data) {
  return request({
    url: '/api/menu',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 更新菜单
 * @param {*} data 数据
 */
export function update(data) {
  return request({
    url: '/api/menu',
    method: 'put',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 删除菜单
 * @param {*} ids 要删除的行
 */
export function destroy(ids) {
  return request({
    url: '/api/menu',
    method: 'delete',
    params: { ids: ids }
  })
}

