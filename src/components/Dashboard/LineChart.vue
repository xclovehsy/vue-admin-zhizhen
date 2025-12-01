<template>
  <div ref="chart" :style="{ height: height, width: '100%' }"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'LineChart',
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
  watch: {
    chartData: {
      handler(newVal) {
        if (this.chart && newVal && newVal.xAxisData && newVal.seriesData) {
          this.chart.setOption({
            xAxis: {
              data: newVal.xAxisData
            },
            series: newVal.seriesData.map(item => ({
              name: item.name,
              type: 'line',
              data: item.data,
              itemStyle: {
                color: item.color
              },
              smooth: false
            }))
          })
        }
      },
      deep: true,
      immediate: false
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
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
          smooth: false
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