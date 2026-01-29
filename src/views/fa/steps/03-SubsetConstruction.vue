<template>
  <div class="subset-construction-step">
    <!-- 步骤头部 -->
    <div class="p-8 pb-4 border-b border-gray-200">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Icon icon="lucide:table" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">子集构造法</h2>
          <p class="text-gray-600 mt-1">第三步：使用子集构造法生成转换表和状态转换矩阵</p>

          <!-- 总体完成进度 -->
          <div class="mt-3">
            <ProgressBar
              :percentage="overallCompletionRate"
              label="总体完成度"
              theme="rainbow"
              :show-completion-message="true"
              completion-message="恭喜！所有内容填写完成"
              completion-icon="lucide:trophy"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="p-8">
      <div class="space-y-6">
        <!-- NFA 参考图和填写提示 -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <!-- NFA 参考图 -->
          <div class="lg:col-span-3">
            <div class="bg-white border border-gray-200 rounded-lg h-full">
              <div class="border-b border-gray-200 p-4">
                <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                  <Icon icon="lucide:share-2" class="w-5 h-5 text-blue-600" />
                  NFA 图（参考）
                </h3>
                <p class="text-sm text-gray-600 mt-1">根据此 NFA 图填写下方的转换表和状态转换矩阵</p>
              </div>
              <div class="p-6">
                <div
                  v-if="faStore.nfaDotString"
                  class="nfa-svg-container bg-gray-50 rounded-lg p-4 overflow-auto"
                >
                  <div v-html="nfaSvg" class="flex justify-center"></div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                  <Icon icon="lucide:image-off" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>暂无 NFA 图数据</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 填写提示 -->
          <div class="lg:col-span-2">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 h-full sticky top-24">
              <div class="flex items-start gap-3">
                <Icon icon="lucide:lightbulb" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 class="font-medium text-blue-800">填写提示</h4>
                  <ul class="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• 转换表：记录从NFA状态集合到新DFA状态的映射关系</li>
                    <li>• <strong>多个符号之间必须用空格分隔（如：1 2 3）</strong></li>
                    <li>• 状态转换矩阵：用数字编号表示状态间的转换关系</li>
                    <li>• <strong>无转换的格子可以填写"-"</strong></li>
                    <li>• 完成填写后可以查看标准答案进行对比</li>
                    <li>• <strong>必须查看转换表和状态转换矩阵的标准答案后才能进入下一步</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 转换表区域 -->
        <div class="conversion-table-section">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 左侧：用户填写转换表 -->
            <div class="user-table-section">
              <div class="bg-white border border-gray-200 rounded-lg">
                <div class="border-b border-gray-200 p-4">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">NFA → DFA 转换表（用户填写）</h3>
                    <div class="flex items-center gap-2">
                      <button
                        @click="addTableRow"
                        class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Icon icon="lucide:plus" class="w-4 h-4 inline mr-1" />
                        添加行
                      </button>
                      <button
                        @click="clearUserTable"
                        class="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      >
                        <Icon icon="lucide:eraser" class="w-4 h-4 inline mr-1" />
                        清空
                      </button>
                      <button
                        @click="handleValidateTable"
                        class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <Icon icon="lucide:check-circle" class="w-4 h-4 inline mr-1" />
                        检验答案
                      </button>
                    </div>
                  </div>

                  <!-- 完成进度提示 -->
                  <div v-if="conversionTableRowCount > 0" class="mt-3">
                    <ProgressBar
                      :percentage="tableCorrectCompletionRate"
                      label="完成进度"
                      theme="green"
                      :show-completion-message="true"
                      completion-message="转换表填写完成！"
                      completion-icon="lucide:check-circle"
                    />
                  </div>
                </div>

                <div class="p-4">
                  <div
                    v-if="conversionTableColumns.length === 0"
                    class="text-center py-8 text-gray-500"
                  >
                    <Icon icon="lucide:edit" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>点击"添加行"开始填写转换表</p>
                  </div>

                  <div v-else class="overflow-x-auto">
                    <table class="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr class="bg-gray-50">
                          <!-- 转换表：列标题为 I, Ia, Ib 等输入符号 -->
                          <th
                            v-for="column in conversionTableColumns"
                            :key="column"
                            class="border border-gray-300 px-3 py-2 text-center font-semibold"
                          >
                            {{ column }}
                          </th>
                          <th class="border border-gray-300 px-3 py-2 text-center font-semibold">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- 每行代表一个状态集合 -->
                        <tr
                          v-for="(_, rowIndex) in conversionTableRowCount"
                          :key="rowIndex"
                          :class="rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                        >
                          <td
                            v-for="column in conversionTableColumns"
                            :key="column"
                            class="border border-gray-300 px-3 py-2"
                          >
                            <input
                              :value="userConversionTable[column]?.[rowIndex] || ''"
                              @input="(event) => updateConversionTable(column, rowIndex, (event.target as HTMLInputElement).value)"
                              type="text"
                              :placeholder="column === 'I' ? '状态集合' : '符号间用空格分隔'"
                              :class="getFieldClass(rowIndex, column, 'table') + ' text-center'"
                              @blur="
                                () =>
                                  validateField(
                                    userConversionTable[column]?.[rowIndex] || '',
                                    rowIndex,
                                    column,
                                    'table',
                                  )
                              "
                            />
                          </td>
                          <td class="border border-gray-300 px-3 py-2 text-center">
                            <button
                              @click="removeTableRow(rowIndex)"
                              class="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Icon icon="lucide:trash-2" class="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- 转换表错误信息显示 -->
                  <div
                    v-if="showTableErrors && Object.keys(tableValidationErrors).length > 0"
                    class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div class="flex items-start gap-2">
                      <Icon
                        icon="lucide:alert-circle"
                        class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <h4 class="font-medium text-red-800 mb-2">转换表填写错误</h4>
                        <ul class="text-sm text-red-700 space-y-1">
                          <li v-for="(errors, fieldKey) in tableValidationErrors" :key="fieldKey">
                            <strong>{{ formatFieldKey(fieldKey, 'table') }}：</strong>
                            <span v-for="(error, index) in errors" :key="index">
                              {{ error }}{{ index < errors.length - 1 ? '，' : '' }}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!-- 转换表成功提示 -->
                  <div
                    v-if="tableCompletionRate === 100 && Object.keys(tableValidationErrors).length === 0 && showTableSuccess"
                    class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div class="flex items-start gap-2">
                      <Icon
                        icon="lucide:check-circle"
                        class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <h4 class="font-medium text-green-800 mb-2">🎉 转换表填写完美！</h4>
                        <p class="text-sm text-green-700">
                          恭喜你！转换表的所有字段都已正确填写，可以继续进行下一步了。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧：答案区域 -->
            <div class="answer-table-section">
              <div class="bg-white border border-gray-200 rounded-lg">
                <div class="border-b border-gray-200 p-4">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">标准答案</h3>
                    <button
                      @click="toggleTableAnswer"
                      :class="[
                        'px-4 py-2 rounded-lg transition-colors',
                        showTableAnswer
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-green-600 text-white hover:bg-green-700',
                      ]"
                    >
                      <Icon
                        :icon="showTableAnswer ? 'lucide:eye-off' : 'lucide:eye'"
                        class="w-4 h-4 inline mr-2"
                      />
                      {{ showTableAnswer ? '隐藏答案' : '查看答案' }}
                    </button>
                  </div>
                </div>

                <div class="p-4">
                  <div v-if="!showTableAnswer" class="text-center py-8 text-gray-500">
                    <Icon icon="lucide:lock" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p class="text-lg font-medium">答案已隐藏</p>
                    <p class="text-sm mt-1">完成填写后点击"查看答案"按钮</p>
                  </div>

                  <div
                    v-else-if="Object.keys(answerConversionTable).length > 0 && conversionTableColumns.length > 0"
                    class="overflow-x-auto"
                  >
                    <TransitionTable
                      :data="{
                        headers: conversionTableColumns,
                        rows: Array.from({ length: Math.max(...conversionTableColumns.map(col => answerConversionTable[col]?.length || 0)) }, (_, rowIndex) =>
                          conversionTableColumns.map(col => answerConversionTable[col]?.[rowIndex] || '-')
                        )
                      }"
                      :columns="conversionTableColumns.map(col => ({
                        key: col,
                        title: col,
                        type: col === 'I' ? 'state' as const : 'transition' as const,
                        editable: false
                      }))"
                      :editable="false"
                      :show-answer="true"
                      :final-state-config="{
                        isFinalState: (row: number, col: string, value: any) => value && value.includes('Y')
                      }"
                    />
                  </div>

                  <div v-else class="text-center py-8 text-gray-500">
                    <Icon icon="lucide:alert-circle" class="w-8 h-8 mx-auto mb-2" />
                    <p>暂无答案数据</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 状态转换矩阵区域 -->
        <div class="transition-matrix-section relative">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 左侧：用户填写状态转换矩阵 -->
            <div class="user-matrix-section">
              <div class="bg-white border border-gray-200 rounded-lg">
                <div class="border-b border-gray-200 p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-semibold text-gray-900">状态转换矩阵（用户填写）</h3>
                      <p class="text-sm text-gray-600 mt-1">重命名规则：用0,1,2,3...来重命名状态集合</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        @click="clearUserMatrix"
                        class="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      >
                        <Icon icon="lucide:eraser" class="w-4 h-4 inline mr-1" />
                        清空
                      </button>
                      <button
                        @click="handleValidateMatrix"
                        class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <Icon icon="lucide:check-circle" class="w-4 h-4 inline mr-1" />
                        检验答案
                      </button>
                    </div>
                  </div>

                  <!-- 完成进度提示 -->
                  <div v-if="matrixStateColumns.length > 0" class="mt-3">
                    <ProgressBar
                      :percentage="matrixCorrectCompletionRate"
                      label="完成进度"
                      theme="orange"
                      :show-completion-message="true"
                      completion-message="状态转换矩阵填写完成！"
                      completion-icon="lucide:check-circle"
                    />
                  </div>
                </div>

                <div class="p-4">
                  <div v-if="alphabetSymbols.length === 0" class="text-center py-8 text-gray-500">
                    <Icon icon="lucide:grid-3x3" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>初始化完成后开始填写状态转换矩阵</p>
                  </div>

                  <!-- 重命名规则说明 -->
                  <div v-if="alphabetSymbols.length > 0" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div class="flex items-start gap-2">
                      <Icon icon="lucide:info" class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div class="text-sm text-blue-700">
                        <p class="font-medium mb-1">状态重命名规则：</p>
                        <ul class="space-y-1 text-xs">
                          <li>• 将转换表中的状态集合按顺序重命名为：0, 1, 2, 3, ...</li>
                          <li>• 例如：状态集合 "1 2 X" → 编号 0，"1 2 3" → 编号 1</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div v-if="alphabetSymbols.length > 0" class="overflow-x-auto">
                    <table class="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr class="bg-purple-50">
                          <!-- 矩阵：列标题为状态名 S, a, b 等 -->
                          <th
                            v-for="state in matrixStateColumns"
                            :key="state"
                            class="border border-gray-300 px-3 py-2 text-center font-semibold"
                          >
                            {{ state }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- 每行代表一个状态转换 - 动态生成行数匹配答案 -->
                        <tr
                          v-for="rowIndex in matrixRowCount"
                          :key="rowIndex - 1"
                          :class="((rowIndex - 1) % 2 === 0) ? 'bg-white' : 'bg-purple-50'"
                        >
                          <td
                            v-for="state in matrixStateColumns"
                            :key="state"
                            class="border border-gray-300 px-3 py-2"
                          >
                            <input
                              :value="userTransitionMatrix[String(rowIndex - 1)]?.[state] || ''"
                              @input="(event) => updateTransitionMatrix(rowIndex - 1, state, (event.target as HTMLInputElement).value)"
                              type="text"
                              :placeholder="state === 'S' ? '状态编号' : '目标状态编号'"
                              :class="
                                getFieldClass(rowIndex - 1, state, 'matrix') +
                                ' text-center'
                              "
                              @blur="
                                () =>
                                  validateField(
                                    userTransitionMatrix[String(rowIndex - 1)]?.[state] || '',
                                    rowIndex - 1,
                                    state,
                                    'matrix',
                                  )
                              "
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- 矩阵错误信息显示 -->
                  <div
                    v-if="showMatrixErrors && Object.keys(matrixValidationErrors).length > 0"
                    class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div class="flex items-start gap-2">
                      <Icon
                        icon="lucide:alert-circle"
                        class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <h4 class="font-medium text-red-800 mb-2">状态转换矩阵填写错误</h4>
                        <ul class="text-sm text-red-700 space-y-1">
                          <li v-for="(errors, fieldKey) in matrixValidationErrors" :key="fieldKey">
                            <strong>{{ formatFieldKey(fieldKey, 'matrix') }}：</strong>
                            <span v-for="(error, index) in errors" :key="index">
                              {{ error }}{{ index < errors.length - 1 ? '，' : '' }}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!-- 矩阵成功提示 -->
                  <div
                    v-if="matrixCompletionRate === 100 && Object.keys(matrixValidationErrors).length === 0 && showMatrixSuccess"
                    class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div class="flex items-start gap-2">
                      <Icon
                        icon="lucide:check-circle"
                        class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <h4 class="font-medium text-green-800 mb-2">🎉 状态转换矩阵填写完美！</h4>
                        <p class="text-sm text-green-700">
                          恭喜你！状态转换矩阵的所有字段都已正确填写，可以继续进行下一步了。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧：答案区域 -->
            <div class="answer-matrix-section">
              <div class="bg-white border border-gray-200 rounded-lg">
                <div class="border-b border-gray-200 p-4">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">标准答案</h3>
                    <button
                      @click="toggleMatrixAnswer"
                      :class="[
                        'px-4 py-2 rounded-lg transition-colors',
                        showMatrixAnswer
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-green-600 text-white hover:bg-green-700',
                      ]"
                    >
                      <Icon
                        :icon="showMatrixAnswer ? 'lucide:eye-off' : 'lucide:eye'"
                        class="w-4 h-4 inline mr-2"
                      />
                      {{ showMatrixAnswer ? '隐藏答案' : '查看答案' }}
                    </button>
                  </div>
                </div>

                <div class="p-4">
                  <div v-if="!showMatrixAnswer" class="text-center py-8 text-gray-500">
                    <Icon icon="lucide:lock" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p class="text-lg font-medium">答案已隐藏</p>
                    <p class="text-sm mt-1">完成填写后点击"查看答案"按钮</p>
                  </div>

                  <div
                    v-else-if="Object.keys(answerTransitionMatrix).length > 0 && matrixStateColumns.length > 0"
                    class="overflow-x-auto"
                  >
                    <TransitionTable
                      :data="{
                        headers: matrixStateColumns,
                        rows: Object.keys(answerTransitionMatrix).map(rowKey =>
                          matrixStateColumns.map(state => answerTransitionMatrix[rowKey]?.[state] || '-')
                        )
                      }"
                      :columns="matrixStateColumns.map(state => ({
                        key: state,
                        title: state,
                        type: state === 'S' ? 'state' as const : 'transition' as const,
                        editable: false
                      }))"
                      :editable="false"
                      :show-answer="true"
                      :final-state-config="{
                        isFinalState: (row: number, col: string, value: any) => {
                          const columnMapping: Record<string, string> = {}
                          columnMapping['S'] = 'I'
                          alphabetSymbols.forEach(symbol => {
                            columnMapping[symbol] = `I${symbol}`
                          })
                          const mappedColumn = columnMapping[col] || col
                          return finalStatePositions.some((pos: {row: number, col: string}) => pos.row === row && pos.col === mappedColumn)
                        }
                      }"
                    />
                  </div>

                  <div v-else class="text-center py-8 text-gray-500">
                    <Icon icon="lucide:alert-circle" class="w-8 h-8 mx-auto mb-2" />
                    <p>暂无答案数据</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 大毛玻璃覆盖层 -->
          <div
            v-if="isMatrixLocked"
            class="absolute inset-0 z-50 backdrop-blur-xl backdrop-saturate-150 bg-gradient-to-br from-white/85 via-white/75 to-white/70 rounded-lg border border-white/50 flex items-center justify-center animate-[glassAppear_0.3s_ease-out]"
          >
            <div class="flex flex-col items-center justify-center h-full w-full px-8 py-12">
              <div class="flex items-center justify-center mb-8 animate-pulse">
                <Icon icon="lucide:lock" class="w-16 h-16 text-blue-100 drop-shadow-lg" />
              </div>
              <div class="text-center space-y-4 max-w-md">
                <h3 class="text-xl font-bold text-gray-900 drop-shadow-md">需要先查看转换表答案</h3>
                <p class="text-base text-gray-800 leading-relaxed drop-shadow-sm">
                  请先查看上方 NFA → DFA 转换表的标准答案后再填写状态转换矩阵
                </p>
                <div class="mt-8 animate-bounce">
                  <div
                    class="inline-flex items-center px-5 py-3 bg-blue-600/90 hover:bg-blue-700/90 rounded-xl shadow-lg backdrop-blur-sm border border-blue-400/30 transition-all duration-300 cursor-pointer group"
                  >
                    <Icon
                      icon="lucide:arrow-up"
                      class="w-5 h-5 text-white mr-2 group-hover:animate-pulse"
                    />
                    <span class="text-white font-medium text-sm">点击上方转换表"查看答案"按钮</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 步骤操作栏 -->
    <div class="p-4 px-8 pb-8 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center">
        <button
          @click="$emit('prev-step')"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>

        <div class="text-sm text-gray-500">步骤 3 / 6</div>

        <button
          @click="proceedToNext"
          :disabled="!constructionComplete"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            constructionComplete
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
          :title="!constructionComplete ? '请完成填写并查看任一标准答案后继续' : ''"
        >
          下一步
          <Icon icon="lucide:chevron-right" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
