<template>
  <div class="doc-layout min-h-screen theme-main-bg theme-transition">
    <!-- 头部导航 -->
    <DocHeader
      :sidebar-collapsed="docStore.state.sidebarCollapsed"
      :toc-collapsed="docStore.state.tocCollapsed"
      :current-page-title="currentPageTitle"
      @toggle-sidebar="docStore.toggleSidebar"
      @toggle-toc="docStore.toggleToc"
    />

    <!-- 左侧总目录 -->
    <DocSidebar
      :sections="docStore.docConfig.sections"
      :current-section="docStore.state.currentSection"
      :current-page="docStore.state.currentPage"
      :collapsed="docStore.state.sidebarCollapsed"
      @toggle="docStore.toggleSidebar"
      @navigate="handleNavigation"
    />

    <!-- 中间内容区 -->
    <DocContent
      :content="docStore.state.content"
      :loading="docStore.state.loading"
      :sidebar-collapsed="docStore.state.sidebarCollapsed"
      :toc-collapsed="docStore.state.tocCollapsed"
    />

    <!-- 右侧本页目录 -->
    <DocToc
      :toc="docStore.state.toc"
      :collapsed="docStore.state.tocCollapsed"
      @toggle="docStore.toggleToc"
      @navigate="scrollToHeading"
    />

    <!-- AI聊天组件 -->
    <AIChatWidget
      page-type="home"
      :context="chatContext"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DocHeader from './DocHeader.vue'
import DocSidebar from './DocSidebar.vue'
import DocContent from './DocContent.vue'
import DocToc from './DocToc.vue'
import { useDocStore } from '../stores/docStore'
import { markdownRenderer } from '../utils/markdownRenderer'
import { AIChatWidget } from '@/components/ai'
import { useHomeChatStore } from '@/stores/homeChat'
import type { ChatContext } from '@/components/ai/types'

const route = useRoute()
const router = useRouter()
const docStore = useDocStore()

// 使用主页AI聊天store
const homeChatStore = useHomeChatStore()

// 聊天上下文
const chatContext = ref<ChatContext>({
  currentPage: 'home',
  userInput: {},
  backendData: {},
  userAnswers: {},
  pageContext: '编译原理官方文档系统'
})

// 当前页面标题
const currentPageTitle = computed(() => {
  const currentPage = docStore.currentPageData
  return currentPage?.title || ''
})

// 处理导航
const handleNavigation = (sectionId: string, pageId: string) => {
  docStore.setCurrentSection(sectionId)
  docStore.setCurrentPage(pageId)

  // 更新路由
  router.push(`/docs/${sectionId}/${pageId}`)
}

// 滚动到指定标题
const scrollToHeading = (headingId: string) => {
  const element = document.getElementById(headingId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// 加载文档内容
const loadDocument = async (sectionId: string, pageId: string) => {
  try {
    docStore.setLoading(true)

    // 查找页面配置
    const section = docStore.docConfig.sections.find(s => s.id === sectionId)
    if (!section) {
      throw new Error('章节不存在')
    }

    const page = section.children.find(p => p.id === pageId)
    if (!page) {
      throw new Error('页面不存在')
    }

    // 加载 Markdown 文件
    const response = await fetch(`/docs/${page.file}`)
    if (!response.ok) {
      throw new Error('文件加载失败')
    }

    const markdownContent = await response.text()
    console.log('Markdown内容长度:', markdownContent.length) // 调试信息
    console.log('Markdown内容前100字符:', markdownContent.substring(0, 100)) // 调试信息

    // 渲染 Markdown（不包含图表渲染）
    const htmlContent = markdownRenderer.renderMarkdown(markdownContent)
    console.log('HTML内容长度:', htmlContent.length) // 调试信息
    console.log('HTML内容前200字符:', htmlContent.substring(0, 200)) // 调试信息

    // 从渲染后的HTML中提取目录
    const toc = markdownRenderer.extractTocFromHtml(htmlContent)
    console.log('提取的目录:', toc) // 调试信息

    // 更新状态
    docStore.setContent(htmlContent)
    docStore.setToc(toc)

    // 等待DOM更新后渲染图表
    await nextTick()
    console.log('DOM更新完成，开始渲染图表...') // 调试信息

    // 添加额外延迟确保DOM完全更新
    await new Promise(resolve => setTimeout(resolve, 200))
    console.log('延迟完成，开始渲染图表...') // 调试信息

    // 强制重新渲染图表，确保不被AI组件影响
    console.log('强制重新渲染图表...') // 调试信息

    // 处理 Mermaid 图表
    console.log('开始处理Mermaid图表...') // 调试信息
    await markdownRenderer.processMermaid()
    console.log('Mermaid图表处理完成') // 调试信息

    // 处理 Graphviz 图表
    console.log('开始处理Graphviz图表...') // 调试信息
    await markdownRenderer.processGraphviz()
    console.log('Graphviz图表处理完成') // 调试信息

    // 再次检查图表是否渲染成功
    setTimeout(async () => {
      const dotElements = document.querySelectorAll('.dot-graph')
      console.log('最终检查：找到', dotElements.length, '个DOT图表元素') // 调试信息

      // 如果图表没有渲染，再次尝试
      if (dotElements.length > 0) {
        const renderedElements = document.querySelectorAll('.dot-graph svg')
        console.log('已渲染的图表数量:', renderedElements.length) // 调试信息

        if (renderedElements.length === 0) {
          console.log('图表未渲染，再次尝试...') // 调试信息
          await markdownRenderer.processGraphviz()
        }
      }
    }, 500)

  } catch (error) {
    console.error('加载文档失败:', error)
    docStore.setContent('<div class="error">文档加载失败</div>')
    docStore.setToc([])
  } finally {
    docStore.setLoading(false)
  }
}

// 监听路由变化
watch(
  () => [route.params.section, route.params.page],
  ([section, page]) => {
    console.log('路由变化:', { section, page }) // 调试信息
    if (section && page) {
      docStore.setCurrentSection(section as string)
      docStore.setCurrentPage(page as string)
      loadDocument(section as string, page as string)
    } else if (!section && !page) {
      // 如果直接访问 /docs，加载第一个文档
      const firstSection = docStore.docConfig.sections[0]
      if (firstSection && firstSection.children.length > 0) {
        const firstPage = firstSection.children[0]
        console.log('默认跳转到:', firstSection.id, firstPage.id) // 调试信息
        docStore.setCurrentSection(firstSection.id)
        docStore.setCurrentPage(firstPage.id)
        // 使用 replace 而不是 push，避免在历史记录中留下 /docs
        router.replace(`/docs/${firstSection.id}/${firstPage.id}`)
      }
    }
  },
  { immediate: true }
)

// 初始化
onMounted(() => {
  // 延迟初始化聊天上下文，确保图表渲染优先完成
  setTimeout(() => {
    homeChatStore.updateContext(chatContext.value)
  }, 500) // 延迟500ms

  // 检查是否需要默认跳转
  if (!route.params.section || !route.params.page) {
    const firstSection = docStore.docConfig.sections[0]
    if (firstSection && firstSection.children.length > 0) {
      const firstPage = firstSection.children[0]
      console.log('onMounted: 默认跳转到:', firstSection.id, firstPage.id) // 调试信息
      // 先设置状态，再跳转路由
      docStore.setCurrentSection(firstSection.id)
      docStore.setCurrentPage(firstPage.id)
      // 使用 replace 而不是 push
      router.replace(`/docs/${firstSection.id}/${firstPage.id}`)
    }
  }
})
</script>

<style scoped>
.doc-layout {
  min-height: 100vh;
}
</style>
