<template>
  <div class="databoard-container">
    <el-row :gutter="20" class="databoard-row">
      <el-col :span="8" class="databoard-col">
        <map-module />
      </el-col>
      <el-col :span="8" class="databoard-col">
        <data-module />
      </el-col>
      <el-col :span="8" class="databoard-col">
        <agent-module />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MapModule from './databoard/MapModule.vue'
import DataModule from './databoard/DataModule.vue'
import AgentModule from './databoard/AgentModule.vue'

export default {
  name: 'DataBoardView',
  components: {
    MapModule,
    DataModule,
    AgentModule
  }
}
</script>

<style lang="scss" scoped>
.databoard-container {
  padding: 20px;
  height: calc(100vh - 50px);
  overflow: hidden;

  .databoard-row {
    height: 100%;

    .databoard-col {
      height: 100%;
    }
  }
}
</style>


