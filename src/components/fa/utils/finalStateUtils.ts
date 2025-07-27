// 终态高亮工具函数

/**
 * 检查转换表单元格是否为终态（包含Y的状态）
 */
export const isConversionTableFinalState = (value: any): boolean => {
  if (!value || typeof value !== 'string') return false
  return value.includes('Y')
}

/**
 * 检查矩阵单元格是否为终态（基于接受状态集合）
 */
export const createMatrixFinalStateChecker = (acceptingStates: Set<string>) => {
  return (rowIndex: number, colKey: string, value: any): boolean => {
    if (!value || value === '-') return false
    return acceptingStates.has(String(value))
  }
}

/**
 * 检查最小化矩阵单元格是否为终态
 */
export const createMinimizedMatrixFinalStateChecker = (minimizedAcceptingStates: Set<string>) => {
  return (rowIndex: number, colKey: string, value: any): boolean => {
    if (!value || value === '-') return false
    return minimizedAcceptingStates.has(String(value))
  }
}

/**
 * 从DOT字符串中提取接受状态
 */
export const extractAcceptingStatesFromDot = (dotString: string): Set<string> => {
  const acceptingStates = new Set<string>()

  if (!dotString) return acceptingStates

  // 匹配双圆形的状态节点
  const doubleCircleRegex = /(\w+)\s*\[.*shape\s*=\s*doublecircle.*\]/gi
  const matches = [...dotString.matchAll(doubleCircleRegex)]

  matches.forEach(match => {
    acceptingStates.add(match[1])
  })

  return acceptingStates
}

/**
 * 从后端数据构建接受状态集合
 */
export const buildAcceptingStatesFromData = (data: any): Set<string> => {
  const acceptingStates = new Set<string>()

  // 方法1: 直接获取接受状态数组
  if (data.accepting_states && Array.isArray(data.accepting_states)) {
    data.accepting_states.forEach((state: any) => {
      acceptingStates.add(String(state))
    })
    return acceptingStates
  }

  // 方法2: 从其他可能的字段获取
  const possibleFields = ['final_states', 'F', 'acceptingStates']
  for (const field of possibleFields) {
    if (data[field] && Array.isArray(data[field])) {
      data[field].forEach((state: any) => {
        acceptingStates.add(String(state))
      })
      if (acceptingStates.size > 0) {
        return acceptingStates
      }
    }
  }

  return acceptingStates
}

/**
 * 构建最小化DFA的接受状态集合
 */
export const buildMinimizedAcceptingStates = (data: any): Set<string> => {
  const minimizedStates = new Set<string>()

  // 方法1: 从后端数据直接获取
  if (data.min_accepting_states && Array.isArray(data.min_accepting_states)) {
    data.min_accepting_states.forEach((state: any) => {
      minimizedStates.add(String(state))
    })
    return minimizedStates
  }

  // 方法2: 从原始接受状态推断
  if (data.table_to_num_min && data.accepting_states) {
    const originalAcceptingStates = new Set(data.accepting_states.map(String))

    if (data.table_to_num_min.S && Array.isArray(data.table_to_num_min.S)) {
      data.table_to_num_min.S.forEach((state: any) => {
        const stateStr = String(state)
        if (originalAcceptingStates.has(stateStr)) {
          minimizedStates.add(stateStr)
        }
      })
    }
  }

  return minimizedStates
}
