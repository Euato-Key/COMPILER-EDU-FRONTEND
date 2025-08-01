<template>
  <div class="first-follow-step">
    <div class="px-8 py-8 pb-4 border-b border-gray-200">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Icon icon="lucide:shuffle" class="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">求First集和Follow集</h2>
          <p class="text-gray-600 mt-1">第二步：计算文法中所有非终结符的First集和Follow集</p>
        </div>
      </div>
    </div>

    <div class="px-8 py-8">
      <div v-if="!originalData" class="max-w-4xl mx-auto text-center py-12">
        <div class="text-gray-500">
          <Icon icon="lucide:alert-circle" class="w-12 h-12 mx-auto mb-4" />
          <p class="text-lg">请先完成第一步：输入文法</p>
        </div>
      </div>
      <div v-else class="max-w-7xl mx-auto">
        <!-- 说明指引 -->
        <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100 shadow-sm">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <Icon icon="lucide:info" class="w-4 h-4 text-white" />
          </div>
            <h3 class="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">填写说明</h3>
          </div>

          <!-- 颜色图例 -->
          <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200/50 mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Icon icon="lucide:palette" class="w-4 h-4 mr-2 text-blue-500" />
              状态说明
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="flex items-center gap-2 p-2 rounded-md bg-gray-50 border border-gray-200">
                <div class="w-3 h-3 bg-gray-300 rounded-sm shadow-sm"></div>
                <span class="text-xs font-medium text-gray-600">已知信息</span>
              </div>
              <div class="flex items-center gap-2 p-2 rounded-md bg-amber-50 border border-amber-200">
                <div class="w-3 h-3 bg-gradient-to-r from-amber-300 to-orange-300 rounded-sm shadow-sm"></div>
                <span class="text-xs font-medium text-amber-700">待填写</span>
              </div>
              <div class="flex items-center gap-2 p-2 rounded-md bg-green-50 border border-green-200">
                <div class="w-3 h-3 bg-green-400 rounded-sm shadow-sm"></div>
                <span class="text-xs font-medium text-green-700">校验正确</span>
              </div>
              <div class="flex items-center gap-2 p-2 rounded-md bg-red-50 border border-red-200">
                <div class="w-3 h-3 bg-red-400 rounded-sm shadow-sm"></div>
                <span class="text-xs font-medium text-red-700">校验错误</span>
              </div>
            </div>
          </div>

          <!-- 填写规则 -->
          <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200/50">
            <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Icon icon="lucide:edit-3" class="w-4 h-4 mr-2 text-blue-500" />
              填写规则
            </h4>
            <div class="space-y-2 text-sm text-gray-600">
              <p class="text-gray-700 font-medium">根据非终结符、终结符和产生式等已知信息，填写First集和Follow集合。</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div class="flex items-center gap-2">
                  <Icon icon="lucide:check" class="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>多个符号用空格分隔（如：<span class="font-mono text-blue-600">a b c</span>）</span>
            </div>
            <div class="flex items-center gap-2">
                  <Icon icon="lucide:check" class="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>空符号用 <span class="font-mono text-pink-600">ε</span> 表示</span>
            </div>
            <div class="flex items-center gap-2">
                  <Icon icon="lucide:check" class="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>注意字符的大小写</span>
            </div>
            <div class="flex items-center gap-2">
                  <Icon icon="lucide:check" class="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span class="text-blue-600 font-medium">可通过拖拽输入和双击符号卡片复制内容</span>
            </div>
          </div>
            </div>
          </div>
        </div>

        <!-- 已知信息区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <!-- 非终结符 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="lucide:tag" class="w-4 h-4 mr-2 text-purple-600" />
              非终结符 Vn
            </h3>
            <div class="flex flex-wrap gap-2">
              <!-- 拖拽：非终结符卡片 -->
              <span
                v-for="symbol in originalData.Vn"
                :key="'vn-' + symbol"
                :class="[
                  'flex items-center justify-center rounded-full font-mono text-base w-10 h-10 cursor-move shadow hover:bg-purple-200 transition-all select-none',
                  symbolHighlightState[symbol]
                    ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg scale-110 animate-pulse'
                    : 'bg-purple-100 text-purple-800'
                ]"
                draggable="true"
                @dragstart="onDragStart(symbol, $event)"
                @dblclick="onSymbolDblClick(symbol)"
                :data-symbol="symbol"
              >
                {{ symbol }}
              </span>
            </div>
          </div>

          <!-- 终结符 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="lucide:hash" class="w-4 h-4 mr-2 text-green-600" />
              终结符 Vt
            </h3>
            <div class="flex flex-wrap gap-2">
              <!-- 拖拽：终结符卡片 -->
              <span
                v-for="symbol in originalData.Vt"
                :key="'vt-' + symbol"
                :class="[
                  'flex items-center justify-center rounded-full font-mono text-base w-10 h-10 cursor-move shadow hover:bg-green-200 transition-all select-none',
                  symbolHighlightState[symbol]
                    ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg scale-110 animate-pulse'
                    : 'bg-green-100 text-green-800'
                ]"
                draggable="true"
                @dragstart="onDragStart(symbol, $event)"
                @dblclick="onSymbolDblClick(symbol)"
                :data-symbol="symbol"
              >
                {{ symbol }}
              </span>
            </div>
          </div>

          <!-- 其他符号 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="lucide:circle" class="w-4 h-4 mr-2 text-pink-600" />
              其他符号
            </h3>
            <div class="flex flex-wrap gap-2">
              <!-- 拖拽：空串ε -->
              <span
                :class="[
                  'flex items-center justify-center rounded-full font-mono text-base w-10 h-10 cursor-move shadow hover:bg-pink-200 transition-all select-none',
                  symbolHighlightState['ε']
                    ? 'bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg scale-110 animate-pulse'
                    : 'bg-pink-100 text-pink-800'
                ]"
                draggable="true"
                @dragstart="onDragStart('ε', $event)"
                @dblclick="onSymbolDblClick('ε')"
                data-symbol="ε"
              >
                ε
              </span>
              <!-- 拖拽：输入结束符# -->
              <span
                :class="[
                  'flex items-center justify-center rounded-full font-mono text-base w-10 h-10 cursor-move shadow hover:bg-blue-200 transition-all select-none',
                  symbolHighlightState['#']
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg scale-110 animate-pulse'
                    : 'bg-blue-100 text-blue-800'
                ]"
                draggable="true"
                @dragstart="onDragStart('#', $event)"
                @dblclick="onSymbolDblClick('#')"
                data-symbol="#"
              >
                #
              </span>
            </div>
          </div>

          <!-- 产生式 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="lucide:list" class="w-4 h-4 mr-2 text-blue-600" />
              产生式
            </h3>
            <div class="space-y-1">
              <div
                v-for="(productions, nonTerminal) in originalData.formulas_dict"
                :key="'prod-' + nonTerminal"
              >
                <div
                  v-for="(production, index) in productions"
                  :key="'prod-' + nonTerminal + '-' + index"
                  :class="[
                    'text-sm p-1 rounded transition-all',
                    productionHighlightState[`${nonTerminal}->${production}`]
                      ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 shadow-sm'
                      : ''
                  ]"
              >
                <span class="font-mono text-blue-600">{{ nonTerminal }}</span>
                  <span class="text-gray-500 mx-1">-></span>
                  <span class="font-mono text-gray-700">{{ production }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- First集和Follow集填写区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- First集 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-base font-semibold text-gray-900 flex items-center">
                <Icon icon="lucide:arrow-right" class="w-4 h-4 mr-2 text-blue-600" />
                First集合（非终结符）
              </h3>
              <div class="flex gap-2">
                <button
                  @click="clearFirstSets"
                  class="inline-flex items-center px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all duration-200"
                >
                  <Icon icon="lucide:refresh-cw" class="w-3 h-3 mr-1" />
                  清空重填
                </button>
                <button
                  @click="checkFirstSets"
                  :disabled="loading.first"
                  class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-xs"
                >
                  <Icon v-if="loading.first" icon="lucide:loader-2" class="w-3 h-3 animate-spin mr-1" />
                  <Icon v-else icon="lucide:check-circle" class="w-3 h-3 mr-1" />
                  校验
                </button>
                <button
                  @click="showFirstAnswer = !showFirstAnswer"
                  class="inline-flex items-center px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all duration-200"
                >
                  <Icon v-if="showFirstAnswer" icon="lucide:eye-off" class="w-3 h-3 mr-1" />
                  <Icon v-else icon="lucide:eye" class="w-3 h-3 mr-1" />
                  {{ showFirstAnswer ? '隐藏答案' : '显示答案' }}
                </button>
              </div>
            </div>

                <div class="space-y-2">
              <!-- 非终结符的First集 -->
              <div class="mb-3">
                <h4 class="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="lucide:tag" class="w-3 h-3 text-blue-500" />
                  非终结符
                </h4>
                <div class="space-y-1.5">
              <div
                v-for="symbol in originalData.Vn"
                    :key="'first-vn-' + symbol"
                    class="flex items-center gap-2"
              >
                    <span class="w-16 text-xs font-medium text-gray-600">
                  first(<span class="font-mono text-blue-600">{{ symbol }}</span>) =
                </span>
                <div class="flex-1 relative">
                  <input
                    v-model="userFirstSets[symbol]"
                    type="text"
                    placeholder="输入First集，用空格分隔"
                    :class="[
                          'w-full px-2.5 py-1.5 text-xs border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 font-mono bg-gradient-to-r from-gray-50 to-white',
                      getInputClass('first', symbol)
                    ]"
                    @focus="clearValidation('first', symbol)"
                        :data-input="symbol"
                  />
                  <div class="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Icon
                      v-if="firstValidation[symbol] === 'correct'"
                      icon="lucide:check"
                          class="w-3.5 h-3.5 text-green-500"
                    />
                    <Icon
                      v-else-if="firstValidation[symbol] === 'incorrect'"
                      icon="lucide:x"
                          class="w-3.5 h-3.5 text-red-500"
                    />
                      </div>
                    </div>
                    <button
                      @click="executeHintAnimation(symbol)"
                      :disabled="hintState.isActive || firstValidation[symbol] === 'correct'"
                      class="inline-flex items-center px-1.5 py-1 text-xs font-medium text-orange-600 bg-white border border-orange-200 rounded-md shadow-sm hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-1 focus:ring-orange-300 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Icon icon="lucide:lightbulb" class="w-2.5 h-2.5 mr-0.5" />
                      提示
                    </button>
                  </div>
                </div>
              </div>


            </div>

            <!-- First集答案提示 -->
            <div v-if="showFirstAnswer" class="mt-3 p-3 bg-green-50 rounded-lg">
              <h4 class="text-xs font-medium text-green-800 mb-2">正确答案：</h4>
              <div class="space-y-1.5">
                <!-- 非终结符答案 -->
                <div>
                  <h5 class="text-xs font-medium text-green-700 mb-1">非终结符：</h5>
                  <div class="space-y-0.5">
                <div
                  v-for="symbol in originalData.Vn"
                      :key="'answer-first-vn-' + symbol"
                      class="text-xs"
                >
                  <span class="font-mono text-green-600">{{ symbol }}:</span>
                  <span class="ml-2 text-green-700">{{ correctFirstSets[symbol]?.join(' ') || 'ε' }}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Follow集 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
              <h3 class="text-base font-semibold text-gray-900 flex items-center">
                <Icon icon="lucide:arrow-left" class="w-4 h-4 mr-2 text-green-600" />
                Follow集合
              </h3>
              </div>
              <div class="flex gap-2">
                <button
                  @click="clearFollowSets"
                  class="inline-flex items-center px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-300 transition-all duration-200"
                >
                  <Icon icon="lucide:refresh-cw" class="w-3 h-3 mr-1" />
                  清空重填
                </button>
                <button
                  @click="checkFollowSets"
                  :disabled="loading.follow || !firstStepCompleted"
                  class="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors text-xs"
                >
                  <Icon v-if="loading.follow" icon="lucide:loader-2" class="w-3 h-3 animate-spin mr-1" />
                  <Icon v-else icon="lucide:check-circle" class="w-3 h-3 mr-1" />
                  校验
                </button>
                <button
                  @click="showFollowAnswer = !showFollowAnswer"
                  :disabled="!firstStepCompleted"
                  class="inline-flex items-center px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-300 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <Icon v-if="showFollowAnswer" icon="lucide:eye-off" class="w-3 h-3 mr-1" />
                  <Icon v-else icon="lucide:eye" class="w-3 h-3 mr-1" />
                  {{ showFollowAnswer ? '隐藏答案' : '显示答案' }}
                </button>
              </div>
            </div>

            <div class="space-y-1.5">
              <div
                v-for="symbol in originalData.Vn"
                :key="'follow-' + symbol"
                class="flex items-center gap-2"
              >
                <span class="w-16 text-xs font-medium text-gray-600">
                  follow(<span class="font-mono text-green-600">{{ symbol }}</span>) =
                </span>
                <div class="flex-1 relative">
                  <input
                    v-model="userFollowSets[symbol]"
                    type="text"
                    placeholder="输入Follow集，用空格分隔"
                    :disabled="!firstStepCompleted"
                    :class="[
                      'w-full px-2.5 py-1.5 text-xs border-2 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all duration-200 font-mono bg-gradient-to-r from-gray-50 to-white',
                      getInputClass('follow', symbol),
                      !firstStepCompleted && 'bg-gray-100 cursor-not-allowed'
                    ]"
                    :data-input="`follow-${symbol}`"
                    @focus="clearValidation('follow', symbol)"
                  />
                  <div class="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Icon
                      v-if="followValidation[symbol] === 'correct'"
                      icon="lucide:check"
                      class="w-3.5 h-3.5 text-green-500"
                    />
                    <Icon
                      v-else-if="followValidation[symbol] === 'incorrect'"
                      icon="lucide:x"
                      class="w-3.5 h-3.5 text-red-500"
                    />
                  </div>
                </div>
                <button
                  @click="executeFollowHintAnimation(symbol)"
                  :disabled="hintState.isActive || !firstStepCompleted || followValidation[symbol] === 'correct'"
                  class="inline-flex items-center px-1.5 py-1 text-xs font-medium text-orange-600 bg-white border border-orange-200 rounded-md shadow-sm hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-1 focus:ring-orange-300 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <Icon icon="lucide:lightbulb" class="w-2.5 h-2.5 mr-0.5" />
                  提示
                </button>
              </div>
            </div>

            <!-- Follow集答案提示 -->
            <div v-if="showFollowAnswer" class="mt-3 p-3 bg-green-50 rounded-lg">
              <h4 class="text-xs font-medium text-green-800 mb-2">正确答案：</h4>
              <div class="space-y-0.5">
                <div
                  v-for="symbol in originalData.Vn"
                  :key="'answer-follow-' + symbol"
                  class="text-xs"
                >
                  <span class="font-mono text-green-600">{{ symbol }}:</span>
                  <span class="ml-2 text-green-700">{{ correctFollowSets[symbol]?.join(' ') || '$' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 计算提示 -->
        <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100 shadow-sm">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Icon icon="lucide:lightbulb" class="w-4 h-4 text-white" />
            </div>
            <h4 class="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">计算提示</h4>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200/50">
              <h5 class="font-semibold text-blue-800 mb-3 flex items-center">
                <Icon icon="lucide:arrow-right" class="w-4 h-4 mr-2 text-blue-600" />
                First集计算规则
              </h5>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span :class="[
                    ruleHighlightState['终结符X：First(X) = {X}']
                      ? 'bg-gradient-to-r from-blue-100 to-blue-200 px-2 py-1 rounded font-medium'
                      : ''
                  ]">终结符X：<span class="font-mono text-blue-600">First(X) = {X}</span></span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span :class="[
                    ruleHighlightState['产生式X→ε：ε ∈ First(X)']
                      ? 'bg-gradient-to-r from-blue-100 to-blue-200 px-2 py-1 rounded font-medium'
                      : ''
                  ]">产生式X→ε：<span class="font-mono text-blue-600">ε ∈ First(X)</span></span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span :class="[
                    ruleHighlightState['产生式X→Y₁Y₂...Yₖ：First(Y₁)中非ε符号 ∈ First(X)']
                      ? 'bg-gradient-to-r from-blue-100 to-blue-200 px-2 py-1 rounded font-medium'
                      : ''
                  ]">产生式X→Y₁Y₂...Yₖ：<span class="font-mono text-blue-600">First(Y₁)中非ε符号 ∈ First(X)</span></span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span :class="[
                    ruleHighlightState['若ε ∈ First(Y₁)，则First(Y₂)中非ε符号 ∈ First(X)']
                      ? 'bg-gradient-to-r from-blue-100 to-blue-200 px-2 py-1 rounded font-medium'
                      : ''
                  ]">若ε ∈ First(Y₁)，则<span class="font-mono text-blue-600">First(Y₂)中非ε符号 ∈ First(X)</span></span>
                </li>
              </ul>
            </div>
            <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-purple-200/50">
              <h5 class="font-semibold text-purple-800 mb-3 flex items-center">
                <Icon icon="lucide:arrow-left" class="w-4 h-4 mr-2 text-purple-600" />
                Follow集计算规则
              </h5>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span :class="[
                    ruleHighlightState['开始符号S：# ∈ Follow(S)']
                      ? 'bg-gradient-to-r from-purple-100 to-purple-200 px-2 py-1 rounded font-medium'
                      : ''
                  ]">开始符号S：<span class="font-mono text-purple-600"># ∈ Follow(S)</span></span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span :class="[
                    ruleHighlightState['产生式A→αBβ：First(β)中非ε符号 ∈ Follow(B)']
                      ? 'bg-gradient-to-r from-purple-100 to-purple-200 px-2 py-1 rounded font-medium'
                      : ''
                  ]">产生式A→αBβ：<span class="font-mono text-purple-600">First(β)中非ε符号 ∈ Follow(B)</span></span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span :class="[
                    ruleHighlightState['产生式A→αB或A→αBβ且ε∈First(β)：Follow(A) ⊆ Follow(B)']
                      ? 'bg-gradient-to-r from-purple-100 to-purple-200 px-2 py-1 rounded font-medium'
                      : ''
                  ]">产生式A→αB或A→αBβ且ε∈First(β)：<span class="font-mono text-purple-600">Follow(A) ⊆ Follow(B)</span></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 进度提示 -->
        <div v-if="allCompleted" class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex items-center">
            <Icon icon="lucide:check-circle" class="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p class="text-lg font-medium text-green-800">恭喜！First集和Follow集验证成功</p>
              <p class="text-sm text-green-600 mt-1">可以进入下一步构建LL1分析表</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-8 py-4 pb-8 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center">
        <button
          @click="$emit('prev-step')"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>
        <div class="text-sm text-gray-500">步骤 2 / 4</div>
        <button
          @click="$emit('next-step')"
          :disabled="!allCompleted"
          :class="[
            'px-6 py-2 rounded-lg transition-colors flex items-center gap-2',
            allCompleted
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          下一步
          <Icon icon="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="copyTip" class="fixed top-8 right-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 bg-green-600 text-white">
        <Icon icon="lucide:copy" class="w-5 h-5" />
        <span>{{ copyTip }}</span>
      </div>
    </transition>

    <!-- 飞行动画元素 -->
    <transition
      v-for="flyingSymbol in hintState.flyingSymbols"
      :key="`flying-${flyingSymbol.symbol}-${flyingSymbol.target}`"
      enter-active-class="transition-all duration-2000 ease-out"
      leave-active-class="transition-all duration-500 ease-in"
      enter-from-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-50"
    >
      <div
        v-if="flyingSymbol"
        class="fixed z-50 pointer-events-none flying-symbol"
        :style="{
          left: flyingSymbol.x + 'px',
          top: flyingSymbol.y + 'px'
        }"
      >
        <div
          :class="[
            'flex items-center justify-center rounded-full font-mono text-base w-10 h-10 shadow-lg border-2 border-white',
            flyingSymbol.symbol === 'ε' ? 'bg-pink-100 text-pink-800' :
            flyingSymbol.symbol === '#' ? 'bg-blue-100 text-blue-800' :
            /[A-Z]/.test(flyingSymbol.symbol) ? 'bg-purple-100 text-purple-800' :
            'bg-green-100 text-green-800'
          ]"
        >
          {{ flyingSymbol.symbol }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useLL1Store } from '@/stores/ll1'

