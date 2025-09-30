import request from '@/utils/request'

/**
 * 获取线索列表
 * @param {Object} params - 请求参数
 * @param {string} params.status - 线索状态：all/new/assigned/following/converted
 * @param {string} params.period - 时间周期：week/month/quarter
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.channel - 渠道筛选
 * @param {string} params.ownerId - 负责人ID
 * @returns {Promise}
 */
export function getLeadsList(params) {
  return request({
    url: '/api/dashboard/leads',
    method: 'get',
    params
  })
}

/**
 * 获取线索看板数据
 * @param {Object} params - 请求参数
 * @param {string} params.period - 时间周期：week/month/quarter
 * @returns {Promise}
 */
export function getLeadsBoard(params) {
  return request({
    url: '/api/dashboard/leads/board',
    method: 'get',
    params
  })
}

/**
 * 获取线索趋势数据
 * @param {Object} params - 请求参数
 * @param {string} params.period - 时间周期：week/month/quarter
 * @param {string} params.type - 数据类型：new/converted
 * @returns {Promise}
 */
export function getLeadsTrend(params) {
  return request({
    url: '/api/dashboard/leads/trend',
    method: 'get',
    params
  })
}

/**
 * 更新线索状态
 * @param {number} id - 线索ID
 * @param {Object} data - 请求数据
 * @param {string} data.status - 新状态：new/assigned/following/converted
 * @param {string} data.ownerId - 负责人ID（可选）
 * @param {string} data.note - 备注信息（可选）
 * @returns {Promise}
 */
export function updateLeadStatus(id, data) {
  return request({
    url: `/api/dashboard/leads/${id}/status`,
    method: 'put',
    data
  })
}

/**
 * 获取AI洞察
 * @param {number} id - 线索ID
 * @returns {Promise}
 */
export function getLeadInsights(id) {
  return request({
    url: `/api/dashboard/leads/${id}/insights`,
    method: 'get'
  })
}
