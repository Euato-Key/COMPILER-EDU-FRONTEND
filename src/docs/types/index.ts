// 文档系统类型定义

// 文档配置类型
export interface DocSection {
  id: string
  title: string
  icon?: string
  children: DocPage[]
}

export interface DocPage {
  id: string
  title: string
  file: string
  order: number
}

export interface DocConfig {
  title: string
  description: string
  version: string
  sections: DocSection[]
}

// 目录项类型
export interface TocItem {
  id: string
  title: string
  level: number
  children?: TocItem[]
}

// 文档状态类型
export interface DocState {
  currentSection: string | null
  currentPage: string | null
  sidebarCollapsed: boolean
  tocCollapsed: boolean
  loading: boolean
  content: string
  toc: TocItem[]
}
