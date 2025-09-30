import request from '@/utils/request'

/**
 * 获取每日简报
 * @param {Object} params - 请求参数
 * @param {string} params.date - 查询日期，默认为今天
 * @param {string} params.view - 视角类型：management/market/sales/product
 * @returns {Promise}
 */
export function getDailyReport(params) {
  return request({
    url: '/api/dashboard/daily-report',
    method: 'get',
    params
  })
}

/**
 * 更新简报视角
 * @param {Object} data - 请求数据
 * @param {string} data.view - 视角类型：management/market/sales/product
 * @returns {Promise}
 */
export function updateDailyReportView(data) {
  return request({
    url: '/api/dashboard/daily-report/view',
    method: 'put',
    data
  })
}
