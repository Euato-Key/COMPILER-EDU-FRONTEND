<template>
  <div class="string-analysis-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:play-circle" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">字符串分析</h2>
          <p class="text-gray-600 mt-1">第四步：使用LL1分析表分析输入字符串</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <div class="max-w-6xl mx-auto">
        <!-- 当前文法分析结果 -->
        <div v-if="originalData"
          class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 shadow-xl mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:zap" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4
                  class="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  当前文法分析结果
                </h4>
                <p class="text-xs text-gray-600 mt-0.5">LL(1)文法分析完成</p>
              </div>
            </div>
            <div
              class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg">
              <Icon icon="lucide:check-circle" class="w-3 h-3 text-white" />
              <span class="text-xs font-semibold text-white">LL(1)文法</span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 左侧统计信息 -->
            <div class="lg:col-span-1 flex flex-col">
              <div class="grid grid-cols-2 gap-4 flex-1">
                <div
                  class="bg-white rounded-lg p-4 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col justify-center">
                  <div class="flex items-center gap-2 mb-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:play" class="w-4 h-4 text-white" />
                    </div>
                    <span class="text-sm font-semibold text-gray-800">起始符号</span>
                  </div>
                  <p
                    class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-mono">
                    {{ originalData.S }}</p>
                </div>

                <div
                  class="bg-white rounded-lg p-4 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col justify-center">
                  <div class="flex items-center gap-2 mb-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:tag" class="w-4 h-4 text-white" />
                    </div>
                    <span class="text-sm font-semibold text-gray-800">非终结符</span>
                  </div>
                  <p
                    class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-mono">
                    {{ originalData.Vn.length }}</p>
                  <p class="text-xs text-gray-600 mt-1 font-mono">{{ originalData.Vn.join(', ') }}</p>
                </div>

                <div
                  class="bg-white rounded-lg p-4 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col justify-center">
                  <div class="flex items-center gap-2 mb-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:hash" class="w-4 h-4 text-white" />
                    </div>
                    <span class="text-sm font-semibold text-gray-800">终结符</span>
                  </div>
                  <p
                    class="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-mono">
                    {{ originalData.Vt.length }}</p>
                  <p class="text-xs text-gray-600 mt-1 font-mono">{{ originalData.Vt.join(', ') }}</p>
                </div>

                <div
                  class="bg-white rounded-lg p-4 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col justify-center">
                  <div class="flex items-center gap-2 mb-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:list" class="w-4 h-4 text-white" />
                    </div>
                    <span class="text-sm font-semibold text-gray-800">产生式数</span>
                  </div>
                  <p
                    class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent font-mono">
                    {{ Object.keys(originalData.formulas_dict).length }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 右侧文法信息 -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg border-2 border-blue-200 p-4 shadow-lg h-full flex flex-col">
                <div class="flex items-center gap-2 mb-4">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Icon icon="lucide:file-text" class="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5
                      class="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      文法信息
                    </h5>
                    <p class="text-xs text-gray-500">Grammar Information</p>
                  </div>
                </div>
                <div class="space-y-1.5 flex-1">
                  <div v-for="(productions, nonTerminal) in originalData.formulas_dict" :key="nonTerminal"
                    class="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-md border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-200">
                    <span
                      class="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-mono">{{
                      nonTerminal }}</span>
                    <span class="text-gray-400 font-mono text-sm">→</span>
                    <span class="font-mono text-gray-700 text-xs flex-1">{{ productions.join(' | ') }}</span>
                  </div>
                </div>

                <!-- 当前输入串信息 -->
                <div v-if="inputString && inputAnalysisResult" class="mt-4 pt-4 border-t border-gray-200">
                  <div class="flex items-center gap-2 mb-3">
                    <div
                      class="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:play" class="w-3 h-3 text-white" />
                    </div>
                    <h6
                      class="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      当前输入串分析结果
                    </h6>
                  </div>
                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                    <!-- 输入串显示 -->
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-medium text-gray-600">输入串：</span>
                        <span class="text-sm font-mono text-green-700 bg-white px-2 py-1 rounded border">{{ inputString
                          }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon
                          :icon="inputAnalysisResult.info_res === 'Success!' ? 'lucide:check-circle' : 'lucide:x-circle'"
                          class="w-4 h-4"
                          :class="inputAnalysisResult.info_res === 'Success!' ? 'text-green-600' : 'text-red-600'" />
                        <span class="text-xs font-semibold px-2 py-1 rounded-full"
                          :class="inputAnalysisResult.info_res === 'Success!' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                          {{ inputAnalysisResult.info_res === 'Success!' ? '分析成功' : '分析失败' }}
                        </span>
                      </div>
                    </div>

                    <!-- 分析详情 -->
                    <div class="space-y-2">
                      <div class="flex items-center justify-between text-xs">
                        <span class="text-gray-600">分析步骤：</span>
                        <span class="font-mono font-medium text-gray-800">{{ inputAnalysisResult.info_step.length }}
                          步</span>
                      </div>
                      <div class="flex items-center justify-between text-xs">
                        <span class="text-gray-600">最终结果：</span>
                        <span class="font-mono font-medium"
                          :class="inputAnalysisResult.info_res === 'Success!' ? 'text-green-700' : 'text-red-700'">
                          {{ inputAnalysisResult.info_res }}
                        </span>
                      </div>
                      <div v-if="inputAnalysisResult.info_res !== 'Success!'"
                        class="flex items-center justify-between text-xs">
                        <span class="text-gray-600">错误信息：</span>
                        <span class="font-mono font-medium text-red-700 max-w-32 truncate"
                          :title="inputAnalysisResult.info_res">
                          {{ inputAnalysisResult.info_res }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入串分析区域 -->
        <div v-if="originalData"
          class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl shadow-lg border border-green-100 p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:play-circle" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3
                  class="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  输入串分析
                </h3>
                <p class="text-sm text-gray-600 mt-1">使用LL1分析表分析输入字符串</p>
              </div>
            </div>
            <div class="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
              <Icon icon="lucide:info" class="w-3 h-3 text-green-600" />
              <span class="text-xs font-medium text-green-700">自动添加结束符#</span>
            </div>
          </div>

          <div class="space-y-6">
            <!-- 输入区域 -->
            <div class="bg-white rounded-lg border border-green-200 p-4 shadow-sm">
              <label class="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Icon icon="lucide:keyboard" class="w-4 h-4 text-green-500" />
                字符串输入
                <span class="text-xs font-normal text-gray-500 ml-2">(结束符 # 会自动添加)</span>
              </label>
              <div class="flex gap-4">
                <input v-model="inputString" type="text" placeholder="例如: ab (不需要输入结束符#)"
                  class="flex-1 px-4 py-3 border-2 border-green-200 rounded-lg focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all duration-200 font-mono text-sm"
                  @keyup.enter="analyzeString" />
                <button @click="analyzeString" :disabled="!inputString.trim() || analyzing"
                  class="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Icon v-if="analyzing" icon="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
                  {{ analyzing ? '分析中...' : '开始分析' }}
                </button>
                <button @click="resetAnalysis"
                  class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold">
                  重置
                </button>
              </div>
              <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-start gap-2 text-sm text-blue-700">
                  <Icon icon="lucide:lightbulb" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-medium mb-1">💡 分析提示</p>
                    <p class="text-sm">• 输入的字符串末尾会自动添加结束符 # 进行LL1分析</p>
                    <p class="text-sm">• 系统会根据LL1分析表逐步分析字符串的推导过程</p>
                    <p class="text-sm">• 分析结果将显示详细的栈操作和推导步骤</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 示例字符串 -->
            <div class="bg-white rounded-lg border border-green-200 p-4 shadow-sm">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="lucide:list" class="w-4 h-4 text-green-500" />
                <span class="text-sm font-semibold text-gray-800">示例字符串</span>
                <span class="text-xs text-gray-500">(点击使用)</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button v-for="example in exampleStrings" :key="example" @click="inputString = example"
                  class="px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200 hover:border-gray-300 font-mono">
                  {{ example }}
                </button>
              </div>
            </div>


          </div>
        </div>

        <!-- LL1分析表和答题区域 -->
        <div v-if="originalData?.table && inputString && inputAnalysisResult"
          class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 左侧：LL1分析表 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="lucide:table" class="w-5 h-5 mr-2 text-blue-600" />
              LL1 分析表
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-300">
                <thead class="bg-blue-50">
                  <tr>
                    <th class="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700">
                      非终结符
                    </th>
                    <th v-for="terminal in VtAll" :key="terminal"
                      class="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                      {{ terminal }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white">
                  <tr v-for="nonTerminal in originalData.Vn" :key="nonTerminal">
                    <td class="border border-gray-300 px-3 py-2 font-mono font-semibold text-blue-700">
                      {{ nonTerminal }}
                    </td>
                    <td v-for="terminal in VtAll" :key="`${nonTerminal}-${terminal}`"
                      :data-table-cell="`${nonTerminal}|${terminal}`"
                      class="border border-gray-300 px-3 py-2 text-center text-xs font-mono transition-colors" :class="{
                        'cursor-pointer hover:bg-blue-50': !isAnalysisComplete,
                        'cursor-not-allowed opacity-50': isAnalysisComplete,
                        'bg-yellow-100 ring-2 ring-yellow-400': hintActive && hintRow === nonTerminal && hintCol === terminal
                      }" @dblclick="onLL1CellDblClick(nonTerminal, terminal)">
                      <span v-if="originalData?.table && originalData.table[`${nonTerminal}|${terminal}`]"
                        class="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded border">
                        {{ nonTerminal }}->{{ originalData.table[`${nonTerminal}|${terminal}`] }}
                      </span>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start gap-2 text-sm text-blue-700">
                <Icon icon="lucide:info" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="font-medium mb-1">💡 操作提示</p>
                  <p class="text-sm">• <span class="font-bold">双击</span>表格中的产生式可进行推导操作</p>
                  <p class="text-sm">• 根据当前分析栈栈顶符号和输入串首字符选择正确的操作</p>
                </div>
              </div>
            </div>

            <!-- 符号卡片显示 -->
            <div class="mt-4 grid grid-cols-2 gap-4">
              <!-- 非终结符卡片 -->
              <div
                class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-4 shadow-sm">
                <div class="flex items-center gap-2 mb-3">
                  <div
                    class="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Icon icon="lucide:tag" class="w-3 h-3 text-white" />
                  </div>
                  <span class="text-sm font-semibold text-purple-800">非终结符 Vn</span>
                </div>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span v-for="nonTerminal in originalData.Vn" :key="nonTerminal" :data-symbol="nonTerminal"
                    class="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-mono font-semibold border border-purple-200 shadow-sm">
                    {{ nonTerminal }}
                  </span>
                </div>
              </div>

              <!-- 终结符卡片 -->
              <div
                class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-4 shadow-sm">
                <div class="flex items-center gap-2 mb-3">
                  <div
                    class="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Icon icon="lucide:hash" class="w-3 h-3 text-white" />
                  </div>
                  <span class="text-sm font-semibold text-green-800">终结符 Vt</span>
                </div>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span v-for="terminal in originalData.Vt" :key="terminal" :data-symbol="terminal"
                    class="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-mono font-semibold border border-green-200 shadow-sm">
                    {{ terminal }}
                  </span>
                  <!-- 结束符 # -->
                  <span data-symbol="#"
                    class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-mono font-semibold border border-blue-200 shadow-sm">
                    #
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：答题区域 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="mb-4">
              <div
                class="bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-3 flex items-start gap-2 text-yellow-800 text-sm">
                <Icon icon="lucide:info" class="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-500" />
                <div>
                  <div class="font-bold mb-1">操作指引：</div>
                  <ul class="list-disc list-inside space-y-1">
                    <li>若栈顶为非终结符，双击左侧 LL1 分析表对应单元格进行推导。</li>
                    <li>若栈顶与输入串首字符相同，点击 <span class="font-bold text-green-700">匹配</span> 按钮。</li>
                    <li>如操作失误可点击 <span class="font-bold text-gray-700">回退</span>，重新开始可点 <span
                        class="font-bold text-gray-700">重做</span>。</li>
                    <li>遇到不会做时可点击 <span class="font-bold text-yellow-700">提示</span>，系统会高亮推荐操作。</li>
                    <li>点击 <span class="font-bold text-blue-700">查看答案</span> 可显示完整标准分析过程。</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-4">输入串分析表（答题区）</h3>

            <!-- 操作按钮 -->
            <div class="flex flex-wrap gap-2 mb-4">
              <button @click="onMatch"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                匹配
              </button>
              <button @click="onUndo" :disabled="userSteps.length <= 1"
                class="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium">
                回退
              </button>
              <button @click="onShowAnswer"
                class="px-4 py-2 border border-blue-300 text-blue-700 bg-white rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                {{ showAnswer ? '隐藏答案' : '查看答案' }}
              </button>
              <button @click="onResetUserSteps"
                class="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                重做
              </button>
              <button @click="onHint"
                class="px-4 py-2 border border-yellow-400 text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium">
                提示
              </button>
            </div>

            <!-- 答题表格 -->
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-300 text-sm user-steps-table">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">步骤</th>
                    <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">分析栈</th>
                    <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">输入串</th>
                  </tr>
                </thead>
                <tbody class="bg-white">
                  <tr v-for="(step, idx) in userSteps" :key="idx">
                    <td class="border border-gray-300 px-3 py-2 text-center">{{ idx + 1 }}</td>
                    <td class="border border-gray-300 px-3 py-2 font-mono text-center">
                      <template v-if="idx === userSteps.length - 1 && hintActive && hintType === 'match'">
                        <span v-for="(ch, i) in (step.stack || '')" :key="i"
                          :class="i === (step.stack.length || 1) - 1 ? 'bg-yellow-200 text-yellow-800 px-1 rounded' : ''">
                          {{ ch }}
                        </span>
                      </template>
                      <template v-else-if="idx === userSteps.length - 1 && hintActive && hintType === 'll1'">
                        <span v-for="(ch, i) in (step.stack || '')" :key="i"
                          :class="i === (step.stack.length || 1) - 1 ? 'bg-yellow-200 text-yellow-800 px-1 rounded' : ''">
                          {{ ch }}
                        </span>
                      </template>
                      <template v-else>
                        {{ step.stack }}
                      </template>
                    </td>
                    <td class="border border-gray-300 px-3 py-2 font-mono text-center">
                      <template v-if="idx === userSteps.length - 1 && hintActive && hintType === 'match'">
                        <span v-for="(ch, i) in (step.input || '')" :key="i"
                          :class="i === 0 ? 'bg-yellow-200 text-yellow-800 px-1 rounded' : ''">
                          {{ ch }}
                        </span>
                      </template>
                      <template v-else-if="idx === userSteps.length - 1 && hintActive && hintType === 'll1'">
                        <span v-for="(ch, i) in (step.input || '')" :key="i"
                          :class="i === 0 ? 'bg-yellow-200 text-yellow-800 px-1 rounded' : ''">
                          {{ ch }}
                        </span>
                      </template>
                      <template v-else>
                        {{ step.input }}
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分析结果表格（答案）- 只在点击查看答案时显示 -->
    <div v-if="inputAnalysisResult && showAnswer"
      class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl shadow-lg border border-green-100 p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Icon icon="lucide:check-circle" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              标准答案分析表
            </h3>
            <p class="text-sm text-gray-600 mt-1">完整的LL1分析过程</p>
          </div>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
          <Icon icon="lucide:eye" class="w-3 h-3 text-green-600" />
          <span class="text-xs font-medium text-green-700">查看答案模式</span>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-green-200 p-4 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <Icon :icon="inputAnalysisResult.info_res === 'Success!' ? 'lucide:check-circle' : 'lucide:x-circle'"
              class="w-6 h-6"
              :class="inputAnalysisResult.info_res === 'Success!' ? 'text-green-600' : 'text-red-600'" />
            <h4 class="text-lg font-semibold"
              :class="inputAnalysisResult.info_res === 'Success!' ? 'text-green-700' : 'text-red-700'">
              {{ inputAnalysisResult.info_res === 'Success!' ? '字符串分析成功！' : '字符串分析失败！' }}
            </h4>
          </div>
          <div class="text-sm text-gray-500">
            分析结果：{{ inputAnalysisResult.info_res }}
          </div>
        </div>

        <!-- 分析过程表格 -->
        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-300 text-sm">
            <thead class="bg-green-50">
              <tr>
                <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">
                  步骤
                </th>
                <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">
                  栈
                </th>
                <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">
                  输入
                </th>
                <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">
                  动作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="(step, index) in inputAnalysisResult.info_step" :key="index">
                <td class="border border-gray-300 px-3 py-2 text-center">{{ step }}</td>
                <td class="border border-gray-300 px-3 py-2 font-mono text-center">
                  {{ inputAnalysisResult.info_state_stack?.[index] || '' }}
                </td>
                <td class="border border-gray-300 px-3 py-2 font-mono text-center">
                  {{ inputAnalysisResult.info_str?.[index] || '' }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-center">
                  {{ inputAnalysisResult.info_msg?.[index] || '' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button @click="$emit('prev-step')"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>
        <div class="text-sm text-gray-500">步骤 4 / 4</div>
        <button @click="complete"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          完成
          <Icon icon="lucide:check" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>

    <!-- 消息提示 -->
    <transition name="fade">
      <div v-if="message" class="fixed bottom-8 right-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
        :class="messageType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
        <Icon :icon="messageType === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5" />
        <span>{{ message }}</span>
      </div>
    </transition>

    <!-- 飞行动画元素 -->
    <div v-for="flyingSymbol in flyingSymbols" :key="`${flyingSymbol.symbol}-${flyingSymbol.target}`"
      class="fixed z-50 pointer-events-none" :style="{
        left: flyingSymbol.x + 'px',
        top: flyingSymbol.y + 'px',
        transform: 'translate(-50%, -50%)'
      }">
      <div class="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-mono shadow-lg border border-orange-600">
        {{ flyingSymbol.symbol }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useLL1Store } from '@/stores/ll1'
import { useCommonStore } from '@/stores/common'
import { Icon } from '@iconify/vue'

// 组件事件
const emit = defineEmits<{ 'next-step': []; 'prev-step': []; complete: [data: any] }>()

// 使用 Store
const ll1Store = useLL1Store()
const commonStore = useCommonStore()

// 从 Store 获取数据
const { originalData, inputString, inputAnalysisResult } = storeToRefs(ll1Store)
const { loading } = storeToRefs(commonStore)

// 本地状态
const analyzing = computed(() => loading.value)

// 示例字符串 (不包含结束符，系统会自动添加#)
const exampleStrings = ['a', 'ab', 'aab', 'b']

// 答题相关状态
const userSteps = ref<{ stack: string; input: string }[]>([])
const showAnswer = ref(false)
const hintActive = ref(false)
const hintRow = ref('')
const hintCol = ref('')
const hintType = ref<'ll1' | 'match' | ''>('')
const message = ref<string | null>(null)
const messageType = ref<'success' | 'error'>('success')
let messageTimer: number | null = null

// 飞行动画状态
const flyingSymbols = ref<Array<{
  symbol: string,
  target: string,
  x: number,
  y: number
}>>([])

// 计算属性
const VtAll = computed(() => {
  const vt = originalData.value?.Vt || []
  return [...vt, '#'] // 添加结束符
})

// 检查分析是否完成
const isAnalysisComplete = computed(() => {
  if (userSteps.value.length === 0) return false
  const last = userSteps.value[userSteps.value.length - 1]
  return last.stack === '#' && last.input === '#'
})

// 监听分析结果变化，自动初始化用户步骤
watch(inputAnalysisResult, (newResult) => {
  if (newResult && inputString.value) {
    initUserSteps()
  }
}, { immediate: true })

// 分析字符串
const analyzeString = async () => {
  if (!inputString.value?.trim()) {
    commonStore.setError('请输入要分析的字符串')
    return
  }

  try {
    const success = await ll1Store.analyzeInputString()

    if (success) {
      console.log('字符串分析完成！')
      // 初始化用户答题步骤
      initUserSteps()
    }
  } catch (error) {
    console.error('分析失败:', error)
    commonStore.setError('分析过程中发生错误')
  }
}

// 重置分析
const resetAnalysis = () => {
  ll1Store.setInputString('')
  commonStore.clearError()
  userSteps.value = []
  showAnswer.value = false
  hintActive.value = false
  hintRow.value = ''
  hintCol.value = ''
  hintType.value = ''
  flyingSymbols.value = []
}

// 初始化用户答题步骤
const initUserSteps = () => {
  showAnswer.value = false
  if (originalData.value && inputString.value && inputAnalysisResult.value) {
    // 初始分析栈和输入串
    const startSymbol = originalData.value.Vn[0] || ''
    // 直接使用后端返回的第一个输入串，确保格式一致
    const initialInput = inputAnalysisResult.value.info_str[0] || ''
    userSteps.value = [{ stack: '#' + startSymbol, input: initialInput }]
  } else {
    userSteps.value = []
  }
}

// LL1表双击
const onLL1CellDblClick = (row: string, col: string) => {
  if (hintActive.value) {
    hintActive.value = false
    hintRow.value = ''
    hintCol.value = ''
    hintType.value = ''
  }
  const prod = originalData.value?.table?.[row + '|' + col]
  if (!prod) return
  const last = userSteps.value[userSteps.value.length - 1]
  if (!last) return

  // 检查是否已经完成分析
  if (last.stack === '#' && last.input === '#') {
    showMessage('分析已完成！', 'success')
    return
  }

  // 判断栈顶和当前输入符号
  const stackArr = last.stack.split('')
  const top = stackArr[stackArr.length - 1]
  if (top !== row) {
    showMessage('请先处理栈顶符号: ' + top, 'error')
    return
  }
  // 推导产生式
  stackArr.pop()
  if (prod !== 'ε') {
    for (let i = prod.length - 1; i >= 0; i--) {
      stackArr.push(prod[i])
    }
  }
  const newStack = stackArr.join('')
  userSteps.value.push({ stack: newStack, input: last.input })

  // 检查是否完成分析（虽然这里通常不会完成，但为了完整性）
  if (newStack === '#' && last.input === '#') {
    showMessage('分析完成！', 'success')
  }
}

// 匹配按钮
const onMatch = () => {
  const last = userSteps.value[userSteps.value.length - 1]
  if (!last) return

  // 检查是否已经完成分析
  if (last.stack === '#' && last.input === '#') {
    showMessage('分析已完成！', 'success')
    return
  }

  const stackArr = last.stack.split('')
  const inputArr = last.input.split('')
  const top = stackArr[stackArr.length - 1]
  const cur = inputArr[0]
  if (top === cur) {
    stackArr.pop()
    inputArr.shift()
    const newStack = stackArr.join('')
    const newInput = inputArr.join('')
    userSteps.value.push({ stack: newStack, input: newInput })

    // 检查是否完成分析
    if (newStack === '#' && newInput === '#') {
      showMessage('分析完成！', 'success')
    }
  } else {
    showMessage('栈顶符号与输入串首字符不匹配！', 'error')
  }
}

// 回退按钮
const onUndo = () => {
  if (userSteps.value.length > 1) {
    userSteps.value.pop()
  }
}

// 查看答案
const onShowAnswer = () => {
  showAnswer.value = !showAnswer.value
}

// 重做
const onResetUserSteps = () => {
  initUserSteps()
  hintActive.value = false
  hintRow.value = ''
  hintCol.value = ''
  hintType.value = ''
  flyingSymbols.value = []
}

// 提示按钮
const onHint = async () => {
  const last = userSteps.value[userSteps.value.length - 1]
  if (!last) return

  // 检查是否已经完成分析
  if (last.stack === '#' && last.input === '#') {
    showMessage('分析已完成！', 'success')
    return
  }

  const stackArr = last.stack.split('')
  const inputArr = last.input.split('')
  const top = stackArr[stackArr.length - 1]
  const cur = inputArr[0]

  // 匹配情形
  if (top === cur) {
    hintActive.value = true
    hintType.value = 'match'

    // 执行匹配飞行动画
    await executeMatchFlyingAnimation(top, cur)

    setTimeout(() => {
      onMatch()
      hintActive.value = false
      hintType.value = ''
    }, 800)
    return
  }

  // LL1表推导情形
  const prod = originalData.value?.table?.[top + '|' + cur]
  if (prod) {
    hintActive.value = true
    hintRow.value = top
    hintCol.value = cur
    hintType.value = 'll1'

    // 执行LL1推导飞行动画
    await executeLL1FlyingAnimation(top, cur, prod)

    setTimeout(() => {
      onLL1CellDblClick(top, cur)
      hintActive.value = false
      hintRow.value = ''
      hintCol.value = ''
      hintType.value = ''
    }, 800)
    return
  }
  showMessage('提示已完成', 'success')
}

// 执行匹配飞行动画
const executeMatchFlyingAnimation = async (symbol: string, target: string) => {
  // 查找符号卡片元素（从符号卡片区域）
  const symbolElement = document.querySelector(`[data-symbol="${symbol}"]`) as HTMLElement
  const stackElement = document.querySelector('.user-steps-table tbody tr:last-child td:nth-child(2)') as HTMLElement
  const inputElement = document.querySelector('.user-steps-table tbody tr:last-child td:nth-child(3)') as HTMLElement

  if (!symbolElement || !stackElement || !inputElement) {
    return
  }

  const symbolRect = symbolElement.getBoundingClientRect()
  const stackRect = stackElement.getBoundingClientRect()
  const inputRect = inputElement.getBoundingClientRect()

  // 创建飞行动画：从符号卡片飞到栈顶
  flyingSymbols.value.push({
    symbol: symbol,
    target: 'stack',
    x: symbolRect.left + symbolRect.width / 2,
    y: symbolRect.top + symbolRect.height / 2
  })

  // 等待一小段时间让元素出现
  await new Promise(resolve => setTimeout(resolve, 100))

  // 更新位置到栈顶
  const flyingSymbolData = flyingSymbols.value.find(fs => fs.symbol === symbol && fs.target === 'stack')
  if (flyingSymbolData) {
    flyingSymbolData.x = stackRect.left + stackRect.width / 2
    flyingSymbolData.y = stackRect.top + stackRect.height / 2
  }

  // 等待飞行动画完成
  await new Promise(resolve => setTimeout(resolve, 1500))

  // 清除飞行动画状态
  flyingSymbols.value = flyingSymbols.value.filter(
    fs => !(fs.symbol === symbol && fs.target === 'stack')
  )

  // 创建第二个飞行动画：从输入串首字符飞出
  flyingSymbols.value.push({
    symbol: target,
    target: 'input',
    x: inputRect.left + inputRect.width / 2,
    y: inputRect.top + inputRect.height / 2
  })

  await new Promise(resolve => setTimeout(resolve, 100))

  // 飞出到屏幕外
  const flyingSymbolData2 = flyingSymbols.value.find(fs => fs.symbol === target && fs.target === 'input')
  if (flyingSymbolData2) {
    flyingSymbolData2.x = inputRect.left + inputRect.width / 2
    flyingSymbolData2.y = -100 // 飞出到屏幕上方
  }

  await new Promise(resolve => setTimeout(resolve, 1000))

  // 清除第二个飞行动画状态
  flyingSymbols.value = flyingSymbols.value.filter(
    fs => !(fs.symbol === target && fs.target === 'input')
  )
}

// 执行LL1推导飞行动画
const executeLL1FlyingAnimation = async (nonTerminal: string, terminal: string, production: string) => {
  // 查找LL1表格中的产生式元素
  const tableCellElement = document.querySelector(`[data-table-cell="${nonTerminal}|${terminal}"]`) as HTMLElement
  const stackElement = document.querySelector('.user-steps-table tbody tr:last-child td:nth-child(2)') as HTMLElement

  if (!tableCellElement || !stackElement) {
    return
  }

  const tableCellRect = tableCellElement.getBoundingClientRect()
  const stackRect = stackElement.getBoundingClientRect()

  // 创建飞行动画：从LL1表格飞到栈顶
  flyingSymbols.value.push({
    symbol: production,
    target: 'stack',
    x: tableCellRect.left + tableCellRect.width / 2,
    y: tableCellRect.top + tableCellRect.height / 2
  })

  // 等待一小段时间让元素出现
  await new Promise(resolve => setTimeout(resolve, 100))

  // 更新位置到栈顶
  const flyingSymbolData = flyingSymbols.value.find(fs => fs.symbol === production && fs.target === 'stack')
  if (flyingSymbolData) {
    flyingSymbolData.x = stackRect.left + stackRect.width / 2
    flyingSymbolData.y = stackRect.top + stackRect.height / 2
  }

  // 等待飞行动画完成
  await new Promise(resolve => setTimeout(resolve, 1500))

  // 清除飞行动画状态
  flyingSymbols.value = flyingSymbols.value.filter(
    fs => !(fs.symbol === production && fs.target === 'stack')
  )
}



// 显示消息
const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
  message.value = msg
  messageType.value = type
  if (messageTimer) clearTimeout(messageTimer)
  messageTimer = window.setTimeout(() => {
    message.value = null
  }, 2000)
}

// 完成步骤
const complete = () => {
  const data = {
    inputString: inputString.value,
    analysisResult: inputAnalysisResult.value,
    success: inputAnalysisResult.value?.info_res === 'Success!',
    steps: inputAnalysisResult.value?.info_step || [],
    messages: inputAnalysisResult.value?.info_msg || [],
    userSteps: userSteps.value,
  }

  emit('complete', data)
}
</script>

<style scoped>
.step-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.step-icon {
  width: 3rem;
  height: 3rem;
  background: #dcfce7;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-content {
  padding: 2rem;
}

.step-actions {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

/* 提示高亮样式 */
.hint-highlight {
  background: #facc15;
  color: #b45309;
  border-radius: 0.25rem;
  padding: 0 2px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 飞行动画过渡效果 */
.fixed {
  transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 高亮动画效果 */
@keyframes highlight-pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

.ring-yellow-400 {
  animation: highlight-pulse 1s ease-in-out infinite;
}
</style>
