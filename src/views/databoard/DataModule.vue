<template>
  <div class="data-module">
    <el-card shadow="hover" :body-style="{ height: '100%', padding: '20px' }">
      <div class="module-content">
        <p>数据展示区域</p>
        <!-- 这里可以添加数据表格、图表等 -->
        <div class="data-board">
          <!-- 新闻消息卡片 -->
          <el-card class="chart-card" shadow="hover" :body-style="{ padding: '5px' }">
            <template #header>
              <div class="card-header">
                <span class="card-title">新闻消息</span>
              </div>
            </template>
            <div class="chart-container">
              <div class="chart-item">
                <line-chart 
                  :chart-data="policyNewsData" 
                  height="160px"
                  title="政策新闻"
                />
              </div>
              <div class="chart-item">
                <line-chart 
                  :chart-data="industryNewsData" 
                  height="160px"
                  title="行业新闻"
                />
              </div>
            </div>
          </el-card>
    
          <!-- 竞品活动卡片 -->
          <el-card class="chart-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span class="card-title">竞品活动</span>
              </div>
            </template>
            <div class="chart-container">
              <div class="chart-item">
                <line-chart 
                  :chart-data="competitorTrendData" 
                  height="160px"
                  title="竞品公司动态变化"
                />
              </div>
              <div class="chart-item">
                <pie-chart 
                  :chart-data="competitorTypeData" 
                  height="160px"
                  title="竞品动态类型分布"
                />
              </div>
            </div>
          </el-card>
    
          <!-- 科技论文卡片 -->
          <el-card class="chart-card" shadow="never" :body-style="{ padding: '15px' }">
            <template #header>
              <div class="card-header">
                <span class="card-title">科技论文</span>
              </div>
            </template>
            <div class="chart-container">
              <div class="chart-item">
                <line-chart 
                  :chart-data="researchTrendData" 
                  height="160px"
                  title="各研究主题数量变化"
                />
              </div>
              <div class="chart-item">
                <pie-chart 
                  :chart-data="researchTopicData" 
                  height="160px"
                  title="论文研究主题统计"
                />
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineChart from '@/components/Dashboard/LineChart.vue'
import PieChart from '@/components/Dashboard/PieChart.vue'

export default {
  name: 'DataModule',
  components: {
    LineChart,
    PieChart
  },
  data() {
    return {
      // 政策新闻数据
      policyNewsData: {
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        seriesData: [
          {
            name: '政策新闻',
            data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
            color: '#5470c6'
          }
        ]
      },
      // 行业新闻数据
      industryNewsData: {
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        seriesData: [
          {
            name: '行业新闻',
            data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
            color: 'green'
          }
        ]
      },
      // 竞品趋势数据
      competitorTrendData: {
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月'],
        seriesData: [
          {
            name: '公司A',
            data: [120, 132, 101, 134, 90, 230],
            color: '#91cc75'
          },
          {
            name: '公司B',
            data: [220, 182, 191, 234, 290, 330],
            color: '#fac858'
          },
          {
            name: '公司C',
            data: [150, 232, 201, 154, 190, 330],
            color: '#ee6666'
          }
        ]
      },
      // 竞品类型数据
      competitorTypeData: {
        seriesData: [
          { value: 335, name: '产品发布' },
          { value: 310, name: '市场活动' },
          { value: 234, name: '技术更新' },
          { value: 135, name: '合作签约' },
          { value: 1548, name: '其他动态' }
        ]
      },
      // 研究趋势数据
      researchTrendData: {
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月'],
        seriesData: [
          {
            name: '人工智能',
            data: [120, 132, 101, 134, 90, 230],
            color: '#73c0de'
          },
          {
            name: '大数据',
            data: [220, 182, 191, 234, 290, 330],
            color: '#3ba272'
          },
          {
            name: '云计算',
            data: [150, 232, 201, 154, 190, 330],
            color: '#fc8452'
          }
        ]
      },
      // 研究主题数据
      researchTopicData: {
        seriesData: [
          { value: 335, name: '机器学习' },
          { value: 310, name: '深度学习' },
          { value: 234, name: '自然语言处理' },
          { value: 135, name: '计算机视觉' },
          { value: 1548, name: '其他主题' }
        ]
      }
    }
  },
  mounted() {
    
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.data-module {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  ::v-deep .el-card__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 !important;
  }
  
  .module-title {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }
}
.module-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  p {
    display: none;
  }
}

.data-board {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px; 
  height: auto;
  overflow-y: auto;
}

.chart-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 160px;  // height1
  margin-bottom: 0;
  
  ::v-deep .el-card__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px !important;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }
}

.chart-container {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  height: 100%;
  min-height: 160px; // height2
}

.chart-item {
  background: #f8f9fa;
  border-radius: 8px; 
  padding: 10px; 
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  h4 {
    margin: 0 0 16px 0;
    text-align: center;
    color: #606266;
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
  }
}

::v-deep .line-chart,
::v-deep .pie-chart {
  width: 100% !important;
  height: 100% !important;
  flex: 1;
  min-height: 140px;
}

// 响应式设计
@media (max-width: 1200px) {
  .chart-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .data-board {
    padding: 16px;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .data-board {
    padding: 12px;
    gap: 12px;
  }
  
  .chart-card {
    ::v-deep .el-card__body {
      padding: 16px !important;
    }
  }
  
  .chart-container {
    gap: 12px;
  }
}

@media (max-width: 576px) {
  .data-board {
    padding: 8px;
    gap: 8px;
  }
  .chart-item {
    padding: 8px;
    h4 {
      font-size: 13px;
      margin-bottom: 12px;
    }
  }
}

// 滚动条样式优化
.data-board::-webkit-scrollbar {
  width: 6px;
}

.data-board::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.data-board::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.data-board::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

// 添加悬停效果提升用户体验
.chart-card:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>