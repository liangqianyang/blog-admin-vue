import request from '@/utils/request'
import qs from 'qs'
/**
 *登陆
 * @param {*} data
 */
export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 退出登录
 */
export function logout() {
  return request({
    url: '/api/logout'
  })
}

export function getAuthMenu() {
  return request({
    url: '/api/nav'
  })
}

/**
 * 获取管理员信息
 * @param {*} token
 */
export function getInfo() {
  return request({
    url: '/api/admin/user',
    method: 'get'
  })
}

/**
 * 获取管理员列表
 * @param {*} query 查询条件
 */
export function list(query) {
  return request({
    url: '/api/user',
    method: 'get',
    params: query
  })
}

/**
 * 新增管理员
 * @param {*} data 数据
 */
export function create(data) {
  return request({
    url: '/api/user',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 更新用户
 * @param {*} data 数据
 */
export function update(data) {
  return request({
    url: '/api/user',
    method: 'put',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 删除用户
 * @param {*} ids 要删除的行
 */
export function destroy(ids) {
  return request({
    url: '/api/user',
    method: 'delete',
    params: { ids: ids }
  })
}