// 修改引入：使用新的 Store
import { useFAStoreNew } from '@/stores'
import { instance } from '@viz-js/viz'
import { TransitionTable } from '@/components/fa'
import { ProgressBar } from '@/components/shared'

// 类型定义
interface ConversionTableData {
  [inputSymbol: string]: string[]
}

interface TransitionMatrixData {
  [rowIndex: string]: Record<string, string>
}

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: Record<string, unknown>]
}>()

// 使用新的 FA Store
const faStore = useFAStoreNew()

// NFA SVG 渲染
const nfaSvg = ref('')

// 用户填写的表格
const userConversionTable = ref<ConversionTableData>({})
const userTransitionMatrix = ref<TransitionMatrixData>({})

// 答案数据
const answerConversionTable = ref<ConversionTableData>({})
const answerTransitionMatrix = ref<TransitionMatrixData>({})

// 答案显示控制
const showTableAnswer = ref(false)
const showMatrixAnswer = ref(false)

// 字母表符号和状态信息
const alphabetSymbols = ref<string[]>([])
const conversionTableColumns = ref<string[]>([])
const matrixStateColumns = ref<string[]>([])
const dfaStates = ref<string[]>([])

// 表格行数控制
const conversionTableRowCount = ref(0)

// 验证状态管理
const tableValidationErrors = ref<Record<string, string[]>>({})
const matrixValidationErrors = ref<Record<string, string[]>>({})
const tableFieldValidation = ref<Record<string, 'valid' | 'invalid' | 'normal'>>({})
const matrixFieldValidation = ref<Record<string, 'valid' | 'invalid' | 'normal'>>({})
const showTableErrors = ref(false)
const showMatrixErrors = ref(false)
const showTableSuccess = ref(false)
const showMatrixSuccess = ref(false)

