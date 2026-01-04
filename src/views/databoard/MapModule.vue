<template>
  <div class="map-module">
    <el-card shadow="hover" :body-style="{ height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', marginBottom: 0 }">
      <div slot="header" class="clearfix">
        <span class="module-title">{{ mapType === 'china' ? '中国地图' : '世界地图' }}</span>
        <div class="header-actions">
          <!-- 数据类型选择 -->
          <el-select :value="dataType" size="mini" style="width: 100px; margin-right: 8px;" @change="handleDataTypeChange">
            <el-option label="全部" value="all"></el-option>
            <el-option :label="typeLabels.leads" value="leads"></el-option>
            <el-option :label="typeLabels.tenders" value="tenders"></el-option>
            <el-option :label="typeLabels.policies" value="policies"></el-option>
            <el-option :label="typeLabels.news" value="news"></el-option>
          </el-select>
          <!-- 时间范围选择 -->
          <el-select :value="timeRange" size="mini" style="width: 100px; margin-right: 8px;" @change="handleTimeRangeChange">
            <el-option label="当天" value="day"></el-option>
            <el-option label="近一周" value="week"></el-option>
            <el-option label="近一月" value="month"></el-option>
            <el-option label="近一季度" value="quarter"></el-option>
            <el-option label="近一年" value="year"></el-option>
          </el-select>
          <!-- <el-button size="mini" @click="resetMap">重置</el-button> -->
          <el-button size="mini" type="primary" @click="toggleViewMode">
            {{ mapType === 'china' ? '切换世界地图' : '切换中国地图' }}
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
// 导入地图数据（JS文件会自动注册地图）
import '@/assets/js/china.js'
import '@/assets/js/world.js'

