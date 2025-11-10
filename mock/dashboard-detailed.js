const Mock = require('mockjs')

// 更真实的每日简报数据
const dailyReportMockData = {
  management: {
    highlights: [
      {
        id: 1,
        category: '政策动向',
        content: '国家发布新一代人工智能创新发展指导意见，明确支持企业建设行业大模型。建议立即组织跨部门会议评估该政策对公司业务的影响，制定响应策略。',
        priority: 'high',
        priorityText: '高',
        createdAt: '2023-11-15T09:00:00Z'
      },
      {
        id: 2,
        category: '竞品动态',
        content: '竞品A公司宣布完成新一轮融资，计划加大AI研发投入，重点布局智能决策支持系统。建议密切关注其产品迭代计划，调整我们的竞品策略。',
        priority: 'medium',
        priorityText: '中',
        createdAt: '2023-11-15T08:30:00Z'
      },
      {
        id: 3,
        category: '销售机会',
        content: '某省交通厅发布智能交通系统升级项目招标公告，预算约1200万元，需求与我司产品高度匹配。建议立即组建专项投标小组，准备相关材料。',
        priority: 'high',
        priorityText: '高',
        createdAt: '2023-11-15T10:15:00Z'
      }
    ]
  },
  market: {
    highlights: [
      {
        id: 4,
        category: '市场趋势',
        content: 'AI市场预计2024年增长35%，企业数字化转型需求激增。建议加大市场推广力度，重点关注制造业和金融业客户。',
        priority: 'high',
        priorityText: '高',
        createdAt: '2023-11-15T09:30:00Z'
      },
      {
        id: 5,
        category: '客户反馈',
        content: '客户满意度调研显示，产品易用性得分提升15%。建议继续优化用户体验，加强客户培训。',
        priority: 'medium',
        priorityText: '中',
        createdAt: '2023-11-15T08:45:00Z'
      }
    ]
  },
  sales: {
    highlights: [
      {
        id: 6,
        category: '销售机会',
        content: '本月新增潜在客户23家，其中5家已进入商务谈判阶段。建议重点关注高价值客户，加快成交节奏。',
        priority: 'high',
        priorityText: '高',
        createdAt: '2023-11-15T09:15:00Z'
      },
      {
        id: 7,
        category: '客户跟进',
        content: '某大型制造企业项目进入最后阶段，预计下周签署合同。建议准备签约材料和后续实施计划。',
        priority: 'high',
        priorityText: '高',
        createdAt: '2023-11-15T10:00:00Z'
      }
    ]
  },
  product: {
    highlights: [
      {
        id: 8,
        category: '技术前沿',
        content: '大语言模型技术取得新突破，推理速度提升40%。建议评估技术升级方案，保持产品竞争力。',
        priority: 'medium',
        priorityText: '中',
        createdAt: '2023-11-15T09:45:00Z'
      },
      {
        id: 9,
        category: '产品迭代',
        content: '新版本产品测试完成，用户反馈良好。建议按计划发布，并准备用户培训材料。',
        priority: 'high',
        priorityText: '高',
        createdAt: '2023-11-15T08:15:00Z'
      }
    ]
  }
}

// 真实的数据指标数据
const dataCardsMockData = [
  {
    id: 1,
    label: '今日信息增量',
    value: '+128 条',
    trend: {
      type: 'success',
      text: '较昨日 ↑ 15%',
      icon: 'el-icon-top'
    },
    progress: 75,
    icon: {
      class: 'form',
      color: 'blue'
    }
  },
  {
    id: 2,
    label: '客户线索',
    value: '24 条',
    trend: {
      type: 'info',
      text: '待跟进'
    },
    progress: 60,
    icon: {
      class: 'user',
      color: 'green'
    }
  },
  {
    id: 3,
    label: '最新论文',
    value: '12篇',
    trend: {
      type: 'warning',
      text: '较上月 ↑ 8.5%',
      icon: 'el-icon-top'
    },
    progress: 45,
    icon: {
      class: 'table',
      color: 'amber'
    }
  },
  {
    id: 4,
    label: '预警监控数',
    value: '5 个',
    trend: {
      type: 'danger',
      text: '竞品重大动态'
    },
    progress: 30,
    icon: {
      class: 'eye',
      color: 'red'
    }
  }
]

