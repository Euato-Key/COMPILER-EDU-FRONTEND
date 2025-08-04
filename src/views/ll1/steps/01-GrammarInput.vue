<template>
  <div class="grammar-input-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:file-text" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">输入文法</h2>
          <p class="text-gray-600 mt-1">第一步：定义上下文无关文法规则</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <div class="max-w-4xl mx-auto">
        <!-- 文法输入区域 -->
        <div class="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-xl shadow-lg border border-blue-100 p-8 mb-8">
          <!-- 头部区域 -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:file-text" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  输入产生式
                </h3>
                <p class="text-sm text-gray-500 mt-1">定义上下文无关文法规则</p>
              </div>
            </div>
            <div class="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full">
              <Icon icon="lucide:info" class="w-4 h-4 text-blue-600" />
              <span class="text-sm font-medium text-blue-700">支持格式：A->α|β</span>
            </div>
          </div>

          <div class="space-y-6">
            <!-- 输入框区域 -->
            <div class="bg-white rounded-lg border border-blue-200 p-6 shadow-sm">
              <label class="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Icon icon="lucide:edit-3" class="w-4 h-4 text-blue-500" />
                文法规则
                <span class="text-red-500 text-lg">*</span>
                <span class="text-xs font-normal text-gray-500 ml-2">(每行一个产生式，使用单字符作为符号)</span>
              </label>
              <textarea
                v-model="grammarInput"
                placeholder="请输入文法产生式，例如：&#10;S->AB&#10;A->a|ε&#10;B->b"
                class="w-full h-36 px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-400 resize-y transition-all duration-200 font-mono text-sm bg-gradient-to-br from-gray-50 to-white"
                @input="handleInput"
              />
              <div class="mt-3 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2 text-gray-500">
                  <Icon icon="lucide:alert-triangle" class="w-3 h-3" />
                  <span>不支持中文字符，不能有重复产生式</span>
                </div>
                <div class="flex items-center gap-1 text-blue-600 font-medium">
                  <Icon icon="lucide:hash" class="w-3 h-3" />
                  <span>{{ grammarInput.length }} 字符</span>
                </div>
              </div>
            </div>

                        <!-- 规范提示区域 -->
            <div class="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-lg border border-amber-200 p-4 shadow-sm">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Icon icon="lucide:book-open" class="w-3 h-3 text-white" />
                </div>
                <h4 class="text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  重要规范
                </h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <!-- 左侧规范 -->
                <div class="space-y-2">
                  <div class="flex items-start gap-2 p-2 bg-white/60 rounded-md border border-amber-200/50">
                    <div class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon icon="lucide:play" class="w-2.5 h-2.5 text-blue-600" />
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-800 mb-0.5">开始符</p>
                      <p class="text-xs text-gray-600 leading-tight">第一个产生式的左侧大写字母为开始符</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-2 bg-white/60 rounded-md border border-amber-200/50">
                    <div class="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon icon="lucide:type" class="w-2.5 h-2.5 text-purple-600" />
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-800 mb-0.5">字符规定</p>
                      <p class="text-xs text-gray-600 leading-tight">每个符号必须是单个字符（如A、B、C，而非E1、id等）</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-2 bg-white/60 rounded-md border border-amber-200/50">
                    <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon icon="lucide:arrow-right" class="w-2.5 h-2.5 text-green-600" />
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-800 mb-0.5">产生式格式</p>
                      <p class="text-xs text-gray-600 leading-tight">必须为"大写字母->右部"格式（如：S->AB）</p>
                    </div>
                  </div>
                </div>

                <!-- 右侧规范 -->
                <div class="space-y-2">
                  <div class="flex items-start gap-2 p-2 bg-white/60 rounded-md border border-amber-200/50">
                    <div class="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon icon="lucide:list" class="w-2.5 h-2.5 text-indigo-600" />
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-800 mb-0.5">右部格式</p>
                      <p class="text-xs text-gray-600 leading-tight">可以是单个符号或由"|"分隔的多个候选式（如：A->a|ε）</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-2 bg-white/60 rounded-md border border-amber-200/50">
                    <div class="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon icon="lucide:ban" class="w-2.5 h-2.5 text-red-600" />
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-800 mb-0.5">限制条件</p>
                      <p class="text-xs text-gray-600 leading-tight">不能有左递归，每个非终结符必须有产生式定义</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-2 bg-white/60 rounded-md border border-amber-200/50">
                    <div class="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon icon="lucide:circle" class="w-2.5 h-2.5 text-pink-600" />
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-800 mb-0.5">ε符号</p>
                      <p class="text-xs text-gray-600 leading-tight">ε只能单独作为一个候选式，如G->+TG|ε是正确的</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 输入时错误提示 -->
            <div v-if="inputErrors.length > 0" class="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 shadow-lg">
              <div class="flex gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:alert-triangle" class="w-6 h-6 text-white" />
                </div>
                <div class="flex-1">
                  <p class="text-lg font-semibold text-red-800 mb-3">输入格式错误</p>
                  <div class="bg-white/60 rounded-lg p-4 border border-red-200">
                    <ul class="space-y-2">
                      <li v-for="error in inputErrors" :key="error" class="flex items-start gap-3 text-sm">
                        <Icon icon="lucide:x-circle" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span class="text-red-700">{{ error }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- 验证按钮 -->
            <div class="flex justify-center">
              <button
                @click="handleValidateGrammar"
                :disabled="!canValidate || isValidating"
                :class="[
                  'flex items-center gap-3 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105',
                  canValidate && !isValidating
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-md'
                ]"
              >
                <Icon
                  v-if="isValidating"
                  icon="lucide:loader-2"
                  class="w-5 h-5 animate-spin"
                />
                <Icon
                  v-else
                  icon="lucide:check-circle"
                  class="w-5 h-5"
                />
                <span>{{ isValidating ? '验证中...' : '验证文法' }}</span>
              </button>
            </div>

            <!-- 验证状态提示 -->
            <div v-if="validationStatus !== 'none'" class="rounded-xl p-6 border-2 shadow-lg">
              <!-- 准备验证状态 -->
              <div v-if="validationStatus === 'ready'" class="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div class="flex gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon icon="lucide:info" class="w-6 h-6 text-white" />
                  </div>
                  <div class="flex-1">
                    <p class="text-lg font-semibold text-blue-800 mb-2">{{ validationMessage }}</p>
                    <p class="text-blue-600">点击"验证文法"按钮进行深度校验</p>
                  </div>
                </div>
              </div>

              <!-- 验证成功状态 -->
              <div v-else-if="validationStatus === 'success'" class="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div class="flex gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon icon="lucide:check-circle" class="w-6 h-6 text-white" />
                  </div>
                  <div class="flex-1">
                    <p class="text-lg font-semibold text-green-800 mb-2">{{ validationMessage }}</p>
                    <p class="text-green-600 mb-4">可以进入下一步</p>
                    <div class="bg-white/60 rounded-lg p-4 border border-green-200">
                      <p class="text-sm font-semibold text-green-700 mb-3">文法信息：</p>
                      <div class="grid grid-cols-2 gap-3 text-sm">
                        <div class="flex items-center gap-2">
                          <Icon icon="lucide:play" class="w-4 h-4 text-blue-500" />
                          <span class="text-gray-700">开始符号：</span>
                          <span class="font-mono font-semibold text-blue-600">{{ originalData?.S || '未确定' }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <Icon icon="lucide:tag" class="w-4 h-4 text-purple-500" />
                          <span class="text-gray-700">非终结符：</span>
                          <span class="font-mono font-semibold text-purple-600">{{ originalData?.Vn?.join(', ') || '未确定' }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <Icon icon="lucide:hash" class="w-4 h-4 text-green-500" />
                          <span class="text-gray-700">终结符：</span>
                          <span class="font-mono font-semibold text-green-600">{{ originalData?.Vt?.join(', ') || '未确定' }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <Icon icon="lucide:list" class="w-4 h-4 text-orange-500" />
                          <span class="text-gray-700">产生式数量：</span>
                          <span class="font-mono font-semibold text-orange-600">{{ productions.length }} 个</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 验证失败状态 -->
              <div v-else-if="validationStatus === 'failed'" class="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                <div class="flex gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon icon="lucide:x-circle" class="w-6 h-6 text-white" />
                  </div>
                  <div class="flex-1">
                    <p class="text-lg font-semibold text-red-800 mb-2">{{ validationMessage }}</p>
                    <div v-if="submitErrors.length > 0" class="bg-white/60 rounded-lg p-4 border border-red-200">
                      <p class="text-sm font-semibold text-red-700 mb-3">具体错误：</p>
                      <ul class="space-y-2">
                        <li v-for="error in submitErrors" :key="error" class="flex items-start gap-2 text-sm">
                          <Icon icon="lucide:alert-circle" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span class="text-red-600">{{ error }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 示例文法 -->
        <div class="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-xl p-6 mb-6 border border-purple-100 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:book-open" class="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 class="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  示例文法
                </h4>
                <p class="text-xs text-gray-600 mt-0.5">点击卡片使用示例文法</p>
              </div>
            </div>
            <div class="flex items-center gap-2 px-2 py-1 bg-purple-100 rounded-full">
              <Icon icon="lucide:mouse-pointer" class="w-3 h-3 text-purple-600" />
              <span class="text-xs font-medium text-purple-700">点击使用示例</span>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="(example, index) in exampleGrammars"
              :key="index"
              class="bg-white rounded-lg p-4 border-2 border-purple-200 cursor-pointer hover:border-purple-400 hover:shadow-xl transition-all duration-300 group transform hover:scale-105"
              @click="useExample(example)"
            >
              <div class="flex items-center justify-between mb-3">
                <h5 class="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-pink-700">
                  {{ example.name }}
                </h5>
                <div class="w-6 h-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                <Icon
                  icon="lucide:copy"
                    class="w-3 h-3 text-purple-600 group-hover:text-purple-700 transition-colors"
                />
                </div>
              </div>
              <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-md p-3 border border-gray-200 mb-3">
                <pre class="text-xs text-gray-700 font-mono leading-tight whitespace-pre-wrap">{{
                example.grammar
              }}</pre>
              </div>
              <div class="pt-2 border-t border-gray-200">
                <span class="text-xs text-gray-600">{{ example.description }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分析结果 -->
        <div
          v-if="originalData"
          class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 shadow-xl"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:zap" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 class="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  当前文法分析结果
                </h4>
                <p class="text-xs text-gray-600 mt-0.5">LL(1)文法分析完成</p>
              </div>
            </div>
            <div class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg">
              <Icon icon="lucide:check-circle" class="w-3 h-3 text-white" />
              <span class="text-xs font-semibold text-white">LL(1)文法</span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 左侧统计信息 -->
            <div class="lg:col-span-1">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white rounded-lg p-4 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:play" class="w-4 h-4 text-white" />
                    </div>
                    <span class="text-sm font-semibold text-gray-800">起始符号</span>
              </div>
                  <p class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-mono">{{ originalData.S }}</p>
            </div>

                <div class="bg-white rounded-lg p-4 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:tag" class="w-4 h-4 text-white" />
                    </div>
                    <span class="text-sm font-semibold text-gray-800">非终结符</span>
              </div>
                  <p class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-mono">{{ originalData.Vn.length }}</p>
                  <p class="text-xs text-gray-600 mt-1 font-mono">{{ originalData.Vn.join(', ') }}</p>
            </div>

                <div class="bg-white rounded-lg p-4 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:hash" class="w-4 h-4 text-white" />
                    </div>
                    <span class="text-sm font-semibold text-gray-800">终结符</span>
              </div>
                  <p class="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-mono">{{ originalData.Vt.length }}</p>
                  <p class="text-xs text-gray-600 mt-1 font-mono">{{ originalData.Vt.join(', ') }}</p>
            </div>

                <div class="bg-white rounded-lg p-4 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:list" class="w-4 h-4 text-white" />
                    </div>
                    <span class="text-sm font-semibold text-gray-800">产生式数</span>
              </div>
                  <p class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent font-mono">
                {{ Object.keys(originalData.formulas_dict).length }}
              </p>
                </div>
            </div>
          </div>

            <!-- 右侧文法信息 -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg border-2 border-blue-200 p-4 shadow-lg h-full">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Icon icon="lucide:file-text" class="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 class="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      文法信息
                    </h5>
                    <p class="text-xs text-gray-500">Grammar Information</p>
                  </div>
                </div>
                <div class="space-y-1.5">
              <div
                v-for="(productions, nonTerminal) in originalData.formulas_dict"
                :key="nonTerminal"
                    class="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-md border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-200"
                  >
                    <span class="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-mono">{{ nonTerminal }}</span>
                    <span class="text-gray-400 font-mono text-sm">→</span>
                    <span class="font-mono text-gray-700 text-xs flex-1">{{ productions.join(' | ') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button
          disabled
          class="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-400 rounded-lg cursor-not-allowed"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4" />
          <span>上一步</span>
        </button>
        <div class="text-sm text-gray-500">步骤 1 / 4</div>
        <button
          @click="handleNextStep"
          :disabled="!canProceed"
          :class="[
            'flex items-center gap-2 px-6 py-2 rounded-lg transition-colors',
            canProceed
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          <span>下一步</span>
          <Icon icon="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { useLL1Store } from '@/stores/ll1'

// 获取 Store 实例
const ll1Store = useLL1Store()

// 解构响应式状态（用于模板绑定）
const { productions, originalData } = storeToRefs(ll1Store)

// 定义 emits
const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

// 本地状态
const grammarInput = ref('')
const inputErrors = ref<string[]>([])
const submitErrors = ref<string[]>([])
const isValidating = ref(false)
const validationStatus = ref<'none' | 'ready' | 'success' | 'failed'>('none')
const validationMessage = ref('')

// 计算属性
const canValidate = computed(() => inputErrors.value.length === 0 && grammarInput.value.trim().length > 0)
const canProceed = computed(() => {
  return validationStatus.value === 'success' && productions.value.length > 0 && originalData.value !== null
})

// 示例文法数据
const exampleGrammars = [
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

// 输入时基础校验
function validateOnInput(text: string): string[] {
  const errors: string[] = []

  // 检查是否有中文
  if (/[\u4e00-\u9fa5]/.test(text)) {
    errors.push('不能包含中文字符')
  }

  // 检查每一行（非空行）是否包含->
  const lines = text.split('\n')
  lines.forEach((line, idx) => {
    if (line.trim() && !line.includes('->')) {
      errors.push(`第${idx + 1}行缺少->`)
    }
  })

  return errors
}

// 点击按钮后的深度校验
function validateOnSubmit(text: string): string[] {
  const errors: string[] = []

  // 1. 检查是否为空
  if (!text.trim()) {
    errors.push('文法不能为空')
    return errors
  }

  // 2. 检查是否有中文
  if (/[\u4e00-\u9fa5]/.test(text)) {
    errors.push('不能包含中文字符')
    return errors
  }

  // 3. 去除所有空格（保留换行符）
  const noSpaceText = text.replace(/ +/g, '')

  // 4. 进行分割
  const lines = noSpaceText.split('\n').filter(line => line.trim())

  // 5. 检查是否分割后每一行含有->
  lines.forEach((line, idx) => {
    if (!line.includes('->')) {
      errors.push(`第${idx + 1}行缺少->`)
    }
  })

  if (errors.length > 0) return errors

  // 6. 检查重复项（行）
  const lineSet = new Set(lines)
  if (lineSet.size !== lines.length) {
    errors.push('存在重复产生式')
    return errors
  }

  // 7. 检查是否符合产生式要求
  lines.forEach((line, idx) => {
    // 检查格式：X->Y，其中X为大写字母，Y为任意字符（除|）和|分隔的序列
    if (!/^([A-Z])->((?:[^|]+\|)*[^|]+)$/.test(line)) {
      errors.push(`第${idx + 1}行格式错误，应为"大写字母->右部"格式`)
    }
  })

  if (errors.length > 0) return errors

  // 8. 检查非终结符是否有候选式
  const leftNonTerminals = new Set(lines.map(line => line.split('->')[0]))
  const allNonTerminals = new Set<string>()

  // 收集所有右部出现的非终结符
  lines.forEach(line => {
    const right = line.split('->')[1]
    const rightParts = right.split('|')
    rightParts.forEach(part => {
      // 检查整个右部字符串中的所有大写字母（非终结符）
      for (let i = 0; i < part.length; i++) {
        if (/[A-Z]/.test(part[i])) {
          allNonTerminals.add(part[i])
        }
      }
    })
  })

  // 检查右部的非终结符是否都有定义
  allNonTerminals.forEach(nonTerminal => {
    if (!leftNonTerminals.has(nonTerminal)) {
      errors.push(`右部非终结符${nonTerminal}未定义`)
    }
  })

  if (errors.length > 0) return errors

  // 9. 检查是否含有左递归
  lines.forEach((line, idx) => {
    const [left, right] = line.split('->')
    const rightParts = right.split('|')
    rightParts.forEach(part => {
      if (part[0] === left) {
        errors.push(`第${idx + 1}行存在左递归`)
      }
    })
  })

  if (errors.length > 0) return errors

  // 10. 检查ε符号
  lines.forEach((line, idx) => {
    const [, right] = line.split('->')
    const rightParts = right.split('|')
    rightParts.forEach(part => {
      if (part.includes('ε') && part !== 'ε') {
        errors.push(`第${idx + 1}行：ε只能单独作为一个候选式`)
      }
    })
  })

  if (errors.length > 0) return errors

    // 11. 检查终结符连续出现
  lines.forEach((line, idx) => {
    const [, right] = line.split('->')
    const rightParts = right.split('|')
    rightParts.forEach(part => {
      // 跳过ε
      if (part === 'ε') return

      // 检查是否有连续的终结符（除了大写字母、|、空格、非终结符以外的字符）
      for (let i = 0; i < part.length - 1; i++) {
        const current = part[i]
        const next = part[i + 1]

        // 如果当前字符和下一个字符都不是大写字母、|、空格，则可能是连续的终结符
        const isCurrentTerminal = !/[A-Z| ]/.test(current)
        const isNextTerminal = !/[A-Z| ]/.test(next)

        if (isCurrentTerminal && isNextTerminal) {
          errors.push(`第${idx + 1}行：终结符不能连续出现，如"${current}${next}"`)
          return // 一个候选式中只报一次错误
        }
      }
    })
  })

  return errors
}

// 处理输入变化
function handleInput() {
  inputErrors.value = validateOnInput(grammarInput.value)

  // 根据输入状态更新验证状态
  if (inputErrors.value.length > 0) {
    validationStatus.value = 'none'
    validationMessage.value = ''
  } else if (grammarInput.value.trim()) {
    validationStatus.value = 'ready'
    validationMessage.value = '符合文法验证条件：可以进行文法验证'
  } else {
    validationStatus.value = 'none'
    validationMessage.value = ''
  }

  // 清除提交错误
  submitErrors.value = []
}

// 处理验证文法按钮点击
async function handleValidateGrammar() {
  if (!canValidate.value || isValidating.value) return

  submitErrors.value = []
  isValidating.value = true
  validationStatus.value = 'none'
  validationMessage.value = ''

  try {
    // 深度校验
    const errors = validateOnSubmit(grammarInput.value)
    if (errors.length > 0) {
      submitErrors.value = errors
      validationStatus.value = 'failed'
      validationMessage.value = '不符合文法验证条件：' + errors.join('；')
      return
    }

    // 处理输入：去除空格，分割
    const noSpaceText = grammarInput.value.replace(/ +/g, '')
    const processedLines = noSpaceText.split('\n').filter(line => line.trim())

    // 提交后端
    const success = await ll1Store.performLL1Analysis(processedLines)

    // 检查后端验证结果
    if (success && ll1Store.isLL1Grammar === true) {
      // 后端验证通过，存储用户输入和后端数据
      ll1Store.setProductions(processedLines)
      validationStatus.value = 'success'
      validationMessage.value = '文法验证成功：符合LL(1)文法规范'
      // 清除错误
      submitErrors.value = []
    } else {
      // 后端验证失败
      validationStatus.value = 'failed'
      validationMessage.value = '文法验证失败：不符合LL(1)文法要求'
      submitErrors.value = ['后端验证失败：不符合LL(1)文法要求']
    }
  } catch (error) {
    console.error('验证失败:', error)
    validationStatus.value = 'failed'
    validationMessage.value = '文法验证失败：验证过程中发生错误，请重试'
    submitErrors.value = ['验证过程中发生错误，请重试']
  } finally {
    isValidating.value = false
  }
}

// 使用示例文法
function useExample(example: { name: string; grammar: string; description: string }) {
  grammarInput.value = example.grammar
  // 触发输入校验
  handleInput()
  // 重置验证状态
  validationStatus.value = 'none'
  validationMessage.value = ''
  submitErrors.value = []
}

// 处理下一步
function handleNextStep() {
  if (canProceed.value) {
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
    emit('next-step')
  }
}

// 监听grammarInput变化，同步到store（用于显示）
watch(grammarInput, (newValue) => {
  if (newValue.trim()) {
    const lines = newValue.split('\n').filter(line => line.trim())
    ll1Store.setProductions(lines)
    } else {
    ll1Store.setProductions([])
  }
})
</script>

<style scoped>
.step-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
}

.step-content {
  padding: 2rem;
  margin-bottom: 2rem;
}

.step-actions {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.step-icon {
  width: 3rem;
  height: 3rem;
  background-color: #dcfce7;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
