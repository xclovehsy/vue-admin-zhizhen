<template>
  <div class="daily-report">
    <el-card class="report-card" shadow="hover">
      <!-- <div slot="header" class="card-header">
        <div class="header-content">
          <h3 class="card-title">
            您的每日专属简报 - {{ currentDate }}
          </h3>
          <div class="header-actions">
            <el-select
              v-model="selectedView"
              placeholder="选择视角"
              size="small"
              class="view-selector"
              :loading="loading"
            >
              <el-option label="管理层视角" value="management" />
              <el-option label="市场部视角" value="market" />
              <el-option label="销售部视角" value="sales" />
              <el-option label="产品部视角" value="product" />
            </el-select>
          </div>
        </div>
      </div> -->

      <div class="report-content">
        <div class="highlights-section">
          <div class="section-header">
            <div class="header-left">
              <div class="header-icon">
                <svg-icon icon-class="dashboard" />
              </div>
              <div class="header-text">
                <h4 class="section-title">今日重点关注</h4>
                <p class="section-subtitle">以下是AI为您精选的{{ topThreeHighlights.length }}条关键信息</p>
              </div>
            </div>
            <div class="header-right">
              <info-overview @item-click="handleInfoOverviewClick" />
            </div>
          </div>

          <div v-loading="loading" class="highlights-list">
            <div class="scroll-container" @mouseenter="pauseScroll" @mouseleave="resumeScroll">
              <div class="scroll-content" :class="{ paused: isPaused }">
                <!-- 第一组数据 -->
                <div
                  v-for="(item, index) in topThreeHighlights"
                  :key="'first-' + index"
                  class="highlight-item"
                  @click="handleHighlightClick(item)"
                >
                  <div class="item-indicator">
                    <div
                      class="priority-dot"
                      :class="getHighlightColor(item.priority)"
                    />
                    <div class="connector-line" />
                  </div>
                  <div class="item-content">
                    <p class="item-title">
                      <span class="category-label">{{ item.category }}：</span>
                      {{ item.displayTitle || item.title || item.content }}
                    </p>
                    <div
                      v-if="item.displaySummaryText"
                      class="item-summary"
                    >
                      <p class="summary-text">
                        {{ item.displaySummaryText }}
                      </p>
                    </div>
                    <div
                      v-if="item.displayRecommendationText"
                      class="item-recommendations"
                    >
                      <span class="section-label">行动建议：</span>
                      <span class="section-text">{{ item.displayRecommendationText }}</span>
                    </div>
                    <div v-if="item.sources && item.sources.length" class="item-sources">
                      <span class="sources-label">来源：</span>
                      <a
                        :href="item.sources[0].url"
                        :title="item.sources[0].title"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="source-link"
                      >
                        {{ item.sources[0].title }}
                      </a>
                      <el-popover
                        v-if="item.sources.length > 1"
                        placement="bottom-start"
                        width="320"
                        trigger="click"
                        popper-class="sources-popover"
                      >
                        <div class="popover-sources">
                          <div
                            v-for="(source, sourceIndex) in item.sources"
                            :key="sourceIndex"
                            class="popover-source"
                          >
                            <a
                              :href="source.url"
                              :title="source.title"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="popover-link"
                            >
                              {{ source.title }}
                            </a>
                          </div>
                        </div>
                        <span slot="reference" class="sources-more">等{{ item.sources.length }}个</span>
                      </el-popover>
                    </div>
                  </div>
                </div>
                <!-- 第二组数据（用于无缝循环） -->
                <div
                  v-for="(item, index) in topThreeHighlights"
                  :key="'second-' + index"
                  class="highlight-item"
                  @click="handleHighlightClick(item)"
                >
                  <div class="item-indicator">
                    <div
                      class="priority-dot"
                      :class="getHighlightColor(item.priority)"
                    />
                    <div class="connector-line" />
                  </div>
                  <div class="item-content">
                    <p class="item-title">
                      <span class="category-label">{{ item.category }}：</span>
                      {{ item.displayTitle || item.title || item.content }}
                    </p>
                    <div
                      v-if="item.displaySummaryText"
                      class="item-summary"
                    >
                      <p class="summary-text">
                        {{ item.displaySummaryText }}
                      </p>
                    </div>
                    <div
                      v-if="item.displayRecommendationText"
                      class="item-recommendations"
                    >
                      <span class="section-label">行动建议：</span>
                      <span class="section-text">{{ item.displayRecommendationText }}</span>
                    </div>
                    <div v-if="item.sources && item.sources.length" class="item-sources">
                      <span class="sources-label">来源：</span>
                      <a
                        :href="item.sources[0].url"
                        :title="item.sources[0].title"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="source-link"
                      >
                        {{ item.sources[0].title }}
                      </a>
                      <el-popover
                        v-if="item.sources.length > 1"
                        placement="bottom-start"
                        width="320"
                        trigger="click"
                        popper-class="sources-popover"
                      >
                        <div class="popover-sources">
                          <div
                            v-for="(source, sourceIndex) in item.sources"
                            :key="sourceIndex"
                            class="popover-source"
                          >
                            <a
                              :href="source.url"
                              :title="source.title"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="popover-link"
                            >
                              {{ source.title }}
                            </a>
                          </div>
                        </div>
                        <span slot="reference" class="sources-more">等{{ item.sources.length }}个</span>
                      </el-popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getDailyReport, updateDailyReportView } from '@/api/dashboard'