defineEmits<{
  'next-step': []
  'prev-step': []
}>()

// 使用pinia store
const ll1Store = useLL1Store()

// 数据引用
const originalData = computed(() => ll1Store.originalData)
const correctFirstSets = computed(() => ll1Store.firstSets)
const correctFollowSets = computed(() => ll1Store.followSets)

// 用户输入的集合
const userFirstSets = ref<Record<string, string>>({})
const userFollowSets = ref<Record<string, string>>({})

// 验证状态
const firstValidation = ref<Record<string, 'correct' | 'incorrect' | ''>>({})
const followValidation = ref<Record<string, 'correct' | 'incorrect' | ''>>({})

// 加载状态
const loading = ref({
  first: false,
  follow: false
})

// 显示答案
const showFirstAnswer = ref(false)
const showFollowAnswer = ref(false)

// 提示功能相关状态
const hintState = ref({
  isActive: false,
  currentSymbol: '',
  highlightedSymbols: [] as string[],
  highlightedProductions: [] as string[],
  highlightedRules: [] as string[],
  flyingSymbols: [] as { symbol: string; target: string; x: number; y: number }[]
})

// 高亮状态
const symbolHighlightState = ref<Record<string, boolean>>({})
const productionHighlightState = ref<Record<string, boolean>>({})
const ruleHighlightState = ref<Record<string, boolean>>({})

