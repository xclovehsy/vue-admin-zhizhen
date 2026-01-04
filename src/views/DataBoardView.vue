<template>
  <div class="databoard-container">
    <!-- 顶部导航栏 -->
    <!-- <div class="top-header">
      <div class="header-left">
        <div class="logo-container">
          <i class="el-icon-cpu logo-icon" />
          <div class="logo-text">
            <h1 class="app-name">致真信息大脑</h1>
            <p class="app-subtitle">全域感知，智能决策</p>
          </div>
        </div>
      </div>
      <div class="header-right">
        <el-button-group>
          <el-button size="small" :type="viewMode === 'domestic' ? 'primary' : ''" @click="switchView('domestic')">
            国内视角
          </el-button>
          <el-button size="small" :type="viewMode === 'international' ? 'primary' : ''" @click="switchView('international')">
            国际视角
          </el-button>
        </el-button-group>
      </div>
    </div> -->

    <!-- 主要内容区 -->
    <div class="main-content-container">
      <div class="main-content">

        <!-- 下方：两列布局 -->
        <el-row :gutter="10" class="content-row">
          <!-- 左侧列：地图 + DataModule -->
          <el-col :span="16" class="content-col">
            <div class="middle-content">
              <div class="top-content" style="margin-bottom: 10px;">
                <!-- <info-overview @item-click="scrollToDetail" /> -->
                <simple-daily-report
                  @highlight-click="handleHighlightClick"
                  @info-overview-click="handleInfoOverviewClick"
                />
              </div>

              <el-row :gutter="10" class="middle-row">
                <!-- 左侧：地图区域 + 柱状图 -->
                <el-col :span="12" class="left-map-col">
                  <div class="map-column">
                    <!-- 地图区域 -->
                    <div class="map-section">
                      <map-module
                        :data-type="filterDataType"
                        :time-range="filterTimeRange"
                        @data-type-change="handleDataTypeChange"
                        @time-range-change="handleTimeRangeChange"
                        @map-type-change="handleMapTypeChange"
                        @region-click="handleRegionClick"
                      />
                    </div>
                    <!-- 区域热度柱状图 -->
                    <div class="chart-section">
                      <regional-heat-chart
                        :data-type="filterDataType"
                        :time-range="filterTimeRange"
                        :map-type="mapType"
                        @region-click="handleRegionClick"
                      />
                    </div>
                  </div>
                </el-col>

                <!-- 右侧：DataModule -->
                <el-col :span="12" class="right-data-col">
                  <div class="data-column">
                    <data-module @chart-click="handleChartClick" />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>

          <!-- 右侧列：智能助手 -->
          <el-col :span="8" class="content-col agent-col">
            <div class="right-column">
              <agent-module ref="agentModule" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import MapModule from './databoard/MapModule.vue'
import DataModule from './databoard/DataModule.vue'
import AgentModule from './databoard/AgentModule.vue'
import RegionalHeatChart from '@/components/Databoard/RegionalHeatChart.vue'
import SimpleDailyReport from '@/components/Databoard/SimpleDailyReport.vue'

