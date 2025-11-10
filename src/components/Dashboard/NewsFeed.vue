<template>
  <div class="news-feed">
    <el-card class="news-card" shadow="hover">
      <div slot="header" class="card-header">
        <div class="header-content">
          <h3 class="card-title">今日全球要闻</h3>
        <div class="header-actions">
          <el-button size="mini" type="text" icon="el-icon-check" @click="handleMarkAsRead">全部已读</el-button>
          <el-button size="mini" type="text" icon="el-icon-filter">筛选</el-button>
        </div>
        </div>
      </div>

      <div class="news-content" v-loading="loading">
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
            <div class="list-pagination">
              <el-pagination
                background
                layout="prev, pager, next, sizes, total"
                :total="pagination.total"
                :current-page.sync="pagination.page"
                :page-size.sync="pagination.pageSize"
                :page-sizes="[10, 20, 30, 50]"
                @current-change="handlePageChange"
                @size-change="handlePageSizeChange"
              />
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
              <!-- <div class="action-buttons">
                <el-button type="primary" size="small" icon="el-icon-check" @click="handleAdoptSuggestion">采纳建议</el-button>
                <el-button size="small" icon="el-icon-edit">编辑建议</el-button>
              </div> -->
            </div>

            <!-- 相关推荐 -->
            <!-- <div class="related-section">
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
            </div> -->
          </div>

          <div v-else class="empty-state">
            <div class="empty-content">
              <i class="el-icon-document" style="font-size: 48px; color: #C0C4CC; margin-bottom: 16px;" />
              <p style="color: #909399; font-size: 14px;">请选择一条新闻查看详情</p>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getNewsList, getNewsDetail, markNewsAsRead, adoptNewsSuggestion } from '@/api/dashboard'

export default {
  name: 'NewsFeed',
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      selectedNews: null,
      loading: false,
      categories: [
        { label: '全部', value: 'all' },
        { label: '新闻消息', value: '新闻消息' },
        { label: '行业动态', value: '行业动态' },
        { label: '竞品消息', value: '竞品消息' },
        { label: '技术前沿', value: '技术前沿' }
      ],
      newsList: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0
      }
    }
  },
  computed: {
    filteredNews() {
      let filtered = this.newsList

      // 后端已根据 category 返回筛选后的列表，这里不再按类别二次过滤，避免字段不一致导致结果为空

      if (this.searchQuery) {
        filtered = filtered.filter(news =>
          news.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }

      return filtered
    }
  },
  mounted() {
    this.fetchNewsList()
  },
  methods: {
    async fetchNewsList() {
      this.loading = true
      try {
        console.log('要闻列表请求:', {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          category: this.selectedCategory,
          keyword: this.searchQuery
        })
        const response = await getNewsList({
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          category: this.selectedCategory,
          keyword: this.searchQuery
        })
        console.log('要闻列表响应:', response.data)
        this.newsList = response.data.news || []
        this.pagination.total = response.data.total || 0

        // 默认选择第一条新闻
        if (this.newsList.length > 0) {
          await this.selectNews(this.newsList[0])
        }
      } catch (error) {
        console.error('获取要闻列表失败:', error)
        this.$message.error('获取要闻列表失败')
        // 使用默认数据作为降级方案
        this.newsList = [
          {
            id: 1,
            category: '机会',
            title: '国家发布新一代人工智能创新发展指导意见，明确支持企业建设行业大模型',
            source: '新闻消息',
            time: '09:32',
            publishTime: '2023-11-15',
            readTime: '5分钟',
            link: 'http://www.gov.cn/zhengce/content/2023-11/15/content_5823121.htm',
            summary: '国家发改委与科技部联合发布《新一代人工智能创新发展指导意见》，明确提出支持具备条件的企业建设行业大模型，推动AI技术与实体经济深度融合。',
            actionSuggestion: '建议：立即组织战略部、产品部和技术部召开专题会议，评估该政策对公司业务的影响，制定行业大模型建设方案。',
            relatedNews: []
          }
        ]
        if (this.newsList.length > 0) {
          await this.selectNews(this.newsList[0])
        }
      } finally {
        this.loading = false
      }
    },
    async selectNews(news) {
      console.log('选择新闻:', news)
      // 先设置基本信息，确保有数据显示
      this.selectedNews = {
        ...news,
        content: news.summary || '暂无详细内容',
        tags: news.tags || []
      }

      try {
        // 获取详细内容
        const response = await getNewsDetail(news.id)
        console.log('要闻详情响应:', response)
        if (response && response.data) {
          this.selectedNews = response.data
          console.log('设置详情后的selectedNews:', this.selectedNews)
        } else {
          console.warn('要闻详情响应格式错误，使用列表数据')
        }
      } catch (error) {
        console.error('获取要闻详情失败:', error)
        // 保持使用列表数据
        console.log('使用列表数据作为详情:', this.selectedNews)
      }
    },
    async handleMarkAsRead() {
      if (!this.selectedNews) return

      try {
        await markNewsAsRead(this.selectedNews.id)
        this.$message.success('已标记为已读')
      } catch (error) {
        console.error('标记已读失败:', error)
        this.$message.error('标记已读失败')
      }
    },
    async handleAdoptSuggestion() {
      if (!this.selectedNews) return

      try {
        await adoptNewsSuggestion(this.selectedNews.id, {
          action: 'adopt',
          note: '已采纳AI建议'
        })
        this.$message.success('已采纳AI建议')
      } catch (error) {
        console.error('采纳建议失败:', error)
        this.$message.error('采纳建议失败')
      }
    },
    async handleSearch() {
      this.pagination.page = 1
      await this.fetchNewsList()
    },
    async handleCategoryChange() {
      this.pagination.page = 1
      await this.fetchNewsList()
    },
    async handlePageChange(page) {
      this.pagination.page = page
      await this.fetchNewsList()
    },
    async handlePageSizeChange(size) {
      this.pagination.pageSize = size
      this.pagination.page = 1
      await this.fetchNewsList()
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
  },
  watch: {
    searchQuery() {
      this.handleSearch()
    },
    selectedCategory() {
      this.handleCategoryChange()
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
          .list-pagination {
            padding: 12px 16px;
            display: flex;
            justify-content: center;
            border-top: 1px solid #F5F7FA;
            background: #fff;
            position: sticky;
            bottom: 0;
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

          .empty-content {
            text-align: center;
          }
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
