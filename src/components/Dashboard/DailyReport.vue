<template>
  <div class="daily-report">
    <el-card class="report-card" shadow="hover">
      <div slot="header" class="card-header">
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
      </div>

      <div class="report-content">
        <div class="highlights-section">
          <div class="section-header">
            <div class="header-icon">
              <svg-icon icon-class="dashboard" />
            </div>
            <div class="header-text">
              <h4 class="section-title">今日重点关注</h4>
              <p class="section-subtitle">以下是AI为您精选的3条关键信息</p>
            </div>
          </div>

          <div class="highlights-list" v-loading="loading">
            <div
              v-for="(item, index) in dailyHighlights"
              :key="index"
              class="highlight-item"
            >
              <div class="item-indicator">
                <div
                  class="priority-dot"
                  :class="getHighlightColor(item.priority)"
                />
                <div v-if="index < dailyHighlights.length - 1" class="connector-line" />
              </div>
              <div class="item-content">
                <p class="item-text">
                  <span class="category-label">{{ item.category }}：</span>
                  {{ item.content }}
                </p>
                <div class="item-meta">
                  <el-tag
                    :type="getPriorityType(item.priority)"
                    size="mini"
                  >
                    优先级：{{ item.priorityText }}
                  </el-tag>
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

export default {
  name: 'DailyReport',
  data() {
    return {
      selectedView: 'management',
      currentDate: '',
      dailyHighlights: [],
      loading: false
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
  .report-card {
    margin-bottom: 20px;

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
      .highlights-section {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border-radius: 12px;
        padding: 24px;

        .section-header {
          display: flex;
          align-items: flex-start;
          margin-bottom: 20px;

          .header-icon {
            background: #409EFF;
            color: white;
            padding: 12px;
            border-radius: 8px;
            margin-right: 16px;
            display: flex;
            align-items: center;
            justify-content: center;

            .svg-icon {
              font-size: 20px;
            }
          }

          .header-text {
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #303133;
              margin: 0 0 4px 0;
            }

            .section-subtitle {
              font-size: 14px;
              color: #909399;
              margin: 0;
            }
          }
        }

        .highlights-list {
          .highlight-item {
            display: flex;
            margin-bottom: 16px;

            &:last-child {
              margin-bottom: 0;
            }

            .item-indicator {
              flex-shrink: 0;
              margin-top: 4px;

              .priority-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-top: 8px;

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
                width: 2px;
                height: 100%;
                background-color: #E4E7ED;
                margin-left: 3px;
                margin-top: 4px;
              }
            }

            .item-content {
              margin-left: 16px;
              flex: 1;

              .item-text {
                color: #303133;
                line-height: 1.6;
                margin: 0 0 8px 0;

                .category-label {
                  font-weight: 500;
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
