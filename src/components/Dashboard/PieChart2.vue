<template>
  <!-- 第二行右边的饼图 -->
  <div ref="chart" :style="{ height: height, width: '100%' }"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'PieChart2',
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
        if (this.chart && newVal && newVal.seriesData) {
          this.chart.setOption({
            legend: {
              data: newVal.seriesData.map(item => item.name)
            },
            series: [{
              data: newVal.seriesData
            }]
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
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical', 
          right: '5%', 
          top:'middle',
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 6, // 图例项之间的间距
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
            center: ['40%', '60%'],
            radius: ['10%', '60%'],
            avoidLabelOverlap: true,
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

      // 添加点击事件监听
      this.chart.off('click')
      this.chart.on('click', (params) => {
        this.$emit('chart-click', {
          ...params,
          title: this.title,
          chartType: 'pie'
        })
      })
      
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