// 终态位置列表
const finalStatePositions = ref<Array<{row: number, col: string}>>([])

// === 核心修改：防抖保存逻辑 ===
let autoSaveTimer: number | null = null

const triggerAutoSave = () => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  autoSaveTimer = window.setTimeout(() => {
    saveStep3Data()
    faStore.saveToHistory() // 同步到历史记录
    console.log('步骤3数据已自动保存到历史记录')
  }, 1000)
}

// 保存03页面数据 (写入 Store)
const saveStep3Data = () => {
  faStore.saveStep3Data(
    userConversionTable.value,
    userTransitionMatrix.value,
    conversionTableRowCount.value
  )
}

// 监听数据变化，触发防抖保存
watch(
  [userConversionTable, userTransitionMatrix, conversionTableRowCount],
  () => {
    triggerAutoSave()
  },
  { deep: true }
)

// 组件卸载时强制保存
onUnmounted(() => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  saveStep3Data()
  faStore.saveToHistory()
})

// === 计算属性 ===
const constructionComplete = computed(() => {
  return showTableAnswer.value && showMatrixAnswer.value
})

const totalTransitions = computed(() => {
  let total = 0
  conversionTableColumns.value.forEach((column) => {
    const columnData = answerConversionTable.value[column] || []
    total += columnData.filter((cell) => cell && cell !== '-').length
  })
  return total
})

