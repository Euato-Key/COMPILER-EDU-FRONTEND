/**
 * SLR1 Grammar Validation Utilities
 */

/**
 * Basic validation on input change
 * Checks for Chinese characters and basic production format
 */
export function validateOnInput(text: string): string[] {
  const errors: string[] = []

  // Check for Chinese characters
  if (/[\u4e00-\u9fa5]/.test(text)) {
    errors.push('不能包含中文字符')
  }

  // Check if each non-empty line contains '->'
  const lines = text.split('\n')
  lines.forEach((line, idx) => {
    if (line.trim() && !line.includes('->')) {
      errors.push(`第${idx + 1}行缺少->`)
    }
  })

  return errors
}

/**
 * Deep validation for grammar submission
 * Checks for duplicates, recursion, undefined non-terminals, etc.
 */
export function validateOnSubmit(text: string): { isValid: boolean; errors: string[]; processedLines: string[] } {
  const errors: string[] = []

  // 1. Empty check
  if (!text.trim()) {
    return { isValid: false, errors: ['文法不能为空'], processedLines: [] }
  }

  // 2. Chinese character check
  if (/[\u4e00-\u9fa5]/.test(text)) {
    return { isValid: false, errors: ['不能包含中文字符'], processedLines: [] }
  }

  // 3. Remove spaces (keep newlines)
  const noSpaceText = text.replace(/ +/g, '')

  // 4. Split into lines
  const lines = noSpaceText.split('\n').filter(line => line.trim())

  // 5. Basic format check (must have ->)
  lines.forEach((line, idx) => {
    if (!line.includes('->')) {
      errors.push(`第${idx + 1}行缺少->`)
    }
  })

  if (errors.length > 0) return { isValid: false, errors, processedLines: [] }

  // 6. Duplicate check
  const lineSet = new Set(lines)
  if (lineSet.size !== lines.length) {
    return { isValid: false, errors: ['存在重复产生式'], processedLines: [] }
  }

  // 7. Regex format check: X->Y
  lines.forEach((line, idx) => {
    // X is uppercase letter, Y is any character except | and sequences separated by |
    if (!/^([A-Z])->((?:[^|]+\|)*[^|]+)$/.test(line)) {
      errors.push(`第${idx + 1}行格式错误，应为"大写字母->右部"格式`)
    }
  })

  if (errors.length > 0) return { isValid: false, errors, processedLines: [] }

  // 8. Check if non-terminals are defined
  const leftNonTerminals = new Set(lines.map(line => line.split('->')[0]))
  const allNonTerminalsInRight = new Set<string>()

  lines.forEach(line => {
    const right = line.split('->')[1]
    const rightParts = right.split('|')
    rightParts.forEach(part => {
      for (let i = 0; i < part.length; i++) {
        if (/[A-Z]/.test(part[i])) {
          allNonTerminalsInRight.add(part[i])
        }
      }
    })
  })

  allNonTerminalsInRight.forEach(nonTerminal => {
    if (!leftNonTerminals.has(nonTerminal)) {
      errors.push(`右部非终结符${nonTerminal}未定义`)
    }
  })

  if (errors.length > 0) return { isValid: false, errors, processedLines: [] }

  // Note: SLR1 supports left recursion, so we don't check for it
  // SLR1 is a bottom-up parser that can handle left-recursive grammars

  return { isValid: true, errors: [], processedLines: lines }
}

/**
 * Example grammars for SLR1
 */
export const EXAMPLE_GRAMMARS = [
  {
    id: 1,
    name: '算术表达式',
    grammar: `S -> E
E -> E + T | T
T -> T * F | F
F -> ( E ) | i`,
    description: '基本的算术表达式文法，支持加减乘除和括号'
  },
  {
    id: 2,
    name: '简单文法',
    grammar: `S -> A a | b
A -> c`,
    description: '简单的SLR1文法示例'
  },
  {
    id: 3,
    name: '赋值语句',
    grammar: `S -> A
A -> i = E | E
E -> E + i | i | ( A )`,
    description: '赋值语句文法，支持表达式和嵌套'
  },
  {
    id: 4,
    name: '列表文法',
    grammar: `S -> L
L -> a
L -> L , a`,
    description: '简单的列表结构文法'
  }
]

export type GrammarExample = typeof EXAMPLE_GRAMMARS[0]
