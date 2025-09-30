<template>
  <div class="data-cards" v-loading="loading">
    <el-row :gutter="20" class="cards-row">
      <el-col 
        v-for="card in dataCards" 
        :key="card.id"
        :xs="24" 
        :sm="12" 
        :md="6" 
        :lg="6" 
        :xl="6"
      >
        <el-card class="data-card" shadow="hover">
          <div class="card-content">
            <div class="card-info">
              <p class="card-label">{{ card.label }}</p>
              <h3 class="card-value">{{ card.value }}</h3>
              <div class="card-trend">
                <el-tag :type="card.trend.type" size="mini">
                  <i v-if="card.trend.icon" :class="card.trend.icon" />
                  {{ card.trend.text }}
                </el-tag>
              </div>
            </div>
            <div class="card-icon" :class="card.icon.color">
              <svg-icon :icon-class="card.icon.class" />
            </div>
          </div>
          <div class="progress-section">
            <el-progress
              :percentage="card.progress"
              :show-text="false"
              :stroke-width="4"
              :color="getProgressColor(card.icon.color)"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDataCards } from '@/api/dashboard'

export default {
  name: 'DataCards',
  data() {
    return {
      dataCards: [],
      loading: false
    }
  },
  mounted() {
    this.fetchDataCards()
  },
  methods: {
    async fetchDataCards() {
      this.loading = true
      try {
        const response = await getDataCards({
          period: 'day'
        })
        this.dataCards = response.data.cards || []
      } catch (error) {
        console.error('获取数据指标失败:', error)
        this.$message.error('获取数据指标失败')
        // 使用默认数据作为降级方案
        this.dataCards = [
          {
            id: 1,
            label: '今日信息增量',
            value: '-- 条',
            trend: { type: 'success', text: '较昨日 ↑ --%', icon: 'el-icon-top' },
            progress: 75,
            icon: { class: 'form', color: 'blue' }
          },
          {
            id: 2,
            label: '客户线索',
            value: '-- 条',
            trend: { type: 'info', text: '待跟进' },
            progress: 60,
            icon: { class: 'user', color: 'green' }
          },
          {
            id: 3,
            label: '最新论文',
            value: '-- 篇',
            trend: { type: 'warning', text: '较上月 ↑ --%', icon: 'el-icon-top' },
            progress: 45,
            icon: { class: 'table', color: 'amber' }
          },
          {
            id: 4,
            label: '预警监控数',
            value: '-- 个',
            trend: { type: 'danger', text: '竞品重大动态' },
            progress: 30,
            icon: { class: 'eye', color: 'red' }
          }
        ]
      } finally {
        this.loading = false
      }
    },
    getProgressColor(color) {
      const colors = {
        blue: '#409EFF',
        green: '#67C23A',
        amber: '#E6A23C',
        red: '#F56C6C'
      }
      return colors[color] || '#409EFF'
    }
  }
}
</script>

<style lang="scss" scoped>
.data-cards {
  .cards-row {
    margin-bottom: 20px;
  }

  .data-card {
    margin-bottom: 20px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;

      .card-info {
        flex: 1;

        .card-label {
          font-size: 14px;
          color: #909399;
          margin: 0 0 8px 0;
        }

        .card-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          margin: 0 0 8px 0;
        }

        .card-trend {
          .el-tag {
            font-size: 12px;
          }
        }
      }

      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;

        &.blue {
          background-color: #ecf5ff;
          color: #409EFF;
        }

        &.green {
          background-color: #f0f9ff;
          color: #67C23A;
        }

        &.amber {
          background-color: #fdf6ec;
          color: #E6A23C;
        }

        &.red {
          background-color: #fef0f0;
          color: #F56C6C;
        }
      }
    }

    .progress-section {
      .el-progress {
        .el-progress-bar__outer {
          background-color: #f5f7fa;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .data-cards {
    .cards-row {
      .el-col {
        margin-bottom: 16px;
      }
    }
  }
}
</style>
