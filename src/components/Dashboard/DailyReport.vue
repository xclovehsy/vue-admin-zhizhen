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

          <div class="highlights-list">
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
export default {
  name: 'DailyReport',
  data() {
    return {
      selectedView: 'management',
      currentDate: '',
      dailyHighlights: [
        {
          category: '政策动向',
          content: '国家发布新一代人工智能创新发展指导意见，明确支持企业建设行业大模型。建议立即组织跨部门会议评估该政策对公司业务的影响，制定响应策略。',
          priority: 'high',
          priorityText: '高'
        },
        {
          category: '竞品动态',
          content: '竞品A公司宣布完成新一轮融资，计划加大AI研发投入，重点布局智能决策支持系统。建议密切关注其产品迭代计划，调整我们的竞品策略。',
          priority: 'medium',
          priorityText: '中'
        },
        {
          category: '销售机会',
          content: '某省交通厅发布智能交通系统升级项目招标公告，预算约1200万元，需求与我司产品高度匹配。建议立即组建专项投标小组，准备相关材料。',
          priority: 'high',
          priorityText: '高'
        }
      ]
    }
  },
  mounted() {
    this.updateCurrentDate()
  },
  methods: {
    updateCurrentDate() {
      const now = new Date()
      this.currentDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
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
