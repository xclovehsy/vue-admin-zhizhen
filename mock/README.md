# Dashboard Mock 数据说明

## 概述

本目录包含了Dashboard模块的Mock数据实现，用于前端开发和测试。Mock数据模拟了真实的API响应，提供了完整的数据结构和业务逻辑。

## 文件结构

```
mock/
├── index.js                    # Mock入口文件
├── dashboard.js                # Dashboard Mock接口实现
├── dashboard-detailed.js       # 详细Mock数据定义
├── user.js                     # 用户相关Mock
├── table.js                    # 表格相关Mock
├── utils.js                    # Mock工具函数
└── README.md                   # 使用说明
```

## Mock数据特性

### 1. 真实数据模拟
- ✅ 使用真实的业务数据，而非随机生成
- ✅ 保持数据的一致性和逻辑性
- ✅ 支持不同视角的数据展示

### 2. 完整的API覆盖
- ✅ 15个API接口全部覆盖
- ✅ 支持查询参数和分页
- ✅ 支持搜索和筛选功能

### 3. 业务逻辑模拟
- ✅ 不同视角的每日简报数据
- ✅ 线索状态分组和统计
- ✅ 要闻分类和搜索功能
- ✅ 数据指标趋势分析

## 使用方法

### 1. 启动Mock服务

Mock服务会在开发模式下自动启动，无需额外配置。

### 2. 测试API接口

```javascript
// 在浏览器控制台中测试
fetch('/api/dashboard/daily-report?view=management')
  .then(res => res.json())
  .then(data => console.log(data))

// 测试要闻列表
fetch('/api/dashboard/news?page=1&pageSize=10')
  .then(res => res.json())
  .then(data => console.log(data))
```

### 3. 在组件中使用

Mock数据会自动拦截API请求，组件中的API调用会直接返回Mock数据：

```javascript
import { getDailyReport } from '@/api/dashboard'

export default {
  async mounted() {
    // 这个请求会被Mock拦截
    const response = await getDailyReport({ view: 'management' })
    console.log(response.data) // 返回Mock数据
  }
}
```

## Mock数据详情

### 每日AI简报数据

支持4种视角，每种视角提供不同的重点信息：

- **管理层视角**: 政策动向、竞品动态、销售机会
- **市场部视角**: 市场趋势、客户反馈
- **销售部视角**: 销售机会、客户跟进
- **产品部视角**: 技术前沿、产品迭代

### 核心数据指标卡数据

提供4个核心指标：

1. **今日信息增量**: +128 条，较昨日 ↑ 15%
2. **客户线索**: 24 条，待跟进
3. **最新论文**: 12篇，较上月 ↑ 8.5%
4. **预警监控数**: 5 个，竞品重大动态

### 今日全球要闻数据

包含3条真实要闻：

1. **政策新闻**: 国家AI发展指导意见
2. **竞品消息**: 竞品A公司融资动态
3. **行业动态**: 企业数字化转型报告

### 客户与线索跟踪数据

提供6条真实线索，按状态分组：

- **新获取**: 2条线索
- **已分配**: 2条线索  
- **跟进中**: 2条线索

## API接口列表

### 每日AI简报
- `GET /api/dashboard/daily-report` - 获取每日简报
- `PUT /api/dashboard/daily-report/view` - 更新简报视角

### 核心数据指标卡
- `GET /api/dashboard/data-cards` - 获取数据指标
- `GET /api/dashboard/data-cards/trend` - 获取指标趋势数据

### 今日全球要闻
- `GET /api/dashboard/news` - 获取要闻列表
- `GET /api/dashboard/news/{id}` - 获取要闻详情
- `POST /api/dashboard/news/{id}/read` - 标记要闻为已读
- `POST /api/dashboard/news/{id}/adopt-suggestion` - 采纳AI行动建议

### 客户与线索跟踪
- `GET /api/dashboard/leads` - 获取线索列表
- `GET /api/dashboard/leads/board` - 获取线索看板数据
- `GET /api/dashboard/leads/trend` - 获取线索趋势数据
- `PUT /api/dashboard/leads/{id}/status` - 更新线索状态
- `GET /api/dashboard/leads/{id}/insights` - 获取AI洞察

### 用户偏好设置
- `GET /api/dashboard/preferences` - 获取用户偏好设置
- `PUT /api/dashboard/preferences` - 更新用户偏好设置

## 数据格式

所有Mock响应都遵循统一格式：

```javascript
{
  code: 20000,        // 状态码，20000表示成功
  message: "success", // 响应消息
  data: {             // 实际数据
    // ...
  }
}
```

## 自定义Mock数据

### 1. 修改现有数据

编辑 `dashboard-detailed.js` 文件中的数据结构：

```javascript
const dailyReportMockData = {
  management: {
    highlights: [
      {
        id: 1,
        category: '政策动向',
        content: '您的自定义内容...',
        priority: 'high',
        priorityText: '高',
        createdAt: '2023-11-15T09:00:00Z'
      }
    ]
  }
}
```

### 2. 添加新的Mock接口

在 `dashboard.js` 文件中添加新的接口定义：

```javascript
{
  url: '/api/dashboard/your-endpoint',
  type: 'get',
  response: config => {
    return {
      code: 20000,
      message: 'success',
      data: {
        // 您的数据
      }
    }
  }
}
```

## 注意事项

1. **数据一致性**: 确保Mock数据与API文档保持一致
2. **业务逻辑**: Mock数据应该反映真实的业务场景
3. **测试覆盖**: 确保所有API接口都有对应的Mock实现
4. **性能考虑**: Mock数据应该足够轻量，不影响开发性能

## 故障排除

### 1. Mock数据不生效
- 检查 `mock/index.js` 是否正确引入了dashboard模块
- 确认开发服务器已重启
- 检查浏览器控制台是否有错误信息

### 2. 数据格式错误
- 对比API文档确认响应格式
- 检查Mock数据的字段名称和类型
- 验证JSON格式是否正确

### 3. 接口404错误
- 确认URL路径是否正确
- 检查正则表达式匹配规则
- 验证HTTP方法是否匹配

## 总结

Dashboard Mock数据提供了完整的API模拟功能，支持前端开发和测试。通过真实的数据结构和业务逻辑，可以确保前端组件能够正确展示数据，为后续的后端开发提供参考。
