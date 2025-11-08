<template>
  <div class="agent-initial-report">
    <!-- AI 头像和欢迎消息 -->
    <!-- <div class="report-header">
      <el-avatar :size="60" :src="aiAvatar" class="report-avatar">
        <i class="el-icon-cpu" />
      </el-avatar>
      <div class="welcome-text">
        <h3 class="welcome-title">嗨，我是致真智能体！</h3>
        <p class="welcome-desc">为您精选了今日重点信息，让我们开始吧</p>
      </div>
    </div> -->

    <!-- 关键信息卡片 -->
    <div class="highlights-container">
      <div class="highlights-header">
        <i class="el-icon-data-analysis" />
        <span class="highlights-title">政策解读</span>
      </div>

      <p>....</p>
      <p>....</p>
      <p>....</p>
      <p>....</p>
      <p>....</p>
    </div>


    <div class="highlights-container">
      <div class="highlights-header">
        <i class="el-icon-data-analysis" />
        <span class="highlights-title">论文报告</span>
      </div>

      <p>....</p>
      <p>....</p>
      <p>....</p>
      <p>....</p>
      <p>....</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AgentInitialReport',
  data() {
    return {
    }
  },
  mounted() {
    // this.fetchReport()
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.agent-initial-report {
  width: 100%;
  max-width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;

  .report-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;

    .report-avatar {
      flex-shrink: 0;
      border: 3px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-text {
      flex: 1;

      .welcome-title {
        margin: 0 0 6px 0;
        font-size: 18px;
        font-weight: 600;
        color: white;
      }

      .welcome-desc {
        margin: 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.4;
      }
    }
  }

  .highlights-container {
    background: #f7f8fa;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid #e4e7ed;

    .highlights-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e4e7ed;

      i {
        font-size: 18px;
        color: #409EFF;
      }

      .highlights-title {
        flex: 1;
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }
    }

    .highlights-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .highlight-item {
        display: flex;
        gap: 12px;
        background: white;
        padding: 12px;
        border-radius: 8px;
        transition: all 0.3s ease;
        border: 1px solid #ebeef5;

        &:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-color: #409EFF;
        }

        .item-badge {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: white;

          &.priority-high {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }

          &.priority-medium {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          }

          &.priority-low {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          }
        }

        .item-content {
          flex: 1;
          min-width: 0;

          .item-category {
            margin-bottom: 6px;
          }

          .item-text {
            margin: 0;
            font-size: 13px;
            line-height: 1.6;
            color: #606266;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>

