<template>
  <div class="module-stat-card bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
    <!-- 头部 -->
    <div class="card-header p-5 border-b" :class="`bg-${moduleColor}-50 border-${moduleColor}-100`">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="module-icon-wrapper" :class="`bg-${moduleColor}-100 text-${moduleColor}-600`">
            <Icon :icon="moduleIcon" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ moduleName }}</h3>
            <p class="text-sm text-gray-500">{{ stats.steps.length }} 个步骤</p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold" :class="`text-${moduleColor}-600`">{{ stats.totalErrors }}</div>
          <div class="text-xs text-gray-500">总错误</div>
        </div>
      </div>
    </div>

    <!-- 步骤统计列表 -->
    <div class="card-body p-5 flex-1">
      <div class="steps-list space-y-4">
        <div
          v-for="step in stats.steps"
          :key="step.step"
          class="step-item"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">{{ formatStepName(step.step) }}</span>
            <span class="text-sm text-gray-500">{{ step.errors }} 次错误</span>
          </div>

          <!-- 进度条 -->
          <div class="progress-bar-bg">
            <div
              class="progress-bar-fill"
              :class="`bg-${moduleColor}-500`"
              :style="{ width: getProgressWidth(step.errors) + '%' }"
            ></div>
          </div>

          <!-- 错误类型分布（如果有） -->
          <div v-if="step.types && step.types.length > 0" class="error-types mt-2 flex flex-wrap gap-2">
            <span
              v-for="type in step.types.slice(0, 3)"
              :key="type.type"
              class="error-type-tag"
              :class="`bg-${moduleColor}-50 text-${moduleColor}-700 border-${moduleColor}-200`"
            >
              {{ formatErrorType(type.type) }}: {{ type.count }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部汇总 -->
    <div class="card-footer p-4 bg-gray-50 border-t">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">答题记录</span>
        <span class="font-semibold text-gray-900">{{ stats.records }} 条</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface ErrorType {
  type: string
  count: number
}

interface StepStat {
  step: string
  errors: number
  types: ErrorType[]
}

interface ModuleStats {
  totalErrors: number
  records: number
  steps: StepStat[]
}

interface Props {
  moduleName: string
  moduleIcon: string
  moduleColor: 'blue' | 'green' | 'purple' | 'orange'
  stats: ModuleStats
}

const props = defineProps<Props>()

// 格式化步骤名称 - 根据模块显示具体内容
const formatStepName = (step: string) => {
  // 模块步骤映射表
  const moduleStepNames: Record<string, Record<string, string>> = {
    // FA 模块步骤
    FA: {
      step1: '输入正则表达式',
      step2: '构造 NFA',
      step3: '子集构造法',
      step4: '绘制 DFA',
      step5: 'DFA 最小化',
      step6: '最小化 DFA 结果'
    },
    // LL1 模块步骤
    LL1: {
      step1: '输入文法',
      step2: 'First/Follow 集',
      step3: '构建 LL1 分析表',
      step4: '字符串分析'
    },
    // LR0 模块步骤
    LR0: {
      step1: '文法输入',
      step2: '增广文法',
      step3: '构造 DFA',
      step4: 'LR0 表构建',
      step5: '字符串分析'
    },
    // SLR1 模块步骤
    SLR1: {
      step1: '文法输入',
      step2: '增广文法',
      step3: '构造 DFA',
      step4: 'SLR1 表构建',
      step5: '字符串分析'
    }
  }

  // 获取步骤编号
  const stepNum = step.replace('step', '')

  // 获取当前模块的步骤映射
  const currentModuleSteps = moduleStepNames[props.moduleName]
  if (currentModuleSteps && currentModuleSteps[step]) {
    return `步骤 ${stepNum} · ${currentModuleSteps[step]}`
  }

  // 默认返回步骤编号
  return `步骤 ${stepNum}`
}

// 格式化错误类型
const formatErrorType = (type: string) => {
  const typeNames: Record<string, string> = {
    conversionTable: '转换表',
    transitionMatrix: '转移矩阵',
    pSets: '状态子集',
    minimizedMatrix: '最小化矩阵',
    firstSet: 'First集',
    followSet: 'Follow集',
    parsingTable: '分析表',
    analysisStep: '分析步骤',
    dfa: 'DFA',
    nfa: 'NFA',
    closure: '闭包',
    goto: 'Goto表',
    action: 'Action表',
    augmentedFormula: '增广文法',
    dfaState: 'DFA状态',
    gotoTransition: 'Goto转换',
    actionTable: 'Action表',
    gotoTable: 'Goto表'
  }
  return typeNames[type] || type
}

// 计算进度条宽度
const getProgressWidth = (errors: number) => {
  const maxErrors = Math.max(...props.stats.steps.map(s => s.errors), 1)
  return (errors / maxErrors) * 100
}
</script>

<style scoped>
.module-stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.module-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.module-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.step-item:hover {
  background: #f3f4f6;
}

.progress-bar-bg {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.error-type-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid;
}

.card-footer {
  border-radius: 0 0 12px 12px;
}
</style>
