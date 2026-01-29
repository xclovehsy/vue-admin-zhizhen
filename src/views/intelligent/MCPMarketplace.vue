<template>
  <div class="mcp-marketplace">
    <!-- 顶部：市场和管理切换 -->
    <el-tabs v-model="activeTab" type="border-card">

      <!-- Tab 1: MCP市场 -->
      <el-tab-pane label="🏪 MCP市场" name="market">
        <div class="marketplace-content">

          <!-- 搜索和筛选 -->
          <el-row :gutter="20" style="margin-bottom: 20px;">
            <el-col :span="12">
              <el-input
                v-model="searchQuery"
                placeholder="搜索MCP..."
                prefix-icon="el-icon-search"
                clearable>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-select
                v-model="selectedCategory"
                placeholder="分类筛选"
                clearable
                style="width: 100%;">
                <el-option label="全部" value=""></el-option>
                <el-option label="代码托管" value="code"></el-option>
                <el-option label="文件系统" value="filesystem"></el-option>
                <el-option label="搜索引擎" value="search"></el-option>
                <el-option label="通讯工具" value="communication"></el-option>
                <el-option label="数据库" value="database"></el-option>
              </el-select>
            </el-col>
          </el-row>

          <!-- MCP卡片网格 -->
          <el-row :gutter="20">
            <el-col
              v-for="mcp in filteredMCPs"
              :key="mcp.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6">
              <el-card
                :body-style="{ padding: '20px' }"
                class="mcp-card"
                shadow="hover">

                <!-- MCP图标和名称 -->
                <div class="mcp-header">
                  <div class="mcp-icon">
                    <i :class="mcp.icon"></i>
                  </div>
                  <div class="mcp-info">
                    <h4>{{ mcp.name }}</h4>
                    <el-tag
                      :type="getCategoryType(mcp.category)"
                      size="mini">
                      {{ getCategoryName(mcp.category) }}
                    </el-tag>
                  </div>
                </div>

                <!-- MCP描述 -->
                <p class="mcp-description">{{ mcp.description }}</p>

                <!-- MCP功能列表 -->
                <div class="mcp-features">
                  <el-tooltip
                    v-for="feature in mcp.features"
                    :key="feature"
                    :content="feature"
                    placement="top">
                    <el-tag size="mini" type="info">
                      {{ feature }}
                    </el-tag>
                  </el-tooltip>
                </div>

                <!-- 安装状态 -->
                <div class="mcp-status">
                  <el-tag v-if="isInstalled(mcp.id)" type="success">
                    <i class="el-icon-check"></i> 已安装
                  </el-tag>
                  <el-tag v-else type="info">未安装</el-tag>
                </div>

                <!-- 操作按钮 -->
                <div class="mcp-actions">
                  <el-button
                    v-if="!isInstalled(mcp.id)"
                    type="primary"
                    size="small"
                    :loading="installing[mcp.id]"
                    @click="installMCP(mcp)"
                    icon="el-icon-download">
                    安装
                  </el-button>
                  <el-button
                    v-else
                    type="danger"
                    size="small"
                    plain
                    @click="uninstallMCP(mcp.id)"
                    icon="el-icon-delete">
                    卸载
                  </el-button>
                  <el-button
                    size="small"
                    @click="showDetail(mcp)"
                    icon="el-icon-info">
                    详情
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- Tab 2: 已安装的MCP -->
      <el-tab-pane label="📦 我的MCP" name="installed">
        <div class="installed-content">

          <!-- 统计信息 -->
          <el-row :gutter="20" style="margin-bottom: 20px;">
            <el-col :span="6">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ installedMCPs.length }}</div>
                  <div class="stat-label">已安装</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ totalTools }}</div>
                  <div class="stat-label">可用工具</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ runningMCPs }}</div>
                  <div class="stat-label">运行中</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stat-card">
                <div class="stat-content">
                  <el-button
                    type="primary"
                    icon="el-icon-refresh"
                    @click="refreshAll">
                    刷新全部
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 已安装MCP列表 -->
          <el-table
            :data="installedMCPs"
            style="width: 100%"
            v-loading="loading">

            <el-table-column label="MCP" width="250">
              <template slot-scope="scope">
                <div class="table-mcp-info">
                  <i :class="scope.row.icon" style="margin-right: 10px;"></i>
                  <div>
                    <div class="mcp-name">{{ scope.row.name }}</div>
                    <div class="mcp-type">{{ scope.row.server_type }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="状态" width="120">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  @change="toggleMCP(scope.row)"
                  :disabled="!scope.row.is_running">
                </el-switch>
                <div style="font-size: 12px; color: #909399; margin-top: 5px;">
                  {{ scope.row.is_running ? '运行中' : '已停止' }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="工具数量" width="100">
              <template slot-scope="scope">
                <el-badge
                  :value="scope.row.tools_count"
                  :max="99"
                  class="tool-badge">
                  <span>{{ scope.row.tools_count }} 个工具</span>
                </el-badge>
              </template>
            </el-table-column>

            <el-table-column label="工具列表">
              <template slot-scope="scope">
                <el-tag
                  v-for="tool in getTools(scope.row.id)"
                  :key="tool.name"
                  size="mini"
                  style="margin: 2px;">
                  {{ tool.name }}
                </el-tag>
                <el-button
                  type="text"
                  size="mini"
                  @click="showTools(scope.row)">
                  查看全部
                </el-button>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="configureMCP(scope.row)">
                  配置
                </el-button>
                <el-button
                  size="mini"
                  @click="refreshTools(scope.row.id)">
                  刷新工具
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="uninstallMCP(scope.row.id)">
                  卸载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- Tab 3: 自定义MCP -->
      <el-tab-pane label="➕ 自定义MCP" name="custom">
        <el-form
          ref="customMCPForm"
          :model="customMCP"
          :rules="customMCPRules"
          label-width="120px">

          <el-form-item label="MCP ID" prop="id">
            <el-input
              v-model="customMCP.id"
              placeholder="例如: my-custom-mcp">
            </el-input>
          </el-form-item>

          <el-form-item label="显示名称" prop="name">
            <el-input
              v-model="customMCP.name"
              placeholder="例如: 我的自定义MCP">
            </el-input>
          </el-form-item>

          <el-form-item label="类型" prop="server_type">
            <el-select v-model="customMCP.server_type">
              <el-option label="自定义" value="custom"></el-option>
              <el-option label="代码托管" value="code"></el-option>
              <el-option label="搜索引擎" value="search"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="启动命令" prop="command">
            <el-input
              v-model="customMCP.command"
              placeholder="例如: python, npx, node">
              <template slot="append">
                <el-tooltip content="启动MCP服务器的命令" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="命令参数" prop="args">
            <el-input
              v-model="customMCP.argsStr"
              type="textarea"
              :rows="3"
              placeholder="每行一个参数，例如：&#10;-y&#10;@modelcontextprotocol/server-github">
            </el-input>
          </el-form-item>

          <!-- 动态环境变量 -->
          <el-form-item label="环境变量">
            <div
              v-for="(env, index) in customMCP.envList"
              :key="index"
              style="margin-bottom: 10px;">
              <el-row :gutter="10">
                <el-col :span="10">
                  <el-input
                    v-model="env.key"
                    placeholder="变量名（如：API_KEY）">
                  </el-input>
                </el-col>
                <el-col :span="10">
                  <el-input
                    v-model="env.value"
                    type="password"
                    placeholder="变量值">
                  </el-input>
                </el-col>
                <el-col :span="4">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    @click="removeEnv(index)">
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <el-button
              type="dashed"
              icon="el-icon-plus"
              style="width: 100%;"
              @click="addEnv">
              添加环境变量
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="installing.custom"
              @click="installCustomMCP">
              安装自定义MCP
            </el-button>
            <el-button @click="resetCustomMCP">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

    </el-tabs>

    <!-- MCP详情对话框 -->
    <el-dialog
      :title="selectedMCP.name"
      :visible.sync="detailDialogVisible"
      width="600px">

      <div class="mcp-detail">
        <div class="detail-header">
          <div class="detail-icon">
            <i :class="selectedMCP.icon" style="font-size: 48px;"></i>
          </div>
          <div class="detail-info">
            <h3>{{ selectedMCP.name }}</h3>
            <p>{{ selectedMCP.description }}</p>
            <el-tag :type="getCategoryType(selectedMCP.category)">
              {{ getCategoryName(selectedMCP.category) }}
            </el-tag>
          </div>
        </div>

        <el-divider></el-divider>

        <!-- 功能列表 -->
        <div class="detail-section">
          <h4>功能特性</h4>
          <ul>
            <li v-for="feature in selectedMCP.features" :key="feature">
              {{ feature }}
            </li>
          </ul>
        </div>

        <!-- 工具列表 -->
        <div class="detail-section" v-if="selectedMCP.tools && selectedMCP.tools.length">
          <h4>可用工具 ({{ selectedMCP.tools.length }})</h4>
          <el-table :data="selectedMCP.tools" size="mini">
            <el-table-column prop="name" label="工具名" width="150"/>
            <el-table-column prop="description" label="描述"/>
          </el-table>
        </div>

        <!-- 配置要求 -->
        <div class="detail-section">
          <h4>配置要求</h4>
          <div v-if="selectedMCP.required_env && selectedMCP.required_env.length">
            <el-tag
              v-for="env in selectedMCP.required_env"
              :key="env"
              type="warning"
              style="margin: 5px;">
              {{ env }}
            </el-tag>
          </div>
          <div v-else>无需配置</div>
        </div>
      </div>

      <div slot="footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button
          v-if="!isInstalled(selectedMCP.id)"
          type="primary"
          @click="installMCP(selectedMCP); detailDialogVisible = false;">
          立即安装
        </el-button>
      </div>
    </el-dialog>

    <!-- 配置对话框 -->
    <el-dialog
      title="配置MCP"
      :visible.sync="configDialogVisible"
      width="500px">
      <el-form :model="configuringMCP" label-width="100px">
        <el-form-item
          v-for="env in configuringMCP.requiredEnvs"
          :key="env"
          :label="env">
          <el-input
            v-model="configuringMCP.envValues[env]"
            type="password"
            :placeholder="`输入 ${env}`">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="configDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConfig">保存配置</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'MCPMarketplace',
  data() {
    return {
      activeTab: 'market',
      searchQuery: '',
      selectedCategory: '',
      loading: false,
      installing: {},

      // MCP市场数据
      marketplaceMCPs: [
        {
          id: 'github',
          name: 'GitHub',
          category: 'code',
          icon: 'el-icon-link',
          description: '访问GitHub仓库、Issues、Pull Requests，进行代码搜索和分析',
          features: ['搜索仓库', '查看Issues', '获取PR信息', '代码分析'],
          required_env: ['GITHUB_PERSONAL_ACCESS_TOKEN'],
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-github']
        },
        {
          id: 'filesystem',
          name: '本地文件',
          category: 'filesystem',
          icon: 'el-icon-folder',
          description: '读取和分析本地文件系统中的文档和配置文件',
          features: ['读取文件', '列出目录', '搜索文件'],
          required_env: [],
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-filesystem', '/path/to/files']
        },
        {
          id: 'slack',
          name: 'Slack',
          category: 'communication',
          icon: 'el-icon-chat-dot-round',
          description: '访问Slack工作区的消息、频道和用户信息',
          features: ['读取消息', '发送消息', '频道管理'],
          required_env: ['SLACK_TOKEN'],
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-slack']
        },
        {
          id: 'brave-search',
          name: 'Brave搜索',
          category: 'search',
          icon: 'el-icon-search',
          description: '使用Brave搜索引擎进行网络搜索',
          features: ['网络搜索', '高级筛选', '结果聚合'],
          required_env: ['BRAVE_API_KEY'],
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-brave-search']
        },
        {
          id: 'postgres',
          name: 'PostgreSQL',
          category: 'database',
          icon: 'el-icon-coin',
          description: '直接查询PostgreSQL数据库',
          features: ['执行查询', '数据导出', '表结构查询'],
          required_env: ['DATABASE_URL'],
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-postgres']
        }
      ],

      // 已安装的MCP
      installedMCPs: [],

      // 选中的MCP
      selectedMCP: {},
      detailDialogVisible: false,

      // 配置相关
      configuringMCP: {},
      configDialogVisible: false,

      // 自定义MCP表单
      customMCP: {
        id: '',
        name: '',
        server_type: 'custom',
        command: '',
        argsStr: '',
        envList: []
      },
      customMCPRules: {
        id: [{ required: true, message: '请输入MCP ID', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        command: [{ required: true, message: '请输入启动命令', trigger: 'blur' }]
      }
    }
  },

  computed: {
    filteredMCPs() {
      return this.marketplaceMCPs.filter(mcp => {
        const matchSearch = !this.searchQuery ||
          mcp.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          mcp.description.toLowerCase().includes(this.searchQuery.toLowerCase())

        const matchCategory = !this.selectedCategory || mcp.category === this.selectedCategory

        return matchSearch && matchCategory
      })
    },

    totalTools() {
      return this.installedMCPs.reduce((sum, mcp) => sum + (mcp.tools_count || 0), 0)
    },

    runningMCPs() {
      return this.installedMCPs.filter(mcp => mcp.is_running).length
    }
  },

  mounted() {
    this.loadInstalledMCPs()
  },

  methods: {
    // 加载已安装的MCP
    async loadInstalledMCPs() {
      this.loading = true
      try {
        const res = await this.$http.get('/api/mcp/servers')
        this.installedMCPs = res.data.data.map(server => ({
          ...server,
          icon: this.getIconForServer(server.server_type),
          features: this.getFeaturesForServer(server.server_type)
        }))
      } catch (error) {
        this.$message.error('加载MCP列表失败: ' + error.message)
      } finally {
        this.loading = false
      }
    },

    // 判断MCP是否已安装
    isInstalled(id) {
      return this.installedMCPs.some(mcp => mcp.id === id)
    },

    // 安装MCP
    async installMCP(mcp) {
      this.$set(this.installing, mcp.id, true)

      // 检查是否需要配置
      if (mcp.required_env && mcp.required_env.length > 0) {
        this.configuringMCP = {
          ...mcp,
          requiredEnvs: mcp.required_env,
          envValues: {}
        }
        this.configDialogVisible = true
        this.$set(this.installing, mcp.id, false)
        return
      }

      try {
        const res = await this.$http.post('/api/mcp/servers', {
          id: mcp.id,
          name: mcp.name,
          server_type: mcp.category,
          command: mcp.command,
          args: mcp.args,
          env: {}
        })

        this.$message.success(`${mcp.name} 安装成功！`)
        await this.loadInstalledMCPs()
      } catch (error) {
        this.$message.error(`安装失败: ${error.message}`)
      } finally {
        this.$set(this.installing, mcp.id, false)
      }
    },

    // 卸载MCP
    async uninstallMCP(id) {
      try {
        await this.$http.$delete(`/api/mcp/servers/${id}`)
        this.$message.success('卸载成功')
        await this.loadInstalledMCPs()
      } catch (error) {
        this.$message.error('卸载失败: ' + error.message)
      }
    },

    // 显示详情
    showDetail(mcp) {
      this.selectedMCP = mcp

      // 如果已安装，获取工具列表
      if (this.isInstalled(mcp.id)) {
        this.$http.get(`/api/mcp/servers/${mcp.id}/tools`).then(res => {
          this.$set(this.selectedMCP, 'tools', res.data.data.tools)
        })
      }

      this.detailDialogVisible = true
    },

    // 配置MCP
    configureMCP(mcp) {
      this.configuringMCP = mcp
      this.configDialogVisible = true
    },

    // 保存配置
    async saveConfig() {
      // 实现配置保存逻辑
      this.configDialogVisible = false
    },

    // 刷新所有MCP
    async refreshAll() {
      this.loading = true
      await this.loadInstalledMCPs()
      this.loading = false
      this.$message.success('已刷新所有MCP')
    },

    // 刷新工具
    async refreshTools(serverId) {
      try {
        await this.$http.post(`/api/mcp/servers/${serverId}/tools/refresh`)
        this.$message.success('工具列表已刷新')
        await this.loadInstalledMCPs()
      } catch (error) {
        this.$message.error('刷新失败: ' + error.message)
      }
    },

    // 切换MCP开关
    async toggleMCP(mcp) {
      // 实现切换逻辑
      console.log('Toggle MCP:', mcp.id, mcp.enabled)
    },

    // 自定义MCP相关方法
    addEnv() {
      this.customMCP.envList.push({ key: '', value: '' })
    },

    removeEnv(index) {
      this.customMCP.envList.splice(index, 1)
    },

    async installCustomMCP() {
      this.$refs.customMCPForm.validate(async (valid) => {
        if (!valid) return

        this.installing.custom = true

        const args = this.customMCP.argsStr.split('\n').filter(s => s.trim())
        const env = {}
        this.customMCP.envList.forEach(e => {
          if (e.key && e.value) {
            env[e.key] = e.value
          }
        })

        try {
          await this.$http.post('/api/mcp/servers', {
            id: this.customMCP.id,
            name: this.customMCP.name,
            server_type: this.customMCP.server_type,
            command: this.customMCP.command,
            args: args,
            env: env
          })

          this.$message.success('自定义MCP安装成功！')
          this.resetCustomMCP()
          await this.loadInstalledMCPs()
        } catch (error) {
          this.$message.error('安装失败: ' + error.message)
        } finally {
          this.installing.custom = false
        }
      })
    },

    resetCustomMCP() {
      this.customMCP = {
        id: '',
        name: '',
        server_type: 'custom',
        command: '',
        argsStr: '',
        envList: []
      }
      this.$refs.customMCPForm.resetFields()
    },

    // 辅助方法
    getCategoryName(category) {
      const names = {
        code: '代码托管',
        filesystem: '文件系统',
        search: '搜索引擎',
        communication: '通讯工具',
        database: '数据库'
      }
      return names[category] || '其他'
    },

    getCategoryType(category) {
      const types = {
        code: 'success',
        filesystem: 'warning',
        search: 'primary',
        communication: 'danger',
        database: 'info'
      }
      return types[category] || ''
    },

    getIconForServer(serverType) {
      const icons = {
        github: 'el-icon-link',
        filesystem: 'el-icon-folder',
        slack: 'el-icon-chat-dot-round',
        'brave-search': 'el-icon-search',
        postgres: 'el-icon-coin'
      }
      return icons[serverType] || 'el-icon-setting'
    },

    getFeaturesForServer(serverType) {
      const features = {
        github: ['搜索仓库', '查看Issues', 'PR管理'],
        filesystem: ['读取文件', '目录浏览'],
        slack: ['读取消息', '发送消息'],
        'brave-search': ['网络搜索'],
        postgres: ['执行查询', '数据导出']
      }
      return features[serverType] || []
    },

    getTools(serverId) {
      const mcp = this.installedMCPs.find(m => m.id === serverId)
      return mcp && mcp.tools ? mcp.tools.slice(0, 3) : []
    },

    showTools(mcp) {
      // 显示所有工具的对话框
      console.log('Show tools for:', mcp.id)
    }
  }
}
</script>

<style scoped>
.mcp-marketplace {
  padding: 20px;
}

.mcp-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.mcp-card:hover {
  transform: translateY(-5px);
}

.mcp-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.mcp-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin-right: 15px;
}

.mcp-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.mcp-description {
  color: #606266;
  font-size: 14px;
  margin: 10px 0;
  min-height: 40px;
}

.mcp-features {
  margin: 10px 0;
}

.mcp-features .el-tag {
  margin: 2px;
}

.mcp-status {
  margin: 10px 0;
}

.mcp-actions {
  display: flex;
  gap: 10px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 10px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  color: #909399;
  margin-top: 5px;
}

.table-mcp-info {
  display: flex;
  align-items: center;
}

.mcp-name {
  font-weight: bold;
}

.mcp-type {
  font-size: 12px;
  color: #909399;
}

.mcp-detail .detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.detail-icon {
  margin-right: 20px;
}

.detail-info h3 {
  margin: 0 0 10px 0;
}

.detail-section {
  margin: 20px 0;
}

.detail-section h4 {
  margin-bottom: 10px;
}

.detail-section ul {
  padding-left: 20px;
}

.detail-section li {
  margin: 5px 0;
}
</style>
