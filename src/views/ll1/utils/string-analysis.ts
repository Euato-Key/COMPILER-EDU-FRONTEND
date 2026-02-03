/**
 * LL(1) 字符串分析工具函数
 */

/**
 * 初始化分析步骤
 * @param startSymbol 起始符号
 * @param initialInput 初始输入串 (已包含结束符#)
 */
export const initAnalysisSteps = (startSymbol: string, initialInput: string) => {
    return [{ stack: '#' + startSymbol, input: initialInput }]
}

/**
 * 执行推导操作
 * @param currentStack 当前栈字符串
 * @param nonTerminal 要替换的非终结符 (栈顶)
 * @param production 产生式右部
 */
export const performDeduction = (currentStack: string, nonTerminal: string, production: string): string => {
    const stackArr = currentStack.split('')
    const top = stackArr.pop()

    if (top !== nonTerminal) {
        throw new Error(`当前栈顶符号是 "${top}"，但尝试推导 "${nonTerminal}"`)
    }

    if (production !== 'ε') {
        for (let i = production.length - 1; i >= 0; i--) {
            stackArr.push(production[i])
        }
    }

    return stackArr.join('')
}

/**
 * 执行匹配操作
 * @param currentStack 当前栈字符串
 * @param currentInput 当前输入串
 */
export const performMatch = (currentStack: string, currentInput: string): { stack: string; input: string } | null => {
    const stackArr = currentStack.split('')
    const inputArr = currentInput.split('')

    const top = stackArr[stackArr.length - 1]
    const cur = inputArr[0]

    if (top === cur) {
        stackArr.pop()
        inputArr.shift()
        return {
            stack: stackArr.join(''),
            input: inputArr.join('')
        }
    }

    return null
}

/**
 * 获取提示信息
 * @param stack 当前栈
 * @param input 当前输入
 * @param table LL1分析表
 */
export const getAnalysisHint = (
    stack: string,
    input: string,
    table: Record<string, string>
): { type: 'match' | 'll1' | 'error' | 'complete'; data?: any } => {
    if (stack === '#' && input === '#') {
        return { type: 'complete' }
    }

    const stackArr = stack.split('')
    const inputArr = input.split('')
    const top = stackArr[stackArr.length - 1]
    const cur = inputArr[0]

    // 匹配情形
    if (top === cur) {
        return { type: 'match', data: { symbol: top } }
    }

    // LL1表推导情形
    const prod = table[top + '|' + cur]
    if (prod) {
        return { type: 'll1', data: { row: top, col: cur, production: prod } }
    }

    return { type: 'error' }
}

/**
 * 验证用户分析步骤
 * @param userSteps 用户步骤
 * @param standardResult 标准结果
 */
export const validateUserAnalysis = (
    userSteps: { stack: string; input: string }[],
    standardResult: any
): { valid: boolean; errorIndex: number; message: string } => {
    if (!standardResult || !standardResult.info_stack || !standardResult.info_str) {
        return { valid: false, errorIndex: -1, message: '无法获取标准答案进行验证' }
    }

    const standardStacks = standardResult.info_stack
    const standardInputs = standardResult.info_str

    for (let i = 0; i < userSteps.length; i++) {
        const userStep = userSteps[i]

        // 检查是否超出标准答案长度
        if (i >= standardStacks.length) {
            return {
                valid: false,
                errorIndex: i,
                message: `步骤 ${i + 1} 超出标准答案范围，您的分析步骤过多。`
            }
        }

        const stdStack = standardStacks[i]
        const stdInput = standardInputs[i]

        if (userStep.stack !== stdStack) {
            return {
                valid: false,
                errorIndex: i,
                message: `步骤 ${i + 1} 栈内容错误。您的栈: "${userStep.stack}"，正确应为: "${stdStack}"`
            }
        }

        if (userStep.input !== stdInput) {
            return {
                valid: false,
                errorIndex: i,
                message: `步骤 ${i + 1} 输入串内容错误。您的输入: "${userStep.input}"，正确应为: "${stdInput}"`
            }
        }
    }

    // 检查是否步骤太少
    if (userSteps.length < standardStacks.length) {
        return {
            valid: true, // 目前为止是正确的，但未完成
            errorIndex: -1,
            message: '当前步骤正确，但这并不是完整的分析过程，请继续分析。'
        }
    }

    return { valid: true, errorIndex: -1, message: '验证通过！您的分析过程完全正确。' }
}
