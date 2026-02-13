/**
 * AI报告生成通用Prompt模板
 * 各模块可以基于此模板进行定制
 */

import type { PromptTemplateVariables } from './types'

// 基础报告生成Prompt模板
export const BASE_REPORT_PROMPT_TEMPLATE = `你是一位专业的编译原理教学助手，擅长分析学生的学习情况并给出个性化的学习建议。

请基于以下学生的答题数据，生成一份详细的学习报告总结。

## 模块信息
- 模块名称：{moduleName}
- 学生输入：{input}

## 错误分析
{errorAnalysis}

## 学生答题详情
{userAnswers}

## 正确答案
{correctAnswers}

---

请生成一份结构化的JSON格式报告，包含以下内容：

1. **overallEvaluation**: 总体评价（200字以内），包括对学生整体表现的评价
2. **strengths**: 优点数组（3-5条），列出学生掌握较好的方面
3. **weaknesses**: 不足数组（3-5条），列出需要改进的方面
4. **suggestions**: 建议数组，每条建议包含：
   - id: 建议唯一标识
   - title: 建议标题
   - description: 详细描述
   - priority: 优先级（high/medium/low）
   - relatedStep: 相关步骤（可选）
5. **knowledgeMastery**: 知识点掌握情况数组，每项包含：
   - knowledgePoint: 知识点名称
   - masteryLevel: 掌握程度（excellent/good/average/poor）
   - description: 具体描述
6. **learningPath**: 学习路径建议（可选，300字以内）

要求：
- 评价要客观、具体，结合学生的实际错误
- 建议要有可操作性，帮助学生改进
- 语气要鼓励性，避免打击学生积极性
- 必须返回有效的JSON格式

JSON格式示例：
{
  "overallEvaluation": "总体评价内容...",
  "strengths": ["优点1", "优点2", "优点3"],
  "weaknesses": ["不足1", "不足2", "不足3"],
  "suggestions": [
    {
      "id": "1",
      "title": "建议标题",
      "description": "详细描述...",
      "priority": "high",
      "relatedStep": "步骤3"
    }
  ],
  "knowledgeMastery": [
    {
      "knowledgePoint": "知识点名称",
      "masteryLevel": "good",
      "description": "掌握情况描述"
    }
  ],
  "learningPath": "学习路径建议..."
}`

// FA模块特定的Prompt补充
export const FA_MODULE_PROMPT_SUPPLEMENT = `
## FA模块特定知识要点

在分析FA（有限自动机）模块时，请关注以下知识点：

1. **正则表达式理解**：学生是否正确理解正则表达式的语法和含义
2. **NFA构造**：是否正确使用Thompson构造法将正则表达式转换为NFA
3. **子集构造法**：是否正确理解和应用子集构造法进行NFA到DFA的转换
4. **ε-闭包计算**：是否正确计算ε-闭包
5. **DFA最小化**：是否正确应用Hopcroft算法或分割法进行DFA最小化
6. **状态等价性判断**：是否能正确判断状态等价性

常见错误类型：
- ε-闭包计算遗漏
- 状态转换遗漏或错误
- 终态标记错误
- 最小化时等价状态判断错误
- 状态编号混乱
`

// LL1模块特定的Prompt补充
export const LL1_MODULE_PROMPT_SUPPLEMENT = `
## LL(1)模块特定知识要点

在分析LL(1)语法分析模块时，请关注以下知识点：

1. **FIRST集计算**：是否正确计算FIRST集
2. **FOLLOW集计算**：是否正确计算FOLLOW集
3. **SELECT集计算**：是否正确计算SELECT集
4. **LL(1)文法判断**：是否能正确判断是否为LL(1)文法
5. **预测分析表构造**：是否正确构造预测分析表
6. **递归下降分析**：是否理解递归下降分析原理

常见错误类型：
- FIRST集计算时遗漏ε
- FOLLOW集计算时边界条件处理错误
- SELECT集计算混淆
- 左递归消除错误
- 提取左因子错误
`

// LR0模块特定的Prompt补充
export const LR0_MODULE_PROMPT_SUPPLEMENT = `
## LR(0)模块特定知识要点

在分析LR(0)语法分析模块时，请关注以下知识点：

1. **增广文法**：是否正确构造增广文法
2. **LR(0)项目**：是否正确理解LR(0)项目
3. **闭包计算**：是否正确计算项目集闭包
4. **GOTO函数**：是否正确计算GOTO函数
5. **LR(0)自动机构造**：是否正确构造LR(0)自动机
6. **LR(0)分析表**：是否正确构造LR(0)分析表
7. **移进-归约冲突**：是否能识别移进-归约冲突
8. **归约-归约冲突**：是否能识别归约-归约冲突

常见错误类型：
- 项目集闭包计算不完整
- GOTO转移计算错误
- 冲突识别错误
- 分析表构造错误
`

// SLR1模块特定的Prompt补充
export const SLR1_MODULE_PROMPT_SUPPLEMENT = `
## SLR(1)模块特定知识要点

在分析SLR(1)语法分析模块时，请关注以下知识点：

1. **FOLLOW集应用**：是否正确使用FOLLOW集解决冲突
2. **SLR(1)文法判断**：是否能正确判断是否为SLR(1)文法
3. **SLR(1)分析表**：是否正确构造SLR(1)分析表
4. **冲突解决**：是否能正确解决移进-归约和归约-归约冲突
5. **与LR(0)的区别**：是否理解SLR(1)与LR(0)的区别

常见错误类型：
- FOLLOW集计算错误导致冲突解决错误
- 混淆SLR(1)与LR(0)的分析表
- 冲突解决策略选择错误
`

// 模块类型到补充Prompt的映射
export const MODULE_PROMPT_SUPPLEMENTS: Record<string, string> = {
  fa: FA_MODULE_PROMPT_SUPPLEMENT,
  ll1: LL1_MODULE_PROMPT_SUPPLEMENT,
  lr0: LR0_MODULE_PROMPT_SUPPLEMENT,
  slr1: SLR1_MODULE_PROMPT_SUPPLEMENT,
}

/**
 * 填充Prompt模板
 * @param template 模板字符串
 * @param variables 变量对象
 * @returns 填充后的字符串
 */
export function fillPromptTemplate(
  template: string,
  variables: PromptTemplateVariables
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key as keyof PromptTemplateVariables] || match
  })
}

/**
 * 获取完整Prompt
 * @param moduleType 模块类型
 * @param variables 模板变量
 * @returns 完整的Prompt字符串
 */
export function getFullPrompt(
  moduleType: string,
  variables: PromptTemplateVariables
): string {
  const supplement = MODULE_PROMPT_SUPPLEMENTS[moduleType] || ''
  const basePrompt = fillPromptTemplate(BASE_REPORT_PROMPT_TEMPLATE, variables)
  return basePrompt + '\n\n' + supplement
}
