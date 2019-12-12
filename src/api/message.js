import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取留言列表
 * @param {*} query 查询条件
 */
export function list(query) {
  return request({
    url: '/api/message',
    method: 'get',
    params: query
  })
}

/**
 * 回复留言
 * @param {*} data 数据
 */
export function reply(data) {
  return request({
    url: '/api/message/reply',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

/**
 * 删除留言
 * @param {*} ids 要删除的行
 */
export function destroy(ids) {
  return request({
    url: '/api/message',
    method: 'delete',
    params: { ids: ids }
  })
}

