const Mock = require('mockjs')
const { 
  dailyReportMockData, 
  dataCardsMockData, 
  newsMockData, 
  leadsMockData 
} = require('./dashboard-detailed')

// 用户偏好设置mock数据
const preferencesData = {
  dailyReportView: 'management',
  dataCardsPeriod: 'day',
  newsCategory: 'all',
  leadsPeriod: 'week',
  notifications: {
    email: true,
    browser: true,
    mobile: false
  }
}

module.exports = [
  // 获取每日简报
  {
    url: '/api/dashboard/daily-report',
    type: 'get',
    response: config => {
      const { view = 'management' } = config.query
      const reportData = dailyReportMockData[view] || dailyReportMockData.management
      return {
        code: 20000,
        message: 'success',
        data: {
          date: new Date().toISOString().split('T')[0],
          view: view,
          highlights: reportData.highlights
        }
      }
    }
  },

  // 更新简报视角
  {
    url: '/api/dashboard/daily-report/view',
    type: 'put',
    response: config => {
      const { view } = config.body
      return {
        code: 20000,
        message: 'success',
        data: {
          view: view,
          updatedAt: new Date().toISOString()
        }
      }
    }
  },

  // 获取数据指标
  {
    url: '/api/dashboard/data-cards',
    type: 'get',
    response: config => {
      const { period = 'day' } = config.query
      return {
        code: 20000,
        message: 'success',
        data: {
          date: new Date().toISOString().split('T')[0],
          period: period,
          cards: dataCardsMockData
        }
      }
    }
  },

  // 获取指标趋势数据
  {
    url: '/api/dashboard/data-cards/trend',
    type: 'get',
    response: config => {
      const { cardId, period = 'week' } = config.query
      const trendData = Mock.mock({
        'trendData|7': [{
          date: '@date("MM-dd")',
          value: '@integer(50, 200)',
          change: '@float(-20, 30, 1, 1)'
        }]
      })
      
      return {
        code: 20000,
        message: 'success',
        data: {
          cardId: parseInt(cardId),
          period: period,
          trendData: trendData.trendData
        }
      }
    }
  },

  // 获取要闻详情 - 放在列表API之前，避免路由冲突
  {
    url: '/api/dashboard/news/([0-9]+)',
    type: 'get',
    response: config => {
      const newsId = parseInt(config.url.split('/').pop())
      const news = newsMockData.find(item => item.id === newsId) || newsMockData[0]
      
      console.log('要闻详情API调用:', { newsId, foundNews: news })
      
      return {
        code: 20000,
        message: 'success',
        data: {
          ...news,
          content: Mock.mock('@cparagraph(10, 20)')
        }
      }
    }
  },

  // 获取要闻列表
  {
    url: '/api/dashboard/news',
    type: 'get',
    response: config => {
      const { page = 1, pageSize = 20, category = 'all', keyword = '' } = config.query
      let filteredNews = newsMockData
      
      // 分类筛选
      if (category !== 'all') {
        filteredNews = filteredNews.filter(news => news.source === category)
      }
      
      // 关键词搜索
      if (keyword) {
        filteredNews = filteredNews.filter(news => 
          news.title.toLowerCase().includes(keyword.toLowerCase())
        )
      }
      
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const paginatedNews = filteredNews.slice(start, end)
      
      return {
        code: 20000,
        message: 'success',
        data: {
          total: filteredNews.length,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          news: paginatedNews
        }
      }
    }
  },

  // 标记要闻为已读
  {
    url: '/api/dashboard/news/([0-9]+)/read',
    type: 'post',
    response: config => {
      const newsId = config.url.split('/').pop()
      return {
        code: 20000,
        message: 'success',
        data: {
          id: newsId,
          readAt: new Date().toISOString()
        }
      }
    }
  },

  // 采纳AI行动建议
  {
    url: '/api/dashboard/news/([0-9]+)/adopt-suggestion',
    type: 'post',
    response: config => {
      const newsId = config.url.split('/').pop()
      const { action, note } = config.body
      return {
        code: 20000,
        message: 'success',
        data: {
          id: newsId,
          action: action,
          note: note,
          adoptedAt: new Date().toISOString()
        }
      }
    }
  },

  // 获取线索列表
  {
    url: '/api/dashboard/leads',
    type: 'get',
    response: config => {
      const { status = 'all', period = 'week', page = 1, pageSize = 20 } = config.query
      let filteredLeads = leadsMockData
      
      // 状态筛选
      if (status !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.status === status)
      }
      
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const paginatedLeads = filteredLeads.slice(start, end)
      
      return {
        code: 20000,
        message: 'success',
        data: {
          total: filteredLeads.length,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          leads: paginatedLeads
        }
      }
    }
  },

  // 获取线索看板数据
  {
    url: '/api/dashboard/leads/board',
    type: 'get',
    response: config => {
      const { period = 'week' } = config.query
      
      // 根据状态分组线索
      const newLeads = leadsMockData.filter(lead => lead.status === 'new')
      const assignedLeads = leadsMockData.filter(lead => lead.status === 'assigned')
      const followingLeads = leadsMockData.filter(lead => lead.status === 'following')
      
      const boardData = {
        period: period,
        columns: [
          {
            status: 'new',
            title: '新获取',
            count: newLeads.length,
            leads: newLeads
          },
          {
            status: 'assigned',
            title: '已分配',
            count: assignedLeads.length,
            leads: assignedLeads
          },
          {
            status: 'following',
            title: '跟进中',
            count: followingLeads.length,
            leads: followingLeads
          }
        ]
      }
      
      return {
        code: 20000,
        message: 'success',
        data: boardData
      }
    }
  },

  // 获取线索趋势数据
  {
    url: '/api/dashboard/leads/trend',
    type: 'get',
    response: config => {
      const { period = 'week', type = 'new' } = config.query
      
      const trendData = {
        period: period,
        type: type,
        trendData: {
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          newLeads: [12, 19, 15, 28, 22, 18, 25],
          convertedLeads: [5, 8, 6, 12, 9, 7, 10]
        }
      }
      
      return {
        code: 20000,
        message: 'success',
        data: trendData
      }
    }
  },

  // 更新线索状态
  {
    url: '/api/dashboard/leads/([0-9]+)/status',
    type: 'put',
    response: config => {
      const leadId = config.url.split('/').pop()
      const { status, ownerId, note } = config.body
      return {
        code: 20000,
        message: 'success',
        data: {
          id: leadId,
          status: status,
          ownerId: ownerId,
          note: note,
          updatedAt: new Date().toISOString()
        }
      }
    }
  },

  // 获取AI洞察
  {
    url: '/api/dashboard/leads/([0-9]+)/insights',
    type: 'get',
    response: config => {
      const leadId = config.url.split('/').pop()
      
      const insights = Mock.mock({
        id: leadId,
        insights: {
          opportunityScore: '@integer(60, 95)',
          riskFactors: '@pick(["预算可能不足", "决策周期较长", "技术门槛较高", "竞争激烈"])',
          suggestions: '@pick(["重点关注技术方案展示", "准备详细ROI分析报告", "建立长期合作关系", "提供定制化解决方案"])',
          competitors: '@pick(["公司A", "公司B", "公司C"])',
          nextSteps: '@pick(["安排技术演示", "准备项目提案", "联系决策人", "制定合作方案"])'
        },
        generatedAt: '@datetime'
      })
      
      return {
        code: 20000,
        message: 'success',
        data: insights
      }
    }
  },

  // 获取用户偏好设置
  {
    url: '/api/dashboard/preferences',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        message: 'success',
        data: preferencesData
      }
    }
  },

  // 更新用户偏好设置
  {
    url: '/api/dashboard/preferences',
    type: 'put',
    response: config => {
      const updatedData = config.body
      return {
        code: 20000,
        message: 'success',
        data: {
          ...preferencesData,
          ...updatedData,
          updatedAt: new Date().toISOString()
        }
      }
    }
  }
]
