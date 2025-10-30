<template>
  <div class="data-module">
    <el-card shadow="hover" :body-style="{ height: 'calc(100vh - 140px)' }">
      <div slot="header" class="clearfix">
        <span class="module-title">数据模块</span>
      </div>
      <div class="module-content">
        <p>数据展示区域</p>
        <!-- 这里可以添加数据表格、图表等 -->
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'DataModule',
  data() {
    return {
      // 数据相关状态
    }
  },
  mounted() {
    // 初始化数据
  },
  methods: {
    // 数据相关方法
  }
}
</script>

<style lang="scss" scoped>
.data-module {
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

