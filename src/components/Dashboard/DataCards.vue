<template>
  <div class="data-cards">
    <el-row :gutter="20" class="cards-row">
      <!-- 今日信息增量 -->
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="data-card" shadow="hover">
          <div class="card-content">
            <div class="card-info">
              <p class="card-label">今日信息增量</p>
              <h3 class="card-value">+128 条</h3>
              <div class="card-trend">
                <el-tag type="success" size="mini">
                  <i class="el-icon-top" />
                  较昨日 ↑ 15%
                </el-tag>
              </div>
            </div>
            <div class="card-icon blue">
              <svg-icon icon-class="form" />
            </div>
          </div>
          <div class="progress-section">
            <el-progress
              :percentage="75"
              :show-text="false"
              stroke-width="4"
              color="#409EFF"
            />
          </div>
        </el-card>
      </el-col>

      <!-- 客户线索 -->
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="data-card" shadow="hover">
          <div class="card-content">
            <div class="card-info">
              <p class="card-label">客户线索</p>
              <h3 class="card-value">24 条</h3>
              <div class="card-trend">
                <el-tag type="info" size="mini">待跟进</el-tag>
              </div>
            </div>
            <div class="card-icon green">
              <svg-icon icon-class="user" />
            </div>
          </div>
          <div class="progress-section">
            <el-progress
              :percentage="60"
              :show-text="false"
              stroke-width="4"
              color="#67C23A"
            />
          </div>
        </el-card>
      </el-col>

      <!-- 最新论文 -->
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="data-card" shadow="hover">
          <div class="card-content">
            <div class="card-info">
              <p class="card-label">最新论文</p>
              <h3 class="card-value">12篇</h3>
              <div class="card-trend">
                <el-tag type="warning" size="mini">
                  <i class="el-icon-top" />
                  较上月 ↑ 8.5%
                </el-tag>
              </div>
            </div>
            <div class="card-icon amber">
              <svg-icon icon-class="table" />
            </div>
          </div>
          <div class="progress-section">
            <el-progress
              :percentage="45"
              :show-text="false"
              stroke-width="4"
              color="#E6A23C"
            />
          </div>
        </el-card>
      </el-col>

      <!-- 预警监控数 -->
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="data-card" shadow="hover">
          <div class="card-content">
            <div class="card-info">
              <p class="card-label">预警监控数</p>
              <h3 class="card-value">5 个</h3>
              <div class="card-trend">
                <el-tag type="danger" size="mini">竞品重大动态</el-tag>
              </div>
            </div>
            <div class="card-icon red">
              <svg-icon icon-class="eye" />
            </div>
          </div>
          <div class="progress-section">
            <el-progress
              :percentage="30"
              :show-text="false"
              stroke-width="4"
              color="#F56C6C"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'DataCards',
  data() {
    return {
      // 静态数据，后续可以改为从API获取
      dataCards: [
        {
          label: '今日信息增量',
          value: '+128 条',
          trend: { type: 'success', text: '较昨日 ↑ 15%', icon: 'fas fa-arrow-up' },
          progress: 75,
          icon: { class: 'fas fa-file-alt', color: 'blue' }
        },
        {
          label: '客户线索',
          value: '24 条',
          trend: { type: 'muted', text: '待跟进' },
          progress: 60,
          icon: { class: 'fas fa-user-plus', color: 'green' }
        },
        {
          label: '最新论文',
          value: '12篇',
          trend: { type: 'warning', text: '较上月 ↑ 8.5%', icon: 'fas fa-arrow-up' },
          progress: 45,
          icon: { class: 'fas fa-line-chart', color: 'amber' }
        },
        {
          label: '预警监控数',
          value: '5 个',
          trend: { type: 'danger', text: '竞品重大动态', icon: 'fas fa-exclamation-circle' },
          progress: 30,
          icon: { class: 'fas fa-bell', color: 'red' }
        }
      ]
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