// 尝试次数
const firstAttempts = ref(0)
const maxAttempts = 3

// 完成状态 - 修改为允许三次尝试后继续
const firstStepCompleted = computed(() => {
  // 如果First集全部正确，或者已经尝试了3次，都允许继续
  return originalData.value?.Vn.every(symbol => firstValidation.value[symbol] === 'correct') || firstAttempts.value >= maxAttempts
})

// 监听First集完成状态，如果未完成则隐藏Follow集答案
watch(firstStepCompleted, (completed: boolean) => {
  if (!completed) {
    showFollowAnswer.value = false
  }
})

const allCompleted = computed(() => {
  const firstCompleted = originalData.value?.Vn.every(symbol => firstValidation.value[symbol] === 'correct') || false
  const followCompleted = originalData.value?.Vn.every(symbol => followValidation.value[symbol] === 'correct') || false
  return firstCompleted && followCompleted
})

// 复制提示
const copyTip = ref('')
let copyTipTimer: number | null = null

// 工具函数
const areCharacterSetsEqual = (str1: string, str2: string): boolean => {
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

const getInputClass = (type: 'first' | 'follow', symbol: string): string => {
  const validation = type === 'first' ? firstValidation.value[symbol] : followValidation.value[symbol]

  if (validation === 'correct') {
    return 'border-green-400 bg-green-50 shadow-sm'
  } else if (validation === 'incorrect') {
    return 'border-red-400 bg-red-50 shadow-sm'
  }
  return 'border-gray-300 bg-gradient-to-r from-amber-50 to-orange-50'
}

const clearValidation = (type: 'first' | 'follow', symbol: string) => {
  if (type === 'first') {
    if (firstValidation.value[symbol] !== 'correct') {
      firstValidation.value[symbol] = ''
    }
  } else {
    if (followValidation.value[symbol] !== 'correct') {
      followValidation.value[symbol] = ''
    }
  }
}

// 校验函数
const checkFirstSets = async () => {
  if (!originalData.value) return

  loading.value.first = true
  firstAttempts.value++ // 尝试次数加1

  try {
    for (const symbol of originalData.value.Vn) {
      const userInput = userFirstSets.value[symbol] || ''
      const correctSet = correctFirstSets.value[symbol] || []
      const correctSetStr = correctSet.join(' ')

      if (areCharacterSetsEqual(userInput, correctSetStr)) {
        firstValidation.value[symbol] = 'correct'
      } else {
        firstValidation.value[symbol] = 'incorrect'
      }
    }
  } finally {
    loading.value.first = false
  }
}

const checkFollowSets = async () => {
  if (!originalData.value) return

  loading.value.follow = true

  try {
    for (const symbol of originalData.value.Vn) {
      const userInput = userFollowSets.value[symbol] || ''
      const correctSet = correctFollowSets.value[symbol] || []
      const correctSetStr = correctSet.join(' ')

      if (areCharacterSetsEqual(userInput, correctSetStr)) {
        followValidation.value[symbol] = 'correct'
      } else {
        followValidation.value[symbol] = 'incorrect'
      }
    }
  } finally {
    loading.value.follow = false
  }
}

// 清空用户输入
const clearFirstSets = () => {
  if (originalData.value?.Vn) {
    originalData.value.Vn.forEach(symbol => {
      userFirstSets.value[symbol] = ''
      firstValidation.value[symbol] = ''
    })
    showFirstAnswer.value = false
    firstAttempts.value = 0 // 重置尝试次数
  }
}

const clearFollowSets = () => {
  if (originalData.value?.Vn) {
    originalData.value.Vn.forEach(symbol => {
      userFollowSets.value[symbol] = ''
      followValidation.value[symbol] = ''
    })
    showFollowAnswer.value = false
  }
}

// 拖拽事件处理函数，供所有卡片使用
function onDragStart(symbol: string, event: DragEvent) {
  // 将符号内容写入拖拽数据
  event.dataTransfer?.setData('text/plain', symbol)
}

// 双击符号卡片复制到剪贴板并弹出提示
function onSymbolDblClick(symbol: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(symbol).then(() => {
      showCopyTip(`已复制：${symbol}`)
    })
  } else {
    // 兼容性处理
    const textarea = document.createElement('textarea')
    textarea.value = symbol
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showCopyTip(`已复制：${symbol}`)
  }
}

