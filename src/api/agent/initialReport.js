import request from '@/utils/request'

/**
 * 获取智能体初始报告
 * @returns {Promise}
 */
export function getAgentInitialReport() {
  return request({
    url: '/agent/initial-report',
    method: 'get',
    timeout: 60000
  })
}
