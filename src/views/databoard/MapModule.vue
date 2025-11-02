<template>
  <div class="map-module">
    <el-card shadow="hover" :body-style="{ height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', marginBottom: 0 }">
      <div slot="header" class="clearfix">
        <span class="module-title">中国地图</span>
        <div class="header-actions">
          <!-- 数据类型选择 -->
          <el-select v-model="dataType" size="mini" style="width: 100px; margin-right: 8px;" @change="handleDataTypeChange">
            <el-option label="全部" value="all"></el-option>
            <el-option label="线索" value="leads"></el-option>
            <el-option label="招标" value="tenders"></el-option>
            <el-option label="政策" value="policies"></el-option>
            <el-option label="新闻" value="news"></el-option>
          </el-select>
          <!-- 时间范围选择 -->
          <el-select v-model="timeRange" size="mini" style="width: 100px; margin-right: 8px;" @change="handleTimeRangeChange">
            <el-option label="当天" value="day"></el-option>
            <el-option label="近一周" value="week"></el-option>
            <el-option label="近一月" value="month"></el-option>
            <el-option label="近一季度" value="quarter"></el-option>
            <el-option label="近一年" value="year"></el-option>
          </el-select>
          <el-button size="mini" @click="resetMap">重置</el-button>
          <el-button size="mini" type="primary" @click="toggleViewMode">
            {{ viewMode === '2D' ? '切换到3D' : '切换到2D' }}
          </el-button>
        </div>
      </div>
      <div class="module-content">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-wrapper">
          <i class="el-icon-loading"></i>
          <span>正在加载地图数据...</span>
        </div>
        <!-- 地图容器 -->
        <div v-show="!loading" ref="mapContainer" class="china-map-container"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需导入 ECharts
var echarts = require('echarts/lib/echarts')
// 导入地图图表类型
require('echarts/lib/chart/map')
// 导入需要的组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
require('echarts/lib/component/visualMap')

// 导入地图API
import { getMapData, getRegionDetail } from '@/api/databoard/map'

