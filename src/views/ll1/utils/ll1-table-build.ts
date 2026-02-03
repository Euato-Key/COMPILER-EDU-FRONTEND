/**
 * LL1 Table Build calculation logic
 */

import { calculateStringFirstSet } from './first-follow-sets'

export interface TableEntry {
    nonTerminal: string
    terminal: string
    production: string
}

export interface TableHintStep {
    type: 'first' | 'follow'
    description: string
    productions: string[]
    rules: string[]
    symbols: string[]
    tableEntries: TableEntry[]
}

export interface TableHint {
    steps: TableHintStep[]
}

/**
 * 计算产生式的First集 (使用已有的First集数据)
 */
export const calculateFirstSetForProduction = (
    production: string,
    originalData: { Vn: string[], Vt: string[], first: Record<string, string[]> }
): string[] => {
    const result = new Set<string>()

    // 如果产生式为空，返回ε
    if (production === 'ε' || !production) {
        result.add('ε')
        return Array.from(result)
    }

    // 处理产生式的第一个符号
    const firstChar = production[0]

    // 如果是终结符
    if (originalData.Vt.includes(firstChar)) {
        result.add(firstChar)
        return Array.from(result)
    }

    // 如果是非终结符
    if (originalData.Vn.includes(firstChar)) {
        const firstSet = originalData.first[firstChar] || []
        for (const symbol of firstSet) {
            if (symbol === 'ε') {
                // 如果包含ε，需要继续处理后续符号
                if (production.length > 1) {
                    const remainingProduction = production.substring(1)
                    const remainingFirstSet = calculateFirstSetForProduction(remainingProduction, originalData)
                    for (const remainingSymbol of remainingFirstSet) {
                        result.add(remainingSymbol)
                    }
                } else {
                    result.add('ε')
                }
            } else {
                result.add(symbol)
            }
        }
    } else {
        // 其他符号视为终结符
        result.add(firstChar)
    }

    return Array.from(result)
}

/**
 * 计算LL1表格提示
 */
export const calculateTableHint = (originalData: any): TableHint | null => {
    if (!originalData) return null

    const result: TableHint = {
        steps: []
    }

    // 遍历所有产生式
    for (const [nonTerminal, rightParts] of Object.entries(originalData.formulas_dict as Record<string, string[]>)) {
        for (const rightPart of rightParts) {
            const production = `${nonTerminal}->${rightPart}`

            // 计算First(α)
            const firstSet = calculateFirstSetForProduction(rightPart, originalData)

            // 规则1：对于First(α)中的每个终结符a，将A->α加入到M[A, a]
            const terminals = firstSet.filter(s => s !== 'ε')
            if (terminals.length > 0) {
                result.steps.push({
                    type: 'first',
                    description: `产生式${production}：First(${rightPart})中终结符 ∈ M[${nonTerminal}, a]`,
                    productions: [production],
                    rules: ['对每个终结符a ∈ First(A)，将A->α加入到M[A, a]'],
                    symbols: [...terminals, nonTerminal],
                    tableEntries: terminals.map(terminal => ({
                        nonTerminal,
                        terminal,
                        production
                    }))
                })
            }

            // 规则2：如果ε ∈ First(α)，对于Follow(A)中的每个终结符b，将A->α加入到M[A, b]
            if (firstSet.includes('ε')) {
                const followSet = originalData.follow[nonTerminal] || []
                if (followSet.length > 0) {
                    result.steps.push({
                        type: 'follow',
                        description: `产生式${production}：ε ∈ First(${rightPart})，Follow(${nonTerminal})中终结符 ∈ M[${nonTerminal}, b]`,
                        productions: [production],
                        rules: ['如果ε ∈ First(A)，对于Follow(A)中的每个终结符b，将A->ε加入到M[A, b]'],
                        symbols: [...followSet, nonTerminal, 'ε'],
                        tableEntries: followSet.map(terminal => ({
                            nonTerminal,
                            terminal,
                            production
                        }))
                    })
                }
            }
        }
    }

    return result
}

/**
 * 获取正确表格项
 */
export const getCorrectTableEntry = (
    nonTerminal: string,
    terminal: string,
    tableData: Record<string, string>
): string => {
    if (!tableData) return ''

    // 后端使用 | 作为分隔符
    const key = `${nonTerminal}|${terminal}`
    const rawValue = tableData[key] || ''

    // 如果后端返回的是产生式的右部（如 "AB"），需要转换为产生式格式（如 "S->AB"）
    if (rawValue && !rawValue.includes('->')) {
        return `${nonTerminal}->${rawValue}`
    }

    return rawValue
}

/**
 * 校验表格单元格
 */
export const validateTableCell = (
    userValue: string,
    correctValue: string,
    nonTerminal: string
): 'correct' | 'incorrect' | '' => {
    // 如果用户输入为空，不进行校验
    if (!userValue || !userValue.trim()) {
        return ''
    }

    // 检查这个单元格是否应该填写内容
    const shouldHaveContent = correctValue && correctValue.trim() !== ''

    // 如果这个单元格不应该有内容，但用户输入了内容，则标记为错误
    if (!shouldHaveContent) {
        return 'incorrect'
    }

    // 标准化用户输入和正确答案进行比较
    const normalizedUserInput = userValue.trim()
    const normalizedCorrectValue = correctValue.trim()

    // 检查用户输入是否匹配正确答案（支持多种格式）
    const isCorrect = normalizedUserInput === normalizedCorrectValue ||
        normalizedUserInput === correctValue.replace('->', '') ||
        normalizedUserInput === `${nonTerminal}->${correctValue.replace('->', '')}`

    return isCorrect ? 'correct' : 'incorrect'
}
