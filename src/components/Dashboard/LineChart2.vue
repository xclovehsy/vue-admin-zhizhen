<template>
  <!-- 这个是右下角的折线图 为了避免图例重叠 -->
  <div ref="chart" :style="{ height: height, width: '100%' }"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'LineChart2',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    height: {
      type: String,
      default: '400px'
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart)
      const option = {
        title: {
          text: this.title,
          left: 'center',
          top:0,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.chartData.seriesData.map(item => item.name),
          bottom: 0,
          left: 'center',
          // type: 'scroll', // 启用滚动 
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '30%',
          top: '12%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chartData.xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: this.chartData.seriesData.map(item => ({
          name: item.name,
          type: 'line',
          data: item.data,
          itemStyle: {
            color: item.color
          },
          smooth: true
        }))
      }
      this.chart.setOption(option)
      
      // 响应式调整
      window.addEventListener('resize', this.handleResize)
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>