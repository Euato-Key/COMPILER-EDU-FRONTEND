import request from '@/lib/request'
import type { ApiResponse } from '@/types/common'
import type { LL1AnalysisResult, AnalysisStepInfo } from '@/types/ll1'

/**
 * LL1语法分析
 * @param inpProductions 产生式数组
 * @returns LL1分析结果
 */
export const getLL1AnalyseAPI = (inpProductions: string[]) => {
  return request.post<ApiResponse<LL1AnalysisResult>>('/api/LL1Analyse', { inpProductions })
}

/**
 * LL1语法分析输入串
 * @param inpProductions 产生式数组
 * @param inpStr 输入串
 * @returns LL1分析输入串结果
 */
export const LL1AnalyseInpStrAPI = (inpProductions: string[], inpStr: string) => {
  return request.post<ApiResponse<AnalysisStepInfo>>('/api/LL1AnalyseInp', { inpProductions, inpStr })
}
