<template>
  <div class="databoard-container">
    <!-- 顶部导航栏 -->
    <div class="top-header">
      <div class="header-left">
        <div class="logo-container">
          <i class="el-icon-cpu logo-icon"></i>
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
    </div>

    <!-- 主要内容区 -->
    <div class="main-content-container">
      <div class="main-content">

        <!-- 下方：两列布局 -->
        <el-row :gutter="10" class="content-row">
          <!-- 左侧列：地图 + DataModule -->
          <el-col :span="18" class="content-col">
            <div class="middle-content">
              <div class="top-content" style="margin-bottom: 10px;">
                <info-overview @item-click="scrollToDetail" />
              </div>

              <el-row :gutter="10" class="middle-row">
                <!-- 左侧：地图区域 + 柱状图 -->
                <el-col :span="12" class="left-map-col">
                  <div class="map-column">
                    <!-- 地图区域 -->
                    <div class="map-section">
                      <map-module />
                    </div>
                    <!-- 区域热度柱状图 -->
                    <div class="chart-section">
                      <regional-heat-chart />
                    </div>
                  </div>
                </el-col>
                
                <!-- 右侧：DataModule -->
                <el-col :span="12" class="right-data-col">
                  <div class="data-column">
                    <data-module />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>

          <!-- 右侧列：智能助手 -->
          <el-col :span="6" class="content-col agent-col">
            <div class="right-column">
              <agent-module />
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
import InfoOverview from '@/components/Dashboard/InfoOverview.vue'
import RegionalHeatChart from '@/components/Dashboard/RegionalHeatChart.vue'

export default {
  name: 'DataBoardView',
  components: {
    MapModule,
    DataModule,
    AgentModule,
    InfoOverview,
    RegionalHeatChart
  },
  data() {
    return {
      viewMode: 'domestic' // domestic | international
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
  overflow: hidden;
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
    
    .content-col {
      height: 100%;
      display: flex;
      flex-direction: column;
      
      // 右侧列（智能助手）
      &.agent-col {
        padding-left: 10px;
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
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    
    ::v-deep .el-card {
      margin-bottom: 0;
      height: 100%;
    }
  }

  .chart-section {
    flex-shrink: 0;
    height: 280px;
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
