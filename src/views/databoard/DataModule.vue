<template>
  <div class="data-module">
    <el-card shadow="hover" :body-style="{ height: '100%'}">
      <div class="module-content">
        <p>数据展示区域</p>
        <!-- 这里可以添加数据表格、图表等 -->
        <div class="data-board">
          <!-- 新闻消息卡片 -->
          <el-card class="chart-card" shadow="hover">
            <!-- <template #header>
              <div class="card-header">
                <span class="card-title">新闻消息</span>
              </div>
            </template> -->
            <div class="chart-container">
              <div class="chart-item">
                <line-chart
                  :chart-data="policyNewsData" 
                  title="政策新闻"
                />
              </div>
              <div class="chart-item">
                <line-chart 
                  :chart-data="industryNewsData" 
                  title="行业新闻"
                />
              </div>
            </div>
          </el-card>
    
          <!-- 竞品活动卡片 -->
          <el-card class="chart-card" shadow="hover">
            <div class="chart-container">
              <div class="chart-item">
                <bar-chart 
                  :chart-data="bidListData" 
                  title="近六个月招标消息"
                />
              </div>
              <div class="chart-item">
                <PieChart2
                  :chart-data="competitorTypeData" 
                  title="竞品公司动态"
                />
              </div>
              
            </div>
          </el-card>
    
          <!-- 科技论文卡片 -->
          <el-card class="chart-card" shadow="never">
            <div class="chart-container">
              <div class="chart-item">
                <pie-chart 
                  :chart-data="researchTopicData" 
                  title="科技论文主题"
                />
              </div>
              <div class="chart-item">
                <LineChart2
                  :chart-data="researchTopicNumData" 
                  title="各研究主题数量变化"
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
import LineChart2 from '@/components/Dashboard/LineChart2.vue'
import PieChart from '@/components/Dashboard/PieChart.vue'
import PieChart2 from '@/components/Dashboard/PieChart2.vue'
import BarChart from '@/components/Dashboard/BarChart.vue'
import { getChartData } from '@/api/databoard/data'

// 默认数据常量，统一管理
const DEFAULT_DATA = {
  policyNews: [142, 187, 123, 198, 156, 179, 134, 191, 165, 148, 172, 109],
  industryNews: [172, 95, 143, 127, 158, 134, 176, 92, 165, 148, 117, 179],
  bidList: [28, 35, 42, 38, 51, 45],  // 近6个月招标数据
  // 4个分类：磁学与量子、纳米与光谱、科学仪器、仪器国产化
  researchTopicNum: {
    magnetismQuantum: [75, 67, 121, 83, 101, 76, 126, 73, 105, 61, 99, 94],    // 磁学+量子
    nanoSpectrum: [97, 113, 43, 63, 103, 163, 150, 120, 40, 153, 100, 107],    // 纳米+光谱
    instrument: [73, 29, 96, 14, 61, 87, 3, 52, 40, 78, 21, 65],               // 科学仪器
    localization: [19, 64, 7, 91, 43, 26, 80, 37, 54, 12, 99, 6]               // 仪器国产化
  }
}

const buildDefaultResearchTopicSeries = () => ([
  {
    name: '磁学与量子',
    data: [...DEFAULT_DATA.researchTopicNum.magnetismQuantum],
    color: '#5470C6'
  }, {
    name: '纳米与光谱',
    data: [...DEFAULT_DATA.researchTopicNum.nanoSpectrum],
    color: '#91CC75'
  }, {
    name: '科学仪器',
    data: [...DEFAULT_DATA.researchTopicNum.instrument],
    color: '#EE6666'
  }, {
    name: '仪器国产化',
    data: [...DEFAULT_DATA.researchTopicNum.localization],
    color: '#3BA272'
  }
])

