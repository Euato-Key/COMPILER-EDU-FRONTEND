/**
 * AI报告生成通用Prompt模板
 * 各模块可以基于此模板进行定制
 */

import type { PromptTemplateVariables } from './types'

// 基础报告生成Prompt模板
export const BASE_REPORT_PROMPT_TEMPLATE = `你是一位专业的编译原理教学助手，擅长分析学生的学习情况并给出个性化的学习建议。

请基于以下学生的答题数据，生成一份详细的学习报告总，注意需要基于真实的数据，严谨比对学生的答题数据与正确的答案，进而判断完成进度。

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

1. **overallEvaluation**: 总体评价，包括对学生整体表现的评价
2. **strengths**: 优点数组（3-5条），列出学生掌握较好的方面
3. **weaknesses**: 不足数组（3-5条），列出需要改进的方面
4. **suggestions**: 建议数组，每条建议包含：
   - id: 建议唯一标识
   - title: 建议标题
   - description: 详细描述
   - priority: 优先级（high/medium/low）
   - relatedStep: 相关步骤（可选）
5. **knowledgeMastery**: 知识点掌握情况数组，具体描述详细点，每项包含：
   - knowledgePoint: 知识点名称
   - masteryLevel: 掌握程度（excellent/good/average/poor）
   - description: 具体描述
6. **learningPath**: 学习路径建议（可选，300字以内）

要求：
- 评价要严谨、客观、具体，基于真实的数据、结合学生的实际错误
- 建议要有可操作性，帮助学生改进
- 语气要鼓励性，避免打击学生积极性
- 必须返回有效的JSON格式

备注：学生的答题数据是前端重新设置的，不必在乎格式不一致的问题。

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

FA模块包含6个步骤，从正则表达式逐步构造到最小化DFA。在分析时，请按照以下步骤逐一评估：

### Step 1: 正则表达式输入
- 学生输入的正则表达式将作为后续所有步骤的基础
- 系统会根据此正则表达式生成标准答案

### Step 2: NFA构造（Thompson构造法）
**核心知识点**：
- Thompson构造法的基本规则：为每个基本符号创建对应的状态和转换
- 连接、选择(|)、闭包(*)的组合规则
- 初始状态（单箭头指向）和接受状态（双圆圈）的标记
- ε转换的使用

**评判要点**：
- 状态数是否合理（Thompson构造法有固定的模式）
- 转换边是否完整，标记是否正确
- 初始状态和接受状态是否明确
- 是否正确处理了操作符的优先级

### Step 3: 子集构造法（NFA转DFA）
**核心知识点**：
- ε-闭包的定义和计算方法
- 子集构造法的迭代过程
- NFA状态集合到DFA状态的映射

**评判要点**：
- **NFA→DFA转换表**：
  - 是否正确计算了每个状态集合的ε-闭包
  - 是否正确计算了每个输入符号的转移
  - 状态集合的表示格式是否正确（多个状态用空格分隔）
- **DFA状态转换矩阵**：
  - 状态编号是否正确（从0开始连续编号）
  - 转移目标是否正确
  - 无转换的格子是否标记为"-"或留空

**常见错误**：
- ε-闭包计算不完整，遗漏了通过ε可达的状态
- 混淆NFA状态集合和DFA状态编号
- 状态转移计算错误

### Step 4: DFA构造（画图）
**核心知识点**：
- DFA与NFA的区别：确定性、无ε转换
- DFA状态的编号表示
- 接受状态的确定（对应于包含原NFA接受状态的状态集合）

**评判要点**：
- 是否根据第三步的状态转换矩阵绘制
- 每个状态对于每个输入符号是否有且仅有一个转移（或无转移标记）
- 状态编号是否与矩阵一致
- 接受状态标记是否正确

### Step 5: DFA最小化
**核心知识点**：
- 状态等价性的定义：不可区分的状态
- 分割法（Partitioning Algorithm）的迭代过程
- 等价类与最小化DFA状态的对应关系

**评判要点**：
- **化简DFA状态子集**：
  - 初始划分是否正确（接受状态 vs 非接受状态）
  - 迭代细分是否正确（检查每个划分块中状态在各输入符号下的转移是否落在同一划分块）
  - 最终划分是否最细（无法再细分）
  - 格式是否正确（每行一个子集，状态用空格分隔）
- **最小化状态转换矩阵**：
  - S列是否正确（最小化后的状态编号）
  - 转移是否正确（基于等价类重新计算）
  - 无转换的格子是否标记为"-"或留空

**常见错误**：
- 初始划分遗漏某些接受状态
- 迭代过程中过早停止，未能找到最细划分
- 混淆原DFA状态编号和最小化后的状态编号

### Step 6: 最小化DFA构造（画图）
**核心知识点**：
- 最小化DFA的状态数 = 第五步中状态子集的个数
- 每个状态代表原DFA中的一个等价类
- 接受状态的确定（对应于包含原DFA接受状态的等价类）

**评判要点**：
- 是否根据第五步的最小化状态转换矩阵绘制
- 状态数是否与子集划分个数一致
- 状态编号是否与矩阵S列一致（0, 1, 2, ...）
- 接受状态标记是否正确（绿色高亮的单元格对应接受状态）
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
