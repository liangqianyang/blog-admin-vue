import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取角色列表
 * @param {*} query 查询条件
 */
export function list(query) {
  return request({
    url: '/api/role',
    method: 'get',
    params: query
  })
}

/**
 *获取所有可用的角色
 */
export function roles() {
  return request({
    url: '/api/role/enable',
    method: 'get'
  })
}

/**
 * 获取角色信息
 */
export function role_info(id) {
  return request({
    url: '/api/role/info',
    method: 'get',
    params: { id: id }
  })
}

/**
 * 新增角色
 * @param {*} data 数据
 */
export function create(data) {
  return request({
    url: '/api/role',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 更新角色
 * @param {*} data 数据
 */
export function update(data) {
  return request({
    url: '/api/role',
    method: 'put',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 删除角色
 * @param {*} ids 要删除的行
 */
export function destroy(ids) {
  return request({
    url: '/api/role',
    method: 'delete',
    params: { ids: ids }
  })
}

