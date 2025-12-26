<template>
  <div class="agent-initial-report">
    <!-- AI 头像和欢迎消息 -->
    <!-- <div class="report-header">
      <el-avatar :size="60" :src="aiAvatar" class="report-avatar">
        <i class="el-icon-cpu" />
      </el-avatar>
      <div class="welcome-text">
        <h3 class="welcome-title">嗨，我是致真智能体！</h3>
        <p class="welcome-desc">为您精选了今日重点信息，让我们开始吧</p>
      </div>
    </div> -->

    <!-- 加载动画 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <i class="el-icon-loading" />
      </div>
      <p class="loading-text">正在为您生成报告...</p>
    </div>

    <!-- 关键信息卡片 -->
    <div v-else-if="reportSections.length > 0">
      <div
        v-for="(section, index) in reportSections"
        :key="section.id || index"
        class="highlights-container"
      >
        <!-- <div class="highlights-header">
          <i :class="section.icon" />
          <span class="highlights-title">{{ section.title }}</span>
        </div> -->

        <div class="markdown-content" v-html="renderMarkdown(section.content)" />
        <div
          v-if="section.sources && section.sources.length"
          class="section-sources"
        >
          <div class="item-sources">
            <span class="sources-label">来源：</span>
            <a
              v-if="section.sources[0].url"
              :href="section.sources[0].url"
              :title="section.sources[0].title"
              target="_blank"
              rel="noopener noreferrer"
              class="source-link"
            >
              {{ section.sources[0].title }}
            </a>
            <span v-else class="source-link">
              {{ section.sources[0].title || '未知来源' }}
            </span>
            <el-popover
              v-if="section.sources.length > 1"
              placement="bottom-start"
              width="360"
              trigger="click"
              popper-class="sources-popover"
            >
              <div class="popover-sources">
                <div
                  v-for="(source, sourceIndex) in section.sources"
                  :key="sourceIndex"
                  class="popover-source"
                >
                  <a
                    v-if="source.url"
                    :href="source.url"
                    :title="source.title"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="popover-link"
                  >
                    {{ source.title }}
                  </a>
                  <span v-else class="popover-link">
                    {{ source.title || '未知来源' }}
                  </span>
                  <span
                    v-if="formatSourceMeta(source)"
                    class="popover-meta"
                  >
                    {{ formatSourceMeta(source) }}
                  </span>
                </div>
              </div>
              <span slot="reference" class="sources-more">等{{ section.sources.length }}个</span>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked'
import { getAgentInitialReport } from '@/api/agent/initialReport'