// 转换表完成率
const tableCompletionRate = computed(() => {
  if (conversionTableRowCount.value === 0 || conversionTableColumns.value.length === 0) return 0
  
  const answerRowCount = Math.max(
    ...conversionTableColumns.value.map((col) => answerConversionTable.value[col]?.length || 0)
  )
  if (answerRowCount === 0) return 0

  const totalRequiredFields = answerRowCount * conversionTableColumns.value.length
  let completedFields = 0

  conversionTableColumns.value.forEach((column) => {
    const columnData = userConversionTable.value[column] || []
    for (let i = 0; i < answerRowCount; i++) {
      if ((columnData[i] || '').trim() !== '') completedFields++
    }
  })

  return totalRequiredFields > 0 ? Math.round((completedFields / totalRequiredFields) * 100) : 0
})

// 矩阵完成率
const matrixCompletionRate = computed(() => {
  if (matrixStateColumns.value.length === 0 || Object.keys(userTransitionMatrix.value).length === 0) return 0

  const answerRowCount = Object.keys(answerTransitionMatrix.value).length
  if (answerRowCount === 0) return 0

  const totalRequiredFields = answerRowCount * matrixStateColumns.value.length
  let completedFields = 0

  for (let i = 0; i < answerRowCount; i++) {
    const rowKey = i.toString()
    matrixStateColumns.value.forEach((state) => {
      if ((userTransitionMatrix.value[rowKey]?.[state] || '').trim() !== '') completedFields++
    })
  }

  return totalRequiredFields > 0 ? Math.round((completedFields / totalRequiredFields) * 100) : 0
})

