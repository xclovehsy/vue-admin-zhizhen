# Dashboard API 使用说明

## 概述

本目录包含了Dashboard模块的所有API接口实现，按照功能模块进行了分类。

## 文件结构

```
src/api/dashboard/
├── index.js              # 统一导出文件
├── dailyReport.js        # 每日AI简报接口
├── dataCards.js          # 核心数据指标卡接口
├── news.js               # 今日全球要闻接口
├── leads.js              # 客户与线索跟踪接口
├── preferences.js        # 用户偏好设置接口
└── README.md             # 使用说明
```

## 使用方法

### 1. 导入API函数

```javascript
// 方式一：按需导入
import { getDailyReport, updateDailyReportView } from '@/api/dashboard/dailyReport'
import { getDataCards, getDataCardsTrend } from '@/api/dashboard/dataCards'

// 方式二：统一导入
import { 
  getDailyReport, 
  updateDailyReportView,
  getDataCards,
  getDataCardsTrend,
  getNewsList,
  getNewsDetail,
  getLeadsBoard,
  getLeadsTrend
} from '@/api/dashboard'
```

### 2. 在组件中使用

```javascript
export default {
  data() {
    return {
      dailyHighlights: [],
      dataCards: [],
      loading: false
    }
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        // 获取每日简报
        const reportResponse = await getDailyReport({
          view: 'management'
        })
        this.dailyHighlights = reportResponse.data.highlights

        // 获取数据指标
        const cardsResponse = await getDataCards({
          period: 'day'
        })
        this.dataCards = cardsResponse.data.cards
      } catch (error) {
        console.error('获取数据失败:', error)
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
    }
  }
}
```

## API 接口列表

### 每日AI简报 (dailyReport.js)

- `getDailyReport(params)` - 获取每日简报
- `updateDailyReportView(data)` - 更新简报视角

### 核心数据指标卡 (dataCards.js)

- `getDataCards(params)` - 获取数据指标
- `getDataCardsTrend(params)` - 获取指标趋势数据

### 今日全球要闻 (news.js)

- `getNewsList(params)` - 获取要闻列表
- `getNewsDetail(id)` - 获取要闻详情
- `markNewsAsRead(id)` - 标记要闻为已读
- `adoptNewsSuggestion(id, data)` - 采纳AI行动建议

### 客户与线索跟踪 (leads.js)

- `getLeadsList(params)` - 获取线索列表
- `getLeadsBoard(params)` - 获取线索看板数据
- `getLeadsTrend(params)` - 获取线索趋势数据
- `updateLeadStatus(id, data)` - 更新线索状态
- `getLeadInsights(id)` - 获取AI洞察

### 用户偏好设置 (preferences.js)

- `getPreferences()` - 获取用户偏好设置
- `updatePreferences(data)` - 更新用户偏好设置

## 错误处理

所有API调用都应该包含适当的错误处理：

```javascript
try {
  const response = await getDailyReport(params)
  // 处理成功响应
} catch (error) {
  console.error('API调用失败:', error)
  this.$message.error('获取数据失败')
}
```

## 响应数据格式

所有API响应都遵循统一的格式：

```javascript
{
  code: 200,           // 状态码
  message: "success",  // 消息
  data: {              // 实际数据
    // ...
  }
}
```

## 注意事项

1. 所有API调用都是异步的，需要使用 `async/await` 或 `.then()`
2. 建议在组件中添加loading状态来提升用户体验
3. 错误处理应该包含用户友好的提示信息
4. 可以根据需要添加请求拦截器和响应拦截器
5. 在生产环境中，建议添加请求缓存和防抖处理

## 开发建议

1. **类型安全**: 如果使用TypeScript，建议为API响应定义接口类型
2. **缓存策略**: 对于不经常变化的数据，可以考虑添加缓存机制
3. **错误重试**: 对于网络错误，可以实现自动重试机制
4. **请求取消**: 对于长时间运行的请求，实现请求取消功能
5. **离线支持**: 考虑添加离线数据支持
