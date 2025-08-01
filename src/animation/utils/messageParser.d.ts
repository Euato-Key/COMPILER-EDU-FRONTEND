// 消息解析器类型声明
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

export declare function parseLL1Message(msg: string): ParsedLL1Message
export declare function parseLRMessage(msg: string): ParsedLRMessage
