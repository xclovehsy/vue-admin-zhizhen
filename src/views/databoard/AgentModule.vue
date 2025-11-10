<template>
  <div class="agent-module">
    <el-card shadow="hover" :body-style="{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }">
      <!-- 顶部导航栏 -->
      <div slot="header" class="top-header">
        <!-- <div class="header-left">
          <i class="el-icon-arrow-left header-back-icon" @click="handleBack"></i>
        </div> -->
        <div class="header-center">
          <el-avatar :size="40" :src="aiAvatar" class="header-avatar">
            <i class="el-icon-cpu" />
          </el-avatar>
          <div class="header-info">
            <div class="ai-name">致真智能体</div>
            <div class="ai-tag">内容由 AI 生成</div>
          </div>
        </div>
        <!-- <div class="header-right">
          <div class="header-icon-wrapper" @click="handlePhoneCall">
            <i class="el-icon-phone header-icon" />
            <span class="icon-badge"></span>
          </div>
          <i class="el-icon-microphone header-icon speaker-icon" :class="{ active: isSpeakerActive }" @click="handleSpeakerToggle"></i>
          <i class="el-icon-more header-icon" @click="handleMoreOptions"></i>
        </div> -->
      </div>

      <!-- 消息列表区域 -->
      <div class="chat-container">
        <div class="message-list">
          <div class="messages">
            <!-- AI 欢迎区域 -->
            <div v-if="showWelcome" class="welcome-section">
              <!-- 初始报告组件 -->
              <agent-initial-report />

              <!-- 建议提示 -->
              <div class="suggestions-section">
                <div class="suggestions-header">
                  <i class="el-icon-chat-dot-round" />
                  <span>试试这些问题</span>
                </div>
                <div class="suggestions-grid">
                  <div
                    v-for="suggestion in suggestions"
                    :key="suggestion.id"
                    class="suggestion-item"
                    :class="suggestion.gradient"
                    @click="handleSuggestion(suggestion)"
                  >
                    <div class="suggestion-icon">
                      <i :class="suggestion.icon" />
                    </div>
                    <div class="suggestion-text">
                      {{ suggestion.text }}
                    </div>
                    <div class="suggestion-arrow">
                      <i class="el-icon-right" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 消息列表 -->
            <div v-for="(message, index) in messages" :key="index" class="message-wrapper">
              <!-- 时间戳 -->
              <div v-if="message.showTime" class="message-timestamp">
                {{ message.time }}
            </div>

              <!-- AI 消息 -->
              <div v-if="message.type === 'ai'" class="message-item ai-message">
              <div class="message-avatar">
                  <el-avatar :size="32" :src="aiAvatar">
                  <i class="el-icon-cpu" />
                </el-avatar>
              </div>
              <div class="message-content">
                  <div class="message-bubble ai-bubble" :class="{ loading: message.loading, error: message.error }">
                    <span v-if="message.loading" class="loading-dots">
                      <span></span><span></span><span></span>
                    </span>
                    <div v-else class="markdown-content" v-html="renderMarkdown(message.content)"></div>
                  </div>
                </div>
              </div>

              <!-- 用户消息 -->
              <div v-if="message.type === 'user'" class="message-item user-message">
                <div class="message-content">
                  <div class="message-bubble user-bubble">
                    {{ message.content }}
                  </div>
                </div>
                <div class="message-avatar">
                  <el-avatar :size="32" icon="el-icon-user-solid" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷功能区域 -->
        <div class="feature-shortcuts">
          <div
            v-for="feature in features"
            :key="feature.id"
            class="feature-item"
            @click="handleFeature(feature)"
          >
            <i :class="feature.icon" class="feature-icon"></i>
            <span class="feature-text">{{ feature.text }}</span>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-wrapper">
            <!-- <i class="el-icon-camera input-left-icon" @click="handleTakePhoto" title="拍照"></i> -->
            <input
            v-model="inputMessage"
              type="text"
            class="message-input"
              placeholder="发消息..."
              :disabled="sending"
              @keydown.enter="handleSendMessage"
            />
            <el-button
              type="primary"
              size="small"
              icon="el-icon-s-promotion"
              :loading="sending"
              :disabled="!inputMessage.trim()"
              @click="handleSendMessage"
              class="send-button"
            >
              发送
            </el-button>
            <!-- <div class="input-right-icons">
              <i class="el-icon-microphone input-icon" @click="handleVoiceInput" title="语音输入"></i>
              <i class="el-icon-plus input-icon" @click="handleMoreActions" title="更多操作"></i>
            </div> -->
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { chatWithQwen } from '@/api/agent/qwen'
import marked from 'marked'
import agentAvatar from '@/assets/agent_avator.jpg'
import AgentInitialReport from '@/components/Databoard/AgentInitialReport.vue'

