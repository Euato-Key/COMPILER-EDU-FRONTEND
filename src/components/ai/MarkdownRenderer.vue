<template>
  <div
    class="markdown-renderer"
    :class="[themeClass, sizeClass]"
    v-html="renderedContent"
  ></div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import mermaid from 'mermaid'

// Props
interface Props {
  content: string
  theme?: 'light' | 'dark' | 'auto'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'auto',
  size: 'md'
})

// 响应式数据
const renderedContent = ref('')

// 计算属性
const themeClass = computed(() => {
  if (props.theme === 'auto') {
    return 'markdown-theme-auto'
  }
  return `markdown-theme-${props.theme}`
})

const sizeClass = computed(() => `markdown-size-${props.size}`)

// 初始化 mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif'
})

// 创建 markdown-it 实例
const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch {
        // 忽略错误，保持原样
      }
    }
    // 如果没有指定语言，返回原样，不进行自动检测
    return str
  }
})

// 自定义表格渲染器
md.renderer.rules.table_open = function () {
  return '<div class="table-wrapper"><table class="markdown-table">'
}

md.renderer.rules.table_close = function () {
  return '</table></div>'
}

// 自定义代码块渲染器
md.renderer.rules.fence = function (tokens, idx) {
  const token = tokens[idx]
  const lang = token.info.trim()
  const code = token.content

  // 生成唯一ID
  const codeId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // 处理 mermaid 代码块
  if (lang === 'mermaid') {
    const mermaidId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    return `
      <div class="mermaid-block-wrapper">
        <div class="mermaid-header">
          <span class="mermaid-language">MERMAID</span>
          <button class="copy-button" onclick="copyCode('${codeId}')" title="复制代码">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <div class="mermaid-container">
          <div class="mermaid" id="${mermaidId}">${code}</div>
        </div>
        <pre class="mermaid-code" style="display: none;"><code id="${codeId}">${code}</code></pre>
      </div>
    `
  }

  // 高亮代码
  let highlightedCode = code
  if (lang && hljs.getLanguage(lang)) {
    try {
      highlightedCode = hljs.highlight(code, { language: lang }).value
    } catch {
      // 忽略错误，保持原样
    }
  } else {
    // 如果没有指定语言，保持原样，不进行自动检测
    highlightedCode = code
  }

  // 获取语言显示名称
  const langDisplay = lang || 'text'

  return `
    <div class="code-block-wrapper">
      <div class="code-header">
        <span class="code-language">${langDisplay}</span>
        <button class="copy-button" onclick="copyCode('${codeId}')" title="复制代码">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
      <pre class="hljs"><code id="${codeId}">${highlightedCode}</code></pre>
    </div>
  `
}



// 渲染Markdown内容
const renderContent = async () => {
  if (!props.content) {
    renderedContent.value = ''
    return
  }

  try {
    // 先处理数学公式，用特殊标记替换
    const processedContent = props.content
      .replace(/\\\(([\s\S]*?)\\\)/g, 'MATH_INLINE_START$1MATH_INLINE_END')
      .replace(/\\\[([\s\S]*?)\\\]/g, 'MATH_DISPLAY_START$1MATH_DISPLAY_END')
      .replace(/\$([^\$\n]+?)\$/g, 'MATH_INLINE_START$1MATH_INLINE_END')
      .replace(/\$\$([\s\S]*?)\$\$/g, 'MATH_DISPLAY_START$1MATH_DISPLAY_END')

    // 渲染Markdown
    const html = md.render(processedContent)

    // 替换特殊标记为KaTeX渲染结果
    const finalHtml = html
      .replace(/MATH_INLINE_START([\s\S]*?)MATH_INLINE_END/g, (match, formula) => {
        try {
          return katex.renderToString(formula.trim(), {
            displayMode: false,
            throwOnError: false,
            errorColor: '#cc0000'
          })
        } catch (error) {
          console.warn('KaTeX inline error:', error)
          return match
        }
      })
      .replace(/MATH_DISPLAY_START([\s\S]*?)MATH_DISPLAY_END/g, (match, formula) => {
        try {
          return katex.renderToString(formula.trim(), {
            displayMode: true,
            throwOnError: false,
            errorColor: '#cc0000'
          })
        } catch (error) {
          console.warn('KaTeX block error:', error)
          return match
        }
      })

    renderedContent.value = finalHtml

    // 等待DOM更新后执行后续操作
    await nextTick()

    // 渲染 mermaid 图表
    try {
      const mermaidElements = document.querySelectorAll('.mermaid')
      for (const element of mermaidElements) {
        if (element instanceof HTMLElement) {
          await mermaid.run({
            nodes: [element]
          })
        }
      }
    } catch (error) {
      console.warn('Mermaid 渲染错误:', error)
    }

  } catch (error) {
    console.error('Markdown渲染错误:', error)
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    renderedContent.value = `<div class="markdown-error">渲染错误: ${errorMessage}</div>`
  }
}