// 转换表正确率
const tableCorrectCompletionRate = computed(() => {
  if (conversionTableRowCount.value === 0 || conversionTableColumns.value.length === 0) return 0
  
  const answerRowCount = Math.max(
    ...conversionTableColumns.value.map((col) => answerConversionTable.value[col]?.length || 0)
  )
  if (answerRowCount === 0) return 0

  const totalRequiredFields = answerRowCount * conversionTableColumns.value.length
  let correctFields = 0

  conversionTableColumns.value.forEach((column) => {
    const columnData = userConversionTable.value[column] || []
    const answerColumnData = answerConversionTable.value[column] || []

    for (let i = 0; i < answerRowCount; i++) {
      if (compareStateSets(columnData[i] || '', answerColumnData[i] || '')) {
        correctFields++
      }
    }
  })

  return totalRequiredFields > 0 ? Math.round((correctFields / totalRequiredFields) * 100) : 0
})

// 矩阵正确率
const matrixCorrectCompletionRate = computed(() => {
  if (matrixStateColumns.value.length === 0 || Object.keys(userTransitionMatrix.value).length === 0) return 0

  const answerRowCount = Object.keys(answerTransitionMatrix.value).length
  if (answerRowCount === 0) return 0

  const totalRequiredFields = answerRowCount * matrixStateColumns.value.length
  let correctFields = 0

  for (let i = 0; i < answerRowCount; i++) {
    const rowKey = i.toString()
    matrixStateColumns.value.forEach((state) => {
      const userValue = userTransitionMatrix.value[rowKey]?.[state] || ''
      const answerValue = answerTransitionMatrix.value[rowKey]?.[state] || ''
      if (compareStateSets(userValue, answerValue)) {
        correctFields++
      }
    })
  }

  return totalRequiredFields > 0 ? Math.round((correctFields / totalRequiredFields) * 100) : 0
})

// 总体完成率
const overallCompletionRate = computed(() => {
  const tableRate = tableCorrectCompletionRate.value
  const matrixRate = matrixCorrectCompletionRate.value
  const hasTableAnswer = Object.keys(answerConversionTable.value).length > 0
  const hasMatrixAnswer = Object.keys(answerTransitionMatrix.value).length > 0

  if (!hasTableAnswer && !hasMatrixAnswer) return 0
  if (hasTableAnswer && !hasMatrixAnswer) return tableRate
  if (!hasTableAnswer && hasMatrixAnswer) return matrixRate
  return Math.round((tableRate * 0.5) + (matrixRate * 0.5))
})

const isMatrixLocked = computed(() => !showTableAnswer.value && !showMatrixAnswer.value)
const matrixRowCount = computed(() => Object.keys(answerTransitionMatrix.value).length || 0)

// === 操作函数 ===

