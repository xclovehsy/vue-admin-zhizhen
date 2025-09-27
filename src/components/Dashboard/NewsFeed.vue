<template>
  <div class="news-feed">
    <el-card class="news-card" shadow="hover">
      <div slot="header" class="card-header">
        <div class="header-content">
          <h3 class="card-title">今日全球要闻</h3>
          <div class="header-actions">
            <el-button size="mini" type="text" icon="el-icon-check">全部已读</el-button>
            <el-button size="mini" type="text" icon="el-icon-filter">筛选</el-button>
          </div>
        </div>
      </div>

      <div class="news-content">
        <!-- 左侧信息流列表 -->
        <div class="news-sidebar">
          <div class="sidebar-header">
            <el-input
              v-model="searchQuery"
              placeholder="搜索要闻..."
              size="small"
              prefix-icon="el-icon-search"
              class="search-input"
            />

            <div class="category-tabs">
              <el-tag
                v-for="category in categories"
                :key="category.value"
                :type="selectedCategory === category.value ? 'primary' : ''"
                :effect="selectedCategory === category.value ? 'dark' : 'plain'"
                size="small"
                class="category-tag"
                @click="selectedCategory = category.value"
              >
                {{ category.label }}
              </el-tag>
            </div>
          </div>

          <!-- 信息列表 -->
          <div class="news-list">
            <div
              v-for="(news, index) in filteredNews"
              :key="index"
              :class="[
                'news-item',
                selectedNews && selectedNews.id === news.id ? 'active' : ''
              ]"
              @click="selectNews(news)"
            >
              <div class="item-header">
                <el-tag
                  :type="getCategoryType(news.category)"
                  size="mini"
                  class="category-tag"
                >
                  {{ news.category }}
                </el-tag>
                <span class="item-time">{{ news.time }}</span>
              </div>
              <h4 class="item-title">
                {{ news.title }}
              </h4>
              <div class="item-footer">
                <span class="item-source">{{ news.source }}</span>
                <i class="el-icon-arrow-right" />
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧信息详情 -->
        <div class="news-detail">
          <div v-if="selectedNews" class="detail-content">
            <div class="detail-header">
              <el-tag
                :type="getCategoryType(selectedNews.category)"
                size="small"
                class="detail-category"
              >
                {{ selectedNews.category }}
              </el-tag>
              <h3 class="detail-title">
                {{ selectedNews.title }}
              </h3>
              <div class="detail-meta">
                <span>来源：{{ selectedNews.source }}</span>
                <span>发布时间：{{ selectedNews.publishTime }}</span>
                <span>阅读时间：{{ selectedNews.readTime }}</span>
              </div>

              <el-alert
                :title="`原文链接：${selectedNews.link}`"
                type="info"
                :closable="false"
                class="link-alert"
              >
                <template slot="title">
                  <div class="link-content">
                    <i class="el-icon-link" />
                    <a :href="selectedNews.link" target="_blank" class="link-text">
                      {{ selectedNews.link }}
                    </a>
                  </div>
                </template>
              </el-alert>
            </div>

            <!-- AI智能摘要 -->
            <div class="summary-section">
              <h4 class="section-title">
                <i class="el-icon-lightbulb" />
                智能摘要
              </h4>
              <el-alert
                :title="selectedNews.summary"
                type="info"
                :closable="false"
                class="summary-alert"
              />
            </div>

            <!-- AI行动建议 -->
            <div class="action-section">
              <h4 class="section-title">
                <i class="el-icon-cpu" />
                AI行动建议
              </h4>
              <el-alert
                :title="selectedNews.actionSuggestion"
                type="warning"
                :closable="false"
                class="action-alert"
              >
                <template slot="title">
                  <div class="action-content">
                    <i class="el-icon-warning" />
                    <span>{{ selectedNews.actionSuggestion }}</span>
                  </div>
                </template>
              </el-alert>
              <div class="action-buttons">
                <el-button type="primary" size="small" icon="el-icon-check">采纳建议</el-button>
                <el-button size="small" icon="el-icon-edit">编辑建议</el-button>
              </div>
            </div>

            <!-- 相关推荐 -->
            <div class="related-section">
              <h4 class="section-title">相关推荐</h4>
              <el-row :gutter="12">
                <el-col
                  v-for="related in selectedNews.relatedNews"
                  :key="related.id"
                  :span="12"
                >
                  <el-card
                    class="related-card"
                    shadow="hover"
                    @click.native="handleRelatedClick(related)"
                  >
                    <h5 class="related-title">{{ related.title }}</h5>
                    <p class="related-meta">{{ related.source }} · {{ related.time }}</p>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>

          <div v-else class="empty-state">
            <el-empty description="请选择一条新闻查看详情">
              <i class="el-icon-document" style="font-size: 48px; color: #C0C4CC;" />
            </el-empty>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'NewsFeed',
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      selectedNews: null,
      categories: [
        { label: '全部', value: 'all' },
        { label: '政策新闻', value: 'policy' },
        { label: '行业动态', value: 'industry' },
        { label: '竞品消息', value: 'competitor' },
        { label: '技术前沿', value: 'tech' }
      ],
      newsList: [
        {
          id: 1,
          category: '机会',
          title: '国家发布新一代人工智能创新发展指导意见，明确支持企业建设行业大模型',
          source: '政策新闻',
          time: '09:32',
          publishTime: '2023-11-15',
          readTime: '5分钟',
          link: 'http://www.gov.cn/zhengce/content/2023-11/15/content_5823121.htm',
          summary: '国家发改委与科技部联合发布《新一代人工智能创新发展指导意见》，明确提出支持具备条件的企业建设行业大模型，推动AI技术与实体经济深度融合。文件特别强调了在制造、金融、医疗、教育等重点行业的AI应用，并提出将设立专项基金支持相关技术研发与产业化。意见还提到将建立AI伦理审查和安全评估机制，规范技术应用。该政策将为我国AI产业发展提供强有力的政策支持，预计将加速行业大模型的落地应用。',
          actionSuggestion: '建议：立即组织战略部、产品部和技术部召开专题会议，评估该政策对公司业务的影响，制定行业大模型建设方案。同时，密切关注后续配套细则和专项基金申请流程，争取成为首批获得政策支持的企业。',
          relatedNews: [
            {
              id: 1,
              title: '国务院关于加快数字经济发展的若干意见解读',
              source: '政策解读',
              time: '3天前'
            },
            {
              id: 2,
              title: '2023中国AI产业发展白皮书发布，市场规模预计突破5000亿',
              source: '行业报告',
              time: '1周前'
            }
          ]
        },
        {
          id: 2,
          category: '预警',
          title: '竞品A公司宣布完成新一轮融资，计划加大AI研发投入',
          source: '竞品消息',
          time: '08:45',
          publishTime: '2023-11-15',
          readTime: '3分钟',
          link: '#',
          summary: '竞品A公司宣布完成新一轮融资，计划加大AI研发投入，重点布局智能决策支持系统。',
          actionSuggestion: '建议密切关注其产品迭代计划，调整我们的竞品策略。',
          relatedNews: []
        },
        {
          id: 3,
          category: '机会',
          title: '2023年中国企业数字化转型调研报告发布，AI应用渗透率提升至65%',
          source: '行业动态',
          time: '07:30',
          publishTime: '2023-11-15',
          readTime: '4分钟',
          link: '#',
          summary: '2023年中国企业数字化转型调研报告发布，AI应用渗透率提升至65%',
          actionSuggestion: '建议关注行业数字化转型趋势，优化我们的产品定位。',
          relatedNews: []
        }
      ]
    }
  },
  computed: {
    filteredNews() {
      let filtered = this.newsList

      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(news => news.source === this.selectedCategory)
      }

      if (this.searchQuery) {
        filtered = filtered.filter(news =>
          news.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }

      return filtered
    }
  },
  mounted() {
    // 默认选择第一条新闻
    if (this.newsList.length > 0) {
      this.selectedNews = this.newsList[0]
    }
  },
  methods: {
    selectNews(news) {
      this.selectedNews = news
    },
    getCategoryType(category) {
      const types = {
        '机会': 'success',
        '预警': 'warning',
        '风险': 'danger'
      }
      return types[category] || 'info'
    },
    handleRelatedClick(related) {
      // 处理相关新闻点击事件
      console.log('点击相关新闻:', related)
    }
  }
}
</script>

