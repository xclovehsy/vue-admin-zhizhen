<template>
  <div class="leads-tracking">
    <el-card class="leads-card" shadow="hover" v-loading="loading">
      <div slot="header" class="card-header">
        <div class="header-content">
          <h3 class="card-title">客户与线索跟踪</h3>
          <div class="header-actions">
            <el-select
              v-model="selectedPeriod"
              placeholder="选择时间周期"
              size="small"
              class="period-selector"
              @change="handlePeriodChange"
            >
              <el-option label="本周" value="week" />
              <el-option label="本月" value="month" />
              <el-option label="本季度" value="quarter" />
            </el-select>
          </div>
        </div>
      </div>

      <div class="leads-content">
        <!-- 线索渠道看板 -->
        <div class="leads-board">
          <!-- 新获取 -->
          <div class="board-column">
            <div class="column-header">
              <h4 class="column-title">新获取</h4>
              <el-tag size="mini" type="info">{{ newLeads.length }} 个</el-tag>
            </div>
            <div class="leads-list">
              <el-card
                v-for="lead in newLeads"
                :key="lead.id"
                class="lead-card"
                shadow="hover"
              >
                <div class="lead-header">
                  <el-tag
                    :type="getChannelType(lead.channel)"
                    size="mini"
                    class="channel-tag"
                  >
                    {{ lead.channel }}
                  </el-tag>
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <i class="el-icon-more" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>编辑</el-dropdown-item>
                      <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <h5 class="lead-title">{{ lead.title }}</h5>
                <p class="lead-description">{{ lead.description }}</p>
                <div class="lead-footer">
                  <div class="lead-owner">
                    <el-avatar
                      v-if="lead.owner"
                      :src="lead.owner.avatar"
                      :size="24"
                    />
                    <span v-if="lead.owner" class="owner-name">{{ lead.owner.name }}</span>
                  </div>
                  <el-button type="text" size="mini" icon="el-icon-lightbulb" @click="handleGetInsights(lead.id)">AI洞察</el-button>
                </div>
              </el-card>
            </div>
          </div>

          <!-- 已分配 -->
          <div class="board-column">
            <div class="column-header">
              <h4 class="column-title">已分配</h4>
              <el-tag size="mini" type="warning">{{ assignedLeads.length }} 个</el-tag>
            </div>
            <div class="leads-list">
              <el-card
                v-for="lead in assignedLeads"
                :key="lead.id"
                class="lead-card"
                shadow="hover"
              >
                <div class="lead-header">
                  <el-tag
                    :type="getChannelType(lead.channel)"
                    size="mini"
                    class="channel-tag"
                  >
                    {{ lead.channel }}
                  </el-tag>
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <i class="el-icon-more" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>编辑</el-dropdown-item>
                      <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <h5 class="lead-title">{{ lead.title }}</h5>
                <p class="lead-description">{{ lead.description }}</p>
                <div class="lead-footer">
                  <div class="lead-owner">
                    <el-avatar
                      v-if="lead.owner"
                      :src="lead.owner.avatar"
                      :size="24"
                    />
                    <span v-if="lead.owner" class="owner-name">{{ lead.owner.name }}</span>
                  </div>
                  <el-button type="text" size="mini" icon="el-icon-lightbulb" @click="handleGetInsights(lead.id)">AI洞察</el-button>
                </div>
              </el-card>
            </div>
          </div>

          <!-- 跟进中 -->
          <div class="board-column">
            <div class="column-header">
              <h4 class="column-title">跟进中</h4>
              <el-tag size="mini" type="success">{{ followingLeads.length }} 个</el-tag>
            </div>
            <div class="leads-list">
              <el-card
                v-for="lead in followingLeads"
                :key="lead.id"
                class="lead-card"
                shadow="hover"
              >
                <div class="lead-header">
                  <el-tag
                    :type="getChannelType(lead.channel)"
                    size="mini"
                    class="channel-tag"
                  >
                    {{ lead.channel }}
                  </el-tag>
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <i class="el-icon-more" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>编辑</el-dropdown-item>
                      <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <h5 class="lead-title">{{ lead.title }}</h5>
                <p class="lead-description">{{ lead.description }}</p>
                <div class="lead-footer">
                  <div class="lead-owner">
                    <el-avatar
                      v-if="lead.owner"
                      :src="lead.owner.avatar"
                      :size="24"
                    />
                    <span v-if="lead.owner" class="owner-name">{{ lead.owner.name }}</span>
                  </div>
                  <el-button type="text" size="mini" icon="el-icon-lightbulb" @click="handleGetInsights(lead.id)">AI洞察</el-button>
                </div>
              </el-card>
            </div>
          </div>
        </div>

        <!-- 线索趋势图表 -->
        <div class="chart-section">
          <div class="chart-header">
            <h4 class="chart-title">线索数量变化趋势</h4>
            <div class="chart-controls">
              <el-radio-group v-model="selectedChartType" size="mini" @change="handleChartTypeChange">
                <el-radio-button
                  v-for="type in chartTypes"
                  :key="type.value"
                  :label="type.value"
                >
                  {{ type.label }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <div class="chart-container">
            <div class="chart-content">
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color new-leads"></div>
                  <span>新线索</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color converted-leads"></div>
                  <span>转化线索</span>
                </div>
              </div>
              
              <div class="chart-data">
                <div class="data-row">
                  <span class="data-label">新线索趋势：</span>
                  <div class="data-bars">
                    <div v-for="(value, index) in newLeadsData" :key="index" class="data-bar new-leads" :style="{ height: getBarHeight(value) + '%' }" :title="`${value}`"></div>
                  </div>
                </div>
                <div class="data-row">
                  <span class="data-label">转化线索趋势：</span>
                  <div class="data-bars">
                    <div v-for="(value, index) in convertedLeadsData" :key="index" class="data-bar converted-leads" :style="{ height: getBarHeight(value) + '%' }" :title="`${value}`"></div>
                  </div>
                </div>
              </div>
              
              <div class="chart-labels">
                <span v-for="label in chartLabels" :key="label" class="chart-label">{{ label }}</span>
              </div>
              
              <div class="chart-note">
                <i class="el-icon-data-line"></i>
                数据来源：本周线索统计
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getLeadsBoard, getLeadsTrend, updateLeadStatus, getLeadInsights } from '@/api/dashboard'