import InfoOverview from '@/components/Databoard/InfoOverview.vue'

export default {
  name: 'DailyReport',
  components: {
    InfoOverview
  },
  data() {
    return {
      selectedView: 'management',
      currentDate: '',
      dailyHighlights: [],
      loading: false,
      isPaused: false
    }
  },
  computed: {
    topThreeHighlights() {
      // return this.dailyHighlights.slice(0, 3)
      return this.dailyHighlights
    }
  },
  watch: {
    selectedView() {
      this.handleViewChange()
    }
  },
  mounted() {
    this.updateCurrentDate()
    this.fetchDailyReport()
  },
  methods: {
    updateCurrentDate() {
      const now = new Date()
      this.currentDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
    },
    async fetchDailyReport() {
      this.loading = true
      try {
        const response = await getDailyReport({
          view: this.selectedView
        })
        const highlights = response.data.highlights || []
        this.dailyHighlights = highlights.map((item) => this.normalizeHighlight(item))
      } catch (error) {
        console.error('获取每日简报失败:', error)
        this.$message.error('获取每日简报失败')
      } finally {
        this.loading = false
      }
    },
    async handleViewChange() {
      try {
        await updateDailyReportView({ view: this.selectedView })
        await this.fetchDailyReport()
        this.$message.success('视角切换成功')
      } catch (error) {
        console.error('更新视角失败:', error)
        this.$message.error('更新视角失败')
      }
    },
    getHighlightColor(priority) {
      const colors = {
        high: 'priority-high',
        medium: 'priority-medium',
        low: 'priority-low'
      }
      return colors[priority] || 'priority-default'
    },
    pauseScroll() {
      this.isPaused = true
    },
    resumeScroll() {
      this.isPaused = false
    },
    getPriorityType(priority) {
      const types = {
        high: 'danger',
        medium: 'warning',
        low: 'success'
      }
      return types[priority] || 'info'
    },
    normalizeHighlight(item) {
      const title = (item.title || '').toString().trim()
      const summaryLines = this.buildSummaryLines(item, title)
      const displayOutlook = this.normalizeOutlook(item.outlook, item.content)
      const displayRecommendations = this.normalizeRecommendations(
        item.recommendationLines,
        item.content
      )
      const splitSections = this.splitSummarySections(
        summaryLines,
        displayOutlook,
        displayRecommendations
      )
      const displaySummaryText = this.joinSummaryText(splitSections.summaryLines)
      const displayRecommendationText = this.joinRecommendationText(splitSections.recommendations)
      return {
        ...item,
        displayTitle: title,
        displaySummaryText,
        displayRecommendationText,
        sources: this.normalizeSources(item.sources)
      }
    },
    buildSummaryLines(item, title) {
      const summaryLines = this.normalizeSummaryLines(item.summaryLines)
      if (summaryLines.length) {
        return this.trimSummaryTitle(summaryLines, title)
      }
      const fallbackLines = this.extractSummaryFromContent(item.content)
      return this.trimSummaryTitle(fallbackLines, title)
    },
    normalizeSummaryLines(summaryLines) {
      if (!Array.isArray(summaryLines) || !summaryLines.length) {
        return []
      }
      return summaryLines
        .map((line) => this.normalizeSummaryLine(line))
        .filter(Boolean)
    },
    normalizeSummaryLine(line) {
      if (!line) {
        return ''
      }
      const text = line.toString().trim()
      return this.stripLeadingPunctuation(text)
    },
    normalizeOutlook(outlook, content) {
      if (typeof outlook === 'string' && outlook.trim()) {
        return this.stripLeadingPunctuation(outlook)
      }
      return this.extractOutlookFromContent(content)
    },
    normalizeRecommendations(recommendationLines, content) {
      if (Array.isArray(recommendationLines) && recommendationLines.length) {
        return recommendationLines
          .map((line) => this.normalizeSummaryLine(line))
          .filter(Boolean)
      }
      if (typeof recommendationLines === 'string' && recommendationLines.trim()) {
        return recommendationLines
          .split(/\n+/)
          .map((line) => this.normalizeSummaryLine(line))
          .filter(Boolean)
      }
      return this.extractRecommendationsFromContent(content)
    },
    stripLeadingPunctuation(text) {
      if (!text) {
        return ''
      }
      const withoutBullet = text.replace(/^[-•·\u2022\u00B7]\s*/, '')
      return withoutBullet.replace(/^[：:、，,。．.；;!?！？\s-]+/, '').trim()
    },
    trimSummaryTitle(summaryLines, title) {
      if (!title || !summaryLines.length) {
        return summaryLines
      }
      const [first, ...rest] = summaryLines
      if (typeof first !== 'string') {
        return summaryLines
      }
      const normalizedFirst = first.trim()
      const normalizedTitle = title.trim()
      if (!normalizedFirst.startsWith(normalizedTitle)) {
        return summaryLines
      }
      let trimmed = normalizedFirst.slice(normalizedTitle.length)
      trimmed = this.stripLeadingPunctuation(trimmed)
      if (!trimmed) {
        return rest
      }
      return [trimmed, ...rest]
    },
    extractSummaryFromContent(content) {
      if (typeof content !== 'string' || !content.trim()) {
        return []
      }
      const lines = content
        .split(/\n+/)
        .map((line) => this.normalizeSummaryLine(line))
        .filter(Boolean)
      const summaryLines = []
      for (const line of lines) {
        if (this.isSectionLabel(line)) {
          break
        }
        summaryLines.push(line)
      }
      return summaryLines
    },
    extractOutlookFromContent(content) {
      if (typeof content !== 'string' || !content.trim()) {
        return ''
      }
      const lines = content
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
      for (let index = 0; index < lines.length; index += 1) {
        const rawLine = lines[index]
        if (!rawLine.startsWith('展望')) {
          continue
        }
        const inline = rawLine.replace(/^展望[:：]?\s*/, '').trim()
        if (inline) {
          return this.stripLeadingPunctuation(inline)
        }
        const nextLine = lines[index + 1]
        return this.stripLeadingPunctuation(nextLine || '')
      }
      return ''
    },
    extractRecommendationsFromContent(content) {
      if (typeof content !== 'string' || !content.trim()) {
        return []
      }
      const lines = content
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
      let collecting = false
      const results = []
      for (let index = 0; index < lines.length; index += 1) {
        const rawLine = lines[index]
        if (!collecting && rawLine.startsWith('行动建议')) {
          collecting = true
          const inline = rawLine.replace(/^行动建议[:：]?\s*/, '').trim()
          if (inline) {
            results.push(this.stripLeadingPunctuation(inline))
          }
          continue
        }
        if (!collecting) {
          continue
        }
        if (this.isSectionLabel(rawLine)) {
          break
        }
        results.push(this.stripLeadingPunctuation(rawLine))
      }
      return results.filter(Boolean)
    },
    isSectionLabel(line) {
      if (!line) {
        return false
      }
      return line.startsWith('展望') || line.startsWith('行动建议')
    },
    splitSummarySections(summaryLines, outlook, recommendations) {
      const existingOutlook = outlook || ''
      const existingRecommendations = Array.isArray(recommendations) ? recommendations : []
      const parsed = this.extractSectionsFromSummary(summaryLines)
      return {
        summaryLines: parsed.summaryLines,
        outlook: existingOutlook || parsed.outlook,
        recommendations: existingRecommendations.length ? existingRecommendations : parsed.recommendations
      }
    },
    extractSectionsFromSummary(summaryLines) {
      const sentences = summaryLines.flatMap((line) => this.splitToSentences(line))
      const summary = []
      const recs = []
      let extractedOutlook = ''
      for (const sentence of sentences) {
        const clean = this.stripLeadingPunctuation(sentence)
        if (!clean) {
          continue
        }
        if (!extractedOutlook && this.isOutlookSentence(clean)) {
          extractedOutlook = clean
          continue
        }
        if (this.isRecommendationSentence(clean)) {
          recs.push(clean)
          continue
        }
        summary.push(clean)
      }
      if (!summary.length && summaryLines.length) {
        summary.push(...summaryLines)
      }
      return {
        summaryLines: summary,
        outlook: extractedOutlook,
        recommendations: recs
      }
    },
    joinSummaryText(lines) {
      if (!Array.isArray(lines) || !lines.length) {
        return ''
      }
      return lines.join('').replace(/\s+/g, ' ').trim()
    },
    joinRecommendationText(lines) {
      if (!Array.isArray(lines) || !lines.length) {
        return ''
      }
      return lines
        .map((line) => this.sanitizeRecommendationLine(line))
        .filter(Boolean)
        .join('；')
        .replace(/\s+/g, ' ')
        .trim()
    },
    sanitizeRecommendationLine(line) {
      if (!line) {
        return ''
      }
      const text = line.toString().trim()
      const withoutLabel = text.replace(/^行动建议[:：]?\s*/, '')
      const cleaned = this.stripLeadingPunctuation(withoutLabel)
      return cleaned.replace(/[。．.；;、，,!?！？]+$/, '').trim()
    },
    splitToSentences(text) {
      if (!text) {
        return []
      }
      const normalized = text.toString().replace(/([。！？!?])/g, '$1|')
      return normalized
        .split('|')
        .map((part) => part.trim())
        .filter(Boolean)
    },
    isOutlookSentence(sentence) {
      return /未来|展望|趋势|预计|前景|增速/.test(sentence)
    },
    isRecommendationSentence(sentence) {
      if (/建议/.test(sentence)) {
        return true
      }
      return /^(需|需要|应|应当|关注|跟踪|加强|优化|推进|布局|评估|尽快|保持|警惕|注意)/.test(sentence)
    },
    normalizeSources(sources) {
      if (!Array.isArray(sources)) {
        return []
      }
      return sources
        .map((source) => {
          if (typeof source === 'string') {
            const url = source.trim()
            return url ? { url, title: url } : null
          }
          if (source && typeof source === 'object') {
            const url = (source.url || source.link || '').toString().trim()
            if (!url) {
              return null
            }
            const title = (source.title || source.name || url).toString().trim()
            return { url, title }
          }
          return null
        })
        .filter(Boolean)
    },
    // 处理每日简报项点击事件
    handleHighlightClick(item) {
      this.$emit('highlight-click', {
        title: item.displayTitle || item.title || item.content,
        category: item.category,
        summary: item.displaySummaryText,
        recommendations: item.displayRecommendationText,
        sources: item.sources
      })
    },
    // 处理信息概览卡片点击事件
    handleInfoOverviewClick(item) {
      this.$emit('info-overview-click', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.daily-report {
  height: 200px;

  .report-card {
    margin-bottom: 0;
    height: 100%;

    .card-header {
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .card-title {
          font-size: 18px;
          font-weight: bold;
          color: #303133;
          margin: 0;
        }

        .header-actions {
          .view-selector {
            width: 150px;
          }
        }
      }
    }

    .report-content {
      height: 100%;
      display: flex;
      flex-direction: column;

      .highlights-section {
        // background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border-radius: 8px;
        // padding: 16px 20px;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          gap: 16px;

          .header-left {
            display: flex;
            align-items: flex-start;
            flex-shrink: 0;

            .header-icon {
              background: #409EFF;
              color: white;
              padding: 8px;
              border-radius: 6px;
              margin-right: 12px;
              display: flex;
              align-items: center;
              justify-content: center;

              .svg-icon {
                font-size: 16px;
              }
            }

            .header-text {
              .section-title {
                font-size: 16px;
                font-weight: bold;
                color: #303133;
                margin: 0 0 2px 0;
              }

              .section-subtitle {
                font-size: 12px;
                color: #909399;
                margin: 0;
              }
            }
          }

          .header-right {
            flex: 1;
            min-width: 0;
            display: flex;
            justify-content: flex-end;
            overflow: hidden;
          }
        }

        .highlights-list {
          flex: 1;
          overflow: hidden;
          padding-right: 4px;
          max-height: 120px;
          position: relative;

          .scroll-container {
            height: 100%;
            overflow: hidden;
          }

          .scroll-content {
            animation: scroll-up 20s linear infinite;

            &.paused {
              animation-play-state: paused;
            }
          }

          @keyframes scroll-up {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }

          .highlight-item {
            display: flex;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 8px;
            border-radius: 6px;
            margin-left: -8px;
            margin-right: -8px;

            &:hover {
              background-color: #f5f7fa;
              transform: translateX(4px);
            }

            &:not(:last-child) {
              padding-bottom: 8px;
              border-bottom: 1px solid #EEF2F7;
            }

            .item-indicator {
              flex-shrink: 0;
              margin-top: 2px;

              .priority-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                margin-top: 6px;

                &.priority-high {
                  background-color: #409EFF;
                }

                &.priority-medium {
                  background-color: #E6A23C;
                }

                &.priority-low {
                  background-color: #67C23A;
                }

                &.priority-default {
                  background-color: #C0C4CC;
                }
              }

              .connector-line {
                width: 1px;
                height: 100%;
                background-color: #E4E7ED;
                margin-left: 2.5px;
                margin-top: 3px;
              }
            }

            .item-content {
              margin-left: 12px;
              flex: 1;

              .item-title {
                color: #303133;
                font-size: 13px;
                line-height: 1.5;
                margin: 0 0 0px 0;
                white-space: normal;
                word-wrap: break-word;
                word-break: break-word;

                .category-label {
                  font-weight: 600;
                }
              }

              .item-summary {
                margin: 4px 0 6px 0;

                .summary-text {
                  margin: 0;
                  color: #606266;
                  font-size: 12px;
                  line-height: 1.5;
                }
              }

              .item-recommendations {
                margin: 4px 0 6px 0;
                color: #606266;
                font-size: 12px;
                line-height: 1.5;

                .section-label {
                  font-weight: 600;
                  color: #303133;
                }

                .section-text {
                  margin-left: 4px;
                }
              }

              .item-meta {
                display: flex;
                align-items: center;
              }

              .item-sources {
                margin-top: 2px;
                font-size: 11px;
                color: #909399;
                display: flex;
                align-items: center;
                gap: 4px;
                white-space: nowrap;
                overflow: hidden;

                .source-link {
                  color: #409EFF;
                  text-decoration: none;
                  max-width: 220px;
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
                  flex-shrink: 0;
                }
              }

              .popover-sources {
                display: flex;
                flex-direction: column;
                gap: 6px;
              }

              .popover-link {
                color: #409EFF;
                text-decoration: none;
                word-break: break-word;
              }

              .popover-link:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }
}
</style>