<style lang="scss" scoped>
.news-feed {
  .news-card {
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
          .el-button {
            margin-left: 8px;
          }
        }
      }
    }

    .news-content {
      display: flex;
      min-height: 500px;

      .news-sidebar {
        width: 33.333%;
        border-right: 1px solid #EBEEF5;
        padding-right: 20px;

        .sidebar-header {
          margin-bottom: 16px;

          .search-input {
            margin-bottom: 12px;
          }

          .category-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .category-tag {
              cursor: pointer;
              transition: all 0.3s ease;

              &:hover {
                opacity: 0.8;
              }
            }
          }
        }

        .news-list {
          max-height: 400px;
          overflow-y: auto;

          .news-item {
            padding: 16px;
            border-bottom: 1px solid #F5F7FA;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              background-color: #F5F7FA;
            }

            &.active {
              background-color: #ECF5FF;
              border-left: 3px solid #409EFF;
            }

            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;

              .item-time {
                font-size: 12px;
                color: #909399;
              }
            }

            .item-title {
              font-size: 14px;
              font-weight: 500;
              color: #303133;
              margin: 0 0 8px 0;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .item-footer {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .item-source {
                font-size: 12px;
                color: #909399;
              }

              .el-icon-arrow-right {
                color: #C0C4CC;
                font-size: 12px;
              }
            }
          }
        }
      }

      .news-detail {
        flex: 1;
        padding-left: 20px;

        .detail-content {
          .detail-header {
            margin-bottom: 24px;

            .detail-category {
              margin-bottom: 12px;
            }

            .detail-title {
              font-size: 20px;
              font-weight: bold;
              color: #303133;
              margin: 0 0 12px 0;
              line-height: 1.4;
            }

            .detail-meta {
              display: flex;
              gap: 16px;
              font-size: 14px;
              color: #909399;
              margin-bottom: 16px;
            }

            .link-alert {
              .link-content {
                display: flex;
                align-items: center;

                .el-icon-link {
                  margin-right: 8px;
                }

                .link-text {
                  color: #409EFF;
                  text-decoration: none;

                  &:hover {
                    text-decoration: underline;
                  }
                }
              }
            }
          }

          .summary-section,
          .action-section,
          .related-section {
            margin-bottom: 24px;

            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #303133;
              margin: 0 0 12px 0;
              display: flex;
              align-items: center;

              i {
                margin-right: 8px;
                color: #409EFF;
              }
            }

            .summary-alert,
            .action-alert {
              margin-bottom: 12px;
            }

            .action-buttons {
              display: flex;
              gap: 12px;
            }

            .related-card {
              cursor: pointer;
              transition: all 0.3s ease;

              &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              }

              .related-title {
                font-size: 14px;
                font-weight: 500;
                color: #303133;
                margin: 0 0 8px 0;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }

              .related-meta {
                font-size: 12px;
                color: #909399;
                margin: 0;
              }
            }
          }
        }

        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 300px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .news-feed {
    .news-card {
      .news-content {
        flex-direction: column;

        .news-sidebar {
          width: 100%;
          border-right: none;
          border-bottom: 1px solid #EBEEF5;
          padding-right: 0;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }

        .news-detail {
          padding-left: 0;
        }
      }
    }
  }
}
</style>
