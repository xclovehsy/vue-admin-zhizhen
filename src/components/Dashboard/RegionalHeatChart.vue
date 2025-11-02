<template>
  <div class="regional-heat-chart">
    <el-card shadow="hover" class="chart-card" :body-style="{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }">
      <div slot="header" class="card-header">
        <span class="card-title">区域热度</span>
      </div>
      <div class="chart-container" ref="chartContainer" v-loading="loading"></div>
    </el-card>
  </div>
</template>

<script>
// 按需导入 ECharts
var echarts = require('echarts/lib/echarts')
// 导入柱状图图表类型
require('echarts/lib/chart/bar')
// 导入需要的组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')

// 导入地图API
import { getMapData } from '@/api/databoard/map'

export default {
  name: 'RegionalHeatChart',
  props: {
    // 数据类型：all/leads/tenders/policies/news
    dataType: {
      type: String,
      default: 'all'
    },
    // 时间范围：day/week/month/quarter/year
    timeRange: {
      type: String,
      default: 'month'
    }
  },
  data() {
    return {
      chartInstance: null,
      loading: false,
      chartData: []
    }
  },
  watch: {
    // 监听数据类型和时间范围变化
    dataType() {
      this.fetchData()
    },
    timeRange() {
      this.fetchData()
    }
  },
  mounted() {
    this.fetchData()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.chartInstance = null
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // 获取数据
    async fetchData() {
      this.loading = true
      try {
        const response = await getMapData({
          level: 'province',
          type: this.dataType,
          timeRange: this.timeRange
        })
        
        const statistics = response.data?.statistics || []
        
        if (statistics && statistics.length > 0) {
          // 处理API返回的数据：按总数值排序，取前8名
          this.chartData = statistics
            .map(item => ({
              name: item.name,
              leads: item.leads || 0,
              tenders: item.tenders || 0,
              policies: item.policies || 0,
              news: item.news || 0,
              value: item.value || 0
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8)
        } else {
          // API返回数据为空，使用默认数据
          this.chartData = this.getDefaultData()
        }
        
        // 等待DOM更新后初始化或更新图表
        await this.$nextTick()
        if (this.chartInstance) {
          this.setChartOption()
          setTimeout(() => {
            if (this.chartInstance) {
              this.chartInstance.resize()
            }
          }, 100)
        } else {
          setTimeout(() => {
            this.initChart()
          }, 200)
        }
      } catch (error) {
        console.error('获取区域热度数据失败:', error)
        // API调用失败，使用默认数据
        this.chartData = this.getDefaultData()
        await this.$nextTick()
        if (this.chartInstance) {
          this.setChartOption()
        } else {
          setTimeout(() => {
            this.initChart()
          }, 200)
        }
      } finally {
        this.loading = false
      }
    },
    
    // 获取默认数据
    getDefaultData() {
      return [
        { name: '北京市', leads: 45, tenders: 32, policies: 28, news: 72, value: 177 },
        { name: '广东省', leads: 42, tenders: 38, policies: 25, news: 51, value: 156 },
        { name: '江苏省', leads: 38, tenders: 35, policies: 22, news: 47, value: 142 },
        { name: '河南省', leads: 35, tenders: 28, policies: 22, news: 52, value: 137 },
        { name: '山东省', leads: 32, tenders: 28, policies: 20, news: 48, value: 128 },
        { name: '浙江省', leads: 30, tenders: 25, policies: 18, news: 42, value: 115 },
        { name: '上海市', leads: 28, tenders: 24, policies: 16, news: 40, value: 108 },
        { name: '四川省', leads: 25, tenders: 22, policies: 15, news: 33, value: 95 }
      ]
    },
    
    // 初始化图表
    initChart() {
      if (!this.$refs.chartContainer) {
        console.warn('图表容器不存在，延迟初始化')
        setTimeout(() => {
          this.initChart()
        }, 100)
        return
      }
      
      const container = this.$refs.chartContainer
      const width = container.clientWidth || container.offsetWidth
      const height = container.clientHeight || container.offsetHeight
      
      console.log('图表容器尺寸:', width, 'x', height)
      
      if (!width || !height || width === 0 || height === 0) {
        console.warn('容器尺寸无效，等待容器渲染')
        setTimeout(() => {
          this.initChart()
        }, 100)
        return
      }
      
      // 如果已经存在实例，先销毁
      if (this.chartInstance) {
        this.chartInstance.dispose()
        this.chartInstance = null
      }
      
      try {
        this.chartInstance = echarts.init(container)
        if (!this.chartInstance) {
          console.error('ECharts实例创建失败')
          return
        }
        
        console.log('ECharts实例创建成功')
        this.setChartOption()
        
        // 确保图表正确渲染
        setTimeout(() => {
          if (this.chartInstance) {
            this.chartInstance.resize()
            console.log('图表resize完成')
          }
        }, 100)
      } catch (error) {
        console.error('初始化图表失败:', error)
      }
    },
    
    // 设置图表配置（参考 ECharts 官方示例）
    setChartOption() {
      if (!this.chartInstance) {
        return
      }
      
      // 如果没有数据，使用默认数据
      if (!this.chartData || this.chartData.length === 0) {
        this.chartData = this.getDefaultData()
      }
      
      const names = this.chartData.map(item => item.name)
      
      // 参考 https://echarts.apache.org/examples/zh/editor.html?c=bar-simple
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['线索', '招标', '政策', '新闻'],
          top: 0,
          textStyle: {
            fontSize: 11,
            color: '#666'
          },
          itemWidth: 12,
          itemHeight: 8
        },
        grid: {
          left: '10%',
          right: '5%',
          bottom: '15%',
          top: '15%',
          containLabel: false
        },
        xAxis: {
          type: 'category',
          data: names,
          axisLabel: {
            fontSize: 11,
            color: '#666',
            rotate: 0
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 11,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '线索',
            type: 'bar',
            data: this.chartData.map(item => item.leads),
            itemStyle: {
              color: '#67C23A',
              borderRadius: [4, 4, 0, 0]
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}',
              fontSize: 10,
              color: '#333',
              fontWeight: 600
            },
            barWidth: '20%'
          },
          {
            name: '招标',
            type: 'bar',
            data: this.chartData.map(item => item.tenders),
            itemStyle: {
              color: '#409EFF',
              borderRadius: [4, 4, 0, 0]
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}',
              fontSize: 10,
              color: '#333',
              fontWeight: 600
            },
            barWidth: '20%'
          },
          {
            name: '政策',
            type: 'bar',
            data: this.chartData.map(item => item.policies),
            itemStyle: {
              color: '#E6A23C',
              borderRadius: [4, 4, 0, 0]
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}',
              fontSize: 10,
              color: '#333',
              fontWeight: 600
            },
            barWidth: '20%'
          },
          {
            name: '新闻',
            type: 'bar',
            data: this.chartData.map(item => item.news),
            itemStyle: {
              color: '#F56C6C',
              borderRadius: [4, 4, 0, 0]
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}',
              fontSize: 10,
              color: '#333',
              fontWeight: 600
            },
            barWidth: '20%'
          }
        ]
      }
      
      this.chartInstance.setOption(option)
    },
    
    // 处理窗口大小变化
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    },
    
    // 重置图表大小
    resize() {
      this.handleResize()
    }
  }
}
</script>

<style lang="scss" scoped>
.regional-heat-chart {
  flex-shrink: 0;
  height: 280px;

  .chart-card {
    height: 100%;
    margin-top: 0;
    display: flex;
    flex-direction: column;

    ::v-deep .el-card__body {
      flex: 1;
      min-height: 0;
      padding: 0 !important;
    }

    .card-header {
      .card-title {
        font-size: 14px;
        font-weight: bold;
        color: #303133;
      }
    }

    .chart-container {
      flex: 1;
      width: 100%;
      min-height: 200px; // 确保有最小高度
      position: relative;
    }
  }
}
</style>

