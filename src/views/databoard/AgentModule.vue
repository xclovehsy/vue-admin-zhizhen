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

      <!-- 消息列表区域 -->
      <div class="chat-container">
        <div class="message-list">
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
                    <span v-if="message.loading" class="loading-dots">
                      <span></span><span></span><span></span>
                    </span>
                    <div v-else class="markdown-content" v-html="renderMarkdown(message.content)"></div>
                  </div>
                </div>
              </div>

              <!-- 用户消息 -->
              <div v-if="message.type === 'user'" class="message-item user-message">
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
            <i :class="feature.icon" class="feature-icon"></i>
            <span class="feature-text">{{ feature.text }}</span>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-wrapper">
            <!-- <i class="el-icon-camera input-left-icon" @click="handleTakePhoto" title="拍照"></i> -->
            <input
            v-model="inputMessage"
              type="text"
            class="message-input"
              placeholder="发消息..."
              :disabled="sending"
              @keydown.enter="handleSendMessage"
            />
            <el-button
              type="primary"
              size="small"
              icon="el-icon-s-promotion"
              :loading="sending"
              :disabled="!inputMessage.trim()"
              @click="handleSendMessage"
              class="send-button"
            >
              发送
            </el-button>
            <!-- <div class="input-right-icons">
              <i class="el-icon-microphone input-icon" @click="handleVoiceInput" title="语音输入"></i>
              <i class="el-icon-plus input-icon" @click="handleMoreActions" title="更多操作"></i>
            </div> -->
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { chatWithQwen } from '@/api/agent/qwen'
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
      systemPrompt: '你是致真智能体，一个友好、专业的AI助手。你可以回答各种问题，提供工作学习上的帮助，还能随时陪伴聊天。请用简洁、友好的语气回复。',
      suggestions: [
        { id: 1, text: '近期有哪些新出台的高端科学仪器国产化相关政策？', icon: 'el-icon-document-checked', gradient: 'gradient-1' },
        { id: 2, text: '过去一个月，原子力显微镜的整体态势：政策支持、头部公司动态、技术突破？', icon: 'el-icon-data-analysis', gradient: 'gradient-2' },
        { id: 3, text: '近一周有哪些新的招标需求可重点关注？', icon: 'el-icon-tickets', gradient: 'gradient-3' }
      ],
      messages: [],
      features: [
        { id: 1, text: '数据分析', icon: 'el-icon-data-line' },
        { id: 2, text: '生成报告', icon: 'el-icon-document' },
        { id: 3, text: '预测趋势', icon: 'el-icon-arrow-up' },
        { id: 4, text: '智能建议', icon: 'el-icon-magic-stick' }
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
  },
  methods: {
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
      if (!this.inputMessage.trim() || this.sending) {
        return
      }

      // 隐藏欢迎区域
      if (this.showWelcome) {
        this.showWelcome = false
      }

      const userContent = this.inputMessage.trim()

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
        content: '正在思考中...',
        time: '',
        showTime: false,
        loading: true
      }
      this.messages.push(loadingMessage)
      const loadingIndex = this.messages.length - 1

      try {
        // 调用 Qwen API
        const response = await chatWithQwen(
          userContent,
          this.systemPrompt,
          this.conversationHistory.slice(0, -1), // 排除刚添加的用户消息，因为chatWithQwen会自动添加
          {
            temperature: 0.8,
            top_p: 0.8
          }
        )

        // 获取AI回复内容（OpenAI 兼容格式）
        let aiContent = ''
        if (response.data && response.data.choices && response.data.choices.length > 0) {
          // OpenAI 兼容格式：response.data.choices[0].message.content
          aiContent = response.data.choices[0].message?.content || ''
        } else if (response.data && response.data.output) {
          // DashScope 标准格式（兼容旧格式）
          if (response.data.output.text) {
            aiContent = response.data.output.text
          } else if (response.data.output.choices && response.data.output.choices.length > 0) {
            aiContent = response.data.output.choices[0].message?.content || response.data.output.choices[0].text || ''
          }
        }

        if (!aiContent) {
          aiContent = '抱歉，我暂时无法理解您的问题，请换个方式提问。'
        }

        // 更新加载中的消息
        this.messages[loadingIndex] = {
          type: 'ai',
          content: aiContent,
          time: '',
          showTime: false,
          loading: false
        }

        // 添加到对话历史
        this.conversationHistory.push({
          role: 'assistant',
          content: aiContent
        })

        // 限制历史记录长度，避免超出token限制
        if (this.conversationHistory.length > 20) {
          this.conversationHistory = this.conversationHistory.slice(-20)
        }

      } catch (error) {
        console.error('API调用失败:', error)

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
      } finally {
        this.sending = false

        // 滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom()
        })
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
        loading: true
      }
      this.messages.push(loadingMessage)
      const loadingIndex = this.messages.length - 1
      this.sending = true

      try {
        // 调用 Qwen API
        const response = await chatWithQwen(
          suggestion.text,
          this.systemPrompt,
          this.conversationHistory.slice(0, -1),
          {
            temperature: 0.8,
            top_p: 0.8
          }
        )

        // 获取AI回复内容
        let aiContent = ''
        if (response.data && response.data.output) {
          if (response.data.output.choices && response.data.output.choices.length > 0) {
            aiContent = response.data.output.choices[0].message.content || ''
          } else if (response.data.output.text) {
            aiContent = response.data.output.text
          }
        }

        if (!aiContent && response.data && response.data.choices && response.data.choices.length > 0) {
          aiContent = response.data.choices[0].message?.content || ''
        }

        if (!aiContent) {
          aiContent = '抱歉，我暂时无法理解您的问题，请换个方式提问。'
        }

        // 更新加载中的消息
        this.messages[loadingIndex] = {
          type: 'ai',
          content: aiContent,
          time: '',
          showTime: false,
          loading: false
        }

        // 添加到对话历史
        this.conversationHistory.push({
          role: 'assistant',
          content: aiContent
        })

        // 限制历史记录长度
        if (this.conversationHistory.length > 20) {
          this.conversationHistory = this.conversationHistory.slice(-20)
        }

      } catch (error) {
        console.error('API调用失败:', error)

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
      } finally {
        this.sending = false

        // 滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    handleFeature(feature) {
      // TODO: 实现快捷功能
      const featureMap = {
        '数据分析': {
          message: '数据分析功能待开发：可以分析当前数据看板的数据，生成数据洞察',
          tips: [
            '1. 获取当前数据看板的数据',
            '2. 调用 AI 进行数据分析和挖掘',
            '3. 识别数据趋势和异常',
            '4. 生成数据洞察报告'
          ]
        },
        '生成报告': {
          message: '生成报告功能待开发：可以自动生成数据报告和分析报告',
          tips: [
            '1. 汇总当前数据看板的关键指标',
            '2. 调用 AI 生成结构化报告',
            '3. 支持导出为 Word、PDF 等格式',
            '4. 可以自定义报告模板和样式'
          ]
        },
        '预测趋势': {
          message: '预测趋势功能待开发：基于历史数据预测未来趋势',
          tips: [
            '1. 获取历史数据',
            '2. 调用 AI 进行趋势分析和预测',
            '3. 生成预测图表和说明',
            '4. 提供置信区间和风险提示'
          ]
        },
        '智能建议': {
          message: '智能建议功能待开发：基于数据提供智能建议和优化方案',
          tips: [
            '1. 分析当前数据状态',
            '2. 识别问题和机会点',
            '3. 生成针对性的建议和方案',
            '4. 提供可执行的行动计划'
          ]
        }
      }

      const featureInfo = featureMap[feature.text] || {
        message: `功能 "${feature.text}" 待开发`,
        tips: []
      }

      this.$message({
        message: featureInfo.message,
        type: 'info',
        duration: 4000
      })

      // 在控制台输出开发提示
      console.log(`%c功能开发提示: ${feature.text}`, 'color: #409EFF; font-weight: bold; font-size: 14px;')
      featureInfo.tips.forEach((tip, index) => {
        console.log(`%c  ${index + 1}. ${tip}`, 'color: #606266; font-size: 12px;')
      })
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
      if (this.$refs.messageScrollbar) {
        const wrap = this.$refs.messageScrollbar.$el.querySelector('.el-scrollbar__wrap')
        if (wrap) {
          wrap.scrollTop = wrap.scrollHeight
        }
      }
    },
    getCurrentTime() {
      const now = new Date()
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      const weekday = weekdays[now.getDay()]
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      return `${weekday} ${hours}:${minutes}`
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
</style>

