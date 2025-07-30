<script setup lang="ts">
import {
  ref,
  type Ref,
  type CSSProperties,
  type PropType,
  computed,
  watch,
  nextTick,
  onMounted,
} from 'vue'
import {
  VueFlow,
  Handle,
  Position,
  useVueFlow,
  MarkerType,
  getBezierPath,
  type NodeChange,
} from '@vue-flow/core'
import { Icon } from '@iconify/vue'
// 移除Element Plus消息组件，避免样式冲突
import FA_customEdge from './FA_custom-edge.vue'

const {
  onConnect,
  addEdges,
  addNodes,
  onNodeClick,
  onEdgeClick,
  findNode,
  findEdge,
  getNodes,
  getEdges,
  onNodesChange,
  onEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  updateEdge,
  onEdgeUpdate,
  onPaneReady,
  setViewport,
  removeNodes,
  screenToFlowCoordinate,
  vueFlowRef,
} = useVueFlow()

// 添加初态标记
const props = defineProps({
  FA_type: {
    type: String,
    required: true,
  },
})

const nodes = ref([
  {
    id: 'state1',
    data: {
      text: '0',
      isInitial: false,
      isFinal: false,
    },
    type: 'custom',
    position: { x: 50, y: 50 },
    label: '0',
  },
])
const edges = ref([])
addNodes(nodes.value)
addEdges(edges.value)

// 设置初态的方法
const setInitialState = () => {
  const selectedNodes = getNodes.value.filter((node) => node.selected)

  if (props.FA_type === 'DFA' || props.FA_type === 'Min_DFA') {
    if (selectedNodes.length == 1) {
      // 清除之前的初态
      getNodes.value.forEach((node) => {
        node.data.isInitial = false
      })
      // 设置新的初态
      selectedNodes[0].data.isInitial = true
      selectedNodes[0].data.isFinal = false
      selectedNodes[0].selected = false
    } else {
      // 移除消息提示，避免样式冲突
      console.log('DFA只有一个初态!')
    }
  } else if (props.FA_type === 'NFA') {
    if (selectedNodes) {
      // 设置新的初态
      selectedNodes.forEach((node) => {
        node.data.isInitial = true
        node.data.isFinal = false
        node.selected = false
      })
    }
  }
}
// 设置终态的方法
const setFinalState = () => {
  const selectedNodes = getNodes.value.filter((node) => node.selected)
  selectedNodes.forEach((node) => {
    node.selected = false

    if (node.data.isFinal) return
    node.data.isFinal = true
    node.data.isInitial = false
  })
}

const addStates = () => {
  // 提取所有已使用的编号
  // 过滤非数字 + 去重 + 排序
  const usedNumbers = Array.from(
    new Set(
      getNodes.value
        .map((node) => {
          const num = Number(node.data.text)
          // console.log(num)
          return isNaN(num) ? null : num
        })
        .filter((num): num is number => num !== null),
    ),
  ) // 显式断言num is number
    .sort((a, b) => a - b)
  // 暴力法找到最小的未被使用的编号
  // let newNumber = 0;
  // for (let i = 0; i < usedNumbers.length; i++) {
  //   if (usedNumbers[i] !== i) {
  //     newNumber = i;
  //     break;
  //   }
  //   newNumber = i + 1; // 如果所有编号都被使用，则使用下一个编号
  // }
  // console.log(usedNumbers)

  // 二分查找最小的未被使用的编号
  let left = 0
  let right = usedNumbers.length
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (usedNumbers[mid] === mid) {
      // 说明 0 到 mid 都被使用
      left = mid + 1
    } else {
      right = mid
    }
  }
  const newNumber = left

  // console.log(newNumber)
  addNodes({
    id: 'state' + Date.now(),
    data: {
      text: newNumber.toString(), // 使用找到的编号
      isInitial: false,
      isFinal: false,
    },
    position: { x: Math.random() * 400, y: Math.random() * 200 },
    type: 'custom',
  })
}
const reset = () => {
  // 直接重置，不显示确认对话框
  nodes.value = [
    {
      id: 'state1',
      data: {
        text: '0',
        isInitial: false,
        isFinal: false,
      },
      type: 'custom',
      position: { x: 50, y: 50 },
      label: '0',
    },
  ]
  edges.value = []
  setViewport({ x: 0, y: 0, zoom: 2 })

  // 移除消息提示，避免样式冲突
  console.log('画布已重置')
}
onPaneReady((instance) => {
  setViewport({ x: 0, y: 0, zoom: 2 })

  instance.fitView()
  // console.log(instance.getViewport())
})

