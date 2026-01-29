import request, { apiBase } from '@/utils/request'
import axios from 'axios'

// 获取baseURL（与request.js保持一致）
const getBaseURL = () => {
  const baseURL = request.defaults?.baseURL || apiBase || 'http://127.0.0.1:5001'
  return baseURL.endsWith('/') ? baseURL : `${baseURL}/`
}

/**
 * 普通聊天接口（非流式）
 * @param {Object} params - 聊天参数
 * @param {string} params.message - 用户消息
 * @param {string} params.session_id - 会话ID（可选，不传则创建新会话）
 * @param {Array} params.temporary_prompts - 临时提示词（可选，系统提示词由后端从配置文件读取）
 * @param {Array} params.conversation_history - 对话历史（可选）
 * @param {Object} params.options - 其他选项（可选）
 * @returns {Promise}
 */
export function chatWithAgent(params) {
  return request({
    url: '/agent/chat',
    method: 'post',
    data: params,
    timeout: 60000
  })
}

/**
 * 流式聊天接口（SSE）
 * @param {Object} params - 聊天参数
 * @param {string} params.message - 用户消息
 * @param {string} params.session_id - 会话ID（可选）
 * @param {Array} params.temporary_prompts - 临时提示词（可选，系统提示词由后端从配置文件读取）
 * @param {Array} params.conversation_history - 对话历史（可选）
 * @param {boolean} params.use_rag - 是否启用 RAG（默认 true）
 * @param {Object} params.options - 其他选项（可选）
 * @param {Function} onChunk - 接收数据块的回调函数
 * @param {Function} onDone - 完成回调函数
 * @param {Function} onError - 错误回调函数
 * @param {Function} onEvidence - 证据回调函数
 * @returns {Promise} 返回一个可取消的Promise
 */
export function chatWithAgentStream(params, { onChunk, onDone, onError, onProgress, onEvidence }) {
  const controller = new AbortController()
  const normalizedUseRag = typeof params.use_rag === 'boolean' ? params.use_rag : true
  
  // 构建请求体
  const requestBody = {
    message: params.message,
    session_id: params.session_id,
    temporary_prompts: params.temporary_prompts || [], // 临时提示词（系统提示词由后端从配置文件读取）
    conversation_history: params.conversation_history || [],
    task_type: params.task_type || 'auto', // 任务类型：'research' 强制使用 GPT-Researcher, 'chat' 使用 Qwen, 'auto' 自动路由
    use_rag: normalizedUseRag,
    use_web_search: params.use_web_search,
    options: params.options || {}
  }

  // 获取baseURL和完整URL
  const baseURL = getBaseURL()
  const url = `${baseURL}api/agent/chat/stream`
  
  // 发送请求
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    signal: controller.signal
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      
      function readStream() {
        reader.read().then(({ done, value }) => {
          if (done) {
            // 处理剩余的buffer
            if (buffer.trim()) {
              processBuffer(buffer)
              buffer = ''
            }
            if (onDone) onDone()
            return
          }
          
          // 解码数据
          buffer += decoder.decode(value, { stream: true })
          
          // 处理完整的SSE消息（以\n\n分隔）
          const parts = buffer.split('\n\n')
          // 保留最后不完整的部分
          buffer = parts.pop() || ''
          
          // 处理每个完整的消息（立即处理）
          for (const part of parts) {
            if (part.trim()) {
              processBuffer(part)
            }
          }
          
          // 立即继续读取（递归调用，不阻塞）
          readStream()
        }).catch(error => {
          if (error.name !== 'AbortError' && onError) {
            onError(error)
          }
        })
      }
      
      // 处理SSE格式的数据
      function processBuffer(text) {
        const lines = text.split('\n')
        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine || trimmedLine.startsWith(':')) {
            continue // 跳过空行和注释
          }
          
          if (trimmedLine.startsWith('data: ')) {
            try {
              const jsonStr = trimmedLine.slice(6) // 移除 "data: " 前缀
              const data = JSON.parse(jsonStr)
              
              if (data.type === 'start') {
                // 流开始，可以在这里初始化
                console.log('流式传输开始')
              } else if (data.type === 'evidence') {
                // NEW: 证据列表事件
                if (onEvidence) {
                  onEvidence(data.items || [])
                }
              } else if (data.type === 'progress') {
                // 进度信息，传递给进度回调
                if (onProgress) {
                  onProgress(data)
                }
              } else if (data.type === 'chunk') {
                // 数据块，立即处理
                if (onChunk && data.content) {
                  // 调试：打印接收的chunk（开发环境默认开启）
                  if (process.env.NODE_ENV === 'development' || window.DEBUG_STREAM) {
                    console.log('📥 接收chunk:', data.content, '长度:', data.content.length)
                  }
                  // 立即调用回调，确保实时更新
                  onChunk(data.content)
                }
              } else if (data.type === 'done') {
                // 流完成
                if (onDone) {
                  onDone(data)
                }
              } else if (data.type === 'error') {
                // 错误
                if (onError) {
                  onError(new Error(data.message || '未知错误'))
                }
              }
            } catch (e) {
              console.error('解析SSE数据失败:', e, '原始数据:', trimmedLine)
            }
          }
        }
      }
      
      readStream()
    })
    .catch(error => {
      if (error.name !== 'AbortError' && onError) {
        onError(error)
      }
    })
  
  // 返回取消函数
  return {
    cancel: () => controller.abort()
  }
}

/**
 * 获取聊天记录
 * @param {string} session_id - 会话ID
 * @param {number} limit - 限制数量，默认50
 * @returns {Promise}
 */
export function getChatHistory(session_id, limit = 50) {
  return request({
    url: '/agent/chat/history',
    method: 'get',
    params: {
      session_id,
      limit
    }
  })
}

/**
 * 获取所有聊天会话列表
 * @param {number} limit - 限制数量，默认20
 * @returns {Promise}
 */
export function getChatSessions(limit = 20) {
  return request({
    url: '/agent/chat/sessions',
    method: 'get',
    params: {
      limit
    }
  })
}

/**
 * 删除聊天会话
 * @param {string} session_id - 会话ID
 * @returns {Promise}
 */
export function deleteChatSession(session_id) {
  return request({
    url: `/agent/chat/sessions/${session_id}`,
    method: 'delete'
  })
}
