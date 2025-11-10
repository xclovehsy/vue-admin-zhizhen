<template>
  <div ref="chart" :style="{ height: height, width: '100%' }"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'PieChart',
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
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right:100,
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 20, // 图例项之间的间距
          textStyle: {
            fontSize: 11,
            color: '#666'
          },
          data: this.chartData.seriesData.map(item => item.name)
        },
        series: [
          {
            name: '数据分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.chartData.seriesData
          }
        ]
      }
      this.chart.setOption(option)
      
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