<template>
  <div class="info-overview-section" v-loading="loading">
    <!-- <div class="overview-title">
      <span class="title-text">今日信息增量</span>
      <span class="title-hint">点击查看详情</span>
    </div> -->
    <div class="overview-items">
      <div
        v-for="(item, index) in items"
        :key="item.cardId || index"
        class="overview-item"
        :class="{ 'has-change': item.change !== 0 }"
        @click="handleItemClick(item)"
      >
        <div class="item-icon-wrapper">
          <div class="item-icon" :style="{ backgroundColor: item.color }">
            <i :class="item.icon"></i>
          </div>
          <div v-if="item.change !== 0" class="change-badge" :class="{ positive: item.change > 0, negative: item.change < 0 }">
            <i :class="item.change > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
          </div>
        </div>
        <div class="item-content">
          <div class="item-label">{{ item.label }}</div>
          <div class="item-value-wrapper">
            <span class="item-value">{{ formatValue(item.value) }}</span>
            <span v-if="item.change !== 0" class="item-change" :class="{ positive: item.change > 0, negative: item.change < 0 }">
              <i :class="item.change > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
              {{ Math.abs(item.change) }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDataCards } from '@/api/dashboard'

export default {
  name: 'InfoOverview',
  props: {
    // 可选：从外部传入数据，如果不传则组件内部获取
    data: {
      type: Array,
      default: null
    },
    // 可选：从外部传入loading状态
    externalLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      items: [],
      loading: false
    }
  },
  computed: {
    isLoading() {
      return this.externalLoading || this.loading
    }
  },
  watch: {
    // 监听外部传入的数据变化
    data: {
      immediate: true,
      handler(newData) {
        if (newData && newData.length > 0) {
          this.items = newData
        }
      }
    }
  },
  mounted() {
    // 如果没有传入数据，则自己获取
    if (!this.data || this.data.length === 0) {
      this.fetchInfoIncrements()
    }
  },
  methods: {
    // 获取信息增量数据
    async fetchInfoIncrements() {
      this.loading = true
      try {
        const response = await getDataCards({
          period: 'day'
        })

        const cards = response.data?.cards || []

        // 将API返回的数据映射到items格式
        this.items = cards.map((card, index) => {
          // 解析趋势变化百分比
          let change = 0
          const trendText = card.trend?.text || ''
          // 支持多种格式："+12.5%"、"较昨日 ↑ 12.5%"、"↑ 12.5%" 等
          const changeMatch = trendText.match(/([+-]?\d+\.?\d*)%/) || trendText.match(/([+-]?\d+\.?\d*)/)
          if (changeMatch) {
            change = parseFloat(changeMatch[1])
          }

          // 如果没有找到百分比，检查是否有↑↓符号
          if (change === 0 && trendText.includes('↓')) {
            // 如果只有↓符号但没有数字，设为-1表示下降
            change = -1
          }

          // 根据label映射类型和图标
          const typeMap = this.getTypeMapping(card.label)

          return {
            type: typeMap.type,
            label: card.label,
            value: card.value || '--',
            change: change,
            icon: typeMap.icon,
            color: typeMap.color,
            cardId: card.id // 保存cardId用于跳转
          }
        })

        // 如果API返回的数据不足4个，使用默认数据补充
        if (this.items.length < 4) {
          const defaultCards = this.getDefaultInfoIncrements()
          this.items = [...this.items, ...defaultCards.slice(this.items.length)]
        }
      } catch (error) {
        console.error('获取信息增量数据失败:', error)
        // 使用默认数据作为降级方案
        this.items = this.getDefaultInfoIncrements()
      } finally {
        this.loading = false
      }
    },

    // 根据label映射类型、图标和颜色
    getTypeMapping(label) {
      const mapping = {
        '政策动态': {
          type: 'policy',
          icon: 'el-icon-document',
          color: '#409EFF'
        },
        '行业动态': {
          type: 'industry',
          icon: 'el-icon-office-building',
          color: '#67C23A'
        },
        '竞品信息': {
          type: 'competitor',
          icon: 'el-icon-trophy',
          color: '#E6A23C'
        },
        '学术论文': {
          type: 'academic',
          icon: 'el-icon-reading',
          color: '#F56C6C'
        },
        '今日信息增量': {
          type: 'all',
          icon: 'el-icon-data-line',
          color: '#409EFF'
        },
        '客户线索': {
          type: 'leads',
          icon: 'el-icon-user',
          color: '#67C23A'
        },
        '最新论文': {
          type: 'academic',
          icon: 'el-icon-reading',
          color: '#F56C6C'
        },
        '预警监控数': {
          type: 'competitor',
          icon: 'el-icon-warning',
          color: '#F56C6C'
        }
      }

      return mapping[label] || {
        type: 'other',
        icon: 'el-icon-info',
        color: '#909399'
      }
    },

    // 获取默认信息增量数据
    getDefaultInfoIncrements() {
      return [
        {
          type: 'policy',
          label: '政策动态',
          value: '--',
          change: 0,
          icon: 'el-icon-document',
          color: '#409EFF'
        },
        {
          type: 'industry',
          label: '行业动态',
          value: '--',
          change: 0,
          icon: 'el-icon-office-building',
          color: '#67C23A'
        },
        {
          type: 'competitor',
          label: '竞品信息',
          value: '--',
          change: 0,
          icon: 'el-icon-trophy',
          color: '#E6A23C'
        },
        {
          type: 'academic',
          label: '学术论文',
          value: '--',
          change: 0,
          icon: 'el-icon-reading',
          color: '#F56C6C'
        }
      ]
    },

    // 处理卡片点击事件
    handleItemClick(item) {
      this.$emit('item-click', item)
    },

    // 格式化数值显示
    formatValue(value) {
      if (!value || value === '--') {
        return '--'
      }
      // 如果已经是格式化好的字符串（包含"条"、"篇"等），直接返回
      if (typeof value === 'string' && (value.includes('条') || value.includes('篇') || value.includes('个'))) {
        return value
      }
      // 如果是数字，添加"条"作为默认单位
      if (typeof value === 'number') {
        return `${value}条`
      }
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
.info-overview-section {
  background: transparent;
  box-shadow: none;
  padding: 0;
  border-radius: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  .overview-title {
    display: flex;
    flex-direction: column;
    gap: 2px;
    white-space: nowrap;
    min-width: 80px;

    .title-text {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      line-height: 1.2;
    }

    .title-hint {
      font-size: 10px;
      color: #909399;
      line-height: 1.2;
    }
  }

  .overview-items {
    display: flex;
    gap: 20px;
    flex: 1;
    overflow-x: auto;

    // 自定义滚动条样式
    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f5f7fa;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c0c4cc;
      border-radius: 2px;

      &:hover {
        background: #909399;
      }
    }

    .overview-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      background: #fff;
      border-radius: 6px;
      border: 1px solid #e4e7ed;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 140px;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;

      // 添加背景渐变效果
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent 0%, currentColor 50%, transparent 100%);
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        border-color: currentColor;

        &::before {
          opacity: 0.3;
        }

        .item-icon {
          transform: scale(1.1) rotate(5deg);
        }
      }

      &.has-change {
        border-left: 3px solid;
        border-left-color: currentColor;
      }

      .item-icon-wrapper {
        position: relative;
        flex-shrink: 0;

        .item-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 16px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .change-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 7px;
          border: 1.5px solid #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

          &.positive {
            background: #67C23A;
            color: #fff;
          }

          &.negative {
            background: #F56C6C;
            color: #fff;
          }
        }
      }

      .item-content {
        flex: 1;
        min-width: 0;

        .item-label {
          font-size: 10px;
          color: #909399;
          margin-bottom: 1px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-value-wrapper {
          display: flex;
          align-items: baseline;
          gap: 3px;
          flex-wrap: wrap;

          .item-value {
            font-size: 16px;
            font-weight: 700;
            color: #303133;
            line-height: 1;
            letter-spacing: -0.5px;
          }

          .item-change {
            font-size: 10px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 1px;
            padding: 1px 3px;
            border-radius: 2px;
            white-space: nowrap;

            i {
              font-size: 10px;
            }

            &.positive {
              color: #67C23A;
              background: rgba(103, 194, 58, 0.1);
            }

            &.negative {
              color: #F56C6C;
              background: rgba(245, 108, 108, 0.1);
            }
          }
        }
      }

      // 为不同类型设置不同的主色调
      &:nth-child(1) {
        color: #409EFF;
      }

      &:nth-child(2) {
        color: #67C23A;
      }

      &:nth-child(3) {
        color: #E6A23C;
      }

      &:nth-child(4) {
        color: #F56C6C;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1600px) {
  .info-overview-section {
    padding: 10px 14px;
    gap: 12px;

    .overview-items {
      gap: 16px;

      .overview-item {
        padding: 8px 12px;
        min-width: 160px;
        gap: 8px;

        .item-icon {
          width: 44px;
          height: 44px;
          font-size: 22px;
        }

        .item-content {
          .item-label {
            font-size: 11px;
            margin-bottom: 3px;
          }

          .item-value-wrapper {
            .item-value {
              font-size: 18px;
            }

            .item-change {
              font-size: 11px;
            }
          }
        }
      }
    }
  }
}
</style>

