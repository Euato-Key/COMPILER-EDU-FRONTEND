// 消息解析器类型
export interface ParsedLL1Message {
  type: 'production' | 'match' | 'epsilon' | 'unknown'
  left?: string
  right?: string | string[]
  symbol?: string
  message?: string
}

export interface ParsedLRMessage {
  type: 'shift' | 'reduce' | 'accept' | 'unknown'
  currentState?: string
  symbol?: string
  newState?: string
  ruleNumber?: string
  production?: string
  message?: string
}

// 解析LL1动作消息
export function parseLL1Message(msg: string): ParsedLL1Message {
  if (msg.includes('->') && !msg.includes('匹配')) {
    // 产生式应用: "S->AB", "A->aA", "A->ε 不入栈"
    const [left, right] = msg.split('->')
    if (right === 'ε 不入栈') {
      return { type: 'epsilon', left: left.trim(), right: 'ε' }
    }
    return {
      type: 'production',
      left: left.trim(),
      right: right.split('').filter((c) => c !== ' '),
    }
  } else if (msg.includes('匹配')) {
    // 符号匹配: "'a'匹配"
    const symbol = msg.match(/'(.)'匹配/)?.[1] || ''
    return { type: 'match', symbol }
  }
  return { type: 'unknown', message: msg }
}

// 解析LR动作消息
export function parseLRMessage(msg: string): ParsedLRMessage {
  if (msg.includes('=s')) {
    // 移进: "Action[0,a]=s3: 状态 3 入栈"
    const match = msg.match(/Action\[(\d+),(.)\]=s(\d+)/)
    if (match) {
      return {
        type: 'shift',
        currentState: match[1],
        symbol: match[2],
        newState: match[3],
      }
    }
  } else if (msg.includes('=r')) {
    // 归约: "Action[4,b]=r3: 用 B->b 归约"
    const match = msg.match(/Action\[(\d+),(.)\]=r(\d+): 用 (.+) 归约/)
    if (match) {
      return {
        type: 'reduce',
        currentState: match[1],
        symbol: match[2],
        ruleNumber: match[3],
        production: match[4],
      }
    }
  } else if (msg.includes('acc')) {
    return { type: 'accept' }
  }
  return { type: 'unknown', message: msg }
}