const neighbar_handle: Record<string, string[]> = {
  // 相邻的handle
  a: ['b', 'd'],
  b: ['a', 'c'],
  c: ['b', 'e'],
  d: ['a', 'f'],
  e: ['c', 'h'],
  f: ['d', 'g'],
  g: ['f', 'h'],
  h: ['e', 'g'],
}

onConnect((params) => {
  // 创建连线
  console.log(params)
  // 如果源节点和目标节点相同，且源节点和目标节点的handle相邻，则不创建连线
  if (
    params.source == params.target &&
    neighbar_handle[params.sourceHandle as string].includes(params.targetHandle as string)
  ) {
    return
  }
  const newEdge = {
    ...params,
    id:
      'vueflow__edge-' +
      params.source +
      params.sourceHandle +
      '-' +
      params.target +
      params.targetHandle,
    type: 'button',
    data: {
      text: '',
    },
    markerEnd: {
      type: MarkerType.Arrow,
      width: 25,
      height: 25,
      color: '#ff0072',
      strokeWidth: 1,
    },
    updatable: true,
  }
  addEdges([newEdge])
})

onEdgeUpdate((params) => {
  // 更换箭头指向
  updateEdge(params.edge, params.connection)
})

onNodeClick((params) => {
  // console.log('click')
  // console.log(params)
  // params.selected = true // 有自己的选择样式
})

// 双击画布添加节点
const handlePaneDoubleClick = (event: Event) => {
  const mouseEvent = event as MouseEvent
  console.log('FA_vueflow 双击事件触发', mouseEvent)

  // 阻止事件冒泡
  event.preventDefault()
  event.stopPropagation()

  // 获取点击位置相对于画布的坐标
  const flowContainer = (event.target as HTMLElement).closest('.vue-flow')
  if (!flowContainer) {
    console.warn('未找到 .vue-flow 容器')
    return
  }

  // 检查是否点击在节点或边上，如果是则不创建新节点
  const clickedElement = event.target as HTMLElement
  if (clickedElement.closest('.vue-flow__node') || clickedElement.closest('.vue-flow__edge')) {
    console.log('点击在节点或边上，不创建新节点')
    return
  }

  try {
    // 使用 screenToFlowCoordinate 转换坐标
    const position = screenToFlowCoordinate({
      x: mouseEvent.clientX,
      y: mouseEvent.clientY,
    })

    console.log('转换后的坐标:', position)
    addNodeAtPosition(position.x, position.y)
  } catch (error) {
    console.error('坐标转换失败:', error)

    // 备用方案：使用相对坐标
    const rect = flowContainer.getBoundingClientRect()
    const position = {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top,
    }

    console.log('使用备用坐标:', position)
    addNodeAtPosition(position.x, position.y)
  }
}

// 在指定位置添加节点
const addNodeAtPosition = (x: number, y: number) => {
  // 提取所有已使用的编号
  const usedNumbers = Array.from(
    new Set(
      getNodes.value
        .map((node) => {
          const num = Number(node.data.text)
          return isNaN(num) ? null : num
        })
        .filter((num): num is number => num !== null),
    ),
  ).sort((a, b) => a - b)

  // 二分查找最小的未被使用的编号
  let left = 0
  let right = usedNumbers.length
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (usedNumbers[mid] === mid) {
      left = mid + 1
    } else {
      right = mid
    }
  }
  const newNumber = left

  // 添加节点到指定位置
  addNodes({
    id: 'state' + Date.now(),
    data: {
      text: newNumber.toString(),
      isInitial: false,
      isFinal: false,
    },
    position: { x, y },
    type: 'custom',
  })
}

