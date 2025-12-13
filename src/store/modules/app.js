import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  agentPanelOpen: false
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_AGENT_PANEL_OPEN: (state, bool) => {
    state.agentPanelOpen = !!bool
  },
  TOGGLE_AGENT_PANEL: (state) => {
    state.agentPanelOpen = !state.agentPanelOpen
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setAgentPanelOpen({ commit }, bool) {
    commit('SET_AGENT_PANEL_OPEN', bool)
  },
  toggleAgentPanel({ commit }) {
    commit('TOGGLE_AGENT_PANEL')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
