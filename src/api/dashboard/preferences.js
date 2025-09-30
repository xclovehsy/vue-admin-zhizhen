import request from '@/utils/request'

/**
 * 获取用户偏好设置
 * @returns {Promise}
 */
export function getPreferences() {
  return request({
    url: '/api/dashboard/preferences',
    method: 'get'
  })
}

/**
 * 更新用户偏好设置
 * @param {Object} data - 请求数据
 * @param {string} data.dailyReportView - 每日简报视角
 * @param {string} data.dataCardsPeriod - 数据指标周期
 * @param {string} data.newsCategory - 要闻分类
 * @param {string} data.leadsPeriod - 线索周期
 * @param {Object} data.notifications - 通知设置
 * @param {boolean} data.notifications.email - 邮件通知
 * @param {boolean} data.notifications.browser - 浏览器通知
 * @param {boolean} data.notifications.mobile - 移动端通知
 * @returns {Promise}
 */
export function updatePreferences(data) {
  return request({
    url: '/api/dashboard/preferences',
    method: 'put',
    data
  })
}