export default {
  name: 'MapModule',
  data() {
    return {
      mapChart: null,
      viewMode: '2D',
      mapData: null,
      loading: false,
      statistics: [],
      summary: null,
      dataType: 'all', // 数据类型：all/leads/tenders/policies/news
      timeRange: 'month', // 时间范围：day/week/month/quarter/year
      currentDate: new Date().toISOString().split('T')[0] // 当前查询日期
    }
  },
  mounted() {
    this.loadChinaMapData()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.mapChart) {
      this.mapChart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // 加载中国地图数据
    async loadChinaMapData() {
      this.loading = true
      try {
        // 优先尝试从API获取地图数据
        let apiResponse = null
        try {
          apiResponse = await getMapData({
            level: 'province',
            date: this.currentDate,
            type: this.dataType,
            timeRange: this.timeRange
          })
        } catch (apiError) {
          console.warn('API调用失败，使用本地地图数据:', apiError)
        }

        // 如果有API响应，使用API数据
        if (apiResponse && apiResponse.data) {
          const data = apiResponse.data
          
          // 如果API返回了地图数据，使用API数据
          if (data.mapData) {
            this.mapData = data.mapData
            this.statistics = data.statistics || []
            this.summary = data.summary || null
          } else {
            // API只返回统计数据，使用本地地图数据
            await this.loadLocalMapData()
            this.statistics = data.statistics || []
            this.summary = data.summary || null
          }
        } else {
          // API调用失败，使用本地地图数据和示例数据
          await this.loadLocalMapData()
          this.statistics = []
          this.summary = null
        }

        // 注册地图
        if (this.mapData && this.mapData.features) {
          try {
            echarts.registerMap('china', this.mapData)
            console.log('地图注册成功，特征数量:', this.mapData.features.length)
          } catch (error) {
            console.error('地图注册失败:', error)
            throw error
          }
        } else {
          console.warn('地图数据格式不正确，无法注册')
        }

        // 等待DOM更新后初始化地图
        await this.$nextTick()
        // 再次等待确保容器已渲染
        setTimeout(() => {
          this.initMap()
        }, 200)
      } catch (error) {
        console.error('加载地图数据失败:', error)
        this.$message.error('加载地图数据失败，请检查网络连接')
      } finally {
        this.loading = false
      }
    },

    // 加载本地地图数据
    async loadLocalMapData() {
      try {
        const response = await fetch('/china-map.json')
        this.mapData = await response.json()
      } catch (error) {
        console.error('加载本地地图数据失败:', error)
        throw error
      }
    },

    // 处理数据类型变化
    handleDataTypeChange() {
      this.loadChinaMapData()
    },

    // 处理时间范围变化
    handleTimeRangeChange() {
      this.loadChinaMapData()
    },
    
    // 初始化地图
    initMap() {
      if (!this.$refs.mapContainer) {
        console.warn('地图容器不存在，延迟初始化')
        setTimeout(() => {
          this.initMap()
        }, 100)
        return
      }

      // 检查容器尺寸
      const container = this.$refs.mapContainer
      const width = container.clientWidth || container.offsetWidth
      const height = container.clientHeight || container.offsetHeight

      if (!width || !height || width === 0 || height === 0) {
        console.warn('容器尺寸无效，等待容器渲染，当前尺寸:', width, 'x', height)
        setTimeout(() => {
          this.initMap()
        }, 100)
        return
      }

      // 如果已经存在实例，先销毁
      if (this.mapChart) {
        this.mapChart.dispose()
        this.mapChart = null
      }

      // 创建echarts实例
      try {
        this.mapChart = echarts.init(container)
        if (!this.mapChart) {
          console.error('ECharts实例创建失败')
          return
        }

        // 设置地图配置
        this.setMapOption()

        // 添加点击事件
        this.mapChart.on('click', this.handleMapClick)

        // 确保地图正确渲染
        setTimeout(() => {
          if (this.mapChart) {
            this.mapChart.resize()
            console.log('地图初始化完成，容器尺寸:', width, 'x', height)
          }
        }, 100)
      } catch (error) {
        console.error('初始化地图失败:', error)
        this.$message.error('地图初始化失败')
      }
    },
    
    // 设置地图配置
    setMapOption() {
      if (!this.mapChart) {
        console.error('地图实例不存在，无法设置配置')
        return
      }

      // 检查地图是否已注册（echarts 5.0+的检查方式）
      try {
        // 尝试获取已注册的地图，如果未注册会抛出错误
        echarts.getMap('china')
        console.log('地图"china"已注册')
      } catch (error) {
        console.error('地图"china"未注册，请先加载地图数据', error)
        this.$message.error('地图数据未加载，请刷新页面重试')
        return
      }

      // 准备地图数据
      const mapData = this.prepareMapData()
      console.log('准备的地图数据:', mapData.slice(0, 5)) // 打印前5条数据
      
      // 计算visualMap的最大最小值
      const allValues = mapData.map(item => item.value || 0)
      const values = allValues.filter(v => v > 0)
      
      let maxValue = this.summary?.max
      let minValue = this.summary?.min
      
      if (!maxValue) {
        maxValue = values.length > 0 ? Math.max(...values) : (allValues.length > 0 ? Math.max(...allValues) : 100)
      }
      if (minValue === undefined || minValue === null) {
        minValue = values.length > 0 ? Math.min(...values) : (allValues.length > 0 ? Math.min(...allValues) : 0)
      }
      
      // 确保maxValue > minValue
      if (maxValue <= minValue) {
        maxValue = minValue + 1
      }
      
      console.log('VisualMap范围:', { min: minValue, max: maxValue, valuesCount: values.length })
      
      const option = {
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            if (params.data) {
              const data = params.data
              const typeText = this.getDataTypeText()
              let tooltip = `${params.name}<br/>${typeText}: ${data.value || 0}`
              
              // 如果有详细数据，显示更多信息
              if (data.leads !== undefined) {
                tooltip += `<br/>线索: ${data.leads || 0}`
                tooltip += `<br/>招标: ${data.tenders || 0}`
                tooltip += `<br/>政策: ${data.policies || 0}`
                tooltip += `<br/>新闻: ${data.news || 0}`
              }
              
              return tooltip
            }
            return params.name
          }
        },
        visualMap: {
          min: minValue,
          max: maxValue,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#e0f3ff', '#0066cc']
          },
          textStyle: {
            color: '#000'
          },
          formatter: (value) => {
            return Math.round(value)
          },
          show: true // 确保显示visualMap
        },
        series: [
          {
            name: this.getDataTypeText(),
            type: 'map',
            map: 'china',
            roam: true, // 开启缩放和平移
            zoom: 1.2, // 设置初始缩放
            center: [105, 36], // 设置地图中心点
            itemStyle: {
              borderColor: '#4fa8ff',
              borderWidth: 1
              // 移除areaColor，让visualMap控制颜色
            },
            emphasis: {
              label: {
                show: true,
                color: '#fff',
                fontSize: 14
              },
              itemStyle: {
                areaColor: '#409EFF',
                borderColor: '#fff',
                borderWidth: 2
              }
            },
            label: {
              show: true,
              color: '#333',
              fontSize: 12
            },
            data: mapData
          }
        ]
      }
      
      console.log('设置地图配置，数据点数量:', mapData.length)
      console.log('VisualMap范围:', `min=${minValue}, max=${maxValue}`)
      
      try {
        this.mapChart.setOption(option, true) // 使用notMerge=true强制更新
        console.log('地图配置设置成功')
        
        // 设置配置后立即调整大小
        this.$nextTick(() => {
          if (this.mapChart) {
            this.mapChart.resize()
            console.log('地图resize完成')
            
            // 验证地图是否正确渲染
            setTimeout(() => {
              if (this.mapChart) {
                const width = this.$refs.mapContainer?.clientWidth
                const height = this.$refs.mapContainer?.clientHeight
                console.log('地图容器最终尺寸:', `${width}x${height}`)
                console.log('地图实例状态:', this.mapChart.isDisposed() ? '已销毁' : '正常')
              }
            }, 500)
          }
        })
      } catch (error) {
        console.error('设置地图配置失败:', error)
        throw error
      }
    },

    // 准备地图数据
    prepareMapData() {
      // 如果API返回了统计数据，使用API数据
      if (this.statistics && this.statistics.length > 0) {
        return this.statistics.map(item => ({
          name: item.name,
          value: item.value || 0,
          leads: item.leads,
          tenders: item.tenders,
          policies: item.policies,
          news: item.news,
          code: item.code
        }))
      }

      // 否则使用示例数据作为备用
      return [
        { name: '北京市', value: 177 },
        { name: '天津市', value: 42 },
        { name: '河北省', value: 102 },
        { name: '山西省', value: 81 },
        { name: '内蒙古自治区', value: 47 },
        { name: '辽宁省', value: 67 },
        { name: '吉林省', value: 82 },
        { name: '黑龙江省', value: 123 },
        { name: '上海市', value: 24 },
        { name: '江苏省', value: 92 },
        { name: '浙江省', value: 114 },
        { name: '安徽省', value: 109 },
        { name: '福建省', value: 116 },
        { name: '江西省', value: 91 },
        { name: '山东省', value: 119 },
        { name: '河南省', value: 137 },
        { name: '湖北省', value: 116 },
        { name: '湖南省', value: 114 },
        { name: '重庆市', value: 91 },
        { name: '四川省', value: 125 },
        { name: '贵州省', value: 62 },
        { name: '云南省', value: 83 },
        { name: '西藏自治区', value: 9 },
        { name: '陕西省', value: 80 },
        { name: '甘肃省', value: 56 },
        { name: '青海省', value: 10 },
        { name: '宁夏回族自治区', value: 18 },
        { name: '新疆维吾尔自治区', value: 67 },
        { name: '广东省', value: 92 },
        { name: '广西壮族自治区', value: 59 },
        { name: '海南省', value: 14 },
        { name: '台湾省', value: 0 },
        { name: '香港特别行政区', value: 0 },
        { name: '澳门特别行政区', value: 0 }
      ]
    },

    // 获取数据类型文本
    getDataTypeText() {
      const typeMap = {
        all: '全部数据',
        leads: '线索',
        tenders: '招标',
        policies: '政策',
        news: '新闻'
      }
      return typeMap[this.dataType] || '数据'
    },
    
    // 处理地图点击事件
    async handleMapClick(params) {
      console.log('点击了:', params.name)
      
      // 获取区域代码
      const regionCode = params.data?.code || this.getRegionCodeByName(params.name)
      
      if (regionCode) {
        try {
          // 调用API获取区域详情
          const response = await getRegionDetail({
            region: regionCode,
            date: this.currentDate,
            type: this.dataType,
            timeRange: this.timeRange
          })
          
          const data = response.data || response
          
          // 显示区域详情信息
          const stats = data.statistics || {}
          const message = `
            ${params.name}<br/>
            总计: ${stats.total || 0}<br/>
            线索: ${stats.leads || 0}<br/>
            招标: ${stats.tenders || 0}<br/>
            政策: ${stats.policies || 0}<br/>
            新闻: ${stats.news || 0}
          `
          
          this.$message({
            message: message,
            type: 'info',
            dangerouslyUseHTMLString: true,
            duration: 3000
          })
          
          // TODO: 可以在这里实现下钻到市级地图的功能
          // 例如：加载对应省份的市级地图数据
        } catch (error) {
          console.error('获取区域详情失败:', error)
          this.$message.info(`您点击了: ${params.name}`)
        }
      } else {
        this.$message.info(`您点击了: ${params.name}`)
      }
    },

    // 根据区域名称获取区域代码
    getRegionCodeByName(name) {
      // 从统计数据中查找
      if (this.statistics && this.statistics.length > 0) {
        const region = this.statistics.find(item => item.name === name)
        if (region) {
          return region.code
        }
      }

      // 区域代码映射表（备用）
      const regionCodeMap = {
        '北京市': '110000',
        '天津市': '120000',
        '河北省': '130000',
        '山西省': '140000',
        '内蒙古自治区': '150000',
        '辽宁省': '210000',
        '吉林省': '220000',
        '黑龙江省': '230000',
        '上海市': '310000',
        '江苏省': '320000',
        '浙江省': '330000',
        '安徽省': '340000',
        '福建省': '350000',
        '江西省': '360000',
        '山东省': '370000',
        '河南省': '410000',
        '湖北省': '420000',
        '湖南省': '430000',
        '广东省': '440000',
        '广西壮族自治区': '450000',
        '海南省': '460000',
        '重庆市': '500000',
        '四川省': '510000',
        '贵州省': '520000',
        '云南省': '530000',
        '西藏自治区': '540000',
        '陕西省': '610000',
        '甘肃省': '620000',
        '青海省': '630000',
        '宁夏回族自治区': '640000',
        '新疆维吾尔自治区': '650000',
        '台湾省': '710000',
        '香港特别行政区': '810000',
        '澳门特别行政区': '820000'
      }

      return regionCodeMap[name]
    },
    
    // 重置地图
    resetMap() {
      if (this.mapChart) {
        this.mapChart.dispatchAction({
          type: 'mapUnSelect',
          name: 'all'
        })
        this.mapChart.setOption({
          geo: {
            zoom: 1,
            center: null
          }
        })
      }
    },
    
    // 切换视图模式
    toggleViewMode() {
      this.$message.info('3D地图功能开发中...')
      // TODO: 实现3D地图切换
      // 需要安装 echarts-gl 并实现3D地图
    },
    
    // 处理窗口大小变化
    handleResize() {
      if (this.mapChart) {
        this.mapChart.resize()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.map-module {
  height: 100%;
  display: flex;
  flex-direction: column;

  ::v-deep .el-card {
    margin-bottom: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .module-title {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }

  .header-actions {
    float: right;
    
    .el-button {
      margin-left: 8px;
    }
  }

  .module-content {
    height: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .loading-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: #909399;
    font-size: 14px;
    z-index: 10;

    i {
      font-size: 24px;
      animation: rotating 2s linear infinite;
    }
  }

  .china-map-container {
    width: 100%;
    height: 100%;
    min-height: 500px;
    flex: 1;
    position: relative;
    background-color: #f5f5f5;
  }

  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>