const addTableRow = () => {
  conversionTableRowCount.value++
  conversionTableColumns.value.forEach((column) => {
    if (!userConversionTable.value[column]) userConversionTable.value[column] = []
    while (userConversionTable.value[column].length < conversionTableRowCount.value) {
      userConversionTable.value[column].push('')
    }
  })
}

const removeTableRow = (rowIndex: number) => {
  if (conversionTableRowCount.value > 0) {
    conversionTableRowCount.value--
    conversionTableColumns.value.forEach((column) => {
      if (userConversionTable.value[column]) {
        userConversionTable.value[column].splice(rowIndex, 1)
      }
    })
  }
}

const updateConversionTable = (column: string, rowIndex: number, value: string) => {
  if (!userConversionTable.value[column]) userConversionTable.value[column] = []
  if (!userConversionTable.value[column][rowIndex]) userConversionTable.value[column][rowIndex] = ''
  userConversionTable.value[column][rowIndex] = value
}

const clearUserTable = () => {
  conversionTableRowCount.value = 0
  userConversionTable.value = {}
  tableValidationErrors.value = {}
  tableFieldValidation.value = {}
  showTableErrors.value = false
  showTableSuccess.value = false
}

const clearUserMatrix = () => {
  Object.keys(userTransitionMatrix.value).forEach((rowKey) => {
    userTransitionMatrix.value[rowKey] = {}
    matrixStateColumns.value.forEach((state) => {
      userTransitionMatrix.value[rowKey][state] = ''
    })
  })
  matrixValidationErrors.value = {}
  matrixFieldValidation.value = {}
  showMatrixErrors.value = false
  showMatrixSuccess.value = false
}

const updateTransitionMatrix = (rowIndex: number, state: string, value: string) => {
  const rowKey = String(rowIndex)
  if (!userTransitionMatrix.value[rowKey]) userTransitionMatrix.value[rowKey] = {}
  userTransitionMatrix.value[rowKey][state] = value
}

// 获取字段的CSS类 (用于动态改变输入框边框颜色)
const getFieldClass = (rowIndex: number, field: string, tableType: 'table' | 'matrix') => {
  const fieldKey = `${tableType}-${rowIndex}-${field}`
  const fieldValidationRef = tableType === 'table' ? tableFieldValidation : matrixFieldValidation
  const validationStatus = fieldValidationRef.value[fieldKey]

  const baseClass = 'w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1'

  if (validationStatus === 'valid') {
    return `${baseClass} border-green-500 bg-green-50 focus:ring-green-500`
  } else if (validationStatus === 'invalid') {
    return `${baseClass} border-red-500 bg-red-50 focus:ring-red-500`
  } else {
    // 默认状态（普通输入中）
    const ringColor = tableType === 'table' ? 'focus:ring-blue-500' : 'focus:ring-purple-500'
    return `${baseClass} border-gray-300 ${ringColor}`
  }
}

// === 验证逻辑 ===

const compareStateSets = (set1: string, set2: string): boolean => {
  if ((!set1 || set1.trim() === '' || set1.trim() === '-') &&
      (!set2 || set2.trim() === '' || set2.trim() === '-')) return true
  if (!set1 || set1.trim() === '' || set1.trim() === '-' ||
      !set2 || set2.trim() === '' || set2.trim() === '-') return false
  
  const states1 = set1.trim().split(/\s+/).sort()
  const states2 = set2.trim().split(/\s+/).sort()
  
  if (states1.length !== states2.length) return false
  for (let i = 0; i < states1.length; i++) {
    if (states1[i] !== states2[i]) return false
  }
  return true
}

const validateStateSource = (stateName: string, currentRowIndex: number, tableType: 'table' | 'matrix'): boolean => {
  if (currentRowIndex === 0) return true
  if (tableType === 'table') {
    for (let rowIndex = 0; rowIndex < currentRowIndex; rowIndex++) {
      for (const column of conversionTableColumns.value) {
        const cellValue = userConversionTable.value[column]?.[rowIndex]?.trim()
        if (cellValue && cellValue !== '-' && cellValue.includes(stateName)) return true
      }
    }
  } else {
    return matrixStateColumns.value.includes(stateName)
  }
  return false
}

const validateTransition = (rowIndex: number, field: string, userValue: string, tableType: 'table' | 'matrix'): boolean => {
  if (tableType === 'table') {
    const answerColumn = answerConversionTable.value[field]
    if (!answerColumn || !answerColumn[rowIndex]) return false
    return compareStateSets(userValue, answerColumn[rowIndex] || '-')
  } else {
    const answerRow = answerTransitionMatrix.value[rowIndex.toString()]
    if (!answerRow) return false
    return compareStateSets(userValue, answerRow[field] || '-')
  }
}