// 监听内容变化
watch(() => props.content, renderContent, { immediate: true })

// 复制代码功能
const copyCode = (codeId: string) => {
  const codeElement = document.getElementById(codeId)
  if (codeElement) {
    const text = codeElement.textContent || ''
    navigator.clipboard.writeText(text).then(() => {
      // 显示复制成功提示
      const button = codeElement.closest('.code-block-wrapper')?.querySelector('.copy-button')
      if (button) {
        const originalHTML = button.innerHTML
        button.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        `
        button.classList.add('copied')
        setTimeout(() => {
          button.innerHTML = originalHTML
          button.classList.remove('copied')
        }, 2000)
      }
    }).catch(err => {
      console.error('复制失败:', err)
    })
  }
}

// 将复制函数暴露到全局
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).copyCode = copyCode
}
</script>

<style scoped>
.markdown-renderer {
  width: 100%;
  line-height: 1.6;
}

/* 尺寸变体 */
.markdown-size-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.markdown-size-md {
  font-size: 1rem;
  line-height: 1.5rem;
}

.markdown-size-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

/* 主题变体 */
.markdown-theme-light {
  color: rgb(17 24 39);
}

.markdown-theme-dark {
  color: rgb(243 244 246);
}

.markdown-theme-auto {
  color: rgb(17 24 39);
}

.dark .markdown-theme-auto {
  color: rgb(243 244 246);
}

/* 基础Markdown样式 */
.markdown-renderer :deep(h1) {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  margin-top: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgb(229 231 235);
}

.dark .markdown-renderer :deep(h1) {
  border-bottom-color: rgb(55 65 81);
}

.markdown-renderer :deep(h2) {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

.markdown-renderer :deep(h3) {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  margin-top: 1.25rem;
}

.markdown-renderer :deep(h4) {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.markdown-renderer :deep(h5) {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 0.75rem;
}

.markdown-renderer :deep(h6) {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 0.75rem;
}

.markdown-renderer :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.markdown-renderer :deep(strong) {
  font-weight: 600;
  color: rgb(17 24 39);
}

.dark .markdown-renderer :deep(strong) {
  color: rgb(243 244 246);
}

.markdown-renderer :deep(em) {
  font-style: italic;
  color: rgb(55 65 81);
}

.dark .markdown-renderer :deep(em) {
  color: rgb(209 213 219);
}

.markdown-renderer :deep(code) {
  background-color: rgb(239 246 255);
  color: rgb(30 58 138);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  border: 1px solid rgb(191 219 254);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
  display: inline-block;
  line-height: 1.2;
  vertical-align: baseline;
  margin: 0 0.125rem;
}

.dark .markdown-renderer :deep(code) {
  background-color: rgb(30 58 138);
  color: rgb(219 234 254);
  border-color: rgb(59 130 246);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
}

.markdown-renderer :deep(pre) {
  background: linear-gradient(135deg, rgb(17 24 39), rgb(31 41 55));
  color: rgb(243 244 246);
  padding: 1.25rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid rgb(55 65 81);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
  position: relative;
}

.markdown-renderer :deep(pre code) {
  background-color: transparent;
  color: rgb(243 244 246);
  padding: 0;
  border: none;
  box-shadow: none;
  font-weight: normal;
}

.dark .markdown-renderer :deep(pre) {
  background: linear-gradient(135deg, rgb(15 23 42), rgb(30 41 59));
  border-color: rgb(51 65 85);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.3);
}

/* 列表样式 */
.markdown-renderer :deep(ul) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  list-style-type: disc;
}

.markdown-renderer :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  list-style-type: decimal;
}

.markdown-renderer :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

/* 链接样式 */
.markdown-renderer :deep(a) {
  color: rgb(37 99 235);
  text-decoration: underline;
  transition: color 0.15s ease-in-out;
}

.markdown-renderer :deep(a):hover {
  color: rgb(30 64 175);
}

.dark .markdown-renderer :deep(a) {
  color: rgb(96 165 250);
}

.dark .markdown-renderer :deep(a):hover {
  color: rgb(147 197 253);
}

/* 引用块样式 */
.markdown-renderer :deep(blockquote) {
  border-left: 4px solid rgb(59 130 246);
  background-color: rgb(239 246 255);
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin: 1rem 0;
  font-style: italic;
  color: rgb(55 65 81);
}

.dark .markdown-renderer :deep(blockquote) {
  background-color: rgb(30 58 138 / 0.2);
  color: rgb(209 213 219);
}

/* 水平线样式 */
.markdown-renderer :deep(hr) {
  margin: 2rem 0;
  border-top: 1px solid rgb(209 213 219);
}

.dark .markdown-renderer :deep(hr) {
  border-top-color: rgb(75 85 99);
}

/* 表格样式 */
.markdown-renderer :deep(table),
.markdown-renderer :deep(.markdown-table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  border: 1px solid rgb(134 239 172);
  border-radius: 0.5rem;
  overflow: hidden;
}

.dark .markdown-renderer :deep(table),
.dark .markdown-renderer :deep(.markdown-table) {
  border-color: rgb(34 197 94);
}

.markdown-renderer :deep(th) {
  background: linear-gradient(135deg, rgb(134 239 172), rgb(74 222 128));
  color: rgb(21 94 117);
  font-weight: 600;
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid rgb(187 247 208);
  border-right: 1px solid rgb(187 247 208);
  text-shadow: 0 1px 2px rgb(255 255 255 / 0.3);
}

.dark .markdown-renderer :deep(th) {
  background: linear-gradient(135deg, rgb(34 197 94), rgb(22 163 74));
  color: white;
  border-bottom-color: rgb(34 197 94);
  border-right-color: rgb(34 197 94);
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.3);
}

.markdown-renderer :deep(td) {
  padding: 0.75rem;
  border-bottom: 1px solid rgb(187 247 208);
  border-right: 1px solid rgb(187 247 208);
  vertical-align: top;
}

.dark .markdown-renderer :deep(td) {
  border-bottom-color: rgb(34 197 94);
  border-right-color: rgb(34 197 94);
}

.markdown-renderer :deep(tr:last-child td) {
  border-bottom: none;
}

.markdown-renderer :deep(td:last-child),
.markdown-renderer :deep(th:last-child) {
  border-right: none;
}

.markdown-renderer :deep(tr:nth-child(even)) {
  background-color: rgb(240 253 244);
}

.dark .markdown-renderer :deep(tr:nth-child(even)) {
  background-color: rgb(22 101 52);
}

.markdown-renderer :deep(tr:hover) {
  background-color: rgb(220 252 231);
  transition: background-color 0.2s ease-in-out;
}

.dark .markdown-renderer :deep(tr:hover) {
  background-color: rgb(34 197 94);
}

/* 表格容器样式 */
.markdown-renderer :deep(.table-wrapper) {
  overflow-x: auto;
  margin: 1rem 0;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.dark .markdown-renderer :deep(.table-wrapper) {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3);
}

/* 数学公式样式 */
.markdown-renderer :deep(.katex) {
  color: rgb(17 24 39);
  font-size: 1em;
}

.dark .markdown-renderer :deep(.katex) {
  color: rgb(243 244 246);
}

.markdown-renderer :deep(.katex-display) {
  margin: 1rem 0;
  text-align: center;
  overflow-x: auto;
  overflow-y: hidden;
}

.markdown-renderer :deep(.katex-display .katex) {
  font-size: 1.1em;
}

/* 错误样式 */
.markdown-renderer :deep(.markdown-error) {
  background-color: rgb(254 242 242);
  border: 1px solid rgb(254 202 202);
  color: rgb(185 28 28);
  padding: 1rem;
  border-radius: 0.5rem;
}

.dark .markdown-renderer :deep(.markdown-error) {
  background-color: rgb(127 29 29 / 0.2);
  border-color: rgb(127 29 29);
  color: rgb(252 165 165);
}

/* 代码块样式 */
.markdown-renderer :deep(.code-block-wrapper) {
  margin: 1rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: rgb(255 255 255);
  border: 1px solid rgb(226 232 240);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
}

.dark .markdown-renderer :deep(.code-block-wrapper) {
  background-color: rgb(15 23 42);
  border-color: rgb(51 65 85);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.3);
}

.markdown-renderer :deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: rgb(248 250 252);
  border-bottom: 1px solid rgb(226 232 240);
  color: rgb(51 65 85);
  font-size: 0.75rem;
  font-weight: 500;
}

.dark .markdown-renderer :deep(.code-header) {
  background-color: rgb(30 41 59);
  border-bottom-color: rgb(51 65 85);
  color: rgb(148 163 184);
}

.markdown-renderer :deep(.code-language) {
  text-transform: uppercase;
  font-size: 0.625rem;
  letter-spacing: 0.05em;
  color: rgb(51 65 85);
}

.dark .markdown-renderer :deep(.code-language) {
  color: rgb(148 163 184);
}

.markdown-renderer :deep(.copy-button) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: transparent;
  border: 1px solid rgb(203 213 225);
  border-radius: 0.25rem;
  color: rgb(71 85 105);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.markdown-renderer :deep(.copy-button:hover) {
  background-color: rgb(241 245 249);
  border-color: rgb(148 163 184);
  color: rgb(30 41 59);
}

.dark .markdown-renderer :deep(.copy-button) {
  border-color: rgb(71 85 105);
  color: rgb(148 163 184);
}

.dark .markdown-renderer :deep(.copy-button:hover) {
  background-color: rgb(51 65 85);
  border-color: rgb(100 116 139);
  color: rgb(226 232 240);
}

.markdown-renderer :deep(.copy-button.copied) {
  background-color: rgb(34 197 94);
  border-color: rgb(34 197 94);
  color: white;
}

.markdown-renderer :deep(.copy-button.copied:hover) {
  background-color: rgb(22 163 74);
  border-color: rgb(22 163 74);
}

.markdown-renderer :deep(.code-block-wrapper pre) {
  margin: 0;
  padding: 1rem;
  background-color: rgb(255 255 255);
  border: none;
  border-radius: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
  color: rgb(17 24 39);
}

.markdown-renderer :deep(.code-block-wrapper code) {
  background-color: transparent;
  border: none;
  padding: 0;
  font-size: inherit;
  color: rgb(17 24 39);
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}

/* 普通代码块样式（没有语言标识的） */
.markdown-renderer :deep(pre:not(.hljs)) {
  background: rgb(255 255 255);
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgb(226 232 240);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgb(17 24 39);
}

.dark .markdown-renderer :deep(pre:not(.hljs)) {
  background: linear-gradient(135deg, rgb(15 23 42), rgb(30 41 59));
  border-color: rgb(51 65 85);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.3);
  color: rgb(226 232 240);
}

/* 覆盖 highlight.js 的深色背景 */
.markdown-renderer :deep(.hljs) {
  background: rgb(255 255 255) !important;
  color: rgb(17 24 39) !important;
}

.dark .markdown-renderer :deep(.hljs) {
  background: rgb(15 23 42) !important;
  color: rgb(226 232 240) !important;
}

/* Mermaid 图表样式 */
.markdown-renderer :deep(.mermaid-block-wrapper) {
  margin: 1rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: rgb(255 255 255);
  border: 1px solid rgb(226 232 240);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
}

.dark .markdown-renderer :deep(.mermaid-block-wrapper) {
  background-color: rgb(15 23 42);
  border-color: rgb(51 65 85);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.3);
}

.markdown-renderer :deep(.mermaid-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: rgb(248 250 252);
  border-bottom: 1px solid rgb(226 232 240);
  color: rgb(51 65 85);
  font-size: 0.75rem;
  font-weight: 500;
}

.dark .markdown-renderer :deep(.mermaid-header) {
  background-color: rgb(30 41 59);
  border-bottom-color: rgb(51 65 85);
  color: rgb(148 163 184);
}

.markdown-renderer :deep(.mermaid-language) {
  text-transform: uppercase;
  font-size: 0.625rem;
  letter-spacing: 0.05em;
  color: rgb(51 65 85);
}

.dark .markdown-renderer :deep(.mermaid-language) {
  color: rgb(148 163 184);
}

.markdown-renderer :deep(.mermaid-container) {
  padding: 1rem;
  background-color: rgb(255 255 255);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.dark .markdown-renderer :deep(.mermaid-container) {
  background-color: rgb(15 23 42);
}

.markdown-renderer :deep(.mermaid) {
  width: 100%;
  text-align: center;
}

.markdown-renderer :deep(.mermaid svg) {
  max-width: 100%;
  height: auto;
}

.markdown-renderer :deep(.mermaid-code) {
  display: none;
}
</style>
