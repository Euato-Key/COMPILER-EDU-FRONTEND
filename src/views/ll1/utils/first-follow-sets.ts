/**
 * First and Follow set calculation logic for LL(1) parser
 */

/**
 * 判断是否为非终结符（与后端逻辑保持一致）
 */
export const isNonTerminal = (symbol: string): boolean => {
    return symbol.length === 1 && symbol.toUpperCase() === symbol && symbol !== 'ε'
}

/**
 * 判断是否为终结符（与后端逻辑保持一致）
 */
export const isTerminal = (symbol: string): boolean => {
    return symbol.length === 1 && symbol.toLowerCase() === symbol && symbol !== 'ε'
}

/**
 * 工具函数：判断两个集合是否相等（忽略空格，顺序）
 */
export const areCharacterSetsEqual = (str1: string, str2: string): boolean => {
    const set1 = new Set(str1.replace(/\s+/g, '').split(''))
    const set2 = new Set(str2.replace(/\s+/g, '').split(''))

    if (set1.size !== set2.size) {
        return false
    }

    for (const char of set1) {
        if (!set2.has(char)) {
            return false
        }
    }
    return true
}

/**
 * 获取某个符号的所有产生式
 */
export const getProductionsForSymbol = (symbol: string, formulas_dict: Record<string, string[]>): string[] => {
    const productions = formulas_dict[symbol] || []
    return productions.map(prod => `${symbol}->${prod}`)
}

/**
 * 计算某个符号的First集（递归）
 */
export function calculateFirstSetForSymbol(
    symbol: string,
    formulas_dict: Record<string, string[]>,
    visited: Set<string> = new Set()
): string[] {
    // 防止循环依赖
    if (visited.has(symbol)) {
        return []
    }

    // 如果是终结符，直接返回自身
    if (isTerminal(symbol)) {
        return [symbol]
    }

    // 如果是ε，直接返回ε
    if (symbol === 'ε') {
        return ['ε']
    }

    // 如果是非终结符，计算其First集
    if (isNonTerminal(symbol)) {
        const result: string[] = []
        const productions = formulas_dict[symbol] || []

        // 添加当前符号到已访问集合
        visited.add(symbol)

        for (const production of productions) {
            if (production === 'ε') {
                result.push('ε')
            } else if (production.length === 1) {
                const firstChar = production[0]
                if (isTerminal(firstChar)) {
                    result.push(firstChar)
                } else if (isNonTerminal(firstChar)) {
                    // 递归计算非终结符的First集
                    const subFirstSet = calculateFirstSetForSymbol(firstChar, formulas_dict, new Set(visited))
                    result.push(...subFirstSet)
                } else {
                    // 其他符号（如标点符号、界符等）
                    result.push(firstChar)
                }
            } else {
                // 多字符产生式，需要处理每个字符
                let allEpsilon = true
                for (let i = 0; i < production.length; i++) {
                    const char = production[i]

                    if (isTerminal(char)) {
                        result.push(char)
                        allEpsilon = false
                        break // 遇到终结符就停止
                    } else if (isNonTerminal(char)) {
                        const subFirstSet = calculateFirstSetForSymbol(char, formulas_dict, new Set(visited))
                        const nonEpsilonSymbols = subFirstSet.filter(s => s !== 'ε')
                        result.push(...nonEpsilonSymbols)

                        if (!subFirstSet.includes('ε')) {
                            allEpsilon = false
                            break // 如果这个非终结符的First集不包含ε，就停止
                        }
                    } else {
                        // 其他符号（如标点符号、界符等）
                        result.push(char)
                        allEpsilon = false
                        break // 遇到其他符号就停止
                    }
                }

                if (allEpsilon) {
                    result.push('ε')
                }
            }
        }

        // 去重
        return [...new Set(result)]
    }

    return []
}

/**
 * 计算字符串的First集（用于多字符字符串）
 */
export function calculateStringFirstSet(
    str: string,
    formulas_dict: Record<string, string[]>,
    visited: Set<string> = new Set()
): string[] {
    // 如果是空字符串，返回ε
    if (str === '') {
        return ['ε']
    }

    // 如果是单个字符，直接计算
    if (str.length === 1) {
        return calculateFirstSetForSymbol(str, formulas_dict, visited)
    }

    // 多字符字符串，按顺序处理每个字符
    const result: string[] = []
    let allEpsilon = true

    for (let i = 0; i < str.length; i++) {
        const char = str[i]

        if (isTerminal(char)) {
            result.push(char)
            allEpsilon = false
            break
        } else if (isNonTerminal(char)) {
            const subFirstSet = calculateFirstSetForSymbol(char, formulas_dict, new Set(visited))
            const nonEpsilonSymbols = subFirstSet.filter(s => s !== 'ε')
            result.push(...nonEpsilonSymbols)

            if (!subFirstSet.includes('ε')) {
                allEpsilon = false
                break
            }
        } else {
            result.push(char)
            allEpsilon = false
            break
        }
    }

    if (allEpsilon) {
        result.push('ε')
    }

    return [...new Set(result)]
}

