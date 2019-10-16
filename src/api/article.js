import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取文章列表
 * @param {*} query 查询条件
 */
export function list(query) {
  return request({
    url: '/api/article',
    method: 'get',
    params: query
  })
}

/**
 * 新增文章
 * @param {*} data 数据
 */
export function create(data) {
  return request({
    url: '/api/article',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 更新文章
 * @param {*} data 数据
 */
export function update(data) {
  return request({
    url: '/api/article',
    method: 'put',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 删除文章
 * @param {*} ids 要删除的行
 */
export function destroy(ids) {
  return request({
    url: '/api/article',
    method: 'delete',
    params: { ids: ids }
  })
}

/**
 * 上架文章
 * @param {*} ids 要上架的行
 */
export function up(ids) {
  return request({
    url: '/api/article/up',
    method: 'put',
    params: { ids: ids }
  })
}

/**
 * 下架文章
 * @param {*} ids 要下架的行
 */
export function down(ids) {
  return request({
    url: '/api/article/down',
    method: 'put',
    params: { ids: ids }
  })
}