export default {
  name: 'MapModule',
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
      mapChart: null,
      mapType: 'china', // 地图类型：china/world
      loading: false,
      statistics: [],
      summary: null,
      currentDate: new Date().toISOString().split('T')[0], // 当前查询日期
      typeLabels: {
        // 默认值
        leads: '竞品动态',
        tenders: '招标机会',
        policies: '相关论文',
        news: '新闻消息'
      }
    }
  },
  watch: {
    // 监听props变化，重新加载数据
    dataType() {
      this.loadMapData()
    },
    timeRange() {
      this.loadMapData()
    }
  },
  mounted() {
    this.loadMapData()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.mapChart) {
      this.mapChart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // 加载地图数据（根据mapType加载中国地图或世界地图）
    async loadMapData() {
      if (this.mapType === 'china') {
        await this.loadChinaMapData()
      } else {
        await this.loadWorldMapData()
      }
    },

    // 加载中国地图数据
    async loadChinaMapData() {
      this.loading = true
      try {
        // 中国地图数据已在 china.js 中注册，直接使用
        // 从API获取统计数据
        let apiResponse = null
        try {
          apiResponse = await getMapData({
            level: 'province',
            date: this.currentDate,
            type: this.dataType,
            timeRange: this.timeRange
          })
        } catch (apiError) {
          console.warn('API调用失败:', apiError)
        }

        // 处理统计数据
        if (apiResponse && apiResponse.data) {
          this.statistics = apiResponse.data.statistics || []
          this.summary = apiResponse.data.summary || null
          console.log('使用API返回的数据:', this.statistics.length, '条')
        } else {
          // API失败或返回空，使用空数据
          this.statistics = []
          this.summary = null
          console.log('API未返回数据，使用空数据')
        }

        // 初始化地图
        await this.$nextTick()
        setTimeout(() => {
          this.initMap()
        }, 200)
      } catch (error) {
        console.error('加载中国地图数据失败:', error)
        this.$message.error('加载中国地图数据失败')
        // 使用空数据，不再使用缺省值
        this.statistics = []
        this.summary = null
        await this.$nextTick()
        setTimeout(() => {
          this.initMap()
        }, 200)
      } finally {
        this.loading = false
      }
    },

    // 加载世界地图数据
    async loadWorldMapData() {
      this.loading = true
      try {
        // 世界地图数据已在 world.js 中注册，直接使用
        // 从API获取统计数据
        let apiResponse = null
        try {
          apiResponse = await getMapData({
            level: 'world',
            date: this.currentDate,
            type: this.dataType,
            timeRange: this.timeRange
          })
        } catch (apiError) {
          console.warn('API调用失败:', apiError)
        }

        // 处理统计数据
        if (apiResponse && apiResponse.data) {
          this.statistics = apiResponse.data.statistics || []
          this.summary = apiResponse.data.summary || null
          console.log('使用API返回的数据:', this.statistics.length, '条')
        } else {
          // API失败或返回空，使用空数据
          this.statistics = []
          this.summary = null
          console.log('API未返回数据，使用空数据')
        }

        // 初始化地图
        await this.$nextTick()
        this.initMap()
      } catch (error) {
        console.error('加载世界地图数据失败:', error)
        this.$message.error('加载世界地图数据失败')
        // 使用空数据，不再使用缺省值
        this.statistics = []
        this.summary = null
        await this.$nextTick()
        this.initMap()
      } finally {
        this.loading = false
      }
    },

    // 获取默认中国地图统计数据
    // 注意：省份名称必须与 ECharts china.js 地图数据中的 properties.name 字段完全一致（使用简称）
    getDefaultChinaStatistics() {
      return [
        { name: '北京', value: 177, leads: 45, tenders: 32, policies: 28, news: 72 },
        { name: '天津', value: 42, leads: 12, tenders: 8, policies: 7, news: 15 },
        { name: '河北', value: 102, leads: 26, tenders: 22, policies: 18, news: 36 },
        { name: '山西', value: 81, leads: 21, tenders: 18, policies: 15, news: 27 },
        { name: '内蒙古', value: 47, leads: 12, tenders: 10, policies: 8, news: 17 },
        { name: '辽宁', value: 67, leads: 17, tenders: 14, policies: 12, news: 24 },
        { name: '吉林', value: 82, leads: 21, tenders: 18, policies: 15, news: 28 },
        { name: '黑龙江', value: 123, leads: 31, tenders: 27, policies: 22, news: 43 },
        { name: '上海', value: 24, leads: 6, tenders: 5, policies: 4, news: 9 },
        { name: '江苏', value: 92, leads: 23, tenders: 20, policies: 17, news: 32 },
        { name: '浙江', value: 114, leads: 29, tenders: 25, policies: 21, news: 39 },
        { name: '安徽', value: 109, leads: 28, tenders: 24, policies: 20, news: 37 },
        { name: '福建', value: 116, leads: 30, tenders: 26, policies: 21, news: 39 },
        { name: '江西', value: 91, leads: 23, tenders: 20, policies: 17, news: 31 },
        { name: '山东', value: 119, leads: 30, tenders: 26, policies: 22, news: 41 },
        { name: '河南', value: 137, leads: 35, tenders: 28, policies: 22, news: 52 },
        { name: '湖北', value: 116, leads: 30, tenders: 26, policies: 21, news: 39 },
        { name: '湖南', value: 114, leads: 29, tenders: 25, policies: 21, news: 39 },
        { name: '广东', value: 92, leads: 23, tenders: 20, policies: 17, news: 32 },
        { name: '广西', value: 59, leads: 15, tenders: 13, policies: 11, news: 20 },
        { name: '海南', value: 14, leads: 4, tenders: 3, policies: 2, news: 5 },
        { name: '重庆', value: 91, leads: 23, tenders: 20, policies: 17, news: 31 },
        { name: '四川', value: 125, leads: 32, tenders: 28, policies: 23, news: 42 },
        { name: '贵州', value: 62, leads: 16, tenders: 14, policies: 11, news: 21 },
        { name: '云南', value: 83, leads: 21, tenders: 18, policies: 15, news: 29 },
        { name: '西藏', value: 9, leads: 2, tenders: 2, policies: 2, news: 3 },
        { name: '陕西', value: 80, leads: 20, tenders: 18, policies: 15, news: 27 },
        { name: '甘肃', value: 56, leads: 14, tenders: 12, policies: 10, news: 20 },
        { name: '青海', value: 10, leads: 3, tenders: 2, policies: 2, news: 3 },
        { name: '宁夏', value: 18, leads: 5, tenders: 4, policies: 3, news: 6 },
        { name: '新疆', value: 67, leads: 17, tenders: 15, policies: 12, news: 23 },
        { name: '台湾', value: 0, leads: 0, tenders: 0, policies: 0, news: 0 },
        { name: '香港', value: 0, leads: 0, tenders: 0, policies: 0, news: 0 },
        { name: '澳门', value: 0, leads: 0, tenders: 0, policies: 0, news: 0 }
      ]
    },

    // 获取默认世界地图统计数据
    getDefaultWorldStatistics() {
      return [
        { name: 'China', value: 250, leads: 60, tenders: 45, policies: 40, news: 105 },
        { name: 'United States', value: 220, leads: 55, tenders: 40, policies: 35, news: 90 },
        { name: 'India', value: 180, leads: 45, tenders: 35, policies: 30, news: 70 },
        { name: 'Japan', value: 150, leads: 38, tenders: 30, policies: 25, news: 57 },
        { name: 'Germany', value: 140, leads: 35, tenders: 28, policies: 22, news: 55 },
        { name: 'United Kingdom', value: 130, leads: 32, tenders: 26, policies: 20, news: 52 },
        { name: 'France', value: 125, leads: 30, tenders: 25, policies: 18, news: 52 },
        { name: 'Brazil', value: 120, leads: 28, tenders: 24, policies: 18, news: 50 },
        { name: 'Russia', value: 115, leads: 27, tenders: 23, policies: 17, news: 48 },
        { name: 'Canada', value: 110, leads: 26, tenders: 22, policies: 16, news: 46 }
      ]
    },

    // 处理数据类型变化
    handleDataTypeChange(value) {
      this.$emit('data-type-change', value)
    },

    // 处理时间范围变化
    handleTimeRangeChange(value) {
      this.$emit('time-range-change', value)
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
      const mapName = this.mapType === 'china' ? 'china' : 'world'
      try {
        // 尝试获取已注册的地图，如果未注册会抛出错误
        echarts.getMap(mapName)
        console.log(`地图"${mapName}"已注册`)
      } catch (error) {
        console.error(`地图"${mapName}"未注册，请先加载地图数据`, error)
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

              // 根据当前选择的数据类型，决定是否显示详细分类
              if (this.dataType === 'all' && data.leads !== undefined) {
                // 显示全部：显示所有类别的详细数据
                const labels = this.typeLabels
                tooltip += `<br/>${labels.leads}: ${data.leads || 0}`
                tooltip += `<br/>${labels.tenders}: ${data.tenders || 0}`
                tooltip += `<br/>${labels.policies}: ${data.policies || 0}`
                tooltip += `<br/>${labels.news}: ${data.news || 0}`
              }
              // 如果选择了特定类别，只显示总数，不显示详细分类

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
            map: mapName,
            roam: true, // 开启缩放和平移
            zoom: this.mapType === 'china' ? 1.2 : 1.2,
            center: this.mapType === 'china' ? [105, 36] : [0, 0], // 设置地图中心点
            itemStyle: {
              borderColor: '#4fa8ff',
              borderWidth: 1
              // 移除areaColor，让visualMap控制颜色
            },
            emphasis: {
              label: {
                show: this.mapType === 'china', // 世界地图悬停时不显示标签
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
              show: this.mapType === 'china', // 世界地图不显示文字标签
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
          code: item.code,
          typeLabels: this.typeLabels
        }))
      }

      // 没有数据时返回空数组，不再使用缺省值
      return []
    },

    // 获取数据类型文本
    getDataTypeText() {
      const typeMap = {
        all: '全部数据',
        leads: this.typeLabels.leads,
        tenders: this.typeLabels.tenders,
        policies: this.typeLabels.policies,
        news: this.typeLabels.news
      }
      return typeMap[this.dataType] || '数据'
    },

    // 处理地图点击事件
    async handleMapClick(params) {
      console.log('点击了:', params.name)

      // 触发区域点击事件，传递省份名称和相关信息给父组件
      this.$emit('region-click', {
        name: params.name,
        code: params.data?.code || this.getRegionCodeByName(params.name),
        dataType: this.dataType,
        timeRange: this.timeRange,
        mapType: this.mapType
      })

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
          const labels = this.typeLabels

          let message = `${params.name}<br/>`

          if (this.dataType === 'all') {
            // 显示全部：显示所有类别的详细数据
            message += `总计: ${stats.total || 0}<br/>`
            message += `${labels.leads}: ${stats.leads || 0}<br/>`
            message += `${labels.tenders}: ${stats.tenders || 0}<br/>`
            message += `${labels.policies}: ${stats.policies || 0}<br/>`
            message += `${labels.news}: ${stats.news || 0}`
          } else {
            // 选择了特定类别：只显示该类别的数据
            const typeText = this.getDataTypeText()
            const typeField = this.dataType
            message += `${typeText}: ${stats[typeField] || 0}`
          }

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

      // 区域代码映射表（支持简称和全称）
      const regionCodeMap = {
        // 简称映射（ECharts 地图数据使用）
        '北京': '110000',
        '天津': '120000',
        '河北': '130000',
        '山西': '140000',
        '内蒙古': '150000',
        '辽宁': '210000',
        '吉林': '220000',
        '黑龙江': '230000',
        '上海': '310000',
        '江苏': '320000',
        '浙江': '330000',
        '安徽': '340000',
        '福建': '350000',
        '江西': '360000',
        '山东': '370000',
        '河南': '410000',
        '湖北': '420000',
        '湖南': '430000',
        '广东': '440000',
        '广西': '450000',
        '海南': '460000',
        '重庆': '500000',
        '四川': '510000',
        '贵州': '520000',
        '云南': '530000',
        '西藏': '540000',
        '陕西': '610000',
        '甘肃': '620000',
        '青海': '630000',
        '宁夏': '640000',
        '新疆': '650000',
        '台湾': '710000',
        '香港': '810000',
        '澳门': '820000',
        // 全称映射（兼容后端API可能返回的全称）
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

    // 切换视图模式（切换地图类型）
    async toggleViewMode() {
      // 切换地图类型
      this.mapType = this.mapType === 'china' ? 'world' : 'china'

      // 通知父组件地图类型已改变
      this.$emit('map-type-change', this.mapType)

      // 销毁当前地图实例
      if (this.mapChart) {
        this.mapChart.dispose()
        this.mapChart = null
      }

      // 重新加载地图数据
      await this.loadMapData()
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