const validateField = (value: string | undefined, rowIndex: number, field: string, tableType: 'table' | 'matrix') => {
  const fieldKey = `${tableType}-${rowIndex}-${field}`
  const errors: string[] = []
  const fieldValue = value || ''
  
  const validationRef = tableType === 'table' ? tableValidationErrors : matrixValidationErrors
  const fieldValidationRef = tableType === 'table' ? tableFieldValidation : matrixFieldValidation

  if (!fieldValue || fieldValue.trim() === '') {
    errors.push(field === 'state' ? '状态名称不能为空' : '转换关系不能为空')
  }

  if (tableType === 'table' && fieldValue && fieldValue.trim() !== '') {
    const trimmedValue = fieldValue.trim()
    if (trimmedValue && trimmedValue !== '-' && trimmedValue.length > 1 && !trimmedValue.includes(' ')) {
      errors.push('多个符号之间需要用空格隔开')
    }
  }

  if (field === 'state' && fieldValue && fieldValue.trim() !== '') {
    if (!validateStateSource(fieldValue.trim(), rowIndex, tableType)) {
      errors.push('新状态必须来源于之前行的转换结果')
    }
  }

  if (field !== 'state' && fieldValue && fieldValue.trim() !== '') {
    if (!validateTransition(rowIndex, field, fieldValue.trim(), tableType)) {
      errors.push('转换结果与标准答案不符')
    }
  }

  if (errors.length > 0) {
    validationRef.value[fieldKey] = errors
    fieldValidationRef.value[fieldKey] = 'invalid'
    if (tableType === 'table') showTableErrors.value = true
    else showMatrixErrors.value = true

    const correctValue = tableType === 'table'
      ? (answerConversionTable.value[field]?.[rowIndex] || '-')
      : (answerTransitionMatrix.value[rowIndex.toString()]?.[field] || '-')

    faStore.addErrorLog({
      step: 'step3',
      tableType: tableType === 'table' ? 'conversionTable' : 'transitionMatrix',
      location: {
        row: rowIndex,
        col: field,
        fieldKey
      },
      wrongValue: fieldValue,
      correctValue: correctValue
    })
  } else {
    delete validationRef.value[fieldKey]
    fieldValidationRef.value[fieldKey] = 'valid'
    if (Object.keys(validationRef.value).length === 0) {
      if (tableType === 'table') showTableErrors.value = false
      else showMatrixErrors.value = false
    }
  }
}

const validateTable = (tableType: 'table' | 'matrix') => {
  if (tableType === 'table') {
    for (let rowIndex = 0; rowIndex < conversionTableRowCount.value; rowIndex++) {
      conversionTableColumns.value.forEach((column) => {
        validateField(userConversionTable.value[column]?.[rowIndex] || '', rowIndex, column, tableType)
      })
    }
    showTableErrors.value = Object.keys(tableValidationErrors.value).length > 0
  } else {
    Object.keys(userTransitionMatrix.value).forEach((rowKey) => {
      matrixStateColumns.value.forEach((state) => {
        validateField(userTransitionMatrix.value[rowKey]?.[state] || '', Number(rowKey), state, tableType)
      })
    })
    showMatrixErrors.value = Object.keys(matrixValidationErrors.value).length > 0
  }
}

const handleValidateTable = () => {
  validateTable('table')
  if (Object.keys(tableValidationErrors.value).length === 0 && tableCorrectCompletionRate.value === 100) {
    showTableSuccess.value = true
    setTimeout(() => { showTableSuccess.value = false }, 3000)
  } else {
    showTableSuccess.value = false
  }
}

const handleValidateMatrix = () => {
  validateTable('matrix')
  if (Object.keys(matrixValidationErrors.value).length === 0 && matrixCorrectCompletionRate.value === 100) {
    showMatrixSuccess.value = true
    setTimeout(() => { showMatrixSuccess.value = false }, 3000)
  } else {
    showMatrixSuccess.value = false
  }
}

const formatFieldKey = (fieldKey: string, tableType: 'table' | 'matrix') => {
  const parts = fieldKey.split('-')
  if (parts.length >= 3) {
    const rowIndex = parseInt(parts[1]) + 1
    const fieldName = parts[2]
    return `第${rowIndex}行${fieldName}列`
  }
  return fieldKey
}

// === 数据处理 ===

const extractFinalStatePositions = (conversionTable: ConversionTableData) => {
  const positions: Array<{row: number, col: string}> = []
  Object.keys(conversionTable).forEach((column) => {
    const columnData = conversionTable[column]
    if (Array.isArray(columnData)) {
      columnData.forEach((cellValue, rowIndex) => {
        if (cellValue && cellValue.includes('Y')) {
          positions.push({row: rowIndex, col: column})
        }
      })
    }
  })
  finalStatePositions.value = positions
}

const renderNFASvg = async () => {
  if (faStore.nfaDotString) {
    try {
      const viz = await instance()
      const svg = viz.renderSVGElement(faStore.nfaDotString)
      nfaSvg.value = svg.outerHTML
    } catch (error) {
      console.error('渲染 NFA SVG 失败：', error)
      nfaSvg.value = ''
    }
  }
}

const extractAlphabetFromFAData = (data: Record<string, any>) => {
  const symbols = new Set<string>()
  if (data.table) {
    Object.keys(data.table).forEach((symbol) => {
      if (symbol !== 'I' && symbol !== 'ε' && symbol !== 'epsilon') {
        symbols.add(symbol.replace('I', ''))
      }
    })
  }
  if (symbols.size === 0 && data.table_to_num) {
    Object.keys(data.table_to_num).forEach((symbol) => {
      if (symbol !== 'S') symbols.add(symbol)
    })
  }
  alphabetSymbols.value = Array.from(symbols).sort()
}

