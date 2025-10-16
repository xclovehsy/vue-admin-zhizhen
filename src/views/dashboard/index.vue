<template>
  <div class="dashboard-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">致真信息大脑 - 控制台</h1>
          <p class="page-subtitle">全域感知，智能决策</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" size="small" icon="el-icon-date">
            今日
          </el-button>
        </div>
      </div>
    </div>

    <!-- 每日AI简报 -->
    <DailyReport />

    <!-- 核心数据指标卡 -->
    <DataCards />

    <!-- 今日全球要闻 -->
    <NewsFeed />

    <!-- 客户与线索跟踪 -->
    <!-- <LeadsTracking /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DailyReport from '@/components/Dashboard/DailyReport.vue'
import DataCards from '@/components/Dashboard/DataCards.vue'
import NewsFeed from '@/components/Dashboard/NewsFeed.vue'
import LeadsTracking from '@/components/Dashboard/LeadsTracking.vue'

export default {
  name: 'Dashboard',
  components: {
    DailyReport,
    DataCards,
    NewsFeed,
    LeadsTracking
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  background-color: #F5F7FA;
  min-height: 100vh;

  .page-header {
    margin-bottom: 24px;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .title-section {
        .page-title {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          font-size: 14px;
          color: #909399;
          margin: 0;
        }
      }

      .header-actions {
        .el-button {
          font-weight: 500;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;

    .page-header {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;

        .title-section {
          .page-title {
            font-size: 20px;
          }
        }

        .header-actions {
          align-self: flex-end;
        }
      }
    }
  }
}
</style>
