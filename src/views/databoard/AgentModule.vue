<template>
  <div class="agent-module">
    <el-card shadow="hover" :body-style="{ height: 'calc(100vh - 140px)' }">
      <div slot="header" class="clearfix">
        <span class="module-title">智能体模块</span>
      </div>
      <div class="module-content">
        <p>智能体交互区域</p>
        <!-- 这里可以添加智能体对话、操作界面等 -->
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AgentModule',
  data() {
    return {
      // 智能体相关状态
    }
  },
  mounted() {
    // 初始化智能体
  },
  methods: {
    // 智能体相关方法
  }
}
</script>

<style lang="scss" scoped>
.agent-module {
  height: 100%;

  .module-title {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }

  .module-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #909399;
  }
}
</style>