// 使用 watch 监听 VueFlow 实例，自动绑定双击事件
watch(
  () => vueFlowRef.value,
  (vueFlowInstance) => {
    if (!vueFlowInstance) return

    console.log('FA_vueflow VueFlow 实例已准备，绑定双击事件')

    // 查找 pane 元素
    const paneElement = vueFlowInstance.querySelector('.vue-flow__pane')
    if (paneElement) {
      // 移除可能存在的旧事件监听器
      paneElement.removeEventListener('dblclick', handlePaneDoubleClick)

      // 添加新的双击事件监听器
      paneElement.addEventListener('dblclick', handlePaneDoubleClick)

      console.log('FA_vueflow 双击事件监听器已通过 watch 绑定')
    } else {
      console.warn('未找到 .vue-flow__pane 元素')
    }
  },
  {
    immediate: true, // 立即执行一次
    flush: 'post', // 在 DOM 更新后执行
  },
)

// 移除事件监听器，现在使用直接按钮调用

// 组件挂载时的额外设置
onMounted(() => {
  // 额外的防护：禁用整个文档的双击选择文本行为
  document.addEventListener('selectstart', (e) => {
    if ((e.target as HTMLElement).closest('.vue-flow')) {
      e.preventDefault()
    }
  })
})

// 暴露方法给父组件
defineExpose({
  getNodes: () => getNodes.value,
  getEdges: () => getEdges.value,
  addStates,
  reset,
  setInitialState,
  setFinalState,
})
</script>

<template>
  <div class="fa-flow-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <button class="tool-btn add-node" @click="addStates" title="添加节点">
        <Icon icon="material-symbols:add" class="icon" />
        <span class="text">添加节点</span>
      </button>
      <button class="tool-btn set-initial" @click="setInitialState" title="设置初态">
        <Icon icon="material-symbols:play-arrow" class="icon" />
        <span class="text">设置初态</span>
      </button>
      <button class="tool-btn set-final" @click="setFinalState" title="设置终态">
        <Icon icon="material-symbols:circle" class="icon" />
        <span class="text">设置终态</span>
      </button>
      <button class="tool-btn reset-canvas" @click="reset" title="重置画布">
        <Icon icon="material-symbols:refresh" class="icon" />
        <span class="text">重置画布</span>
      </button>
    </div>

    <div id="FA_flow_wrapper">
      <!-- 双击提示 -->
      <div class="double-click-hint">
        <span class="hint-text">💡 双击画布添加节点</span>
      </div>

      <VueFlow
        :nodes="nodes"
        :edges="edges"
        class="FA_flow"
        fit-view-on-init
        :default-viewport="{ x: 0, y: 0, zoom: 1 }"
        :min-zoom="0.1"
        :max-zoom="4"
        :zoom-on-double-click="false"
        :pan-on-drag="true"
        :zoom-on-scroll="true"
      >
        <template #node-custom="customNodeProps">
          <div
            id="state"
            :class="{
              active: customNodeProps.selected,
              initial: customNodeProps.data.isInitial,
              final: customNodeProps.data.isFinal,
            }"
          >
            <input id="state_id" type="text" v-model="customNodeProps.data.text" />
            <Handle id="a" type="source" :position="Position.Top" style="left: 15%; top: 20%" />
            <Handle id="b" type="source" :position="Position.Top" style="left: 50%" />
            <Handle id="c" type="source" :position="Position.Top" style="left: 85%; top: 20%" />
            <Handle id="d" type="source" :position="Position.Left" style="top: 50%" />
            <Handle id="e" type="source" :position="Position.Right" style="top: 50%" />
            <Handle
              id="f"
              type="source"
              :position="Position.Bottom"
              style="left: 15%; bottom: 20%"
            />
            <Handle id="g" type="source" :position="Position.Bottom" style="left: 50%" />
            <Handle
              id="h"
              type="source"
              :position="Position.Bottom"
              style="left: 85%; bottom: 20%"
            />
          </div>
        </template>
        <template #edge-button="customEdgeProps">
          <FA_customEdge
            :id="customEdgeProps.id"
            :source-x="customEdgeProps.sourceX"
            :source-y="customEdgeProps.sourceY"
            :target-x="customEdgeProps.targetX"
            :target-y="customEdgeProps.targetY"
            :source-position="customEdgeProps.sourcePosition"
            :target-position="customEdgeProps.targetPosition"
            :source-handle-id="customEdgeProps.sourceHandleId as string"
            :target-handle-id="customEdgeProps.targetHandleId as string"
            :source-node="customEdgeProps.sourceNode"
            :target-node="customEdgeProps.targetNode"
            :marker-end="customEdgeProps.markerEnd"
            :style="customEdgeProps.style"
            v-model:edgeLabel="customEdgeProps.data.text"
          />
        </template>
      </VueFlow>
    </div>
  </div>