// 真实的要闻数据
const newsMockData = [
  {
    id: 1,
    category: '机会',
    title: '国家发布新一代人工智能创新发展指导意见，明确支持企业建设行业大模型',
    source: '新闻消息',
    time: '09:32',
    publishTime: '2023-11-15',
    readTime: '5分钟',
    link: 'http://www.gov.cn/zhengce/content/2023-11/15/content_5823121.htm',
    summary: '国家发改委与科技部联合发布《新一代人工智能创新发展指导意见》，明确提出支持具备条件的企业建设行业大模型，推动AI技术与实体经济深度融合。文件特别强调了在制造、金融、医疗、教育等重点行业的AI应用，并提出将设立专项基金支持相关技术研发与产业化。',
    actionSuggestion: '建议：立即组织战略部、产品部和技术部召开专题会议，评估该政策对公司业务的影响，制定行业大模型建设方案。同时，密切关注后续配套细则和专项基金申请流程，争取成为首批获得政策支持的企业。',
    relatedNews: [
      {
        id: 1,
        title: '国务院关于加快数字经济发展的若干意见解读',
        source: '政策解读',
        time: '3天前'
      },
      {
        id: 2,
        title: '2023中国AI产业发展白皮书发布，市场规模预计突破5000亿',
        source: '行业报告',
        time: '1周前'
      }
    ],
    tags: ['AI', '政策', '大模型'],
    createdAt: '2023-11-15T09:32:00Z',
    updatedAt: '2023-11-15T09:32:00Z'
  },
  {
    id: 2,
    category: '预警',
    title: '竞品A公司宣布完成新一轮融资，计划加大AI研发投入',
    source: '竞品消息',
    time: '08:45',
    publishTime: '2023-11-15',
    readTime: '3分钟',
    link: '#',
    summary: '竞品A公司宣布完成新一轮融资，计划加大AI研发投入，重点布局智能决策支持系统。',
    actionSuggestion: '建议密切关注其产品迭代计划，调整我们的竞品策略。',
    relatedNews: [],
    tags: ['竞品', '融资'],
    createdAt: '2023-11-15T08:45:00Z',
    updatedAt: '2023-11-15T08:45:00Z'
  },
  {
    id: 3,
    category: '机会',
    title: '2023年中国企业数字化转型调研报告发布，AI应用渗透率提升至65%',
    source: '行业动态',
    time: '07:30',
    publishTime: '2023-11-15',
    readTime: '4分钟',
    link: '#',
    summary: '2023年中国企业数字化转型调研报告发布，AI应用渗透率提升至65%',
    actionSuggestion: '建议关注行业数字化转型趋势，优化我们的产品定位。',
    relatedNews: [],
    tags: ['数字化转型', 'AI应用'],
    createdAt: '2023-11-15T07:30:00Z',
    updatedAt: '2023-11-15T07:30:00Z'
  }
]

// 真实的线索数据
const leadsMockData = [
  {
    id: 1,
    channel: '招标网',
    title: '某省交通厅智能交通系统升级项目',
    description: '需求：智能交通管理平台升级，需要AI数据分析和决策支持功能',
    status: 'new',
    priority: 'high',
    owner: {
      id: 1,
      name: '王经理',
      avatar: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/b6b4d71d6ca09f6d61f1d94e76a03b48.png'
    },
    createdAt: '2023-11-15T09:00:00Z',
    updatedAt: '2023-11-15T09:00:00Z'
  },
  {
    id: 2,
    channel: '官网',
    title: '某大型制造企业数字化转型咨询',
    description: '需求：寻求制造业数字化转型整体解决方案，重点关注生产流程优化',
    status: 'new',
    priority: 'medium',
    owner: null,
    createdAt: '2023-11-15T08:30:00Z',
    updatedAt: '2023-11-15T08:30:00Z'
  },
  {
    id: 3,
    channel: '论文库',
    title: '某高校智慧校园建设项目',
    description: '需求：构建校园大数据分析平台，实现学生行为分析和教学质量评估',
    status: 'assigned',
    priority: 'high',
    owner: {
      id: 2,
      name: '李经理',
      avatar: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/b6b4d71d6ca09f6d61f1d94e76a03b48.png'
    },
    createdAt: '2023-11-14T14:20:00Z',
    updatedAt: '2023-11-15T10:15:00Z'
  },
  {
    id: 4,
    channel: '展会',
    title: '某金融机构智能风控系统项目',
    description: '需求：升级现有风控系统，引入AI算法提升风险识别准确率和效率',
    status: 'assigned',
    priority: 'high',
    owner: {
      id: 3,
      name: '张经理',
      avatar: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/b6b4d71d6ca09f6d61f1d94e76a03b48.png'
    },
    createdAt: '2023-11-14T11:45:00Z',
    updatedAt: '2023-11-15T09:30:00Z'
  },
  {
    id: 5,
    channel: '合作伙伴',
    title: '某能源集团智能调度平台项目',
    description: '需求：构建能源生产调度AI决策系统，优化资源配置和生产效率',
    status: 'following',
    priority: 'medium',
    owner: {
      id: 4,
      name: '陈经理',
      avatar: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/b6b4d71d6ca09f6d61f1d94e76a03b48.png'
    },
    createdAt: '2023-11-13T16:10:00Z',
    updatedAt: '2023-11-15T08:45:00Z'
  },
  {
    id: 6,
    channel: '官网',
    title: '某市政府智慧城市大脑项目',
    description: '需求：构建城市综合管理平台，整合多部门数据实现智能决策',
    status: 'following',
    priority: 'high',
    owner: {
      id: 5,
      name: '刘经理',
      avatar: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/b6b4d71d6ca09f6d61f1d94e76a03b48.png'
    },
    createdAt: '2023-11-12T13:25:00Z',
    updatedAt: '2023-11-15T07:20:00Z'
  }
]

module.exports = {
  dailyReportMockData,
  dataCardsMockData,
  newsMockData,
  leadsMockData
}