/**
 * 提示功能计算逻辑（First集）
 */
export const calculateFirstSetHint = (symbol: string, formulas_dict: Record<string, string[]>) => {
    const result = {
        symbol,
        steps: [] as Array<{
            type: 'terminal' | 'epsilon' | 'production',
            description: string,
            productions: string[],
            rules: string[],
            symbols: string[],
            finalSymbols: string[] // 最终要飞行的符号
        }>
    }

    // 获取该符号的所有产生式
    const productions = formulas_dict[symbol] || []

    for (const production of productions) {
        if (production === 'ε') {
            // 空串规则
            result.steps.push({
                type: 'epsilon',
                description: `产生式${symbol}→ε：ε ∈ First(${symbol})`,
                productions: [`${symbol}->ε`],
                rules: ['产生式X→ε：ε ∈ First(X)'],
                symbols: ['ε'],
                finalSymbols: ['ε']
            })
        } else if (production.length === 1) {
            const firstChar = production[0]
            if (isTerminal(firstChar)) {
                // 终结符规则
                result.steps.push({
                    type: 'terminal',
                    description: `终结符${firstChar}：First(${firstChar}) = {${firstChar}}`,
                    productions: [`${symbol}->${firstChar}`],
                    rules: ['终结符X：First(X) = {X}'],
                    symbols: [firstChar],
                    finalSymbols: [firstChar]
                })
            } else if (isNonTerminal(firstChar)) {
                // 非终结符规则 - 需要递归计算
                const firstSetOfFirstChar = calculateFirstSetForSymbol(firstChar, formulas_dict)
                if (firstSetOfFirstChar.length > 0) {
                    result.steps.push({
                        type: 'production',
                        description: `产生式${symbol}→${firstChar}：First(${firstChar})中非ε符号 ∈ First(${symbol})`,
                        productions: [`${symbol}->${firstChar}`, ...getProductionsForSymbol(firstChar, formulas_dict)],
                        rules: ['产生式X→Y₁Y₂...Yₖ：First(Y₁)中非ε符号 ∈ First(X)'],
                        symbols: [firstChar, ...firstSetOfFirstChar],
                        finalSymbols: firstSetOfFirstChar.filter(s => s !== 'ε')
                    })
                }
            } else {
                // 其他符号（如标点符号、界符等）
                result.steps.push({
                    type: 'terminal',
                    description: `其他符号${firstChar}：First(${firstChar}) = {${firstChar}}`,
                    productions: [`${symbol}->${firstChar}`],
                    rules: ['终结符X：First(X) = {X}'],
                    symbols: [firstChar],
                    finalSymbols: [firstChar]
                })
            }
        } else {
            // 多字符产生式 - 需要处理所有可能的推导路径
            const derivationPaths = calculateDerivationPaths(symbol, production, formulas_dict)
            result.steps.push(...derivationPaths)
        }
    }

    return result
}

/**
 * 计算多字符产生式的所有推导路径
 */
export const calculateDerivationPaths = (symbol: string, production: string, formulas_dict: Record<string, string[]>) => {
    const paths: Array<{
        type: 'terminal' | 'epsilon' | 'production',
        description: string,
        productions: string[],
        rules: string[],
        symbols: string[],
        finalSymbols: string[]
    }> = []

    // 分析每个位置的字符
    for (let i = 0; i < production.length; i++) {
        const char = production[i]

        if (isTerminal(char)) {
            // 终结符 - 直接添加
            paths.push({
                type: 'terminal',
                description: `产生式${symbol}→${production}：位置${i + 1}的终结符${char} ∈ First(${symbol})`,
                productions: [`${symbol}->${production}`],
                rules: ['终结符X：First(X) = {X}'],
                symbols: [char],
                finalSymbols: [char]
            })
            break // 遇到终结符就停止
        } else if (isNonTerminal(char)) {
            // 非终结符 - 计算其First集
            const firstSetOfChar = calculateFirstSetForSymbol(char, formulas_dict)
            const nonEpsilonSymbols = firstSetOfChar.filter(s => s !== 'ε')

            if (nonEpsilonSymbols.length > 0) {
                // 添加非ε符号的推导路径
                paths.push({
                    type: 'production',
                    description: `产生式${symbol}→${production}：位置${i + 1}的First(${char})中非ε符号 ∈ First(${symbol})`,
                    productions: [`${symbol}->${production}`, ...getProductionsForSymbol(char, formulas_dict)],
                    rules: ['产生式X→Y₁Y₂...Yₖ：First(Y₁)中非ε符号 ∈ First(X)'],
                    symbols: [char, ...firstSetOfChar],
                    finalSymbols: nonEpsilonSymbols
                })
            }

            // 如果这个非终结符的First集不包含ε，就停止
            if (!firstSetOfChar.includes('ε')) {
                break
            }
        } else {
            // 其他符号（如标点符号、界符等）
            paths.push({
                type: 'terminal',
                description: `产生式${symbol}→${production}：位置${i + 1}的其他符号${char} ∈ First(${symbol})`,
                productions: [`${symbol}->${production}`],
                rules: ['终结符X：First(X) = {X}'],
                symbols: [char],
                finalSymbols: [char]
            })
            break // 遇到其他符号就停止
        }
    }

    return paths
}

