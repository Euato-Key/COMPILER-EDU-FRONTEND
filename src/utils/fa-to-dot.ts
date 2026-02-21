/**
 * 将 Vue Flow 的节点和边转换为 Graphviz DOT 格式字符串
 * @param nodes Vue Flow 节点数组
 * @param edges Vue Flow 边数组
 * @returns Graphviz DOT 字符串
 */
export function faToDot(nodes: any[], edges: any[]): string {
    let dot = 'digraph FA {\n'
    dot += '  rankdir=LR;\n'
    dot += '  node [fontname="Arial", fontsize=12];\n'
    dot += '  edge [fontname="Arial", fontsize=10];\n'

    // 记录已经生成的节点，防止重复
    const processedNodes = new Set<string>()

    // 1. 预处理：映射节点 ID 到显示文本
    const idToLabel = new Map<string, string>()
    nodes.forEach((node) => {
        idToLabel.set(node.id, node.data?.text || node.id)
    })

    // 2. 处理节点定义
    nodes.forEach((node) => {
        const label = idToLabel.get(node.id) || node.id
        const isInitial = node.data?.isInitial
        const isFinal = node.data?.isFinal

        const attributes: string[] = []

        // 形状：终态使用双圈
        if (isFinal) {
            attributes.push('shape=doublecircle')
        } else {
            attributes.push('shape=circle')
        }

        // 样式点缀
        attributes.push('style=filled')
        attributes.push('fillcolor="#ffffff"')
        attributes.push('color="#34495e"')

        dot += `  "${label}" [${attributes.join(', ')}];\n`
        processedNodes.add(label)

        // 初态逻辑：在 DOT 中通常通过一个无名点指向初态来表示
        if (isInitial) {
            dot += `  "start_${node.id}" [shape=point, width=0, style=invis];\n`
            dot += `  "start_${node.id}" -> "${label}" [color="#34495e"];\n`
        }
    })

    // 3. 处理边/转换
    edges.forEach((edge) => {
        const sourceLabel = idToLabel.get(edge.source)
        const targetLabel = idToLabel.get(edge.target)

        if (sourceLabel && targetLabel) {
            const edgeLabel = edge.data?.text || ''

            // 转义双引号以免破坏 DOT 语法
            const escapedLabel = edgeLabel.replace(/"/g, '\\"')

            dot += `  "${sourceLabel}" -> "${targetLabel}" [label="${escapedLabel}", color="#2c3e50", fontcolor="#2c3e50"];\n`
        }
    })

    dot += '}'
    return dot
}

/**
 * 将 FA 分析结果中的 dot 字符串进行增强（美化颜色等）
 * @param dotString 原始 dot 字符串
 * @returns 增强后的 dot 字符串
 */
export function enhanceDotString(dotString: string): string {
    if (!dotString) return ''

    let enhanced = dotString

    // 如果没有定义 rankdir，添加它
    if (!enhanced.includes('rankdir')) {
        enhanced = enhanced.replace('{', '{\n  rankdir=LR;')
    }

    // 添加全局样式
    const globalStyles = `
  node [fontname="Arial", fontsize=12, shape=circle, style=filled, fillcolor="#ffffff", color="#34495e"];
  edge [fontname="Arial", fontsize=10, color="#2c3e50", fontcolor="#2c3e50"];
`
    enhanced = enhanced.replace('{', '{\n' + globalStyles)

    return enhanced
}
