<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
    </div>
    <agent-float-button :show-fab="!($route.meta && $route.meta.hideAgentFab)" />
    <el-drawer
      :visible.sync="agentPanelOpen"
      direction="rtl"
      size="525px"
      append-to-body
      :close-on-press-escape="true"
      :modal-append-to-body="true"
      :with-header="false"
      :show-close="false"
    >
      <agent-module />
    </el-drawer>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import AgentFloatButton from '@/components/AgentFloatButton.vue'
import AgentModule from '@/views/databoard/AgentModule.vue'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    AgentFloatButton,
    AgentModule
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    agentPanelOpen: {
      get() {
        return this.$store.state.app.agentPanelOpen
      },
      set(val) {
        this.$store.dispatch('app/setAgentPanelOpen', val)
      }
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  ::v-deep .el-drawer__body {
    padding: 0;
    height: 100%;
    display: flex;
  }
</style>
