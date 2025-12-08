<template>
  <div class="agent-module">
    <el-card shadow="hover" :body-style="{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }">
      <!-- 顶部导航栏 -->
      <div slot="header" class="top-header">
        <!-- <div class="header-left">
          <i class="el-icon-arrow-left header-back-icon" @click="handleBack"></i>
        </div> -->
        <div class="header-center">
          <el-avatar :size="40" :src="aiAvatar" class="header-avatar">
            <i class="el-icon-cpu" />
          </el-avatar>
          <div class="header-info">
            <div class="ai-name">致真智能体</div>
            <div class="ai-tag">内容由 AI 生成</div>
          </div>
        </div>
        <!-- <div class="header-right">
          <div class="header-icon-wrapper" @click="handlePhoneCall">
            <i class="el-icon-phone header-icon" />
            <span class="icon-badge"></span>
          </div>
          <i class="el-icon-microphone header-icon speaker-icon" :class="{ active: isSpeakerActive }" @click="handleSpeakerToggle"></i>
          <i class="el-icon-more header-icon" @click="handleMoreOptions"></i>
        </div> -->
      </div>

      <!-- 消息区域 -->
      <div class="chat-container">
        <div class="message-list" ref="messageList">
          <div class="messages">
            <!-- AI 欢迎区域 -->
            <div v-if="showWelcome" class="welcome-section">
              <!-- 初始报告组件 -->
              <agent-initial-report />

              <!-- 建议提示 -->
              <div class="suggestions-section">
                <div class="suggestions-header">
                  <i class="el-icon-chat-dot-round" />
                  <span>试试这些问题</span>
                </div>
                <div class="suggestions-grid">
                  <div
                    v-for="suggestion in suggestions"
                    :key="suggestion.id"
                    class="suggestion-item"
                    :class="suggestion.gradient"
                    @click="handleSuggestion(suggestion)"
                  >
                    <div class="suggestion-icon">
                      <i :class="suggestion.icon" />
                    </div>
                    <div class="suggestion-text">
                      {{ suggestion.text }}
                    </div>
                    <div class="suggestion-arrow">
                      <i class="el-icon-right" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 消息列表 -->
            <div v-for="(message, index) in messages" :key="index" class="message-wrapper">
              <!-- 时间戳 -->
              <div v-if="message.showTime" class="message-timestamp">
                {{ message.time }}
              </div>

              <!-- AI 消息 -->
              <div v-if="message.type === 'ai'" class="message-item ai-message">
                <div class="message-avatar">
                  <el-avatar :size="32" :src="aiAvatar">
                    <i class="el-icon-cpu" />
                  </el-avatar>
                </div>
                <div class="message-content">
                  <div class="message-bubble ai-bubble" :class="{ loading: message.loading, error: message.error }">
                    <!-- 思考过程 + 详细日志统一卡片 -->
                    <div
                      v-if="(message.thinkingSteps && message.thinkingSteps.length > 0) || (message.detailLogs && message.detailLogs.length > 0)"
                      class="thinking-process"
                    >
                      <div class="thinking-header" @click="toggleThinkingProcess(message)">
                        <i class="el-icon-cpu thinking-icon" />
                        <span class="thinking-title">思考过程</span>
                        <i
                          :class="message.showThinking !== false ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                          class="thinking-toggle"
                        />
                      </div>
                      <div v-show="message.showThinking !== false">
                        <!-- 步骤列表：只展示已经到达的步骤 -->
                        <div
                          v-if="message.thinkingSteps && message.thinkingSteps.length > 0"
                          class="thinking-steps"
                          :ref="`thinkingSteps-${index}`"
                        >
                          <div
                            v-for="step in getVisibleSteps(message)"
                            :key="step.id"
                            class="thinking-step"
                            :class="`step-${step.status}`"
                          >
                            <div class="step-indicator">
                              <i v-if="step.status === 'completed'" class="el-icon-check step-icon completed" />
                              <i v-else-if="step.status === 'running'" class="el-icon-loading step-icon running" />
                              <i v-else class="step-icon pending" />
                            </div>
                            <div class="step-content">
                              <div class="step-title">{{ step.title }}</div>
                              <div v-if="step.content" class="step-detail">{{ step.content }}</div>
                            </div>
                          </div>
                        </div>

                        <!-- 详细日志（可折叠） -->
                        <div v-if="message.detailLogs && message.detailLogs.length" class="thinking-detail">
                          <div class="detail-header" @click="toggleDetailLogs(message)">
                            <span class="detail-title">研究进展（详细日志）</span>
                            <i
                              :class="message.showDetailLogs !== false ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                              class="detail-toggle"
                            />
                          </div>
                          <div
                            v-show="message.showDetailLogs !== false"
                            class="detail-list"
                            :ref="`detailList-${index}`"
                          >
                            <div
                              v-for="(log, i) in message.detailLogs"
                              :key="i"
                              class="detail-item"
                              :class="`detail-${log.level || 'info'}`"
                            >
                              <span class="detail-time">{{ log.time }}</span>
                              <span class="detail-content">{{ log.content }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 加载状态 - 仅在没有思考步骤且没有内容时显示 -->
                    <span
                      v-if="message.loading && (!message.thinkingSteps || message.thinkingSteps.length === 0) && !message.content"
                      class="loading-dots"
                    >
                      <span /><span /><span />
                    </span>
                    <!-- 内容展示 - 显示在思考过程下方 -->
                    <div v-if="message.content" class="markdown-content" v-html="renderMarkdown(message.content)" />
                  </div>
                </div>
              </div>

              <!-- 用户消息 -->
              <div v-else-if="message.type === 'user'" class="message-item user-message">
                <div class="message-content">
                  <div class="message-bubble user-bubble">
                    {{ message.content }}
                  </div>
                </div>
                <div class="message-avatar">
                  <el-avatar :size="32" icon="el-icon-user-solid" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷功能区域 -->
        <div class="feature-shortcuts">
          <div
            v-for="feature in features"
            :key="feature.id"
            class="feature-item"
            @click="handleFeature(feature)"
          >
            <i :class="feature.icon" class="feature-icon" />
            <span class="feature-text">{{ feature.text }}</span>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-wrapper">
            <input
              v-model="inputMessage"
              type="text"
              class="message-input"
              placeholder="发消息..."
              :disabled="sending"
              @keydown.enter="handleSendMessage"
            >
            <el-button
              class="send-button"
              type="primary"
              size="small"
              icon="el-icon-s-promotion"
              :loading="sending"
              :disabled="!inputMessage.trim()"
              @click="handleSendMessage"
            >
              发送
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { chatWithAgentStream, getChatHistory } from '@/api/agent/chat'
import marked from 'marked'
import agentAvatar from '@/assets/agent_avator.jpg'
import AgentInitialReport from '@/components/Databoard/AgentInitialReport.vue'

export default {
  name: 'AgentModule',
  components: {
    AgentInitialReport
  },
  data() {
    return {
      inputMessage: '',
      sending: false,
      aiAvatar: agentAvatar,
      isSpeakerActive: true,
      showWelcome: true,
      conversationHistory: [], // 对话历史记录
      sessionId: null, // 当前会话ID
      streamController: null, // 流式传输控制器
      // 临时系统提示词（仅对下一次调用生效，用后即清空）
      // 基础提示词和全局提示词已移至后端配置文件
      temporarySystemPrompts: [],
      // 研究进度信息
      researchProgress: {
        visible: false,
        messages: [] // 进度消息列表
      },
      currentEvidence: [], // 当前回答的证据列表（已通过思考过程展示）
      suggestions: [
        { id: 1, text: '近期有哪些新出台的高端科学仪器国产化相关政策？', icon: 'el-icon-document-checked', gradient: 'gradient-1' },
        { id: 2, text: '过去一个月，原子力显微镜的整体态势：政策支持、头部公司动态、技术突破？', icon: 'el-icon-data-analysis', gradient: 'gradient-2' },
        { id: 3, text: '近一周有哪些新的招标需求可重点关注？', icon: 'el-icon-tickets', gradient: 'gradient-3' }
      ],
      messages: [],
      // 思考过程相关状态
      thinkingSteps: [], // 当前消息的思考步骤列表
      currentThinkingStep: null, // 当前正在执行的步骤
      showThinkingProcess: false, // 是否显示思考过程
      thinkingStepIdCounter: 0, // 步骤ID计数器
      features: [
        { id: 1, text: '数据分析', icon: 'el-icon-data-line', task_type: 'data', prompt: '请针对致真精密仪器公司现有业务数据进行分析，识别数据趋势和异常，生成与公司产品、市场、研发相关的数据洞察报告。' },
        { id: 2, text: '生成报告', icon: 'el-icon-document', task_type: 'research', prompt: '请结合网络上最新的行业局势，针对致真精密仪器公司的业务情况生成一份详细的研究报告，包含公司背景、市场分析、竞争态势、技术发展趋势和结论。' },
        { id: 3, text: '预测趋势', icon: 'el-icon-arrow-up', task_type: 'research', prompt: '请基于致真精密仪器公司的历史数据和当前市场情况，预测公司在精密仪器、半导体测试设备等领域的未来趋势。' },
        { id: 4, text: '智能建议', icon: 'el-icon-magic-stick', task_type: 'chat', prompt: '请基于致真精密仪器公司的当前业务情况，提供针对公司产品研发、市场拓展、技术创新的智能建议和优化方案。' }
      ]
    }
  },
  mounted() {
    // 初始化智能体
    this.scrollToBottom()

    // 配置 marked 选项（marked 4.x 兼容）
    if (typeof marked.setOptions === 'function') {
      marked.setOptions({
        breaks: true, // 支持换行
        gfm: true, // 支持GitHub风格的Markdown
        headerIds: false, // 不生成header ID
        mangle: false // 不混淆邮箱地址
      })
    }

    // 如果有sessionId，加载历史记录
    if (this.sessionId) {
      this.loadChatHistory()
    }
  },
  methods: {
    /**
     * 设置一次性临时系统提示词（仅对下一次对话请求生效）
     * @param {string|Array<string>} prompts
     */
    setTemporarySystemPrompt(prompts) {
      if (!prompts) return
      const list = Array.isArray(prompts) ? prompts : [prompts]
      const valid = list
        .map(p => (p || '').trim())
        .filter(p => p.length > 0)
      this.temporarySystemPrompts.push(...valid)
    },
    /** 清空临时系统提示词 */
    clearTemporarySystemPrompts() {
      this.temporarySystemPrompts = []
    },
    /** 组合临时提示词（基础提示词和全局提示词已移至后端配置文件） */
    buildTemporaryPrompts() {
      // 只返回临时提示词数组，由后端与配置文件中的提示词组合
      const extras = (this.temporarySystemPrompts || [])
        .map(p => (p || '').trim())
        .filter(p => p.length > 0)
      return extras
    },
    /**
     * 将Markdown文本渲染为HTML
     * @param {string} markdown - Markdown文本
     * @returns {string} HTML字符串
     */
    renderMarkdown(markdown) {
      if (!markdown) return ''
      try {
        // marked 4.x 兼容写法
        const options = {
          breaks: true, // 支持换行
          gfm: true, // 支持GitHub风格的Markdown
          headerIds: false, // 不生成header ID
          mangle: false // 不混淆邮箱地址
        }

        // 优先使用 parse 方法，否则直接调用
        if (typeof marked.parse === 'function') {
          return marked.parse(markdown, options)
        } else {
          return marked(markdown, options)
        }
      } catch (error) {
        console.error('Markdown渲染错误:', error)
        return markdown // 如果渲染失败，返回原始文本
      }
    },
    /**
     * 获取当前应展示的思考步骤（只展示已到达的步骤）
     * @param {Object} message - 消息对象
     * @returns {Array} 可见步骤列表
     */
    getVisibleSteps(message) {
      const steps = message && Array.isArray(message.thinkingSteps)
        ? message.thinkingSteps
        : []
      if (!steps.length) return []

      // 优先找到正在运行的步骤
      let currentIndex = steps.findIndex(step => step.status === 'running')

      // 如果没有 running，说明流程可能已经结束，取最后一个 completed
      if (currentIndex === -1) {
        const lastCompletedReversedIndex = [...steps]
          .reverse()
          .findIndex(step => step.status === 'completed')
        if (lastCompletedReversedIndex === -1) {
          // 没有任何 completed，保留第一个步骤
          currentIndex = 0
        } else {
          currentIndex = steps.length - 1 - lastCompletedReversedIndex
        }
      }

      if (currentIndex < 0) currentIndex = 0

      // 只展示从第一个到当前步骤之间的所有步骤
      return steps.slice(0, currentIndex + 1)
    },
    /**
     * 解析进度消息并更新思考步骤
     * @param {number} messageIndex - 消息索引
     * @param {string} progressMessage - 进度消息文本
     * @param {Object} progressData - 完整的进度数据
     */
    updateThinkingSteps(messageIndex, progressMessage, progressData) {
      if (!this.messages[messageIndex]) return
      const message = this.messages[messageIndex]

      // 固定顺序的时间线步骤
      const orderedSteps = [
        { type: 'start', title: '开始研究' },
        { type: 'plan', title: '规划研究策略' },
        { type: 'research', title: '执行研究查询' },
        { type: 'scrape', title: '抓取网页内容' },
        { type: 'extract', title: '提取相关内容' },
        { type: 'write', title: '撰写报告' },
        { type: 'complete', title: '研究完成' }
      ]

      // 第一次收到进度时初始化整条时间线
      if (!Array.isArray(message.thinkingSteps) || message.thinkingSteps.length === 0) {
        message.thinkingSteps = orderedSteps.map((step, index) => ({
          id: `step-${step.type}-${index}`,
          type: step.type,
          title: step.title,
          content: '',
          status: 'pending',
          order: index,
          timestamp: null
        }))
      }

      // 解析当前进度对应的步骤类型
      const stepInfo = this.parseThinkingStep(progressMessage)
      if (!stepInfo) return

      // 只处理在固定时间线中的步骤，其它类型（如 info）只作为详细日志展示
      const targetIndex = message.thinkingSteps.findIndex(s => s.type === stepInfo.type)
      if (targetIndex === -1) {
        // 不在主时间线中的类型（如 info），不改变步骤顺序
        return
      }

      // 进入思考过程时默认展开
      if (message.showThinking === undefined) {
        message.showThinking = true
      }

      // 根据目标索引更新所有步骤的状态，保证最多只有一个 running
      message.thinkingSteps = message.thinkingSteps.map((step, index) => {
        const updated = { ...step }
        if (index < targetIndex) {
          updated.status = 'completed'
        } else if (index === targetIndex) {
          updated.status = 'running'
          updated.content = stepInfo.content || step.content
          updated.timestamp = Date.now()
        } else {
          // 还未到达的步骤保持 pending
          if (updated.status !== 'completed') {
            updated.status = 'pending'
          }
        }
        return updated
      })

      // 触发响应式更新并滚到底部
      this.$set(this.messages, messageIndex, message)
      this.$nextTick(() => {
        // 整个聊天区域滚到底
        this.scrollToBottom()

        // 思考步骤列表内部滚到底（如果存在滚动条）
        const refName = `thinkingSteps-${messageIndex}`
        let stepsEl = this.$refs[refName]
        if (Array.isArray(stepsEl)) {
          stepsEl = stepsEl[0]
        }
        if (stepsEl && stepsEl.scrollHeight !== undefined) {
          stepsEl.scrollTop = stepsEl.scrollHeight
        }
      })
    },
    /**
     * 解析进度消息，识别步骤类型和内容
     * @param {string} message - 进度消息文本
     * @returns {Object|null} 步骤信息对象
     */
    parseThinkingStep(message) {
      if (!message || typeof message !== 'string') return null
      
      const msg = message.toLowerCase()
      
      // 步骤类型映射
      const stepPatterns = [
        {
          pattern: /starting|开始|启动/i,
          type: 'start',
          title: '开始研究',
          extractContent: (m) => m.replace(/.*starting.*?for\s*['"]?([^'"]+)['"]?/i, '研究任务：$1').trim()
        },
        {
          pattern: /planning|规划|策略/i,
          type: 'plan',
          title: '规划研究策略',
          extractContent: (m) => {
            const match = m.match(/planning.*?queries?[:\s]+\[(.*?)\]/i)
            return match ? `子查询：${match[1]}` : '制定研究计划'
          }
        },
        {
          pattern: /running research|执行研究|运行研究/i,
          type: 'research',
          title: '执行研究查询',
          extractContent: (m) => {
            const match = m.match(/running research for\s*['"]?([^'"]+)['"]?/i)
            return match ? `查询：${match[1]}` : '正在搜索相关信息'
          }
        },
        {
          pattern: /added source|添加来源|添加.*url/i,
          type: 'source',
          title: '添加信息来源',
          extractContent: (m) => {
            const urlMatch = m.match(/https?:\/\/[^\s]+/i)
            return urlMatch ? `来源：${urlMatch[0]}` : '发现新的信息来源'
          }
        },
        {
          pattern: /scraping|抓取|爬取/i,
          type: 'scrape',
          title: '抓取网页内容',
          extractContent: (m) => {
            const urlMatch = m.match(/https?:\/\/[^\s]+/i)
            return urlMatch ? `正在抓取：${urlMatch[0]}` : '正在抓取网页内容'
          }
        },
        {
          pattern: /getting relevant|提取相关|获取相关/i,
          type: 'extract',
          title: '提取相关内容',
          extractContent: (m) => {
            const match = m.match(/getting relevant content.*?query[:\s]+['"]?([^'"]+)['"]?/i)
            return match ? `提取：${match[1]}` : '正在提取相关内容'
          }
        },
        {
          pattern: /writing report|撰写报告|生成报告/i,
          type: 'write',
          title: '撰写报告',
          extractContent: () => '正在生成最终报告'
        },
        {
          pattern: /finalized|完成|结束/i,
          type: 'complete',
          title: '研究完成',
          extractContent: () => '研究任务已完成'
        }
      ]
      
      // 匹配步骤模式
      for (const pattern of stepPatterns) {
        if (pattern.pattern.test(msg)) {
          return {
            type: pattern.type,
            title: pattern.title,
            content: pattern.extractContent ? pattern.extractContent(message) : message
          }
        }
      }
      
      // 如果没有匹配到特定模式，返回通用步骤
      return {
        type: 'info',
        title: '处理中',
        content: message
      }
    },
    /**
     * 切换思考过程的显示/隐藏
     * @param {Object} message - 消息对象
     */
    toggleThinkingProcess(message) {
      if (message) {
        message.showThinking = !message.showThinking
        this.$forceUpdate()
      }
    },
    /**
     * 切换详细日志显示/隐藏
     * @param {Object} message - 消息对象
     */
    toggleDetailLogs(message) {
      if (!message) return
      // 默认展开，当第一次点击时收起
      const current = message.showDetailLogs
      message.showDetailLogs = current === false ? true : false
      this.$forceUpdate()
    },
    handleBack() {
      // TODO: 实现返回功能
      // 1. 可以返回上一页或关闭当前对话
      // 2. 可以添加确认对话框询问是否保存对话记录
      // 3. 可以清空当前对话或返回列表页
      this.$message({
        message: '返回功能待开发：可以返回上一页、保存对话记录或清空对话',
        type: 'info',
        duration: 3000
      })
    },
    handlePhoneCall() {
      // TODO: 实现语音通话功能
      // 1. 调用浏览器 WebRTC API 或第三方语音通话服务
      // 2. 需要实现音频捕获和播放
      // 3. 可以集成第三方语音通话 SDK（如声网、腾讯云等）
      // 4. 显示通话界面和控制按钮
      this.$message({
        message: '语音通话功能待开发：需要集成 WebRTC 或第三方语音通话服务',
        type: 'info',
        duration: 3000
      })
    },
    handleSpeakerToggle() {
      // TODO: 实现扬声器开关功能
      // 1. 切换音频输出模式（扬声器/听筒）
      // 2. 可以用于语音播报 AI 回复内容
      // 3. 控制音量大小
      this.isSpeakerActive = !this.isSpeakerActive
      this.$message({
        message: this.isSpeakerActive
          ? '扬声器已开启：功能待完善，可添加语音播报 AI 回复内容'
          : '扬声器已关闭：功能待完善，可添加音频输出模式切换',
        type: 'info',
        duration: 2000
      })
    },
    handleMoreOptions() {
      // TODO: 实现更多选项功能
      // 1. 显示下拉菜单或弹出框
      // 2. 包含：清空对话、导出对话、设置、反馈等功能
      // 3. 可以添加对话历史管理
      this.$message({
        message: '更多选项功能待开发：可添加清空对话、导出对话、设置、反馈等功能',
        type: 'info',
        duration: 3000
      })
    },
    async handleSendMessage() {
      // 默认使用自动路由
      await this.sendMessageWithTaskType(this.inputMessage.trim(), 'auto')
    },
    async sendMessageWithTaskType(userContent, taskType = 'auto') {
      if (!userContent || this.sending) {
        return
      }

      // 如果已有流式传输在进行，先取消
      if (this.streamController) {
        this.streamController.cancel()
        this.streamController = null
      }

      // 隐藏欢迎区域
      if (this.showWelcome) {
        this.showWelcome = false
      }

      // 添加用户消息
      const userMessage = {
        type: 'user',
        content: userContent,
        time: this.getCurrentTime(),
        showTime: true
      }
      this.messages.push(userMessage)

      // 添加到对话历史
      this.conversationHistory.push({
        role: 'user',
        content: userContent
      })

      // 清空输入框
      this.inputMessage = ''
      this.sending = true

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      // 添加加载中的AI消息
      const loadingMessage = {
        type: 'ai',
        content: '',
        time: '',
        showTime: false,
        loading: true,
        thinkingSteps: [], // 思考步骤列表
        showThinking: true, // 默认展开思考过程
        evidence: [] // NEW: 证据占位
      }
      this.messages.push(loadingMessage)
      const loadingIndex = this.messages.length - 1
      this.currentEvidence = [] // 清空证据占位

      try {
        // 调用后端流式API
        // 系统提示词由后端从配置文件读取，前端只传递临时提示词
        const temporaryPrompts = this.buildTemporaryPrompts()
        let aiContent = ''

        this.streamController = chatWithAgentStream(
          {
            message: userContent,
            session_id: this.sessionId,
            temporary_prompts: temporaryPrompts, // 只传递临时提示词
            conversation_history: this.conversationHistory.slice(0, -1), // 排除刚添加的用户消息
            task_type: taskType, // 传递任务类型：'research' 强制使用 GPT-Researcher, 'chat' 使用 Qwen, 'auto' 自动路由
            options: {
              temperature: 0.8,
              top_p: 0.8
            }
          },
          {
            onProgress: (progressData) => {
              // 处理研究进度信息
              if (progressData && progressData.type === 'progress') {
                const progressMessage = progressData.output || progressData.content || '研究进行中...'
                
                // 解析进度消息并更新思考步骤
                this.updateThinkingSteps(loadingIndex, progressMessage, progressData)

                // 将详细日志写入当前 AI 消息
                const msg = this.messages[loadingIndex]
                if (!msg.detailLogs) msg.detailLogs = []
                msg.detailLogs.push({
                  time: new Date().toLocaleTimeString(),
                  content: progressMessage,
                  level: progressData.content || 'info'
                })
                // 默认展开详细日志
                if (msg.showDetailLogs === undefined) {
                  msg.showDetailLogs = true
                }
                this.$set(this.messages, loadingIndex, msg)

                // 滚动详细日志区域和整体消息列表到底部
                this.$nextTick(() => {
                  const refName = `detailList-${loadingIndex}`
                  let detailEl = this.$refs[refName]
                  if (Array.isArray(detailEl)) {
                    detailEl = detailEl[0]
                  }
                  if (detailEl && detailEl.scrollHeight !== undefined) {
                    detailEl.scrollTop = detailEl.scrollHeight
                  }
                  this.scrollToBottom()
                })
                console.log('📊 [进度]', progressMessage)
              }
            },
            onEvidence: (items) => {
              // NEW: 将 evidence 映射为思考过程 & 日志（复用现有 UI）
              const currentMessage = this.messages[loadingIndex] || {}
              const evidenceList = Array.isArray(items) ? items : []
              if (!currentMessage.detailLogs) currentMessage.detailLogs = []
              evidenceList.forEach(ev => {
                const title = ev && ev.title ? ev.title : '未命名事件'
                const sim = ev && ev.similarity != null ? Number(ev.similarity).toFixed(2) : '—'
                currentMessage.detailLogs.push({
                  time: new Date().toLocaleTimeString(),
                  content: `找到证据：${title}（相似度 ${sim}）`,
                  level: 'info'
                })
              })
              if (!Array.isArray(currentMessage.thinkingSteps) || currentMessage.thinkingSteps.length === 0) {
                currentMessage.thinkingSteps = [{
                  id: 'step-rag-0',
                  type: 'rag',
                  title: '向量检索',
                  content: '',
                  status: 'completed',
                  order: 0,
                  timestamp: Date.now()
                }]
              } else {
                const idx = currentMessage.thinkingSteps.findIndex(s => s.type === 'rag')
                if (idx === -1) {
                  currentMessage.thinkingSteps.push({
                    id: `step-rag-${currentMessage.thinkingSteps.length}`,
                    type: 'rag',
                    title: '向量检索',
                    content: '',
                    status: 'completed',
                    order: currentMessage.thinkingSteps.length,
                    timestamp: Date.now()
                  })
                } else {
                  currentMessage.thinkingSteps[idx].status = 'completed'
                  currentMessage.thinkingSteps[idx].timestamp = Date.now()
                }
              }
              this.$set(this.messages, loadingIndex, currentMessage)
            },
            onChunk: (chunk) => {
              // 接收数据块，实时更新
              if (chunk) {
                // 当开始接收内容时，隐藏进度显示
                if (this.researchProgress.visible && aiContent.length === 0) {
                  this.researchProgress.visible = false
                }
                aiContent += chunk
                // 使用Vue.set确保响应式更新
                const currentMessage = this.messages[loadingIndex] || {}
                // 保持思考过程可见，即使开始收到内容（默认展开）
                const shouldShowThinking = currentMessage.showThinking !== false
                this.$set(this.messages, loadingIndex, {
                  ...currentMessage, // 保留 detailLogs / thinkingSteps / showDetailLogs 等
                  type: 'ai',
                  content: aiContent,
                  time: '',
                  showTime: false,
                  loading: false, // 内容开始显示，不再显示加载动画
                  thinkingSteps: currentMessage.thinkingSteps || [],
                  showThinking: shouldShowThinking
                })
                // 实时滚动到底部
                this.$nextTick(() => {
                  this.scrollToBottom()
                })
                // 调试信息（开发环境默认开启）
                if (process.env.NODE_ENV === 'development') {
                  console.log('📝 [发送] 更新消息内容，当前长度:', aiContent.length, 'chunk:', chunk)
                }
              }
            },
            onDone: (data) => {
              // 流式传输完成
              this.sending = false
              this.streamController = null

              // 将所有运行中的思考步骤标记为完成
              const currentMessage = this.messages[loadingIndex]
              if (currentMessage && currentMessage.thinkingSteps) {
                currentMessage.thinkingSteps.forEach(step => {
                  if (step.status === 'running') {
                    step.status = 'completed'
                  }
                })
                // 触发响应式更新
                this.$set(this.messages, loadingIndex, currentMessage)
              }

              // 更新会话ID（如果是新会话）
              if (data && data.session_id) {
                this.sessionId = data.session_id
              }

              // 添加到对话历史
              if (aiContent) {
                this.conversationHistory.push({
                  role: 'assistant',
                  content: aiContent
                })
              }

              // 同步右侧证据面板
              const finalMsg = this.messages[loadingIndex] || {}
              this.currentEvidence = finalMsg.evidence || []

              // 限制历史记录长度，避免超出token限制
              if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20)
              }

              // 临时系统提示词为一次性，调用完成后清空
              this.clearTemporarySystemPrompts()

              // 滚动到底部
              this.$nextTick(() => {
                this.scrollToBottom()
              })
            },
            onError: (error) => {
              // 处理错误
              console.error('流式传输错误:', error)
              this.sending = false
              this.streamController = null

              let errorMsg = '抱歉，服务暂时不可用，请稍后再试。'
              if (error.message) {
                errorMsg = `网络错误: ${error.message}`
              }

              this.messages[loadingIndex] = {
                type: 'ai',
                content: errorMsg,
                time: '',
                showTime: false,
                loading: false,
                error: true
              }

              this.$message.error('发送消息失败')

              // 临时系统提示词为一次性，调用完成后清空
              this.clearTemporarySystemPrompts()
            }
          }
        )
      } catch (error) {
        console.error('API调用失败:', error)
        this.sending = false
        this.streamController = null

        // 更新错误消息
        let errorMsg = '抱歉，服务暂时不可用，请稍后再试。'
        if (error.response) {
          if (error.response.status === 401) {
            errorMsg = 'API密钥无效，请检查配置。'
          } else if (error.response.status === 429) {
            errorMsg = '请求过于频繁，请稍后再试。'
          } else if (error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message
          }
        } else if (error.message) {
          errorMsg = `网络错误: ${error.message}`
        }

        this.messages[loadingIndex] = {
          type: 'ai',
          content: errorMsg,
          time: '',
          showTime: false,
          loading: false,
          error: true
        }

        this.$message.error('发送消息失败')

        // 临时系统提示词为一次性，调用完成后清空
        this.clearTemporarySystemPrompts()
      }
    },
    async handleSuggestion(suggestion) {
      // 隐藏欢迎区域
      if (this.showWelcome) {
        this.showWelcome = false
      }

      // 添加用户消息
      const userMessage = {
        type: 'user',
        content: suggestion.text,
        time: this.getCurrentTime(),
        showTime: true
      }
      this.messages.push(userMessage)

      // 添加到对话历史
      this.conversationHistory.push({
        role: 'user',
        content: suggestion.text
      })

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      // 添加加载中的AI消息
      const loadingMessage = {
        type: 'ai',
        content: '正在思考中...',
        time: '',
        showTime: false,
        loading: true,
        thinkingSteps: [], // 思考步骤列表
        showThinking: true, // 默认展开思考过程
        evidence: [] // NEW: 证据占位
      }
      this.messages.push(loadingMessage)
      const loadingIndex = this.messages.length - 1
      this.sending = true
      this.currentEvidence = [] // 清空证据占位

      try {
        // 调用后端流式API
        // 系统提示词由后端从配置文件读取，前端只传递临时提示词
        const temporaryPrompts = this.buildTemporaryPrompts()
        let aiContent = ''

        this.streamController = chatWithAgentStream(
          {
            message: suggestion.text,
            session_id: this.sessionId,
            temporary_prompts: temporaryPrompts, // 只传递临时提示词
            conversation_history: this.conversationHistory.slice(0, -1),
            options: {
              temperature: 0.8,
              top_p: 0.8
            }
          },
          {
            onProgress: (progressData) => {
              // 处理研究进度信息
              if (progressData && progressData.type === 'progress') {
                const progressMessage = progressData.output || progressData.content || '研究进行中...'
                // 解析进度消息并更新思考步骤
                this.updateThinkingSteps(loadingIndex, progressMessage, progressData)

                // 将详细日志写入当前 AI 消息
                const msg = this.messages[loadingIndex]
                if (!msg.detailLogs) msg.detailLogs = []
                msg.detailLogs.push({
                  time: new Date().toLocaleTimeString(),
                  content: progressMessage,
                  level: progressData.content || 'info'
                })
                if (msg.showDetailLogs === undefined) {
                  msg.showDetailLogs = true
                }
                this.$set(this.messages, loadingIndex, msg)

                // 滚动详细日志区域和整体消息列表到底部
                this.$nextTick(() => {
                  const refName = `detailList-${loadingIndex}`
                  let detailEl = this.$refs[refName]
                  if (Array.isArray(detailEl)) {
                    detailEl = detailEl[0]
                  }
                  if (detailEl && detailEl.scrollHeight !== undefined) {
                    detailEl.scrollTop = detailEl.scrollHeight
                  }
                  this.scrollToBottom()
                })

                console.log('📊 [进度]', progressMessage)
              }
            },
            onEvidence: (items) => {
              // NEW: 证据事件，写入思考过程与日志
              const currentMessage = this.messages[loadingIndex] || {}
              const evidenceList = Array.isArray(items) ? items : []
              if (!currentMessage.detailLogs) currentMessage.detailLogs = []
              evidenceList.forEach(ev => {
                const title = ev && ev.title ? ev.title : '未命名事件'
                const sim = ev && ev.similarity != null ? Number(ev.similarity).toFixed(2) : '—'
                currentMessage.detailLogs.push({
                  time: new Date().toLocaleTimeString(),
                  content: `找到证据：${title}（相似度 ${sim}）`,
                  level: 'info'
                })
              })
              if (!Array.isArray(currentMessage.thinkingSteps) || currentMessage.thinkingSteps.length === 0) {
                currentMessage.thinkingSteps = [{
                  id: 'step-rag-0',
                  type: 'rag',
                  title: '向量检索',
                  content: '',
                  status: 'completed',
                  order: 0,
                  timestamp: Date.now()
                }]
              } else {
                const idx = currentMessage.thinkingSteps.findIndex(s => s.type === 'rag')
                if (idx === -1) {
                  currentMessage.thinkingSteps.push({
                    id: `step-rag-${currentMessage.thinkingSteps.length}`,
                    type: 'rag',
                    title: '向量检索',
                    content: '',
                    status: 'completed',
                    order: currentMessage.thinkingSteps.length,
                    timestamp: Date.now()
                  })
                } else {
                  currentMessage.thinkingSteps[idx].status = 'completed'
                  currentMessage.thinkingSteps[idx].timestamp = Date.now()
                }
              }
              this.$set(this.messages, loadingIndex, currentMessage)
            },
            onChunk: (chunk) => {
              if (chunk) {
                aiContent += chunk
                // 使用Vue.set确保响应式更新
                const currentMessage = this.messages[loadingIndex] || {}
                // 保持思考过程可见，即使开始收到内容
                const shouldShowThinking = currentMessage.showThinking !== false
                this.$set(this.messages, loadingIndex, {
                  ...currentMessage, // 保留 detailLogs / thinkingSteps / showDetailLogs 等
                  type: 'ai',
                  content: aiContent,
                  time: '',
                  showTime: false,
                  loading: false, // 内容开始显示，不再显示加载动画
                  thinkingSteps: currentMessage.thinkingSteps || [],
                  showThinking: shouldShowThinking
                })
                // 实时滚动到底部
                this.$nextTick(() => {
                  this.scrollToBottom()
                })
                // 调试信息
                if (process.env.NODE_ENV === 'development') {
                  console.log('📝 [建议] 更新消息内容，当前长度:', aiContent.length, 'chunk:', chunk)
                }
              }
            },
            onDone: (data) => {
              this.sending = false
              this.streamController = null

              // 将所有运行中的思考步骤标记为完成
              const currentMessage = this.messages[loadingIndex]
              if (currentMessage && currentMessage.thinkingSteps) {
                currentMessage.thinkingSteps.forEach(step => {
                  if (step.status === 'running') {
                    step.status = 'completed'
                  }
                })
                // 触发响应式更新
                this.$set(this.messages, loadingIndex, currentMessage)
              }

              if (data && data.session_id) {
                this.sessionId = data.session_id
              }

              if (aiContent) {
                this.conversationHistory.push({
                  role: 'assistant',
                  content: aiContent
                })
              }

              if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20)
              }

              this.clearTemporarySystemPrompts()
              this.$nextTick(() => {
                this.scrollToBottom()
              })
            },
            onError: (error) => {
              console.error('流式传输错误:', error)
              this.sending = false
              this.streamController = null

              let errorMsg = '抱歉，服务暂时不可用，请稍后再试。'
              if (error.message) {
                errorMsg = `网络错误: ${error.message}`
              }

              const currentMessage = this.messages[loadingIndex] || {}
              this.$set(this.messages, loadingIndex, {
                ...currentMessage,
                type: 'ai',
                content: errorMsg,
                time: '',
                showTime: false,
                loading: false,
                error: true
              })

              this.$message.error('发送消息失败')
              this.clearTemporarySystemPrompts()
            }
          }
        )
      } catch (error) {
        console.error('API调用失败:', error)
        this.sending = false
        this.streamController = null

        let errorMsg = '抱歉，服务暂时不可用，请稍后再试。'
        if (error.response) {
          if (error.response.status === 401) {
            errorMsg = 'API密钥无效，请检查配置。'
          } else if (error.response.status === 429) {
            errorMsg = '请求过于频繁，请稍后再试。'
          } else if (error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message
          }
        } else if (error.message) {
          errorMsg = `网络错误: ${error.message}`
        }

        const currentMessage = this.messages[loadingIndex] || {}
        this.$set(this.messages, loadingIndex, {
          ...currentMessage,
          type: 'ai',
          content: errorMsg,
          time: '',
          showTime: false,
          loading: false,
          error: true
        })

        this.$message.error('发送消息失败')
        this.clearTemporarySystemPrompts()
      }
    },
    handleFeature(feature) {
      // 隐藏欢迎区域
      if (this.showWelcome) {
        this.showWelcome = false
      }

      // 构建消息内容：使用按钮配置的提示词
      const message = feature.prompt || feature.text

      // 设置输入框内容（可选，也可以直接发送）
      // this.inputMessage = message

      // 自动发送消息，并传递任务类型
      this.sendMessageWithTaskType(message, feature.task_type || 'auto')

      // 在控制台输出功能提示
      console.log(`%c功能: ${feature.text}`, 'color: #409EFF; font-weight: bold; font-size: 14px;')
      console.log(`%c任务类型: ${feature.task_type || 'auto'}`, 'color: #606266; font-size: 12px;')
    },
    handleTakePhoto() {
      // TODO: 实现拍照功能
      // 1. 使用 HTML5 的 <input type="file" accept="image/*"> 或摄像头 API
      // 2. 可以调用 navigator.mediaDevices.getUserMedia() 获取摄像头权限
      // 3. 拍照后可以预览图片，然后发送给 AI 进行识别
      // 4. 需要集成图片上传功能
      this.$message({
        message: '拍照功能待开发：需要集成摄像头 API 和图片上传功能',
        type: 'info',
        duration: 3000
      })
      console.log('%c拍照功能开发提示:', 'color: #409EFF; font-weight: bold;')
      console.log('  1. 使用 <input type="file" accept="image/*"> 选择图片')
      console.log('  2. 或使用 navigator.mediaDevices.getUserMedia() 调用摄像头')
      console.log('  3. 拍照后可以预览、编辑图片')
      console.log('  4. 将图片发送给 AI 进行识别和分析')
      console.log('  5. 可以集成图片压缩和格式转换功能')
    },
    handleVoiceInput() {
      // TODO: 实现语音输入功能
      // 1. 使用浏览器 Web Speech API（SpeechRecognition）或第三方语音识别服务
      // 2. 实时将语音转换为文字
      // 3. 支持按住说话和点击录音两种模式
      // 4. 可以集成第三方语音识别 SDK（如阿里云 ASR、百度语音识别等）
      this.$message({
        message: '语音输入功能待开发：需要集成语音识别 API，支持实时转写',
        type: 'info',
        duration: 3000
      })
      console.log('%c语音输入功能开发提示:', 'color: #409EFF; font-weight: bold;')
      console.log('  1. 使用 Web Speech API 或第三方语音识别服务')
      console.log('  2. 实现按住说话功能（touchstart/touchend 事件）')
      console.log('  3. 实时显示识别结果')
      console.log('  4. 支持停止录音和重新录制')
      console.log('  5. 可以集成语音唤醒和离线识别功能')
    },
    handleMoreActions() {
      // TODO: 实现更多操作功能
      // 1. 显示操作菜单（发送文件、发送位置、表情等）
      // 2. 可以添加文件上传、图片选择等功能
      // 3. 支持发送表情、快捷回复等
      this.$message({
        message: '更多操作功能待开发：可添加发送文件、表情、位置等功能',
        type: 'info',
        duration: 3000
      })
      console.log('%c更多操作功能开发提示:', 'color: #409EFF; font-weight: bold;')
      console.log('  1. 文件上传功能（支持多种文件格式）')
      console.log('  2. 图片选择功能（从相册选择）')
      console.log('  3. 表情选择器')
      console.log('  4. 快捷回复模板')
      console.log('  5. 位置分享功能')
      console.log('  6. 可以添加 @ 提及功能')
    },
    scrollToBottom() {
      // 将消息列表滚动到最底部，跟随思考过程和回复内容实时滚动
      this.$nextTick(() => {
        const list = this.$refs.messageList
        if (list && list.scrollHeight !== undefined) {
          list.scrollTop = list.scrollHeight
        }
      })
    },
    getCurrentTime() {
      const now = new Date()
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      const weekday = weekdays[now.getDay()]
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      return `${weekday} ${hours}:${minutes}`
    },
    /**
     * 加载聊天历史记录
     */
    async loadChatHistory() {
      if (!this.sessionId) {
        return
      }

      try {
        const response = await getChatHistory(this.sessionId)
        if (response.code === 200 && response.data && response.data.messages) {
          // 转换历史记录格式
          this.messages = []
          this.conversationHistory = []

          response.data.messages.forEach((msg, index) => {
            const message = {
              type: msg.role === 'user' ? 'user' : 'ai',
              content: msg.content,
              time: msg.time || '',
              showTime: index === 0 || (index > 0 && response.data.messages[index - 1].time !== msg.time),
              loading: false
            }
            this.messages.push(message)

            // 添加到对话历史
            this.conversationHistory.push({
              role: msg.role,
              content: msg.content
            })
          })

          // 如果有历史记录，隐藏欢迎区域
          if (this.messages.length > 0) {
            this.showWelcome = false
          }

          // 滚动到底部
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }
      } catch (error) {
        console.error('加载聊天历史失败:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.agent-module {
  height: 100%;
  width: 100%;
  overflow-x: hidden;

  // 确保 el-card 高度正确
  ::v-deep .el-card {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .el-card__body {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  }

  // 顶部导航栏
  .top-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // padding: 12px 16px;
    background: #FFFFFF;
    // border-bottom: 1px solid #EBEEF5;

    .header-left {
      width: 40px;
      display: flex;
      align-items: center;

      .header-back-icon {
        font-size: 20px;
        color: #303133;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #409EFF;
        }
      }
    }

    .header-center {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;

      .header-avatar {
        flex-shrink: 0;
      }

      .header-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .ai-name {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          line-height: 1.2;
        }

        .ai-tag {
          font-size: 12px;
          color: #909399;
          line-height: 1.2;
          margin-top: 2px;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
      justify-content: flex-end;
      min-width: 120px;

      .header-icon-wrapper {
        position: relative;
        cursor: pointer;

        .icon-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 6px;
          height: 6px;
          background: #F56C6C;
          border-radius: 50%;
          border: 1px solid #FFFFFF;
        }
      }

      .header-icon {
        font-size: 20px;
        color: #303133;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #409EFF;
        }

        &.speaker-icon {
          &.active {
            color: #409EFF;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 24px;
              height: 24px;
              background: rgba(64, 158, 255, 0.1);
              border-radius: 50%;
              z-index: -1;
            }
          }
        }
      }
    }
  }

  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    overflow-x: hidden;
    overflow-y: auto;
    min-height: 0;
    // width: 100%;

    .message-list {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      min-height: 0;
      width: 100%;
      box-sizing: border-box;

      /* 自定义滚动条样式 */
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #dcdfe6;
        border-radius: 3px;

        &:hover {
          background: #c0c4cc;
        }
      }

      .messages {
        padding: 20px 16px;
        width: 100%;
        box-sizing: border-box;

        .welcome-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          // padding: 0px 0 40px;
          width: 100%;
          box-sizing: border-box;

          .welcome-avatar {
          margin-bottom: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .welcome-message {
            max-width: 320px;
            margin-bottom: 24px;
            padding: 14px 18px;
            background: #F5F5F5;
            color: #303133;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.6;
            text-align: left;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }

          .suggestions-section {
            width: 100%;
            margin-top: 10px;

            .suggestions-header {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 16px;
              padding: 0 4px;

              i {
                font-size: 18px;
                color: #409EFF;
              }

              span {
                font-size: 14px;
                font-weight: 600;
                color: #606266;
              }
            }

            .suggestions-grid {
              display: flex;
              flex-direction: column;
              gap: 10px;
              width: 100%;
              max-width: 100%;
              padding: 0;
              box-sizing: border-box;

              .suggestion-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 14px;
                background: #FFFFFF;
                border: 2px solid transparent;
                border-radius: 10px;
                font-size: 13px;
                color: #303133;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                word-break: break-word;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                position: relative;
                overflow: hidden;

                &::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 4px;
                  height: 100%;
                  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
                  opacity: 0;
                  transition: opacity 0.3s ease;
                }

                &.gradient-1 {
                  &::before {
                    background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
                  }
                }

                &.gradient-2 {
                  &::before {
                    background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
                  }
                }

                &.gradient-3 {
                  &::before {
                    background: linear-gradient(180deg, #43e97b 0%, #38f9d7 100%);
                  }
                }

                &:hover {
                  background: #F5F7FA;
                  border-color: #409EFF;
                  transform: translateX(4px);
                  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);

                  &::before {
                    opacity: 1;
                  }

                  .suggestion-icon {
                    transform: scale(1.1);
                  }

                  .suggestion-arrow {
                    opacity: 1;
                    transform: translateX(0);
                  }
                }

                .suggestion-icon {
                  flex-shrink: 0;
                  width: 32px;
                  height: 32px;
                  border-radius: 6px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: transform 0.3s ease;

                  i {
                    font-size: 16px;
                    color: white;
                  }
                }

                &.gradient-1 .suggestion-icon {
                  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                }

                &.gradient-2 .suggestion-icon {
                  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                }

                &.gradient-3 .suggestion-icon {
                  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                }

                .suggestion-text {
                  flex: 1;
                  line-height: 1.5;
                  color: #606266;
                }

                .suggestion-arrow {
                  flex-shrink: 0;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #F5F7FA;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  opacity: 0;
                  transform: translateX(-8px);
                  transition: all 0.3s ease;

                  i {
                    font-size: 12px;
                    color: #409EFF;
                  }
                }
              }
            }
          }
        }

        .message-wrapper {
          margin-bottom: 16px;

          .message-timestamp {
            text-align: center;
            font-size: 12px;
            color: #909399;
            margin: 16px 0;
            padding: 0 16px;
          }

          .message-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;

          &.ai-message {
            justify-content: flex-start;

            .message-content {
                margin-left: 10px;
                max-width: 80%;
            }
          }

          &.user-message {
            justify-content: flex-end;

            .message-content {
                margin-right: 10px;
                max-width: 80%;
            }
          }

          .message-avatar {
            flex-shrink: 0;
          }

          .message-content {
            display: flex;
            flex-direction: column;

            .message-bubble {
              padding: 12px 16px;
                border-radius: 12px;
              line-height: 1.6;
              word-break: break-word;
                font-size: 14px;

              &.ai-bubble {
                background: #F5F5F5;
                color: #303133;

                // Markdown 内容样式
                .markdown-content {
                  line-height: 1.6;

                  // 使用深度选择器应用到 v-html 渲染的内容
                  ::v-deep {
                    // 标题样式
                    h1, h2, h3, h4, h5, h6 {
                      margin: 16px 0 8px 0;
                      font-weight: 600;
                      line-height: 1.4;
                      color: #303133;

                      &:first-child {
                        margin-top: 0;
                      }
                    }

                    h1 {
                      font-size: 20px;
                      border-bottom: 2px solid #E4E7ED;
                      padding-bottom: 8px;
                    }

                    h2 {
                      font-size: 18px;
                      border-bottom: 1px solid #E4E7ED;
                      padding-bottom: 6px;
                    }

                    h3 {
                      font-size: 16px;
                      margin-top: 14px;
                    }

                    h4 {
                      font-size: 15px;
                    }

                    h5, h6 {
                      font-size: 14px;
                    }

                    // 段落样式
                    p {
                      margin: 8px 0;
                      line-height: 1.6;

                      &:first-child {
                        margin-top: 0;
                      }

                &:last-child {
                  margin-bottom: 0;
                }
              }

                    // 列表样式
                    ul, ol {
                margin: 8px 0;
                      padding-left: 24px;

                li {
                  margin: 4px 0;
                        line-height: 1.6;

                        p {
                          margin: 4px 0;
                        }
                      }
                    }

                    // 代码块样式
                    code {
                      background: rgba(0, 0, 0, 0.05);
                      padding: 2px 6px;
                      border-radius: 4px;
                      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                      font-size: 13px;
                      color: #E83E8C;
                    }

                    pre {
                      background: rgba(0, 0, 0, 0.05);
                      padding: 12px;
                      border-radius: 6px;
                      overflow-x: auto;
                      margin: 12px 0;
                      line-height: 1.5;

                      code {
                        background: transparent;
                        padding: 0;
                        color: #303133;
                        font-size: 13px;
                      }
                    }

                    // 引用样式
                    blockquote {
                      border-left: 4px solid #409EFF;
                      padding-left: 12px;
                      margin: 12px 0;
                      color: #606266;
                      font-style: italic;
                    }

                    // 链接样式
                    a {
                      color: #409EFF;
                      text-decoration: none;
                      transition: color 0.3s;

                      &:hover {
                        color: #66B1FF;
                        text-decoration: underline;
                      }
                    }

                    // 表格样式
                    table {
                      border-collapse: collapse;
                      width: 100%;
                      margin: 12px 0;
                      font-size: 14px;

                      th, td {
                        border: 1px solid #E4E7ED;
                        padding: 8px 12px;
                        text-align: left;
                      }

                      th {
                        background: #F5F7FA;
                        font-weight: 600;
                      }
                    }

                    // 分隔线
                    hr {
                      border: none;
                      border-top: 1px solid #E4E7ED;
                      margin: 16px 0;
                    }

                    // 强调文本
                    strong {
                      font-weight: 600;
                color: #303133;
                    }

                    em {
                      font-style: italic;
                    }

                    // 删除线
                    del {
                      text-decoration: line-through;
                      color: #909399;
                    }
                  }
                }

                &.loading {
                  .loading-dots {
                    display: inline-flex;
                    gap: 4px;
                    align-items: center;

                    span {
                      width: 6px;
                      height: 6px;
                      border-radius: 50%;
                      background: #909399;
                      animation: loading-dot 1.4s infinite ease-in-out;

                      &:nth-child(1) {
                        animation-delay: -0.32s;
                      }

                      &:nth-child(2) {
                        animation-delay: -0.16s;
                      }

                      &:nth-child(3) {
                        animation-delay: 0s;
                      }
                    }
                  }
                }

                &.error {
                  background: #FEF0F0;
                  color: #F56C6C;
                  border: 1px solid #FBC4C4;
                }

                // 思考过程样式
                .thinking-process {
                  margin-bottom: 12px;
                  border: 1px solid #E4E7ED;
                  border-radius: 8px;
                  background: #F5F7FA;
                  overflow: hidden;

                  .thinking-header {
                    display: flex;
                    align-items: center;
                    padding: 10px 12px;
                    cursor: pointer;
                    user-select: none;
                    transition: background-color 0.2s;

                    &:hover {
                      background: #EBEEF5;
                    }

                    .thinking-icon {
                      color: #409EFF;
                      font-size: 16px;
                      margin-right: 8px;
                    }

                    .thinking-title {
                      flex: 1;
                      font-size: 13px;
                      font-weight: 500;
                      color: #303133;
                    }

                    .thinking-toggle {
                      color: #909399;
                      font-size: 12px;
                      transition: transform 0.2s;
                    }
                  }

                  .thinking-steps {
                    padding: 8px 12px 12px;
                    max-height: 300px;
                    overflow-y: auto;

                    .thinking-step {
                      display: flex;
                      align-items: flex-start;
                      padding: 8px 0;
                      border-bottom: 1px solid #EBEEF5;

                      &:last-child {
                        border-bottom: none;
                      }

                      .step-indicator {
                        flex-shrink: 0;
                        width: 20px;
                        height: 20px;
                        margin-right: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        .step-icon {
                          font-size: 14px;

                          &.completed {
                            color: #67C23A;
                          }

                          &.running {
                            color: #409EFF;
                            animation: rotate 1s linear infinite;
                          }

                          &.pending {
                            color: #C0C4CC;
                          }
                        }
                      }

                      .step-content {
                        flex: 1;
                        min-width: 0;

                        .step-title {
                          font-size: 13px;
                          font-weight: 500;
                          color: #303133;
                          margin-bottom: 4px;
                        }

                        .step-detail {
                          font-size: 12px;
                          color: #606266;
                          line-height: 1.5;
                          word-break: break-word;
                        }
                      }

                      &.step-completed {
                        opacity: 0.8;
                      }

                      &.step-running {
                        .step-content .step-title {
                          color: #409EFF;
                        }
                      }
                    }
                  }
                }
              }

              &.user-bubble {
                background: #409EFF;
                color: #FFFFFF;
              }
              }
            }
          }
        }
      }
    }

    .feature-shortcuts {
      flex-shrink: 0;
      padding: 12px 16px;
      // background: #FFFFFF;
      // border-top: 1px solid #EBEEF5;
      display: flex;
      gap: 8px;
      justify-content: space-between;
      flex-wrap: wrap;

      .feature-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition: all 0.3s;
        padding: 8px 12px;
        border-radius: 8px;
        background: #FFFFFF;
        border: 1px solid #E4E7ED;
        flex: 1;
        min-width: calc(25% - 8px);
        justify-content: center;

        &:hover {
          background: #F5F7FA;
          border-color: #409EFF;
        }

        .feature-icon {
          font-size: 18px;
          color: #303133;
        }

        .feature-text {
          font-size: 13px;
          color: #303133;
          white-space: nowrap;
        }
      }
    }

    .input-area {
      flex-shrink: 0;
      padding: 12px 16px;
      background: #FFFFFF;
      border-top: 1px solid #EBEEF5;
      width: 100%;
      box-sizing: border-box;

      .input-wrapper {
        display: flex;
        align-items: center;
        background: #F5F7FA;
        border-radius: 24px;
        padding: 8px 16px;
        gap: 12px;

        .input-left-icon {
          font-size: 20px;
          color: #909399;
          cursor: pointer;
          flex-shrink: 0;
        }

        .message-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          color: #303133;
          padding: 4px 0;

          &::placeholder {
            color: #C0C4CC;
          }

          &:disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }
        }

        .send-button {
          flex-shrink: 0;
          border-radius: 18px;
          padding: 6px 16px;

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }

        .input-right-icons {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;

          .input-icon {
            font-size: 20px;
            color: #909399;
            cursor: pointer;
            transition: color 0.3s;

            &:hover {
              color: #409EFF;
            }
          }
        }
      }
    }
  }

}

@keyframes loading-dot {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

// 研究进度详细日志样式（嵌入思考过程卡片中）
.thinking-process {
  .thinking-detail {
    margin-top: 8px;
    border-top: 1px dashed #E4E7ED;
    padding-top: 8px;

    .detail-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
      padding: 4px 0;

      .detail-title {
        font-size: 13px;
        color: #606266;
        font-weight: 500;
      }

      .detail-toggle {
        font-size: 12px;
        color: #909399;
        transition: transform 0.2s;
      }
    }

    .detail-list {
      max-height: 200px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 4px;

      .detail-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-size: 12px;
        padding: 2px 0;

        .detail-time {
          color: #909399;
          flex-shrink: 0;
          min-width: 60px;
        }

        .detail-content {
          color: #606266;
          flex: 1;
        }

        &.detail-warning {
          .detail-content {
            color: #E6A23C;
          }
        }

        &.detail-error {
          .detail-content {
            color: #F56C6C;
          }
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
