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
                <p class="section-subtitle">以下是AI为您精选的3条关键信息</p>
              </div>
            </div>
            <div class="header-right">
              <info-overview />
            </div>
          </div>

          <div class="highlights-list" v-loading="loading">
            <div
              v-for="(item, index) in topThreeHighlights"
              :key="index"
              class="highlight-item"
            >
              <div class="item-indicator">
                <div
                  class="priority-dot"
                  :class="getHighlightColor(item.priority)"
                />
                <div v-if="index < topThreeHighlights.length - 1" class="connector-line" />
              </div>
              <div class="item-content">
                <p class="item-text">
                  <span class="category-label">{{ item.category }}：</span>
                  {{ item.content }}
                </p>
                <!-- <div class="item-meta">
                  <el-tag
                    :type="getPriorityType(item.priority)"
                    size="mini"
                  >
                    优先级：{{ item.priorityText }}
                  </el-tag>
                </div> -->
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
      loading: false
    }
  },
  computed: {
    topThreeHighlights() {
      // return this.dailyHighlights.slice(0, 3)
      return this.dailyHighlights
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
        this.dailyHighlights = response.data.highlights || []
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
    getPriorityType(priority) {
      const types = {
        high: 'danger',
        medium: 'warning',
        low: 'success'
      }
      return types[priority] || 'info'
    }
  },
  watch: {
    selectedView() {
      this.handleViewChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.daily-report {
  height: 220px;

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
          overflow-y: auto;
          padding-right: 4px;
          max-height: 120px;

          // 自定义滚动条样式
          &::-webkit-scrollbar {
            width: 6px;
          }

          &::-webkit-scrollbar-track {
            background: #f5f7fa;
            border-radius: 3px;
          }

          &::-webkit-scrollbar-thumb {
            background: #c0c4cc;
            border-radius: 3px;

            &:hover {
              background: #909399;
            }
          }

          .highlight-item {
            display: flex;
            margin-bottom: 12px;

            &:last-child {
              margin-bottom: 0;
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

              .item-text {
                color: #303133;
                font-size: 13px;
                line-height: 1.5;
                margin: 0 0 0px 0;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;

                .category-label {
                  font-weight: 600;
                }
              }

              .item-meta {
                display: flex;
                align-items: center;
              }
            }
          }
        }
      }
    }
  }
}
</style>
