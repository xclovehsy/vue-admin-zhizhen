import request from '@/utils/request'

// 获取图表数据
export function getChartData(params) {
  return request({
    url: '/api/databoard/data/getData',
    method: 'get',
    params
  })
}