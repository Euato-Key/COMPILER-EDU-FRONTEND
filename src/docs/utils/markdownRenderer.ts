import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import toc from 'markdown-it-toc-done-right'
import hljs from 'highlight.js'
import mermaid from 'mermaid'
import { instance as viz } from '@viz-js/viz'
import type { TocItem } from '../types'

export class MarkdownRenderer {
  private md: MarkdownIt

  constructor() {
    // 初始化 mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    })

    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value
          } catch (__) {}
        }
        return this.md.utils.escapeHtml(str)
      }
    })

    // 添加插件 - 使用简单的锚点配置
    this.md.use(anchor, {
      level: [1, 2, 3, 4, 5, 6],
      permalink: false,
      slugify: (str: string) => {
        return str
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }
    })

    this.md.use(toc, {
      level: [1, 2, 3],
      listType: 'ul',
      containerHeaderHtml: '<h2>目录</h2>'
    })

    // 自定义渲染规则
    this.setupCustomRenderers()
  }

  private setupCustomRenderers() {
    // 保存原始的 fence 渲染器
    const originalFence = this.md.renderer.rules.fence

    // 重写 fence 渲染器
    this.md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
      const token = tokens[idx]
      const info = token.info.trim()
      const code = token.content

      // 生成唯一ID
      const codeId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Mermaid 图表渲染
      if (info === 'mermaid') {
        const mermaidId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const blockId = `mermaid-block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        return `
          <div class="mermaid-block-wrapper" id="${blockId}">
            <div class="mermaid-header">
              <div class="mermaid-tabs">
                <button class="tab-button active" data-view="image">图片</button>
                <button class="tab-button" data-view="code">代码</button>
              </div>
              <div class="mermaid-actions">
                <button class="action-button" data-action="download" title="下载图片">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
                <button class="action-button" data-action="copy" title="复制">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
                <button class="action-button" data-action="fullscreen" title="全屏查看">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15,3 21,3 21,9"></polyline>
                    <polyline points="9,21 3,21 3,15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div class="mermaid-container" data-view="image">
              <div class="mermaid" id="${mermaidId}">${code}</div>
            </div>
            <pre class="mermaid-code" data-view="code" style="display: none;"><code id="${codeId}">${code}</code></pre>
          </div>
        `
      }

      // Graphviz DOT 渲染
      if (info === 'dot') {
        const dotId = `dot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const blockId = `dot-block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        return `
          <div class="dot-block-wrapper" id="${blockId}">
            <div class="dot-header">
              <div class="dot-tabs">
                <button class="tab-button active" data-view="image">图片</button>
                <button class="tab-button" data-view="code">代码</button>
              </div>
              <div class="dot-actions">
                <button class="action-button" data-action="download" title="下载图片">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
                <button class="action-button" data-action="copy" title="复制">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
                <button class="action-button" data-action="fullscreen" title="全屏查看">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15,3 21,3 21,9"></polyline>
                    <polyline points="9,21 3,21 3,15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div class="dot-container" data-view="image">
              <div class="dot-graph" id="${dotId}">${code}</div>
            </div>
            <pre class="dot-code" data-view="code" style="display: none;"><code id="${codeId}">${code}</code></pre>
          </div>
        `
      }

      // 高亮代码
      let highlightedCode = code
      if (info && hljs.getLanguage(info)) {
        try {
          highlightedCode = hljs.highlight(code, { language: info }).value
        } catch {
          // 忽略错误，保持原样
        }
      } else {
        // 如果没有指定语言，保持原样，不进行自动检测
        highlightedCode = code
      }

      // 获取语言显示名称 - 保持原始格式
      const langDisplay = info || 'text'

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
  }

  async render(content: string): Promise<string> {
    const html = this.md.render(content)

    // 手动为标题添加ID
    const processedHtml = this.addHeadingIds(html)

    // 处理 Mermaid 图表
    await this.processMermaid()

    // 处理 Graphviz 图表
    await this.processGraphviz()

    return processedHtml
  }

  // 新增：只渲染Markdown，不处理图表
  renderMarkdown(content: string): string {
    const html = this.md.render(content)
    return this.addHeadingIds(html)
  }

  // 新增：公共方法，手动为标题添加ID
  addHeadingIds(html: string): string {
    // 使用正则表达式为标题添加ID，处理可能存在的tabindex属性
    const result = html.replace(
      /<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/g,
      (match, level, attrs, content) => {
        const id = this.generateId(content)
        // 移除可能存在的id属性，然后添加新的id
        const cleanAttrs = attrs.replace(/\s*id="[^"]*"/g, '')

        // 添加调试信息
        console.log(`为标题添加ID: Level ${level}, Title: ${content}, ID: ${id}`)

        return `<h${level} id="${id}"${cleanAttrs}>${content}</h${level}>`
      }
    )

    return result
  }

  // 新增：公共方法，处理Mermaid图表
  async processMermaid() {
    console.log('开始处理Mermaid图表...') // 调试信息

    // 添加重试机制
    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      const mermaidElements = document.querySelectorAll('.mermaid')
      console.log(`第${retryCount + 1}次尝试，找到${mermaidElements.length}个Mermaid图表元素`) // 调试信息

      if (mermaidElements.length === 0) {
        console.log('未找到Mermaid图表元素，等待后重试...') // 调试信息
        await new Promise(resolve => setTimeout(resolve, 200))
        retryCount++
        continue
      }

      let successCount = 0
      for (let i = 0; i < mermaidElements.length; i++) {
        const element = mermaidElements[i]
        try {
          const content = element.textContent
          console.log('Mermaid代码:', content) // 调试信息

          if (content) {
            console.log('开始渲染Mermaid图表...') // 调试信息
            console.log('Mermaid内容:', content) // 调试信息
            // 使用更安全的ID生成方式
            const id = `mermaid-${Date.now()}-${i}`
            console.log('生成的ID:', id) // 调试信息

            try {
              const { svg } = await mermaid.render(id, content)
              console.log('Mermaid渲染成功，SVG长度:', svg.length) // 调试信息
              element.innerHTML = svg
              console.log('Mermaid图表渲染完成') // 调试信息
              successCount++
            } catch (renderError) {
              console.error('Mermaid渲染详细错误:', renderError) // 调试信息
              const errorMessage = renderError instanceof Error ? renderError.message : String(renderError)
              element.innerHTML = `<div class="error">Mermaid图表渲染失败: ${errorMessage}</div>`
            }
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error)
          element.innerHTML = '<div class="error">图表渲染失败</div>'
        }
      }

      console.log(`成功渲染${successCount}个Mermaid图表`) // 调试信息

      // 如果找到了元素但渲染失败，重试
      if (mermaidElements.length > 0 && successCount === 0) {
        console.log('找到元素但渲染失败，重试...') // 调试信息
        retryCount++
        await new Promise(resolve => setTimeout(resolve, 200))
        continue
      }

      break
    }
  }

  // 新增：公共方法，处理Graphviz图表
  async processGraphviz() {
    console.log('开始处理Graphviz图表...') // 调试信息

    // 添加重试机制
    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      const dotElements = document.querySelectorAll('.dot-graph')
      console.log(`第${retryCount + 1}次尝试，找到${dotElements.length}个DOT图表元素`) // 调试信息

      if (dotElements.length === 0) {
        console.log('未找到DOT图表元素，等待后重试...') // 调试信息
        await new Promise(resolve => setTimeout(resolve, 200))
        retryCount++
        continue
      }

      let successCount = 0
      for (const element of dotElements) {
        try {
          const dotCode = element.textContent || ''
          console.log('DOT代码:', dotCode) // 调试信息

          if (dotCode.trim()) {
            console.log('开始渲染DOT图表...') // 调试信息
            const vizInstance = await viz()
            const result = await vizInstance.renderSVGElement(dotCode)
            element.innerHTML = ''
            element.appendChild(result)
            console.log('DOT图表渲染完成') // 调试信息
            successCount++
          }
        } catch (error) {
          console.error('Graphviz rendering error:', error)
          element.innerHTML = '<div class="error">图表渲染失败</div>'
        }
      }

      console.log(`成功渲染${successCount}个DOT图表`) // 调试信息

      // 如果找到了元素但渲染失败，重试
      if (dotElements.length > 0 && successCount === 0) {
        console.log('找到元素但渲染失败，重试...') // 调试信息
        retryCount++
        await new Promise(resolve => setTimeout(resolve, 200))
        continue
      }

      break
    }

    // 设置事件监听器，使用事件委托而不是全局函数
    this.setupEventListeners()
  }

  // 新增：设置事件监听器
  private setupEventListeners() {
    // 移除之前的事件监听器
    document.removeEventListener('click', this.handleGlobalClick)

    // 添加新的事件监听器
    document.addEventListener('click', this.handleGlobalClick)
  }

  // 新增：全局点击事件处理
  private handleGlobalClick = (event: Event) => {
    const target = event.target as HTMLElement

    // 处理Mermaid标签页切换
    if (target.matches('.mermaid-tabs .tab-button')) {
      const blockId = target.closest('.mermaid-block-wrapper')?.id
      const view = target.getAttribute('data-view') as 'image' | 'code'
      if (blockId && view) {
        this.switchMermaidView(blockId, view)
      }
    }

    // 处理DOT标签页切换
    if (target.matches('.dot-tabs .tab-button')) {
      const blockId = target.closest('.dot-block-wrapper')?.id
      const view = target.getAttribute('data-view') as 'image' | 'code'
      if (blockId && view) {
        this.switchDotView(blockId, view)
      }
    }

    // 处理Mermaid下载按钮
    if (target.matches('.mermaid-actions .action-button[data-action="download"]')) {
      const blockId = target.closest('.mermaid-block-wrapper')?.id
      if (blockId) {
        this.downloadMermaidSVG(blockId)
      }
    }

    // 处理Mermaid复制按钮
    if (target.matches('.mermaid-actions .action-button[data-action="copy"]')) {
      const blockId = target.closest('.mermaid-block-wrapper')?.id
      if (blockId) {
        this.copyMermaidContent(blockId)
      }
    }

    // 处理Mermaid全屏按钮
    if (target.matches('.mermaid-actions .action-button[data-action="fullscreen"]')) {
      const blockId = target.closest('.mermaid-block-wrapper')?.id
      if (blockId) {
        this.fullscreenMermaid(blockId)
      }
    }

    // 处理DOT下载按钮
    if (target.matches('.dot-actions .action-button[data-action="download"]')) {
      const blockId = target.closest('.dot-block-wrapper')?.id
      if (blockId) {
        this.downloadDotSVG(blockId)
      }
    }

    // 处理DOT复制按钮
    if (target.matches('.dot-actions .action-button[data-action="copy"]')) {
      const blockId = target.closest('.dot-block-wrapper')?.id
      if (blockId) {
        this.copyDotContent(blockId)
      }
    }

    // 处理DOT全屏按钮
    if (target.matches('.dot-actions .action-button[data-action="fullscreen"]')) {
      const blockId = target.closest('.dot-block-wrapper')?.id
      if (blockId) {
        this.fullscreenDot(blockId)
      }
    }
  }

  // 公共方法：Mermaid相关函数
  switchMermaidView = (blockId: string, view: 'image' | 'code') => {
    const block = document.getElementById(blockId)
    if (!block) {
      console.error('Block not found:', blockId)
      return
    }

    // 切换标签状态
    const tabs = block.querySelectorAll('.tab-button')
    tabs.forEach(tab => {
      tab.classList.remove('active')
      if (tab.getAttribute('data-view') === view) {
        tab.classList.add('active')
      }
    })

    // 切换内容显示 - 只针对内容容器，不包括标签按钮
    const containers = block.querySelectorAll('.mermaid-container, .mermaid-code')
    containers.forEach(container => {
      if (container instanceof HTMLElement) {
        if (container.getAttribute('data-view') === view) {
          container.style.display = 'block'
        } else {
          container.style.display = 'none'
        }
      }
    })
  }

  downloadMermaidSVG = async (blockId: string) => {
    const block = document.getElementById(blockId)
    if (!block) return

    const svg = block.querySelector('.mermaid svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)

    const downloadLink = document.createElement('a')
    downloadLink.href = svgUrl
    downloadLink.download = 'mermaid-chart.svg'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(svgUrl)
  }

  copyMermaidContent = async (blockId: string) => {
    const block = document.getElementById(blockId)
    if (!block) return

    const activeTab = block.querySelector('.tab-button.active')
    const view = activeTab?.getAttribute('data-view')

    let content = ''
    if (view === 'image') {
      const svg = block.querySelector('.mermaid svg')
      if (svg) {
        content = new XMLSerializer().serializeToString(svg)
      }
    } else {
      const code = block.querySelector('.mermaid-code code')
      if (code) {
        content = code.textContent || ''
      }
    }

    if (content) {
      await navigator.clipboard.writeText(content)
      // 显示复制成功提示
      const button = block.querySelector('.action-button[data-action="copy"]')
      if (button) {
        const originalHTML = button.innerHTML
        button.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        `
        button.classList.add('copied')
        setTimeout(() => {
          button.innerHTML = originalHTML
          button.classList.remove('copied')
        }, 2000)
      }
    }
  }

  fullscreenMermaid = (blockId: string) => {
    const block = document.getElementById(blockId)
    if (!block) return

    const svg = block.querySelector('.mermaid svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const fullscreenWindow = window.open('', '_blank')
    if (fullscreenWindow) {
      fullscreenWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Mermaid Chart - Fullscreen</title>
            <style>
              body { margin: 0; padding: 20px; background: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
              svg { max-width: 100%; max-height: 100vh; }
            </style>
          </head>
          <body>${svgData}</body>
        </html>
      `)
      fullscreenWindow.document.close()
    }
  }

  // 公共方法：DOT相关函数
  switchDotView = (blockId: string, view: 'image' | 'code') => {
    const block = document.getElementById(blockId)
    if (!block) {
      console.error('Block not found:', blockId)
      return
    }

    // 切换标签状态
    const tabs = block.querySelectorAll('.tab-button')
    tabs.forEach(tab => {
      tab.classList.remove('active')
      if (tab.getAttribute('data-view') === view) {
        tab.classList.add('active')
      }
    })

    // 切换内容显示 - 只针对内容容器，不包括标签按钮
    const containers = block.querySelectorAll('.dot-container, .dot-code')
    containers.forEach(container => {
      if (container instanceof HTMLElement) {
        if (container.getAttribute('data-view') === view) {
          container.style.display = 'block'
        } else {
          container.style.display = 'none'
        }
      }
    })
  }

  downloadDotSVG = async (blockId: string) => {
    const block = document.getElementById(blockId)
    if (!block) return

    const svg = block.querySelector('.dot-graph svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)

    const downloadLink = document.createElement('a')
    downloadLink.href = svgUrl
    downloadLink.download = 'dot-chart.svg'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(svgUrl)
  }

  copyDotContent = async (blockId: string) => {
    const block = document.getElementById(blockId)
    if (!block) return

    const activeTab = block.querySelector('.tab-button.active')
    const view = activeTab?.getAttribute('data-view')

    let content = ''
    if (view === 'image') {
      const svg = block.querySelector('.dot-graph svg')
      if (svg) {
        content = new XMLSerializer().serializeToString(svg)
      }
    } else {
      const code = block.querySelector('.dot-code code')
      if (code) {
        content = code.textContent || ''
      }
    }

    if (content) {
      await navigator.clipboard.writeText(content)
      // 显示复制成功提示
      const button = block.querySelector('.action-button[data-action="copy"]')
      if (button) {
        const originalHTML = button.innerHTML
        button.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        `
        button.classList.add('copied')
        setTimeout(() => {
          button.innerHTML = originalHTML
          button.classList.remove('copied')
        }, 2000)
      }
    }
  }

  fullscreenDot = (blockId: string) => {
    const block = document.getElementById(blockId)
    if (!block) return

    const svg = block.querySelector('.dot-graph svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const fullscreenWindow = window.open('', '_blank')
    if (fullscreenWindow) {
      fullscreenWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>DOT Chart - Fullscreen</title>
            <style>
              body { margin: 0; padding: 20px; background: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
              svg { max-width: 100%; max-height: 100vh; }
            </style>
          </head>
          <body>${svgData}</body>
        </html>
      `)
      fullscreenWindow.document.close()
    }
  }

  // 提取目录
  extractToc(content: string): TocItem[] {
    const lines = content.split('\n')
    const toc: TocItem[] = []
    const stack: TocItem[] = []

    lines.forEach((line, index) => {
      // 清理行内容，移除回车符和换行符
      const cleanLine = line.trim()

      // 更宽松的正则表达式匹配
      const match = cleanLine.match(/^(#{1,6})\s*(.+)$/)
      if (match) {
        const level = match[1].length
        const title = match[2].trim()
        const id = this.generateId(title)

        const item: TocItem = {
          id,
          title,
          level,
          children: []
        }

        // 找到正确的父级
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop()
        }

        if (stack.length === 0) {
          toc.push(item)
        } else {
          stack[stack.length - 1].children!.push(item)
        }

        stack.push(item)
      }
    })

    return toc
  }

  // 从HTML中提取目录
  extractTocFromHtml(html: string): TocItem[] {
    const toc: TocItem[] = []
    const stack: TocItem[] = []

    // 使用更宽松的正则表达式匹配HTML中的标题，支持没有id属性的标题
    const headingRegex = /<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/g
    let match

    while ((match = headingRegex.exec(html)) !== null) {
      const level = parseInt(match[1])
      const attrs = match[2]
      const title = match[3].replace(/<[^>]*>/g, '').trim() // 移除HTML标签

      // 提取id属性，如果没有则生成一个
      let id = ''
      const idMatch = attrs.match(/id="([^"]*)"/)
      if (idMatch) {
        id = idMatch[1]
      } else {
        id = this.generateId(title)
      }

      const item: TocItem = {
        id,
        title,
        level,
        children: []
      }

      // 找到正确的父级
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop()
      }

      if (stack.length === 0) {
        toc.push(item)
      } else {
        stack[stack.length - 1].children!.push(item)
      }

      stack.push(item)
    }

    // 添加调试信息
    console.log('TOC提取结果:', toc)
    console.log('找到的标题数量:', toc.length)
    toc.forEach(item => {
      console.log(`Level ${item.level}: ${item.title}`)
    })

    return toc
  }

  private generateId(title: string): string {
    // 为中文标题生成有意义的ID
    const id = title
      .trim()
      // 移除emoji和特殊符号
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      // 移除HTML标签
      .replace(/<[^>]*>/g, '')
      // 移除标点符号
      .replace(/[^\w\s\u4e00-\u9fff]/g, '')
      // 将空格和中文转换为连字符
      .replace(/[\s\u4e00-\u9fff]+/g, '-')
      // 移除多余的连字符
      .replace(/-+/g, '-')
      // 移除首尾连字符
      .replace(/^-+|-+$/g, '')
      // 转换为小写
      .toLowerCase()

    // 如果ID为空，使用数字索引
    return id || 'heading-' + Math.random().toString(36).substr(2, 9)
  }
}

// 创建单例实例
export const markdownRenderer = new MarkdownRenderer()

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

// 将复制函数暴露到全局（仅用于代码块）
if (typeof window !== 'undefined') {
  const globalWindow = window as unknown as Record<string, unknown>
  globalWindow.copyCode = copyCode
}
