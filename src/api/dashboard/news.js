import request from '@/utils/request'

/**
 * 获取要闻列表
 * @param {Object} params - 请求参数
 * @param {number} params.page - 页码，默认为1
 * @param {number} params.pageSize - 每页数量，默认为20
 * @param {string} params.category - 分类：all/policy/industry/competitor/tech
 * @param {string} params.keyword - 搜索关键词
 * @param {string} params.date - 查询日期，默认为今天
 * @returns {Promise}
 */
export function getNewsList(params) {
  return request({
    url: '/api/dashboard/news',
    method: 'get',
    params
  })
}

/**
 * 获取要闻详情
 * @param {number} id - 要闻ID
 * @returns {Promise}
 */
export function getNewsDetail(id) {
  return request({
    url: `/api/dashboard/news/${id}`,
    method: 'get'
  })
}

/**
 * 标记要闻为已读
 * @param {number} id - 要闻ID
 * @returns {Promise}
 */
export function markNewsAsRead(id) {
  return request({
    url: `/api/dashboard/news/${id}/read`,
    method: 'post'
  })
}

/**
 * 采纳AI行动建议
 * @param {number} id - 要闻ID
 * @param {Object} data - 请求数据
 * @param {string} data.action - 操作类型：adopt/edit
 * @param {string} data.note - 备注信息
 * @returns {Promise}
 */
export function adoptNewsSuggestion(id, data) {
  return request({
    url: `/api/dashboard/news/${id}/adopt-suggestion`,
    method: 'post',
    data
  })
}