export default {
  name: 'AgentInitialReport',
  data() {
    return {
      loading: false,
      reportSections: []
    }
  },
  mounted() {
    // 配置marked选项
    marked.setOptions({
      breaks: true,
      gfm: true
    })

    // 获取报告数据
    this.fetchReport()
  },
  methods: {
    /**
     * 获取报告数据
     */
    async fetchReport() {
      this.loading = true
      this.reportSections = []

      try {
        const response = await getAgentInitialReport()

        if (response.code === 200 && response.data && response.data.sections) {
          this.reportSections = response.data.sections.map((section) => ({
            ...section,
            sources: this.normalizeSources(section.sources)
          }))
          console.log('✅ 成功获取智能体初始报告数据')
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.warn('⚠️ 获取智能体报告失败:', error.message)
        // 加载失败时不显示任何内容
        this.reportSections = []
        // 显示错误提示
        this.$message.error('获取报告数据失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    /**
     * 渲染Markdown内容
     */
    renderMarkdown(content) {
      if (!content) return ''
      return marked(content)
    },

    normalizeSources(sources) {
      if (!Array.isArray(sources)) {
        return []
      }
      return sources
        .map((source) => {
          if (typeof source === 'string') {
            const url = source.trim()
            return url ? { url, title: url, source: '', publishedAt: '' } : null
          }
          if (source && typeof source === 'object') {
            const url = (source.url || source.link || '').toString().trim()
            const title = (
              source.title ||
              source.name ||
              source.source ||
              url ||
              '未知来源'
            )
              .toString()
              .trim()
            return {
              url,
              title,
              source: (source.source || '').toString().trim(),
              publishedAt: source.publishedAt || source.published_at || source.date || ''
            }
          }
          return null
        })
        .filter(Boolean)
    },

    /**
     * 格式化来源信息（日期 + 站点）
     */
    formatSourceMeta(source) {
      if (!source) return ''
      const parts = []
      const dateText = this.formatSourceDate(source.publishedAt)
      if (dateText) parts.push(dateText)
      if (source.source) parts.push(source.source)
      return parts.join(' · ')
    },

    formatSourceDate(value) {
      if (!value) return ''
      const text = value.toString().trim()
      return text.length >= 10 ? text.slice(0, 10) : text
    },

    /**
     * 刷新报告数据
     */
    refreshReport() {
      this.fetchReport()
    }
  }
}
</script>

<style lang="scss" scoped>
.agent-initial-report {
  width: 100%;
  max-width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;

  // 加载动画
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    background: #f7f8fa;
    border-radius: 12px;
    border: 1px solid #e4e7ed;

    .loading-spinner {
      margin-bottom: 16px;

      i {
        font-size: 48px;
        color: #409EFF;
        animation: rotating 2s linear infinite;
      }
    }

    .loading-text {
      margin: 0;
      font-size: 14px;
      color: #606266;
      font-weight: 500;
    }
  }

  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .report-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;

    .report-avatar {
      flex-shrink: 0;
      border: 3px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-text {
      flex: 1;

      .welcome-title {
        margin: 0 0 6px 0;
        font-size: 18px;
        font-weight: 600;
        color: white;
      }

      .welcome-desc {
        margin: 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.4;
      }
    }
  }

  .highlights-container {
    background: #f7f8fa;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid #e4e7ed;
    max-height: 300px;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    .highlights-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 5px;
      padding-bottom: 5px;
      border-bottom: 2px solid #e4e7ed;
      flex-shrink: 0;

      i {
        font-size: 18px;
        color: #409EFF;
      }

      .highlights-title {
        flex: 1;
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }

      .el-tag {
        flex-shrink: 0;
        margin-left: auto;
      }
    }

    .markdown-content {
      color: #606266;
      font-size: 13px;
      line-height: 1.8;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 8px;
      flex: 1;
      min-height: 0;

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

      ::v-deep {
        h1, h2, h3, h4, h5, h6 {
          color: #303133;
          margin-top: 0px;
          margin-bottom: 12px;
          font-weight: 600;
        }

        h2 {
          font-size: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #ebeef5;
        }

        h3 {
          font-size: 14px;
        }

        p {
          margin: 8px 0;
          line-height: 1.8;
        }

        ul, ol {
          margin: 8px 0;
          padding-left: 24px;

          li {
            margin: 6px 0;
            line-height: 1.8;
          }
        }

        strong {
          color: #409EFF;
          font-weight: 600;
        }

        blockquote {
          margin: 12px 0;
          padding: 10px 16px;
          background: #f0f9ff;
          border-left: 4px solid #409EFF;
          color: #606266;
          font-size: 13px;

          p {
            margin: 0;
          }
        }

        code {
          background: #f5f7fa;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #e83e8c;
        }

        pre {
          margin: 12px 0;
          padding: 12px;
          background: #2c3e50;
          border-radius: 6px;
          overflow-x: auto;

          code {
            background: none;
            padding: 0;
            color: #a6e22e;
            font-size: 12px;
            line-height: 1.6;
          }
        }

        hr {
          margin: 16px 0;
          border: none;
          border-top: 1px solid #ebeef5;
        }

        a {
          color: #409EFF;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;

          th, td {
            padding: 8px 12px;
            border: 1px solid #ebeef5;
            text-align: left;
          }

          th {
            background: #f5f7fa;
            font-weight: 600;
            color: #303133;
          }
        }
      }
    }

    .highlights-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .highlight-item {
        display: flex;
        gap: 12px;
        background: white;
        padding: 12px;
        border-radius: 8px;
        transition: all 0.3s ease;
        border: 1px solid #ebeef5;

        &:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-color: #409EFF;
        }

        .item-badge {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: white;

          &.priority-high {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }

          &.priority-medium {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          }

          &.priority-low {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          }
        }

        .item-content {
          flex: 1;
          min-width: 0;

          .item-category {
            margin-bottom: 6px;
          }

          .item-text {
            margin: 0;
            font-size: 13px;
            line-height: 1.6;
            color: #606266;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }

    .section-sources {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px dashed #e4e7ed;
      font-size: 12px;
      color: #909399;

      .item-sources {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
      }

      .sources-label {
        font-weight: 600;
        color: #606266;
      }

      .source-link {
        color: #409EFF;
        text-decoration: none;
        max-width: 420px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .source-link:hover {
        text-decoration: underline;
      }

      .sources-more {
        color: #409EFF;
        cursor: pointer;
      }

      .popover-sources {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .popover-source {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .popover-link {
        color: #409EFF;
        text-decoration: none;
        word-break: break-word;
      }

      .popover-link:hover {
        text-decoration: underline;
      }

      .popover-meta {
        color: #909399;
        font-size: 12px;
      }
    }
  }
}
</style>
