import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取公告列表
 * @param {*} query 查询条件
 */
export function list(query) {
  return request({
    url: '/api/notice',
    method: 'get',
    params: query
  })
}

/**
 * 新增公告
 * @param {*} data 数据
 */
export function create(data) {
  return request({
    url: '/api/notice',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 更新公告
 * @param {*} data 数据
 */
export function update(data) {
  return request({
    url: '/api/notice',
    method: 'put',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 删除公告
 * @param {*} ids 要删除的行
 */
export function destroy(ids) {
  return request({
    url: '/api/notice',
    method: 'delete',
    params: { ids: ids }
  })
}

/**
 * 置顶文章
 * @param {*} id 要置顶的行
 */
export function top(id) {
  return request({
    url: '/api/notice/top',
    method: 'put',
    params: { id: id }
  })
}