function showCopyTip(msg: string) {
  copyTip.value = msg
  if (copyTipTimer) clearTimeout(copyTipTimer)
  copyTipTimer = window.setTimeout(() => {
    copyTip.value = ''
  }, 1200)
}

// 提示功能计算逻辑
const calculateFirstSetHint = (symbol: string) => {
  if (!originalData.value) return null

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
  const productions = originalData.value.formulas_dict[symbol] || []

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
        const firstSetOfFirstChar = calculateFirstSetForSymbol(firstChar)
        if (firstSetOfFirstChar.length > 0) {
          result.steps.push({
            type: 'production',
            description: `产生式${symbol}→${firstChar}：First(${firstChar})中非ε符号 ∈ First(${symbol})`,
            productions: [`${symbol}->${firstChar}`, ...getProductionsForSymbol(firstChar)],
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
      const derivationPaths = calculateDerivationPaths(symbol, production)
      result.steps.push(...derivationPaths)
    }
  }

  return result
}

// 计算多字符产生式的所有推导路径
const calculateDerivationPaths = (symbol: string, production: string) => {
  const paths: Array<{
    type: 'terminal' | 'epsilon' | 'production',
    description: string,
    productions: string[],
    rules: string[],
    symbols: string[],
    finalSymbols: string[]
  }> = []

  console.log(`计算 ${symbol}->${production} 的推导路径`)

  // 分析每个位置的字符
  for (let i = 0; i < production.length; i++) {
    const char = production[i]
    console.log(`处理位置 ${i+1} 的字符: ${char}`)

    if (isTerminal(char)) {
      // 终结符 - 直接添加
      console.log(`找到终结符 ${char}`)
      paths.push({
        type: 'terminal',
        description: `产生式${symbol}→${production}：位置${i+1}的终结符${char} ∈ First(${symbol})`,
        productions: [`${symbol}->${production}`],
        rules: ['终结符X：First(X) = {X}'],
        symbols: [char],
        finalSymbols: [char]
      })
      break // 遇到终结符就停止
    } else if (isNonTerminal(char)) {
      // 非终结符 - 计算其First集
      const firstSetOfChar = calculateFirstSetForSymbol(char)
      const nonEpsilonSymbols = firstSetOfChar.filter(s => s !== 'ε')

      console.log(`非终结符 ${char} 的First集: ${firstSetOfChar.join(', ')}`)
      console.log(`非ε符号: ${nonEpsilonSymbols.join(', ')}`)

      if (nonEpsilonSymbols.length > 0) {
        // 添加非ε符号的推导路径
        console.log(`添加推导路径，最终符号: ${nonEpsilonSymbols.join(', ')}`)
        paths.push({
          type: 'production',
          description: `产生式${symbol}→${production}：位置${i+1}的First(${char})中非ε符号 ∈ First(${symbol})`,
          productions: [`${symbol}->${production}`, ...getProductionsForSymbol(char)],
          rules: ['产生式X→Y₁Y₂...Yₖ：First(Y₁)中非ε符号 ∈ First(X)'],
          symbols: [char, ...firstSetOfChar],
          finalSymbols: nonEpsilonSymbols
        })
      }

      // 如果这个非终结符的First集不包含ε，就停止
      if (!firstSetOfChar.includes('ε')) {
        console.log(`${char} 的First集不包含ε，停止处理`)
        break
      }
      // 如果包含ε，继续处理下一个字符
      console.log(`${char} 的First集包含ε，继续处理下一个字符`)
    } else {
      // 其他符号（如标点符号、界符等）
      console.log(`找到其他符号 ${char}`)
      paths.push({
        type: 'terminal',
        description: `产生式${symbol}→${production}：位置${i+1}的其他符号${char} ∈ First(${symbol})`,
        productions: [`${symbol}->${production}`],
        rules: ['终结符X：First(X) = {X}'],
        symbols: [char],
        finalSymbols: [char]
      })
      break // 遇到其他符号就停止
    }
  }

  console.log(`总共找到 ${paths.length} 个推导路径`)
  return paths
}

// 判断是否为非终结符（与后端逻辑保持一致）
const isNonTerminal = (symbol: string): boolean => {
  return symbol.length === 1 && symbol.toUpperCase() === symbol && symbol !== 'ε'
}

// 判断是否为终结符（与后端逻辑保持一致）
const isTerminal = (symbol: string): boolean => {
  return symbol.length === 1 && symbol.toLowerCase() === symbol && symbol !== 'ε'
}

// 计算某个符号的First集（递归）- 修复版本
const calculateFirstSetForSymbol = (symbol: string, visited: Set<string> = new Set()): string[] => {
  if (!originalData.value) return []

  // 防止循环依赖
  if (visited.has(symbol)) {
    console.log(`检测到循环依赖: ${symbol}`)
    return []
  }

  console.log(`计算 ${symbol} 的First集`)

  // 如果是终结符，直接返回自身
  if (isTerminal(symbol)) {
    console.log(`${symbol} 是终结符，返回 {${symbol}}`)
    return [symbol]
  }

  // 如果是ε，直接返回ε
  if (symbol === 'ε') {
    console.log(`ε 的First集是 {ε}`)
    return ['ε']
  }

  // 如果是非终结符，计算其First集
  if (isNonTerminal(symbol)) {
    const result: string[] = []
    const productions = originalData.value.formulas_dict[symbol] || []

    // 添加当前符号到已访问集合
    visited.add(symbol)

    for (const production of productions) {
      console.log(`处理产生式: ${symbol}->${production}`)

      if (production === 'ε') {
        console.log(`添加 ε 到 ${symbol} 的First集`)
        result.push('ε')
      } else if (production.length === 1) {
        const firstChar = production[0]
        if (isTerminal(firstChar)) {
          console.log(`添加终结符 ${firstChar} 到 ${symbol} 的First集`)
          result.push(firstChar)
        } else if (isNonTerminal(firstChar)) {
          // 递归计算非终结符的First集
          console.log(`递归计算 ${firstChar} 的First集`)
          const subFirstSet = calculateFirstSetForSymbol(firstChar, new Set(visited))
          console.log(`${firstChar} 的First集: ${subFirstSet.join(', ')}`)
          result.push(...subFirstSet)
        } else {
          // 其他符号（如标点符号、界符等）
          console.log(`添加其他符号 ${firstChar} 到 ${symbol} 的First集`)
          result.push(firstChar)
        }
      } else {
        // 多字符产生式，需要处理每个字符
        console.log(`处理多字符产生式: ${production}`)
        let allEpsilon = true
        for (let i = 0; i < production.length; i++) {
          const char = production[i]
          console.log(`处理字符 ${char} (位置 ${i+1})`)

          if (isTerminal(char)) {
            console.log(`添加终结符 ${char} 到 ${symbol} 的First集`)
            result.push(char)
            allEpsilon = false
            break // 遇到终结符就停止
          } else if (isNonTerminal(char)) {
            console.log(`递归计算 ${char} 的First集`)
            const subFirstSet = calculateFirstSetForSymbol(char, new Set(visited))
            const nonEpsilonSymbols = subFirstSet.filter(s => s !== 'ε')
            console.log(`${char} 的First集: ${subFirstSet.join(', ')}, 非ε符号: ${nonEpsilonSymbols.join(', ')}`)
            result.push(...nonEpsilonSymbols)

            if (!subFirstSet.includes('ε')) {
              console.log(`${char} 的First集不包含ε，停止处理`)
              allEpsilon = false
              break // 如果这个非终结符的First集不包含ε，就停止
            }
          } else {
            // 其他符号（如标点符号、界符等）
            console.log(`添加其他符号 ${char} 到 ${symbol} 的First集`)
            result.push(char)
            allEpsilon = false
            break // 遇到其他符号就停止
          }
        }

        // 如果所有字符都能推导出ε，那么ε也在First集中
        if (allEpsilon) {
          console.log(`所有字符都能推导出ε，添加 ε 到 ${symbol} 的First集`)
          result.push('ε')
        }
      }
    }

    // 去重
    const uniqueResult = [...new Set(result)]
    console.log(`${symbol} 的最终First集: ${uniqueResult.join(', ')}`)
    return uniqueResult
  }

  // 其他情况，返回空数组
  console.log(`${symbol} 不是有效的符号`)
  return []
}

// 计算字符串的First集（用于多字符字符串）
const calculateStringFirstSet = (str: string, visited: Set<string> = new Set()): string[] => {
  if (!originalData.value) return []

  console.log(`计算字符串 "${str}" 的First集`)

  // 如果是空字符串，返回ε
  if (str === '') {
    return ['ε']
  }

  // 如果是单个字符，直接计算
  if (str.length === 1) {
    return calculateFirstSetForSymbol(str, visited)
  }

  // 多字符字符串，按顺序处理每个字符
  const result: string[] = []
  let allEpsilon = true

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    console.log(`处理字符串位置 ${i+1} 的字符: ${char}`)

    if (isTerminal(char)) {
      console.log(`添加终结符 ${char} 到字符串的First集`)
      result.push(char)
      allEpsilon = false
      break // 遇到终结符就停止
    } else if (isNonTerminal(char)) {
      console.log(`递归计算 ${char} 的First集`)
      const subFirstSet = calculateFirstSetForSymbol(char, new Set(visited))
      const nonEpsilonSymbols = subFirstSet.filter(s => s !== 'ε')
      console.log(`${char} 的First集: ${subFirstSet.join(', ')}, 非ε符号: ${nonEpsilonSymbols.join(', ')}`)
      result.push(...nonEpsilonSymbols)

      if (!subFirstSet.includes('ε')) {
        console.log(`${char} 的First集不包含ε，停止处理`)
        allEpsilon = false
        break // 如果这个非终结符的First集不包含ε，就停止
      }
    } else {
      // 其他符号（如标点符号、界符等）
      console.log(`添加其他符号 ${char} 到字符串的First集`)
      result.push(char)
      allEpsilon = false
      break // 遇到其他符号就停止
    }
  }

  // 如果所有字符都能推导出ε，那么ε也在First集中
  if (allEpsilon) {
    console.log(`所有字符都能推导出ε，添加 ε 到字符串的First集`)
    result.push('ε')
  }

  // 去重
  const uniqueResult = [...new Set(result)]
  console.log(`字符串 "${str}" 的最终First集: ${uniqueResult.join(', ')}`)
  return uniqueResult
}

