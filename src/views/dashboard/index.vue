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

    <!-- 智能助手（聊天模块） -->
    <div class="agent-section">
      <el-row :gutter="20">
        <el-col :span="24">
          <agent-module />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DailyReport from '@/components/Dashboard/DailyReport.vue'
import DataCards from '@/components/Dashboard/DataCards.vue'
import NewsFeed from '@/components/Dashboard/NewsFeed.vue'
// import LeadsTracking from '@/components/Dashboard/LeadsTracking.vue' // 已注释，未使用
import AgentModule from '@/views/databoard/AgentModule.vue'

export default {
  name: 'Dashboard',
  components: {
    DailyReport,
    DataCards,
    NewsFeed,
    // LeadsTracking, // 已注释，未使用
    AgentModule
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

  // 智能助手区域样式
  .agent-section {
    margin-top: 20px;
    width: 100%;
    height: 600px; // 设置容器高度，确保子组件能正确显示

    ::v-deep .el-card {
      height: 100%; // 使用 100% 继承父容器高度
    }

    ::v-deep .agent-module {
      height: 100%; // 确保组件占满父容器
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

  .agent-section {
    margin-top: 20px;
    width: 100%;
    height: 500px; // 响应式模式下稍微降低高度

    ::v-deep .el-card {
      height: 100%; // 使用 100% 继承父容器高度
    }

    ::v-deep .agent-module {
      height: 100%; // 确保组件占满父容器
    }
  }
}
</style>