const processTableDataToColumns = (table: Record<string, any[]>, symbols: string[]): ConversionTableData => {
  const result: ConversionTableData = {}
  if (!table) return result
  const allColumns = ['I', ...symbols.map((s) => `I${s}`)]
  allColumns.forEach((column) => { result[column] = [] })
  
  const maxRows = Math.max(...allColumns.map(col => Array.isArray(table[col]) ? table[col].length : 0))
  
  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    allColumns.forEach((column) => {
      const colData = table[column]
      if (colData && Array.isArray(colData) && colData[rowIndex]) {
        const cellData = colData[rowIndex]
        result[column].push(Array.isArray(cellData) ? (cellData.join(' ') || '-') : (String(cellData) || '-'))
      } else {
        result[column].push('-')
      }
    })
  }
  return result
}

const processMatrixDataToRows = (tableToNum: Record<string, any[]>, symbols: string[]): TransitionMatrixData => {
  const result: TransitionMatrixData = {}
  if (!tableToNum) return result
  
  const allStates = Object.keys(tableToNum)
  const stateKeys = [...allStates.filter(x => x === 'S'), ...allStates.filter(x => x !== 'S').sort()]
  
  const maxRows = Math.max(...stateKeys.map(state => Array.isArray(tableToNum[state]) ? tableToNum[state].length : 0))
  
  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    const rowKey = rowIndex.toString()
    result[rowKey] = {}
    stateKeys.forEach((state) => {
      const stateData = tableToNum[state]
      result[rowKey][state] = (stateData && Array.isArray(stateData) && stateData[rowIndex]) ? stateData[rowIndex] : '-'
    })
  }
  return result
}

const generateAnswerData = (data: Record<string, any>) => {
  const symbols = new Set<string>()
  if (data.table) {
    Object.keys(data.table).forEach((symbol) => {
      if (symbol !== 'I' && symbol !== 'ε' && symbol !== 'epsilon') symbols.add(symbol.replace('I', ''))
    })
  }
  if (symbols.size === 0 && data.table_to_num) {
    Object.keys(data.table_to_num).forEach((symbol) => {
      if (symbol !== 'S') symbols.add(symbol)
    })
  }
  const symbolArray = Array.from(symbols).sort()
  
  answerConversionTable.value = processTableDataToColumns(data.table, symbolArray)
  answerTransitionMatrix.value = processMatrixDataToRows(data.table_to_num, symbolArray)
  
  conversionTableColumns.value = ['I', ...symbolArray.map((s) => `I${s}`)]
  
  if (data.table_to_num) {
    const allStates = Object.keys(data.table_to_num)
    matrixStateColumns.value = [...allStates.filter(x => x === 'S'), ...allStates.filter(x => x !== 'S').sort()]
  } else {
    matrixStateColumns.value = []
  }
  
  dfaStates.value = answerConversionTable.value['I'] || []
  extractFinalStatePositions(answerConversionTable.value)
}

const toggleTableAnswer = () => { showTableAnswer.value = !showTableAnswer.value }
const toggleMatrixAnswer = () => { showMatrixAnswer.value = !showMatrixAnswer.value }

const initializeDataStructures = () => {
  conversionTableColumns.value.forEach((column) => {
    if (!userConversionTable.value[column]) userConversionTable.value[column] = []
  })
  conversionTableRowCount.value = 0
  
  if (Object.keys(answerTransitionMatrix.value).length > 0) {
    Object.keys(answerTransitionMatrix.value).forEach((rowKey) => {
      if (!userTransitionMatrix.value[rowKey]) userTransitionMatrix.value[rowKey] = {}
      matrixStateColumns.value.forEach((state) => {
        if (!userTransitionMatrix.value[rowKey][state]) userTransitionMatrix.value[rowKey][state] = ''
      })
    })
  } else {
    userTransitionMatrix.value = {}
  }
}

const proceedToNext = () => {
  if (constructionComplete.value) {
    saveStep3Data()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    emit('next-step')
  }
}

onMounted(() => {
  if (!faStore.hasResult()) {
    console.warn('No FA data found, please complete step 1 first')
    return
  }

  try {
    const faResult = faStore.originalData
    if (faResult) {
      extractAlphabetFromFAData(faResult)
      generateAnswerData(faResult)
      initializeDataStructures()
      renderNFASvg()
    }

    const savedStep3Data = faStore.loadStep3Data()
    if (savedStep3Data) {
      userConversionTable.value = savedStep3Data.userConversionTable || {}
      userTransitionMatrix.value = savedStep3Data.userTransitionMatrix || {}
      conversionTableRowCount.value = savedStep3Data.conversionTableRowCount || 0
    } else {
      userConversionTable.value = {}
      userTransitionMatrix.value = {}
      conversionTableRowCount.value = 0
    }
  } catch (error) {
    console.error('处理FA数据失败：', error)
  }
})
</script>

<style scoped>
@keyframes glassAppear {
  from {
    opacity: 0;
    backdrop-filter: blur(0px) saturate(100%);
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(12px) saturate(150%);
    transform: scale(1);
  }
}
</style>
