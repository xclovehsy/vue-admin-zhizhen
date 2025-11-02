import axios from 'axios'

// Qwen API 配置
const QWEN_API_KEY = 'sk-7cd135dca0834256a58e960048238db3'
// 使用 OpenAI 兼容格式的 baseURL
// 北京地域: https://dashscope.aliyuncs.com/compatible-mode/v1
// 新加坡地域: https://dashscope-intl.aliyuncs.com/compatible-mode/v1
const QWEN_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
const QWEN_MODEL = 'qwen-turbo'

// 创建专用的 axios 实例（OpenAI 兼容格式）
const qwenService = axios.create({
  baseURL: QWEN_BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${QWEN_API_KEY}`
  }
})

/**
 * 调用 Qwen API（OpenAI 兼容格式）
 * @param {Array} messages - 消息数组，格式: [{ role: 'system', content: '...' }, { role: 'user', content: '...' }]
 * @param {Object} options - 可选参数
 * @param {string} options.model - 模型名称，默认为 'qwen-turbo'
 * @param {number} options.temperature - 温度参数，默认为 0.8
 * @param {number} options.top_p - top_p 参数，默认为 0.8
 * @param {number} options.max_tokens - 最大token数
 * @param {boolean} options.stream - 是否流式返回，默认为 false
 * @returns {Promise}
 */
export function callQwenAPI(messages, options = {}) {
  const {
    model = QWEN_MODEL,
    temperature = 0.8,
    top_p = 0.8,
    max_tokens,
    stream = false
  } = options

  // OpenAI 兼容格式的请求数据
  const requestData = {
    model,
    messages,
    temperature,
    top_p
  }

  // 添加可选参数
  if (max_tokens) {
    requestData.max_tokens = max_tokens
  }

  if (stream) {
    requestData.stream = stream
  }

  // 使用 OpenAI 兼容格式的 endpoint
  return qwenService.post('/chat/completions', requestData)
}

/**
 * 简化版聊天调用（自动构建消息数组）
 * @param {string} userMessage - 用户消息
 * @param {string} systemPrompt - 系统提示词，默认为空
 * @param {Array} conversationHistory - 历史对话记录，格式: [{ role: 'user', content: '...' }, { role: 'assistant', content: '...' }]
 * @param {Object} options - 可选参数
 * @returns {Promise}
 */
export function chatWithQwen(userMessage, systemPrompt = '', conversationHistory = [], options = {}) {
  const messages = []

  // 添加系统提示词
  if (systemPrompt) {
    messages.push({
      role: 'system',
      content: systemPrompt
    })
  }

  // 添加历史对话
  messages.push(...conversationHistory)

  // 添加当前用户消息
  messages.push({
    role: 'user',
    content: userMessage
  })

  return callQwenAPI(messages, options)
}