export default {
  name: 'AgentModule',
  components: {
    AgentInitialReport
  },
  data() {
    return {
      inputMessage: '',
      sending: false,
      aiAvatar: agentAvatar,
      isSpeakerActive: true,
      showWelcome: true,
      conversationHistory: [], // 对话历史记录
      systemPrompt: '你是致真智能体，一个友好、专业的AI助手。你可以回答各种问题，提供工作学习上的帮助，还能随时陪伴聊天。请用简洁、友好的语气回复。',
      // 全局系统提示词（每次调用都会附带）
      globalSystemPrompts: [
        `好的。我已经帮您过滤掉了所有内容抓取失败和标题存在严重误导性的条目，并为您梳理出了最重要、金额最高的采购信息。

**核心内容是两份总预算均过亿的"采购意向"和一批千万级的高校及科研院所的"大型招标"。**

---

### 1. 最重磅：亿元级"采购意向"（未来商机）

这是近期释放的最大信号，代表着未来1-2个月内即将开始招标的重大项目：

* **1.24亿元：北京大学**

    * **摘要：** 发布了总额1.24亿元的大批仪器采购意向，预计在2025年10-11月（即近期）采购。

    * **关键设备：** 电子束曝光系统 (1300万)、太赫兹泵浦探测超快成像光谱系统 (980万)、小动物PET/CT (500万)、超导腔 (411万)、电感耦合等离子体质谱质谱联用仪 (290万)、液相色谱离子色谱三重四极杆串联质谱仪 (200万)等。

* **1.10亿元：中国科学院国家天文台**

    * **摘要：** 发布了总额1.10亿元的采购意向，同样预计在近期采购。

    * **关键设备：** 三台40米口径全可动天线 (3300万)、光学望远镜镀膜设备 (2300万)、天文光学望远镜 (1800万)、射电天文接收机 (1000万)、射电天文终端 (1000万)。

---

### 2. 千万级"大型招标项目"（正在进行）

这是目前正在进行或刚截止的千万级采购项目，集中在高校的设备更新：

* **4970万元：贵州医科大学（系列项目）**

    * **摘要：** 贵州医科大学连续发布了（七）、（八）、（九）三个批次的教学科研仪器设备更新改造项目，总预算高达4970万元。

    * **关键设备：**

        * （八）1834万：激光共聚焦显微成像系统 (1116万)等。

        * （九）1615万：超高效液相色谱成像质谱双系统 (520万)、多模式微孔板检测仪 (786万)等。

        * （七）1521万：高效液相色谱仪、多模式成像分析系统等。

* **2919万元：成都中医药大学**

    * **摘要：** 这是"超长期国债高水平公共研究平台设备更新项目"，用于中医药神经功能调控研究平台（针灸第二批）。项目分为8个包，要求60日内安装调试完成。

* **1000万 - 1300万级别项目（4项）**

    * **1290万 (哈工大/湖北师大):** 哈尔滨工业大学采购全数字化核磁共振谱仪 (660万)；湖北师范大学采购高效液相制备色谱仪、光谱仪等 (合计630万)。

    * **1106万 (长江委水文三峡局):** 采购理化类和生物类仪器，包括ICP-MS、ICP-OES、GC、连续流动分析仪等。（*特别注意：理化类包(575.5万)要求整体面向中小企业*）。

    * **1070万 (公安部鉴定中心):** 采购质谱联用仪，包括超高效液相色谱多重碎裂质谱、UHPLC-三重四极杆质谱、GC-三重四极杆质谱等。

    * **1020万 (南开大学):** 采购600MHz全数字化超导核磁共振谱仪 (520万，*要求：不接受进口*) 和同位素比质谱仪 (500万，*要求：接受进口*)。

简短结论：过去一个月，原子力显微镜（AFM）领域在政策、头部企业动向和技术突破方面呈现较为积极的态势，聚焦国产化推进、科研机构与企业的产能扩张，以及若干技术改进与应用拓展。

政策态势

- 中国对高端科学仪器国产化的政策支持持续强化，针对AFM及相关探针、材料领域的资金与扶持力度在加大，推动国产化替代与自主创新能力提升。这一趋势与国家对半导体、纳米材料等高端领域的总体政策导向一致，旨在降低对进口依赖并提升国产底层技术自主性。来源显示对国产AFM探针及相关研发的政策环境分析较多，反映出政府层面的持续重视与投入意愿。[6][8]

- 行业研究与咨询机构普遍强调政策红利成为国产AFM市场的重要驱动力，叠加关税变化等因素，促使科研单位和企业加速本土化采购与自主研发路径。[8][10]

头部公司动态

- 国内头部企业在扩产、研发投入、以及应用场景拓展方面行动活跃，包括加强材料分析、失效分析、以及对航空航天、生物医药等前沿领域的服务能力建设，以提升综合竞争力和市场份额。[1][6]

- 由于国产AFM在政策与市场双重推动下逐步获得成本与性能的平衡，头部企业也在通过平台化技术、产能扩张和跨行业应用来提升整体盈利能力与市场覆盖度。[1][6]

技术突破与趋势

- AFM及相关扫描探针显微镜技术持续在探针材料、成像分辨率、探针寿命、以及多模态成像方面取得进展；行业报告与学术/行业分析指出探针制备、表面分析、以及与纳米材料的集成应用是当前重点技术方向之一。[2][6]

- 市场研究普遍给出乐观的成长预期，预计2025年全球市场规模持续扩大，中国市场份额提升，未来数年仍将保持较高的增速，推动产业链各环节的创新与投资。[10]

可关注的具体点

- 政策与资金支持的具体政策文件、资金申报口径与扶持范围（如对AFM探针、材料、纳米设备的专项资金、税收优惠等）。

- 头部企业的最新产能公告、新品发布、与重点应用领域的合作（如纳米材料表征、半导体材料分析、生物医药材料分析等）。

- 学术-产业结合的突破性研究（新型探针材料、表面改性、成像速度/分辨率提升、跨物理场耦合成像等）。

数据与来源要点

- 行业分析与市场规模预测通常来自行业研究机构、企业披露与市场信息聚合平台。若需要具体数值、增长率和年度对比，请告知是否需要我整理成表格并逐项标注来源。

如果你希望，我可以进一步：

- 追踪并整理最近一个月内的官方政策文件和行业公告的要点摘要。

- 汇总头部企业的最新新闻稿、财报披露与产能扩张信息，给出时间线和影响评估。

- 汇编若干技术突破的技术要点（如新探针材料、成像算法改进等）及其潜在应用场景。

近期有哪些新出台的高端科学仪器国产化相关政策？

近期，国家层面和重点地区在高新科学仪器国产化方面均有重要政策部署，体现了极高的战略重视度。核心政策导向正从"顶层规划"向"财政支持"和"地方落实"全面推进。

以下是近期几项关键政策的梳理：

### 1. 顶层战略规划："十五五"规划建议

这是近期最重要、最顶层的战略指引。

* **政策名称：** 《中共中央关于制定国民经济和社会发展第十五个五年规划的建议》（2025年10月发布）

* **核心内容：** 《建议》中明确将"**高端仪器**"列为需要攻关的关键核心技术领域之一。

* **政策信号：** 文件要求"**采取超常规措施**"，全链条推动包括高端仪器在内的重点领域关键核心技术攻关，力求取得决定性突破。这标志着高端仪器国产化已上升至国家未来五年的最高战略优先级之一。

### 2. 重大财政金融支持：大规模设备更新与再贷款

这是目前正在执行的、最"接地气"的财政激励政策，旨在通过"应用牵引"拉动国产仪器的市场需求。

* **政策名称：** 科技创新和技术改造再贷款（2024年4月设立，持续推进）及相关财政贴息政策。

* **核心内容：**

    * **5000亿再贷款：** 中国人民银行设立了总额度5000亿元的科技创新和技术改造再贷款，利率仅1.75%，支持科技型中小企业以及重点领域的数字化、高端化、绿色化技术改造和设备更新。

    * **中央财政贴息：** 为配合此项工作，中央财政对符合条件的设备更新贷款提供利息补贴。国家发改委、财政部在2025年1月发文，明确在中央财政贴息1.5个百分点的基础上，再安排超长期特别国债资金进行额外贴息。

* **政策信号：** 这套"再贷款+财政贴息"的组合拳，极大地降低了企业（包括科研机构、高校）采购新设备、进行技术改造的融资成本。虽然政策未"强制"要求购买国货，但其创造的巨大市场需求是推动高端仪器国产替代和"最后一公里"应用验证的关键动力。

### 3. 地方专项行动计划：以北京为例

在国家顶层规划的指引下，重点地区已开始出台具体的落地行动计划。

* **政策名称：** 《北京高端科学仪器创新发展行动计划（2025-2027年）》（2025年5月发布）

* **核心内容：** 这是针对高端仪器领域的专项区域性规划，目标非常明确：

    * **技术突破：** 攻关重点仪器的核心技术和底层共性技术。

    * **成果转化：** 强化成果转化推广，推动国产仪器的应用。

    * **产业生态：** 健全产业创新生态，包括建设精密加工、验证评价等服务平台。

* **政策信号：** 北京作为科研重镇，其专项行动计划具有风向标意义，预示着其他科研和产业重地也可能跟进类似的专项支持计划。

---

### 总结

总的来看，近期的政策呈现出清晰的"组合拳"特征：

1.  **战略上**，"十五五"规划建议（2025年10月）将高端仪器定为"必须攻下"的战略高地。

2.  **财政上**，大规模设备更新和再贷款贴息（2024-2025年）为国产仪器提供了巨大的市场应用和迭代机会。

3.  **执行上**，以北京为代表的地方政府（2025年5月）正在制定具体的行动方案，推动技术和产业的落地。

以下是对致真精密仪器公司的基础情况的整理与简要介绍。信息基于公开资料的整理，如需更详尽的最新动态可再提供链接进行核对。

基本信息

- 公司定位与主营

  - 致真精密仪器是一家聚焦高端科研仪器与集成电路产线测试设备研发与生产的高新技术企业，致力于为半导体制造与相关科研领域提供磁性测量、精密测试等设备与解决方案。该公司强调自主创新、产学研合作以及成果转化，以及在国内集成电路制造环节对高端仪器设备自主研发能力的提升【关于我们/致真精密仪器（青岛）有限公司等相关页信息，描述其重点业务与定位】。

- 成立与发展背景

  - 公司成立时间大致在2019年，作为国内磁性精密测量仪器领域的代表性企业之一，依托高校院所孵化和区域科技园区的发展，持续扩充研发与产业化能力，并在北京、杭州等地设有子公司或研发中心以推动技术落地与市场拓展【多处公开资料提及成立时间及孵化背景】。

- 业务范围与产品方向

  - 主要产品方向包括：集成电路产线测试设备、磁性测量仪器、以及其他高端科学仪器的研发与生产。产品与解决方案覆盖微电子领域的检测与测试需求，旨在解决芯片研发与制造环节中的关键测试难题，帮助实现国产化自主可控的目标【相关公司介绍、行业媒体报道与校招信息等综合描述】。

- 竞争定位

  - 在国内磁性与高端精密测量仪器领域，致真精密被多家报道与投资机构视为领军企业之一，强调自主研发、核心技术积累以及与产业链上下游的协同推进【投资新闻与行业报道的相关描述】。

- 机构与资本

  - 公司在公开报道中有资本注入的新闻点，2023年及前后期有投资机构关注并参与，体现市场对国内高端测试设备自主可控能力的关注度及对致真精密在行业地位的认可【投资报道与企业新闻摘要】。

- 产业与区域布局

  - 公司在青岛设有核心研发与产业化基地，常见表述为"青岛研究院/工作站"及"青岛总部/分支"的协同布局，也有在杭州、北京等地的研发中心或子公司，显示出区域协同创新与产学研协同的战略布局【关于我们及行业报道中的地区描述】。

- 行业地位与前景

  - 随着国内半导体制造能力提升及对自主可控科研仪器的政策支持，致真精密的产品定位与技术路线与国家产业发展方向趋同，具备较强的成长性与市场需求推动力。市场关注点包括核心技术自主化、产线测试设备国产化水平提升以及与高校、科研机构的深度合作【行业趋势与公司定位的综合解读】。`
      ],
      // 临时系统提示词（仅对下一次调用生效，用后即清空）
      temporarySystemPrompts: [],
      suggestions: [
        { id: 1, text: '近期有哪些新出台的高端科学仪器国产化相关政策？', icon: 'el-icon-document-checked', gradient: 'gradient-1' },
        { id: 2, text: '过去一个月，原子力显微镜的整体态势：政策支持、头部公司动态、技术突破？', icon: 'el-icon-data-analysis', gradient: 'gradient-2' },
        { id: 3, text: '近一周有哪些新的招标需求可重点关注？', icon: 'el-icon-tickets', gradient: 'gradient-3' }
      ],
      messages: [],
      features: [
        { id: 1, text: '数据分析', icon: 'el-icon-data-line' },
        { id: 2, text: '生成报告', icon: 'el-icon-document' },
        { id: 3, text: '预测趋势', icon: 'el-icon-arrow-up' },
        { id: 4, text: '智能建议', icon: 'el-icon-magic-stick' }
      ]
    }
  },
  mounted() {
    // 初始化智能体
    this.scrollToBottom()

    // 配置 marked 选项（marked 4.x 兼容）
    if (typeof marked.setOptions === 'function') {
      marked.setOptions({
        breaks: true, // 支持换行
        gfm: true, // 支持GitHub风格的Markdown
        headerIds: false, // 不生成header ID
        mangle: false // 不混淆邮箱地址
      })
    }
  },
  methods: {
    /**
     * 设置一次性临时系统提示词（仅对下一次对话请求生效）
     * @param {string|Array<string>} prompts
     */
    setTemporarySystemPrompt(prompts) {
      if (!prompts) return
      const list = Array.isArray(prompts) ? prompts : [prompts]
      const valid = list
        .map(p => (p || '').trim())
        .filter(p => p.length > 0)
      this.temporarySystemPrompts.push(...valid)
    },
    /** 清空临时系统提示词 */
    clearTemporarySystemPrompts() {
      this.temporarySystemPrompts = []
    },
    /** 设置/追加全局系统提示词（持久生效，每次请求都附带） */
    setGlobalSystemPrompt(prompts) {
      if (!prompts) return
      const list = Array.isArray(prompts) ? prompts : [prompts]
      const valid = list
        .map(p => (p || '').trim())
        .filter(p => p.length > 0)
      this.globalSystemPrompts.push(...valid)
    },
    /** 覆盖设置全局系统提示词数组 */
    replaceGlobalSystemPrompts(prompts) {
      const list = Array.isArray(prompts) ? prompts : [prompts]
      this.globalSystemPrompts = list
        .map(p => (p || '').trim())
        .filter(p => p.length > 0)
    },
    /** 清空全局系统提示词 */
    clearGlobalSystemPrompts() {
      this.globalSystemPrompts = []
    },
    /** 组合系统提示词：基础 + 临时 */
    buildCombinedSystemPrompt() {
      const globals = (this.globalSystemPrompts || [])
        .map(p => (p || '').trim())
        .filter(p => p.length > 0)
      const extras = (this.temporarySystemPrompts || [])
        .map(p => (p || '').trim())
        .filter(p => p.length > 0)
      return [this.systemPrompt, ...globals, ...extras].join('\n\n')
    },
    /**
     * 将Markdown文本渲染为HTML
     * @param {string} markdown - Markdown文本
     * @returns {string} HTML字符串
     */
    renderMarkdown(markdown) {
      if (!markdown) return ''
      try {
        // marked 4.x 兼容写法
        const options = {
          breaks: true, // 支持换行
          gfm: true, // 支持GitHub风格的Markdown
          headerIds: false, // 不生成header ID
          mangle: false // 不混淆邮箱地址
        }

        // 优先使用 parse 方法，否则直接调用
        if (typeof marked.parse === 'function') {
          return marked.parse(markdown, options)
        } else {
          return marked(markdown, options)
        }
      } catch (error) {
        console.error('Markdown渲染错误:', error)
        return markdown // 如果渲染失败，返回原始文本
      }
    },
    handleBack() {
      // TODO: 实现返回功能
      // 1. 可以返回上一页或关闭当前对话
      // 2. 可以添加确认对话框询问是否保存对话记录
      // 3. 可以清空当前对话或返回列表页
      this.$message({
        message: '返回功能待开发：可以返回上一页、保存对话记录或清空对话',
        type: 'info',
        duration: 3000
      })
    },
    handlePhoneCall() {
      // TODO: 实现语音通话功能
      // 1. 调用浏览器 WebRTC API 或第三方语音通话服务
      // 2. 需要实现音频捕获和播放
      // 3. 可以集成第三方语音通话 SDK（如声网、腾讯云等）
      // 4. 显示通话界面和控制按钮
      this.$message({
        message: '语音通话功能待开发：需要集成 WebRTC 或第三方语音通话服务',
        type: 'info',
        duration: 3000
      })
    },
    handleSpeakerToggle() {
      // TODO: 实现扬声器开关功能
      // 1. 切换音频输出模式（扬声器/听筒）
      // 2. 可以用于语音播报 AI 回复内容
      // 3. 控制音量大小
      this.isSpeakerActive = !this.isSpeakerActive
      this.$message({
        message: this.isSpeakerActive
          ? '扬声器已开启：功能待完善，可添加语音播报 AI 回复内容'
          : '扬声器已关闭：功能待完善，可添加音频输出模式切换',
        type: 'info',
        duration: 2000
      })
    },
    handleMoreOptions() {
      // TODO: 实现更多选项功能
      // 1. 显示下拉菜单或弹出框
      // 2. 包含：清空对话、导出对话、设置、反馈等功能
      // 3. 可以添加对话历史管理
      this.$message({
        message: '更多选项功能待开发：可添加清空对话、导出对话、设置、反馈等功能',
        type: 'info',
        duration: 3000
      })
    },
    async handleSendMessage() {
      if (!this.inputMessage.trim() || this.sending) {
        return
      }

      // 隐藏欢迎区域
      if (this.showWelcome) {
        this.showWelcome = false
      }

      const userContent = this.inputMessage.trim()

      // 添加用户消息
      const userMessage = {
        type: 'user',
        content: userContent,
        time: this.getCurrentTime(),
        showTime: true
      }
      this.messages.push(userMessage)

      // 添加到对话历史
      this.conversationHistory.push({
        role: 'user',
        content: userContent
      })

      // 清空输入框
      this.inputMessage = ''
      this.sending = true

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      // 添加加载中的AI消息
      const loadingMessage = {
        type: 'ai',
        content: '正在思考中...',
        time: '',
        showTime: false,
        loading: true
      }
      this.messages.push(loadingMessage)
      const loadingIndex = this.messages.length - 1

      try {
        // 调用 Qwen API
        const combinedSystemPrompt = this.buildCombinedSystemPrompt()
        const response = await chatWithQwen(
          userContent,
          combinedSystemPrompt,
          this.conversationHistory.slice(0, -1), // 排除刚添加的用户消息，因为chatWithQwen会自动添加
          {
            temperature: 0.8,
            top_p: 0.8
          }
        )

        // 获取AI回复内容（OpenAI 兼容格式）
        let aiContent = ''
        if (response.data && response.data.choices && response.data.choices.length > 0) {
          // OpenAI 兼容格式：response.data.choices[0].message.content
          aiContent = response.data.choices[0].message?.content || ''
        } else if (response.data && response.data.output) {
          // DashScope 标准格式（兼容旧格式）
          if (response.data.output.text) {
            aiContent = response.data.output.text
          } else if (response.data.output.choices && response.data.output.choices.length > 0) {
            aiContent = response.data.output.choices[0].message?.content || response.data.output.choices[0].text || ''
          }
        }

        if (!aiContent) {
          aiContent = '抱歉，我暂时无法理解您的问题，请换个方式提问。'
        }

        // 更新加载中的消息
        this.messages[loadingIndex] = {
          type: 'ai',
          content: aiContent,
          time: '',
          showTime: false,
          loading: false
        }

        // 添加到对话历史
        this.conversationHistory.push({
          role: 'assistant',
          content: aiContent
        })

        // 限制历史记录长度，避免超出token限制
        if (this.conversationHistory.length > 20) {
          this.conversationHistory = this.conversationHistory.slice(-20)
        }

      } catch (error) {
        console.error('API调用失败:', error)

        // 更新错误消息
        let errorMsg = '抱歉，服务暂时不可用，请稍后再试。'
        if (error.response) {
          if (error.response.status === 401) {
            errorMsg = 'API密钥无效，请检查配置。'
          } else if (error.response.status === 429) {
            errorMsg = '请求过于频繁，请稍后再试。'
          } else if (error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message
          }
        } else if (error.message) {
          errorMsg = `网络错误: ${error.message}`
        }

        this.messages[loadingIndex] = {
          type: 'ai',
          content: errorMsg,
          time: '',
          showTime: false,
          loading: false,
          error: true
        }

        this.$message.error('发送消息失败')
      } finally {
        this.sending = false
        // 临时系统提示词为一次性，调用完成后清空
        this.clearTemporarySystemPrompts()

        // 滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    async handleSuggestion(suggestion) {
      // 隐藏欢迎区域
      if (this.showWelcome) {
        this.showWelcome = false
      }

      // 添加用户消息
      const userMessage = {
        type: 'user',
        content: suggestion.text,
        time: this.getCurrentTime(),
        showTime: true
      }
      this.messages.push(userMessage)

      // 添加到对话历史
      this.conversationHistory.push({
        role: 'user',
        content: suggestion.text
      })

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      // 添加加载中的AI消息
      const loadingMessage = {
        type: 'ai',
        content: '正在思考中...',
        time: '',
        showTime: false,
        loading: true
      }
      this.messages.push(loadingMessage)
      const loadingIndex = this.messages.length - 1
      this.sending = true

      try {
        // 调用 Qwen API
        const combinedSystemPrompt = this.buildCombinedSystemPrompt()
        const response = await chatWithQwen(
          suggestion.text,
          combinedSystemPrompt,
          this.conversationHistory.slice(0, -1),
          {
            temperature: 0.8,
            top_p: 0.8
          }
        )

        // 获取AI回复内容
        let aiContent = ''
        if (response.data && response.data.output) {
          if (response.data.output.choices && response.data.output.choices.length > 0) {
            aiContent = response.data.output.choices[0].message.content || ''
          } else if (response.data.output.text) {
            aiContent = response.data.output.text
          }
        }

        if (!aiContent && response.data && response.data.choices && response.data.choices.length > 0) {
          aiContent = response.data.choices[0].message?.content || ''
        }

        if (!aiContent) {
          aiContent = '抱歉，我暂时无法理解您的问题，请换个方式提问。'
        }

        // 更新加载中的消息
        this.messages[loadingIndex] = {
          type: 'ai',
          content: aiContent,
          time: '',
          showTime: false,
          loading: false
        }

        // 添加到对话历史
        this.conversationHistory.push({
          role: 'assistant',
          content: aiContent
        })

        // 限制历史记录长度
        if (this.conversationHistory.length > 20) {
          this.conversationHistory = this.conversationHistory.slice(-20)
        }

      } catch (error) {
        console.error('API调用失败:', error)

        let errorMsg = '抱歉，服务暂时不可用，请稍后再试。'
        if (error.response) {
          if (error.response.status === 401) {
            errorMsg = 'API密钥无效，请检查配置。'
          } else if (error.response.status === 429) {
            errorMsg = '请求过于频繁，请稍后再试。'
          } else if (error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message
          }
        } else if (error.message) {
          errorMsg = `网络错误: ${error.message}`
        }

        this.messages[loadingIndex] = {
          type: 'ai',
          content: errorMsg,
          time: '',
          showTime: false,
          loading: false,
          error: true
        }

        this.$message.error('发送消息失败')
      } finally {
        this.sending = false
        // 临时系统提示词为一次性，调用完成后清空
        this.clearTemporarySystemPrompts()

        // 滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    handleFeature(feature) {
      // TODO: 实现快捷功能
      const featureMap = {
        '数据分析': {
          message: '数据分析功能待开发：可以分析当前数据看板的数据，生成数据洞察',
          tips: [
            '1. 获取当前数据看板的数据',
            '2. 调用 AI 进行数据分析和挖掘',
            '3. 识别数据趋势和异常',
            '4. 生成数据洞察报告'
          ]
        },
        '生成报告': {
          message: '生成报告功能待开发：可以自动生成数据报告和分析报告',
          tips: [
            '1. 汇总当前数据看板的关键指标',
            '2. 调用 AI 生成结构化报告',
            '3. 支持导出为 Word、PDF 等格式',
            '4. 可以自定义报告模板和样式'
          ]
        },
        '预测趋势': {
          message: '预测趋势功能待开发：基于历史数据预测未来趋势',
          tips: [
            '1. 获取历史数据',
            '2. 调用 AI 进行趋势分析和预测',
            '3. 生成预测图表和说明',
            '4. 提供置信区间和风险提示'
          ]
        },
        '智能建议': {
          message: '智能建议功能待开发：基于数据提供智能建议和优化方案',
          tips: [
            '1. 分析当前数据状态',
            '2. 识别问题和机会点',
            '3. 生成针对性的建议和方案',
            '4. 提供可执行的行动计划'
          ]
        }
      }

      const featureInfo = featureMap[feature.text] || {
        message: `功能 "${feature.text}" 待开发`,
        tips: []
      }

      this.$message({
        message: featureInfo.message,
        type: 'info',
        duration: 4000
      })

      // 在控制台输出开发提示
      console.log(`%c功能开发提示: ${feature.text}`, 'color: #409EFF; font-weight: bold; font-size: 14px;')
      featureInfo.tips.forEach((tip, index) => {
        console.log(`%c  ${index + 1}. ${tip}`, 'color: #606266; font-size: 12px;')
      })
    },
    handleTakePhoto() {
      // TODO: 实现拍照功能
      // 1. 使用 HTML5 的 <input type="file" accept="image/*"> 或摄像头 API
      // 2. 可以调用 navigator.mediaDevices.getUserMedia() 获取摄像头权限
      // 3. 拍照后可以预览图片，然后发送给 AI 进行识别
      // 4. 需要集成图片上传功能
      this.$message({
        message: '拍照功能待开发：需要集成摄像头 API 和图片上传功能',
        type: 'info',
        duration: 3000
      })
      console.log('%c拍照功能开发提示:', 'color: #409EFF; font-weight: bold;')
      console.log('  1. 使用 <input type="file" accept="image/*"> 选择图片')
      console.log('  2. 或使用 navigator.mediaDevices.getUserMedia() 调用摄像头')
      console.log('  3. 拍照后可以预览、编辑图片')
      console.log('  4. 将图片发送给 AI 进行识别和分析')
      console.log('  5. 可以集成图片压缩和格式转换功能')
    },
    handleVoiceInput() {
      // TODO: 实现语音输入功能
      // 1. 使用浏览器 Web Speech API（SpeechRecognition）或第三方语音识别服务
      // 2. 实时将语音转换为文字
      // 3. 支持按住说话和点击录音两种模式
      // 4. 可以集成第三方语音识别 SDK（如阿里云 ASR、百度语音识别等）
      this.$message({
        message: '语音输入功能待开发：需要集成语音识别 API，支持实时转写',
        type: 'info',
        duration: 3000
      })
      console.log('%c语音输入功能开发提示:', 'color: #409EFF; font-weight: bold;')
      console.log('  1. 使用 Web Speech API 或第三方语音识别服务')
      console.log('  2. 实现按住说话功能（touchstart/touchend 事件）')
      console.log('  3. 实时显示识别结果')
      console.log('  4. 支持停止录音和重新录制')
      console.log('  5. 可以集成语音唤醒和离线识别功能')
    },
    handleMoreActions() {
      // TODO: 实现更多操作功能
      // 1. 显示操作菜单（发送文件、发送位置、表情等）
      // 2. 可以添加文件上传、图片选择等功能
      // 3. 支持发送表情、快捷回复等
      this.$message({
        message: '更多操作功能待开发：可添加发送文件、表情、位置等功能',
        type: 'info',
        duration: 3000
      })
      console.log('%c更多操作功能开发提示:', 'color: #409EFF; font-weight: bold;')
      console.log('  1. 文件上传功能（支持多种文件格式）')
      console.log('  2. 图片选择功能（从相册选择）')
      console.log('  3. 表情选择器')
      console.log('  4. 快捷回复模板')
      console.log('  5. 位置分享功能')
      console.log('  6. 可以添加 @ 提及功能')
    },
    scrollToBottom() {
      if (this.$refs.messageScrollbar) {
        const wrap = this.$refs.messageScrollbar.$el.querySelector('.el-scrollbar__wrap')
        if (wrap) {
          wrap.scrollTop = wrap.scrollHeight
        }
      }
    },
    getCurrentTime() {
      const now = new Date()
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      const weekday = weekdays[now.getDay()]
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      return `${weekday} ${hours}:${minutes}`
    }
  }
}
</script>

<style lang="scss" scoped>
.agent-module {
  height: 100%;
  width: 100%;
  overflow-x: hidden;

  // 确保 el-card 高度正确
  ::v-deep .el-card {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .el-card__body {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  }

  // 顶部导航栏
  .top-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // padding: 12px 16px;
    background: #FFFFFF;
    // border-bottom: 1px solid #EBEEF5;

    .header-left {
      width: 40px;
      display: flex;
      align-items: center;

      .header-back-icon {
        font-size: 20px;
        color: #303133;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #409EFF;
        }
      }
    }

    .header-center {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;

      .header-avatar {
        flex-shrink: 0;
      }

      .header-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .ai-name {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          line-height: 1.2;
        }

        .ai-tag {
          font-size: 12px;
          color: #909399;
          line-height: 1.2;
          margin-top: 2px;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
      justify-content: flex-end;
      min-width: 120px;

      .header-icon-wrapper {
        position: relative;
        cursor: pointer;

        .icon-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 6px;
          height: 6px;
          background: #F56C6C;
          border-radius: 50%;
          border: 1px solid #FFFFFF;
        }
      }

      .header-icon {
        font-size: 20px;
        color: #303133;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #409EFF;
        }

        &.speaker-icon {
          &.active {
            color: #409EFF;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 24px;
              height: 24px;
              background: rgba(64, 158, 255, 0.1);
              border-radius: 50%;
              z-index: -1;
            }
          }
        }
      }
    }
  }

  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    overflow-x: hidden;
    overflow-y: auto;
    min-height: 0;
    // width: 100%;

    .message-list {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      min-height: 0;
      width: 100%;
      box-sizing: border-box;

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

      .messages {
        padding: 20px 16px;
        width: 100%;
        box-sizing: border-box;

        .welcome-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          // padding: 0px 0 40px;
          width: 100%;
          box-sizing: border-box;

          .welcome-avatar {
          margin-bottom: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .welcome-message {
            max-width: 320px;
            margin-bottom: 24px;
            padding: 14px 18px;
            background: #F5F5F5;
            color: #303133;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.6;
            text-align: left;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }

          .suggestions-section {
            width: 100%;
            margin-top: 10px;

            .suggestions-header {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 16px;
              padding: 0 4px;

              i {
                font-size: 18px;
                color: #409EFF;
              }

              span {
                font-size: 14px;
                font-weight: 600;
                color: #606266;
              }
            }

            .suggestions-grid {
              display: flex;
              flex-direction: column;
              gap: 10px;
              width: 100%;
              max-width: 100%;
              padding: 0;
              box-sizing: border-box;

              .suggestion-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 14px;
                background: #FFFFFF;
                border: 2px solid transparent;
                border-radius: 10px;
                font-size: 13px;
                color: #303133;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                word-break: break-word;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                position: relative;
                overflow: hidden;

                &::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 4px;
                  height: 100%;
                  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
                  opacity: 0;
                  transition: opacity 0.3s ease;
                }

                &.gradient-1 {
                  &::before {
                    background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
                  }
                }

                &.gradient-2 {
                  &::before {
                    background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
                  }
                }

                &.gradient-3 {
                  &::before {
                    background: linear-gradient(180deg, #43e97b 0%, #38f9d7 100%);
                  }
                }

                &:hover {
                  background: #F5F7FA;
                  border-color: #409EFF;
                  transform: translateX(4px);
                  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);

                  &::before {
                    opacity: 1;
                  }

                  .suggestion-icon {
                    transform: scale(1.1);
                  }

                  .suggestion-arrow {
                    opacity: 1;
                    transform: translateX(0);
                  }
                }

                .suggestion-icon {
                  flex-shrink: 0;
                  width: 32px;
                  height: 32px;
                  border-radius: 6px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: transform 0.3s ease;

                  i {
                    font-size: 16px;
                    color: white;
                  }
                }

                &.gradient-1 .suggestion-icon {
                  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                }

                &.gradient-2 .suggestion-icon {
                  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                }

                &.gradient-3 .suggestion-icon {
                  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                }

                .suggestion-text {
                  flex: 1;
                  line-height: 1.5;
                  color: #606266;
                }

                .suggestion-arrow {
                  flex-shrink: 0;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #F5F7FA;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  opacity: 0;
                  transform: translateX(-8px);
                  transition: all 0.3s ease;

                  i {
                    font-size: 12px;
                    color: #409EFF;
                  }
                }
              }
            }
          }
        }

        .message-wrapper {
          margin-bottom: 16px;

          .message-timestamp {
            text-align: center;
            font-size: 12px;
            color: #909399;
            margin: 16px 0;
            padding: 0 16px;
          }

          .message-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;

          &.ai-message {
            justify-content: flex-start;

            .message-content {
                margin-left: 10px;
                max-width: 80%;
            }
          }

          &.user-message {
            justify-content: flex-end;

            .message-content {
                margin-right: 10px;
                max-width: 80%;
            }
          }

          .message-avatar {
            flex-shrink: 0;
          }

          .message-content {
            display: flex;
            flex-direction: column;

            .message-bubble {
              padding: 12px 16px;
                border-radius: 12px;
              line-height: 1.6;
              word-break: break-word;
                font-size: 14px;

              &.ai-bubble {
                background: #F5F5F5;
                color: #303133;

                // Markdown 内容样式
                .markdown-content {
                  line-height: 1.6;

                  // 使用深度选择器应用到 v-html 渲染的内容
                  ::v-deep {
                    // 标题样式
                    h1, h2, h3, h4, h5, h6 {
                      margin: 16px 0 8px 0;
                      font-weight: 600;
                      line-height: 1.4;
                      color: #303133;

                      &:first-child {
                        margin-top: 0;
                      }
                    }

                    h1 {
                      font-size: 20px;
                      border-bottom: 2px solid #E4E7ED;
                      padding-bottom: 8px;
                    }

                    h2 {
                      font-size: 18px;
                      border-bottom: 1px solid #E4E7ED;
                      padding-bottom: 6px;
                    }

                    h3 {
                      font-size: 16px;
                      margin-top: 14px;
                    }

                    h4 {
                      font-size: 15px;
                    }

                    h5, h6 {
                      font-size: 14px;
                    }

                    // 段落样式
                    p {
                      margin: 8px 0;
                      line-height: 1.6;

                      &:first-child {
                        margin-top: 0;
                      }

                &:last-child {
                  margin-bottom: 0;
                }
              }

                    // 列表样式
                    ul, ol {
                margin: 8px 0;
                      padding-left: 24px;

                li {
                  margin: 4px 0;
                        line-height: 1.6;

                        p {
                          margin: 4px 0;
                        }
                      }
                    }

                    // 代码块样式
                    code {
                      background: rgba(0, 0, 0, 0.05);
                      padding: 2px 6px;
                      border-radius: 4px;
                      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                      font-size: 13px;
                      color: #E83E8C;
                    }

                    pre {
                      background: rgba(0, 0, 0, 0.05);
                      padding: 12px;
                      border-radius: 6px;
                      overflow-x: auto;
                      margin: 12px 0;
                      line-height: 1.5;

                      code {
                        background: transparent;
                        padding: 0;
                        color: #303133;
                        font-size: 13px;
                      }
                    }

                    // 引用样式
                    blockquote {
                      border-left: 4px solid #409EFF;
                      padding-left: 12px;
                      margin: 12px 0;
                      color: #606266;
                      font-style: italic;
                    }

                    // 链接样式
                    a {
                      color: #409EFF;
                      text-decoration: none;
                      transition: color 0.3s;

                      &:hover {
                        color: #66B1FF;
                        text-decoration: underline;
                      }
                    }

                    // 表格样式
                    table {
                      border-collapse: collapse;
                      width: 100%;
                      margin: 12px 0;
                      font-size: 14px;

                      th, td {
                        border: 1px solid #E4E7ED;
                        padding: 8px 12px;
                        text-align: left;
                      }

                      th {
                        background: #F5F7FA;
                        font-weight: 600;
                      }
                    }

                    // 分隔线
                    hr {
                      border: none;
                      border-top: 1px solid #E4E7ED;
                      margin: 16px 0;
                    }

                    // 强调文本
                    strong {
                      font-weight: 600;
                color: #303133;
                    }

                    em {
                      font-style: italic;
                    }

                    // 删除线
                    del {
                      text-decoration: line-through;
                      color: #909399;
                    }
                  }
                }

                &.loading {
                  .loading-dots {
                    display: inline-flex;
                    gap: 4px;
                    align-items: center;

                    span {
                      width: 6px;
                      height: 6px;
                      border-radius: 50%;
                      background: #909399;
                      animation: loading-dot 1.4s infinite ease-in-out;

                      &:nth-child(1) {
                        animation-delay: -0.32s;
                      }

                      &:nth-child(2) {
                        animation-delay: -0.16s;
                      }

                      &:nth-child(3) {
                        animation-delay: 0s;
                      }
                    }
                  }
                }

                &.error {
                  background: #FEF0F0;
                  color: #F56C6C;
                  border: 1px solid #FBC4C4;
                }
              }

              &.user-bubble {
                background: #409EFF;
                color: #FFFFFF;
              }
              }
            }
          }
        }
      }
    }

    .feature-shortcuts {
      flex-shrink: 0;
      padding: 12px 16px;
      // background: #FFFFFF;
      // border-top: 1px solid #EBEEF5;
      display: flex;
      gap: 8px;
      justify-content: space-between;
      flex-wrap: wrap;

      .feature-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition: all 0.3s;
        padding: 8px 12px;
        border-radius: 8px;
        background: #FFFFFF;
        border: 1px solid #E4E7ED;
        flex: 1;
        min-width: calc(25% - 8px);
        justify-content: center;

        &:hover {
          background: #F5F7FA;
          border-color: #409EFF;
        }

        .feature-icon {
          font-size: 18px;
          color: #303133;
        }

        .feature-text {
          font-size: 13px;
          color: #303133;
          white-space: nowrap;
        }
      }
    }

    .input-area {
      flex-shrink: 0;
      padding: 12px 16px;
      background: #FFFFFF;
      border-top: 1px solid #EBEEF5;
      width: 100%;
      box-sizing: border-box;

      .input-wrapper {
        display: flex;
        align-items: center;
        background: #F5F7FA;
        border-radius: 24px;
        padding: 8px 16px;
        gap: 12px;

        .input-left-icon {
          font-size: 20px;
          color: #909399;
          cursor: pointer;
          flex-shrink: 0;
        }

        .message-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          color: #303133;
          padding: 4px 0;

          &::placeholder {
            color: #C0C4CC;
          }

          &:disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }
        }

        .send-button {
          flex-shrink: 0;
          border-radius: 18px;
          padding: 6px 16px;

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }

        .input-right-icons {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;

          .input-icon {
            font-size: 20px;
            color: #909399;
            cursor: pointer;
            transition: color 0.3s;

            &:hover {
              color: #409EFF;
            }
          }
        }
      }
    }
  }
}

@keyframes loading-dot {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

