import request from '@/utils/request'

/**
 * 获取数据指标
 * @param {Object} params - 请求参数
 * @param {string} params.date - 查询日期，默认为今天
 * @param {string} params.period - 时间周期：day/week/month
 * @returns {Promise}
 */
export function getDataCards(params) {
  return request({
    url: '/api/dashboard/data-cards',
    method: 'get',
    params
  })
}

/**
 * 获取指标趋势数据
 * @param {Object} params - 请求参数
 * @param {number} params.cardId - 指标卡ID
 * @param {string} params.period - 时间周期：day/week/month/quarter
 * @param {string} params.startDate - 开始日期
 * @param {string} params.endDate - 结束日期
 * @returns {Promise}
 */
export function getDataCardsTrend(params) {
  return request({
    url: '/api/dashboard/data-cards/trend',
    method: 'get',
    params
  })
}