</template>

<style lang="scss">
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';

/* 自定义Vue Flow样式以适配容器 */
.vue-flow {
  background-color: #f8fbff;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.vue-flow__viewport {
  background-color: #f8fbff;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.vue-flow__pane {
  background:
    linear-gradient(90deg, #e8f4fd 1px, transparent 1px),
    linear-gradient(0deg, #e8f4fd 1px, transparent 1px);
  background-size: 20px 20px;
  background-color: #f8fbff;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.vue-flow__handle {
  // Handle样式
  width: 4px; /* 改变大小 */
  height: 4px; /* 改变大小 */
  background-color: #34495e; /* 改变颜色 */
  border: 1px solid #ffffff;
  box-shadow: 0 1px 3px rgba(52, 73, 94, 0.4);
}

/* 容器样式 */
.fa-flow-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
}

/* 工具栏样式 - 现在在画布外面 */
.toolbar {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 按钮样式 */
.tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  .icon {
    font-size: 14px;
    font-weight: bold;
  }

  .text {
    font-size: 12px;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &.add-node {
    background: linear-gradient(135deg, #4caf50, #45a049);
  }

  &.set-initial {
    background: linear-gradient(135deg, #2196f3, #1976d2);
  }

  &.set-final {
    background: linear-gradient(135deg, #9c27b0, #7b1fa2);
  }

  &.reset-canvas {
    background: linear-gradient(135deg, #f44336, #d32f2f);
  }
}

#FA_flow_wrapper {
  position: relative;
  width: 100%;
  flex: 1;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8fbff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* 双击提示样式 */
  .double-click-hint {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    background: rgba(52, 152, 219, 0.9);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    animation: fadeInOut 3s ease-in-out infinite;
  }

  @keyframes fadeInOut {
    0%,
    100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
  }

  .hint-text {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .FA_flow {
    height: 100%;
    width: 100%;
    position: relative;
  }
  #state {
    border: 2px solid #2c3e50;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(44, 62, 80, 0.2);
    position: relative; /*建立堆叠上下文 */
    z-index: 0; /* 重置基准层级*/
    display: flex;
    align-items: center;
    justify-content: center;

    &.initial {
      border: 3px solid rgb(224, 93, 93) !important;
    }
    &.final {
      border: 5px double rgb(224, 93, 93) !important;
    }
    &.active {
      /*节点被选中active*/
      border: none !important;
    }
    &.active::before,
    &.active::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 3px solid rgb(227, 152, 4);
      transition: all 0.5s;
      border-radius: 50%;
      animation: clippath 3s infinite linear;
    }
    &.active::after {
      animation: clippath 3s infinite -1.5s linear;
    }
    @keyframes clippath {
      0%,
      100% {
        clip-path: inset(0 0 95% 0);
        opacity: 0.5;
      }
      25% {
        clip-path: inset(0 95% 0 0);
        opacity: 1;
      }
      50% {
        clip-path: inset(95% 0 0 0);
        opacity: 0.5;
      }
      75% {
        clip-path: inset(0 0 0 95%);
        opacity: 1;
      }
    }
    #state_id {
      width: 90%;
      border: none;
      text-align: center;
      background-color: #f8f9fa;
      border-radius: 40%;
      color: #2c3e50;
      font-weight: 600;
      z-index: 1;
      position: relative;
      font-size: 12px;
      line-height: 1.2;
      padding: 2px 0;
      margin: 0;
    }
    #state_id:focus {
      outline: none;
      background-color: #ffffff;
      box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
    }

    &:hover {
      box-shadow: 0 4px 12px rgba(44, 62, 80, 0.3);
      transform: translateY(-1px);
      transition: all 0.3s ease;
    }
  }
}
</style>