// 获取某个符号的所有产生式
const getProductionsForSymbol = (symbol: string): string[] => {
  if (!originalData.value) return []

  const productions = originalData.value.formulas_dict[symbol] || []
  return productions.map(prod => `${symbol}->${prod}`)
}

// 执行提示动画
const executeHintAnimation = async (symbol: string) => {
  if (!originalData.value) return

  hintState.value.isActive = true
  hintState.value.currentSymbol = symbol

  const hint = calculateFirstSetHint(symbol)
  if (!hint) return

  // 1. 高亮当前符号
  symbolHighlightState.value[symbol] = true
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 2. 逐步执行每个步骤，一次只显示一个符号
  for (let i = 0; i < hint.steps.length; i++) {
    const step = hint.steps[i]

    // 高亮相关产生式
    step.productions.forEach(prod => {
      productionHighlightState.value[prod] = true
    })

    // 高亮相关规则
    step.rules.forEach(rule => {
      ruleHighlightState.value[rule] = true
    })

    // 高亮相关符号
    step.symbols.forEach(sym => {
      symbolHighlightState.value[sym] = true
    })

    await new Promise(resolve => setTimeout(resolve, 1500))

    // 执行飞行动画 - 只对终结符和空串执行
    if (step.type === 'terminal' || step.type === 'epsilon') {
      await executeFlyingAnimation(symbol, step.finalSymbols[0])
    } else if (step.type === 'production' && step.finalSymbols.length > 0) {
      // 对于产生式类型，为每个最终符号执行飞行动画
      for (const finalSymbol of step.finalSymbols) {
        await executeFlyingAnimation(symbol, finalSymbol)
        // 等待一小段时间再执行下一个符号
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // 清除高亮
    step.productions.forEach(prod => {
      productionHighlightState.value[prod] = false
    })
    step.rules.forEach(rule => {
      ruleHighlightState.value[rule] = false
    })
    step.symbols.forEach(sym => {
      if (sym !== symbol) {
        symbolHighlightState.value[sym] = false
      }
    })

    // 等待更长时间，让用户看清每个符号
    await new Promise(resolve => setTimeout(resolve, 800))
  }

  // 清除所有高亮
  Object.keys(symbolHighlightState.value).forEach(key => {
    symbolHighlightState.value[key] = false
  })
  Object.keys(productionHighlightState.value).forEach(key => {
    productionHighlightState.value[key] = false
  })
  Object.keys(ruleHighlightState.value).forEach(key => {
    ruleHighlightState.value[key] = false
  })

  hintState.value.isActive = false
}

// 执行飞行动画 - 修改为更慢的动画
const executeFlyingAnimation = async (targetSymbol: string, flyingSymbol: string) => {
  // 计算起始位置（符号区）和目标位置（答题框）
  const symbolElement = document.querySelector(`[data-symbol="${flyingSymbol}"]`) as HTMLElement
  const targetElement = document.querySelector(`[data-input="${targetSymbol}"]`) as HTMLElement

  if (!symbolElement || !targetElement) {
    // 如果找不到元素，直接填写答案
    const currentValue = userFirstSets.value[targetSymbol] || ''
    const currentSymbols = currentValue.split(' ').filter(s => s.trim())
    if (!currentSymbols.includes(flyingSymbol)) {
      const newValue = currentValue ? `${currentValue} ${flyingSymbol}` : flyingSymbol
      userFirstSets.value[targetSymbol] = newValue
    }
    return
  }

  const symbolRect = symbolElement.getBoundingClientRect()
  const targetRect = targetElement.getBoundingClientRect()

  // 添加飞行动画状态
  hintState.value.flyingSymbols.push({
    symbol: flyingSymbol,
    target: targetSymbol,
    x: symbolRect.left + symbolRect.width / 2,
    y: symbolRect.top + symbolRect.height / 2
  })

  // 等待一小段时间让元素出现
  await new Promise(resolve => setTimeout(resolve, 100))

  // 更新位置到目标位置
  const flyingSymbolData = hintState.value.flyingSymbols.find(fs => fs.symbol === flyingSymbol && fs.target === targetSymbol)
  if (flyingSymbolData) {
    flyingSymbolData.x = targetRect.left + targetRect.width / 2
    flyingSymbolData.y = targetRect.top + targetRect.height / 2
  }

  // 等待飞行动画完成
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 动画完成后自动填写（避免重复）
  const currentValue = userFirstSets.value[targetSymbol] || ''
  const currentSymbols = currentValue.split(' ').filter(s => s.trim())
  if (!currentSymbols.includes(flyingSymbol)) {
    const newValue = currentValue ? `${currentValue} ${flyingSymbol}` : flyingSymbol
    userFirstSets.value[targetSymbol] = newValue
  }

  // 清除飞行动画状态
  hintState.value.flyingSymbols = hintState.value.flyingSymbols.filter(
    fs => !(fs.symbol === flyingSymbol && fs.target === targetSymbol)
  )
}

// Follow集提示功能
const calculateFollowSetHint = (symbol: string) => {
  if (!originalData.value) return null

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

  // 规则1：开始符号S：# ∈ Follow(S)
  if (symbol === originalData.value.S) {
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
  // 规则3：产生式A→αB或A→αBβ且ε∈First(β)：Follow(A) ⊆ Follow(B)
  for (const [leftSymbol, rightParts] of Object.entries(originalData.value.formulas_dict)) {
    for (const rightPart of rightParts) {
      // 查找产生式中包含目标符号的位置
      for (let i = 0; i < rightPart.length; i++) {
        if (rightPart[i] === symbol) {
          // 检查是否是规则2：A→αBβ
          if (i < rightPart.length - 1) {
            const beta = rightPart.substring(i + 1)
            // 对于多字符的β，需要计算其First集
            const firstSetOfBeta = calculateStringFirstSet(beta)

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
              finalSymbols: originalData.value.follow[leftSymbol] || []
            })
          } else {
            // A→αBβ 的情况，需要检查ε∈First(β)
            const beta = rightPart.substring(i + 1)
            const firstSetOfBeta = calculateStringFirstSet(beta)

            if (firstSetOfBeta.includes('ε')) {
              result.steps.push({
                type: 'inclusion',
                description: `产生式${leftSymbol}→${rightPart}：ε∈First(${beta})，Follow(${leftSymbol}) ⊆ Follow(${symbol})`,
                productions: [`${leftSymbol}->${rightPart}`],
                rules: ['产生式A→αB或A→αBβ且ε∈First(β)：Follow(A) ⊆ Follow(B)'],
                symbols: [leftSymbol, symbol, ...firstSetOfBeta],
                finalSymbols: originalData.value.follow[leftSymbol] || []
              })
            }
          }
        }
      }
    }
  }

  return result
}

// 执行Follow集提示动画
const executeFollowHintAnimation = async (symbol: string) => {
  if (hintState.value.isActive) return

  const hintData = calculateFollowSetHint(symbol)
  if (!hintData || hintData.steps.length === 0) {
    console.log(`没有找到 ${symbol} 的Follow集推导规则`)
    return
  }

  hintState.value.isActive = true
  console.log(`执行 ${symbol} 的Follow集提示动画:`, hintData)

  // 逐个执行每个步骤
  for (const step of hintData.steps) {
    console.log(`执行步骤: ${step.description}`)

    // 高亮相关元素
    step.productions.forEach(prod => {
      productionHighlightState.value[prod] = true
    })
    step.rules.forEach(rule => {
      ruleHighlightState.value[rule] = true
    })
    step.symbols.forEach(sym => {
      symbolHighlightState.value[sym] = true
    })

    // 特殊处理：如果是production类型，需要高亮First集符号
    if (step.type === 'production' && step.firstSetSymbols) {
      step.firstSetSymbols.forEach(sym => {
        symbolHighlightState.value[sym] = true
      })
    }

    // 等待高亮显示
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 执行飞行动画
    for (const finalSymbol of step.finalSymbols) {
      await executeFollowFlyingAnimation(symbol, finalSymbol)
      // 等待一小段时间再执行下一个符号
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // 清除高亮
    step.productions.forEach(prod => {
      productionHighlightState.value[prod] = false
    })
    step.rules.forEach(rule => {
      ruleHighlightState.value[rule] = false
    })
    step.symbols.forEach(sym => {
      symbolHighlightState.value[sym] = false
    })
    if (step.firstSetSymbols) {
      step.firstSetSymbols.forEach(sym => {
        symbolHighlightState.value[sym] = false
      })
    }

    // 等待更长时间，让用户看清每个步骤
    await new Promise(resolve => setTimeout(resolve, 800))
  }

  // 清除所有高亮
  Object.keys(symbolHighlightState.value).forEach(key => {
    symbolHighlightState.value[key] = false
  })
  Object.keys(productionHighlightState.value).forEach(key => {
    productionHighlightState.value[key] = false
  })
  Object.keys(ruleHighlightState.value).forEach(key => {
    ruleHighlightState.value[key] = false
  })

  hintState.value.isActive = false
}

// 执行Follow集飞行动画
const executeFollowFlyingAnimation = async (targetSymbol: string, flyingSymbol: string) => {
  // 计算起始位置（符号区）和目标位置（Follow集答题框）
  const symbolElement = document.querySelector(`[data-symbol="${flyingSymbol}"]`) as HTMLElement
  const targetElement = document.querySelector(`[data-input="follow-${targetSymbol}"]`) as HTMLElement

  if (!symbolElement || !targetElement) {
    // 如果找不到元素，直接填写答案
    const currentValue = userFollowSets.value[targetSymbol] || ''
    const currentSymbols = currentValue.split(' ').filter(s => s.trim())
    if (!currentSymbols.includes(flyingSymbol)) {
      const newValue = currentValue ? `${currentValue} ${flyingSymbol}` : flyingSymbol
      userFollowSets.value[targetSymbol] = newValue
    }
    return
  }

  const symbolRect = symbolElement.getBoundingClientRect()
  const targetRect = targetElement.getBoundingClientRect()

  // 添加飞行动画状态
  hintState.value.flyingSymbols.push({
    symbol: flyingSymbol,
    target: `follow-${targetSymbol}`,
    x: symbolRect.left + symbolRect.width / 2,
    y: symbolRect.top + symbolRect.height / 2
  })

  // 等待一小段时间让元素出现
  await new Promise(resolve => setTimeout(resolve, 100))

  // 更新位置到目标位置
  const flyingSymbolData = hintState.value.flyingSymbols.find(
    fs => fs.symbol === flyingSymbol && fs.target === `follow-${targetSymbol}`
  )
  if (flyingSymbolData) {
    flyingSymbolData.x = targetRect.left + targetRect.width / 2
    flyingSymbolData.y = targetRect.top + targetRect.height / 2
  }

  // 等待飞行动画完成
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 动画完成后自动填写（避免重复）
  const currentValue = userFollowSets.value[targetSymbol] || ''
  const currentSymbols = currentValue.split(' ').filter(s => s.trim())
  if (!currentSymbols.includes(flyingSymbol)) {
    const newValue = currentValue ? `${currentValue} ${flyingSymbol}` : flyingSymbol
    userFollowSets.value[targetSymbol] = newValue
  }

  // 清除飞行动画状态
  hintState.value.flyingSymbols = hintState.value.flyingSymbols.filter(
    fs => !(fs.symbol === flyingSymbol && fs.target === `follow-${targetSymbol}`)
  )
}

// 初始化
onMounted(() => {
  if (originalData.value?.Vn) {
    originalData.value.Vn.forEach(symbol => {
      userFirstSets.value[symbol] = ''
      userFollowSets.value[symbol] = ''
      firstValidation.value[symbol] = ''
      followValidation.value[symbol] = ''
    })
  }
})
</script>

<style scoped>
/* 飞行动画样式 */
.flying-symbol {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  transition: all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translate(-50%, -50%);
}

/* 高亮动画 */
@keyframes highlight-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
}

.highlight-pulse {
  animation: highlight-pulse 1s ease-in-out infinite;
}

/* 符号高亮效果 */
.symbol-highlight {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.4);
  animation: highlight-pulse 1s ease-in-out infinite;
}

/* 产生式高亮效果 */
.production-highlight {
  background: linear-gradient(90deg, #fef3c7, #fed7aa);
  border: 2px solid #f59e0b;
  box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.2);
}

/* 规则高亮效果 */
.rule-highlight {
  background: linear-gradient(90deg, #dbeafe, #bfdbfe);
  border: 2px solid #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
}
</style>