export default {
  name: 'DataModule',
  components: {
    LineChart,
    LineChart2,
    PieChart,
    PieChart2,
    BarChart,
},
  data() {
    return {
      // 图表数据
      policyNewsData : {
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        seriesData: [{
          name: '政策新闻',
          data: DEFAULT_DATA.policyNews,
          color: '#5470c6'
        }]
      },
      industryNewsData: {
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        seriesData: [{
          name: '行业新闻',
          data: DEFAULT_DATA.industryNews,
          color: '#91cc75'
        }]
      },
      // 近六个月招标消息
      bidListData: {
        xAxisData: ['7月', '8月', '9月', '10月', '11月', '12月'],
        seriesData: [{
          name: '招标数量',
          data: DEFAULT_DATA.bidList,
          color: '#d37448'
        }]
      },
      // 竞品公司动态
      competitorTypeData: {
        seriesData: [
          { value: 420, name: '融资' },
          { value: 380, name: '产品发布' },
          { value: 290, name: '合作' },
          { value: 180, name: '技术更新' }
        ]
      },
      // 科技论文主题（4个分类）
      researchTopicData: {
        seriesData: [
          { value: 905, name: '磁学与量子' },
          { value: 1610, name: '纳米与光谱' },
          { value: 280, name: '科学仪器' },
          { value: 720, name: '仪器国产化' },
        ]
      },
      // 各研究主题数量变化（4个分类）
      researchTopicNumData: {
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        seriesData: [
          {
            name: '磁学与量子',
            data: DEFAULT_DATA.researchTopicNum.magnetismQuantum,
            color: '#5470C6'
          }, {
            name: '纳米与光谱',
            data: DEFAULT_DATA.researchTopicNum.nanoSpectrum,
            color: '#91CC75'
          }, {
            name: '科学仪器',
            data: DEFAULT_DATA.researchTopicNum.instrument,
            color: '#EE6666'
          }, {
            name: '仪器国产化',
            data: DEFAULT_DATA.researchTopicNum.localization,
            color: '#3BA272'
          }
        ]
      }
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
      
      // 政策新闻数据 - 后端返回格式: { xAxisData: [...], seriesData: [{ name, data, color }] }
      this.policyNewsData = {
        xAxisData: statistics.policyNews?.xAxisData || this.generateDefaultXAxis(),
        seriesData: statistics.policyNews?.seriesData || [
          {
            name: '政策新闻',
            data: DEFAULT_DATA.policyNews,
            color: '#5470c6'
          }
        ]
      }
      
      // 行业新闻数据 - 后端返回格式: { xAxisData: [...], seriesData: [{ name, data, color }] }
      // 注意：后端字段名是 industryNews，不是 industryNewsData
      this.industryNewsData = {
        xAxisData: statistics.industryNews?.xAxisData || this.generateDefaultXAxis(),
        seriesData: statistics.industryNews?.seriesData || [
          {
            name: '行业新闻',
            data: DEFAULT_DATA.industryNews,
            color: '#91cc75'
          }
        ]
      }

      // 近六个月招标消息 - 后端返回格式: { xAxisData: [...], seriesData: [{ name, data, color }] }
      this.bidListData = {
        xAxisData: statistics.bidListData?.xAxisData || this.generateShortXAxis(),
        seriesData: statistics.bidListData?.seriesData || [
          {
            name: '招标数量',
            data: DEFAULT_DATA.bidList,
            color: '#d37448'
          }
        ]
      }

      // 竞品类型数据 - 后端返回格式: [{ seriesData: [{ value, name }] }]
      // 需要提取第一个元素的 seriesData
      this.competitorTypeData = {
        seriesData: (statistics.competitorType && statistics.competitorType[0]?.seriesData) || [
          { value: 420, name: '融资' },
          { value: 380, name: '产品发布' },
          { value: 290, name: '合作' },
          { value: 180, name: '技术更新' }
        ]
      }

      // 研究主题数据 - 后端返回格式: { seriesData: [{ value, name }] }
      // 4个分类：磁学与量子、纳米与光谱、科学仪器、仪器国产化
      this.researchTopicData = {
        seriesData: statistics.researchTopicData?.seriesData || [
          { value: 905, name: '磁学与量子' },
          { value: 1610, name: '纳米与光谱' },
          { value: 280, name: '科学仪器' },
          { value: 720, name: '仪器国产化' }
        ]
      }

      // 各研究主题数量变化 - 后端返回格式: { xAxisData: [...], seriesData: [{ name, data, color }] }
      // 后端直接返回 seriesData 数组，不需要按主题名分字段
      const researchTopicNumFromApi = statistics.researchTopicNumData
      const hasValidXAxis = Array.isArray(researchTopicNumFromApi?.xAxisData) && researchTopicNumFromApi.xAxisData.length > 0
      const hasValidSeries = Array.isArray(researchTopicNumFromApi?.seriesData) && researchTopicNumFromApi.seriesData.length > 0 &&
        researchTopicNumFromApi.seriesData.every(item => Array.isArray(item.data) && item.data.length > 0)

      this.researchTopicNumData = {
        xAxisData: hasValidXAxis ? researchTopicNumFromApi.xAxisData : this.generateDefaultXAxis(),
        seriesData: hasValidSeries ? researchTopicNumFromApi.seriesData : buildDefaultResearchTopicSeries()
      }
    },
    
    // 使用模拟数据
    useMockData() {
      // 政策新闻数据
      this.policyNewsData = {
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        seriesData: [{
          name: '政策新闻',
          data: DEFAULT_DATA.policyNews,
          color: '#5470c6'
        }]
      }

      // 行业新闻数据
      this.industryNewsData = {
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        seriesData: [{
          name: '行业新闻',
          data: DEFAULT_DATA.industryNews,
          color: '#91cc75'
        }]
      }

      // 近六个月招标消息
      this.bidListData = {
        xAxisData: this.generateShortXAxis(),
        seriesData: [{
          name: '招标数量',
          data: DEFAULT_DATA.bidList,
          color: '#d37448'
        }]
      }

      // 竞品类型数据
      this.competitorTypeData = {
        seriesData: [
          { value: 420, name: '融资' },
          { value: 380, name: '产品发布' },
          { value: 290, name: '合作' },
          { value: 180, name: '技术更新' }
        ]
      }

      // 研究主题数据（4个分类）
      this.researchTopicData = {
        seriesData: [
          { value: 905, name: '磁学与量子' },
          { value: 1610, name: '纳米与光谱' },
          { value: 280, name: '科学仪器' },
          { value: 720, name: '仪器国产化' },
        ]
      }

      // 各研究主题数量变化
      this.researchTopicNumData = {
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        seriesData: buildDefaultResearchTopicSeries()
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
    padding: 5px !important;
    min-height: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

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
    margin: 0 0 8px 0;
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
    gap: 5px;
  }
  .data-board {
    padding: 5px;
    gap: 5px;
  }
}

@media (max-width: 768px) {
  .data-board {
    padding: 5px;
    gap: 12px;
  }
  
  .chart-card {
    ::v-deep .el-card__body {
      padding: 5px !important;
    }
  }
  
  .chart-container {
    gap: 5px;
  }
}

@media (max-width: 576px) {
  .data-board {
    padding: 5px;
    gap: 5px;
  }
  .chart-item {
    padding: 5px;
    h4 {
      font-size: 13px;
      margin-bottom: 8px;
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