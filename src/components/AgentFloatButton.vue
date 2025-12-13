<template>
  <div class="agent-fab" v-if="showFab" :aria-label="ariaLabel" :title="ariaLabel">
    <el-avatar
      class="fab-avatar"
      :size="fabSize"
      :src="avatarSrc"
      @click.native="openAgentPanel"
    >
      <i :class="icon" />
    </el-avatar>
  </div>
</template>

<script>
export default {
  name: 'AgentFloatButton',
  props: {
    icon: {
      type: String,
      default: 'el-icon-message'
    },
    fabSize: {
      type: Number,
      default: 48
    },
    ariaLabel: {
      type: String,
      default: '打开智能体'
    },
    showFab: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      avatarSrc: require('@/assets/agent_avator.jpg')
    }
  },
  methods: {
    openAgentPanel() {
      this.$store.dispatch('app/toggleDevice', this.$store.state.app.device)
      this.$store.dispatch('app/setAgentPanelOpen', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.agent-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2100;
  .fab-avatar {
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  }
}

@media (max-width: 768px) {
  .agent-fab {
    right: 16px;
    bottom: 16px;
  }
}
</style>
