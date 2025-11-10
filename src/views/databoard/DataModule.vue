<template>
  <div class="data-module">
    <el-card shadow="hover" :body-style="{ height: '100%', padding: '20px' }">
      <div class="module-content">
        <p>数据展示区域</p>
        <!-- 这里可以添加数据表格、图表等 -->
        <div class="data-board">
          <!-- 新闻消息卡片 -->
          <el-card class="chart-card" shadow="hover" :body-style="{ padding: '5px' }">
            <!-- <template #header>
              <div class="card-header">
                <span class="card-title">新闻消息</span>
              </div>
            </template> -->
            <div class="chart-container">
              <div class="chart-item">
                <line-chart
                  :chart-data="policyNewsData"
                  title="新闻消息"
                />
              </div>
            </div>
          </el-card>

          <!-- 竞品活动卡片 -->
          <el-card class="chart-card" shadow="hover">
            <div class="chart-container">
              <div class="chart-item">
                <pie-chart
                  :chart-data="competitorTypeData"
                  title="竞品公司动态"
                />
              </div>
            </div>
          </el-card>

          <!-- 科技论文卡片 -->
          <el-card class="chart-card" shadow="never" :body-style="{ padding: '15px' }">
            <div class="chart-container">
              <div class="chart-item">
                <pie-chart
                  :chart-data="researchTopicData"
                  title="学术论文主题"
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
import { getChartData } from '@/api/databoard/data'
export default {
  name: 'DataModule',
  components: {
    LineChart,
    PieChart
  },
  data() {
    return {

      // 图表数据
      policyNewsData : {
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        seriesData: [{
          name: '新闻消息',
          data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
          color: '#5470c6'
        }, {
          name: '行业新闻',
          data: [80, 95, 120, 150, 110, 180, 160, 140, 165, 190, 210, 250],
          color: '#91cc75'
        }
      ]
      },
      competitorTypeData: {
        seriesData: [
          { value: 335, name: '融资' },
          { value: 310, name: '产品发布' },
          { value: 234, name: '合作' },
          { value: 135, name: '技术更新' }
        ]
      },
      researchTopicData: {
        seriesData: [
          { value: 335, name: '磁学与自旋电子学' },
          { value: 310, name: '量子与低温测量' },
          { value: 234, name: '纳米与光学成像' },
          { value: 135, name: '科学仪器智能化' },
          { value: 1548, name: '光谱与分析技术' },
          { value: 872  , name: '仪器工程与国产化' },
        ]
      },
    }
  },
  mounted() {
    this.loadChartData()
  },
  methods: {
    // 加载图表数据
    async loadChartData() {
      try {
        // 优先尝试从API获取数据
        let apiResponse = null
        try {
          apiResponse = await getChartData({})
        } catch (apiError) {
          console.warn('API调用失败，使用模拟数据:', apiError)
        }
        // 处理API返回的数据
        if (apiResponse && apiResponse.data && apiResponse.data.statistics) {
          this.processApiData(apiResponse.data)
        } else {
          console.warn('API数据为空或结构不完整，使用模拟数据')
          this.useMockData()
          this.$forceUpdate()
        }
      } catch (error) {
        console.warn('API调用失败，使用模拟数据:', error)
        this.useMockData()
        this.$forceUpdate()
      } finally {
      }
    },

    // 处理API返回的数据
    processApiData(apiData) {
      const { statistics } = apiData
      if (!statistics) {
        console.warn('API返回数据格式不正确，使用模拟数据')
        this.useMockData()
        return
      }
      // 新闻消息数据
      this.policyNewsData = {
        xAxisData: statistics.policyNews?.xAxis || this.generateDefaultXAxis(),
        seriesData: statistics.policyNews?.series || [
          {
            name: '新闻消息',
            data: statistics.policyNews?.data || [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
            color: '#5470c6'
          },
          {
            name: '行业新闻',
            data: statistics.industryNews?.data || [80, 95, 120, 150, 110, 180, 160, 140, 165, 190, 210, 250],
            color: '#91cc75'
          }
        ]
      }

      // 竞品类型数据
      this.competitorTypeData = {
        seriesData: statistics.competitorType || [
          { value: 335, name: '融资' },
          { value: 310, name: '产品发布' },
          { value: 234, name: '合作' },
          { value: 135, name: '技术更新' }
        ]
      }

      // 研究主题数据
      this.researchTopicData = {
        seriesData: statistics.researchTopic || [
          { value: 335, name: '磁学与自旋电子学' },
          { value: 310, name: '量子与低温测量' },
          { value: 234, name: '纳米与光学成像' },
          { value: 135, name: '科学仪器智能化' },
          { value: 1548, name: '光谱与分析技术' },
          { value: 872  , name: '仪器工程与国产化' },
        ]
      }
    },

    // 使用模拟数据
    useMockData() {
      // 新闻消息数据
      this.policyNewsData = {
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        seriesData: [{
          name: '新闻消息',
          data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
          color: '#5470c6'
        },{
          name: '行业新闻',
          data: [80, 95, 120, 150, 110, 180, 160, 140, 165, 190, 210, 250],
          color: '#91cc75'
        }]
      }

      // 竞品类型数据
      this.competitorTypeData = {
        seriesData: [
          { value: 335, name: '融资' },
          { value: 310, name: '产品发布' },
          { value: 234, name: '合作' },
          { value: 135, name: '技术更新' }
        ]
      }

      // 研究主题数据
      this.researchTopicData = {
        seriesData: [
          { value: 335, name: '磁学与自旋电子学' },
          { value: 310, name: '量子与低温测量' },
          { value: 234, name: '纳米与光学成像' },
          { value: 135, name: '科学仪器智能化' },
          { value: 1548, name: '光谱与分析技术' },
          { value: 872  , name: '仪器工程与国产化' },
        ]
      }
    },

    // 生成默认时间轴（12个月）
    generateDefaultXAxis() {
      return ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },

    // 生成短时间轴（6个月）
    generateShortXAxis() {
      return ['1月', '2月', '3月', '4月', '5月', '6月']
    },

    // 处理数据类型变化
    handleDataTypeChange() {
      this.loadChartData()
    },

    // 处理时间范围变化
    handleTimeRangeChange() {
      this.loadChartData()
    },
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
  min-height: 0;
  margin-bottom: 0;

  ::v-deep .el-card__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px !important;
    min-height: 0;
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
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100%;
  min-height: 0px;
}

.chart-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
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
  min-height: 0px;
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
