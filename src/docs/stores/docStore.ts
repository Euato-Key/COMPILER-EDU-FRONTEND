import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DocState, DocConfig, DocSection, DocPage, TocItem } from '../types'

export const useDocStore = defineStore('doc', () => {
  // 状态
  const state = ref<DocState>({
    currentSection: null,
    currentPage: null,
    sidebarCollapsed: false,
    tocCollapsed: false,
    loading: false,
    content: '',
    toc: []
  })

  // 文档配置
  const docConfig = ref<DocConfig>({
    title: '编译原理官方文档',
    description: '编译原理算法详解与可视化教程',
    version: '1.0.0',
    sections: [
      {
        id: 'introduction',
        title: '入门指南',
        icon: 'book-open',
        children: [
          {
            id: 'getting-started',
            title: '快速开始',
            file: 'markdown/getting-started.md',
            order: 1
          },
          {
            id: 'basic-concepts',
            title: '基础概念',
            file: 'markdown/basic-concepts.md',
            order: 2
          }
        ]
      },
      {
        id: 'finite-automata',
        title: '有限自动机',
        icon: 'git-branch',
        children: [
          {
            id: 'fa-overview',
            title: 'FA概述',
            file: 'markdown/fa-overview.md',
            order: 1
          },
          {
            id: '01-regex-input',
            title: '第一步：正则表达式输入',
            file: 'markdown/01-regex-input.md',
            order: 2
          },
          {
            id: '02-nfa-construction',
            title: '第二步：NFA构造',
            file: 'markdown/02-nfa-construction.md',
            order: 3
          },
          {
            id: '03-subset-construction',
            title: '第三步：子集构造法',
            file: 'markdown/03-subset-construction.md',
            order: 4
          },
          {
            id: '04-dfa-visualization',
            title: '第四步：DFA可视化',
            file: 'markdown/04-dfa-visualization.md',
            order: 5
          },
          {
            id: '05-dfa-minimization',
            title: '第五步：DFA最小化',
            file: 'markdown/05-dfa-minimization.md',
            order: 6
          },
          {
            id: '06-minimized-dfa-visualization',
            title: '第六步：最小化DFA可视化',
            file: 'markdown/06-minimized-dfa-visualization.md',
            order: 7
          }
        ]
      },
      {
        id: 'parsing',
        title: '语法分析',
        icon: 'layers',
        children: [
          {
            id: 'll1-parsing',
            title: 'LL1分析',
            file: 'markdown/ll1-parsing.md',
            order: 1
          },
          {
            id: 'lr-parsing',
            title: 'LR分析',
            file: 'markdown/lr-parsing.md',
            order: 2
          }
        ]
      }
    ]
  })

  // 计算属性
  const currentSectionData = computed(() => {
    if (!state.value.currentSection) return null
    return docConfig.value.sections.find(s => s.id === state.value.currentSection)
  })

  const currentPageData = computed(() => {
    if (!state.value.currentSection || !state.value.currentPage) return null
    const section = currentSectionData.value
    if (!section) return null
    return section.children.find(p => p.id === state.value.currentPage)
  })

  // 方法
  const setCurrentSection = (sectionId: string) => {
    state.value.currentSection = sectionId
    // 自动选择第一个页面
    const section = docConfig.value.sections.find(s => s.id === sectionId)
    if (section && section.children.length > 0) {
      state.value.currentPage = section.children[0].id
    }
  }

  const setCurrentPage = (pageId: string) => {
    state.value.currentPage = pageId
  }

  const toggleSidebar = () => {
    state.value.sidebarCollapsed = !state.value.sidebarCollapsed
  }

  const toggleToc = () => {
    state.value.tocCollapsed = !state.value.tocCollapsed
  }

  const setLoading = (loading: boolean) => {
    state.value.loading = loading
  }

  const setContent = (content: string) => {
    state.value.content = content
  }

  const setToc = (toc: TocItem[]) => {
    state.value.toc = toc
  }

  return {
    state,
    docConfig,
    currentSectionData,
    currentPageData,
    setCurrentSection,
    setCurrentPage,
    toggleSidebar,
    toggleToc,
    setLoading,
    setContent,
    setToc
  }
})