export default {
  name: 'LeadsTracking',
  data() {
    return {
      selectedPeriod: 'week',
      selectedChartType: 'new',
      loading: false,
      chartTypes: [
        { label: '新线索', value: 'new' },
        { label: '转化线索', value: 'converted' }
      ],
      newLeadsData: [],
      convertedLeadsData: [],
      chartLabels: [],
      boardData: {
        columns: []
      },
      newLeads: [],
      assignedLeads: [],
      followingLeads: []
    }
  },
  mounted() {
    this.fetchLeadsData()
  },
  methods: {
    async fetchLeadsData() {
      this.loading = true
      try {
        // 获取看板数据
        const boardResponse = await getLeadsBoard({ period: this.selectedPeriod })
        console.log('看板数据响应:', boardResponse)
        
        if (boardResponse && boardResponse.data) {
          this.boardData = boardResponse.data
          console.log('设置后的boardData:', this.boardData)
          // 立即处理看板数据
          this.processBoardData()
        } else {
          console.error('看板数据响应格式错误:', boardResponse)
          throw new Error('看板数据响应格式错误')
        }
        
        // 获取趋势数据
        const trendResponse = await getLeadsTrend({ 
          period: this.selectedPeriod, 
          type: this.selectedChartType 
        })
        
        if (trendResponse && trendResponse.data && trendResponse.data.trendData) {
          const trendData = trendResponse.data.trendData
          this.chartLabels = trendData?.labels || []
          this.newLeadsData = trendData?.newLeads || []
          this.convertedLeadsData = trendData?.convertedLeads || []
        } else {
          console.warn('趋势数据响应格式错误，使用默认数据')
          this.chartLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          this.newLeadsData = [12, 19, 15, 28, 22, 18, 25]
          this.convertedLeadsData = [5, 8, 6, 12, 9, 7, 10]
        }
      } catch (error) {
        console.error('获取线索数据失败:', error)
        this.$message.error('获取线索数据失败')
        // 使用默认数据作为降级方案
        this.setDefaultData()
      } finally {
        this.loading = false
      }
    },
    processBoardData() {
      this.newLeads = []
      this.assignedLeads = []
      this.followingLeads = []
      
      // 安全检查，确保 boardData.columns 存在且为数组
      if (this.boardData && this.boardData.columns && Array.isArray(this.boardData.columns)) {
        this.boardData.columns.forEach(column => {
          switch (column.status) {
            case 'new':
              this.newLeads = column.leads || []
              break
            case 'assigned':
              this.assignedLeads = column.leads || []
              break
            case 'following':
              this.followingLeads = column.leads || []
              break
          }
        })
      } else {
        console.warn('boardData.columns 不存在或不是数组:', this.boardData)
      }
    },
    setDefaultData() {
      this.chartLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      this.newLeadsData = [0, 0, 0, 0, 0, 0, 0]
      this.convertedLeadsData = [0, 0, 0, 0, 0, 0, 0]
      
      // 设置默认看板数据
      this.boardData = {
        columns: [
          {
            status: 'new',
            title: '新获取',
            count: 1,
            leads: [
              {
                id: 1,
                channel: '--',
                title: '--',
                description: '--',
                owner: {
                  name: '--',
                  avatar: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/b6b4d71d6ca09f6d61f1d94e76a03b48.png'
                }
              }
            ]
          },
          {
            status: 'assigned',
            title: '已分配',
            count: 0,
            leads: []
          },
          {
            status: 'following',
            title: '跟进中',
            count: 0,
            leads: []
          }
        ]
      }
      
      // 处理看板数据
      this.processBoardData()
    },
    async handlePeriodChange() {
      await this.fetchLeadsData()
    },
    async handleChartTypeChange() {
      try {
        const response = await getLeadsTrend({ 
          period: this.selectedPeriod, 
          type: this.selectedChartType 
        })
        const trendData = response.data.trendData
        this.chartLabels = trendData?.labels || []
        this.newLeadsData = trendData?.newLeads || []
        this.convertedLeadsData = trendData?.convertedLeads || []
      } catch (error) {
        console.error('获取趋势数据失败:', error)
        this.$message.error('获取趋势数据失败')
      }
    },
    async handleLeadStatusChange(leadId, newStatus) {
      try {
        await updateLeadStatus(leadId, { status: newStatus })
        this.$message.success('线索状态更新成功')
        await this.fetchLeadsData()
      } catch (error) {
        console.error('更新线索状态失败:', error)
        this.$message.error('更新线索状态失败')
      }
    },
    async handleGetInsights(leadId) {
      try {
        const response = await getLeadInsights(leadId)
        const insights = response.data.insights
        
        // 显示AI洞察弹窗
        this.$alert(
          `机会评分：${insights.opportunityScore}/100\n\n风险因素：${insights.riskFactors.join('、')}\n\nAI建议：${insights.suggestions.join('、')}\n\n下一步行动：${insights.nextSteps.join('、')}`,
          'AI洞察分析',
          {
            confirmButtonText: '确定',
            type: 'info'
          }
        )
      } catch (error) {
        console.error('获取AI洞察失败:', error)
        this.$message.error('获取AI洞察失败')
      }
    },
    getChannelType(channel) {
      const types = {
        '招标网': 'primary',
        '官网': 'success',
        '论文库': 'warning',
        '展会': 'info',
        '合作伙伴': 'danger'
      }
      return types[channel] || 'info'
    },
    getBarHeight(value) {
      // 计算柱状图高度，以最大值为100%
      const maxValue = Math.max(...this.newLeadsData, ...this.convertedLeadsData)
      return maxValue > 0 ? (value / maxValue) * 100 : 0
    }
  },
  watch: {
    selectedPeriod() {
      this.handlePeriodChange()
    },
    selectedChartType() {
      this.handleChartTypeChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.leads-tracking {
  .leads-card {
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
          .period-selector {
            width: 120px;
          }
        }
      }
    }

    .leads-content {
      .leads-board {
        display: flex;
        gap: 20px;
        overflow-x: auto;
        padding-bottom: 16px;
        margin-bottom: 24px;

        .board-column {
          min-width: 280px;
          flex-shrink: 0;

          .column-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 0 4px;

            .column-title {
              font-size: 16px;
              font-weight: 500;
              color: #303133;
              margin: 0;
            }
          }

          .leads-list {
            display: flex;
            flex-direction: column;
            gap: 12px;

            .lead-card {
              transition: all 0.3s ease;

              &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              }

              .lead-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;

                .channel-tag {
                  margin: 0;
                }

                .el-dropdown-link {
                  cursor: pointer;
                  color: #C0C4CC;

                  &:hover {
                    color: #409EFF;
                  }
                }
              }

              .lead-title {
                font-size: 14px;
                font-weight: 500;
                color: #303133;
                margin: 0 0 8px 0;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }

              .lead-description {
                font-size: 13px;
                color: #606266;
                margin: 0 0 12px 0;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }

              .lead-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .lead-owner {
                  display: flex;
                  align-items: center;

                  .owner-name {
                    font-size: 12px;
                    color: #909399;
                    margin-left: 8px;
                  }
                }
              }
            }
          }
        }
      }

      .chart-section {
        background-color: #F5F7FA;
        border-radius: 8px;
        padding: 20px;

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          .chart-title {
            font-size: 16px;
            font-weight: 500;
            color: #303133;
            margin: 0;
          }

          .chart-controls {
            .el-radio-group {
              .el-radio-button__inner {
                font-size: 12px;
                padding: 6px 12px;
              }
            }
          }
        }

        .chart-container {
          .chart-content {
            height: 200px;
            display: flex;
            flex-direction: column;
            
            .chart-legend {
              display: flex;
              justify-content: center;
              gap: 20px;
              margin-bottom: 16px;
              
              .legend-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                color: #606266;
                
                .legend-color {
                  width: 12px;
                  height: 12px;
                  border-radius: 2px;
                  
                  &.new-leads {
                    background-color: #409EFF;
                  }
                  
                  &.converted-leads {
                    background-color: #67C23A;
                  }
                }
              }
            }
            
            .chart-data {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 12px;
              margin-bottom: 16px;
              
              .data-row {
                display: flex;
                align-items: end;
                gap: 12px;
                height: 60px;
                
                .data-label {
                  font-size: 12px;
                  color: #606266;
                  width: 80px;
                  flex-shrink: 0;
                }
                
                .data-bars {
                  flex: 1;
                  display: flex;
                  align-items: end;
                  gap: 4px;
                  height: 100%;
                  
                  .data-bar {
                    flex: 1;
                    min-height: 4px;
                    border-radius: 2px 2px 0 0;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    
                    &:hover {
                      opacity: 0.8;
                      transform: scaleY(1.05);
                    }
                    
                    &.new-leads {
                      background-color: #409EFF;
                    }
                    
                    &.converted-leads {
                      background-color: #67C23A;
                    }
                  }
                }
              }
            }
            
            .chart-labels {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              padding: 0 80px 0 92px;
              
              .chart-label {
                font-size: 11px;
                color: #909399;
                text-align: center;
                flex: 1;
              }
            }
            
            .chart-note {
              text-align: center;
              font-size: 12px;
              color: #909399;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 4px;
              
              i {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .leads-tracking {
    .leads-card {
      .leads-content {
        .leads-board {
          flex-direction: column;

          .board-column {
            min-width: auto;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