export default {
  name: 'DataBoardView',
  components: {
    MapModule,
    DataModule,
    AgentModule,
    RegionalHeatChart,
    SimpleDailyReport
  },
  data() {
    return {
      viewMode: 'domestic', // domestic | international
      // 地图和图表的联动筛选条件
      filterDataType: 'all',
      filterTimeRange: 'month',
      mapType: 'china' // 地图类型：china/world
    }
  },
  methods: {
    switchView(mode) {
      this.viewMode = mode
      this.$message.info(`切换到${mode === 'domestic' ? '国内' : '国际'}视角`)
      // TODO: 通知子组件切换视角
      // 可以通过事件总线或props传递视角变化
    },
    scrollToDetail(item) {
      // TODO: 滚动到页面下方的"今日全球要问"区域
      this.$message.info(`跳转到${item.label}详情`)
    },
    // 处理地图数据类型变化
    handleDataTypeChange(dataType) {
      this.filterDataType = dataType
      console.log('数据类型切换:', dataType)
    },
    // 处理地图时间范围变化
    handleTimeRangeChange(timeRange) {
      this.filterTimeRange = timeRange
      console.log('时间范围切换:', timeRange)
    },
    // 处理地图类型变化
    handleMapTypeChange(mapType) {
      this.mapType = mapType
      console.log('地图类型切换:', mapType)
    },
    // 处理地图区域点击事件
    handleRegionClick(region) {
      // 生成合适的prompt并传递给智能体模块
      if (this.$refs.agentModule && region && region.name) {
        const prompt = this.generateRegionPrompt(region)
        this.$refs.agentModule.setInputMessage(prompt)
      }
    },
    // 根据区域信息生成合适的prompt
    generateRegionPrompt(region) {
      const regionName = region.name
      const dataType = region.dataType || this.filterDataType
      const timeRange = region.timeRange || this.filterTimeRange
      const mapType = region.mapType || this.mapType

      // 时间范围文本映射
      const timeRangeText = {
        day: '当天',
        week: '近一周',
        month: '近一月',
        quarter: '近一季度',
        year: '近一年'
      }[timeRange] || '近期'

      // 根据地图类型和数据类型生成不同的prompt模板
      const prompts = []

      if (mapType === 'china') {
        // 中国地图的prompt模板
        if (dataType === 'all') {
          prompts.push(
            `${regionName}地区${timeRangeText}的整体态势如何？包括政策支持、市场动态、技术突破等方面。`,
            `请分析${regionName}在${timeRangeText}内的竞品动态、招标机会、相关论文和新闻消息的整体情况。`,
            `${regionName}地区${timeRangeText}有哪些值得关注的政策、市场和技术动态？`
          )
        } else if (dataType === 'leads') {
          prompts.push(
            `${regionName}地区${timeRangeText}有哪些竞品动态值得关注？`,
            `请分析${regionName}在${timeRangeText}内的竞品公司活动和技术进展。`,
            `${regionName}的竞品动态${timeRangeText}有什么新变化？`
          )
        } else if (dataType === 'tenders') {
          prompts.push(
            `${regionName}地区${timeRangeText}有哪些招标机会可以重点关注？`,
            `请汇总${regionName}在${timeRangeText}内的招标需求信息。`,
            `${regionName}的招标市场${timeRangeText}情况如何？`
          )
        } else if (dataType === 'policies') {
          prompts.push(
            `${regionName}地区${timeRangeText}有哪些相关政策或论文值得关注？`,
            `请分析${regionName}在${timeRangeText}内的政策支持和学术研究动态。`,
            `${regionName}的政策和论文${timeRangeText}有什么新进展？`
          )
        } else if (dataType === 'news') {
          prompts.push(
            `${regionName}地区${timeRangeText}有哪些重要新闻消息？`,
            `请汇总${regionName}在${timeRangeText}内的新闻动态。`,
            `${regionName}的新闻消息${timeRangeText}有什么值得关注的？`
          )
        }
      } else {
        // 世界地图的prompt模板
        if (dataType === 'all') {
          prompts.push(
            `${regionName}地区${timeRangeText}的整体态势如何？包括政策支持、市场动态、技术突破等方面。`,
            `请分析${regionName}在${timeRangeText}内的竞品动态、招标机会、相关论文和新闻消息的整体情况。`,
            `${regionName}地区${timeRangeText}有哪些值得关注的政策、市场和技术动态？`
          )
        } else if (dataType === 'leads') {
          prompts.push(
            `${regionName}地区${timeRangeText}有哪些竞品动态值得关注？`,
            `请分析${regionName}在${timeRangeText}内的竞品公司活动和技术进展。`,
            `${regionName}的竞品动态${timeRangeText}有什么新变化？`
          )
        } else if (dataType === 'tenders') {
          prompts.push(
            `${regionName}地区${timeRangeText}有哪些招标机会可以重点关注？`,
            `请汇总${regionName}在${timeRangeText}内的招标需求信息。`,
            `${regionName}的招标市场${timeRangeText}情况如何？`
          )
        } else if (dataType === 'policies') {
          prompts.push(
            `${regionName}地区${timeRangeText}有哪些相关政策或论文值得关注？`,
            `请分析${regionName}在${timeRangeText}内的政策支持和学术研究动态。`,
            `${regionName}的政策和论文${timeRangeText}有什么新进展？`
          )
        } else if (dataType === 'news') {
          prompts.push(
            `${regionName}地区${timeRangeText}有哪些重要新闻消息？`,
            `请汇总${regionName}在${timeRangeText}内的新闻动态。`,
            `${regionName}的新闻消息${timeRangeText}有什么值得关注的？`
          )
        }
      }

      // 随机选择一个prompt，或者返回第一个
      const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)] || prompts[0]

      // 直接返回prompt，不添加@标记
      return selectedPrompt
    },
    // 处理图表点击事件
    handleChartClick(chartData) {
      // 生成合适的prompt并传递给智能体模块
      if (this.$refs.agentModule && chartData) {
        const prompt = this.generateChartPrompt(chartData)
        this.$refs.agentModule.setInputMessage(prompt)
      }
    },
    // 根据图表信息生成合适的prompt
    generateChartPrompt(chartData) {
      const chartTitle = chartData.chartTitle || ''
      const name = chartData.name || chartData.seriesName || ''
      const value = chartData.value || chartData.data || ''
      const dataIndex = chartData.dataIndex !== undefined ? chartData.dataIndex : null

      // 根据不同的图表类型生成不同的prompt
      const prompts = []

      if (chartTitle === '政策新闻') {
        prompts.push(
          `请分析${name || '政策新闻'}的相关情况，包括政策背景、影响范围和行业意义。`,
          `关于${name || '政策新闻'}，有哪些值得关注的政策动态和行业影响？`,
          `请详细解读${name || '政策新闻'}的政策内容和市场影响。`
        )
      } else if (chartTitle === '行业新闻') {
        prompts.push(
          `请分析${name || '行业新闻'}的相关情况，包括行业动态、市场趋势和技术发展。`,
          `关于${name || '行业新闻'}，有哪些值得关注的行业动态和市场变化？`,
          `请详细解读${name || '行业新闻'}的行业意义和发展趋势。`
        )
      } else if (chartTitle === '近六个月招标消息') {
        const monthName = dataIndex !== null && chartData.chartData?.xAxisData?.[dataIndex] ? chartData.chartData.xAxisData[dataIndex] : name
        prompts.push(
          `${monthName || '近期'}的招标市场情况如何？有哪些值得关注的招标机会？`,
          `请分析${monthName || '近期'}招标消息的特点和趋势，识别潜在商机。`,
          `关于${monthName || '近期'}的招标需求，有哪些关键信息需要关注？`
        )
      } else if (chartTitle === '竞品公司动态') {
        prompts.push(
          `请分析${name || '竞品公司'}的动态情况，包括业务发展、产品更新和市场策略。`,
          `关于${name || '竞品公司'}，有哪些值得关注的动态和变化？`,
          `请详细解读${name || '竞品公司'}的最新动态和行业影响。`
        )
      } else if (chartTitle === '科技论文主题') {
        prompts.push(
          `请分析${name || '科技论文主题'}的研究现状和发展趋势，包括关键技术突破和应用前景。`,
          `关于${name || '科技论文主题'}，有哪些值得关注的研究进展和技术创新？`,
          `请详细解读${name || '科技论文主题'}的研究内容和行业意义。`
        )
      } else if (chartTitle === '各研究主题数量变化') {
        const monthName = dataIndex !== null && chartData.chartData?.xAxisData?.[dataIndex] ? chartData.chartData.xAxisData[dataIndex] : name
        prompts.push(
          `请分析${name || '研究主题'}在${monthName || '近期'}的研究进展和数量变化趋势。`,
          `关于${name || '研究主题'}在${monthName || '近期'}的研究动态，有哪些值得关注的变化？`,
          `请详细解读${name || '研究主题'}在${monthName || '近期'}的研究情况和未来趋势。`
        )
      } else {
        // 通用prompt
        prompts.push(
          `请分析${chartTitle}中${name || '相关数据'}的情况和趋势。`,
          `关于${chartTitle}中的${name || '相关数据'}，有哪些值得关注的信息？`,
          `请详细解读${chartTitle}中${name || '相关数据'}的含义和影响。`
        )
      }

      // 随机选择一个prompt
      const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)] || prompts[0]

      // 如果有具体的值，可以添加到prompt中
      if (value && typeof value === 'number') {
        return `${selectedPrompt}（当前数值：${value}）`
      }

      return selectedPrompt
    },
    // 处理每日简报项点击事件
    handleHighlightClick(highlightData) {
      if (this.$refs.agentModule && highlightData) {
        const prompt = this.generateHighlightPrompt(highlightData)
        this.$refs.agentModule.setInputMessage(prompt)
      }
    },
    // 根据每日简报信息生成合适的prompt
    generateHighlightPrompt(highlightData) {
      const title = highlightData.title || ''
      const category = highlightData.category || ''
      const summary = highlightData.summary || ''

      const prompts = []

      // 根据类别生成不同的prompt
      if (category === '政策动态' || category === '政策新闻') {
        prompts.push(
          `请详细分析这条政策动态：${title}。包括政策背景、主要内容、影响范围和行业意义。`,
          `关于政策动态"${title}"，请解读其政策内容和市场影响，并提供相关建议。`,
          `请分析政策动态"${title}"的政策背景、关键要点和行业影响。`
        )
      } else if (category === '行业动态' || category === '行业新闻') {
        prompts.push(
          `请详细分析这条行业动态：${title}。包括行业趋势、市场变化和技术发展。`,
          `关于行业动态"${title}"，请解读其行业意义和发展趋势，并提供相关建议。`,
          `请分析行业动态"${title}"的市场影响、技术趋势和行业前景。`
        )
      } else if (category === '竞品动态' || category === '竞品信息') {
        prompts.push(
          `请详细分析这条竞品动态：${title}。包括竞品公司活动、产品更新和市场策略。`,
          `关于竞品动态"${title}"，请解读其业务发展和技术进展，并提供相关建议。`,
          `请分析竞品动态"${title}"的市场影响、技术突破和竞争态势。`
        )
      } else if (category === '学术论文' || category === '相关论文') {
        prompts.push(
          `请详细分析这篇学术论文：${title}。包括研究内容、技术突破和应用前景。`,
          `关于学术论文"${title}"，请解读其研究内容和行业意义，并提供相关建议。`,
          `请分析学术论文"${title}"的研究进展、关键技术和发展趋势。`
        )
      } else if (category === '招标机会') {
        prompts.push(
          `请详细分析这个招标机会：${title}。包括招标需求、市场机会和参与建议。`,
          `关于招标机会"${title}"，请解读其招标内容和市场价值，并提供相关建议。`,
          `请分析招标机会"${title}"的招标需求、市场前景和参与策略。`
        )
      } else if (category === '新闻消息') {
        prompts.push(
          `请详细分析这条新闻消息：${title}。包括新闻背景、关键信息和行业影响。`,
          `关于新闻消息"${title}"，请解读其新闻内容和市场影响，并提供相关建议。`,
          `请分析新闻消息"${title}"的新闻背景、关键要点和行业意义。`
        )
      } else {
        // 通用prompt
        prompts.push(
          `请详细分析这条信息：${title}。包括背景、关键内容和行业影响。`,
          `关于"${title}"，请解读其内容和意义，并提供相关建议。`,
          `请分析"${title}"的关键要点、市场影响和发展趋势。`
        )
      }

      // 如果有摘要，可以添加到prompt中
      if (summary) {
        const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)] || prompts[0]
        return `${selectedPrompt}\n\n相关信息：${summary}`
      }

      // 随机选择一个prompt
      return prompts[Math.floor(Math.random() * prompts.length)] || prompts[0]
    },
    // 处理信息概览卡片点击事件
    handleInfoOverviewClick(item) {
      if (this.$refs.agentModule && item) {
        const prompt = this.generateInfoOverviewPrompt(item)
        this.$refs.agentModule.setInputMessage(prompt)
      }
    },
    // 根据信息概览卡片生成合适的prompt
    generateInfoOverviewPrompt(item) {
      const label = item.label || ''
      const value = item.value || ''
      const change = item.change || 0

      const prompts = []

      // 根据标签生成不同的prompt
      if (label.includes('政策') || label.includes('政策动态')) {
        prompts.push(
          `请分析${label}的最新情况，当前数据为${value}。${change !== 0 ? `较上期${change > 0 ? '增长' : '下降'}${Math.abs(change)}%。` : ''}包括政策趋势、市场影响和相关建议。`,
          `关于${label}，当前数据为${value}，${change !== 0 ? `变化趋势为${change > 0 ? '上升' : '下降'}${Math.abs(change)}%。` : ''}请解读其政策内容和行业意义。`
        )
      } else if (label.includes('行业') || label.includes('行业动态')) {
        prompts.push(
          `请分析${label}的最新情况，当前数据为${value}。${change !== 0 ? `较上期${change > 0 ? '增长' : '下降'}${Math.abs(change)}%。` : ''}包括行业趋势、市场变化和技术发展。`,
          `关于${label}，当前数据为${value}，${change !== 0 ? `变化趋势为${change > 0 ? '上升' : '下降'}${Math.abs(change)}%。` : ''}请解读其行业意义和发展前景。`
        )
      } else if (label.includes('竞品') || label.includes('竞品动态')) {
        prompts.push(
          `请分析${label}的最新情况，当前数据为${value}。${change !== 0 ? `较上期${change > 0 ? '增长' : '下降'}${Math.abs(change)}%。` : ''}包括竞品活动、市场策略和竞争态势。`,
          `关于${label}，当前数据为${value}，${change !== 0 ? `变化趋势为${change > 0 ? '上升' : '下降'}${Math.abs(change)}%。` : ''}请解读其市场影响和竞争意义。`
        )
      } else if (label.includes('论文') || label.includes('学术')) {
        prompts.push(
          `请分析${label}的最新情况，当前数据为${value}。${change !== 0 ? `较上期${change > 0 ? '增长' : '下降'}${Math.abs(change)}%。` : ''}包括研究进展、技术突破和应用前景。`,
          `关于${label}，当前数据为${value}，${change !== 0 ? `变化趋势为${change > 0 ? '上升' : '下降'}${Math.abs(change)}%。` : ''}请解读其研究内容和行业意义。`
        )
      } else if (label.includes('招标')) {
        prompts.push(
          `请分析${label}的最新情况，当前数据为${value}。${change !== 0 ? `较上期${change > 0 ? '增长' : '下降'}${Math.abs(change)}%。` : ''}包括招标趋势、市场机会和参与建议。`,
          `关于${label}，当前数据为${value}，${change !== 0 ? `变化趋势为${change > 0 ? '上升' : '下降'}${Math.abs(change)}%。` : ''}请解读其市场价值和参与策略。`
        )
      } else if (label.includes('新闻')) {
        prompts.push(
          `请分析${label}的最新情况，当前数据为${value}。${change !== 0 ? `较上期${change > 0 ? '增长' : '下降'}${Math.abs(change)}%。` : ''}包括新闻趋势、关键信息和行业影响。`,
          `关于${label}，当前数据为${value}，${change !== 0 ? `变化趋势为${change > 0 ? '上升' : '下降'}${Math.abs(change)}%。` : ''}请解读其新闻内容和市场意义。`
        )
      } else {
        // 通用prompt
        prompts.push(
          `请分析${label}的最新情况，当前数据为${value}。${change !== 0 ? `较上期${change > 0 ? '增长' : '下降'}${Math.abs(change)}%。` : ''}包括趋势分析、关键要点和相关建议。`,
          `关于${label}，当前数据为${value}，${change !== 0 ? `变化趋势为${change > 0 ? '上升' : '下降'}${Math.abs(change)}%。` : ''}请解读其内容和意义。`
        )
      }

      // 随机选择一个prompt
      return prompts[Math.floor(Math.random() * prompts.length)] || prompts[0]
    }
  }
}
</script>

