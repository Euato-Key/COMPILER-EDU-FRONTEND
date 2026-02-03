/**
 * LL1 Grammar Example Data
 */

export interface GrammarExample {
    name: string
    grammar: string
    description: string
}

export const EXAMPLE_GRAMMARS: GrammarExample[] = [
    {
        name: '基础文法1',
        grammar: 'S->AB\nA->a|ε\nB->b',
        description: '最简单的LL(1)文法示例，适合初学者',
    },
    {
        name: '基础文法2',
        grammar: 'E->TG\nG->+TG|ε\nT->FH\nH->*FH|ε\nF->(E)|i',
        description: '生产算术表达式',
    },
    {
        name: '基础文法3',
        grammar: 'S->AB\nA->aA|ε\nB->bB|c',
        description: '生成a*bc+形式字符串的文法',
    },
]
