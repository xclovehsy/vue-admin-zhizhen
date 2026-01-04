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
    <DailyReport @highlight-click="handleHighlightClick" />

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
          <agent-module ref="agentModule" />
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
  },
  methods: {
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
      const recommendations = highlightData.recommendations || ''

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
    }
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