<style lang="scss" scoped>
.databoard-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  overflow: hidden;
}

// 顶部导航栏
.top-header {
  height: 70px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  z-index: 100;

  .header-left {
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;

      .logo-icon {
        font-size: 32px;
        color: #409EFF;
      }

      .logo-text {
        .app-name {
          margin: 0;
          font-size: 20px;
          font-weight: bold;
          color: #303133;
          line-height: 1.2;
        }

        .app-subtitle {
          margin: 0;
          font-size: 12px;
          color: #909399;
          line-height: 1.2;
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
  }
}

// 主内容容器
.main-content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: auto; // 允许水平滚动，确保右侧列可见
  overflow-y: hidden;
  padding: 20px;
  background-color: #f5f7fa;
}

// 主要内容区
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  min-height: 0;

  // 顶部：信息增量区域（横跨整个宽度）
  .top-content {
    flex-shrink: 0;
  }

  // 下方：两列布局
  .content-row {
    flex: 1;
    min-height: 0;
    display: flex;
    overflow: visible; // 确保内容可见

    .content-col {
      height: 100%;
      display: flex;
      flex-direction: column;
      min-width: 0; // 防止 flex 子元素溢出

      // 右侧列（智能助手）
      &.agent-col {
        padding-left: 10px;
        flex-shrink: 0; // 防止右侧列被压缩
        min-width: 300px; // 确保最小宽度
      }
    }
  }

  // 中间内容区域
  .middle-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .middle-row {
      flex: 1;
      min-height: 0;
      height: 100%;

      .left-map-col {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .right-data-col {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    }
  }
}

// 地图列
.map-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .map-section {
    flex: 3;
    min-height: 0;
    display: flex;
    flex-direction: column;

    ::v-deep .el-card {
      margin-bottom: 0;
      height: 100%;
    }
  }

  .chart-section {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;

    ::v-deep .el-card {
      margin-bottom: 0;
      height: 100%;
    }
  }
}

// 数据列
.data-column {
  height: 100%;
  display: flex;
  flex-direction: column;

  ::v-deep .el-card {
    height: 100%;
    margin-bottom: 0;
  }
}

// 右侧列（智能助手）
.right-column {
  height: 100%;
  display: flex;
  flex-direction: column;

  ::v-deep .el-card {
    height: 100%;
    margin-bottom: 0;
  }
}

// 响应式设计
@media (max-width: 1600px) {
  // 响应式样式已移至 InfoOverview 组件内部
}

@media (max-width: 1200px) {
  .main-content {
    .content-row {
      .content-col {
        &:nth-child(1) {
          order: 2;
        }
        &:nth-child(2) {
          order: 1;
        }
      }
    }
  }
}
</style>