/**
 * Follow集提示功能
 */
export const calculateFollowSetHint = (
    symbol: string,
    originalData: { S: string, formulas_dict: Record<string, string[]>, follow: Record<string, string[]> }
) => {
    const result = {
        symbol,
        steps: [] as Array<{
            type: 'start' | 'production' | 'inclusion',
            description: string,
            productions: string[],
            rules: string[],
            symbols: string[],
            finalSymbols: string[],
            firstSetSymbols?: string[] // 用于First集高亮
        }>
    }

    const { S, formulas_dict, follow } = originalData

    // 规则1：开始符号S：# ∈ Follow(S)
    if (symbol === S) {
        result.steps.push({
            type: 'start',
            description: `开始符号${symbol}：# ∈ Follow(${symbol})`,
            productions: [],
            rules: ['开始符号S：# ∈ Follow(S)'],
            symbols: ['#'],
            finalSymbols: ['#']
        })
    }

    // 规则2：产生式A→αBβ：First(β)中非ε符号 ∈ Follow(B)
    // 规则3：产生式A→αB或A→αBβ且ε∈First(β) ：Follow(A) ⊆ Follow(B)
    for (const [leftSymbol, rightParts] of Object.entries(formulas_dict)) {
        for (const rightPart of rightParts) {
            // 查找产生式中包含目标符号的位置
            for (let i = 0; i < rightPart.length; i++) {
                if (rightPart[i] === symbol) {
                    // 检查是否是规则2：A→αBβ
                    if (i < rightPart.length - 1) {
                        const beta = rightPart.substring(i + 1)
                        // 对于多字符的β，需要计算其First集
                        const firstSetOfBeta = calculateStringFirstSet(beta, formulas_dict)

                        const nonEpsilonSymbols = firstSetOfBeta.filter(s => s !== 'ε')

                        if (nonEpsilonSymbols.length > 0) {
                            result.steps.push({
                                type: 'production',
                                description: `产生式${leftSymbol}→${rightPart}：First(${beta})中非ε符号 ∈ Follow(${symbol})`,
                                productions: [`${leftSymbol}->${rightPart}`],
                                rules: ['产生式A→αBβ：First(β)中非ε符号 ∈ Follow(B)'],
                                symbols: [leftSymbol, symbol, ...firstSetOfBeta],
                                finalSymbols: nonEpsilonSymbols,
                                firstSetSymbols: firstSetOfBeta
                            })
                        }
                    }

                    // 检查是否是规则3：A→αB或A→αBβ且ε∈First(β)
                    if (i === rightPart.length - 1) {
                        // A→αB 的情况
                        result.steps.push({
                            type: 'inclusion',
                            description: `产生式${leftSymbol}→${rightPart}：Follow(${leftSymbol}) ⊆ Follow(${symbol})`,
                            productions: [`${leftSymbol}->${rightPart}`],
                            rules: ['产生式A→αB或A→αBβ且ε∈First(β)：Follow(A) ⊆ Follow(B)'],
                            symbols: [leftSymbol, symbol],
                            finalSymbols: follow[leftSymbol] || []
                        })
                    } else {
                        // A→αBβ 的情况，需要检查ε∈First(β)
                        const beta = rightPart.substring(i + 1)
                        const firstSetOfBeta = calculateStringFirstSet(beta, formulas_dict)

                        if (firstSetOfBeta.includes('ε')) {
                            result.steps.push({
                                type: 'inclusion',
                                description: `产生式${leftSymbol}→${rightPart}：ε∈First(${beta})，Follow(${leftSymbol}) ⊆ Follow(${symbol})`,
                                productions: [`${leftSymbol}->${rightPart}`],
                                rules: ['产生式A→αB或A→αBβ且ε∈First(β)：Follow(A) ⊆ Follow(B)'],
                                symbols: [leftSymbol, symbol, ...firstSetOfBeta],
                                finalSymbols: follow[leftSymbol] || []
                            })
                        }
                    }
                }
            }
        }
    }

    return result
}
