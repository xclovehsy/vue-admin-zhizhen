import request from '@/utils/request'

/**
 * 获取地图数据
 * @param {Object} params - 请求参数
 * @param {string} params.level - 地图级别：province/city/district
 * @param {string} params.date - 查询日期，格式：YYYY-MM-DD，默认为当前日期
 * @param {string} params.type - 数据类型：all/leads/tenders/policies/news，默认all
 * @param {string} params.provinceCode - 省份代码（当level为city或district时必填）
 * @param {string} params.cityCode - 城市代码（当level为district时必填）
 * @param {string} params.timeRange - 时间范围：day/week/month/quarter/year，默认day
 * @returns {Promise}
 */
export function getMapData(params) {
  return request({
    url: '/api/databoard/map/data',
    method: 'get',
    params
  })
}

/**
 * 获取区域详情数据
 * @param {Object} params - 请求参数
 * @param {string} params.region - 区域代码（省份、城市或区县代码）
 * @param {string} params.date - 查询日期，格式：YYYY-MM-DD，默认为当前日期
 * @param {string} params.type - 数据类型：all/leads/tenders/policies/news，默认all
 * @param {string} params.timeRange - 时间范围：day/week/month/quarter/year，默认day
 * @returns {Promise}
 */
export function getRegionDetail(params) {
  return request({
    url: '/api/databoard/map/region',
    method: 'get',
    params
  })
}

/**
 * 获取地图统计数据汇总
 * @param {Object} params - 请求参数
 * @param {string} params.date - 查询日期，格式：YYYY-MM-DD，默认为当前日期
 * @param {string} params.type - 数据类型：all/leads/tenders/policies/news，默认all
 * @param {string} params.timeRange - 时间范围：day/week/month/quarter/year，默认day
 * @returns {Promise}
 */
export function getMapSummary(params) {
  return request({
    url: '/api/databoard/map/summary',
    method: 'get',
    params
  })
}

/**
 * 获取区域趋势数据
 * @param {Object} params - 请求参数
 * @param {string} params.region - 区域代码
 * @param {string} params.type - 数据类型：all/leads/tenders/policies/news，默认all
 * @param {string} params.period - 时间周期：week/month/quarter/year
 * @returns {Promise}
 */
export function getRegionTrend(params) {
  return request({
    url: '/api/databoard/map/trend',
    method: 'get',
    params
  })
}

