<template>
  <div class="agent-module">
    <el-card shadow="hover" :body-style="{ height: 'calc(100vh - 140px)', padding: 0 }">
      <div slot="header" class="card-header">
        <div class="header-left">
          <i class="el-icon-cpu" style="color: #409EFF; margin-right: 8px;" />
          <span class="module-title">智能助手</span>
          <el-tag size="mini" type="success" effect="plain" style="margin-left: 12px;">在线</el-tag>
        </div>
        <div class="header-right">
          <el-button size="mini" type="text" icon="el-icon-refresh-left">清空对话</el-button>
          <el-button size="mini" type="text" icon="el-icon-setting">设置</el-button>
        </div>
      </div>

      <!-- 消息列表区域 -->
      <div class="chat-container">
        <el-scrollbar class="message-list" ref="messageScrollbar">
          <div class="messages">
            <!-- AI 欢迎消息 -->
            <div class="message-item ai-message">
              <div class="message-avatar">
                <el-avatar size="small" :src="aiAvatar">
                  <i class="el-icon-cpu" />
                </el-avatar>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="sender-name">AI 助手</span>
                  <span class="message-time">10:30</span>
                </div>
                <div class="message-bubble ai-bubble">
                  <p>你好！我是你的智能助手，有什么可以帮助你的吗？</p>
                </div>
              </div>
            </div>

            <!-- 用户消息示例 -->
            <div class="message-item user-message">
              <div class="message-content">
                <div class="message-header">
                  <span class="message-time">10:31</span>
                  <span class="sender-name">我</span>
                </div>
                <div class="message-bubble user-bubble">
                  <p>帮我分析一下最近的业务数据</p>
                </div>
              </div>
              <div class="message-avatar">
                <el-avatar size="small" icon="el-icon-user-solid" />
              </div>
            </div>

            <!-- AI 回复示例 -->
            <div class="message-item ai-message">
              <div class="message-avatar">
                <el-avatar size="small" :src="aiAvatar">
                  <i class="el-icon-cpu" />
                </el-avatar>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="sender-name">AI 助手</span>
                  <span class="message-time">10:31</span>
                </div>
                <div class="message-bubble ai-bubble">
                  <p>好的，我已经为你整理了最近的业务数据：</p>
                  <ul>
                    <li>本月销售额同比增长 15%</li>
                    <li>新增客户数量 320 个</li>
                    <li>客户转化率达到 28%</li>
                  </ul>
                  <p>需要我详细分析某个指标吗？</p>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>

        <!-- 快捷操作区 -->
        <div class="quick-actions">
          <el-tag
            v-for="action in quickActions"
            :key="action.id"
            size="small"
            effect="plain"
            class="action-tag"
            @click="handleQuickAction(action)"
          >
            <i :class="action.icon" />
            {{ action.text }}
          </el-tag>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="3"
            placeholder="输入消息...按 Ctrl+Enter 发送"
            class="message-input"
            @keydown.ctrl.enter.native="handleSendMessage"
          />
          <div class="input-actions">
            <div class="left-actions">
              <el-button size="small" icon="el-icon-picture" circle title="发送图片" />
              <el-button size="small" icon="el-icon-paperclip" circle title="发送文件" />
              <el-button size="small" icon="el-icon-mic" circle title="语音输入" />
            </div>
            <div class="right-actions">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-s-promotion"
                :loading="sending"
                @click="handleSendMessage"
              >
                发送
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AgentModule',
  data() {
    return {
      inputMessage: '',
      sending: false,
      aiAvatar: '',
      quickActions: [
        { id: 1, text: '数据分析', icon: 'el-icon-data-analysis' },
        { id: 2, text: '生成报告', icon: 'el-icon-document' },
        { id: 3, text: '预测趋势', icon: 'el-icon-trend-charts' },
        { id: 4, text: '智能建议', icon: 'el-icon-magic-stick' }
      ]
    }
  },
  mounted() {
    // 初始化智能体
  },
  methods: {
    handleSendMessage() {
      if (!this.inputMessage.trim()) {
        return
      }
      // 这里添加发送消息的逻辑
      console.log('发送消息:', this.inputMessage)
      this.inputMessage = ''
    },
    handleQuickAction(action) {
      console.log('快捷操作:', action.text)
      this.$message.info(`执行操作: ${action.text}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.agent-module {
  height: 100%;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      align-items: center;

      .module-title {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
      }
    }

    .header-right {
      .el-button {
        margin-left: 8px;
      }
    }
  }

  .chat-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #F5F7FA;

    .message-list {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #FFFFFF;

      .messages {
        .message-item {
          display: flex;
          margin-bottom: 20px;

          &.ai-message {
            justify-content: flex-start;

            .message-content {
              margin-left: 12px;
            }
          }

          &.user-message {
            justify-content: flex-end;

            .message-content {
              margin-right: 12px;
              align-items: flex-end;
            }
          }

          .message-avatar {
            flex-shrink: 0;
          }

          .message-content {
            display: flex;
            flex-direction: column;
            max-width: 70%;

            .message-header {
              display: flex;
              align-items: center;
              margin-bottom: 6px;
              font-size: 12px;
              color: #909399;

              .sender-name {
                margin-right: 8px;
                font-weight: 500;
              }

              .message-time {
                font-size: 11px;
              }
            }

            .message-bubble {
              padding: 12px 16px;
              border-radius: 8px;
              line-height: 1.6;
              word-break: break-word;

              p {
                margin: 0 0 8px 0;

                &:last-child {
                  margin-bottom: 0;
                }
              }

              ul {
                margin: 8px 0;
                padding-left: 20px;

                li {
                  margin: 4px 0;
                }
              }

              &.ai-bubble {
                background: #F0F9FF;
                color: #303133;
                border: 1px solid #D4E8FF;
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

    .quick-actions {
      padding: 12px 20px;
      background: #FFFFFF;
      border-top: 1px solid #EBEEF5;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .action-tag {
        cursor: pointer;
        transition: all 0.3s;

        i {
          margin-right: 4px;
        }

        &:hover {
          opacity: 0.8;
          transform: translateY(-1px);
        }
      }
    }

    .input-area {
      padding: 16px 20px;
      background: #FFFFFF;
      border-top: 1px solid #EBEEF5;

      .message-input {
        margin-bottom: 12px;

        ::v-deep .el-textarea__inner {
          border-radius: 8px;
          resize: none;
        }
      }

      .input-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left-actions {
          display: flex;
          gap: 8px;

          .el-button {
            color: #909399;

            &:hover {
              color: #409EFF;
            }
          }
        }

        .right-actions {
          .el-button {
            padding: 9px 20px;
          }
        }
      }
    }
  }

  // 滚动条样式优化
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>

