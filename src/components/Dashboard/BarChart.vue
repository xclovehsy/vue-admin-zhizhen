<template>
  <div ref="chart" :style="{ height: height, width: '100%' }"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'BarChart',
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
          trigger: 'axis'
        }, 
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        legend: {
          data: this.chartData.seriesData.map(item => item.name),
          bottom: 0
        },
        xAxis: {
          type: 'category', 
          
          data: this.chartData.xAxisData,
        },
        yAxis: {
          type: 'value' 
        },
        series: this.chartData.seriesData.map(item => ({
          name: item.name,
          type: 'bar',
          data: item.data,
          itemStyle: {
            color: item.color
          },
          barWidth: '30%',
        }))
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
};
</script>